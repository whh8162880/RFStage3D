///<reference path="./ThrowError.ts" />


declare function parseInt(s: number, radix?: number): number;

declare class Zlib{
    static Inflate:any;
}


/**
 * 对数字进行补0操作
 * @param value 要补0的数值
 * @param length 要补的总长度
 * @return 补0之后的字符串
 */
function zeroize(value: number | string, length: number = 2): string {
    let str = "" + value;
    let zeros = "";
    for (let i = 0, len = length - str.length; i < len; i++) {
        zeros += "0";
    }
    return zeros + str;
}
/**
 * 获取完整的 PropertyDescriptor
 * 
 * @param {Partial<PropertyDescriptor>} descriptor 
 * @param {boolean} [enumerable=false] 
 * @param {boolean} [writable]
 * @param {boolean} [configurable=true] 
 * @returns 
 */
function getDescriptor(descriptor: PropertyDescriptor, enumerable = false, writable = true, configurable = true) {
    if (!descriptor.set && !descriptor.get) {
        descriptor.writable = writable;
    }
    descriptor.configurable = configurable;
    descriptor.enumerable = enumerable;
    return descriptor;
}

function makeDefDescriptors(descriptors: object, enumerable = false, writable = true, configurable = true) {
    for (let key in descriptors) {
        let desc: PropertyDescriptor = descriptors[key];
        let enumer = desc.enumerable == undefined ? enumerable : desc.enumerable;
        let write = desc.writable == undefined ? writable : desc.writable;
        let config = desc.configurable == undefined ? configurable : desc.configurable;
        descriptors[key] = getDescriptor(desc, enumer, write, config);
    }
    return descriptors as PropertyDescriptorMap;
}
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
    copyto(to: Object);
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
    equals(checker: object, ...args: (keyof this)[]);

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

Object.defineProperties(Object.prototype, makeDefDescriptors({
    clone: {
        value: function () {
            let o = {};
            for (let n in this) {
                o[n] = this[n];
            }
            return o;
        }
    },
    getPropertyDescriptor: {
        value: function (property: string): any {
            var data = Object.getOwnPropertyDescriptor(this, property);
            if (data) {
                return data;
            }
            var prototype = Object.getPrototypeOf(this);
            if (prototype) {
                return prototype.getPropertyDescriptor(property);
            }
        }
    },
    copyto: {
        value: function (to: Object) {
            for (let p in this) {
                var data: PropertyDescriptor = to.getPropertyDescriptor(p);
                if (!data || (data.set || data.writable)) {// 可进行赋值，防止将属性中的方法给重写
                    to[p] = this[p];
                }
            }
        }
    },
    equals: {
        value: function (checker: Object, ...args: string[]) {
            if (!args.length) {
                args = Object.getOwnPropertyNames(checker);
            }
            for (let i = 0; i < args.length; i++) {
                let key = args[i];
                if (this[key] != checker[key]) {
                    return false;
                }
            }
            return true;
        }
    },
    copyWith: {
        value: function (to: object, ...proNames: string[]) {
            for (let p of proNames) {
                if (p in this) {
                    to[p] = this[p];
                }
            }
        }
    },
    getSpecObject: {
        value: function (...proNames: string[]) {
            let obj = {};
            for (let p of proNames) {
                if (p in this) {
                    if (this[p] != null) {
                        obj[p] = this[p];
                    }
                }
            }
            return obj;
        }
    }
}));

// interface Uint16Array{
//     addQuadIndex(position:number):void
//     appendGeo(value:number[]|Uint16Array,)
// }


interface Float32Array{
    x:number;
    y:number;
    z:number;
    w:number;
    update(data32PerVertex: number, offset: number, v: number): void;
    wPoint1(position: number, x: number, y?: number, z?: number, w?: number): void
    wPoint2(position: number, x: number, y: number, z?: number, w?: number): void
    wPoint3(position: number, x: number, y: number, z: number, w?: number): void
    wPoint4(position: number, x: number, y: number, z: number, w: number): void
    clone():Float32Array;
}


