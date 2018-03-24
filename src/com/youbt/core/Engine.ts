/// <reference path="./ClassUtils.ts" />
/// <reference path="./Link.ts" />
/// <reference path="../events/MiniDispatcher.ts" />

module rf{
    export interface ITickable{
        update(now:number,interval:number):void;
    }

    export class Engine{
          
        public static now:number = 0;

        public static interval:number = 0;

        public static startTime:number = 0;

        private static link:Link = new Link(); 

        private static _frameRate:number = 60;
        private static _frameInterval:number = 0;

        public static start():void{
            Engine.now = Engine.startTime = Date.now();
            Engine.frameRate = Engine._frameRate;

            let requestAnimationFrame =
            window["requestAnimationFrame"] ||
            window["webkitRequestAnimationFrame"] ||
            window["mozRequestAnimationFrame"] ||
            window["oRequestAnimationFrame"] ||
            window["msRequestAnimationFrame"];

            if (!requestAnimationFrame) {
                requestAnimationFrame = function (callback) {
                    return window.setTimeout(callback, 1000 / 60);
                };
            }

            requestAnimationFrame(Engine.update);
        } 

        public static addTick(tick:ITickable):void{
            Engine.link.add(tick);
        }

        public static removeTick(tick:ITickable):void{
            Engine.link.remove(tick);
        }

        public static update():void{
            let now:number = Date.now()-Engine.startTime;
            let interval:number = Engine.interval = now - Engine.now;
            Engine.now = now;
            let vo = this.link.getFrist();
            while(vo){
                let next = vo.next;
                if(false == vo.close){
                    let tick:ITickable = vo.data;
                    tick.update(now,interval);
                }
                vo = next;
            }
        }

        public static set frameRate(value:number){
            Engine._frameRate = value;
            Engine._frameInterval = 1000 / value;
        }

        public static get frameRate():number{
            return Engine._frameRate;
        }


        
    }

    export class TimerEventX extends EventX{
        public static TIMER:string = "timer";
        public static TIMER_COMPLETE:string = "timerComplete";
    }


    export class Timer extends MiniDispatcher implements ITickable{
        private _delay:number = 0;
        private currnetTime:number = 0;

        public repeatCount:number = 0;
        public running:Boolean = false;

        constructor(delay:number,repeatCount:number = 0){
            super();
            this.delay = delay;
            this.repeatCount = repeatCount;
        }

        public set delay(value:number){
            if (value < 1) {
                value = 1;
            }
            if (this._delay == value) {
                return;
            }
            this._delay = value;
        }

        public get delay():number{
            return this._delay;
        }


        public start():void{
            this.currnetTime = 0;
            Engine.addTick(this);
        }

        public stop():void{
            Engine.removeTick(this);
            this.currnetTime = 0;
            this._delay = 0;
            this.repeatCount = 0;
        }


        public update(now:number,interval:number):void{
            this.currnetTime += interval;
            if(this.currnetTime >= this._delay){
                this.simpleDispatch(TimerEventX.TIMER);
                this.currnetTime = this.currnetTime % this._delay;
            }

            if(this.repeatCount > 0){
                this.repeatCount--;
                if(this.repeatCount<=0){
                    this.simpleDispatch(TimerEventX.TIMER_COMPLETE);
                    this.stop();
                }
            }
        }
    }


    export class GTimer{

        private link:Link;
        private timer:Timer;
        constructor(delay:number){
            this.link = new Link();
            this.timer = new Timer(delay);
            this.timer.addEventListener(TimerEventX.TIMER,this.timerHandler);
        }

        protected timerHandler(event:EventX):void{
            let vo = this.link.getFrist();
            while(vo){
                let next = vo.next;
                if(false == vo.close){
                    let func:Function = vo.data;
                    if(undefined != vo.args){
                        func(vo.args);
                    }else{
                        func();
                    }
                    
                }
                vo = next;
            }
        }

        public add(func:Function,args?:any):void{
            this.link.add(func,args);
            this.timer.start();
        }
      

        public remove(func:Function):void{
            this.link.remove(func);
            if(!this.link.length){
                this.timer.stop();
            }
        }

    }

}