/// <reference path="./ClassUtils.ts" />
/// <reference path="./Link.ts" />
/// <reference path="./MiniDispatcher.ts" />

namespace rf {
	export interface IResizeable {
		resize?(width: number, height: number): void;
	}
	export interface ITickable {
		update?(now: number, interval: number): void;
	}

	export class EngineEvent {
		public static VISIBILITY_CHANGE: string = 'visibility_change';
		public static FPS_CHANGE: string = 'FPS_CHANGE';
	}

	const enum Time {
		/**
		 * 一秒
		 */
		ONE_SECOND = 1000,
		/**
		 * 五秒
		 */
		FIVE_SECOND = 5000,
		/**
		 * 一分种
		 */
		ONE_MINUTE = 60000,
		/**
		 * 五分种
		 */
		FIVE_MINUTE = 300000,
		/**
		 * 半小时
		 */
		HALF_HOUR = 1800000,
		/**
		 * 一小时
		 */
		ONE_HOUR = 3600000,
		/**
		 * 一天
		 */
		ONE_DAY = 86400000
	}


	//===========================================================================================
	// 		TimeMixer
	//===========================================================================================
	export interface ITimeMixer{
		now:number;
		speed:number;
		interval?:number;
	}
	export function newTimeMixer(now:number = 0,speed:number = 1):ITimeMixer{
		return {now:now,speed:speed}
	}
	export function tm_add(t:ITimeMixer,interval:number){
		t.interval = interval * t.speed;
		t.now += t.interval;
		return t.now;
	}
	

	export let nativeMouseX:number = 0;
	export let nativeMouseY:number = 0;

	export let nextUpdateTime: number = 0;
	export let frameInterval: number = 0;

	//当前程序运行了多长时间
	export let engineNow:number = 0;

	export let serverTime:number = 0;

	const _sharedDate = new Date();

	let _utcOffset = -_sharedDate.getTimezoneOffset() * Time.ONE_MINUTE;

	export function getUTCTime(time: number) {
		return time + _utcOffset;
	}

	export function getFormatTime(time: number, format: string, isRaw = true):string {
		if (isRaw) {
			time = this.getUTCTime(time);
		}
		_sharedDate.setTime(time);
		return _sharedDate.format(format);
	}

	export const getT: ({ (): number }) = window.performance ? performance.now.bind(performance) : Date.now;


	export const defaultTimeMixer:ITimeMixer = newTimeMixer(0.0,1.0);

	

	export function defaultResize(width:number,height:number){
		stageWidth = window.innerWidth * pixelRatio;
		stageHeight = window.innerHeight * pixelRatio;
	}

	export let resizeStageSizeFunction:Function = defaultResize;
	
	// export let engie_animation_request:Function = undefined;
	export class Engine {
		//当前程序开始时间
		public static startTime: number = 0;
		
		//上一帧到本帧间隔时间
		public static interval: number = 0;
		//窗口是否最小化
		public static hidden: boolean = false;
		//窗口最小化开始时间
		public static hiddenTime: number = 0;
		//一秒内刷新次数
		public static fps: number = 0;
		//一秒内执行代码使用时间
		public static code: number = 0;

		private static ticklink: Link = new Link();
		private static resizeLink: Link = new Link();
		private static _frameRate: number = 60;
		private static _nextProfileTime: number = 0;
		private static _fpsCount: number = 0;
		private static _codeTime: number = 0;



