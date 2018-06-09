///<reference path="./Component.ts" />
module rf {
    //var facade
    //facade 注册记录保存所有Model class 等信息
    export class Facade extends MiniDispatcher {

        SINGLETON_MSG: string = "Facade Singleton already constructed!";

        mediatorMap:{[key:string]:Mediator} = {};
        modelMap: { [key: string]: BaseModel } = {};

        constructor() {
            super();
        }

        toggleMediator(m:{new ():Mediator}, type: number = -1): Mediator {

            let{mediatorMap} = this;

            let mediator = singleton(m);
            mediatorMap[mediator.name] = mediator;

            let panel = mediator.panel;

            if (mediator.isReady == false && type == 0) {
                mediator.off(EventT.COMPLETE_LOADED, this.mediatorCompleteHandler);
                return mediator;
            }

            if (mediator.isReady == false && mediator.startSync()) {
                mediator.on(EventT.COMPLETE_LOADED, this.mediatorCompleteHandler, this);
                return mediator;
            }

            this.togglepanel(mediator.panel,type)

            return mediator;
        }

        registerEvent(events: { [key: string]: EventHandler }, thisobj: any): void {
            for (let key in events) {
                let fun = events[key];
                this.on(key, fun, thisobj);
            }
        }

        removeEvent(event: { [key: string]: EventHandler }): void {
            for (let key in event) {
                let fun = event[key];
                this.off(key, fun)
            }
        }

        private togglepanel(panel: Panel, type: number = -1): void {
            switch (type) {
                case 1:
                    panel.isShow ? panel.bringTop() : panel.show();
                    break;
                case 0:
                    if (panel.isShow) panel.hide();
                    break;
                case -1:
                    panel.isShow ? panel.hide() : panel.show();
                    break;
            }
        }

        mediatorCompleteHandler(event: EventX): void {
            let mediator = event.data as Mediator;
            mediator.off(EventT.COMPLETE_LOADED, this.mediatorCompleteHandler);
            this.togglepanel(mediator.panel, 1);
        }
    }

    export let facade = singleton(Facade);

    export class Mediator extends MiniDispatcher {
        eventInterests: { [key: string]: EventHandler };

        isReady: boolean = false;

        name: string;
        data: BaseModel;

        constructor(name: string) {
            super();
            this.name = name;
            this.mEventListeners = {};
            this.eventInterests = {};
        }

        panel: Panel
        setPanel(panel: Panel): void {
            if (this.panel) {
                ThrowError("has panel");
            }

            this.panel = panel;
            if ("$panel" in this) {
                this["$panel"] = panel;
            }
        }

        startSync(): boolean {
            let panel = this.panel;
            let source = panel.source;

            if (source.status == LoadStates.WAIT) {
                panel.load();
            }

            if (source.status == LoadStates.COMPLETE) {
                this.preViewCompleteHandler(undefined);
            } else if (source.status == LoadStates.LOADING) {
                panel.on(EventT.COMPLETE, this.preViewCompleteHandler, this);
            }

            return true;
        }

        preViewCompleteHandler(e: EventX): void {
            if (e) {
                let skin = e.currentTarget as Component;
                skin.removeEventListener(EventT.COMPLETE, this.preViewCompleteHandler);
                this.setBindView(true);
            }
            //checkModeldata
            // TimerUtil.add(this. ,100);
            this.mediatorReadyHandle();
            this.simpleDispatch(EventT.COMPLETE_LOADED, this);
        }

        awakenAndSleepHandle(e: EventX): void {
            let type = e.type;
            switch (type) {
                case EventT.ADD_TO_STAGE:
                    facade.registerEvent(this.eventInterests, this);
                    if (this.isReady) {
                        this.awaken();
                    }
                    break;
                case EventT.REMOVE_FROM_STAGE:
                    facade.removeEvent(this.eventInterests)
                    this.sleep();
                    break;
            }
        }

        setBindView(isBind: boolean): void {
            let { panel } = this;
            if (isBind) {
                panel.on(EventT.ADD_TO_STAGE, this.awakenAndSleepHandle, this);
                panel.on(EventT.REMOVE_FROM_STAGE, this.awakenAndSleepHandle, this);
            } else {
                panel.off(EventT.ADD_TO_STAGE, this.awakenAndSleepHandle);
                panel.off(EventT.REMOVE_FROM_STAGE, this.awakenAndSleepHandle);
            }
        }

        mediatorReadyHandle(): void {
            this.isReady = true;
            if (this.panel.isShow) {
                facade.registerEvent(this.eventInterests, this);
                this.awaken();
            }

        }


        sleep(): void {
        }

        awaken(): void {
        }

        onRemove(): void {

        }
    }

    export class BaseModel extends MiniDispatcher {
        modelName: string;

        isReady: boolean;
        constructor(modelName: string) {
            super();

            this.modelName = modelName;
            //注册
            facade.modelMap[modelName] = this;
        }

        refreshRuntimeData(type: string, data: any): void {

        }

        initRuntime(): void {

        }

        onRegister(): void {

        }

        onRemove(): void {

        }
    }