Object.defineProperties(Float32Array.prototype, makeDefDescriptors({
    x:{
        get(){
            return this[0];
        },
        set(value){
            this[0]=value;
        }
    },

    y:{
        get(){
            return this[1];
        },
        set(value){
            this[1]=value;
        }
    },


    z:{
        get(){
            return this[2];
        },
        set(value){
            this[2]=value;
        }
    },

    w:{
        get(){
            return this[3];
        },
        set(value){
            this[3]=value;
        }
    },

    update: {
        value : function(data32PerVertex: number, offset: number, v: number){
            let len = this.length;
            for (let i = 0; i < len; i += data32PerVertex) {
                this[i + offset] = v;
            }
        }
    },

    wPoint1 : {
        value : function(position: number, x: number, y?: number, z?: number, w?: number): void{
            this[position] = x;
        }
    },

    wPoint2: {
       value : function(position: number, x: number, y: number, z?: number, w?: number): void{
            this[position] = x;
            this[position+1] = y;
        }
    },

    wPoint3: {
        value : function(position: number, x: number, y: number, z: number, w?: number): void{
            this[position] = x;
            this[position+1] = y;
            this[position+2] = z;
        }
    },

    wPoint4 :{
        value:function(position: number, x: number, y: number, z: number, w: number): void{
            this[position] = x;
            this[position+1] = y;
            this[position+2] = z;
            this[position+3] = w;
        }
    },
    clone :{
        value:function(){
            return new Float32Array(this);
        }
    }
}))

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
Object.defineProperties(Function.prototype, makeDefDescriptors({
    isSubClass: {
        value: function (testBase: Function) {
            if (typeof testBase !== "function") {
                return false;
            }
            let base = this.prototype;
            let flag = false;
            while (base !== null && base !== Object) {
                if (base === testBase) {
                    flag = true;
                    break;
                }
                base = base.prototype;
            }
            return true;
        }
    }
}));

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

Math.DEG_TO_RAD = Math.PI / 180;

Math.RAD_TO_DEG = 180 / Math.PI;

Math.PI2 = 2 * Math.PI;

Math.PI_1_2 = Math.PI * .5;

Math.clamp = (value, min, max) => {
    if (value < min) {
        value = min;
    }
    if (value > max) {
        value = max;
    }
    return value;
}

Math.random2 = (min, max) => {
    return min + Math.random() * (max - min);
}

