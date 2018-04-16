///<reference path="../core/ClassUtils.ts" />
module rf {
	export interface IEventDispatcherX {
		on(type: string|number, listener: Function, thisObject?: any, priority?: number): void;
		off(type: string|number, listener: Function): void;
		has?(type: string|number): boolean;
		dispatchEvent(event: EventX): boolean;
		simpleDispatch?(type: string|number, data?: any, bubbles?: boolean): boolean;
	}


	export enum EventT {
		ENTER_FRAME=1,
		RESIZE,
		COMPLETE,
		FAILED,
		CONTEXT3D_CREATE,
		CHANGE,
		CANCEL,
		SCROLL,
		OPEN,
		CLOSE,
		SELECT,
		DISPOSE,
		DATA,
		ERROR,
		PROGRESS,
		IO_ERROR,
		MESSAGE,
		RECYCLE
	}
	export enum MouseEventX {
		MouseDown = 50,
		MouseRightDown,
		MouseMiddleDown,
		MouseUp,
		MouseRightUp,
		MouseMiddleUp,
		CLICK,
		RightClick,
		middleClick,
		MouseWheel,
		MouseMove,
		
	}

	export class MouseEventData implements IRecyclable{
		constructor(id?:number){
			this.id = id;
		}
		id:number;
		x:number;
		y:number;
		dx:number;
		dy:number;
		ctrl:boolean;
		shift:boolean;
		alt:boolean;
		wheel:number;

		onRecycle(){
			this.ctrl = this.shift = this.alt = false;
			this.wheel = this.dx = this.dy = this.x = this.y = this.id = 0;
		}

	}


	export class EventX implements IRecyclable {
		public type: string|number = undefined;
		public data: any;
		public bubbles: boolean;
		public target: IEventDispatcherX;
		public currentTarget: IEventDispatcherX;

		public stopPropagation: boolean;
		public stopImmediatePropagation: boolean;

		constructor(type?: string|number, data?: any, bubbles?: boolean) {
			this.type = type;
			this.data = data;
			this.bubbles = bubbles;
		}

		public onRecycle(): void {
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
	export class MiniDispatcher implements IEventDispatcherX, IRecyclable {
		public mEventListeners: Object;
		public mTarget: IEventDispatcherX;

		/** Creates an EventDispatcher. */
		constructor(target: IEventDispatcherX = null) {
			if (target == null) {
				target = this;
			}
			this.mTarget = target;
		}

		/** Registers an event listener at a certain object. */
		
		on(type: string|number, listener: Function, thisObject: any, priority: number = 0): void {
			if (undefined == this.mEventListeners) {
				this.mEventListeners = {};
			}
			var signal: Link = this.mEventListeners[type];
			if (signal == null) {
				signal = this.mEventListeners[type] = recyclable(Link);
			}

			signal.addByWeight(listener, priority, thisObject);
		}

		/** Removes an event listener from the object. */
		off(type: string|number, listener: Function): void {
			if (undefined != this.mEventListeners) {
				var signal: Recyclable<Link> = this.mEventListeners[type];
				if (undefined == signal) return;
				signal.remove(listener);
				if (0 >= signal.length) {
					signal.recycle();
					this.mEventListeners[type] = undefined;
				}
			}
		}
		/** Removes all event listeners with a certain type, or all of them if type is null. 
		 *  Be careful when removing all event listeners: you never know who else was listening. */
		public removeEventListeners(type: string = undefined): void {
			var signal: Recyclable<Link>;

			if (type && this.mEventListeners) {
				signal = this.mEventListeners[type];
				if (undefined != signal) {
					signal.recycle();
					this.mEventListeners[type] = undefined;
				}
				delete this.mEventListeners[type];
			} else if (this.mEventListeners) {
				for (type in this.mEventListeners) {
					signal = this.mEventListeners[type];
					if (undefined != signal) {
						signal.recycle();
						this.mEventListeners[type] = undefined;
					}
				}
				this.mEventListeners = undefined
			}
		}

		/** Dispatches an event to all objects that have registered listeners for its type. 
		 *  If an event with enabled 'bubble' property is dispatched to a display object, it will 
		 *  travel up along the line of parents, until it either hits the root object or someone
		 *  stops its propagation manually. */
		public dispatchEvent(event: EventX): boolean {
			if (undefined == this.mEventListeners || undefined == this.mEventListeners[event.type]) {
				return false;
			}

			event.currentTarget = this.mTarget;
			let signal: Link = this.mEventListeners[event.type];
			let vo: LinkVO = signal.getFrist();
			while (vo) {
				if (event.stopPropagation || event.stopImmediatePropagation) {
					break;
				}
				if (false == vo.close) {
					let f: Function = vo.data;
					if (undefined != f) {
						f.call(vo.args, event);
						// f(vo.args,event);
					}
				}
				vo = vo.next;
			}

			return false == event.stopPropagation;
		}

		public simpleDispatch(type: string|number, data: any = undefined, bubbles: boolean = false): boolean {
			if (!bubbles && (undefined == this.mEventListeners || undefined == this.mEventListeners[type])) {
				return false;
			}

			let event: Recyclable<EventX> = recyclable(EventX);
			event.type = type;
			event.data = data;
			event.bubbles = bubbles;
			event.target = this.mTarget;
			let bool: boolean = this.dispatchEvent(event);
			event.recycle();
			return bool;
		}

		/** Returns if there are listeners registered for a certain event type. */
		public has(type: string|number): boolean {
			if (undefined == this.mEventListeners) {
				return false;
			}
			let signal: Link = this.mEventListeners[type];
			if (undefined == signal || 0 >= signal.length) {
				return false;
			}

			return true;
		}

		public onRecycle(): void {
			this.removeEventListeners();
		}


		addEventListener = this.on;
		removeEventListener = this.off;

		hasEventListener = this.has;
	}
}