    export const enum PanelEvent {
        SHOW = "PanelEvent_SHOW",
        HIDE = "PanelEvent_HIDE",
    }

    export class Panel extends Component implements IResizeable {
        clsName: string;
        isShow: boolean;
        isModel: boolean;

        source: PanelSource;

        protected centerFlag: boolean;
        protected resizeable: boolean;

        constructor(uri: string, cls: string) {
            super(panelSourceLoad(uri));
            this.clsName = cls;
            this.renderer = new BatchRenderer(this);
        }

        render(camera: Camera, now: number, interval: number): void {
            let { source, renderer } = this;
            if (!source || source.status != LoadStates.COMPLETE) {
                return;
            }
            if (undefined != this.renderer) {
                if (this.status & DChange.t_all) { //如果本层或者下层有transform alpha 改编 那就进入updateTransform吧
                    this.updateTransform();
                }
                this.renderer.render(camera, now, interval);
            }
        }

        show(container?: any, isModal?: boolean): void {
            let { source, resizeable, centerFlag, isShow } = this;

            // if (!source || source.status == LoadStates.WAIT) {
            //     this.load();
            //     return;
            // }

            // if (source.status != LoadStates.COMPLETE) {
            //     return;
            // }


            if (isShow) {
                this.bringTop();
                return;
            }

            if (!container) {
                container = popContainer;
            }
            container.addChild(this);

            if (resizeable || isModal) {
                Engine.addResize(this);
                // this.resize(stageWidth, stageHeight);
            } else if (centerFlag) {
                this.centerLayout();
            }
            this.isShow = true;
            this.awaken();
            this.effectTween(1);

            this.on(MouseEventX.MouseDown, this.bringTop, this);
            // if(this.hasEventListener(PanelEvent.SHOW))
            // {
            // 	this.simpleDispatch(PanelEvent.SHOW);
            // }
        }

        load() {
            let { source } = this;
            if (source.status == LoadStates.COMPLETE) {
                this.asyncsourceComplete();
                return;
            } 

            if(source.status == LoadStates.WAIT){
                source.status = LoadStates.LOADING;
                loadRes(source.name,source.loadConfigComplete,source,ResType.amf);
            }
            
            source.on(EventT.COMPLETE, this.asyncsourceComplete, this);
            
            return source;
        }

        asyncsourceComplete(e?: EventX): void {
            let loadSource = this.source;
            let cs: IDisplaySymbol = loadSource.config.symbols[this.clsName];
            if (!cs) {
                return;
            }
            this.setSymbol(cs);
            this.setChange(DChange.batch);
            this.simpleDispatch(EventT.COMPLETE);
        }


        hide(e?: EventX): void {
            if (!this.isShow) {
                return;
            }
            this.isShow = false;
            // this.sleep();
            this.effectTween(0);
            // this.hideState();
            this.off(MouseEventX.MouseDown, this.bringTop);

            this.simpleDispatch(PanelEvent.HIDE);
        }

        bringTop(e?: EventX): void {
            let { parent } = this;
            if (parent == null) return;
            parent.addChild(this);
        }

        effectTween(type: number): void {

            // this.getTweener(type);


            // if(type){

            // 	_tween = tween.get(this._skin);
            // 	_tween.to({alpha:1},200);
            // }else{
            // 	_tween = tween.get(this._skin);
            // 	_tween.to({alpha:1},200);
            // }

            // _tween.call(this.effectEndByBitmapCache,this,type);

            // this.effectEndByBitmapCache(type);
            if (type == 0) {
                if (this.resizeable || this.isModel) {
                    Engine.removeResize(this);
                }
                this.remove();
            }

        }

        resize(width: number, height: number): void {
            let { centerFlag } = this;
            if (centerFlag) {
                this.centerLayout();
            }
        }
        protected centerLayout(): void {
            this.x = stageWidth - this.w >> 1;
            this.y = stageHeight - this.h >> 1;
            if (this.y < 0) {
                this.y = 0;
            }
        }
    }

    export class TEventInteresterDele extends MiniDispatcher {
        protected _eventInterests: { [key: string]: EventHandler };
        protected _skin:Component;

        constructor(skin : Component) {
            super();

            this._eventInterests = {};

            this._skin = skin;
            this.setBindView();

            this.bindComponents();
        }

        protected bindEventInterests(): void {

        }

        bindComponents():void{
            
        }

        setBindView(): void {
            let {_skin} = this;
            _skin.addEventListener(EventT.ADD_TO_STAGE, this.awakenAndSleepHandle, this);
            _skin.addEventListener(EventT.REMOVE_FROM_STAGE, this.awakenAndSleepHandle, this);
        }

        awakenAndSleepHandle(e: EventX): void {
            let type = e.type;
            switch (type) {
                case EventT.ADD_TO_STAGE:
                    facade.registerEvent(this._eventInterests, this);
                    this.awaken();
                    break;
                case EventT.REMOVE_FROM_STAGE:
                    facade.removeEvent(this._eventInterests)
                    this.sleep();
                    break;
            }
        }

        awaken():void
        {

        }

        sleep():void
        {

        }
    }
}