Math.random3 = (center, delta) => {
    return center - delta + Math.random() * 2 * delta;
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
if (!Number.isSafeInteger) {//防止低版本浏览器没有此方法
    Number.isSafeInteger = (value: number) => value < 9007199254740991/*Number.MAX_SAFE_INTEGER*/ && value >= -9007199254740991/*Number.MIN_SAFE_INTEGER*/
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

Object.defineProperties(Number.prototype, makeDefDescriptors({
    zeroize: getDescriptor({
        value: function (this: number, length: number) { return zeroize(this, length) }
    }),
    between: getDescriptor({
        value: function (this: number, min: number, max: number) { return min <= this && max >= this }
    })
}));

/****************************************扩展String****************************************/
interface String {
    /**
     * 替换字符串中{0}{1}{2}{a} {b}这样的数据，用obj对应key替换，或者是数组中对应key的数据替换
     */
    trim():string;
    substitute(...args): string;
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


Object.defineProperties(String.prototype, makeDefDescriptors({
    zeroize: {
        value: function (length) { return zeroize(this, length) },
    },
    trim:{
        value: function (this: string) {
            return this.replace(/(^[\s\t\f\r\n\u3000\ue79c ]*)|([\s\t\f\r\n\u3000\ue79c ]*$)/g,"");
        }
    },
    substitute: {
        value: function (this: string) {
            let len = arguments.length;
            if (len > 0) {
                let obj;
                if (len == 1) {
                    obj = arguments[0];
                    if (typeof obj !== "object") {
                        obj = arguments;
                    }
                } else {
                    obj = arguments;
                }
                if ((obj instanceof Object) && !(obj instanceof RegExp)) {
                    return this.replace(/\{(?:%([^{}]+)%)?([^{}]+)\}/g, function (match: string, handler: string, key: string) {
                        //检查key中，是否为%开头，如果是，则尝试按方法处理                        
                        let value = obj[key];
                        if (handler) {//如果有处理器，拆分处理器
                            let func = String.subHandler[handler];
                            if (func) {
                                value = func(value);
                            }
                        }
                        return (value !== undefined) ? '' + value : match;
                    });
                }
            }
            return this.toString();//防止生成String对象，ios反射String对象会当成一个NSDictionary处理
        }
    },
    hash: {
        value: function () {
            var len = this.length;
            var hash = 5381;
            for (var i = 0; i < len; i++) {
                hash += (hash << 5) + this.charCodeAt(i);
            }
            return hash & 0xffffffff;
        }
    },
    trueLength: {
        value: function () {
            let arr: string[] = this.match(/[\u2E80-\u9FBF]/ig);
            return this.length + (arr ? arr.length : 0);
        }
    }
}));
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
    regSubHandler(key: string, handler: { (input: any): string });

    /**
     * substitute的回调函数
     * 
     * @type {Readonly<{ [index: string]: { (input: any): string } }>}
     * @memberOf StringConstructor
     */
    subHandler: Readonly<{ [index: string]: { (input: any): string } }>;
}

String.zeroize = zeroize;
String.subHandler = {};

String.regSubHandler = function (key, handler) {
    if (DEBUG) {
        if (handler.length != 1) {
            rf.ThrowError(`String.regSubHandler注册的函数，参数数量必须为一个，堆栈：\n${new Error().stack}\n函数内容：${handler.toString()}`);
        }
        if (key in this.subHandler) {
            rf.ThrowError(`String.regSubHandler注册的函数，注册了重复的key[${key}]，堆栈：\n${new Error().stack}`);
        }
    }
    this.subHandler[key] = handler;
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

Object.defineProperties(Date.prototype, makeDefDescriptors({
    format: {
        value: function (mask, local?: boolean) {
            let d: Date = this;
            return mask.replace(/"[^"]*"|'[^']*'|(?:d{1,2}|m{1,2}|yy(?:yy)?|([hHMs])\1?)/g, function ($0) {
                switch ($0) {
                    case "d": return gd();
                    case "dd": return zeroize(gd());
                    case "M": return gM() + 1;
                    case "MM": return zeroize(gM() + 1);
                    case "yy": return (gy() + "").substr(2);
                    case "yyyy": return gy();
                    case "h": return gH() % 12 || 12;
                    case "hh": return zeroize(gH() % 12 || 12);
                    case "H": return gH();
                    case "HH": return zeroize(gH());
                    case "m": return gm();
                    case "mm": return zeroize(gm());
                    case "s": return gs();
                    case "ss": return zeroize(gs());
                    default: return $0.substr(1, $0.length - 2);
                }
            });
            function gd() { return local ? d.getDate() : d.getUTCDate() }
            function gM() { return local ? d.getMonth() : d.getUTCMonth() }
            function gy() { return local ? d.getFullYear() : d.getUTCFullYear() }
            function gH() { return local ? d.getHours() : d.getUTCHours() }
            function gm() { return local ? d.getMinutes() : d.getUTCMinutes() }
            function gs() { return local ? d.getSeconds() : d.getUTCSeconds() }
        }
    }
}));

/****************************************扩展Array****************************************/
const enum ArraySort {
    /**
     * 升序
     */
    ASC = 0,
    /**
     * 降序
     */
    DESC = 1
}



interface ArrayConstructor {
    binaryInsert<T>(partArr: T[], item: T, filter: { (tester: T, ...args): boolean }, ...args);
    SORT_DEFAULT: { number: 0, string: "", boolean: false };
}
Array.binaryInsert = <T>(partArr: T[], item: T, filter: { (tester: T, ...args): boolean }, ...args) => {
    //根据物品战力进行插入
    let right = partArr.length - 1;
    let left = 0;
    while (left <= right) {
        let middle = (left + right) >> 1;
        let test = partArr[middle];
        if (filter(test, ...args)) {
            right = middle - 1;
        } else {
            left = middle + 1;
        }
    }
    partArr.splice(left, 0, item);
}

/**
 * 用于对Array排序时，处理undefined
 */
Array.SORT_DEFAULT = {
    number: 0,
    string: "",
    boolean: false
}
Object.freeze(Array.SORT_DEFAULT);

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
    cloneTo<T>(to: Array<T>);

    /**
     * 将数组附加到to中
     * 
     * @template T
     * @param {Array<T>} to
     * 
     * @memberOf ArrayConstructor
     */
    appendTo<T>(to: Array<T>);
}

