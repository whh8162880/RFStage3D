module rf{
    export class TimelinePlayer extends MiniDispatcher implements ITickable, IRecyclable, IDisposable {

        static extensions:{[type:string]:any} = {};

        tid:string;
        timeline:any;
        link:Link;

        _global:{[key:string]: any};
        caster:any;
        dispatcher:MiniDispatcher;
        mx:number;
        my:number;

        repeat:number;
        
        constructor(){
            super()
            this.link = new Link();
        }


        play(timeline:any,caster:any, dispather?:MiniDispatcher, mx:number=0, my:number = 0):void{
            this.tid = timeline.id;
            this.timeline = timeline;
            this.initData();
			Engine.addTick(this);
        }

        initData():void{
            let{link, timeline} = this;
            link.clean()
            let index = 0;
            let t = engineNow;
            let dt = t;
            for(let o of timeline.value){
				if(o){
					o.index = index++;
					let linkvo:LinkVO = link.add(o,this,undefined);
					let time:number;
                    
                    if(o["time"]){
						time = o.time;
						linkvo.time = t+time;
					}else{
						linkvo.time = dt;
						time = o["duration"];
						dt += time;
					}
				}
			}
        }

        getCaster():any{
            return null;
        }

        update(now: number, interval: number): void{

            let unit:any = this.getCaster();
			if(!unit){
                return;
            }
            
            let{extensions} = TimelinePlayer;
            let{link, dispatcher,caster, mx, my} = this;

            let time = engineNow;
            
            
			let o:any;
			let endFlag:Boolean = true;
			let vo = link.getFrist()
			
			while(vo){
				if(vo.close == false){
                    o = vo.data;
                    if(o instanceof TimeLineExtensionBase){
						if(o.close == false){
							if(time - o.startTime > 10*1000 /* && unit.guid == CoreT.hero.guid*/){	
								// trace("这里有个timeline运行超过了10秒", o);
								o.dispose();
							}else{
								endFlag = false;
							}
						}else{
							link.removeLink(vo);
						}
					}
					else{
						endFlag = false;
						if(time > vo.time){
							let type:string = o.type || "normal";
                            
							let cls = extensions[type];
							if(cls != null){
								let extension:TimeLineExtensionBase = recyclable(cls)
								extension.type = type;
								extension.owner = this;
								extension.dispatcher = dispatcher;
								extension._mx = mx;
								extension._my = my;
								extension.play(o,caster);
								vo.data = extension;
							}else{
								// throw new Error("配置错误，未知的timeline type:"+type);
                                vo.data = null;
                                link.removeLink(vo)
								
							}
						}
					}
				}
				vo = vo.next;
			}
			
			if(endFlag){
				this.complete();
            }
            


        }


        get global():{[key:string]: any}{
            if(this._global == undefined){
                this._global = {};
            }
            return this._global;
        }

        complete():void{
			if(-1 == this.repeat){
				this.repeatTimeline();
			}else if(this.repeat > 0){
				this.repeat--;
				this.repeatTimeline();
			}else{
                this.link.clean();
                Engine.removeTick(this);
				this.dispatcher = null;
				this.mx = 0;
				this.my = 0;
				
			}
			this.simpleDispatch(EventT.COMPLETE);
        }

        repeatTimeline():void{
			this.initData();
		}

        dispose(): void{

        }


        
    }


    export class TimeLineExtensionBase extends MiniDispatcher implements ITickable, IRecyclable, IDisposable{
        
        type:string;

        dispatcher:MiniDispatcher;

        owner:TimelinePlayer;

        caster:any;

        link:Link;

        data:any;
        startTime:number;
        duration:number;
        close:boolean;

        pos:any;

        _mx:number;
        _my:number;


        constructor(){
            super()
            this.link = new Link()
        }
        play(data:any, caster:any):void{
            this.data = data;
            this.updateProperty(data, this);

            this.commonStart();

            let runable = this.start();
            if(!runable){
				this.complete();
			}
        }

        commonStart():void{

        }

        start():boolean{
            this.startTime = engineNow;
            return false;
        }
        
        update(now: number, interval: number): void{

        }


        updateProperty(o:any,target:any):void{
			for(let key in o){
				if(target[key]){
					target[key] = o[key];
				}
			}
        }
        
        selfComplete():void{

        }

        complete():void{

        }

        dispose(): void{

        }
    }



}