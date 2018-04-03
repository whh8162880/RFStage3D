
module rf {
    export enum HttpResponseType {
        TEXT,
        ARRAY_BUFFER
    }

    export enum HttpMethod {
        GET,
        POST
    }

    /**
     * HTTP 请求类
     */
    export class HttpRequest extends MiniDispatcher {
        protected _url: string;
        protected _method: HttpMethod;

        protected _responseType: HttpResponseType;
        protected _withCredentials: boolean;
        
        headerObj: {[key: string]: string};

        protected _xhr: XMLHttpRequest;

        constructor() {
            super();
        }

        get response(): any {
            if (!this._xhr) {
                return undefined;
            }
            if (this._xhr.response != undefined) {
                return this._xhr.response;
            }
            if (this._responseType == HttpResponseType.TEXT) {
                return this._xhr.responseText;
            }
            if (this._responseType == HttpResponseType.ARRAY_BUFFER && /msie 9.0/i.test(navigator.userAgent)) {
                var w = window;
                return w["convertResponseBodyToText"](this._xhr["responseBody"]);
            }
            // if (this._responseType == "document") {
            //     return this._xhr.responseXML;
            // }
            return undefined;
        }

        set responseType(value: HttpResponseType) {
            this._responseType = value;
        }
        get responseType(): HttpResponseType {
            return this._responseType;
        }

        /**
         * 表明在进行跨站(cross-site)的访问控制(Access-Control)请求时，是否使用认证信息(例如cookie或授权的header)。(这个标志不会影响同站的请求)
         */
        set withCredentials(value: boolean) {
            this._withCredentials = value;
        }
        get withCredentials(): boolean {
            return this._withCredentials;
        }

        setRequestHeader(header: string, value: string): void {
            if (!this.headerObj) {
                this.headerObj = {};
            }
            this.headerObj[header] = value;
        }

        getResponseHeader(header: string): string {
            if (!this._xhr) {
                return undefined;
            }
            let result = this._xhr.getResponseHeader(header);
            return result ? result : "";
        }

        getAllResponseHeaders(): string {
            if (!this._xhr) {
                return undefined;
            }
            let result = this._xhr.getAllResponseHeaders();
            return result ? result : "";
        }

        open(url: string, method: HttpMethod = HttpMethod.GET): void {
            this._url = url;
            this._method = method;
            if (this._xhr) {
                this._xhr.abort();
                this._xhr = undefined;
            }
            this._xhr = this.getXHR();
            this._xhr.onreadystatechange = this.onReadyStateChange.bind(this);
            this._xhr.onprogress = this.updateProgress.bind(this);
            this._xhr.open(this._method == HttpMethod.POST ? "POST" : "GET", this._url, true);
        }

        protected getXHR(): XMLHttpRequest {
            if (window["XMLHttpRequest"]) {
                return new window["XMLHttpRequest"]();
            }
            return new window["ActiveXObject"]("MSXML2.XMLHTTP");
        }

        protected onReadyStateChange(): void {
            let xhr = this._xhr;
            if (xhr.readyState == 4) {
                let ioError = (xhr.status >= 400 || xhr.status == 0);
                let url = this._url;
                setTimeout(() => {
                    if (ioError) {
                        if (true && !this.hasEventListener(EventX.IO_ERROR)) {
                            ThrowError("http request error: " + url);
                        }
                        this.simpleDispatch(EventX.IO_ERROR);
                    } else {
                        this.simpleDispatch(EventX.COMPLETE);
                    }
                }, 0);
            }
        }

        protected updateProgress(event: any): void {
            if (event.lengthComputable) {
                this.simpleDispatch(EventX.PROGRESS, [event.loaded, event.total]);
            }
        }

        send(data?: any): void {
            if (this._responseType != undefined) {
                this._xhr.responseType = this._responseType == HttpResponseType.TEXT ? "text" : "arraybuffer";
            }
            if (this._withCredentials != undefined) {
                this._xhr.withCredentials = this._withCredentials;
            }
            if (this.headerObj) {
                for (var key in this.headerObj) {
                    this._xhr.setRequestHeader(key, this.headerObj[key]);
                }
            }
            this._xhr.send(data);
        }

        abort(): void {
            if (this._xhr) {
                this._xhr.abort();
            }
        }
    }

    /**
     * 图片加载类
     */
    export class ImageLoader extends MiniDispatcher {
        private static _crossOrigin: string;

        /**
         * 当从其他站点加载一个图片时，指定是否启用跨域资源共享(CORS)，默认值为null。
         * 可以设置为"anonymous","use-credentials"或null,设置为其他值将等同于"anonymous"。
         */
        static set crossOrigin(value: string) {
            this._crossOrigin = value;
        }
        static get crossOrigin(): string {
            return this._crossOrigin;
        }

        protected _hasCrossOriginSet: boolean;
        protected _crossOrigin: string;

        protected _currentImage: HTMLImageElement;

        protected _data: HTMLImageElement;

        constructor() {
            super();
        }

        get data(): HTMLImageElement {
            return this._data;
        }

        set crossOrigin(value: string) {
            this._hasCrossOriginSet = true;
            this._crossOrigin = value;
        }
        get crossOrigin(): string {
            return this._crossOrigin;
        }