Object.defineProperties(Array.prototype, makeDefDescriptors({
    cloneTo: {
        value: function <T>(this: T[], b: any[]) {
            b.length = this.length;
            let len = this.length;
            b.length = len;
            for (let i = 0; i < len; i++) {
                b[i] = this[i];
            }
        }
    },
    appendTo: {
        value: function <T>(this: T[], b: any[]) {
            let len = this.length;
            for (let i = 0; i < len; i++) {
                b.push(this[i]);
            }
        }
    },
    pushOnce: {
        value: function <T>(this: T[], t: T) {
            let idx = this.indexOf(t);
            if (!~idx) {
                idx = this.length;
                this[idx] = t;
            }
            return idx;
        }
    },
    remove: {
        value: function <T>(this: T[], t: T) {
            let idx = this.indexOf(t);
            if (~idx) {
                this.splice(idx, 1);
                return true;
            }
            return false;
        },
        writable: true
    },
    doSort: {
        value: function () {
            let key: string, descend: boolean;
            let len = arguments.length;
            if (DEBUG && len > 2) {
                rf.ThrowError(`doSort参数不能超过2`);
            }
            for (let i = 0; i < len; i++) {
                let arg = arguments[i];
                let t = typeof arg;
                if (t === "string") {
                    key = arg;
                } else {
                    descend = !!arg;
                }
            }
            if (key) {
                return this.sort((a: any, b: any) => descend ? b[key] - a[key] : a[key] - b[key]);
            } else {
                return this.sort((a: any, b: any) => descend ? b - a : a - b);
            }
        }
    },
    multiSort: {
        value: function (kArr: string[], dArr?: boolean[] | boolean) {
            let isArr = Array.isArray(dArr);
            return this.sort((a: any, b: any): number => {
                const def = Array.SORT_DEFAULT;
                for (let idx = 0, len = kArr.length; idx < len; idx++) {
                    let key = kArr[idx];
                    let mode = isArr ? !!dArr[idx] : !!dArr;
                    let av = a[key];
                    let bv = b[key];
                    let typea = typeof av;
                    let typeb = typeof bv;
                    if (typea == "object" || typeb == "object") {
                        if (DEBUG) {
                            rf.ThrowError(`multiSort 比较的类型不应为object,${typea}    ${typeb}`);
                        }
                        return 0;
                    }
                    else if (typea != typeb) {
                        if (typea == "undefined") {
                            bv = def[typeb];
                        } else if (typeb == "undefined") {
                            av = def[typea];
                        }
                        else {
                            if (DEBUG) {
                                rf.ThrowError(`multiSort 比较的类型不一致,${typea}    ${typeb}`);
                            }
                            return 0;
                        }
                    }
                    if (av < bv) {
                        return mode ? 1 : -1;
                    } else if (av > bv) {
                        return mode ? -1 : 1;
                    } else {
                        continue;
                    }
                }
                return 0;
            });
        }
    }
}));
module rf {
    export function getQualifiedClassName(value:any):string {
        let type = typeof value;
        if (!value || (type != "object"&&!value.prototype)) {
            return type;
        }
        let prototype:any = value.prototype ? value.prototype : Object.getPrototypeOf(value);
        if (prototype.hasOwnProperty("__class__")) {
            return prototype["__class__"];
        }
        let constructorString:string = prototype.constructor.toString().trim();
        let index:number = constructorString.indexOf("(");
        let className:string = constructorString.substring(9, index);
        Object.defineProperty(prototype, "__class__", {
            value: className,
            enumerable: false,
            writable: true
        });
        return className;
	}
	
	export function getQualifiedSuperclassName(value:any):string {
        if (!value || (typeof value != "object" && !value.prototype)) {
            return null;
        }
        let prototype:any = value.prototype ? value.prototype : Object.getPrototypeOf(value);
        let superProto = Object.getPrototypeOf(prototype);
        if (!superProto) {
            return null;
        }
        let superClass = getQualifiedClassName(superProto.constructor);
        if (!superClass) {
            return null;
        }
        return superClass;
    }

    export function is(instance: any, ref: { new(): any }): boolean {
        if (!instance || typeof instance != "object") {
            return false;
        }
        let prototype:any = Object.getPrototypeOf(instance);
        let types = prototype ? prototype.__types__ : null;
        if (!types) {
            return false;
        }
        return (types.indexOf(getQualifiedClassName(ref)) !== -1);
    }


    export function toString(instance:any,defaultValue:string = ""){
        if(!instance){
            return defaultValue;
        } 

        
    }
}