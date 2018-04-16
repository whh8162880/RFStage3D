
module rf {
    export type ResLoadHandler = (event: EventX) => void;

    /**
         * 同一时刻最大可以同时启动的下载线程数
         */
    export let res_max_loader:number = 5;

    /**
     * 加载优先级枚举
     */
    export enum LoadPriority {
        low,
        middle,
        high,
        max,
    }

    /**
     * 添加一个加载项
     * @param url 加载路径, 数组为添加多个
     * @param complete 加载完毕回调
     * @param thisObj 回调作用域
     * @param type 资源类型
     * @param priority 加载优先级
     * @param cache 是否缓存
     * @param noDispose 不自动释放
     * @param disposeTime 自动释放时间, 超过该时间自动释放资源
     */
    export function loadRes(url: string, complete?: ResLoadHandler, thisObj?: any, type: ResType = ResType.bin, 
        priority: LoadPriority = LoadPriority.low, cache: boolean = true, noDispose: boolean = false, disposeTime: number = 30000): void {
            Res.instance.load(url, complete, thisObj, type, priority, cache, noDispose, disposeTime);
    }

    /**
     * 资源加载管理类
     */
    export class Res {
        private static _instance: Res;
        static get instance(): Res {
            return this._instance || (this._instance = new Res());
        }

        
        // maxLoader: number = 5;
        private nowLoader: number = 0;
        private _analyzerMap: { [type: string]: { new (): ResLoaderBase } };

        // private _loadMap: { [priority: number]: ResItem[] };
        private resMap: { [k: string]: ResItem };

        private link:Link;
        // private _loadingMap: { [k: string]: ResItem };

        private constructor() {
            this._analyzerMap = {};
            this._analyzerMap[ResType.text] = ResTextLoader;
            this._analyzerMap[ResType.bin] = ResBinLoader;
            this._analyzerMap[ResType.sound] = ResSoundLoader;
            this._analyzerMap[ResType.image] = ResImageLoader;

            this.resMap = {};

            this.link = new Link();
            // this._loadMap = {};
            // this._resMap = {};
            // this._loadingMap = {};
            // 资源释放机制
            // setInterval(this.clearRes.bind(this), 10 * 1000);
        }

        /**
         * 添加一个加载项
         * @param url 加载路径, 数组为添加多个
         * @param complete 加载完毕回调
         * @param thisObj 回调作用域
         * @param type 资源类型
         * @param priority 加载优先级
         * @param cache 是否缓存
         * @param noDispose 不自动释放
         * @param disposeTime 自动释放时间, 超过该时间自动释放资源
         */
        load(url: string, complete?: ResLoadHandler, thisObj?: any, type: ResType = ResType.bin, 
                priority: LoadPriority = LoadPriority.low, cache: boolean = true, noDispose: boolean = false, disposeTime: number = 30000): ResItem {

            const{resMap}=this;

            let item = resMap[url];
            if(undefined == item){
                //没创建
                let item = recyclable(ResItem);
                item.type = type;
                item.url = url;
                item.complete = [{thisObj:thisObj,complete:complete}];
                //添加进加载列表
                this.link.addByWeight(item,priority);
                //开始加载
                this.loadNext();
            }else if(undefined != item.complete){
                //正在加载中
                item.complete.push({thisObj:thisObj,complete:complete});
            }else if(undefined != item.data){
                //加载完成了
                setTimeout(() => {
                    let event = recyclable(EventX);
                    event.type = EventT.COMPLETE;
                    event.data = item;
                    complete.call(thisObj,event);
                    event.recycle();
                }, 0);
            }else{
                //加载完成 但是404了
                setTimeout(() => {
                    let event = recyclable(EventX);
                    event.type = EventT.FAILED;
                    event.data = item;
                    complete.call(thisObj,event);
                    event.recycle();
                }, 0);
            }
            return item;
        }

        private loadNext(): void {

            let{nowLoader,link}=this;
            let maxLoader = res_max_loader

            if (nowLoader >= maxLoader) {
                return;
            }

            while(nowLoader < maxLoader && link.length){
                let item:ResItem = link.shift();
                if(undefined == item){
                    //全部没有了
                    break;
                }
                this.doLoad(item);
            }
        }

        private doLoad(item: ResItem): void {
            this.nowLoader++;
            let loader = recyclable(this._analyzerMap[item.type]);
            loader.loadFile(item, this.doLoadComplete, this);
        }

        private doLoadComplete(loader: Recyclable<ResLoaderBase>, event: EventX): void {
            this.nowLoader--;

            loader.recycle();

            let item: ResItem = event.data;
            if (item) {
                item.preUseTime = engineNow;
            }

            item.complete.forEach((v, i) => {
                if (v) {
                    v.complete.call(v.thisObj,event);
                }
            });
            item.complete = undefined;

            this.loadNext();
        }

