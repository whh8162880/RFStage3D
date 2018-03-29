
module rf {
    export type ResLoadHandler = (event: EventX) => void;

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
    export function loadRes(url: string | string[], complete?: ResLoadHandler, thisObj?: any, type: ResType = ResType.bin, 
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

        /**
         * 同一时刻最大可以同时启动的下载线程数
         */
        maxLoader: number = 5;
        private nowLoader: number = 0;

        private _analyzerMap: { [type: string]: { new (): ResLoaderBase } };

        private _loadMap: { [priority: number]: ResItem[] };
        private _resMap: { [k: string]: ResItem };
        private _loadingMap: { [k: string]: ResItem };

        private constructor() {
            this._analyzerMap = {};
            this._analyzerMap[ResType.text] = ResTextLoader;
            this._analyzerMap[ResType.bin] = ResBinLoader;
            this._analyzerMap[ResType.sound] = ResSoundLoader;
            this._analyzerMap[ResType.image] = ResImageLoader;

            this._loadMap = {};
            this._resMap = {};
            this._loadingMap = {};

            // 资源释放机制
            setInterval(this.clearRes.bind(this), 10 * 1000);
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
        load(url: string | string[], complete?: ResLoadHandler, thisObj?: any, type: ResType = ResType.bin, 
                priority: LoadPriority = LoadPriority.low, cache: boolean = true, noDispose: boolean = false, disposeTime: number = 30000): void {

            let urls: string[];
            if (typeof url === "string") {
                urls = [url];
            } else {
                urls = url;
            }

            urls.forEach(v => {
                // 已经加载好了
                if (this._resMap[v]) {
                    let item = this._resMap[v];
                    item.noDispose = noDispose;
                    item.disposeTime = disposeTime;

                    setTimeout(() => {
                        if (complete) {
                            let event = new EventX(EventX.COMPLETE, item);
                            complete.call(thisObj, event);
                        }
                    }, 0);
                }
                // 正在加载中
                else if (this._loadingMap[v]) {
                    let item = this._loadingMap[v];
                    item.complete.push(complete);
                    item.thisObj.push(thisObj);
                }
                // 新建加载
                else {
                    let item = new ResItem();
                    item.type = type;
                    item.url = v;
                    item.cache = cache;
                    item.complete = [complete];
                    item.thisObj = [thisObj];
                    item.noDispose = noDispose;
                    item.disposeTime = disposeTime;
        
                    if (!this._loadMap[priority]) {
                        this._loadMap[priority] = [];
                    }
                    let list = this._loadMap[priority];
                    list.push(item);

                    this._loadingMap[v] = item;

                    this.loadNext();
                }
            });
        }

        private loadNext(): void {
            if (this.nowLoader >= this.maxLoader) {
                return;
            }

            for (let i = LoadPriority.max; i >= 0; --i) {
                if (this._loadMap[i]) {
                    let list = this._loadMap[i];
                    if (list.length > 0) {
                        let item = list.shift();
                        this.doLoad(item);
                        return;
                    }
                }
            }

            if (this.nowLoader == 0) {
                // TODO : 全部加载完毕
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
                item.loadedTime = getTimer();

                if (item.cache) {
                    this._resMap[item.url] = item;
                }
            } else {
                // TODO : 单个项目加载失败
            }

            item.complete.forEach((v, i) => {
                if (v) {
                    v.call(item.thisObj[i], event);
                }
            });
            item.complete = item.thisObj = undefined;

            delete this._loadingMap[item.url];

            this.loadNext();
        }

        private clearRes(): void {
            let now = getTimer();

            for (let url in this._resMap) {
                let item = this._resMap[url];
                if (!item.noDispose) {
                    let time = now - item.loadedTime;
                    if (item.disposeTime < time) {
                        // 销毁
                        delete this._resMap[url];

                        // TODO : 根据类型需要手动销毁的代码, 比如在显存的 Texture 需要手动调用销毁
                        if (item.type == ResType.image) {

                        }
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

    /**
     * 资源数据
     */
    export class ResItem {
        type: ResType;

        url: string;

        cache: boolean;

        complete: ResLoadHandler[];
        
        thisObj: any[];

        data: any;

        loadedTime: number;

        noDispose: boolean;

        disposeTime: number;
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

            this._httpRequest = new HttpRequest();
            this._httpRequest.responseType = this.getType();
            this._httpRequest.addEventListener(EventX.COMPLETE, this.onComplete, this);
            this._httpRequest.addEventListener(EventX.IO_ERROR, this.onIOError, this);
        }

        protected getType(): HttpResponseType {
            return HttpResponseType.ARRAY_BUFFER;
        }

        loadFile(resItem: ResItem, compFunc: Function, thisObject: any): void {
            super.loadFile(resItem, compFunc, thisObject);

            this._httpRequest.abort();
            this._httpRequest.open(resItem.url, HttpMethod.GET);
            this._httpRequest.send();
        }

        protected onComplete(event: EventX): void {
            this._resItem.data = new ByteArray(this._httpRequest.response);
            event.data = this._resItem;
            
            let compFunc = this._compFunc;
            let thisObject = this._thisObject;
            this._resItem = this._compFunc = this._thisObject = undefined;
            if (compFunc) {
                compFunc.call(thisObject, this, event);
            }
        }
        
        protected onIOError(event: EventX): void {
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
     * 文本加载
     */
    export class ResTextLoader extends ResBinLoader {
        protected getType(): HttpResponseType {
            return HttpResponseType.TEXT;
        }

        protected onComplete(event: EventX): void {
            this._resItem.data = this._httpRequest.response;
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
            imageLoader.addEventListener(EventX.COMPLETE, (e: EventX) => {
                if (compFunc) {
                    resItem.data = imageLoader.data;
                    e.data = resItem;
                    compFunc.call(thisObject, this, e);
                }
            }, this);
            imageLoader.addEventListener(EventX.IO_ERROR, (e: EventX) => {
                if (compFunc) {
                    e.data = resItem;
                    compFunc.call(thisObject, this, e);
                }
            }, this);
            imageLoader.load(resItem.url);
        }
    }
}