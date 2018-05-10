declare let RELEASE: any;
declare let DEBUG: any;
declare module rf {
    var ClientCheck: {
        isClientCheck: boolean;
    };
    /**
     * 错误前缀
     */
    var errorPrefix: string;
    interface ThrowError {
        (msg: string, err?: Error, alert?: boolean): void;
        MaxCount?: number;
        errorMsg?: string[];
    }
    var Log: {
        (...msg): void;
    };
    /**
     * 抛错
     * @param {string | Error}  msg 描述
     **/
    const ThrowError: ThrowError;
}
declare function parseInt(s: number, radix?: number): number;
declare class Zlib {
    static Inflate: any;
}
/**
 * 对数字进行补0操作
 * @param value 要补0的数值
 * @param length 要补的总长度
 * @return 补0之后的字符串
 */
declare function zeroize(value: number | string, length?: number): string;
/**
 * 获取完整的 PropertyDescriptor
 *
 * @param {Partial<PropertyDescriptor>} descriptor
 * @param {boolean} [enumerable=false]
 * @param {boolean} [writable]
 * @param {boolean} [configurable=true]
 * @returns
 */
declare function getDescriptor(descriptor: PropertyDescriptor, enumerable?: boolean, writable?: boolean, configurable?: boolean): PropertyDescriptor;
declare function makeDefDescriptors(descriptors: object, enumerable?: boolean, writable?: boolean, configurable?: boolean): PropertyDescriptorMap;
/****************************************扩展Object****************************************/
interface Object {
    /**
     * 返回一个浅副本的对象
     * 此对象会拷贝key value
     *
     * @memberOf Object
     */
    clone(): Object;
    /**
     * 将数据拷贝到 to
     * @param to 目标
     */
    copyto(to: Object): any;
    /**
     * 获取指定属性的描述，会查找当前数据和原型数据
     * @param property 指定的属性名字
     */
    getPropertyDescriptor(property: string): PropertyDescriptor;
    /**
     * 检查两个对象是否相等，只检查一层
     *
     * @param {object} checker
     * @param {...(keyof this)[]} args  如果不设置key列表，则使用checker可遍历的key进行检查
     *
     * @memberOf Object
     */
    equals(checker: object, ...args: (keyof this)[]): any;
    /**
     *
     * 拷贝指定的属性到目标对象
     * @param {object} to           目标对象
     * @param {...string[]} proNames   指定的属性
     */
    copyWith<T>(this: T, to: object, ...proNames: (keyof T)[]): void;
    /**
     *
     * 获取指定的属性的Object
     * @param {...string[]} proNames 指定的属性
     * @returns {object}
     */
    getSpecObject<T>(this: T, ...proNames: (keyof T)[]): object;
}
interface Float32Array {
    x: number;
    y: number;
    z: number;
    w: number;
    update(data32PerVertex: number, offset: number, v: number): void;
    wPoint1(position: number, x: number, y?: number, z?: number, w?: number): void;
    wPoint2(position: number, x: number, y: number, z?: number, w?: number): void;
    wPoint3(position: number, x: number, y: number, z: number, w?: number): void;
    wPoint4(position: number, x: number, y: number, z: number, w: number): void;
    clone(): Float32Array;
}
interface Function {
    /**
     * 检查当前类型是否是测试的类型的子类
     *
     * @param {Function} testBase
     * @returns {boolean}
     *
     * @memberOf Object
     */
    isSubClass(testBase: Function): boolean;
}
/****************************************扩展Math****************************************/
interface Math {
    /**
     * 让数值处于指定的最大值和最小值之间，低于最小值取最小值，高于最大值取最大值
     * @param value 要处理的数值
     * @param min   最小值
     * @param max   最大值
     */
    clamp(value: number, min: number, max: number): number;
    /**
     * 从最小值到最大值之间随机[min,max)
     */
    random2(min: number, max: number): number;
    /**
     * 从中间值的正负差值 之间随机 [center-delta,center+delta)
     *
     * @param {number} center
     * @param {number} delta
     * @returns {number}
     * @memberof Math
     */
    random3(center: number, delta: number): number;
    /**
     * 角度转弧度的乘数
     * Math.PI / 180
     * @type {number}
     * @memberOf Math
     */
    DEG_TO_RAD: number;
    /**
     * 弧度转角度的乘数
     * 180 / Math.PI
     */
    RAD_TO_DEG: number;
    /**
     * 整圆的弧度
     */
    PI2: number;
    /**
     * 90°的弧度
     *
     * @type {number}
     * @memberOf Math
     */
    PI_1_2: number;
}
/****************************************扩展Number********************************************/
interface NumberConstructor {
    /**
     * 是否为安全整数
     *
     * @param {number} value
     * @returns {boolean}
     *
     * @memberOf Number
     */
    isSafeInteger(value: number): boolean;
}
interface Number {
    /**
     * 对数字进行补0操作
     * @param length 要补的总长度
     * @return 补0之后的字符串
     */
    zeroize(length: number): string;
    /**
     * 数值介于，`min` `max`直接，包含min，max
     * 即：[min,max]
     *
     * @param {number} min
     * @param {number} max
     * @returns {boolean}
     * @memberof Number
     */
    between(min: number, max: number): boolean;
}
/****************************************扩展String****************************************/
interface String {
    /**
     * 替换字符串中{0}{1}{2}{a} {b}这样的数据，用obj对应key替换，或者是数组中对应key的数据替换
     */
    trim(): string;
    substitute(...args: any[]): string;
    substitute(args: any[]): string;
    /**
     * 对数字进行补0操作
     * @param length 要补的总长度
     * @return 补0之后的字符串
     */
    zeroize(length: number): string;
    /**
     * 将一个字符串转换成一个很小几率重复的数值
     * <font color="#ff0000">此方法hash的字符串并不一定唯一，慎用</font>
     */
    hash(): number;
    /**
     * 获取字符串长度，中文方块字符算两个长度
     */
    trueLength(): number;
}
interface StringConstructor {
    /**
     * 对数字进行补0操作
     * @param value 要补0的数值
     * @param length 要补的总长度
     * @return 补0之后的字符串
     */
    zeroize: (value: number, length: number) => string;
    /**
     * 注册substitute的回调
     *
     * @param {string} key
     * @param {{ (input: any): string }} handler
     *
     * @memberOf StringConstructor
     */
    regSubHandler(key: string, handler: {
        (input: any): string;
    }): any;
    /**
     * substitute的回调函数
     *
     * @type {Readonly<{ [index: string]: { (input: any): string } }>}
     * @memberOf StringConstructor
     */
    subHandler: Readonly<{
        [index: string]: {
            (input: any): string;
        };
    }>;
}
/****************************************扩展Date****************************************/
interface Date {
    /**
     * 格式化日期
     *
     * @param {string} mask 时间字符串
     * @param {boolean} [local] 是否基于本地时间显示，目前项目，除了报错信息，其他时间都用UTC时间显示
     * @returns {string} 格式化后的时间
     */
    format(mask: string, local?: boolean): string;
}
/****************************************扩展Array****************************************/
declare const enum ArraySort {
    /**
     * 升序
     */
    ASC = 0,
    /**
     * 降序
     */
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
    /**
     * 如果数组中没有要放入的对象，则将对象放入数组
     *
     * @param {T} t 要放入的对象
     * @returns {number} 放入的对象，在数组中的索引
     *
     * @memberof Array
     */
    pushOnce(t: T): number;
    /**
    *
    * 删除某个数据
    * @param {T} t
    * @returns {boolean}   true 有这个数据并且删除成功
    *                      false 没有这个数据
    */
    remove(t: T): boolean;
    /**
     * 排序 支持多重排序
     * 降序, 升序
     * @param {(keyof T)[]} kArr              参数属性列表
     * @param {(boolean[] | ArraySort[])} [dArr] 是否降序，默认升序
     * @returns {this}
     *
     * @memberOf Array
     */
    multiSort(kArr: (keyof T)[], dArr?: boolean[] | ArraySort[]): this;
    /**
     * 默认排序
     *
     * @param {string} [key]
     * @param {boolean} [descend]
     *
     * @memberOf Array
     */
    doSort(key?: keyof T, descend?: boolean | ArraySort): this;
    doSort(descend?: boolean | ArraySort, key?: keyof T): this;
    /**
     * 将数组克隆到to
     * to的数组长度会和当前数组一致
     *
     * @template T
     * @param {Array<T>} to
     */
    cloneTo<T>(to: Array<T>): any;
    /**
     * 将数组附加到to中
     *
     * @template T
     * @param {Array<T>} to
     *
     * @memberOf ArrayConstructor
     */
    appendTo<T>(to: Array<T>): any;
}
declare module rf {
    function getQualifiedClassName(value: any): string;
    function getQualifiedSuperclassName(value: any): string;
    function is(instance: any, ref: {
        new (): any;
    }): boolean;
    function toString(instance: any, defaultValue?: string): string;
}
declare module rf {
    let gl: WebGLRenderingContext;
    var stageWidth: number;
    var stageHeight: number;
    var isWindowResized: boolean;
    var max_vc: number;
    let c_white: string;
    let pixelRatio: number;
    const enum ExtensionDefine {
        JPG = ".jpg",
        PNG = ".png",
        KM = ".km",
        DAT = ".dat",
        P3D = ".p3d",
        PARTICLE = ".pa",
        SKILL = ".sk",
        KF = ".kf",
    }
    function isPowerOfTwo(n: number): boolean;
    const enum WebGLConst {
        ONE = 1,
        /**
         * Passed to `blendFunc` or `blendFuncSeparate` to multiply a component by the source's alpha.
         */
        SRC_ALPHA = 770,
        /**
         * Passed to `blendFunc` or `blendFuncSeparate` to multiply a component by one minus the source's alpha.
         */
        ONE_MINUS_SRC_ALPHA = 771,
        NONE = 0,
        /**
         * Passed to `cullFace` to specify that only back faces should be drawn.
         */
        BACK = 1029,
        /**
         *
         */
        CLAMP_TO_EDGE = 33071,
        /**
         *
         */
        NEAREST = 9728,
        /**
         * Passed to `depthFunction` or `stencilFunction` to specify depth or stencil tests will always pass. i.e. Pixels will be drawn in the order they are drawn.
         */
        ALWAYS = 519,
        /**
         * Passed to `depthFunction` or `stencilFunction` to specify depth or stencil tests will pass if the new depth value is less than or equal to the stored value.
         */
        LEQUAL = 515,
    }
}
declare const rf_v3_identity: number[];
declare const rf_m3_identity: number[];
declare const rf_m2_identity: number[];
declare const rf_m3_temp: Float32Array;
interface IArrayBase {
    clone(): IArrayBase;
    set(array: ArrayLike<number> | IArrayBase, offset?: number): void;
    readonly length: number;
    [n: number]: number;
}
interface IMatrix3D extends IArrayBase {
    m3_identity(): any;
    m3_append(m3: ArrayLike<number> | IArrayBase, prepend?: boolean, from?: ArrayLike<number>): any;
    m3_rotation(degrees: number, axis: IVector3D | number[], prepend?: boolean, from?: ArrayLike<number>): any;
    m3_scale(x: number, y: number, z: number, prepend?: boolean, from?: ArrayLike<number>): any;
    m3_translation(x: number, y: number, z: number, prepend?: boolean, from?: ArrayLike<number>): any;
    m3_invert(from?: ArrayLike<number>): any;
    m3_decompose(pos: IVector3D | number[], rot: IVector3D | number[], sca: IVector3D | number[], orientationStyle?: number): any;
    m3_recompose(pos: IVector3D | number[], rot: IVector3D | number[], sca: IVector3D | number[], orientationStyle?: number): any;
    m3_copyColumnFrom(column: number, vector3D: IVector3D | number[]): any;
    m3_copyColumnTo(column: number, vector3D: IVector3D | number[]): any;
    m3_transformVector(v: IVector3D | number[], result?: IVector3D | number[]): any;
    m3_transformVectors(vin: ArrayLike<number>, vout: Float32Array | number[]): any;
    m3_transformRotation(v: IVector3D | number[], result?: IVector3D | number[]): any;
}
interface IVector3D extends IArrayBase {
    x: number;
    y: number;
    z: number;
    w: number;
    v3_lengthSquared: number;
    v3_length: number;
    v3_add(v: IVector3D | ArrayLike<number>): IVector3D;
    v3_sub(v: IVector3D | ArrayLike<number>): IVector3D;
    v3_scale(v: number): any;
    v3_normalize(from?: ArrayLike<number>): any;
    v3_dotProduct(t: ArrayLike<number>): any;
    v3_crossProduct(t: ArrayLike<number>, out?: IVector3D | number[]): any;
}
interface IMatrix extends IArrayBase {
    m2_identity(): any;
}
interface Float32Array extends IMatrix3D, IMatrix, IVector3D {
}
declare module rf {
    const enum Orientation3D {
        EULER_ANGLES = 0,
        AXIS_ANGLE = 1,
        QUATERNION = 2,
    }
    function newMatrix3D(v?: ArrayLike<number> | ArrayBuffer): Float32Array;
    function newMatrix(v?: ArrayLike<number> | ArrayBuffer): Float32Array;
    function newVector3D(x?: ArrayLike<number> | ArrayBuffer | number, y?: number, z?: number, w?: number): Float32Array;
}
declare module rf {
    type PosKey = "x" | "y";
    type SizeKey = "width" | "height";
    /**
         * 包含 x,y两个点的结构
         *
         * @export
         * @interface Point2D
         */
    interface Point2D {
        x: number;
        y: number;
    }
    /**
     * 包含 x,y,z 三个点的结构
     *
     * @export
     * @interface Point3D
     * @extends {Point2D}
     */
    interface Point3D extends Point2D {
        z: number;
    }
    /**
     * 包含 x,y,z,w 四个点的结构
     *
     * @export
     * @interface Point3DW
     * @extends {Point3D}
     */
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
        hex?: number;
    }
    let rgb_color_temp: IColor;
    function hexToCSS(d: number, a?: number): string;
    function toRGB(color: number, out?: IColor): IColor;
    function toCSS(color: IColor): string;
    function newColor(hex: number): IColor;
    /**
     * 有 `x` `y` 两个属性
     *
     * @export
     * @interface Point
     */
    class Point {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        readonly length: Number;
    }
    /**
     * 矩形
     * 有`x`,`y`,`width`,`height` 4个属性
     *
     * @export
     * @interface Rect
     * @extends {Point}
     * @extends {Size}
     */
    class Rect extends Point {
        w: number;
        h: number;
        constructor(x?: number, y?: number, w?: number, h?: number);
        clone(): Rect;
    }
    let RADIANS_TO_DEGREES: number;
    let DEGREES_TO_RADIANS: number;
    let tempAxeX: IVector3D;
    let tempAxeY: IVector3D;
    let tempAxeZ: IVector3D;
    let X_AXIS: IVector3D;
    let Y_AXIS: IVector3D;
    let Z_AXIS: IVector3D;
    let PI2: number;
    let RAW_DATA_CONTAINER: Float32Array;
    let TEMP_MATRIX: IMatrix3D;
    let TEMP_VECTOR3D: IVector3D;
    let TEMP_DECOMPOSE: IVector3D[];
    /**
    * 经纬度 定位信息
    *
    * @export
    * @interface Location
    */
    interface Location {
        /**维度*/
        latitude: number;
        /**精度*/
        longitude: number;
    }
    interface LocationConstructor {
        /**
         * 根据两个经纬度获取距离(单位：米)
         *
         * @param {Location} l1
         * @param {Location} l2
         * @returns 距离(单位：米)
         */
        getDist(l1: Location, l2: Location): number;
    }
    var Location: LocationConstructor;
    let EMPTY_POINT2D: Point;
    let EMPTY_POINT2D_2: Point;
    let EMPTY_POINT2D_3: Point;
    function m2dTransform(matrix: ArrayLike<number>, p: number[], out: number[]): void;
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
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(buffer?: ArrayBuffer | Uint8Array, bufferExtSize?: number);
        setArrayBuffer(buffer: ArrayBuffer): void;
        /**
         * 可读的剩余字节数
         *
         * @returns
         *
         * @memberOf ByteArray
         */
        readonly readAvailable: number;
        /**
         * @private
         */
        buffer: ArrayBuffer;
        readonly rawBuffer: ArrayBuffer;
        readonly bytes: Uint8Array;
        /**
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @private
         */
        dataView: DataView;
        /**
         * @private
         */
        readonly bufferOffset: number;
        /**
         * The current position of the file pointer (in bytes) to move or return to the ByteArray object. The next time you start reading reading method call in this position, or will start writing in this position next time call a write method.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 将文件指针的当前位置（以字节为单位）移动或返回到 ByteArray 对象中。下一次调用读取方法时将在此位置开始读取，或者下一次调用写入方法时将在此位置开始写入。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        position: number;
        /**
         * The length of the ByteArray object (in bytes).
                  * If the length is set to be larger than the current length, the right-side zero padding byte array.
                  * If the length is set smaller than the current length, the byte array is truncated.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * ByteArray 对象的长度（以字节为单位）。
         * 如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧。
         * 如果将长度设置为小于当前长度的值，将会截断该字节数组。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        length: number;
        protected _validateBuffer(value: number): void;
        /**
         * The number of bytes that can be read from the current position of the byte array to the end of the array data.
         * When you access a ByteArray object, the bytesAvailable property in conjunction with the read methods each use to make sure you are reading valid data.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 可从字节数组的当前位置到数组末尾读取的数据的字节数。
         * 每次访问 ByteArray 对象时，将 bytesAvailable 属性与读取方法结合使用，以确保读取有效的数据。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        readonly bytesAvailable: number;
        /**
         * Clears the contents of the byte array and resets the length and position properties to 0.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 清除字节数组的内容，并将 length 和 position 属性重置为 0。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        clear(): void;
        /**
         * Read a Boolean value from the byte stream. Read a simple byte. If the byte is non-zero, it returns true; otherwise, it returns false.
         * @return If the byte is non-zero, it returns true; otherwise, it returns false.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取布尔值。读取单个字节，如果字节非零，则返回 true，否则返回 false
         * @return 如果字节不为零，则返回 true，否则返回 false
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        readBoolean(): boolean;
        /**
         * Read signed bytes from the byte stream.
         * @return An integer ranging from -128 to 127
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取带符号的字节
         * @return 介于 -128 和 127 之间的整数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        readByte(): number;
        /**
         * Read data byte number specified by the length parameter from the byte stream. Starting from the position specified by offset, read bytes into the ByteArray object specified by the bytes parameter, and write bytes into the target ByteArray
         * @param bytes ByteArray object that data is read into
         * @param offset Offset (position) in bytes. Read data should be written from this position
         * @param length Byte number to be read Default value 0 indicates reading all available data
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取 length 参数指定的数据字节数。从 offset 指定的位置开始，将字节读入 bytes 参数指定的 ByteArray 对象中，并将字节写入目标 ByteArray 中
         * @param bytes 要将数据读入的 ByteArray 对象
         * @param offset bytes 中的偏移（位置），应从该位置写入读取的数据
         * @param length 要读取的字节数。默认值 0 导致读取所有可用的数据
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        readBytes(bytes: ByteArray, offset?: number, length?: number): void;
        /**
         * Read an IEEE 754 double-precision (64 bit) floating point number from the byte stream
         * @return Double-precision (64 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取一个 IEEE 754 双精度（64 位）浮点数
         * @return 双精度（64 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        readDouble(): number;
        /**
         * Read an IEEE 754 single-precision (32 bit) floating point number from the byte stream
         * @return Single-precision (32 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取一个 IEEE 754 单精度（32 位）浮点数
         * @return 单精度（32 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        readFloat(): number;
        /**
         * Read a 32-bit signed integer from the byte stream.
         * @return A 32-bit signed integer ranging from -2147483648 to 2147483647
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取一个带符号的 32 位整数
         * @return 介于 -2147483648 和 2147483647 之间的 32 位带符号整数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        readInt(): number;
        /**
         * Read a 16-bit signed integer from the byte stream.
         * @return A 16-bit signed integer ranging from -32768 to 32767
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取一个带符号的 16 位整数
         * @return 介于 -32768 和 32767 之间的 16 位带符号整数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        readShort(): number;
        /**
         * Read unsigned bytes from the byte stream.
         * @return A 32-bit unsigned integer ranging from 0 to 255
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取无符号的字节
         * @return 介于 0 和 255 之间的 32 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        readUnsignedByte(): number;
        /**
         * Read a 32-bit unsigned integer from the byte stream.
         * @return A 32-bit unsigned integer ranging from 0 to 4294967295
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取一个无符号的 32 位整数
         * @return 介于 0 和 4294967295 之间的 32 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        readUnsignedInt(): number;
        /**
         * Read a 16-bit unsigned integer from the byte stream.
         * @return A 16-bit unsigned integer ranging from 0 to 65535
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取一个无符号的 16 位整数
         * @return 介于 0 和 65535 之间的 16 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        readUnsignedShort(): number;
        /**
         * Read a UTF-8 character string from the byte stream Assume that the prefix of the character string is a short unsigned integer (use byte to express length)
         * @return UTF-8 character string
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取一个 UTF-8 字符串。假定字符串的前缀是无符号的短整型（以字节表示长度）
         * @return UTF-8 编码的字符串
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        readUTF(): string;
        /**
         * Read a UTF-8 byte sequence specified by the length parameter from the byte stream, and then return a character string
         * @param Specify a short unsigned integer of the UTF-8 byte length
         * @return A character string consists of UTF-8 bytes of the specified length
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取一个由 length 参数指定的 UTF-8 字节序列，并返回一个字符串
         * @param length 指明 UTF-8 字节长度的无符号短整型数
         * @return 由指定长度的 UTF-8 字节组成的字符串
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        readUTFBytes(length: number): string;
        /**
         * Write a Boolean value. A single byte is written according to the value parameter. If the value is true, write 1; if the value is false, write 0.
         * @param value A Boolean value determining which byte is written. If the value is true, write 1; if the value is false, write 0.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 写入布尔值。根据 value 参数写入单个字节。如果为 true，则写入 1，如果为 false，则写入 0
         * @param value 确定写入哪个字节的布尔值。如果该参数为 true，则该方法写入 1；如果该参数为 false，则该方法写入 0
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        writeBoolean(value: boolean): void;
        /**
         * Write a byte into the byte stream
         * The low 8 bits of the parameter are used. The high 24 bits are ignored.
         * @param value A 32-bit integer. The low 8 bits will be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在字节流中写入一个字节
         * 使用参数的低 8 位。忽略高 24 位
         * @param value 一个 32 位整数。低 8 位将被写入字节流
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        writeByte(value: number): void;
        /**
         * Write the byte sequence that includes length bytes in the specified byte array, bytes, (starting at the byte specified by offset, using a zero-based index), into the byte stream
         * If the length parameter is omitted, the default length value 0 is used and the entire buffer starting at offset is written. If the offset parameter is also omitted, the entire buffer is written
         * If the offset or length parameter is out of range, they are clamped to the beginning and end of the bytes array.
         * @param bytes ByteArray Object
         * @param offset A zero-based index specifying the position into the array to begin writing
         * @param length An unsigned integer specifying how far into the buffer to write
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 将指定字节数组 bytes（起始偏移量为 offset，从零开始的索引）中包含 length 个字节的字节序列写入字节流
         * 如果省略 length 参数，则使用默认长度 0；该方法将从 offset 开始写入整个缓冲区。如果还省略了 offset 参数，则写入整个缓冲区
         * 如果 offset 或 length 超出范围，它们将被锁定到 bytes 数组的开头和结尾
         * @param bytes ByteArray 对象
         * @param offset 从 0 开始的索引，表示在数组中开始写入的位置
         * @param length 一个无符号整数，表示在缓冲区中的写入范围
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        writeBytes(bytes: ByteArray, offset?: number, length?: number): void;
        /**
         * Write an IEEE 754 double-precision (64 bit) floating point number into the byte stream
         * @param value Double-precision (64 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在字节流中写入一个 IEEE 754 双精度（64 位）浮点数
         * @param value 双精度（64 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        writeDouble(value: number): void;
        /**
         * Write an IEEE 754 single-precision (32 bit) floating point number into the byte stream
         * @param value Single-precision (32 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在字节流中写入一个 IEEE 754 单精度（32 位）浮点数
         * @param value 单精度（32 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        writeFloat(value: number): void;
        /**
         * Write a 32-bit signed integer into the byte stream
         * @param value An integer to be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在字节流中写入一个带符号的 32 位整数
         * @param value 要写入字节流的整数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        writeInt(value: number): void;
        /**
         * Write a 16-bit integer into the byte stream. The low 16 bits of the parameter are used. The high 16 bits are ignored.
         * @param value A 32-bit integer. Its low 16 bits will be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在字节流中写入一个 16 位整数。使用参数的低 16 位。忽略高 16 位
         * @param value 32 位整数，该整数的低 16 位将被写入字节流
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        writeShort(value: number): void;
        /**
         * Write a 32-bit unsigned integer into the byte stream
         * @param value An unsigned integer to be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在字节流中写入一个无符号的 32 位整数
         * @param value 要写入字节流的无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        writeUnsignedInt(value: number): void;
        /**
         * Write a 16-bit unsigned integer into the byte stream
         * @param value An unsigned integer to be written into the byte stream
         * @version Egret 2.5
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在字节流中写入一个无符号的 16 位整数
         * @param value 要写入字节流的无符号整数
         * @version Egret 2.5
         * @platform Web,Native
         * @language zh_CN
         */
        writeUnsignedShort(value: number): void;
        /**
         * Write a UTF-8 string into the byte stream. The length of the UTF-8 string in bytes is written first, as a 16-bit integer, followed by the bytes representing the characters of the string
         * @param value Character string value to be written
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 将 UTF-8 字符串写入字节流。先写入以字节表示的 UTF-8 字符串长度（作为 16 位整数），然后写入表示字符串字符的字节
         * @param value 要写入的字符串值
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        writeUTF(value: string): void;
        /**
         * Write a UTF-8 string into the byte stream. Similar to the writeUTF() method, but the writeUTFBytes() method does not prefix the string with a 16-bit length word
         * @param value Character string value to be written
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 将 UTF-8 字符串写入字节流。类似于 writeUTF() 方法，但 writeUTFBytes() 不使用 16 位长度的词为字符串添加前缀
         * @param value 要写入的字符串值
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        writeUTFBytes(value: string): void;
        /**
         *
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        toString(): string;
        /**
         * @private
         * 将 Uint8Array 写入字节流
         * @param bytes 要写入的Uint8Array
         * @param validateBuffer
         */
        _writeUint8Array(bytes: Uint8Array | ArrayLike<number>, validateBuffer?: boolean): void;
        /**
         * @param len
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         * @private
         */
        validate(len: number): boolean;
        /**********************/
        /**********************/
        /**
         * @private
         * @param len
         * @param needReplace
         */
        protected validateBuffer(len: number): void;
        /**
         * @private
         * UTF-8 Encoding/Decoding
         */
        private encodeUTF8(str);
        /**
         * @private
         *
         * @param data
         * @returns
         */
        private decodeUTF8(data);
        /**
         * @private
         *
         * @param code_point
         */
        private encoderError(code_point);
        /**
         * @private
         *
         * @param fatal
         * @param opt_code_point
         * @returns
         */
        private decoderError(fatal, opt_code_point?);
        /**
         * @private
         */
        private EOF_byte;
        /**
         * @private
         */
        private EOF_code_point;
        /**
         * @private
         *
         * @param a
         * @param min
         * @param max
         */
        private inRange(a, min, max);
        /**
         * @private
         *
         * @param n
         * @param d
         */
        private div(n, d);
        /**
         * @private
         *
         * @param string
         */
        private stringToCodePoints(string);
        /**
         * 替换缓冲区
         *
         * @param {ArrayBuffer} value
         */
        replaceBuffer(value: ArrayBuffer): void;
        /**
         *
         * 读取指定长度的Buffer
         * @param {number} length       指定的长度
         * @returns {Buffer}
         */
        readBuffer(length: number): ArrayBuffer;
        readInt64(): number;
        writeInt64(value: number): void;
        /**
         * 读取ProtoBuf的`Double`
         * protobuf封装是使用littleEndian的，不受Endian影响
         */
        readPBDouble(): number;
        /**
         * 写入ProtoBuf的`Double`
         * protobuf封装是使用littleEndian的，不受Endian影响
         * @param value
         */
        writePBDouble(value: number): void;
        /**
         * 读取ProtoBuf的`Float`
         * protobuf封装是使用littleEndian的，不受Endian影响
         */
        readPBFloat(): number;
        /**
          * 写入ProtoBuf的`Float`
          * protobuf封装是使用littleEndian的，不受Endian影响
          * @param value
          */
        writePBFloat(value: number): void;
        readFix32(): number;
        writeFix32(value: number): void;
        readSFix32(): number;
        writeSFix32(value: number): void;
        readFix64(): number;
        writeFix64(value: number): void;
        /**
         *
         * 读取指定长度的ByteArray
         * @param {number} length       指定的长度
         * @param {number} [ext=0]      ByteArray扩展长度参数
         * @returns {ByteArray}
         */
        readByteArray(length: number, ext?: number): ByteArray;
        /**
         * 向字节流中写入64位的可变长度的整数(Protobuf)
         */
        writeVarint64(value: number): void;
        /**
         * 向字节流中写入32位的可变长度的整数(Protobuf)
         */
        writeVarint(value: number): void;
        /**
         * 读取字节流中的32位变长整数(Protobuf)
         */
        readVarint(): number;
        /**
          * 读取字节流中的32位变长整数(Protobuf)
          */
        readVarint64(): number;
        /**
         * 获取写入的字节
         * 此方法不会新建 ArrayBuffer
         * @readonly
         * @memberof ByteArray
         */
        readonly outBytes: Uint8Array;
        /**
         * 重置索引
         *
         * @memberof ByteArray
         */
        reset(): void;
    }
    /**
     * 项目中不使用long类型，此值暂时只用于存储Protobuff中的int64 sint64
     * @author
     *
     */
    class Int64 {
        /**
         * 高位
         */
        high: number;
        /**
         * 低位
         */
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
        /**
         * rgbaCSS:string = "rgba(r,g,b,a)" rgba ∈ (0 ~ 255)
         */
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
        /**
         * 插入一个矩形
         * @param width
         * @param height
         * @param method
         * @return 插入的位置
         *
         */
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
    /**
     * 创建器
     */
    type Creator<T> = {
        new (): T;
    } | {
        (): T;
    };
    /**
     *
     * 调整ClassFactory
     * @export
     * @class ClassFactory
     * @template T
     */
    class ClassFactory<T> {
        private _creator;
        private _props;
        /**
         * @param {Creator<T>} creator
         * @param {Partial<T>} [props] 属性模板
         * @memberof ClassFactory
         */
        constructor(creator: Creator<T>, props?: Partial<T>);
        /**
         * 获取实例
         *
         * @returns
         */
        get(): any;
    }
    /**
     * 可回收的对象
     *
     * @export
     * @interface IRecyclable
     */
    interface IRecyclable {
        /**
         * 回收时触发
         */
        onRecycle?: {
            ();
        };
        /**
         * 启用时触发
         */
        onSpawn?: {
            ();
        };
        /**
         * 回收对象的唯一自增标识
         * 从回收池取出后，会变化
         * 此属性只有在`DEBUG`时有效
         */
        _insid?: number;
    }
    /**
     * 回收池
     * @author 3tion
     *
     */
    class RecyclablePool<T> {
        private _pool;
        private _max;
        private _creator;
        get(): T;
        /**
         * 回收
         */
        recycle(t: T): void;
        constructor(TCreator: Creator<T>, max?: number);
    }
    type Recyclable<T> = T & {
        recycle(): void;
    };
    /**
     * 获取一个recyclable的对象
     *
     * @export
     * @template T
     * @param {({ new(): T & { _pool?: RecyclablePool<T> } })} clazz
     */
    function recyclable<T>(clazz: {
        new (): T & {
            _pool?: RecyclablePool<T>;
        };
    }): Recyclable<T>;
    /**
     * 使用创建函数进行创建
     *
     * @export
     * @template T
     * @param {({ (): T & { _pool?: RecyclablePool<T> } })} clazz
     * @param {true} addInstanceRecycle
     */
    function recyclable<T>(clazz: {
        (): T & {
            _pool?: RecyclablePool<T>;
        };
    }, addInstanceRecycle?: boolean): Recyclable<T>;
    /**
     * 单例工具
     * @param clazz 要做单例的类型
     */
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
    const enum EventT {
        ENTER_FRAME = 1,
        RESIZE = 2,
        FAILED = 3,
        COMPLETE = 4,
        CONTEXT3D_CREATE = 5,
        CHANGE = 6,
        CANCEL = 7,
        SCROLL = 8,
        OPEN = 9,
        CLOSE = 10,
        SELECT = 11,
        DISPOSE = 12,
        DATA = 13,
        ERROR = 14,
        PROGRESS = 15,
        IO_ERROR = 16,
        MESSAGE = 17,
        RECYCLE = 18,
        ADD_TO_STAGE = 19,
        REMOVE_FROM_STAGE = 20,
        COMPLETE_LOADED = 21,
    }
    const enum MouseEventX {
        MouseDown = 50,
        MouseRightDown = 51,
        MouseMiddleDown = 52,
        MouseUp = 53,
        MouseRightUp = 54,
        MouseMiddleUp = 55,
        CLICK = 56,
        RightClick = 57,
        middleClick = 58,
        MouseWheel = 59,
        MouseMove = 60,
        ROLL_OVER = 61,
        ROLL_OUT = 62,
    }
    class MouseEventData implements IRecyclable {
        constructor(id?: number);
        id: number;
        x: number;
        y: number;
        dx: number;
        dy: number;
        ctrl: boolean;
        shift: boolean;
        alt: boolean;
        wheel: number;
        onRecycle(): void;
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
    /**
     *
     * @author crl
     *
     */
    class MiniDispatcher implements IEventDispatcherX, IRecyclable {
        mEventListeners: Object;
        mTarget: IEventDispatcherX;
        /** Creates an EventDispatcher. */
        constructor(target?: IEventDispatcherX);
        /** Registers an event listener at a certain object. */
        on(type: string | number, listener: Function, thisObject: any, priority?: number): void;
        /** Removes an event listener from the object. */
        off(type: string | number, listener: Function): void;
        /** Removes all event listeners with a certain type, or all of them if type is null.
         *  Be careful when removing all event listeners: you never know who else was listening. */
        removeEventListeners(type?: string): void;
        /** Dispatches an event to all objects that have registered listeners for its type.
         *  If an event with enabled 'bubble' property is dispatched to a display object, it will
         *  travel up along the line of parents, until it either hits the root object or someone
         *  stops its propagation manually. */
        dispatchEvent(event: EventX): boolean;
        simpleDispatch(type: string | number, data?: any, bubbles?: boolean): boolean;
        /** Returns if there are listeners registered for a certain event type. */
        has(type: string | number): boolean;
        onRecycle(): void;
        addEventListener: (type: string | number, listener: Function, thisObject: any, priority?: number) => void;
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
    interface ITimeMixer {
        now: number;
        speed: number;
        interval?: number;
    }
    function newTimeMixer(now?: number, speed?: number): ITimeMixer;
    function tm_add(t: ITimeMixer, interval: number): number;
    let nativeMouseX: number;
    let nativeMouseY: number;
    let nextUpdateTime: number;
    let frameInterval: number;
    let engineNow: number;
    let serverTime: number;
    function getUTCTime(time: number): number;
    function getFormatTime(time: number, format: string, isRaw?: boolean): string;
    const getT: ({
        (): number;
    });
    const defaultTimeMixer: ITimeMixer;
    class Engine {
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
    const enum HttpResponseType {
        TEXT = 0,
        ARRAY_BUFFER = 1,
    }
    const enum HttpMethod {
        GET = 0,
        POST = 1,
    }
    /**
     * HTTP 请求类
     */
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
        /**
         * 表明在进行跨站(cross-site)的访问控制(Access-Control)请求时，是否使用认证信息(例如cookie或授权的header)。(这个标志不会影响同站的请求)
         */
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
    /**
     * 图片加载类
     */
    class ImageLoader extends MiniDispatcher {
        private static _crossOrigin;
        /**
         * 当从其他站点加载一个图片时，指定是否启用跨域资源共享(CORS)，默认值为null。
         * 可以设置为"anonymous","use-credentials"或null,设置为其他值将等同于"anonymous"。
         */
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
    /**
     * Socket 连接
     */
    class Socket extends MiniDispatcher {
        protected _webSocket: WebSocket;
        protected _connected: boolean;
        protected _addInputPosition: number;
        protected _input: ByteArray;
        protected _output: ByteArray;
        endian: boolean;
        /**
         * 不再缓存服务端发来的数据
         */
        disableInput: boolean;
        constructor(host?: string, port?: number);
        readonly connected: boolean;
        /**
         * 输入流，服务端发送的数据
         */
        readonly input: ByteArray;
        /**
         * 输出流，要发送给服务端的数据
         */
        readonly output: ByteArray;
        connect(host: string, port: number): void;
        connectByUrl(url: string): void;
        protected cleanSocket(): void;
        protected onOpen(e: any): void;
        protected onMessage(msg: any): void;
        protected onClose(e: any): void;
        protected onError(e: any): void;
        /**
         * 发送数据到服务器
         * @param data 需要发送的数据 可以是String或者ArrayBuffer
         */
        send(data: string | ArrayBuffer): void;
        flush(): void;
        close(): void;
    }
}
declare module rf {
    type EventHandler = (event: EventX) => void;
    /**
         * 同一时刻最大可以同时启动的下载线程数
         */
    let res_max_loader: number;
    /**
     * 加载优先级枚举
     */
    const enum LoadPriority {
        low = 0,
        middle = 1,
        high = 2,
        max = 3,
    }
    const enum LoadStates {
        WAIT = 0,
        LOADING = 1,
        COMPLETE = 2,
        FAILED = 3,
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
    function loadRes(url: string, complete?: EventHandler, thisObj?: any, type?: ResType, priority?: LoadPriority, cache?: boolean, noDispose?: boolean, disposeTime?: number): ResItem;
    function removeLoad(url: string, complete: EventHandler): void;
    /**
     * 资源加载管理类
     */
    class Res {
        private static _instance;
        static readonly instance: Res;
        private nowLoader;
        private _analyzerMap;
        private resMap;
        private link;
        private constructor();
        removeLoad(url: string, complete?: EventHandler): void;
        /**
         * 添加一个加载项
         * @param url 加载路径
         * @param complete 加载完毕回调
         * @param thisObj 回调作用域
         * @param type 资源类型
         * @param priority 加载优先级
         * @param cache 是否缓存
         * @param noDispose 不自动释放
         * @param disposeTime 自动释放时间, 超过该时间自动释放资源
         */
        load(url: string, complete?: EventHandler, thisObj?: any, type?: ResType, priority?: LoadPriority, cache?: boolean, noDispose?: boolean, disposeTime?: number): ResItem;
        private loadNext();
        private doLoad(item);
        private doLoadComplete(loader, event);
        gc(now: number): void;
    }
    /**
     * 资源类型
     */
    const enum ResType {
        /**
         * 二进制
         */
        bin = 0,
        /**
         * 文本
         */
        text = 1,
        /**
         * 音乐
         */
        sound = 2,
        /**
         * 图片
         */
        image = 3,
    }
    interface IResHandler {
        complete: EventHandler;
        thisObj: any;
    }
    /**
     * 资源数据
     */
    class ResItem implements IRecyclable {
        type: ResType;
        name: string;
        complete: IResHandler[];
        data: any;
        preUseTime: number;
        noDispose: boolean;
        disposeTime: number;
        states: number;
        onRecycle(): void;
    }
    /**
     * 加载基类
     */
    abstract class ResLoaderBase {
        protected _resItem: ResItem;
        protected _compFunc: Function;
        protected _thisObject: any;
        loadFile(resItem: ResItem, compFunc: Function, thisObject: any): void;
    }
    /**
     * 二进制加载
     */
    class ResBinLoader extends ResLoaderBase {
        protected _httpRequest: HttpRequest;
        constructor();
        protected getType(): HttpResponseType;
        loadFile(resItem: ResItem, compFunc: Function, thisObject: any): void;
        protected onComplete(event: EventX): void;
        protected onIOError(event: EventX): void;
    }
    /**
     * 文本加载
     */
    class ResTextLoader extends ResBinLoader {
        protected getType(): HttpResponseType;
        protected onComplete(event: EventX): void;
    }
    /**
     * 音乐加载
     */
    class ResSoundLoader extends ResBinLoader {
        protected onComplete(event: EventX): void;
    }
    /**
     * 图片加载
     */
    class ResImageLoader extends ResLoaderBase {
        loadFile(resItem: ResItem, compFunc: Function, thisObject: any): void;
    }
    interface ILoaderTask {
        name: string;
        data?: any;
        states: number;
    }
    class LoadTask extends MiniDispatcher implements IRecyclable {
        queue: {
            [key: string]: ILoaderTask;
        };
        total: number;
        progress: number;
        addBin(url: string): ResItem;
        addTxt(url: string): ResItem;
        addImage(url: string): ResItem;
        addTask(item: ILoaderTask & IEventDispatcherX): void;
        complteHandler(event: EventX): void;
        onRecycle(): void;
    }
}
declare namespace rf {
    interface ICapabilities {
        /** 浏览器的平台 */
        readonly platform: string;
        /** 用户代理信息 */
        readonly userAgent: string;
        /** 是否支持 WebGL */
        readonly supportWebGL: boolean;
        /** GL 的版本 */
        readonly glVersion: string;
        /** GLSL 语言版本 */
        readonly shadingLanguageVersion: string;
        /** 供应商 */
        readonly vendor: string;
        /** 渲染器 */
        readonly renderer: string;
        /** 实际上渲染时使用的供应商 */
        readonly unMaskedVendor: string;
        /** 实际上渲染时使用的渲染器 */
        readonly unMaskedRenderer: string;
        /** 是否抗锯齿 */
        readonly antialias: boolean;
        /** 是否使用了 ANGLE 技术来使 Direct X 支持 WebGL 的接口, 文档地址: https://baike.baidu.com/item/angle/3988?fr=aladdin */
        readonly ANGLE: string;
        /** 顶点着色器中最多可以定义的属性数量 */
        readonly maxVertexAttributes: number;
        /** 一个顶点着色器上可以使用纹理单元的最大数量 */
        readonly maxVertexTextureImageUnits: number;
        /** 一个顶点着色器上可以使用的 uniform 向量的最大数量 */
        readonly maxVertexUniformVectors: number;
        /** 一个顶点着色器上可以使用的 varying 向量的最大数量 */
        readonly maxVaryingVectors: number;
        /** 带锯齿直线宽度的范围  */
        readonly aliasedLineWidthRange: Float32Array[];
        /** 带锯齿点的尺寸范围 */
        readonly aliasedPointSizeRange: Float32Array[];
        /** 一个片段着色器上可以使用的 uniform 向量的最大数量 */
        readonly maxFragmentUniformVectors: number;
        /** 一个片段着色器上可以使用纹理单元的最大数量 */
        readonly maxTextureImageUnits: number;
        /** 纹理图片最大支持的尺寸, 高宽均必须小于等于该尺寸 */
        readonly maxTextureSize: number;
        /** 立方图纹理图片最大支持的尺寸, 高宽均必须小于等于该尺寸 */
        readonly maxCubeMapTextureSize: number;
        /** 所有片段着色器总共能访问的纹理单元数 */
        readonly maxCombinedTextureImageUnits: number;
        /** 最大同向异性过滤值, 文档: https://blog.csdn.net/dcrmg/article/details/53470174 */
        readonly maxAnisotropy: number;
        /**  */
        readonly maxColorBuffers: number;
        /** 颜色缓存中红色的位数 */
        readonly redBits: number;
        /** 颜色缓存中绿色的位数 */
        readonly greenBits: number;
        /** 颜色缓存中蓝色的位数 */
        readonly blueBits: number;
        /** 颜色缓存中透明度的位数 */
        readonly alphaBits: number;
        /** 深度缓存中每个像素的位数 */
        readonly depthBits: number;
        /** 模板缓存中每个像素的位数 */
        readonly stencilBits: number;
        /** 最大的渲染缓冲尺寸 */
        readonly maxRenderBufferSize: number;
        /** 视口最大尺寸 */
        readonly maxViewportDimensions: Int32Array[];
        readonly isMobile: boolean;
        init(): void;
    }
    /**
     * 提供当前浏览器的功能描述
     */
    const Capabilities: ICapabilities;
}
declare module rf {
    type $CallbackInfo = CallbackInfo<Function>;
    /**
     * 回调信息，用于存储回调数据
     * @author 3tion
     *
     */
    class CallbackInfo<T extends Function> implements IRecyclable {
        callback: T;
        args: any[];
        thisObj: any;
        doRecycle: boolean;
        /**
         * 待执行的时间
         */
        time: number;
        constructor();
        init(callback: T, thisObj?: any, args?: any[]): void;
        /**
         * 检查回调是否一致，只检查参数和this对象,不检查参数
         */
        checkHandle(callback: T, thisObj: any): boolean;
        /**
         * 执行回调
         * 回调函数，将以args作为参数，callback作为函数执行
         * @param {boolean} [doRecycle] 是否回收CallbackInfo，默认为true
         */
        execute(doRecycle?: boolean): any;
        /**
         * 用于执行其他参数
         * 初始的参数会按顺序放在末位
         * @param args (description)
         */
        call(...args: any[]): any;
        /**
         * 用于执行其他参数
         * 初始的参数会按顺序放在末位
         * 此方法会回收callbackInfo
         * @param {any} args
         */
        callAndRecycle(...args: any[]): any;
        onRecycle(): void;
        recycle: {
            ();
        };
        /**
         * 获取CallbackInfo的实例
         */
        static get<T extends Function>(callback: T, thisObj?: any, ...args: any[]): CallbackInfo<Function>;
        /**
         * 加入到数组
         * 检查是否有this和handle相同的callback，如果有，就用新的参数替换旧参数
         * @param list
         * @param handle
         * @param args
         * @param thisObj
         */
        static addToList<T extends Function>(list: CallbackInfo<Function>[], handle: T, thisObj?: any, ...args: any[]): CallbackInfo<Function>;
    }
}
declare module rf {
    class BitmapSourceVO implements IFrame {
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
        textureData: ITextureData;
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
        drawimg(img: HTMLImageElement, x: number, y: number, w?: number, h?: number): void;
    }
    let bitmapSources: {
        [key: string]: BitmapSource;
    };
    let componentSource: BitmapSource;
}
declare module rf {
    class Byte {
        position: number;
        length: number;
        buf: DataView;
        constructor(buf?: ArrayBuffer);
        setArrayBuffer(buf: ArrayBuffer): void;
        outOfRange(): void;
        readByte(): number;
        readInt(): number;
        readUInt(): number;
        readDouble(): number;
        readFloat(): number;
        readMultiByte(length: number, charSet?: string): string;
        readByteArray(length: number): ArrayBuffer;
    }
    const enum AMF3Define {
        UNDEFINED = 0,
        NULL = 1,
        FALSE = 2,
        TRUE = 3,
        INT = 4,
        DOUBLE = 5,
        STRING = 6,
        XMLDOC = 7,
        DATE = 8,
        ARRAY = 9,
        OBJECT = 10,
        XML = 11,
        BYTEARRAY = 12,
        INTVECTOR = 13,
        UINTVECTOR = 14,
        DOUBLEVECTOR = 15,
        OBJECTVECTOR = 16,
        DICTIONARY = 17,
        FLOAT = 253,
    }
    class ClassDefine {
        className: string;
        members: string[];
        isExternalizable: boolean;
        isDynamic: boolean;
        constructor(className: string, members: string[]);
    }
    class AMF3 extends Byte {
        flags: number;
        ref: any;
        stringsTable: any[];
        objectsTable: any[];
        traitsTable: any[];
        clsNameMap: {};
        MASK: number;
        constructor(buf?: ArrayBuffer);
        private read29(unsign);
        readInt(): number;
        readString(): string;
        readDate(u29D: number): Date;
        readObjectVector(length: number): any[];
        readArray(length: number): any[];
        readDictionary(length: number): {};
        readObject(): any;
        readByteArray(length: number): ArrayBuffer;
        private _readObject(handle);
        readReferencableObject(marker: number): any;
    }
    class AMF3Encode extends Byte {
        stringsTable: any[];
        objectsTable: any[];
        traitsTable: any[];
        unit8: Uint8Array;
        constructor(buf?: ArrayBuffer);
        writeByte(value: number): void;
        writeFloat(value: number): void;
        writeDouble(value: number): void;
        writeString(str: string): void;
        write29(v: number, unsign: boolean): void;
        isRealNum(val: any): boolean;
        writeObject(o: any): void;
        writeArray(arr: any): void;
        writeBytes(buffer: ArrayBuffer): void;
        toUint8Array(): Uint8Array;
    }
    function amf_readObject(byte: ArrayBuffer | Uint8Array): any;
}
declare module rf {
    type EaseFunction = (t: number, b: number, c: number, d: number, ...args) => number;
    type TweenUpdateFunction = (tweener: ITweener) => void;
    interface ITweenerItem {
        k: string;
        s: number;
        e: number;
        d: number;
        n?: number;
    }
    interface ITweener {
        caster: {
            [key: string]: number;
        };
        st: number;
        duration: number;
        l: number;
        tm: ITimeMixer;
        data: ITweenerItem[];
        ease: EaseFunction;
        update: TweenUpdateFunction;
        complete: TweenUpdateFunction;
        thisObj: any;
    }
    function defaultEasingFunction(t: number, b: number, c: number, d: number): number;
    var tweenLink: Link;
    function createTweener(eo: {
        [key: string]: number;
    }, duration: number, tm: ITimeMixer, target?: any, ease?: EaseFunction, so?: {
        [key: string]: number;
    }): ITweener;
    function tweenTo(eo: {
        [key: string]: number;
    }, duration: number, tm: ITimeMixer, target?: any, ease?: EaseFunction, so?: {
        [key: string]: number;
    }): ITweener;
    function tweenUpdate(): void;
    function tweenEnd(tweener: ITweener): void;
    function tweenStop(tweener: ITweener): void;
}
declare module rf {
    class Quaternion {
        x: number;
        y: number;
        z: number;
        w: number;
        constructor(x?: number, y?: number, z?: number, w?: number);
        static lerp(qa: Point3DW, qb: Point3DW, percent: number): Quaternion;
        fromMatrix3D(m: IMatrix3D): this;
        toMatrix3D(target?: IMatrix3D): IMatrix3D;
        /**
         * @param axis   must be a normalized vector
         * @param angleInRadians
         */
        fromAxisAngle(axis: Point3DW, angleInRadians: number): void;
        conjugate(): void;
        toString(): string;
    }
}
declare module rf {
    let vertex_ui_variable: {
        [key: string]: IVariable;
    };
    /**
     * 可合并的UI对象完整体
     */
    let vertex_ui_full_variable: {
        [key: string]: IVariable;
    };
    let vertex_mesh_variable: {
        [key: string]: IVariable;
    };
    let vertex_mesh_full_variable: {
        [key: string]: IVariable;
    };
    let vertex_skeleton_variable: {
        [key: string]: IVariable;
    };
    const EMPTY_MAX_NUMVERTICES: number;
    let empty_float32_pos: Float32Array;
    let empty_float32_normal: Float32Array;
    let empty_float32_tangent: Float32Array;
    let empty_float32_uv: Float32Array;
    let empty_float32_color: Float32Array;
    let empty_uint16_indexs: Uint16Array;
    let empty_float32_object: {
        [key: string]: Float32Array;
    };
    /**
     * pos:Float32Array
     * noraml:Float32Array
     * uv:Float32Array
     * color:Float32Array
     */
    function createGeometry(data: {
        [key: string]: Float32Array;
    }, variables: {
        [key: string]: IVariable;
    }, numVertices: number, result?: Float32Array): Float32Array;
    interface IVariable {
        size: number;
        offset: number;
    }
    class VertexInfo {
        vertex: Float32Array;
        numVertices: number;
        data32PerVertex: number;
        variables: {
            [key: string]: IVariable;
        };
        constructor(value: number | Float32Array, data32PerVertex: number, variables?: {
            [key: string]: IVariable;
        });
        regVariable(variable: string, offset: number, size: number): void;
    }
    interface IGeometry {
        vertex: VertexBuffer3D;
        index?: IndexBuffer3D;
    }
    class Temp_Float32Byte implements IRecyclable {
        constructor();
        data: Float32Array;
        data32PerVertex: number;
        numVertices: number;
        position: number;
        onSpawn(): void;
        set(array: ArrayLike<number>, offset?: number): void;
        toArray(): Float32Array;
    }
    function geometry_plane(width: number, height: number, position: number, variables: {
        [key: string]: IVariable;
    }, matrix3D?: IMatrix3D): void;
    class GeometryBase implements IGeometry {
        variables: {
            [key: string]: IVariable;
        };
        vertex: VertexBuffer3D;
        index: IndexBuffer3D;
        data: IMeshData;
        constructor(variables?: {
            [key: string]: IVariable;
        });
        data32PerVertex: number;
        numVertices: number;
        numTriangles: number;
        initData(data: IMeshData): void;
        setData(data: IMeshData): void;
        readonly pos: any[];
        readonly uv: any[];
        readonly triangles: any[];
        uploadContext(camera: Camera, mesh: Mesh, program: Program3D, now: number, interval: number): void;
    }
    interface ISkeletonJoint {
        index: number;
        name: string;
        inv: Float32Array;
        chind: ISkeletonJoint[];
        parent: ISkeletonJoint;
    }
    class SkeletonGeometry extends GeometryBase {
        skVertex: VertexBuffer3D;
        joints: {
            [key: string]: ISkeletonJoint;
        };
        jointroot: ISkeletonJoint;
    }
    class PlaneGeometry extends GeometryBase {
        create(width?: number, height?: number): this;
    }
    class BoxGeometry extends GeometryBase {
        create(width: number, height: number, depth: number): this;
    }
    function hsva(h: number, s: number, v: number, a: number): any[];
    class SphereGeometry extends GeometryBase {
        create(row: number, column: number, rad: number, color?: number[]): this;
    }
    class TorusGeomerty extends GeometryBase {
        create(row: number, column: number, irad: number, orad: number): this;
    }
}
declare module rf {
    class Material {
        cull: number;
        srcFactor: number;
        dstFactor: number;
        depthMask: boolean;
        passCompareMode: number;
        alphaTest: number;
        program: Program3D;
        diff: IColor;
        diffTex: ITextureData;
        createProgram(mesh: Mesh): Program3D;
        setData(data: IMaterialData): void;
        uploadContext(camera: Camera, mesh: Mesh, now: number, interval: number): boolean;
        checkTexs(...args: any[]): boolean;
        getTextUrl(data: ITextureData): string;
    }
    class PhongMaterial extends Material {
        emissive: IColor;
        emissiveTex: ITextureData;
        specular: IColor;
        specularTex: ITextureData;
        uploadContext(camera: Camera, mesh: Mesh, now: number, interval: number): boolean;
        createProgram(mesh: Mesh): Recyclable<Program3D>;
    }
}
declare module rf {
    interface IShaderChunk {
        key: string;
        vdef?: string;
        fdef?: string;
        vary?: string;
        vcode?: string;
        fcode?: string;
    }
    class Shader {
        att_uv_ui: {
            key: string;
            vdef: string;
            vary: string;
            vcode: string;
            fcode: string;
        };
        att_uv: {
            key: string;
            vdef: string;
            vary: string;
            vcode: string;
            fcode: string;
        };
        att_color: {
            key: string;
            vdef: string;
            vary: string;
            vcode: string;
            fcode: string;
        };
        att_normal: {
            key: string;
            vdef: string;
            vcode: string;
        };
        uni_v_p: {
            key: string;
            vdef: string;
        };
        uni_v_mv: {
            key: string;
            vdef: string;
        };
        uni_v_mvp: {
            key: string;
            vdef: string;
            vcode: string;
        };
        uni_f_diff: {
            key: string;
            fdef: string;
            fcode: string;
        };
        uni_v_inv_m: {
            key: string;
            vdef: string;
        };
        uni_v_dir: {
            key: string;
            vdef: string;
        };
        uni_v_light: {};
        createVertex(define: string[], modules: object): string;
        createFragment(define: string[], modules: object): string;
    }
}
declare module rf {
    var ROOT: Stage3D;
    interface IMouse {
        mouseEnabled?: boolean;
        mouseChildren?: boolean;
        getObjectByPoint?(dx: number, dy: number, scale: number): DisplayObject;
    }
    interface I3DRender extends IRecyclable {
        render?(camera: Camera, now: number, interval: number, target?: Sprite): void;
    }
    const enum DChange {
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
        /**
         *  自己有transform变化 或者 下层有transform变化
         */
        t_all = 19,
    }
    class HitArea {
        allWays: boolean;
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
        mousedown: boolean;
        mouseroll: boolean;
        pos: IVector3D;
        rot: IVector3D;
        sca: IVector3D;
        up: IVector3D;
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
        _visible: boolean;
        states: number;
        pivotZero: boolean;
        pivotPonumber: IVector3D;
        transform: IMatrix3D;
        sceneTransform: IMatrix3D;
        parent: DisplayObjectContainer;
        stage: Stage3D;
        name: string;
        protected w: number;
        protected h: number;
        protected _width: number;
        protected _height: number;
        constructor();
        /**
         * 逻辑规则
         * 改变对象 transform  alpha   vertexData  vcData  hitArea
         * 1.transform alpha 改变需要递归计算 并且上层是需要下层有改变的 引申出 ct 对象 childTranformORAlphaChange
         * 2.vertexData vcData 是要让batcher知道数据改变了 本层不需要做任何处理
         * 3.hitArea 改变 需要递归计算，引申出 ca对象 childHitAreaChange
         */
        setChange(value: number, p?: number, c?: boolean): void;
        visible: boolean;
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
        eulers: IVector3D;
        /**
         * 当前方向Z轴移动
         * @param distance
         *
         */
        forwardPos(distance: number, target?: IVector3D): void;
        /**
         * 当前方向Y轴移动
         * @param distance
         *
         */
        upPos(distance: number): void;
        /**
         * 当前方向X轴移动
         * @param distance
         *
         */
        rightPos(distance: number): void;
        /**
         *
         * @param rx
         * @param ry
         * @param rz
         *
         */
        setRot(rx: number, ry: number, rz: number, update?: Boolean): void;
        /**
         *
         * @param rx
         * @param ry
         * @param rz
         *
         */
        setRotRadians(rx: number, ry: number, rz: number, update?: Boolean): void;
        scale: number;
        setSca(sx: number, sy: number, sz: number, update?: Boolean): void;
        setPivotPonumber(x: number, y: number, z: number): void;
        setTransform(matrix: ArrayLike<number>): void;
        /**
         *
         */
        updateTransform(): void;
        /**
         *
         *
         */
        updateSceneTransform(sceneTransform: IMatrix3D): void;
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
        readonly mouseX: number;
        readonly mouseY: number;
        render(camera: Camera, now: number, interval: number, target?: Sprite): void;
        lookat(target: IVector3D, upAxis?: IVector3D): void;
        readonly width: number;
        readonly height: number;
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
        /**
         * 讲真  这块更新逻辑还没有到最优化的结果 判断不会写了
         */
        updateTransform(): void;
        updateSceneTransform(): void;
        updateAlpha(sceneAlpha: number): void;
        updateHitArea(): void;
    }
}
declare module rf {
    class Camera extends DisplayObject implements IResizeable {
        len: IMatrix3D;
        far: number;
        originFar: number;
        worldTranform: IMatrix3D;
        constructor(far?: number);
        resize(width: number, height: number): void;
        updateSceneTransform(sceneTransform?: IMatrix3D): void;
    }
    class CameraUI extends Camera {
        resize(width: number, height: number): void;
    }
    class CameraOrth extends Camera {
        resize(width: number, height: number): void;
    }
    class Camera3D extends Camera {
        resize(width: number, height: number): void;
    }
}
declare module rf {
    const enum FilterConst {
        POS = 600,
        SCA = 601,
        ROTATION = 602,
        ALPHA = 603,
    }
    interface IFilterBase {
        type: number;
        key: string;
        target: Sprite;
        tweener: ITweener;
        enabled: boolean;
    }
    function newFilterBase(target: RenderBase, type: number): IFilterBase;
}
declare module rf {
    abstract class RenderBase extends DisplayObjectContainer implements I3DRender {
        nativeRender: boolean;
        variables: {
            [key: string]: IVariable;
        };
        material: Material;
        tm: ITimeMixer;
        render(camera: Camera, now: number, interval: number): void;
        constructor(variables?: {
            [key: string]: IVariable;
        });
        addToStage(): void;
    }
    class Sprite extends RenderBase {
        source: BitmapSource;
        /**
         * 1.Sprite本身有render方法可以渲染
         * 2.考虑到可能会有一些需求 渲染器可以写在别的类或者方法中  所以加入renderer概念
         */
        renderer: I3DRender;
        $graphics: Graphics;
        $batchGeometry: BatchGeometry;
        $vcIndex: number;
        $vcox: number;
        $vcoy: number;
        $vcos: number;
        constructor(source?: BitmapSource, variables?: {
            [key: string]: IVariable;
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
        constructor(source?: BitmapSource);
        load(url: string): void;
        onImageComplete(e: EventX): void;
    }
    class IconView extends Image {
        drawW: number;
        drawH: number;
        img: HTMLImageElement;
        isReady: boolean;
        constructor(source?: BitmapSource);
        setUrl(url: string): void;
        resetSize(_width: number, _height: number): void;
        onImageComplete(e: EventX): void;
        _draw(img: HTMLImageElement): void;
        drawFault(): void;
    }
    class Graphics {
        target: Sprite;
        byte: Float32Array;
        hitArea: HitArea;
        numVertices: number;
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
        addPoint(pos: number[], noraml: number[], uv: number[], color: number[]): void;
        drawRect(x: number, y: number, width: number, height: number, color: number, alpha?: number, matrix?: Float32Array, z?: number): void;
        drawBitmap(x: number, y: number, vo: BitmapSourceVO, color?: number, matrix?: Float32Array, alpha?: number, z?: number): void;
        drawCube(x: number, y: number, z: number, width: number, height: number, deep: number, color: number, alpha?: number): void;
    }
    /**
     *  自动模型合并 渲染器
     *  原理:
     *      1.Sprite graphics 可以生成 【矢量图 + 贴图】的【四边形】 模型数据 vertexData  : 点定义为 vertex_ui_variable
     *      2.带有Batch渲染器的Sprite对象 自动收集children中所有graphics 模型信息 并生成合并的VertexData。VertexData会被封装进【BatchGeometry】进行渲染
     *        模型合并触发条件
     *          【1.children graphics 信息改变】
     *          【2.children visible = false|true】
     *          【3.children alpha = 0|>0】
     *      3.考虑到Sprite对象的children对象 可能也会自带渲染器 所以会生成很多的模型信息【BatchGeometry】  所以batch的rendersLink会表现为 【BatchGeometry】-> I3DRender ->【BatchGeometry】这样的渲染顺序
     *      4.被合并的children对象的x,y,scale,alpha等信息会被batch收集成一个Float32Array数据 每4位(vec4)为一个控制单元【x,y,scale,alpha】 用于shader计算
     *        所以children对象 x,y,scale,alpha 改变时 会重新收集数据【现在是只要chindren改变就全部无脑收集=。=】
     *      5.考虑到用户电脑 Max Vertex Uniform Vectors 数据不同【http://webglreport.com/】 所以要注意shader对象中ui[${max_vc}]
     *      6.dc()方法渲染 shader计算详看代码。
     */
    class BatchRenderer implements I3DRender {
        target: Sprite;
        renders: Link;
        geo: BatchGeometry;
        program: Program3D;
        worldTransform: IMatrix3D;
        t: Texture;
        constructor(target: Sprite);
        render(camera: Camera, now: number, interval: number): void;
        dc(geo: BatchGeometry): void;
        createProgram(): void;
        cleanBatch(): void;
        getBatchTargets(render: RenderBase, ox: number, oy: number, os: number): void;
        updateVCData(render: RenderBase, ox: number, oy: number, os: number): void;
        toBatch(): void;
    }
    class BatchGeometry implements I3DRender {
        vertex: VertexInfo;
        $vertexBuffer: VertexBuffer3D;
        quadcount: number;
        vcData: Float32Array;
        vci: number;
        link: Link;
        verlen: number;
        constructor();
        add(target: Sprite, g: Graphics): number;
        build(target: Sprite): void;
        update(position: number, byte: Float32Array): void;
        updateVC(sp: Sprite): void;
        onRecycle(): void;
    }
}
declare module rf {
    const enum VA {
        pos = "pos",
        normal = "normal",
        tangent = "tangent",
        color = "color",
        uv = "uv",
        index = "index",
        weight = "weight",
    }
    const enum FS {
        diff = "diff",
    }
    const enum VC {
        m = "m",
        mv = "mv",
        invm = "invm",
        p = "p",
        mvp = "mvp",
        ui = "ui",
        lightDirection = "lightDirection",
        vc_diff = "vc_diff",
        vc_emissive = "vc_emissive",
        vc_bones = "bones",
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
        uniforms: Object;
        attribs: Object;
        constructor();
        awaken(): boolean;
        dispose(): void;
        recycle(): void;
        private createShader(code, type);
    }
    class VertexBuffer3D extends Buffer3D {
        numVertices: number;
        data32PerVertex: number;
        data: VertexInfo;
        buffer: WebGLBuffer;
        constructor();
        recycle(): void;
        awaken(): boolean;
        uploadFromVector(data: number[] | Float32Array | VertexInfo, startVertex?: number, numVertices?: number): void;
        attribarray: object;
        uploadContext(program: Program3D): void;
    }
    class IndexBuffer3D extends Buffer3D {
        numIndices: number;
        data: Uint16Array;
        buffer: WebGLBuffer;
        quadid: number;
        constructor();
        recycle(): void;
        awaken(): boolean;
        uploadFromVector(data: number[] | Uint16Array, startOffset?: number, count?: number): void;
    }
    class Texture extends Buffer3D {
        key: number | string;
        data: ITextureData;
        texture: WebGLTexture;
        width: number;
        height: number;
        pixels: ImageBitmap | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement | BitmapData;
        constructor();
        awaken(): boolean;
        uploadContext(program: Program3D, index: number, variable: string): void;
        status: LoadStates;
        load(url?: string): void;
        private loadComplete(e);
        recycle(): void;
    }
    class RttTexture extends Texture {
        create(width: number, height: number): void;
    }
}
declare namespace rf {
    let context3D: Context3D;
    const enum Context3DTextureFormat {
        BGRA = "bgra",
    }
    const enum Context3DVertexBufferFormat {
        BYTES_4 = 4,
        FLOAT_1 = 1,
        FLOAT_2 = 2,
        FLOAT_3 = 3,
        FLOAT_4 = 4,
    }
    class Context3D {
        bufferLink: Link;
        triangles: number;
        dc: number;
        private _clearBit;
        constructor();
        configureBackBuffer(width: number, height: number, antiAlias: number, enableDepthAndStencil?: boolean): void;
        clear(red?: number, green?: number, blue?: number, alpha?: number, depth?: number, stencil?: number, mask?: number): void;
        triangleFaceToCull: number;
        setCulling(triangleFaceToCull: number): void;
        /**
         *
         * @param depthMask
         * @param passCompareMode
         *
         *
         * @constant Context3DCompareMode.LESS=GL.LESS
         * @constant Context3DCompareMode.NEVER=GL.NEVER
         * @constant Context3DCompareMode.EQUAL=GL.EQUAL
         * @constant Context3DCompareMode.GREATER=GL.GREATER
         * @constant Context3DCompareMode.NOT_EQUAL=GL.NOTEQUAL
         * @constant Context3DCompareMode.ALWAYS=GL.ALWAYS
         * @constant Context3DCompareMode.LESS_EQUAL=GL.LEQUAL
         * @constant Context3DCompareMode.GREATER_EQUAL=L.GEQUAL
         */
        depthMask: boolean;
        passCompareMode: number;
        setDepthTest(depthMask: boolean, passCompareMode: number): void;
        /**
            Context3DBlendFactor.ONE = GL.ONE;
            Context3DBlendFactor.ZERO = GL.ZERO;
            Context3DBlendFactor.SOURCE_COLOR = GL.SRC_COLOR;
            Context3DBlendFactor.DESTINATION_COLOR = GL.DST_COLOR;
            Context3DBlendFactor.SOURCE_ALPHA = GL.SRC_ALPHA;
            Context3DBlendFactor.DESTINATION_ALPHA = GL.DST_ALPHA;
            Context3DBlendFactor.ONE_MINUS_SOURCE_COLOR = GL.ONE_MINUS_SRC_COLOR;
            Context3DBlendFactor.ONE_MINUS_DESTINATION_COLOR = GL.ONE_MINUS_DST_COLOR;
            Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA = GL.ONE_MINUS_SRC_ALPHA;
            Context3DBlendFactor.ONE_MINUS_DESTINATION_ALPHA = GL.ONE_MINUS_DST_ALPHA;
         */
        sourceFactor: number;
        destinationFactor: number;
        setBlendFactors(sourceFactor: number, destinationFactor: number): void;
        createVertexBuffer(data: number[] | Float32Array | VertexInfo, data32PerVertex?: number, startVertex?: number, numVertices?: number): VertexBuffer3D;
        indexByte: IndexBuffer3D;
        getIndexByQuad(quadCount: number): IndexBuffer3D;
        createIndexBuffer(data: number[] | Uint16Array | ArrayBuffer): IndexBuffer3D;
        getTextureData(url: string, mipmap?: boolean, mag?: number, mix?: number, repeat?: number): ITextureData;
        textureObj: {
            [key: string]: Texture;
        };
        createTexture(key: ITextureData, pixels?: ImageBitmap | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement | BitmapData, mipmap?: boolean): Texture;
        createEmptyTexture(key: string, width: number, height: number, mipmap?: boolean): Texture;
        private _rttFramebuffer;
        setRenderToTexture(texture: Texture, enableDepthAndStencil?: boolean, antiAlias?: number, surfaceSelector?: number, colorOutputIndex?: number): void;
        setRenderToBackBuffer(): void;
        programs: {
            [key: string]: Recyclable<Program3D>;
        };
        createProgram(vertexCode: string, fragmentCode: string, key?: string): Recyclable<Program3D>;
        /**
         *
         * @param variable
         * @param data
         * @param format FLOAT_1 2 3 4
         */
        setProgramConstantsFromVector(variable: string, data: number | number[] | Float32Array, format: number, array?: boolean): void;
        /**
        *  @variable must predefined in glsl
        */
        setProgramConstantsFromMatrix(variable: string, rawData: ArrayLike<number>): void;
        private cProgram;
        setProgram(program: Program3D): void;
        drawTriangles(indexBuffer: IndexBuffer3D, numTriangles: number, firstIndex?: number): void;
        drawLines(indexBuffer: IndexBuffer3D, numTriangles: number, firstIndex?: number, numLines?: number): void;
        /**
        *   In webgl we dont need to call present , browser will do this for us.
        */
        gc(now: number): void;
        toString(): string;
    }
    /**
     * todo
     */
    function webGLSimpleReport(): Object;
}
declare module rf {
    class Light extends DisplayObject {
        color: number;
        intensity: number;
    }
    class DirectionalLight extends Light {
    }
}
declare module rf {
    class SceneObject extends RenderBase {
        scene: Scene;
        addChild(child: DisplayObject): void;
        addChildAt(child: DisplayObject, index: number): void;
        removeChild(child: DisplayObject): void;
        removeAllChild(): void;
        removeFromStage(): void;
        addToStage(): void;
    }
    class Scene extends SceneObject {
        sun: DirectionalLight;
        camera: Camera;
        constructor(variables?: {
            [key: string]: IVariable;
        });
        render(camera: Camera, now: number, interval: number): void;
    }
    class AllActiveSprite extends Sprite {
        constructor(source?: BitmapSource, variables?: {
            [key: string]: IVariable;
        });
    }
    let scene: Scene;
    let popContainer: AllActiveSprite;
    let tipContainer: AllActiveSprite;
    class Stage3D extends AllActiveSprite implements IResizeable {
        static names: string[];
        canvas: HTMLCanvasElement;
        cameraUI: CameraUI;
        camera2D: CameraOrth;
        camera3D: Camera3D;
        camera: Camera;
        constructor();
        requestContext3D(canvas: HTMLCanvasElement): boolean;
        private webglContextLostHandler(e);
        private webglContextRestoredHandler(e);
        update(now: number, interval: number): void;
        resize(width: number, height: number): void;
    }
    class PassContainer extends RenderBase {
        camera: Camera;
        constructor(variables?: {
            [key: string]: IVariable;
        });
        render(camera: Camera, now: number, interval: number): void;
    }
    class UIContainer extends AllActiveSprite {
        render(camera: Camera, now: number, interval: number): void;
    }
}
declare module rf {
    class Mesh extends SceneObject {
        scene: Scene;
        geometry: GeometryBase;
        invSceneTransform: IMatrix3D;
        skAnim: SkeletonAnimation;
        constructor(variables?: {
            [key: string]: IVariable;
        });
        updateSceneTransform(): void;
        render(camera: Camera, now: number, interval: number): void;
    }
    class KFMMesh extends Mesh {
        id: string;
        constructor(material?: Material, variables?: {
            [key: string]: IVariable;
        });
        load(url: string): void;
        loadCompelte(e: EventX): void;
        setKFM(kfm: ISkeletonMeshData): void;
        // refreshGUI(gui: dat.GUI): void;
    }
    class Skeleton {
        rootBone: IBone;
        defaultMatrices: Float32Array;
        vertex: VertexBuffer3D;
        boneCount: number;
        animations: {
            [key: string]: ISkeletonAnimationData;
        };
        constructor(config: ISkeletonData);
        initAnimationData(anim: ISkeletonAnimationData): void;
        createAnimation(): Recyclable<SkeletonAnimation>;
        getMatricesData(anim: ISkeletonAnimationData, frame: number): Float32Array;
    }
    class SkeletonAnimation {
        skeleton: Skeleton;
        pose: {
            [key: string]: Float32Array;
        };
        starttime: number;
        nextTime: number;
        animationData: ISkeletonAnimationData;
        currentFrame: number;
        play(animationData: ISkeletonAnimationData, now: number): void;
        uploadContext(camera: Camera, mesh: Mesh, program: Program3D, now: number, interval: number): void;
    }
}
declare module rf {
    class AppBase implements ITickable, IResizeable {
        nextGCTime: number;
        gcDelay: number;
        constructor();
        init(canvas?: HTMLCanvasElement): void;
        createSource(): void;
        initContainer(): void;
        update(now: number, interval: number): void;
        resize(width: number, height: number): void;
        gcChangeHandler(event: EventX): void;
    }
}
declare module rf {
    let sp: any;
    class Main extends AppBase {
        constructor();
        init(canvas?: HTMLCanvasElement): void;
        onTest(): void;
    }
}
declare module rf {
}
declare module rf {
    class Facade extends MiniDispatcher {
        SINGLETON_MSG: string;
        mediatorMap: {
            [key: string]: Mediator;
        };
        modelMap: {
            [key: string]: BaseMode;
        };
        constructor();
        mediator: Mediator;
        type: number;
        toggleMediator(mediator: Mediator, type?: number): Mediator;
        onCompleteHandle(e: EventX): void;
        registerEvent(events: {
            [key: string]: EventHandler;
        }, thisobj: any): void;
        removeEvent(event: {
            [key: string]: EventHandler;
        }): void;
    }
    let facade: Facade;
    class Mediator extends MiniDispatcher {
        eventInterests: {
            [key: string]: EventHandler;
        };
        isReady: boolean;
        name: string;
        data: BaseMode;
        constructor(NAME: string);
        _panel: TPanel;
        setPanel(panel: TPanel): void;
        startSync(): boolean;
        preViewCompleteHandler(e: EventX): void;
        awakenAndSleepHandle(e: EventX): void;
        setBindView(isBind: boolean): void;
        mediatorReadyHandle(): void;
        sleep(): void;
        awaken(): void;
        onRemove(): void;
    }
    class BaseMode extends MiniDispatcher {
        modelName: string;
        isReady: boolean;
        constructor(modelName: string);
        refreshRuntimeData(type: string, data: any): void;
        initRuntime(): void;
        onRegister(): void;
        onRemove(): void;
    }
}
declare module rf {
    var manage: PanelSourceManage;
    const enum PanelEvent {
        SHOW = "PanelEvent_SHOW",
        HIDE = "PanelEvent_HIDE",
    }
    class DataBase {
        DataBase3D(): void;
        _data: any;
        data: any;
        doData(): void;
        dispose(): void;
        clear(): void;
    }
    class SkinBase extends DataBase {
        static ROOT: Stage3D;
        constructor(skin?: Sprite);
        _skin: Sprite;
        skin: Sprite;
        bindComponents(): void;
        refreshData(): void;
        _selected: boolean;
        selected: boolean;
        doSelected(): void;
        _enabled: boolean;
        enabled: boolean;
        doEnabled(): void;
        awaken(): void;
        sleep(): void;
        addEventListener(type: string | number, listener: Function, thisobj: any, priority?: number): void;
        dispatchEvent(event: EventX): boolean;
        hasEventListener(type: string | number): boolean;
        removeEventListener(type: string | number, listener: Function): void;
        simpleDispatch(type: string | number, data?: any, bubbles?: boolean): boolean;
        visible: boolean;
        doVisible(): void;
        alpha: number;
        scale: number;
        x: number;
        y: number;
        addChild(child: DisplayObject): void;
        addChildAt(child: DisplayObject, index: number): void;
        invalidateFuncs: Array<Function>;
        invalidate(func?: Function): void;
        invalidateRemove(func?: Function): void;
        onInvalidate(event: Event): void;
        remove(event?: any): void;
    }
    class PanelBase extends SkinBase {
        isShow: boolean;
        constructor();
        show(container?: any, isModal?: Boolean): void;
        effectTween(type: number): void;
        getTweener(type: number): void;
        effectEndByBitmapCache(type: number): void;
        hide(e?: Event): void;
        bringTop(): void;
        panelClickHandler(e: MouseEventX): void;
    }
    class TPanel extends PanelBase {
        uri: string;
        clsName: string;
        _resizeable: boolean;
        source: AsyncResource;
        container: DisplayObjectContainer;
        isModel: boolean;
        isReadyShow: boolean;
        loaded: boolean;
        constructor(uri: string, cls: string);
        getURL(): string;
        show(container?: any, isModal?: boolean): void;
        load(): void;
        asyncsourceComplete(e: EventX): void;
        hide(e?: Event): void;
    }
}
declare module rf {
    class PanelSource extends BitmapSource {
        isReady: boolean;
        constructor();
    }
}
declare module rf {
    class PanelSourceManage {
        protected all_res: object;
        constructor();
        load(url: string, uri: string): AsyncResource;
        getres(url: string, uri: string): AsyncResource;
    }
    class AsyncResource extends MiniDispatcher {
        setting: object;
        source: PanelSource;
        status: number;
        private d_setting;
        constructor();
        load(url: string): void;
        p3dloadComplete(e: EventX): void;
        resourceComplete(o: object): void;
        onImageComplete(e: EventX): void;
    }
}
declare module rf {
    interface IMouseElement {
        target: DisplayObject;
        time: number;
        down: number;
        up: number;
        click: number;
        over?: number;
        out?: number;
    }
    interface ITouchlement {
        target: DisplayObject;
        time: number;
        data: MouseEventData;
    }
    class Mouse {
        init(mobile: boolean): void;
        preMouseTime: number;
        preMoveTime: number;
        preTarget: DisplayObject;
        mouseElement: {
            [key: number]: IMouseElement;
        };
        touchElement: {
            [key: number]: ITouchlement;
        };
        mouseHanlder(e: any): void;
        preRolled: DisplayObject;
        preMouseMoveTime: number;
        mouseMoveHandler(e: any): void;
        touchHandler(e: TouchEvent): void;
        touchCenterY: number;
        touchLen: number;
        touchMoveHandler(e: TouchEvent): void;
    }
    const MouseInstance: Mouse;
}
declare module rf {
    class TrackballControls {
        object: Camera;
        target: IVector3D;
        mouseSitivity: number;
        distance: number;
        constructor(object: Camera);
        updateSun(): void;
        tdistance: number;
        tweener: ITweener;
        mouseWheelHandler(event: EventX): void;
        mouseDownHandler(event: EventX): void;
        mouseUpHandler(e: EventX): void;
        mouseMoveHandler(e: EventX): void;
        mouseRightDownHandler(event: EventX): void;
        mouseRightMoveHandler(event: EventX): void;
        mouseRightUpHandler(event: EventX): void;
    }
}
declare module rf {
    interface IDisplayFrameElement {
        type: number;
        name: string;
        rect: any;
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        rotaion: number;
        matrix2d: IMatrix;
        libraryItemName: string;
    }
    interface IDisplayTextElement extends IDisplayFrameElement {
        fontRenderingMode: String;
        width: number;
        height: number;
        selectable: boolean;
        text: string;
        filter: any[];
        format: object;
        input: boolean;
        multiline: boolean;
        color: number;
    }
    interface IDisplaySymbol extends IDisplayFrameElement {
        className: String;
        displayClip: number;
        displayFrames: {
            [key: number]: IDisplayFrameElement[];
        };
    }
    const enum SymbolConst {
        SYMBOL = 0,
        BITMAP = 1,
        TEXT = 2,
        RECTANGLE = 3,
    }
    const enum ComponentConst {
        Label = 0,
        Button = 1,
        CheckBox = 2,
        RadioButton = 3,
        List = 4,
        MList = 5,
        TabItem = 6,
        Tab = 7,
    }
    class Component extends Sprite {
        constructor(source?: BitmapSource);
        currentClip: number;
        symbol: IDisplaySymbol;
        sceneMatrix: IMatrix;
        _skin: object;
        setSymbol(symbol: IDisplaySymbol, matrix?: IMatrix): void;
        gotoAndStop(clip: any, refresh?: Boolean): void;
        addToStage(): void;
        removeFromStage(): void;
        renderFrameElement(element: IDisplayFrameElement, clean?: Boolean): void;
        _selected: boolean;
        selected: boolean;
        doSelected(): void;
        _enabled: boolean;
        enabled: boolean;
        doEnabled(): void;
        _data: any;
        data: any;
        doData(): void;
        bindComponents(): void;
    }
    interface ILabel {
        label: string;
        editable: boolean;
        text: TextField;
    }
    class Label extends Component implements ILabel {
        text: TextField;
        _label: string;
        label: string;
        _editable: boolean;
        editable: boolean;
        doEditable(): void;
        bindComponents(): void;
        doLabel(): void;
        textResize(): void;
    }
    interface IButton extends ILabel {
        addClick(func: Function, thisObj?: any): any;
    }
    class Button extends Label implements IButton {
        bindComponents(): void;
        addClick(listener: Function, thisObj?: any): void;
    }
}
declare module rf {
    class TextEditor extends MiniDispatcher {
        private _text;
        private _inputdiv;
        private _input;
        private _area;
        private _current;
        init(): void;
        setTextfiled(text: TextField): void;
        private updateinfo();
        private _defaultValue(ele);
        private _defaultTxt(ele);
        private blurHandler();
    }
    let emote_images: {
        [key: string]: Image;
    };
    const enum TextFormatAlign {
        LEFT = "left",
        RIGHT = "right",
        CENTER = "center",
    }
    const enum TextFieldType {
        INPUT = "input",
        DYNAMIC = "dynamic",
    }
    class TextFormat {
        family: string;
        oy: number;
        size: number;
        align: string;
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
        getColorStr(color: number): string;
        clone(format?: TextFormat): TextFormat;
    }
    /**
     * 优化计划
     * 1. textformat.oy 这东西不应该存在 他的作用主要是用于修正微软雅黑取jqpy等下标超界值。 需要研究 如何取获得 渲染文字的定义。上标 下标等渲染值。
     * 2. set text: 现在只要set text就会触发计算 绘制 渲染操作 如果后期一帧内频繁修改text可能会卡。所以应该换成1帧最多渲染1次的策略。
     */
    class TextField extends Sprite {
        html: boolean;
        $text: string;
        format: TextFormat;
        color: number;
        element: HtmlElement;
        gap: number;
        multiline: boolean;
        maxChars: number;
        lineheight: number;
        protected _edit: boolean;
        private _type;
        init(source?: BitmapSource, format?: TextFormat): void;
        private lines;
        private textLines;
        text: string;
        cleanAll(): void;
        layout(): void;
        getCharSourceVO(char: string, format: TextFormat): BitmapSourceVO;
        tranfromHtmlElement2CharDefine(html: HtmlElement, width?: number): Recyclable<Line>[];
        updateHitArea(): void;
        type: string;
        protected mouseDownHandler(event: MouseEventX): void;
        private onblurHandler(event);
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
        /**
         * 是否需要换行
         */
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
    class PerspectiveMatrix3D extends Float32Array {
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
    var particle_Perfix: string;
    var particle_Texture_Perfix: string;
    class Particle extends Mesh {
        data: IParticleData;
        load(url: string): void;
        loadCompelte(e: EventX): void;
        play(data: IParticleData): void;
    }
    class ParticleGeometry extends GeometryBase {
        runtimeData: IParticleRuntimeData;
        setRuntime(runtime: IParticleRuntimeData): void;
        uploadContext(camera: Camera, mesh: Particle, program: Program3D, now: number, interval: number): void;
    }
    const enum P_PARTICLE {
        TIME = "p_time",
        SCALE = "p_scale",
        ROTATION = "p_init_rotation",
        VROTATION = "p_vrotation",
        ROTATION_HEAD = "p_rotation2head",
        POSITION = "p_position",
        FOLLOW = "p_follow",
        VELOCITY = "p_velocity",
        ACCELERITION = "p_accelerition",
        BILLBOARD = "p_billboard",
        SEGMENT_COLOR = "p_segment_color",
        SPRITE_SHEET = "p_sprite_sheet_anim",
        NOW = "now",
    }
    class ParticleMaterial extends Material {
        getTextUrl(data: ITextureData): string;
        uploadContext(camera: Camera, mesh: Mesh, now: number, interval: number): boolean;
        createProgram(mesh: Mesh): Recyclable<Program3D>;
        timeNode(info: IParticleTimeNodeInfo): string;
        scaleNode(info: IParticleScaleNodeInfo): string;
        segmentColorNode(info: IParticleSegmentColorNodeInfo): string;
        spriteSheetNode(info: IParticleSpriteSheetAnimNodeInfo): string;
    }
}
declare module rf {
    var skill_Perfix: string;
    interface ISkillEffectCreateEvent extends ISkillBaseEvent {
        res: string;
    }
    function skill_MeshCreate(line: ISkillLineData, event: ISkillEffectCreateEvent): void;
    class Skill extends SceneObject {
        load(url: string): void;
        loadCompelte(e: EventX): void;
        data: ISkillData;
        play(data: ISkillData): void;
        update(now: number, interval: number): void;
    }
}
declare module rf {
    interface IData {
        [key: string]: any;
        [key: number]: any;
    }
    /**
     * 贴图数据
     * 如果只有url 可以通过context3D.getTextureData(url)获得
     */
    interface ITextureData extends IData {
        key: string;
        url: string;
        mipmap: boolean;
        mag: number;
        mix: number;
        repeat: number;
    }
    /**
     * 材质球数据
     */
    interface IMaterialData extends IData {
        depthMask: boolean;
        passCompareMode: number;
        srcFactor: number;
        dstFactor: number;
        cull: number;
        alphaTest: number;
        diffTex?: ITextureData;
        specularTex?: ITextureData;
        normalTex?: ITextureData;
        emissiveTex?: ITextureData;
    }
    /**
     * 模型数据
     */
    interface IMeshData extends IData {
        vertex: Float32Array;
        index: Uint16Array;
        variables: {
            [key: string]: IVariable;
        };
        numVertices: number;
        numTriangles: number;
        data32PerVertex: number;
        vertexBuffer: VertexBuffer3D;
        indexBuffer: IndexBuffer3D;
    }
    /**
     * 单骨骼数据
     */
    interface IBone extends IData {
        inv: IMatrix3D;
        matrix: IMatrix3D;
        sceneTransform: Float32Array;
        name: string;
        index: number;
        parent: IBone;
        children: IBone[];
    }
    /**
     * 全骨骼数据
     */
    interface ISkeletonData extends IData {
        vertex: Float32Array;
        root: IBone;
        data32PerVertex: number;
        numVertices: number;
        boneCount: number;
    }
    interface ISkeletonMeshData extends IData {
        mesh: IMeshData;
        skeleton: ISkeletonData;
        material: IMaterialData;
        anims: string[];
    }
    interface ISkeletonAnimationData extends IData {
        skeleton: Skeleton;
        matrices: Float32Array[];
        duration: number;
        eDuration: number;
        totalFrame: number;
        name: string;
        frames: {
            [key: string]: Float32Array;
        };
    }
    interface IParticlePropertyData {
        delay: number;
        duration: number;
        index: number;
        startTime: number;
        total: number;
        totalTime: number;
    }
    interface IParticleRuntimeData extends IMeshData {
        props: IParticlePropertyData[];
    }
    interface IParticleSettingData {
        offset: number;
        speed: number;
        pos: IVector3D;
        rot: IVector3D;
    }
    interface IParticleNodeInfo {
        name: string;
        type: number;
        key: string;
        vertexFunction: string;
        fragmentFunction: string;
    }
    interface IParticleTimeNodeInfo extends IParticleNodeInfo {
        usesDuration: boolean;
        usesLooping: boolean;
        usesDelay: boolean;
    }
    interface IParticleScaleNodeInfo extends IParticleNodeInfo {
        scaleType: number;
        usesCycle: boolean;
        usesPhase: boolean;
    }
    interface IParticleSegmentColorNodeInfo extends IParticleNodeInfo {
        usesMul: boolean;
        usesAdd: boolean;
        len: number;
        mul: number;
        add: number;
        data: Float32Array;
    }
    interface IParticleSpriteSheetAnimNodeInfo extends IParticleNodeInfo {
        usesCycle: boolean;
        usesPhase: boolean;
        totalFrames: number;
        colum: number;
        rows: number;
        data: Float32Array;
    }
    interface IParticleData {
        material: IMaterialData;
        mesh: IMeshData;
        runtime: IParticleRuntimeData;
        setting: IParticleSettingData;
        nodes: {
            [key: string]: IParticleNodeInfo;
        };
    }
    interface ISkillBaseEvent {
        type: number;
        key: string;
        time: number;
        next: ISkillBaseEvent;
        pre: ISkillBaseEvent;
    }
    interface ISkillPointData {
        skillEvents: ISkillBaseEvent[];
        createEvents: ISkillBaseEvent[];
        time: number;
        index: number;
    }
    interface ISkillLineData {
        desc: string;
        count: number;
        points: ISkillPointData[];
        runtime: {
            [key: string]: RenderBase;
        };
    }
    interface ISkillData {
        lines: ISkillLineData[];
    }
}
declare module rf {
    class GUIProfile extends Sprite {
        timeTex: TextField;
        fpsTxt: TextField;
        dcTxt: TextField;
        repolyTxt: TextField;
        bufferTex: TextField;
        tweenTex: TextField;
        constructor();
        private bindComponents();
        private createText();
        fpsChangeHandler(event: EventX): void;
    }
}
declare module rf {
    let line_variable: {
        [key: string]: IVariable;
    };
    class Line3DPoint {
        x: number;
        y: number;
        z: number;
        r: number;
        g: number;
        b: number;
        a: number;
        t: number;
        clear(): void;
        clone(): Line3DPoint;
    }
    /**
     * 直线 不管放大 缩小 都不变
     */
    class Line3D extends RenderBase {
        constructor();
        private origin;
        private tempVertex;
        points: Line3DPoint[];
        vertexBuffer: VertexBuffer3D;
        program: Program3D;
        worldTransform: IMatrix3D;
        data32PerVertex: number;
        numVertices: number;
        triangles: number;
        quad: number;
        clear(): void;
        moveTo(x: number, y: number, z: number, thickness?: number, color?: number, alpha?: number): void;
        lineTo(x: number, y: number, z: number, thickness?: number, color?: number, alpha?: number): void;
        private build();
        end(): void;
        updateTransform(): void;
        render(camera: Camera, now: number, interval: number): void;
        protected createProgram(): Program3D;
    }
    class Trident extends Line3D {
        constructor(len?: number, think?: number);
    }
}
declare module rf {
    class PanelUtils {
        skin: Component;
        setting: object;
        btn_random: Button;
        btn_create: Button;
        bg: IconView;
        manage: PanelSourceManage;
        source: AsyncResource;
        constructor();
        private asyncsourceComplete(e);
        protected bindComponents(): void;
        protected randomHandler(e: EventX): void;
    }
}
declare module rf {
    class Eva_Text {
        constructor();
        onKeyDownHandle(e: KeyboardEvent): void;
    }
    class TestMediator extends Mediator {
        $panel: TestPanel;
        constructor();
        mediatorReadyHandle(): void;
        awaken(): void;
    }
    class TestPanel extends TPanel {
        constructor();
        key: KeyManagerV2;
        awaken(): void;
        onKeyHandle(e: KeyboardEvent): void;
        sleep(): void;
    }
    class TestModel extends BaseMode {
        constructor();
    }
}
declare module rf {
    const enum Keybord {
        A = 65,
        ALTERNATE = 18,
        AUDIO = 16777239,
        B = 66,
        BACK = 16777238,
        BACKQUOTE = 192,
        BACKSLASH = 220,
        BACKSPACE = 8,
        BLUE = 16777219,
        C = 67,
        CAPS_LOCK = 20,
        CHANNEL_DOWN = 16777221,
        CHANNEL_UP = 16777220,
        COMMA = 188,
        COMMAND = 15,
        CONTROL = 17,
        D = 68,
        DELETE = 46,
        DOWN = 40,
        DVR = 16777241,
        E = 69,
        END = 35,
        ENTER = 13,
        EQUAL = 187,
        ESCAPE = 27,
        EXIT = 16777237,
        F = 70,
        F1 = 112,
        F10 = 121,
        F11 = 122,
        F12 = 123,
        F13 = 124,
        F14 = 125,
        F15 = 126,
        F2 = 113,
        F3 = 114,
        F4 = 115,
        F5 = 116,
        F6 = 117,
        F7 = 118,
        F8 = 119,
        F9 = 120,
        FAST_FORWARD = 16777226,
        G = 71,
        GREEN = 16777217,
        GUIDE = 16777236,
        H = 72,
        HELP = 16777245,
        HOME = 36,
        I = 73,
        INFO = 16777235,
        INPUT = 16777243,
        INSERT = 45,
        J = 74,
        K = 75,
        L = 76,
        LAST = 16777233,
        LEFT = 37,
        LEFTBRACKET = 219,
        LIVE = 16777232,
        M = 77,
        MASTER_SHELL = 16777246,
        MENU = 16777234,
        MINUS = 189,
        N = 78,
        NEXT = 16777230,
        NUMBER_0 = 48,
        NUMBER_1 = 49,
        NUMBER_2 = 50,
        NUMBER_3 = 51,
        NUMBER_4 = 52,
        NUMBER_5 = 53,
        NUMBER_6 = 54,
        NUMBER_7 = 55,
        NUMBER_8 = 56,
        NUMBER_9 = 57,
        NUMPAD = 21,
        NUMPAD_0 = 96,
        NUMPAD_1 = 97,
        NUMPAD_2 = 98,
        NUMPAD_3 = 99,
        NUMPAD_4 = 100,
        NUMPAD_5 = 101,
        NUMPAD_6 = 102,
        NUMPAD_7 = 103,
        NUMPAD_8 = 104,
        NUMPAD_9 = 105,
        NUMPAD_ADD = 107,
        NUMPAD_DECIMAL = 110,
        NUMPAD_DIVIDE = 111,
        NUMPAD_ENTER = 108,
        NUMPAD_MULTIPLY = 106,
        NUMPAD_SUBTRACT = 109,
        O = 79,
        P = 80,
        PAGE_DOWN = 34,
        PAGE_UP = 33,
        PAUSE = 16777224,
        PERIOD = 190,
        PLAY = 16777223,
        PREVIOUS = 16777231,
        Q = 81,
        QUOTE = 222,
        R = 82,
        RECORD = 16777222,
        RED = 16777216,
        REWIND = 16777227,
        RIGHT = 39,
        RIGHTBRACKET = 221,
        S = 83,
        SEARCH = 16777247,
        SEMICOLON = 186,
        SETUP = 16777244,
        SHIFT = 16,
        SKIP_BACKWARD = 16777229,
        SKIP_FORWARD = 16777228,
        SLASH = 191,
        SPACE = 32,
        STOP = 16777225,
        SUBTITLE = 16777240,
        T = 84,
        TAB = 9,
        U = 85,
        UP = 38,
        V = 86,
        VOD = 16777242,
        W = 87,
        X = 88,
        Y = 89,
        YELLOW = 16777218,
        Z = 90,
    }
    class KeyManagerV2 extends MiniDispatcher {
        static enabled: Boolean;
        keylist: number[];
        keylimit: number[];
        /**
         *用于独占按键响应，如果为true，则即使该管理器没有响应 按键回调，也不会在mainKey管理器中响应
         */
        isClosed: boolean;
        /**
         * 系统默认的快捷键管理器，如果按键没有任何地方响应 那么将会响应mainKey.
         */
        static _defaultMainKey: KeyManagerV2;
        /**
         * 当前系统响应的快捷键.
         */
        static currentKey: KeyManagerV2;
        constructor(target?: DisplayObject);
        mouseDownHandler(e: MouseEventX): void;
        static resetDefaultMainKey(value?: KeyManagerV2): void;
        static setFocus(focus?: KeyManagerV2): void;
        awaken(): void;
        sleep(): void;
        init(): void;
        onKeyHandle(e: KeyboardEvent): void;
        /**
         * 执行快捷键
         * @param e
         * @param keyvalue
         */
        keyDict: {
            [key: string]: Function;
        };
        keyObj: {
            [key: string]: any;
        };
        currentKeyCode: number;
        doKey(e: KeyboardEvent, keyvalue: number): boolean;
        check(): boolean;
        regKeyDown(key: number, func: Function, thisobj: any, shift?: boolean, ctrl?: boolean, alt?: boolean): void;
        removeKeyDown(key: number, func: Function, shift?: boolean, ctrl?: boolean, alt?: boolean): void;
    }
    let mainKey: KeyManagerV2;
}
declare module rf {
    class Pan_Test {
        constructor();
    }
}
declare module rf {
    class TextTest {
        constructor();
    }
}
