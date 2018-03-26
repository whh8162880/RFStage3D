
module rf {
    export class HttpResponseType {
        static TEXT: string = "text";
        static ARRAY_BUFFER: string = "arraybuffer";
    }

    export class HttpMethod {
        static GET: string = "GET";
        static POST: string = "POST";
    }

    /**
     * HTTP 请求类
     */
    export class HttpRequest extends MiniDispatcher {
        protected _url: string;
        protected _method: string;

        protected _responseType: string;
        protected _withCredentials: boolean;
        
        headerObj: {[key: string]: string};

        protected _xhr: XMLHttpRequest;

        constructor() {
            super();
        }

        get response(): any {
            if (!this._xhr) {
                return null;
            }
            if (this._xhr.response != undefined) {
                return this._xhr.response;
            }
            if (this._responseType == "text") {
                return this._xhr.responseText;
            }
            if (this._responseType == "arraybuffer" && /msie 9.0/i.test(navigator.userAgent)) {
                var w = window;
                return w["convertResponseBodyToText"](this._xhr["responseBody"]);
            }
            if (this._responseType == "document") {
                return this._xhr.responseXML;
            }
            /*if (this._xhr.responseXML) {
                return this._xhr.responseXML;
            }
            if (this._xhr.responseText != undefined) {
                return this._xhr.responseText;
            }*/
            return null;
        }

        set responseType(value: string) {
            this._responseType = value;
        }
        get responseType(): string {
            return this._responseType;
        }

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
                return null;
            }
            var result = this._xhr.getResponseHeader(header);
            return result ? result : "";
        }

        getAllResponseHeaders(): string {
            if (!this._xhr) {
                return null;
            }
            var result = this._xhr.getAllResponseHeaders();
            return result ? result : "";
        }

        open(url: string, method: string = "GET"): void {
            this._url = url;
            this._method = method;
            if (this._xhr) {
                this._xhr.abort();
                this._xhr = null;
            }
            this._xhr = this.getXHR();
            this._xhr.onreadystatechange = this.onReadyStateChange.bind(this);
            this._xhr.onprogress = this.updateProgress.bind(this);
            this._xhr.open(this._method, this._url, true);
        }

        protected getXHR(): XMLHttpRequest {
            if (window["XMLHttpRequest"]) {
                return new window["XMLHttpRequest"]();
            }
            return new window["ActiveXObject"]("MSXML2.XMLHTTP");
        }

        protected onReadyStateChange(): void {
            var xhr = this._xhr;
            if (xhr.readyState == 4) {
                var ioError_1 = (xhr.status >= 400 || xhr.status == 0);
                var url_1 = this._url;
                var self_1 = this;
                window.setTimeout(function () {
                    if (ioError_1) {
                        if (true && !self_1.hasEventListener(EventX.IO_ERROR)) {
                            ThrowError("http request error: " + url_1);
                        }
                        self_1.simpleDispatch(EventX.IO_ERROR);
                    } else {
                        self_1.simpleDispatch(EventX.COMPLETE);
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
            if (this._responseType != null) {
                this._xhr.responseType = <any> this._responseType;
            }
            if (this._withCredentials != null) {
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

        constructor() {
            super();
        }

        get data(): BitmapData {

        }

        set crossOrigin(value: string) {

        }
        get crossOrigin(): string {

        }

        load(url: string): void {
            
        }
    }

    /**
     * Socket 连接
     */
    export class Socket extends MiniDispatcher {
        constructor() {
            super();
        }
    }
}