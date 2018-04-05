declare let RELEASE: any;
declare let DEBUG: any;
declare module rf {
    var ClientCheck: {
        isClientCheck: boolean;
    };
    var errorPrefix: string;
    interface ThrowError {
        (msg: string, err?: Error, alert?: boolean): void;
        MaxCount?: number;
        errorMsg?: string[];
    }
    var Log: {
        (...msg): void;
    };
    const ThrowError: ThrowError;
}
declare function parseInt(s: number, radix?: number): number;
declare function zeroize(value: number | string, length?: number): string;
declare function getDescriptor(descriptor: PropertyDescriptor, enumerable?: boolean, writable?: boolean, configurable?: boolean): PropertyDescriptor;
declare function makeDefDescriptors(descriptors: object, enumerable?: boolean, writable?: boolean, configurable?: boolean): PropertyDescriptorMap;
interface Object {
    clone(): Object;
    copyto(to: Object): any;
    getPropertyDescriptor(property: string): PropertyDescriptor;
    equals(checker: object, ...args: (keyof this)[]): any;
    copyWith<T>(this: T, to: object, ...proNames: (keyof T)[]): void;
    getSpecObject<T>(this: T, ...proNames: (keyof T)[]): object;
}
interface Function {
    isSubClass(testBase: Function): boolean;
}
interface Math {
    clamp(value: number, min: number, max: number): number;
    random2(min: number, max: number): number;
    random3(center: number, delta: number): number;
    DEG_TO_RAD: number;
    RAD_TO_DEG: number;
    PI2: number;
    PI_1_2: number;
}
interface NumberConstructor {
    isSafeInteger(value: number): boolean;
}
interface Number {
    zeroize(length: number): string;
    between(min: number, max: number): boolean;
}
interface String {
    trim(): string;
    substitute(...args: any[]): string;
    substitute(args: any[]): string;
    zeroize(length: number): string;
    hash(): number;
    trueLength(): number;
}
interface StringConstructor {
    zeroize: (value: number, length: number) => string;
    regSubHandler(key: string, handler: {
        (input: any): string;
    }): any;
    subHandler: Readonly<{
        [index: string]: {
            (input: any): string;
        };
    }>;
}
interface Date {
    format(mask: string, local?: boolean): string;
}
declare const enum ArraySort {
    ASC = 0,
    DESC = 1,
}
interface ArrayConstructor {
    binaryInsert<T>(partArr: T[], item: T, filter: {
        (tester: T, ...args): boolean;
    }, ...args: any[]): any;
    SORT_DEFAULT: {
        number: 0;
        string: "";
        boolean: false;
    };
}
interface Array<T> {
    pushOnce(t: T): number;
    remove(t: T): boolean;
    multiSort(kArr: (keyof T)[], dArr?: boolean[] | ArraySort[]): this;
    doSort(key?: keyof T, descend?: boolean | ArraySort): this;
    doSort(descend?: boolean | ArraySort, key?: keyof T): this;
    cloneTo<T>(to: Array<T>): any;
    appendTo<T>(to: Array<T>): any;
}
declare module rf {
    function getQualifiedClassName(value: any): string;
    function getQualifiedSuperclassName(value: any): string;
    function is(instance: any, ref: {
        new (): any;
    }): boolean;
}
declare module rf {
    let gl: WebGLRenderingContext;
    var stageWidth: number;
    var stageHeight: number;
    var isWindowResized: boolean;
    var max_vc: number;
    let c_white: string;
}
declare module rf {
    class Vector3D {
        static X_AXIS: Vector3D;
        static Y_AXIS: Vector3D;
        static Z_AXIS: Vector3D;
        w: number;
        x: number;
        y: number;
        z: number;
        constructor(x?: number, y?: number, z?: number, w?: number);
        readonly length: number;
        readonly lengthSquared: number;
        static angleBetween(a: Vector3D, b: Vector3D): number;
        static distance(pt1: Point3D, pt2: Point3D): number;
        add(a: Point3D): Vector3D;
        subtract(a: Point3D): Vector3D;
        incrementBy(a: Point3D): void;
        decrementBy(a: Point3D): void;
        equals(toCompare: Point3DW, allFour?: boolean): boolean;
        nearEquals(toCompare: Point3DW, tolerance: number, allFour?: boolean): boolean;
        clone(): Vector3D;
        copyFrom(sourceVector3D: Point3DW): void;
        negate(): void;
        scaleBy(s: number): void;
        setTo(xa: number, ya: number, za: number): void;
        normalize(): number;
        crossProduct(a: Point3D): Vector3D;
        dotProduct(a: Point3D): number;
        project(): void;
        toString(): string;
    }
}
declare module rf {
    class Matrix3D {
        readonly determinant: number;
        readonly position: Vector3D;
        rawData: Float32Array;
        constructor(v?: ArrayLike<number>);
        append(lhs: Matrix3D): void;
        prepend(rhs: Matrix3D): void;
        appendScale(xScale: number, yScale: number, zScale: number): void;
        prependScale(xScale: number, yScale: number, zScale: number): void;
        appendTranslation(x: number, y: number, z: number): void;
        prependTranslation(x: number, y: number, z: number): void;
        appendRotation(degrees: number, axis: Vector3D, pivotPoint?: Point3DW): void;
        prependRotation(degrees: number, axis: Vector3D, pivotPoint?: Vector3D): void;
        clone(): Matrix3D;
        copyColumnFrom(column: number, vector3D: Point3DW): void;
        copyColumnTo(column: number, vector3D: Point3DW): void;
        copyFrom(sourceMatrix3D: Matrix3D): void;
        copyRawDataFrom(vector: number[], index?: number, transpose?: boolean): void;
        copyRawDataTo(vector: number[] | ArrayBufferLike, index?: number, transpose?: boolean): void;
        copyRowFrom(row: number, vector3D: Point3DW): void;
        copyRowTo(row: number, vector3D: Point3DW): void;
        copyToMatrix3D(dest: Matrix3D): void;
        decompose(orientationStyle?: Orientation3D): Vector3D[];
        identity(): void;
        static interpolate(thisMat: Matrix3D, toMat: Matrix3D, percent: number): Matrix3D;
        interpolateTo(toMat: Matrix3D, percent: number): void;
        invert(): boolean;
        pointAt(pos: Vector3D, at?: Vector3D, up?: Vector3D): void;
        recompose(components: Vector3D[], orientationStyle?: Orientation3D): void;
        recompose2(components: Vector3D[], orientationStyle?: Orientation3D): boolean;
        transformVector(v: Point3DW): Vector3D;
        deltaTransformVector(v: Point3DW): Vector3D;
        transformVectors(vin: number[], vout: number[]): void;
        transpose(): void;
        toString(): string;
        private getRotateMatrix(axis, radians);
    }
}
declare module rf {
    type PosKey = "x" | "y";
    type SizeKey = "width" | "height";
    interface Point2D {
        x: number;
        y: number;
    }
    interface Point3D extends Point2D {
        z: number;
    }
    interface Point3DW extends Point3D {
        w: number;
    }
    interface Size extends Point2D {
        w: number;
        h: number;
    }
    interface IFrame extends Size {
        ix: number;
        iy: number;
    }
    interface IColor {
        r: number;
        g: number;
        b: number;
        a: number;
    }
    function hexToCSS(d: number, a?: number): string;
    function toRGB(color: number, out: IColor): void;
    function toCSS(color: IColor): string;
    class Point {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        readonly length: Number;
    }
    class Rect extends Point {
        width: number;
        height: number;
        constructor(x?: number, y?: number, width?: number, height?: number);
        clone(): Rect;
    }
    let RADIANS_TO_DEGREES: number;
    let DEGREES_TO_RADIANS: number;
    let tempAxeX: Vector3D;
    let tempAxeY: Vector3D;
    let tempAxeZ: Vector3D;
    let PI2: number;
    let RAW_DATA_CONTAINER: Float32Array;
    let CALCULATION_MATRIX: Matrix3D;
    let CALCULATION_VECTOR3D: Vector3D;
    let CALCULATION_DECOMPOSE: Vector3D[];
    interface Location {
        latitude: number;
        longitude: number;
    }
    interface LocationConstructor {
        getDist(l1: Location, l2: Location): number;
    }
    var Location: LocationConstructor;
    let EMPTY_POINT2D: Point;
    let EMPTY_POINT2D_2: Point;
    let EMPTY_POINT2D_3: Point;
    function m2dTransform(matrix: ArrayLike<number>, p: Point2D, out: Point2D): void;
    class Float32Byte {
        array: Float32Array;
        constructor(array?: Float32Array);
        length: number;
        append(byte: Float32Byte, offset?: number, len?: number): void;
        set(position: number, byte: Float32Byte, offset?: number, len?: number): void;
        wPoint1(position: number, x: number, y?: number, z?: number, w?: number): void;
        wPoint2(position: number, x: number, y: number, z?: number, w?: number): void;
        wPoint3(position: number, x: number, y: number, z: number, w?: number): void;
        wPoint4(position: number, x: number, y: number, z: number, w: number): void;
        wUIPoint(position: number, x: number, y: number, z: number, u: number, v: number, index: number, r: number, g: number, b: number, a: number): void;
        update(data32PerVertex: number, offset: number, v: number): void;
    }
}
declare namespace rf {
    class Endian {
        static LITTLE_ENDIAN: boolean;
        static BIG_ENDIAN: boolean;
    }
    class ByteArray {
        protected bufferExtSize: number;
        protected data: DataView;
        protected _bytes: Uint8Array;
        protected _position: number;
        protected write_position: number;
        endian: boolean;
        constructor(buffer?: ArrayBuffer | Uint8Array, bufferExtSize?: number);
        setArrayBuffer(buffer: ArrayBuffer): void;
        readonly readAvailable: number;
        buffer: ArrayBuffer;
        readonly rawBuffer: ArrayBuffer;
        readonly bytes: Uint8Array;
        dataView: DataView;
        readonly bufferOffset: number;
        position: number;
        length: number;
        protected _validateBuffer(value: number): void;
        readonly bytesAvailable: number;
        clear(): void;
        readBoolean(): boolean;
        readByte(): number;
        readBytes(bytes: ByteArray, offset?: number, length?: number): void;
        readDouble(): number;
        readFloat(): number;
        readInt(): number;
        readShort(): number;
        readUnsignedByte(): number;
        readUnsignedInt(): number;
        readUnsignedShort(): number;
        readUTF(): string;
        readUTFBytes(length: number): string;
        writeBoolean(value: boolean): void;
        writeByte(value: number): void;
        writeBytes(bytes: ByteArray, offset?: number, length?: number): void;
        writeDouble(value: number): void;
        writeFloat(value: number): void;
        writeInt(value: number): void;
        writeShort(value: number): void;
        writeUnsignedInt(value: number): void;
        writeUnsignedShort(value: number): void;
        writeUTF(value: string): void;
        writeUTFBytes(value: string): void;
        toString(): string;
        _writeUint8Array(bytes: Uint8Array | ArrayLike<number>, validateBuffer?: boolean): void;
        validate(len: number): boolean;
        protected validateBuffer(len: number): void;
        private encodeUTF8(str);
        private decodeUTF8(data);
        private encoderError(code_point);
        private decoderError(fatal, opt_code_point?);
        private EOF_byte;
        private EOF_code_point;
        private inRange(a, min, max);
        private div(n, d);
        private stringToCodePoints(string);
        replaceBuffer(value: ArrayBuffer): void;
        readBuffer(length: number): ArrayBuffer;
        readInt64(): number;
        writeInt64(value: number): void;
        readPBDouble(): number;
        writePBDouble(value: number): void;
        readPBFloat(): number;
        writePBFloat(value: number): void;
        readFix32(): number;
        writeFix32(value: number): void;
        readSFix32(): number;
        writeSFix32(value: number): void;
        readFix64(): number;
        writeFix64(value: number): void;
        readByteArray(length: number, ext?: number): ByteArray;
        writeVarint64(value: number): void;
        writeVarint(value: number): void;
        readVarint(): number;
        readVarint64(): number;
        readonly outBytes: Uint8Array;
        reset(): void;
    }
    class Int64 {
        high: number;
        low: number;
        constructor(low?: number, high?: number);
        toNumber(): number;
        static toNumber(low?: number, high?: number): number;
        static fromNumber(value: number): any;
        add(addend: Int64): Int64;
    }
}
declare module rf {
    class BitmapData {
        private _rect;
        private _transparent;
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        constructor(width: number, height: number, transparent?: boolean, fillColor?: number);
        static fromImageElement(img: HTMLImageElement): BitmapData;
        readonly width: number;
        readonly height: number;
        readonly imageData: ImageData;
        readonly rect: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        copyPixels(sourceBitmapData: BitmapData, sourceRect: Size, destPoint: Point2D): void;
        copyPixels(sourceBitmapData: HTMLImageElement, sourceRect: Size, destPoint: Point2D): void;
        draw(source: BitmapData): void;
        draw(source: HTMLImageElement): void;
        fillRect(x: number, y: number, width: number, height: number, css: string | CanvasGradient | CanvasPattern): void;
    }
    class MaxRectsBinPack {
        static BESTSHORTSIDEFIT: number;
        static BESTLONGSIDEFIT: number;
        static BESTAREAFIT: number;
        static BOTTOMLEFTRULE: number;
        static CONTACTPOINTRULE: number;
        binWidth: number;
        binHeight: number;
        allowRotations: Boolean;
        usedRects: Rect[];
        freeRects: Rect[];
        private score1;
        private score2;
        private bestShortSideFit;
        private bestLongSideFit;
        constructor(width: number, height: number, rotations?: boolean);
        private count(n);
        insert(width: number, height: number, method?: number): Rect;
        private insert2(Rects, dst, method);
        private placeRect(node);
        private scoreRect(width, height, method, score1, score2);
        private occupancy();
        private findPositionForNewNodeBottomLeft(width, height, bestY, bestX);
        private findPositionForNewNodeBestShortSideFit(width, height);
        private findPositionForNewNodeBestLongSideFit(width, height, bestShortSideFit, bestLongSideFit);
        private findPositionForNewNodeBestAreaFit(width, height, bestAreaFit, bestShortSideFit);
        private commonIntervalLength(i1start, i1end, i2start, i2end);
        private contactPointScoreNode(x, y, width, height);
        private findPositionForNewNodeContactPoint(width, height, bestContactScore);
        private splitFreeNode(freeNode, usedNode);
        private pruneFreeList();
        private isContainedIn(a, b);
    }
}
declare module rf {
    interface IDisposable {
        dispose(): void;
    }
    type Creator<T> = {
        new (): T;
    } | {
        (): T;
    };
    class ClassFactory<T> {
        private _creator;
        private _props;
        constructor(creator: Creator<T>, props?: Partial<T>);
        get(): any;
    }
    interface IRecyclable {
        onRecycle?: {
            ();
        };
        onSpawn?: {
            ();
        };
        _insid?: number;
    }
    class RecyclablePool<T> {
        private _pool;
        private _max;
        private _creator;
        get(): T;
        recycle(t: T): void;
        constructor(TCreator: Creator<T>, max?: number);
    }
    type Recyclable<T> = T & {
        recycle(): void;
    };
    function recyclable<T>(clazz: {
        new (): T & {
            _pool?: RecyclablePool<T>;
        };
    }): Recyclable<T>;
    function recyclable<T>(clazz: {
        (): T & {
            _pool?: RecyclablePool<T>;
        };
    }, addInstanceRecycle?: boolean): Recyclable<T>;
    function singleton<T>(clazz: {
        new (): T;
        _instance?: T;
    }): T;
}
declare module rf {
    class LinkVO implements IRecyclable {
        close: Boolean;
        data: any;
        args: any;
        next: Recyclable<LinkVO>;
        pre: Recyclable<LinkVO>;
        weight: number;
        onRecycle(): void;
        onSpawn(): void;
    }
    class Link {
        private last;
        private first;
        id: any;
        length: number;
        warningMax: number;
        checkSameData: boolean;
        getFrist(): Recyclable<LinkVO>;
        getLast(): Recyclable<LinkVO>;
        getValueLink(value: any): Recyclable<LinkVO>;
        add(value: any, args?: any): Recyclable<LinkVO>;
        addByWeight(value: any, weight: number, args?: any): Recyclable<LinkVO>;
        remove(value: any): void;
        removeLink(vo: Recyclable<LinkVO>): void;
        clean(): void;
        pop(): any;
        shift(): any;
        exec(f: Function): void;
        onRecycle(): void;
        toString(): string;
    }
}
declare module rf {
    interface IEventDispatcherX {
        on(type: string | number, listener: Function, thisObject?: any, priority?: number): void;
        off(type: string | number, listener: Function): void;
        has?(type: string | number): boolean;
        dispatchEvent(event: EventX): boolean;
        simpleDispatch?(type: string | number, data?: any, bubbles?: boolean): boolean;
    }
    enum EventT {
        ENTER_FRAME = 0,
        RESIZE = 1,
        COMPLETE = 2,
        FAIL = 3,
        CONTEXT3D_CREATE = 4,
        CHANGE = 5,
        CANCEL = 6,
        SCROLL = 7,
        OPEN = 8,
        CLOSE = 9,
        SELECT = 10,
        DISPOSE = 11,
        DATA = 12,
        ERROR = 13,
        PROGRESS = 14,
        IO_ERROR = 15,
        MESSAGE = 16,
        RECYCLE = 17,
    }
    enum MouseEventX {
        MouseDown = "mousedown",
        MouseUp = "mouseup",
        MouseWheel = "mousewheel",
        MouseMove = 50,
        CLICK = 51,
    }
    class EventX implements IRecyclable {
        type: string | number;
        data: any;
        bubbles: boolean;
        target: IEventDispatcherX;
        currentTarget: IEventDispatcherX;
        stopPropagation: boolean;
        stopImmediatePropagation: boolean;
        constructor(type?: string | number, data?: any, bubbles?: boolean);
        onRecycle(): void;
    }
    class MiniDispatcher implements IEventDispatcherX, IRecyclable {
        mEventListeners: Object;
        mTarget: IEventDispatcherX;
        constructor(target?: IEventDispatcherX);
        on(type: string | number, listener: Function, thisObject?: any, priority?: number): void;
        off(type: string | number, listener: Function): void;
        removeEventListeners(type?: string): void;
        dispatchEvent(event: EventX): boolean;
        simpleDispatch(type: string | number, data?: any, bubbles?: boolean): boolean;
        has(type: string | number): boolean;
        onRecycle(): void;
        addEventListener: (type: string | number, listener: Function, thisObject?: any, priority?: number) => void;
        removeEventListener: (type: string | number, listener: Function) => void;
        hasEventListener: (type: string | number) => boolean;
    }
}
declare namespace rf {
    interface IResizeable {
        resize?(width: number, height: number): void;
    }
    interface ITickable {
        update?(now: number, interval: number): void;
    }
    class EngineEvent {
        static VISIBILITY_CHANGE: string;
        static FPS_CHANGE: string;
    }
    let nextUpdateTime: number;
    let frameInterval: number;
    let engineNow: number;
    const getT: ({
        (): number;
    });
    class Engine {
        static dispatcher: MiniDispatcher;
        static startTime: number;
        static interval: number;
        static hidden: boolean;
        static hiddenTime: number;
        static fps: number;
        static code: number;
        private static ticklink;
        private static resizeLink;
        private static _frameRate;
        private static _nextProfileTime;
        private static _fpsCount;
        private static _codeTime;
        static start(): void;
        static addResize(value: IResizeable): void;
        static removeResize(value: IResizeable): void;
        static resize(width: number, height: number): void;
        static addTick(tick: ITickable): void;
        static removeTick(tick: ITickable): void;
        static update(now: number, interval: number): void;
        static frameRate: number;
        static profile(): void;
    }
    function getTimer(): number;
    class TimerEventX extends EventX {
        static TIMER: string;
        static TIMER_COMPLETE: string;
    }
    class Timer extends MiniDispatcher implements ITickable {
        private _delay;
        private currnetTime;
        repeatCount: number;
        running: Boolean;
        constructor(delay: number, repeatCount?: number);
        delay: number;
        start(): void;
        stop(): void;
        update(now: number, interval: number): void;
    }
    class GTimer {
        link: Link;
        timer: Timer;
        constructor(delay: number);
        timerHandler(event: EventX): void;
        add(func: Function, args?: any): LinkVO;
        remove(func: Function): void;
    }
    class TimerUtil {
        static timeobj: Object;
        static time250: GTimer;
        static time500: GTimer;
        static time1000: GTimer;
        static time3000: GTimer;
        static time4000: GTimer;
        static time5000: GTimer;
        private static later;
        static getTimer(time: number): GTimer;
        static add(f: Function, time: number, ...args: any[]): void;
        static remove(f: Function): void;
    }
}
declare module rf {
    enum HttpResponseType {
        TEXT = 0,
        ARRAY_BUFFER = 1,
    }
    enum HttpMethod {
        GET = 0,
        POST = 1,
    }
    class HttpRequest extends MiniDispatcher {
        protected _url: string;
        protected _method: HttpMethod;
        protected _responseType: HttpResponseType;
        protected _withCredentials: boolean;
        headerObj: {
            [key: string]: string;
        };
        protected _xhr: XMLHttpRequest;
        constructor();
        readonly response: any;
        responseType: HttpResponseType;
        withCredentials: boolean;
        setRequestHeader(header: string, value: string): void;
        getResponseHeader(header: string): string;
        getAllResponseHeaders(): string;
        open(url: string, method?: HttpMethod): void;
        protected getXHR(): XMLHttpRequest;
        protected onReadyStateChange(): void;
        protected updateProgress(event: any): void;
        send(data?: any): void;
        abort(): void;
    }
    class ImageLoader extends MiniDispatcher {
        private static _crossOrigin;
        static crossOrigin: string;
        protected _hasCrossOriginSet: boolean;
        protected _crossOrigin: string;
        protected _currentImage: HTMLImageElement;
        protected _data: HTMLImageElement;
        constructor();
        readonly data: HTMLImageElement;
        crossOrigin: string;
        load(url: string): void;
        protected onImageComplete(event: any): void;
        protected onLoadError(): void;
        protected getImage(event: any): any;
    }
    class Socket extends MiniDispatcher {
        protected _webSocket: WebSocket;
        protected _connected: boolean;
        protected _addInputPosition: number;
        protected _input: ByteArray;
        protected _output: ByteArray;
        endian: boolean;
        disableInput: boolean;
        constructor(host?: string, port?: number);
        readonly connected: boolean;
        readonly input: ByteArray;
        readonly output: ByteArray;
        connect(host: string, port: number): void;
        connectByUrl(url: string): void;
        protected cleanSocket(): void;
        protected onOpen(e: any): void;
        protected onMessage(msg: any): void;
        protected onClose(e: any): void;
        protected onError(e: any): void;
        send(data: string | ArrayBuffer): void;
        flush(): void;
        close(): void;
    }
}
declare module rf {
    type ResLoadHandler = (event: EventX) => void;
    enum LoadPriority {
        low = 0,
        middle = 1,
        high = 2,
        max = 3,
    }
    function loadRes(url: string | string[], complete?: ResLoadHandler, thisObj?: any, type?: ResType, priority?: LoadPriority, cache?: boolean, noDispose?: boolean, disposeTime?: number): void;
    class Res {
        private static _instance;
        static readonly instance: Res;
        maxLoader: number;
        private nowLoader;
        private _analyzerMap;
        private _loadMap;
        private _resMap;
        private _loadingMap;
        private constructor();
        load(url: string | string[], complete?: ResLoadHandler, thisObj?: any, type?: ResType, priority?: LoadPriority, cache?: boolean, noDispose?: boolean, disposeTime?: number): void;
        private loadNext();
        private doLoad(item);
        private doLoadComplete(loader, event);
        private clearRes();
    }
    enum ResType {
        bin = 0,
        text = 1,
        sound = 2,
        image = 3,
    }
    class ResItem {
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
    abstract class ResLoaderBase {
        protected _resItem: ResItem;
        protected _compFunc: Function;
        protected _thisObject: any;
        loadFile(resItem: ResItem, compFunc: Function, thisObject: any): void;
    }
    class ResBinLoader extends ResLoaderBase {
        protected _httpRequest: HttpRequest;
        constructor();
        protected getType(): HttpResponseType;
        loadFile(resItem: ResItem, compFunc: Function, thisObject: any): void;
        protected onComplete(event: EventX): void;
        protected onIOError(event: EventX): void;
    }
    class ResTextLoader extends ResBinLoader {
        protected getType(): HttpResponseType;
        protected onComplete(event: EventX): void;
    }
    class ResSoundLoader extends ResBinLoader {
        protected onComplete(event: EventX): void;
    }
    class ResImageLoader extends ResLoaderBase {
        loadFile(resItem: ResItem, compFunc: Function, thisObject: any): void;
    }
}
declare namespace rf {
    interface ICapabilities {
        readonly platform: string;
        readonly userAgent: string;
        readonly supportWebGL: boolean;
        readonly glVersion: string;
        readonly shadingLanguageVersion: string;
        readonly vendor: string;
        readonly renderer: string;
        readonly unMaskedVendor: string;
        readonly unMaskedRenderer: string;
        readonly antialias: boolean;
        readonly ANGLE: string;
        readonly maxVertexAttributes: number;
        readonly maxVertexTextureImageUnits: number;
        readonly maxVertexUniformVectors: number;
        readonly maxVaryingVectors: number;
        readonly aliasedLineWidthRange: Float32Array[];
        readonly aliasedPointSizeRange: Float32Array[];
        readonly maxFragmentUniformVectors: number;
        readonly maxTextureImageUnits: number;
        readonly maxTextureSize: number;
        readonly maxCubeMapTextureSize: number;
        readonly maxCombinedTextureImageUnits: number;
        readonly maxAnisotropy: number;
        readonly maxColorBuffers: number;
        readonly redBits: number;
        readonly greenBits: number;
        readonly blueBits: number;
        readonly alphaBits: number;
        readonly depthBits: number;
        readonly stencilBits: number;
        readonly maxRenderBufferSize: number;
        readonly maxViewportDimensions: Int32Array[];
        init(): void;
    }
    const Capabilities: ICapabilities;
}
declare module rf {
    type $CallbackInfo = CallbackInfo<Function>;
    class CallbackInfo<T extends Function> implements IRecyclable {
        callback: T;
        args: any[];
        thisObj: any;
        doRecycle: boolean;
        time: number;
        constructor();
        init(callback: T, thisObj?: any, args?: any[]): void;
        checkHandle(callback: T, thisObj: any): boolean;
        execute(doRecycle?: boolean): any;
        call(...args: any[]): any;
        callAndRecycle(...args: any[]): any;
        onRecycle(): void;
        recycle: {
            ();
        };
        static get<T extends Function>(callback: T, thisObj?: any, ...args: any[]): CallbackInfo<Function>;
        static addToList<T extends Function>(list: CallbackInfo<Function>[], handle: T, thisObj?: any, ...args: any[]): CallbackInfo<Function>;
    }
}
declare module rf {
    class BitmapSourceVO {
        name: string;
        used: number;
        time: number;
        source: BitmapSource;
        x: number;
        y: number;
        ix: number;
        iy: number;
        w: number;
        h: number;
        rw: number;
        rh: number;
        ul: number;
        ur: number;
        vt: number;
        vb: number;
        refreshUV(mw: number, mh: number): void;
    }
    class BitmapSourceArea {
        name: number;
        source: BitmapSource;
        frames: {
            [key: string]: BitmapSourceVO;
        };
        init(): void;
        getArea(name: string, x: number, y: number, w: number, h: number): BitmapSourceVO;
        createFrameArea(name: string, frame: IFrame): BitmapSourceVO;
        getEmptyArea(name: string, sw: number, sh: number): BitmapSourceVO;
        getUnusedArea(name: string, sw: number, sh: number): BitmapSourceVO;
    }
    class MixBitmapSourceArea extends BitmapSourceArea {
        l: number;
        r: number;
        t: number;
        b: number;
        maxRect: MaxRectsBinPack;
        init(): void;
        getEmptyArea(name: string, sw: number, sh: number): BitmapSourceVO;
    }
    class BitmapSource extends MiniDispatcher {
        static DEFAULT: number;
        static PACK: number;
        constructor();
        name: string;
        width: number;
        height: number;
        originU: number;
        originV: number;
        areas: {
            [name: number]: BitmapSourceArea;
        };
        bmd: BitmapData;
        create(name: string, bmd: BitmapData, pack?: boolean): BitmapSource;
        setArea(name: number, x: number, y: number, w: number, h: number): BitmapSourceArea;
        setSourceVO(name: string, w: number, h: number, area?: number): BitmapSourceVO;
        getSourceVO(name: string, area?: number): BitmapSourceVO;
    }
    let bitmapSources: {
        [key: string]: BitmapSource;
    };
    let componentSource: BitmapSource;
}
declare module rf {
    class Quaternion {
        x: number;
        y: number;
        z: number;
        w: number;
        constructor(x?: number, y?: number, z?: number, w?: number);
        static lerp(qa: Point3DW, qb: Point3DW, percent: number): Quaternion;
        fromMatrix3D(m: Matrix3D): this;
        toMatrix3D(target?: Matrix3D): Matrix3D;
        fromAxisAngle(axis: Point3DW, angleInRadians: number): void;
        conjugate(): void;
        toString(): string;
    }
}
declare module rf {
    let vertex_ui_variable: {
        [key: string]: {
            size: number;
            offset: number;
        };
    };
    let vertex_mesh_variable: {
        [key: string]: {
            size: number;
            offset: number;
        };
    };
    class VertexInfo {
        vertex: Float32Byte;
        numVertices: number;
        data32PerVertex: number;
        variables: {
            [key: string]: {
                size: number;
                offset: number;
            };
        };
        constructor(value: number | Float32Array, data32PerVertex: number);
        regVariable(variable: string, offset: number, size: number): void;
    }
    interface IGeometry {
        vertex: VertexInfo;
        index?: Uint16Array;
    }
}
declare module rf {
    var ROOT: Stage3D;
    interface IMouse {
        mouseEnabled?: boolean;
        mouseChildren?: boolean;
        getObjectByPoint?(dx: number, dy: number, scale: number): DisplayObject;
    }
    enum DChange {
        trasnform = 1,
        alpha = 2,
        vertex = 4,
        vcdata = 8,
        ct = 16,
        area = 32,
        ca = 64,
        c_all = 80,
        ac = 96,
        ta = 3,
        batch = 12,
        base = 35,
        t_all = 19,
    }
    class HitArea {
        left: number;
        right: number;
        top: number;
        bottom: number;
        front: number;
        back: number;
        clean(): void;
        combine(hitArea: HitArea, x: number, y: number): boolean;
        updateArea(x: number, y: number, z: number): boolean;
        checkIn(x: number, y: number, scale?: number): boolean;
        toString(): string;
    }
    class DisplayObject extends MiniDispatcher implements IMouse {
        hitArea: HitArea;
        mouseEnabled: boolean;
        mouseChildren: boolean;
        transformComponents: Vector3D[];
        pos: Vector3D;
        rot: Vector3D;
        sca: Vector3D;
        _x: number;
        _y: number;
        _z: number;
        _rotationX: number;
        _rotationY: number;
        _rotationZ: number;
        _scaleX: number;
        _scaleY: number;
        _scaleZ: number;
        _alpha: number;
        sceneAlpha: number;
        w: number;
        h: number;
        _visible: Boolean;
        states: number;
        pivotZero: boolean;
        pivotPonumber: Vector3D;
        transform: Matrix3D;
        sceneTransform: Matrix3D;
        parent: DisplayObjectContainer;
        stage: Stage3D;
        name: string;
        constructor();
        setChange(value: number, p?: number, c?: boolean): void;
        visible: Boolean;
        alpha: number;
        scaleX: number;
        scaleY: number;
        scaleZ: number;
        rotationX: number;
        rotationY: number;
        rotationZ: number;
        x: number;
        y: number;
        z: number;
        setPos(x: number, y: number, z?: number, update?: Boolean): void;
        eulers: Vector3D;
        forwardPos(distance: number, or?: Boolean): void;
        upPos(distance: number): void;
        rightPos(distance: number): void;
        setRot(rx: number, ry: number, rz: number, update?: Boolean): void;
        setRotRadians(rx: number, ry: number, rz: number, update?: Boolean): void;
        scale: number;
        setSca(sx: number, sy: number, sz: number, update?: Boolean): void;
        setPivotPonumber(x: number, y: number, z: number): void;
        setTransform(matrix: Matrix3D): void;
        updateTransform(): void;
        updateSceneTransform(sceneTransform: Matrix3D): void;
        updateAlpha(sceneAlpha: number): void;
        remove(): void;
        addToStage(): void;
        removeFromStage(): void;
        setSize(width: number, height: number): void;
        protected invalidateFuncs: Function[];
        protected invalidate(func?: Function): void;
        protected invalidateRemove(func?: Function): void;
        protected onInvalidate(event: EventX): void;
        protected doResize(): void;
        dispatchEvent(event: EventX): boolean;
        updateHitArea(): void;
        getObjectByPoint(dx: number, dy: number, scale: number): DisplayObject;
    }
}
declare module rf {
    class DisplayObjectContainer extends DisplayObject {
        constructor();
        setChange(value: number, p?: number, c?: boolean): void;
        childrens: DisplayObject[];
        readonly numChildren: number;
        addChild(child: DisplayObject): void;
        addChildAt(child: DisplayObject, index: number): void;
        getChildIndex(child: DisplayObject): number;
        removeChild(child: DisplayObject): void;
        removeAllChild(): void;
        removeFromStage(): void;
        addToStage(): void;
        updateTransform(): void;
        updateSceneTransform(): void;
        updateAlpha(sceneAlpha: number): void;
    }
}
declare module rf {
    class Camera extends DisplayObject implements IResizeable {
        len: Matrix3D;
        far: number;
        worldTranform: Matrix3D;
        constructor(far?: number);
        resize(width: number, height: number): void;
    }
    class Camera2D extends Camera {
        resize(width: number, height: number): void;
        updateSceneTransform(sceneTransform?: Matrix3D): void;
    }
}
declare module rf {
    interface I3DRender extends IRecyclable {
        render?(camera: Camera, now: number, interval: number, target?: Sprite): void;
    }
    class Sprite extends DisplayObjectContainer implements I3DRender {
        source: BitmapSource;
        variables: {
            [key: string]: {
                size: number;
                offset: number;
            };
        };
        renderer: I3DRender;
        batcherAvailable: boolean;
        $graphics: Graphics;
        $batchGeometry: BatchGeometry;
        $vcIndex: number;
        $vcox: number;
        $vcoy: number;
        $vcos: number;
        constructor(source?: BitmapSource, variables?: {
            [key: string]: {
                size: number;
                offset: number;
            };
        });
        readonly graphics: Graphics;
        setChange(value: number, p?: number, c?: boolean): void;
        render(camera: Camera, now: number, interval: number): void;
        addToStage(): void;
        cleanAll(): void;
        updateHitArea(): void;
        getObjectByPoint(dx: number, dy: number, scale: number): DisplayObject;
    }
    class Image extends Sprite {
        _url: string;
        constructor();
        load(url: string): void;
        onImageComplete(e: EventX): void;
    }
    class Graphics {
        target: Sprite;
        byte: Float32Byte;
        hitArea: HitArea;
        numVertices: number;
        variables: {
            [key: string]: {
                size: number;
                offset: number;
            };
        };
        $batchOffset: number;
        private preNumVertices;
        constructor(target: Sprite, variables: {
            [key: string]: {
                size: number;
                offset: number;
            };
        });
        clear(): void;
        end(): void;
        drawRect(x: number, y: number, width: number, height: number, color: number, alpha?: number, matrix?: Float32Array, z?: number): void;
        drawBitmap(x: number, y: number, vo: BitmapSourceVO, color?: number, matrix?: Float32Array, alpha?: number, z?: number): void;
    }
    abstract class RenderBase implements I3DRender {
        triangleFaceToCull: string;
        sourceFactor: number;
        destinationFactor: number;
        depthMask: boolean;
        passCompareMode: number;
        render(camera: Camera, now: number, interval: number): void;
        constructor();
    }
    class BatchRenderer extends RenderBase implements I3DRender {
        target: Sprite;
        renders: Link;
        geo: BatchGeometry;
        program: Program3D;
        worldTransform: Matrix3D;
        t: Texture;
        constructor(target: Sprite);
        render(camera: Camera, now: number, interval: number): void;
        dc(geo: BatchGeometry): void;
        createProgram(): void;
        cleanBatch(): void;
        getBatchTargets(target: Sprite, ox: number, oy: number, os: number): void;
        updateVCData(target: Sprite, ox: number, oy: number, os: number): void;
        toBatch(): void;
    }
    class BatchGeometry implements I3DRender, IGeometry {
        vertex: VertexInfo;
        $vertexBuffer: VertexBuffer3D;
        quadcount: number;
        vcData: Float32Byte;
        vci: number;
        link: Link;
        verlen: number;
        constructor();
        add(target: Sprite, g: Graphics): number;
        build(target: Sprite): void;
        update(position: number, byte: Float32Byte): void;
        updateVC(sp: Sprite): void;
        onRecycle(): void;
    }
}
declare module rf {
    enum VA {
        pos = "pos",
        normal = "normal",
        tangent = "tangent",
        color = "color",
        uv = "uv",
    }
    enum FS {
        diff = "diff",
    }
    enum VC {
        mv = "mv",
        p = "p",
        mvp = "mvp",
        ui = "ui",
    }
    class Buffer3D implements IRecyclable {
        preusetime: number;
        readly: boolean;
        constructor();
        awaken(): void;
        sleep(): void;
        onRecycle(): void;
    }
    class Program3D extends Buffer3D {
        program: WebGLProgram;
        private vShader;
        private fShader;
        vertexCode: string;
        fragmentCode: string;
        constructor();
        awaken(): boolean;
        dispose(): void;
        onRecycle(): void;
        private createShader(code, type);
    }
    class VertexBuffer3D extends Buffer3D {
        numVertices: number;
        data32PerVertex: number;
        data: VertexInfo;
        buffer: WebGLBuffer;
        constructor();
        onRecycle(): void;
        awaken(): boolean;
        uploadFromVector(data: number[] | Float32Array | VertexInfo, startVertex?: number, numVertices?: number): void;
        uploadContext(program: Program3D): void;
    }
    class IndexBuffer3D extends Buffer3D {
        numIndices: number;
        data: Uint16Array;
        buffer: WebGLBuffer;
        quadid: number;
        constructor();
        onRecycle(): void;
        awaken(): boolean;
        uploadFromVector(data: number[] | Uint16Array, startOffset?: number, count?: number): void;
    }
    class Texture extends Buffer3D {
        key: number | string;
        texture: WebGLTexture;
        mipmap: boolean;
        width: number;
        height: number;
        pixels: ImageBitmap | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement | BitmapData;
        constructor();
        awaken(): boolean;
        uploadContext(program: Program3D, index: number, variable: string): void;
        onRecycle(): void;
    }
    class RttTexture extends Texture {
        create(width: number, height: number): void;
    }
}
declare namespace rf {
    let context3D: Context3D;
    enum Context3DTextureFormat {
        BGRA = "bgra",
    }
    enum Context3DVertexBufferFormat {
        BYTES_4 = 4,
        FLOAT_1 = 1,
        FLOAT_2 = 2,
        FLOAT_3 = 3,
        FLOAT_4 = 4,
    }
    enum Context3DTriangleFace {
        BACK = "back",
        FRONT = "front",
        FRONT_AND_BACK = "frontAndBack",
        NONE = "none",
    }
    class Context3D {
        private _clearBit;
        private _bendDisabled;
        private _depthDisabled;
        constructor();
        configureBackBuffer(width: number, height: number, antiAlias: number, enableDepthAndStencil?: boolean): void;
        createVertexBuffer(data: number[] | Float32Array | VertexInfo, data32PerVertex?: number, startVertex?: number, numVertices?: number): VertexBuffer3D;
        private indexs;
        private indexByte;
        private initIndexByQuadCount(count);
        getIndexByQuad(quadCount: number): IndexBuffer3D;
        createIndexBuffer(data: number[] | Uint16Array): IndexBuffer3D;
        textureObj: {
            [key: string]: Texture;
        };
        createTexture(key: string, pixels: ImageBitmap | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement | BitmapData, mipmap?: boolean): Texture;
        createEmptyTexture(key: string, width: number, height: number, mipmap?: boolean): Texture;
        private _rttFramebuffer;
        setRenderToTexture(texture: Texture, enableDepthAndStencil?: boolean, antiAlias?: number, surfaceSelector?: number, colorOutputIndex?: number): void;
        setRenderToBackBuffer(): void;
        programs: {
            [key: string]: Recyclable<Program3D>;
        };
        createProgram(vertexCode: string, fragmentCode: string, key?: string): Recyclable<Program3D>;
        setProgramConstantsFromVector(variable: string, data: number[] | Float32Array, format: number): void;
        setProgramConstantsFromMatrix(variable: string, matrix: Matrix3D): void;
        private _linkedProgram;
        setProgram(program: Program3D): void;
        clear(red?: number, green?: number, blue?: number, alpha?: number, depth?: number, stencil?: number, mask?: number): void;
        setCulling(triangleFaceToCull: string): void;
        setDepthTest(depthMask: boolean, passCompareMode: number): void;
        setBlendFactors(sourceFactor: number, destinationFactor: number): void;
        drawTriangles(indexBuffer: IndexBuffer3D, firstIndex?: number, numTriangles?: number): void;
        drawLines(indexBuffer: IndexBuffer3D, firstIndex?: number, numLines?: number): void;
        drawPoints(indexBuffer: IndexBuffer3D, firstIndex?: number, numPoints?: number): void;
        drawLineLoop(indexBuffer: IndexBuffer3D, firstIndex?: number, numPoints?: number): void;
        drawLineStrip(indexBuffer: IndexBuffer3D, firstIndex?: number, numPoints?: number): void;
        drawTriangleStrip(indexBuffer: IndexBuffer3D): void;
        drawTriangleFan(indexBuffer: IndexBuffer3D): void;
        present(): void;
    }
    function webGLSimpleReport(): Object;
}
declare module rf {
    class Stage3D extends Sprite implements IResizeable {
        static names: string[];
        canvas: HTMLCanvasElement;
        camera2D: Camera2D;
        mouse: Mouse;
        constructor();
        requestContext3D(canvas: HTMLCanvasElement): boolean;
        private webglContextLostHandler(e);
        private webglContextRestoredHandler(e);
        update(now: number, interval: number): void;
        resize(width: number, height: number): void;
    }
}
declare module rf {
    class AppBase implements ITickable, IResizeable {
        constructor();
        init(canvas?: HTMLCanvasElement): void;
        createSource(): void;
        update(now: number, interval: number): void;
        resize(width: number, height: number): void;
    }
}
declare module rf {
    let emote_images: {
        [key: string]: Image;
    };
    class TextFormat {
        family: string;
        oy: number;
        size: number;
        bold: string;
        italic: string;
        stroke: {
            size: number;
            color?: number;
        };
        shadow: {
            color: number;
            blur: number;
            offsetX?: number;
            offsetY?: number;
        };
        gradient: {
            color: number;
            percent?: number;
        }[];
        font: string;
        init(): TextFormat;
        test(context: CanvasRenderingContext2D, text: string, out: {
            x: number;
            y: number;
        }): void;
        draw(context: CanvasRenderingContext2D, text: string, s: Size): void;
        private getColorStr(color);
        clone(format?: TextFormat): TextFormat;
    }
    class TextField extends Sprite {
        html: boolean;
        $text: string;
        format: TextFormat;
        color: number;
        element: HtmlElement;
        gap: number;
        wordWrap: boolean;
        init(source?: BitmapSource, format?: TextFormat): void;
        private lines;
        private textLines;
        text: string;
        cleanAll(): void;
        layout(): void;
        getCharSourceVO(char: string, format: TextFormat): BitmapSourceVO;
        tranfromHtmlElement2CharDefine(html: HtmlElement, width?: number): Recyclable<Line>[];
    }
    class ImageVO {
        x: number;
        y: number;
        w: number;
        h: number;
        tag: string;
        name: string;
        display: Sprite;
        clone(vo?: ImageVO): ImageVO;
        dispose(): void;
    }
    class HtmlElement {
        newline: boolean;
        str: string;
        start: number;
        color: number;
        format: TextFormat;
        underline: boolean;
        image: Sprite;
        imageTag: number;
        w: number;
        h: number;
        pre: HtmlElement;
        next: HtmlElement;
        createAndCopyFormat(last?: HtmlElement, newline?: boolean): HtmlElement;
        clear(): void;
    }
    function formatHtml(value: string, html: HtmlElement, source: BitmapSource): void;
    class Char implements IRecyclable {
        index: number;
        name: string;
        ox: number;
        sx: number;
        ex: number;
        element: HtmlElement;
        display: BitmapSourceVO | Sprite;
        w: number;
        h: number;
        onRecycle(): void;
    }
    class Line {
        w: number;
        h: number;
        chars: Recyclable<Char>[];
    }
    class TextLine extends Sprite {
        line: Line;
        renderText(line: Line): void;
    }
    class TextALink extends TextField {
    }
}
declare module rf {
}
declare module rf {
    const enum Orientation3D {
        EULER_ANGLES = 0,
        AXIS_ANGLE = 1,
        QUATERNION = 2,
    }
}
declare module rf {
    class PerspectiveMatrix3D extends Matrix3D {
        lookAtLH(eye: Point3DW, at: Point3DW, up: Point3DW): void;
        lookAtRH(eye: Point3DW, at: Point3DW, up: Point3DW): void;
        perspectiveOffCenterLH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): void;
        perspectiveLH(width: number, height: number, zNear: number, zFar: number): void;
        perspectiveFieldOfViewLH(fieldOfViewY: number, aspectRatio: number, zNear: number, zFar: number): void;
        orthoOffCenterLH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): void;
        orthoLH(width: number, height: number, zNear: number, zFar: number): void;
        perspectiveOffCenterRH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): void;
        perspectiveRH(width: number, height: number, zNear: number, zFar: number): void;
        perspectiveFieldOfViewRH(fieldOfViewY: number, aspectRatio: number, zNear: number, zFar: number): void;
        orthoOffCenterRH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): void;
        orthoRH(width: number, height: number, zNear: number, zFar: number): void;
    }
}
declare module rf {
    class Mouse {
        init(): void;
        preMouseTime: number;
        preMoveTime: number;
        preTarget: DisplayObject;
        clickTarget: DisplayObject;
        preMouseDownTime: number;
        mouseHanlder(e: MouseEvent): void;
        preRolled: DisplayObject;
        preMouseMoveTime: number;
        mouseMoveHandler(e: MouseEvent): void;
        touchHandler(e: TouchEvent): void;
    }
}
declare module rf {
    interface IEaseFunction {
        (t: number, ...args: any[]): number;
    }
    class Ease {
        static getValue(v0: number, v1: number, ratio: number): number;
        static get(amount: number): IEaseFunction;
        static getPowIn(pow: number): IEaseFunction;
        static getPowOut(pow: number): IEaseFunction;
        static getPowInOut(pow: number): IEaseFunction;
        static quadIn: IEaseFunction;
        static quadOut: IEaseFunction;
        static quadInOut: IEaseFunction;
        static cubicIn: IEaseFunction;
        static cubicOut: IEaseFunction;
        static cubicInOut: IEaseFunction;
        static quartIn: IEaseFunction;
        static quartOut: IEaseFunction;
        static quartInOut: IEaseFunction;
        static quintIn: IEaseFunction;
        static quintOut: IEaseFunction;
        static quintInOut: IEaseFunction;
        static sineIn(t: number): number;
        static sineOut(t: number): number;
        static sineInOut(t: number): number;
        static getBackIn(amount: number): IEaseFunction;
        static backIn: IEaseFunction;
        static getBackOut(amount: number): IEaseFunction;
        static backOut: IEaseFunction;
        static getBackInOut(amount: number): IEaseFunction;
        static backInOut: IEaseFunction;
        static circIn(t: number): number;
        static circOut(t: number): number;
        static circInOut(t: number): number;
        static bounceIn(t: number): number;
        static bounceOut(t: number): number;
        static bounceInOut(t: number): number;
        static getElasticIn(amplitude: number, period: number): IEaseFunction;
        static elasticIn: IEaseFunction;
        static getElasticOut(amplitude: number, period: number): IEaseFunction;
        static elasticOut: IEaseFunction;
        static getElasticInOut(amplitude: number, period: number): IEaseFunction;
        static elasticInOut: IEaseFunction;
    }
}
declare module rf {
    interface ITweenPlugin {
        priority?: number;
        init(tween: Tween, prop: string, value: any): any;
        tween(tween: Tween, prop: string, value: any, startValues: {
            [index: string]: any;
        }, endValues: {
            [index: string]: any;
        }, ratio: number, wait: boolean, end: boolean): any;
        step(tween: Tween, prop: string, startValue: any, endValue: any, injectProps: any): any;
    }
}
declare module rf {
    interface MotionGuidePluginTween extends Tween {
        __needsRot: boolean;
        __rotGlobalS: number;
        __rotGlobalE: number;
        __rotPathE: number;
        __rotPathS: number;
        __guideData: any;
    }
    interface MotionGuidePluginTarget {
        x?: number;
        y?: number;
        rotation?: number;
    }
    const MotionGuidePlugin: {
        priority: number;
        install(manager: TweenManager): void;
        init(tween: MotionGuidePluginTween, prop: string, value: any): any;
        step(tween: MotionGuidePluginTween, prop: string, startValue: any, endValue: any, injectProps: any): any;
        tween(tween: MotionGuidePluginTween, prop: string, value: any, startValues: any, endValues: any, ratio: number, wait: boolean, end: boolean): any;
    };
}
declare module rf {
    const enum TweenActionMode {
        NONE = 0,
        LOOP = 1,
        REVERSE = 2,
    }
    interface TweenAction {
        f: Function;
        o: Object;
        t?: number;
        p: any[];
    }
    interface TweenStep {
        t: number;
        p0: Object;
        p1: Object;
        e: IEaseFunction;
        d: number;
        v?: boolean;
    }
    interface TweenOption {
        loop?: boolean;
        useTicks?: boolean;
        ignoreGlobalPause?: boolean;
        override?: boolean;
        paused?: boolean;
        position?: number;
        onChange?: {
            (e?: EventX);
        };
        onChangeObj?: any;
        int?: {
            [index: string]: number;
        };
    }
    class Tween extends MiniDispatcher {
        static IGNORE: {};
        protected _manager: TweenManager;
        target: any;
        _registered: boolean;
        _useTicks: boolean;
        ignoreGlobalPause: boolean;
        loop: boolean;
        pluginData: any;
        _curQueueProps: any;
        protected _initQueueProps: {
            [index: string]: any;
        };
        protected _steps: TweenStep[];
        protected _actions: TweenAction[];
        paused: boolean;
        duration: number;
        protected _prevPos: number;
        position: number;
        protected _prevPosition: number;
        protected _stepPosition: number;
        protected _int: {
            [index: string]: number;
        };
        passive: boolean;
        constructor(target: any, props: TweenOption, pluginData: any, manager: TweenManager);
        private initialize(target, props, pluginData, manager);
        setPosition(value: number, actionsMode?: TweenActionMode): boolean;
        private _runActions(startPos, endPos, includeStart?);
        private _updateTargetProps(step, ratio);
        private _addStep(o);
        private _appendQueueProps(o);
        private _addAction(o);
        private _set(props, o);
        setPaused(value: boolean): Tween;
        wait(duration: number, passive?: boolean): Tween;
        to(props: Object, duration?: number, ease?: IEaseFunction): Tween;
        call(callback: Function, thisObj?: any, ...params: any[]): Tween;
        set(props: any, target?: any): Tween;
        play(tween?: Tween): Tween;
        pause(tween?: Tween): Tween;
        tick(delta: number): void;
        onRecycle(): void;
    }
}
declare module rf {
    class TweenManager {
        protected _tweens: Tween[];
        _plugins: {
            [index: string]: ITweenPlugin[];
        };
        get(target: any, props?: TweenOption, pluginData?: any, override?: boolean): Tween;
        removeTweens(target: any): void;
        removeTween(twn: Tween): void;
        pauseTweens(target: any): void;
        resumeTweens(target: any): void;
        tick(delta: number, paused?: boolean): void;
        _register(tween: Tween, value?: boolean): void;
        removeAllTweens(): void;
        hasActiveTweens(target: any): boolean;
        installPlugin(plugin: ITweenPlugin, properties: string[]): void;
    }
}
declare module rf {
    class Dc_Texture {
        private vertexData;
        private indexData;
        private vertexInfo;
        private vertexCode;
        private fragmentCode;
        private _url;
        private image;
        constructor();
        private onComplete(e);
        private init();
        private renderWebGL();
        private renderNow();
        private render3();
    }
}
declare module rf {
    class MaxRectsTest {
        private _urls;
        private _count;
        private _images;
        constructor();
        private onComplete(event);
        private drawMaxRect();
    }
}
declare module rf {
    class TextTest {
        constructor();
    }
}
declare module rf {
    class WebglTest implements IResizeable {
        constructor();
        render2(): void;
        render(): void;
        loadImage(): void;
        protected renderImage(event: EventX): void;
        resize(width: number, height: number): void;
    }
}
declare module rf {
    let sp: any;
    class Main extends AppBase {
        constructor();
        init(canvas?: HTMLCanvasElement): void;
        linktest(): void;
        engineTest(): void;
        callLaterTest(): void;
        netTest(): void;
        bitmapDataTest(): void;
        private resTest();
        arrayTest(value: number): void;
        caleTest(value: number): void;
        functionTest(value: number): void;
    }
}