		public static start(): void {
			Engine.startTime = getT();
			engineNow = 0;
			Engine.frameRate = Engine._frameRate;
			nextUpdateTime = Engine.startTime + frameInterval;
			Engine._nextProfileTime = Engine.startTime + 1000;

			//动画ENTER_FRAME;
			let animationRequest =
				window['requestAnimationFrame'] ||
				window['webkitRequestAnimationFrame'] ||
				window['mozRequestAnimationFrame'] ||
				window['oRequestAnimationFrame'] ||
				window['msRequestAnimationFrame'];

			function onAnimationChange(): void {
				animationRequest(onAnimationChange);
				let time = getT();
				if(time < Engine.startTime){
					time = nextUpdateTime;
				}else if (time < nextUpdateTime) {
					return;
				}
				let now = time - Engine.startTime;
				let interval = (Engine.interval = now - engineNow);
				defaultTimeMixer.now = now;
				defaultTimeMixer.interval = interval;
				nextUpdateTime += frameInterval;
				engineNow = now;
				Engine.update(now, interval);
				Engine.profile();
			}

			animationRequest(onAnimationChange);

			//resize
			window.onresize = function () {
				isWindowResized = true;
			};


			resizeStageSizeFunction(window.innerWidth,window.innerHeight);

			//窗口最大化最小化监听
			var hidden, state, visibilityChange;
			if (typeof document['hidden'] !== 'undefined') {
				hidden = 'hidden';
				visibilityChange = 'visibilitychange';
				state = 'visibilityState';
			} else if (typeof document['mozHidden'] !== 'undefined') {
				hidden = 'mozHidden';
				visibilityChange = 'mozvisibilitychange';
				state = 'mozVisibilityState';
			} else if (typeof document['msHidden'] !== 'undefined') {
				hidden = 'msHidden';
				visibilityChange = 'msvisibilitychange';
				state = 'msVisibilityState';
			} else if (typeof document['webkitHidden'] !== 'undefined') {
				hidden = 'webkitHidden';
				visibilityChange = 'webkitvisibilitychange';
				state = 'webkitVisibilityState';
			}

			document.addEventListener(
				visibilityChange,
				function () {
					let stateDesc: string = document[state];
					let hidden: boolean = stateDesc.toLocaleLowerCase().indexOf('hidden') != -1;
					Engine.hidden = hidden;
					if (hidden) {
						Engine.hiddenTime = Date.now();
					} else {
						if (0 != Engine.hiddenTime) {
							let delayTime: number = Date.now() - Engine.hiddenTime;
							Engine.startTime += delayTime;
							Engine._nextProfileTime += delayTime;
							nextUpdateTime += delayTime;
							Engine.hiddenTime = 0;
						}
					}
					ROOT.simpleDispatch(EngineEvent.VISIBILITY_CHANGE, hidden);
				},
				false
			);
		}

		public static addResize(value: IResizeable): void {
			Engine.resizeLink.add(value);
			value.resize(stageWidth, stageHeight);
		}

		public static removeResize(value: IResizeable): void {
			Engine.resizeLink.remove(value);
		}

		public static resize(width: number, height: number): void {
			//todo other
			let vo = Engine.resizeLink.getFrist();
			while (vo) {
				let next = vo.next;
				if (false == vo.close) {
					let value: IResizeable = vo.data;
					value.resize(width, height);
				}
				vo = next;
			}
			ROOT.simpleDispatch(EventT.RESIZE);
		}

		public static addTick(tick: ITickable): void {
			Engine.ticklink.add(tick);
		}

		public static removeTick(tick: ITickable): void {
			Engine.ticklink.remove(tick);
		}

		public static update(now: number, interval: number): void {
			if (isWindowResized) {
				isWindowResized = false;
				resizeStageSizeFunction(window.innerWidth,window.innerHeight);
				Engine.resize(stageWidth, stageHeight);
			}

			let vo = Engine.ticklink.getFrist();
			while (vo) {
				let next = vo.next;
				if (false == vo.close) {
					let tick: ITickable = vo.data;
					tick.update(now, interval);
				}
				vo = next;
			}
			ROOT.simpleDispatch(EventT.ENTER_FRAME);
		}

		public static set frameRate(value: number) {
			Engine._frameRate = value;
			frameInterval = 1000 / value;
		}

		public static get frameRate(): number {
			return Engine._frameRate;
		}

		public static profile(): void {
			let now: number = getT();
			Engine._fpsCount++;
			Engine._codeTime += now - Engine.startTime - engineNow;
			if (now > Engine._nextProfileTime) {
				Engine._nextProfileTime += 1000;
				Engine.fps = Engine._fpsCount;
				Engine.code = Engine._codeTime;
				Engine._fpsCount = 0;
				Engine._codeTime = 0;
				ROOT.simpleDispatch(EngineEvent.FPS_CHANGE);
			}
		}
	}