        load(url: string): void {
            let image = document.createElement("img")
            image.crossOrigin = "Anonymous";
            this._data = undefined;
            this._currentImage = image;
            if (this._hasCrossOriginSet) {
                if (this._crossOrigin) {
                    image.crossOrigin = this._crossOrigin;
                }
            } else {
                if (ImageLoader.crossOrigin) {
                    image.crossOrigin = ImageLoader.crossOrigin;
                }
            }
            image.onload = this.onImageComplete.bind(this);
            image.onerror = this.onLoadError.bind(this);
            image.src = url;
        }

        protected onImageComplete(event: any): void {
            let image = this.getImage(event);
            if (!image) {
                return;
            }
            this._data = image;
            setTimeout(() => {
                this.simpleDispatch(EventX.COMPLETE);
            }, 0);
        }

        protected onLoadError(): void {
            let image = this.getImage(event);
            if (!image) {
                return;
            }
            this.simpleDispatch(EventX.IO_ERROR, image.src);
        }

        protected getImage(event: any): any {
            let image = event.target;
            image.onerror = undefined;
            image.onload = undefined;
            if (this._currentImage !== image) {
                return undefined;
            }
            this._currentImage = undefined;
            return image;
        }
    }

    /**
     * Socket 连接
     */
    export class Socket extends MiniDispatcher {
        protected _webSocket: WebSocket;

        protected _connected: boolean = false;
        protected _addInputPosition: number = 0;

        protected _input: ByteArray;
        protected _output: ByteArray;

        public endian: boolean = true;

        /**
         * 不再缓存服务端发来的数据
         */
        public disableInput: boolean = false;

        constructor(host?: string, port?: number) {
            super();

            if (host && port > 0 && port < 65535) {
			    this.connect(host, port);
            }
        }

        get connected(): boolean {
            return this._connected;
        }

        /**
         * 输入流，服务端发送的数据
         */
        get input(): ByteArray {
            return this._input;
        }

        /**
         * 输出流，要发送给服务端的数据
         */
        get output(): ByteArray {
            return this._output;
        }

        connect(host: string, port: number): void {
            let url = "ws://" + host + ":" + port;
            if (window.location.protocol == "https:") {
                url = "wss://" + host + ":" + port;
            }
            this.connectByUrl(url);
        }

        connectByUrl(url: string): void {
            if (this._webSocket !=null) {
			    this.close();
            }
            this._webSocket && this.cleanSocket();
            this._webSocket = new WebSocket(url);
            this._webSocket.binaryType = "arraybuffer";
            this._input = new ByteArray();
            this._input.endian = this.endian;
            this._output = new ByteArray();
            this._output.endian = this.endian;
            this._addInputPosition = 0;
            this._webSocket.onopen = (e) => {
                this.onOpen(e);
            };
            this._webSocket.onmessage = (msg) => {
                this.onMessage(msg);
            };
            this._webSocket.onclose = (e) => {
                this.onClose(e);
            };
            this._webSocket.onerror = (e) => {
                this.onError(e);
            };
        }

        protected cleanSocket() {
            try {
                this._webSocket.close();
            } catch (e) {
            }
            this._connected=false;
            this._webSocket.onopen=null;
            this._webSocket.onmessage=null;
            this._webSocket.onclose=null;
            this._webSocket.onerror=null;
            this._webSocket=null;
        }

        protected onOpen(e: any): void {
            this._connected = true;
            this.simpleDispatch(EventX.OPEN, e);
        }

        protected onMessage(msg: any): void {
            if (!msg || !msg.data) {
                return;
            }
            let data = msg.data;
            // 不缓存接收的数据则直接抛出数据
            if (this.disableInput && data) {
                this.simpleDispatch(EventX.MESSAGE, data);
                return;
            }
            // 如果输入流全部被读取完毕则清空
            if (this._input.length > 0 && this._input.bytesAvailable < 1){
                this._input.clear();
                this._addInputPosition = 0;
            };
            // 获取当前的指针位置
            let pre = this._input.position;
            if (!this._addInputPosition) {
                this._addInputPosition = 0;
            }
            // 指向添加数据的指针位置
            this._input.position = this._addInputPosition;
            if (data) {
                // 添加数据
                if ((typeof data == "string")) {
                    this._input.writeUTFBytes(data);
                } else {
                    this._input._writeUint8Array(new Uint8Array(data));
                }
                // 记录下一次添加数据的指针位置
                this._addInputPosition = this._input.position;
                // 还原到当前的指针位置
                this._input.position = pre;
            }
            this.simpleDispatch(EventX.MESSAGE, data);
        }

        protected onClose(e: any): void {
            this._connected = false;
            this.simpleDispatch(EventX.CLOSE, e);
        }

        protected onError(e: any): void {
            this.simpleDispatch(EventX.ERROR, e);
        }

        /**
         * 发送数据到服务器
         * @param data 需要发送的数据 可以是String或者ArrayBuffer
         */
        send(data: string | ArrayBuffer): void {
            this._webSocket.send(data);
        }

        flush(): void {
            if (this._output && this._output.length > 0){
                var evt;
                try {
                    this._webSocket && this._webSocket.send(this._output.buffer);
                } catch (e) {
                    evt = e;
                }
                this._output.endian = this.endian;
                this._output.clear();
                if (evt) {
                    this.simpleDispatch(EventX.ERROR, evt);
                }
            }
        }

        close() {
            if (this._webSocket != undefined) {
                try {
                    this._webSocket.close();
                } catch (e) {
                }
            }
        }
    }
}