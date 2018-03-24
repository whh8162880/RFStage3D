///<reference path="../core/ClassUtils.ts" />
module rf
{
	export interface IEventDispatcherX{
		addEventListener(type:string, listener:Function,priority?:number):void;
		removeEventListener(type:string, listener:Function):void;
		hasEventListener?(type:string):boolean;
		dispatchEvent(event:EventX):boolean;
		simpleDispatch?(type:string,data?:any,bubbles?:boolean):boolean;
	}


	export class EventX implements IRecyclable{
		public type:string = undefined;
		public data:any = undefined;
		public bubbles:boolean = false;
		public target:IEventDispatcherX = undefined;
		public currentTarget:IEventDispatcherX = undefined;

		public stopPropagation:boolean = false;
		public stopImmediatePropagation:boolean = false;

		constructor(type?:string,data?:any,bubbles?:boolean){
			this.type = type;
			this.data = data;
			this.bubbles = bubbles;
		}

		public onRecycle():void{
			this.data = undefined;
			this.type = undefined;
			this.target = undefined;
			this.currentTarget = undefined;
			this.bubbles = false;
			this.stopPropagation = false;
			this.stopImmediatePropagation = false;
		}
	}

	/**
	 * 
	 * @author crl
	 * 
	 */	
	export class MiniDispatcher implements IEventDispatcherX,IRecyclable
	{
		public mEventListeners:Object;
		public mTarget:IEventDispatcherX;

		/** Creates an EventDispatcher. */
		constructor(target:IEventDispatcherX=null)
		{
			if(target==null){
				target=this;
			}
			this.mTarget=target;
		}
		
		/** Registers an event listener at a certain object. */
		public addEventListener(type:string, listener:Function,priority:number=0):void
		{
			if (undefined == this.mEventListeners){
				this.mEventListeners = {};
			}	
			var signal:Link = this.mEventListeners[type];
			if (signal == null){
				signal = this.mEventListeners[type] = recyclable(Link);
			}
			
			signal.addByWeight(listener,priority);
		}
		
		/** Removes an event listener from the object. */
		public removeEventListener(type:string, listener:Function):void
		{
			if (undefined == this.mEventListeners)
			{
				var signal:Recyclable<Link> = this.mEventListeners[type];
				if (undefined == signal) return;
				signal.remove(listener);
				if(0 >= signal.length){
					signal.recycle();
				}
			}
		}
		
		/** Removes all event listeners with a certain type, or all of them if type is null. 
		 *  Be careful when removing all event listeners: you never know who else was listening. */
		public removeEventListeners(type:string=undefined):void
		{
			var signal:Recyclable<Link>;

			if (type && this.mEventListeners){
				signal = this.mEventListeners[type];
				if(undefined != signal){
					signal.recycle();
				}
				delete this.mEventListeners[type];
			}else if(this.mEventListeners){
				for(type in this.mEventListeners){
					signal = this.mEventListeners[type];
					if(undefined != signal){
						signal.recycle();
					}
				}
				this.mEventListeners = undefined
			}
		}
		
		/** Dispatches an event to all objects that have registered listeners for its type. 
		 *  If an event with enabled 'bubble' property is dispatched to a display object, it will 
		 *  travel up along the line of parents, until it either hits the root object or someone
		 *  stops its propagation manually. */
		public dispatchEvent(event:EventX):boolean
		{
			if (undefined == this.mEventListeners || false == (event.type in this.mEventListeners)){
				return false;
			}
			if(undefined == event.target){
				event.target = this.mTarget;
			}

			event.currentTarget = this.mTarget;
			let signal:Link = this.mEventListeners[event.type];
			let vo:LinkVO = signal.getFrist();
			while(vo){
				if(event.stopPropagation){
					break;
				}
				if(false == vo.close){
					let f:Function = vo.data;
					if(undefined != f){
						f(event);
					}
				}
				vo = vo.next;
			}

			return event.stopPropagation;
		}
	
		public simpleDispatch(type:string,data:any = undefined,bubbles:boolean = false):boolean
		{
			if(undefined == this.mEventListeners || false == (type in this.mEventListeners)){
				return false;
			}

			let event:Recyclable<EventX> = recyclable(EventX);
			event.type = type;
			event.data = data;
			event.bubbles = bubbles;
			let bool:boolean=this.dispatchEvent(event);
			event.recycle();
			return bool;
		}
		
		/** Returns if there are listeners registered for a certain event type. */
		public hasEventListener(type:string):boolean
		{
			if(undefined == this.mEventListeners){
				return false;
			}
			let signal:Link = this.mEventListeners[type];
			if(undefined == signal || 0 >= signal.length){
				return false;
			}

			return true;
		}
		
		public onRecycle():void{
			this.removeEventListeners();
		}
	}
}