        private clearRes(): void {
            let now = engineNow;
            const{resMap}=this;
            for (let url in resMap) {
                let item = resMap[url];
                if (!item.noDispose && undefined == item.complete) {
                    if (item.disposeTime < now - item.preUseTime) {
                        resMap[url] = undefined;
                    }
                }
            }
        }
    }

    /**
     * 资源类型
     */
    export enum ResType {
        /**
         * 二进制
         */
        bin,
        /**
         * 文本
         */
        text,
        /**
         * 音乐
         */
        sound,
        /**
         * 图片
         */
        image,
    }


    export interface IResHandler{
        complete:ResLoadHandler;
        thisObj:any;
    }

    /**
     * 资源数据
     */
    export class ResItem implements IRecyclable{
        type: ResType;
        url: string;
        complete: IResHandler[];
        data: any;
        preUseTime: number;
        noDispose: boolean;
        disposeTime: number;

        onRecycle(){
            this.url = this.complete = this.data = undefined;
            this.preUseTime = this.disposeTime = 0;
            this.noDispose = false;
        }
    }

    /**
     * 加载基类
     */
    export abstract class ResLoaderBase {
        protected _resItem: ResItem;
        protected _compFunc: Function;
        protected _thisObject: any;

        loadFile(resItem: ResItem, compFunc: Function, thisObject: any): void {
            this._resItem = resItem;
            this._compFunc = compFunc;
            this._thisObject = thisObject;
        }
    }
    
    /**
     * 二进制加载
     */
    export class ResBinLoader extends ResLoaderBase {
        protected _httpRequest: HttpRequest;

        constructor() {
            super();
            let http = new HttpRequest();

            this._httpRequest = http
            http.responseType = this.getType();
            http.addEventListener(EventT.COMPLETE, this.onComplete, this);
            http.addEventListener(EventT.IO_ERROR, this.onIOError, this);
        }

        protected getType(): HttpResponseType {
            return HttpResponseType.ARRAY_BUFFER;
        }

        loadFile(resItem: ResItem, compFunc: Function, thisObject: any): void {
            super.loadFile(resItem, compFunc, thisObject);

            const{_httpRequest:http}=this;

            http.abort();
            http.open(resItem.url, HttpMethod.GET);
            http.send();
        }

        protected onComplete(event: EventX): void {
            const{_resItem,_compFunc,_thisObject,_httpRequest}=this;
            _resItem.data = _httpRequest.response;
            event.data = _resItem;
            this._resItem = this._compFunc = this._thisObject = undefined;
            if (undefined != _compFunc) {
                _compFunc.call(_thisObject, this, event);
            }
        }
        
        protected onIOError(event: EventX): void {
            const{_resItem,_compFunc,_thisObject,_httpRequest}=this;
            event.data = _resItem;
            this._resItem = this._compFunc = this._thisObject = undefined;
            if (_compFunc) {
                _compFunc.call(_thisObject, this, event);
            }
        }
    }

    /**
     * 文本加载
     */
    export class ResTextLoader extends ResBinLoader {
        protected getType(): HttpResponseType {
            return HttpResponseType.TEXT;
        }

        protected onComplete(event: EventX): void {
            const{_resItem,_compFunc,_thisObject,_httpRequest}=this;
            _resItem.data = _httpRequest.response;
            event.data = _resItem;
            this._resItem = this._compFunc = this._thisObject = undefined;
            if (_compFunc) {
                _compFunc.call(_thisObject, this, event);
            }
        }
    }

    /**
     * 音乐加载
     */
    export class ResSoundLoader extends ResBinLoader {
        protected onComplete(event: EventX): void {
            let data = this._httpRequest.response;
            // TODO : 解码数据为 Sound 对象
            let sound: any;

            this._resItem.data = sound;
            event.data = this._resItem;

            let compFunc = this._compFunc;
            let thisObject = this._thisObject;
            this._resItem = this._compFunc = this._thisObject = undefined;
            if (compFunc) {
                compFunc.call(thisObject, this, event);
            }
        }
    }

    /**
     * 图片加载
     */
    export class ResImageLoader extends ResLoaderBase {
        loadFile(resItem: ResItem, compFunc: Function, thisObject: any): void {
            let imageLoader = new ImageLoader();
            imageLoader.addEventListener(EventT.COMPLETE, (e: EventX) => {
                if (compFunc) {
                    resItem.data = imageLoader.data;
                    e.data = resItem;
                    compFunc.call(thisObject, this, e);
                }
            }, this);
            imageLoader.addEventListener(EventT.IO_ERROR, (e: EventX) => {
                if (compFunc) {
                    e.data = resItem;
                    compFunc.call(thisObject, this, e);
                }
            }, this);
            imageLoader.load(resItem.url);
        }
    }


    export class LoadTask extends MiniDispatcher{
        queue:{[key:string]:ResItem} = {};
        addBin(url:string):void{
            let item = new ResItem();
            item.type = ResType.bin;
            item.url = url;
        }

        addTxt(url:string):void{

        }

        addImage(url:string):void{

        }
    }
}