	export function getTimer(): number {
		return Date.now() - Engine.startTime;
	}

	export class TimerEventX extends EventX {
		public static TIMER: string = 'timer';
		public static TIMER_COMPLETE: string = 'timerComplete';
	}

	export class Timer extends MiniDispatcher implements ITickable {
		private _delay: number = 0;
		private currnetTime: number = 0;

		public repeatCount: number = 0;
		public running: Boolean = false;

		constructor(delay: number, repeatCount: number = 0) {
			super();
			this.delay = delay;
			this.repeatCount = repeatCount;
		}

		public set delay(value: number) {
			if (value < 1) {
				value = 1;
			}
			if (this._delay == value) {
				return;
			}
			this._delay = value;
		}

		public get delay(): number {
			return this._delay;
		}

		public start(): void {
			this.currnetTime = 0;
			Engine.addTick(this);
		}

		public stop(): void {
			Engine.removeTick(this);
			this.currnetTime = 0;
			this._delay = 0;
			this.repeatCount = 0;
		}

		public update(now: number, interval: number): void {
			this.currnetTime += interval;
			if (this.currnetTime >= this._delay) {
				this.simpleDispatch(TimerEventX.TIMER);
				this.currnetTime = this.currnetTime % this._delay;
			}

			if (this.repeatCount > 0) {
				this.repeatCount--;
				if (this.repeatCount <= 0) {
					this.simpleDispatch(TimerEventX.TIMER_COMPLETE);
					this.stop();
				}
			}
		}
	}

	export class GTimer {
		public link: Link;
		public timer: Timer;
		constructor(delay: number) {
			this.link = new Link();
			this.timer = new Timer(delay);
			this.timer.addEventListener(TimerEventX.TIMER, this.timerHandler, this);
		}

		public timerHandler(event: EventX): void {
			let vo = this.link.getFrist();
			while (vo) {
				let next = vo.next;
				if (false == vo.close) {
					let func: Function = vo.data;
					if (undefined != vo.args) {
						func(vo.args);
					} else {
						func();
					}
				}
				vo = next;
			}
		}

		public add(func: Function, args?: any): LinkVO {
			let vo = this.link.add(func, args);
			this.timer.start();
			return vo;
		}

		public remove(func: Function): void {
			this.link.remove(func);
			if (!this.link.length) {
				this.timer.stop();
			}
		}
	}

	class GTimerCallLater extends GTimer {
		constructor() {
			super(10);
			//this.link.checkSameData = false;
		}

		public later(f: Function, time: number, args?: any): void {
			if (undefined == f) {
				return;
			}
			super.add(f, args).weight = engineNow + time;
		}

		public add(func: Function, args?: any): LinkVO {
			return undefined;
		}

		public timerHandler(event: EventX): void {
			let now = engineNow;
			let vo = this.link.getFrist();
			while (vo) {
				let next = vo.next;
				if (false == vo.close) {
					if (now > vo.weight) {
						let func: Function = vo.data;
						func.apply(this, vo.args);
						vo.close = true;
					}
				}
				vo = next;
			}
		}
	}

	export class TimerUtil {
		public static timeobj: Object = {};
		public static time250: GTimer = TimerUtil.getTimer(250);
		public static time500: GTimer = TimerUtil.getTimer(500);
		public static time1000: GTimer = TimerUtil.getTimer(1000);
		public static time3000: GTimer = TimerUtil.getTimer(3000);
		public static time4000: GTimer = TimerUtil.getTimer(4000);
		public static time5000: GTimer = TimerUtil.getTimer(5000);
		private static later: GTimerCallLater = new GTimerCallLater();
		public static getTimer(time: number): GTimer {
			var gtimer: GTimer = TimerUtil.timeobj[time];
			if (undefined == gtimer) {
				TimerUtil.timeobj[time] = gtimer = new GTimer(time);
			}
			return gtimer;
		}

		public static add(f: Function, time: number, ...args): void {
			TimerUtil.later.later(f, time, args);
		}

		public static remove(f: Function): void {
			TimerUtil.later.remove(f);
		}
	}
}
