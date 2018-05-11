var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
RELEASE = false;
DEBUG = true;
var rf;
(function (rf) {
    rf.ClientCheck = {
        /**
         * 是否做客户端检查
         */
        isClientCheck: true
    };
    /**
     * 错误前缀
     */
    rf.errorPrefix = "";
    if (RELEASE) {
        /**
         * 内存中存储的错误数据信息
         *
         */
        var errorMsg = [];
        /**
         * 在内存中存储报错数据
         * @param msg
         * @param atWho
         *
         */
        function pushMsg(msg) {
            if (errorMsg.length > rf.ThrowError.MaxCount) {
                errorMsg.shift();
            }
            var msg = getMsg(msg);
            errorMsg.push(msg);
            return msg;
        }
    }
    if (DEBUG) {
        rf.Log = function () {
            var msg = "%c";
            for (var i = 0; i < arguments.length; i++) {
                msg += arguments[i];
            }
            console.log(msg, "color:red");
        };
    }
    /**
    * 在内存中存储报错数据
    * @param msg
    * @private
    */
    function getMsg(msg) {
        return new Date()["format"]("[yyyy-MM-dd HH:mm:ss]", true) + "[info:]" + msg;
    }
    /**
     * 抛错
     * @param {string | Error}  msg 描述
     **/
    rf.ThrowError = function (msg, err, alert) {
        if (DEBUG && alert) {
            window.alert(msg);
        }
        msg = rf.errorPrefix + msg;
        msg += "%c";
        if (err) {
            msg += "\nError:\n[name]:" + err.name + ",[message]:" + err.message;
        }
        else {
            err = new Error();
        }
        msg += "\n[stack]:\n" + err.stack;
        if (DEBUG) {
            msg = getMsg(msg);
        }
        else if (RELEASE) {
            msg = pushMsg(msg);
        }
        console.log(msg, "color:red");
    };
    if (RELEASE) {
        rf.ThrowError.MaxCount = 50;
        rf.ThrowError.errorMsg = errorMsg;
    }
})(rf || (rf = {}));
///<reference path="./ThrowError.ts" />
/**
 * 对数字进行补0操作
 * @param value 要补0的数值
 * @param length 要补的总长度
 * @return 补0之后的字符串
 */
function zeroize(value, length) {
    if (length === void 0) { length = 2; }
    var str = "" + value;
    var zeros = "";
    for (var i = 0, len = length - str.length; i < len; i++) {
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
function getDescriptor(descriptor, enumerable, writable, configurable) {
    if (enumerable === void 0) { enumerable = false; }
    if (writable === void 0) { writable = true; }
    if (configurable === void 0) { configurable = true; }
    if (!descriptor.set && !descriptor.get) {
        descriptor.writable = writable;
    }
    descriptor.configurable = configurable;
    descriptor.enumerable = enumerable;
    return descriptor;
}
function makeDefDescriptors(descriptors, enumerable, writable, configurable) {
    if (enumerable === void 0) { enumerable = false; }
    if (writable === void 0) { writable = true; }
    if (configurable === void 0) { configurable = true; }
    for (var key in descriptors) {
        var desc = descriptors[key];
        var enumer = desc.enumerable == undefined ? enumerable : desc.enumerable;
        var write = desc.writable == undefined ? writable : desc.writable;
        var config = desc.configurable == undefined ? configurable : desc.configurable;
        descriptors[key] = getDescriptor(desc, enumer, write, config);
    }
    return descriptors;
}
Object.defineProperties(Object.prototype, makeDefDescriptors({
    clone: {
        value: function () {
            var o = {};
            for (var n in this) {
                o[n] = this[n];
            }
            return o;
        }
    },
    getPropertyDescriptor: {
        value: function (property) {
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
        value: function (to) {
            for (var p in this) {
                var data = to.getPropertyDescriptor(p);
                if (!data || (data.set || data.writable)) { // 可进行赋值，防止将属性中的方法给重写
                    to[p] = this[p];
                }
            }
        }
    },
    equals: {
        value: function (checker) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (!args.length) {
                args = Object.getOwnPropertyNames(checker);
            }
            for (var i = 0; i < args.length; i++) {
                var key = args[i];
                if (this[key] != checker[key]) {
                    return false;
                }
            }
            return true;
        }
    },
    copyWith: {
        value: function (to) {
            var proNames = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                proNames[_i - 1] = arguments[_i];
            }
            for (var _a = 0, proNames_1 = proNames; _a < proNames_1.length; _a++) {
                var p = proNames_1[_a];
                if (p in this) {
                    to[p] = this[p];
                }
            }
        }
    },
    getSpecObject: {
        value: function () {
            var proNames = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                proNames[_i] = arguments[_i];
            }
            var obj = {};
            for (var _a = 0, proNames_2 = proNames; _a < proNames_2.length; _a++) {
                var p = proNames_2[_a];
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
Object.defineProperties(Float32Array.prototype, makeDefDescriptors({
    x: {
        get: function () {
            return this[0];
        },
        set: function (value) {
            this[0] = value;
        }
    },
    y: {
        get: function () {
            return this[1];
        },
        set: function (value) {
            this[1] = value;
        }
    },
    z: {
        get: function () {
            return this[2];
        },
        set: function (value) {
            this[2] = value;
        }
    },
    w: {
        get: function () {
            return this[3];
        },
        set: function (value) {
            this[3] = value;
        }
    },
    update: {
        value: function (data32PerVertex, offset, v) {
            var len = this.length;
            for (var i = 0; i < len; i += data32PerVertex) {
                this[i + offset] = v;
            }
        }
    },
    wPoint1: {
        value: function (position, x, y, z, w) {
            this[position] = x;
        }
    },
    wPoint2: {
        value: function (position, x, y, z, w) {
            this[position] = x;
            this[position + 1] = y;
        }
    },
    wPoint3: {
        value: function (position, x, y, z, w) {
            this[position] = x;
            this[position + 1] = y;
            this[position + 2] = z;
        }
    },
    wPoint4: {
        value: function (position, x, y, z, w) {
            this[position] = x;
            this[position + 1] = y;
            this[position + 2] = z;
            this[position + 3] = w;
        }
    },
    clone: {
        value: function () {
            return new Float32Array(this);
        }
    }
}));
Object.defineProperties(Function.prototype, makeDefDescriptors({
    isSubClass: {
        value: function (testBase) {
            if (typeof testBase !== "function") {
                return false;
            }
            var base = this.prototype;
            var flag = false;
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
Math.DEG_TO_RAD = Math.PI / 180;
Math.RAD_TO_DEG = 180 / Math.PI;
Math.PI2 = 2 * Math.PI;
Math.PI_1_2 = Math.PI * .5;
Math.clamp = function (value, min, max) {
    if (value < min) {
        value = min;
    }
    if (value > max) {
        value = max;
    }
    return value;
};
Math.random2 = function (min, max) {
    return min + Math.random() * (max - min);
};
Math.random3 = function (center, delta) {
    return center - delta + Math.random() * 2 * delta;
};
if (!Number.isSafeInteger) { //防止低版本浏览器没有此方法
    Number.isSafeInteger = function (value) { return value < 9007199254740991 /*Number.MAX_SAFE_INTEGER*/ && value >= -9007199254740991; }; /*Number.MIN_SAFE_INTEGER*/
}
Object.defineProperties(Number.prototype, makeDefDescriptors({
    zeroize: getDescriptor({
        value: function (length) { return zeroize(this, length); }
    }),
    between: getDescriptor({
        value: function (min, max) { return min <= this && max >= this; }
    })
}));
Object.defineProperties(String.prototype, makeDefDescriptors({
    zeroize: {
        value: function (length) { return zeroize(this, length); },
    },
    trim: {
        value: function () {
            return this.replace(/(^[\s\t\f\r\n\u3000\ue79c ]*)|([\s\t\f\r\n\u3000\ue79c ]*$)/g, "");
        }
    },
    substitute: {
        value: function () {
            var len = arguments.length;
            if (len > 0) {
                var obj_1;
                if (len == 1) {
                    obj_1 = arguments[0];
                    if (typeof obj_1 !== "object") {
                        obj_1 = arguments;
                    }
                }
                else {
                    obj_1 = arguments;
                }
                if ((obj_1 instanceof Object) && !(obj_1 instanceof RegExp)) {
                    return this.replace(/\{(?:%([^{}]+)%)?([^{}]+)\}/g, function (match, handler, key) {
                        //检查key中，是否为%开头，如果是，则尝试按方法处理                        
                        var value = obj_1[key];
                        if (handler) { //如果有处理器，拆分处理器
                            var func = String.subHandler[handler];
                            if (func) {
                                value = func(value);
                            }
                        }
                        return (value !== undefined) ? '' + value : match;
                    });
                }
            }
            return this.toString(); //防止生成String对象，ios反射String对象会当成一个NSDictionary处理
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
            var arr = this.match(/[\u2E80-\u9FBF]/ig);
            return this.length + (arr ? arr.length : 0);
        }
    }
}));
String.zeroize = zeroize;
String.subHandler = {};
String.regSubHandler = function (key, handler) {
    if (DEBUG) {
        if (handler.length != 1) {
            rf.ThrowError("String.regSubHandler\u6CE8\u518C\u7684\u51FD\u6570\uFF0C\u53C2\u6570\u6570\u91CF\u5FC5\u987B\u4E3A\u4E00\u4E2A\uFF0C\u5806\u6808\uFF1A\n" + new Error().stack + "\n\u51FD\u6570\u5185\u5BB9\uFF1A" + handler.toString());
        }
        if (key in this.subHandler) {
            rf.ThrowError("String.regSubHandler\u6CE8\u518C\u7684\u51FD\u6570\uFF0C\u6CE8\u518C\u4E86\u91CD\u590D\u7684key[" + key + "]\uFF0C\u5806\u6808\uFF1A\n" + new Error().stack);
        }
    }
    this.subHandler[key] = handler;
};
Object.defineProperties(Date.prototype, makeDefDescriptors({
    format: {
        value: function (mask, local) {
            var d = this;
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
            function gd() { return local ? d.getDate() : d.getUTCDate(); }
            function gM() { return local ? d.getMonth() : d.getUTCMonth(); }
            function gy() { return local ? d.getFullYear() : d.getUTCFullYear(); }
            function gH() { return local ? d.getHours() : d.getUTCHours(); }
            function gm() { return local ? d.getMinutes() : d.getUTCMinutes(); }
            function gs() { return local ? d.getSeconds() : d.getUTCSeconds(); }
        }
    }
}));
Array.binaryInsert = function (partArr, item, filter) {
    var args = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args[_i - 3] = arguments[_i];
    }
    //根据物品战力进行插入
    var right = partArr.length - 1;
    var left = 0;
    while (left <= right) {
        var middle = (left + right) >> 1;
        var test = partArr[middle];
        if (filter.apply(void 0, [test].concat(args))) {
            right = middle - 1;
        }
        else {
            left = middle + 1;
        }
    }
    partArr.splice(left, 0, item);
};
/**
 * 用于对Array排序时，处理undefined
 */
Array.SORT_DEFAULT = {
    number: 0,
    string: "",
    boolean: false
};
Object.freeze(Array.SORT_DEFAULT);
Object.defineProperties(Array.prototype, makeDefDescriptors({
    cloneTo: {
        value: function (b) {
            b.length = this.length;
            var len = this.length;
            b.length = len;
            for (var i = 0; i < len; i++) {
                b[i] = this[i];
            }
        }
    },
    appendTo: {
        value: function (b) {
            var len = this.length;
            for (var i = 0; i < len; i++) {
                b.push(this[i]);
            }
        }
    },
    pushOnce: {
        value: function (t) {
            var idx = this.indexOf(t);
            if (!~idx) {
                idx = this.length;
                this[idx] = t;
            }
            return idx;
        }
    },
    remove: {
        value: function (t) {
            var idx = this.indexOf(t);
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
            var key, descend;
            var len = arguments.length;
            if (DEBUG && len > 2) {
                rf.ThrowError("doSort\u53C2\u6570\u4E0D\u80FD\u8D85\u8FC72");
            }
            for (var i = 0; i < len; i++) {
                var arg = arguments[i];
                var t = typeof arg;
                if (t === "string") {
                    key = arg;
                }
                else {
                    descend = !!arg;
                }
            }
            if (key) {
                return this.sort(function (a, b) { return descend ? b[key] - a[key] : a[key] - b[key]; });
            }
            else {
                return this.sort(function (a, b) { return descend ? b - a : a - b; });
            }
        }
    },
    multiSort: {
        value: function (kArr, dArr) {
            var isArr = Array.isArray(dArr);
            return this.sort(function (a, b) {
                var def = Array.SORT_DEFAULT;
                for (var idx = 0, len = kArr.length; idx < len; idx++) {
                    var key = kArr[idx];
                    var mode = isArr ? !!dArr[idx] : !!dArr;
                    var av = a[key];
                    var bv = b[key];
                    var typea = typeof av;
                    var typeb = typeof bv;
                    if (typea == "object" || typeb == "object") {
                        if (DEBUG) {
                            rf.ThrowError("multiSort \u6BD4\u8F83\u7684\u7C7B\u578B\u4E0D\u5E94\u4E3Aobject," + typea + "    " + typeb);
                        }
                        return 0;
                    }
                    else if (typea != typeb) {
                        if (typea == "undefined") {
                            bv = def[typeb];
                        }
                        else if (typeb == "undefined") {
                            av = def[typea];
                        }
                        else {
                            if (DEBUG) {
                                rf.ThrowError("multiSort \u6BD4\u8F83\u7684\u7C7B\u578B\u4E0D\u4E00\u81F4," + typea + "    " + typeb);
                            }
                            return 0;
                        }
                    }
                    if (av < bv) {
                        return mode ? 1 : -1;
                    }
                    else if (av > bv) {
                        return mode ? -1 : 1;
                    }
                    else {
                        continue;
                    }
                }
                return 0;
            });
        }
    }
}));
var rf;
(function (rf) {
    function getQualifiedClassName(value) {
        var type = typeof value;
        if (!value || (type != "object" && !value.prototype)) {
            return type;
        }
        var prototype = value.prototype ? value.prototype : Object.getPrototypeOf(value);
        if (prototype.hasOwnProperty("__class__")) {
            return prototype["__class__"];
        }
        var constructorString = prototype.constructor.toString().trim();
        var index = constructorString.indexOf("(");
        var className = constructorString.substring(9, index);
        Object.defineProperty(prototype, "__class__", {
            value: className,
            enumerable: false,
            writable: true
        });
        return className;
    }
    rf.getQualifiedClassName = getQualifiedClassName;
    function getQualifiedSuperclassName(value) {
        if (!value || (typeof value != "object" && !value.prototype)) {
            return null;
        }
        var prototype = value.prototype ? value.prototype : Object.getPrototypeOf(value);
        var superProto = Object.getPrototypeOf(prototype);
        if (!superProto) {
            return null;
        }
        var superClass = getQualifiedClassName(superProto.constructor);
        if (!superClass) {
            return null;
        }
        return superClass;
    }
    rf.getQualifiedSuperclassName = getQualifiedSuperclassName;
    function is(instance, ref) {
        if (!instance || typeof instance != "object") {
            return false;
        }
        var prototype = Object.getPrototypeOf(instance);
        var types = prototype ? prototype.__types__ : null;
        if (!types) {
            return false;
        }
        return (types.indexOf(getQualifiedClassName(ref)) !== -1);
    }
    rf.is = is;
    function toString(instance, defaultValue) {
        if (defaultValue === void 0) { defaultValue = ""; }
        if (!instance) {
            return defaultValue;
        }
    }
    rf.toString = toString;
})(rf || (rf = {}));
/// <reference path="./Extend.ts" />
var rf;
(function (rf) {
    rf.stageWidth = 0;
    rf.stageHeight = 0;
    rf.isWindowResized = false;
    rf.max_vc = 100;
    rf.c_white = "rgba(255,255,255,255)";
    rf.pixelRatio = 2;
    function isPowerOfTwo(n) {
        return (n !== 0) && ((n & (n - 1)) === 0);
    }
    rf.isPowerOfTwo = isPowerOfTwo;
})(rf || (rf = {}));
//Matrix3D算法相关
var rf_v3_identity = [0, 0, 0, 0];
var rf_m3_identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
var rf_m2_identity = [1, 0, 0, 0, 1, 0, 0, 0, 1];
var rf_m3_temp = new Float32Array(16);
/*********************************************************
 * Matrix3D
********************************************************/
Object.defineProperties(Float32Array.prototype, {
    m3_identity: {
        value: function () {
            this.set(rf_m3_identity);
        }
    },
    m3_append: {
        value: function (m3, prepend, from) {
            var a;
            var b;
            if (!prepend) {
                a = from ? from : this;
                b = m3;
            }
            else {
                a = m3;
                b = from ? from : this;
            }
            var _a = a, a11 = _a[0], a12 = _a[1], a13 = _a[2], a14 = _a[3], a21 = _a[4], a22 = _a[5], a23 = _a[6], a24 = _a[7], a31 = _a[8], a32 = _a[9], a33 = _a[10], a34 = _a[11], a41 = _a[12], a42 = _a[13], a43 = _a[14], a44 = _a[15]; //目前typescript还没支持  TypedArray destructure，不过目前已经标准化，后面 typescript 应该会支持
            var _b = b, b11 = _b[0], b12 = _b[1], b13 = _b[2], b14 = _b[3], b21 = _b[4], b22 = _b[5], b23 = _b[6], b24 = _b[7], b31 = _b[8], b32 = _b[9], b33 = _b[10], b34 = _b[11], b41 = _b[12], b42 = _b[13], b43 = _b[14], b44 = _b[15];
            this[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
            this[1] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
            this[2] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
            this[3] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
            this[4] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
            this[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
            this[6] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
            this[7] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
            this[8] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
            this[9] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
            this[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
            this[11] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
            this[12] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
            this[13] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
            this[14] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
            this[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
        }
    },
    m3_rotation: {
        value: function (angle, axis, prepend, from) {
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var t = 1 - c;
            var x = axis[0], y = axis[1], z = axis[2];
            var tx = t * x, ty = t * y;
            var b = rf_m3_temp;
            b.set([
                tx * x + c, tx * y - s * z, tx * z + s * y, 0,
                tx * y + s * z, ty * y + c, ty * z - s * x, 0,
                tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
                0, 0, 0, 1
            ]);
            this.m3_append(b, prepend, from);
        }
    },
    m3_scale: {
        value: function (x, y, z, prepend, from) {
            if (from)
                this.set(from);
            if (prepend) {
                this[0] *= x;
                this[1] *= y;
                this[2] *= z;
                this[4] *= x;
                this[5] *= y;
                this[6] *= z;
                this[8] *= x;
                this[9] *= y;
                this[10] *= z;
                this[12] *= x;
                this[13] *= y;
                this[14] *= z;
            }
            else {
                this[0] *= x;
                this[4] *= y;
                this[8] *= z;
                this[1] *= x;
                this[5] *= y;
                this[9] *= z;
                this[2] *= x;
                this[6] *= y;
                this[10] *= z;
                this[3] *= x;
                this[7] *= y;
                this[11] *= z;
            }
        }
    },
    m3_translation: {
        value: function (x, y, z, prepend, from) {
            if (prepend) {
                var b = rf_m3_temp;
                b.set(rf_m3_identity);
                b[12] = x;
                b[13] = y;
                b[14] = z;
                this.m3_append(b, undefined, from);
            }
            else {
                from = from ? from : this;
                this[12] = from[12] + x;
                this[13] = from[13] + y;
                this[14] = from[14] + z;
            }
        }
    },
    m3_invert: {
        value: function (from) {
            from = from ? from : this;
            var a = from[0], b = from[1], c = from[2], d = from[3], e = from[4], f = from[5], g = from[6], h = from[7], i = from[8], j = from[9], k = from[10], l = from[11], m = from[12], n = from[13], o = from[14], p = from[15], q = a * f - b * e, r = a * g - c * e, s = a * h - d * e, t = b * g - c * f, u = b * h - d * f, v = c * h - d * g, w = i * n - j * m, x = i * o - k * m, y = i * p - l * m, z = j * o - k * n, A = j * p - l * n, B = k * p - l * o, ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);
            this[0] = (f * B - g * A + h * z) * ivd;
            this[1] = (-b * B + c * A - d * z) * ivd;
            this[2] = (n * v - o * u + p * t) * ivd;
            this[3] = (-j * v + k * u - l * t) * ivd;
            this[4] = (-e * B + g * y - h * x) * ivd;
            this[5] = (a * B - c * y + d * x) * ivd;
            this[6] = (-m * v + o * s - p * r) * ivd;
            this[7] = (i * v - k * s + l * r) * ivd;
            this[8] = (e * A - f * y + h * w) * ivd;
            this[9] = (-a * A + b * y - d * w) * ivd;
            this[10] = (m * u - n * s + p * q) * ivd;
            this[11] = (-i * u + j * s - l * q) * ivd;
            this[12] = (-e * z + f * x - g * w) * ivd;
            this[13] = (a * z - b * x + c * w) * ivd;
            this[14] = (-m * t + n * r - o * q) * ivd;
            this[15] = (i * t - j * r + k * q) * ivd;
        }
    },
    /**
     * @param orientationStyle
        EULER_ANGLES = 0
        AXIS_ANGLE = 1
        QUATERNION = 2
     */
    m3_decompose: {
        value: function (pos, rot, sca, orientationStyle) {
            if (undefined == orientationStyle) {
                orientationStyle = 0;
            }
            var _a = this, m0 = _a[0], m1 = _a[1], m2 = _a[2], m3 = _a[3], m4 = _a[4], m5 = _a[5], m6 = _a[6], m7 = _a[7], m8 = _a[8], m9 = _a[9], m10 = _a[10], m11 = _a[11], m12 = _a[12], m13 = _a[13], m14 = _a[14], m15 = _a[15];
            if (undefined != pos) {
                pos[0] = m12;
                pos[1] = m13;
                pos[2] = m14;
            }
            var sqrt = Math.sqrt, atan2 = Math.atan2;
            var sx = sqrt(m0 * m0 + m1 * m1 + m2 * m2);
            var sy = sqrt(m4 * m4 + m5 * m5 + m6 * m6);
            var sz = sqrt(m8 * m8 + m9 * m9 + m10 * m10);
            //determine 3*3
            if (m0 * (m5 * m10 - m6 * m9) - m1 * (m4 * m10 - m6 * m8) + m2 * (m4 * m9 - m5 * m8) < 0) {
                sz = -sz;
            }
            if (undefined != sca) {
                sca[0] = sx;
                sca[1] = sy;
                sca[2] = sz;
            }
            m0 /= sx;
            m1 /= sx;
            m2 /= sx;
            m4 /= sy;
            m5 /= sy;
            m6 /= sy;
            m8 /= sz;
            m9 /= sz;
            m10 /= sz;
            switch (orientationStyle) {
                case 0: //EULER_ANGLES
                    rot[1] = Math.asin(-m2);
                    if (m2 != 1 && m2 != -1) {
                        rot[0] = atan2(m6, m10);
                        rot[2] = atan2(m1, m0);
                    }
                    else {
                        rot[2] = 0;
                        rot[0] = atan2(m4, m5);
                    }
                    break;
                case 2: //QUATERNION
                    var tr = m0 + m5 + m10;
                    if (tr > 0) {
                        var rw = sqrt(1 + tr) / 2;
                        rot[3] = rw;
                        rw *= 4;
                        rot[0] = (m6 - m9) / rw;
                        rot[1] = (m8 - m2) / rw;
                        rot[2] = (m1 - m4) / rw;
                    }
                    else if ((m0 > m5) && (m0 > m10)) {
                        var rx = sqrt(1 + m0 - m5 - m10) / 2;
                        rot[0] = rx;
                        rx *= 4;
                        rot[3] = (m6 - m9) / rx;
                        rot[1] = (m1 + m4) / rx;
                        rot[2] = (m8 + m2) / rx;
                    }
                    else if (m5 > m10) {
                        rot[1] = sqrt(1 + m5 - m0 - m10) / 2;
                        rot[0] = (m1 + m4) / (4 * rot[1]);
                        rot[3] = (m8 - m2) / (4 * rot[1]);
                        rot[2] = (m6 + m9) / (4 * rot[1]);
                    }
                    else {
                        rot[2] = sqrt(1 + m10 - m0 - m5) / 2;
                        rot[0] = (m8 + m2) / (4 * rot[2]);
                        rot[1] = (m6 + m9) / (4 * rot[2]);
                        rot[3] = (m1 - m4) / (4 * rot[2]);
                    }
                    break;
                case 1: //AXIS_ANGLE
                    rot[3] = Math.acos((m0 + m5 + m10 - 1) / 2);
                    var len = Math.sqrt((m6 - m9) * (m6 - m9) + (m8 - m2) * (m8 - m2) + (m1 - m4) * (m1 - m4));
                    rot[0] = (m6 - m9) / len;
                    rot[1] = (m8 - m2) / len;
                    rot[2] = (m1 - m4) / len;
                    break;
            }
        }
    },
    m3_recompose: {
        value: function (pos, rot, sca, orientationStyle) {
            if (undefined == orientationStyle) {
                orientationStyle = 0;
            }
            var scale_0_1_2 = sca[0], scale_4_5_6 = sca[1], scale_8_9_10 = sca[2];
            if (scale_0_1_2 == 0 || scale_4_5_6 == 0 || scale_8_9_10 == 0)
                return;
            var c0x = pos[0], c0y = pos[1], c0z = pos[2];
            var c1x = rot[0], c1y = rot[1], c1z = rot[2], c1w = rot[3];
            var cos = Math.cos, sin = Math.sin;
            switch (orientationStyle) {
                case 0: //Orientation3D.EULER_ANGLES:
                    {
                        var cx = cos(c1x);
                        var cy = cos(c1y);
                        var cz = cos(c1z);
                        var sx = sin(c1x);
                        var sy = sin(c1y);
                        var sz = sin(c1z);
                        this[0] = cy * cz * scale_0_1_2;
                        this[1] = cy * sz * scale_0_1_2;
                        this[2] = -sy * scale_0_1_2;
                        this[3] = 0;
                        this[4] = (sx * sy * cz - cx * sz) * scale_4_5_6;
                        this[5] = (sx * sy * sz + cx * cz) * scale_4_5_6;
                        this[6] = sx * cy * scale_4_5_6;
                        this[7] = 0;
                        this[8] = (cx * sy * cz + sx * sz) * scale_8_9_10;
                        this[9] = (cx * sy * sz - sx * cz) * scale_8_9_10;
                        this[10] = cx * cy * scale_8_9_10;
                        this[11] = 0;
                        this[12] = c0x;
                        this[13] = c0y;
                        this[14] = c0z;
                        this[15] = 1;
                    }
                    break;
                default:
                    {
                        var x = c1x;
                        var y = c1y;
                        var z = c1z;
                        var w = c1w;
                        if (orientationStyle == 1 /*Orientation3D.AXIS_ANGLE*/) {
                            var w_2 = w / 2;
                            var sinW_2 = sin(w_2);
                            x *= sinW_2;
                            y *= sinW_2;
                            z *= sinW_2;
                            w = cos(w_2);
                        }
                        ;
                        this[0] = (1 - 2 * y * y - 2 * z * z) * scale_0_1_2;
                        this[1] = (2 * x * y + 2 * w * z) * scale_0_1_2;
                        this[2] = (2 * x * z - 2 * w * y) * scale_0_1_2;
                        this[3] = 0;
                        this[4] = (2 * x * y - 2 * w * z) * scale_4_5_6;
                        this[5] = (1 - 2 * x * x - 2 * z * z) * scale_4_5_6;
                        this[6] = (2 * y * z + 2 * w * x) * scale_4_5_6;
                        this[7] = 0;
                        this[8] = (2 * x * z + 2 * w * y) * scale_8_9_10;
                        this[9] = (2 * y * z - 2 * w * x) * scale_8_9_10;
                        this[10] = (1 - 2 * x * x - 2 * y * y) * scale_8_9_10;
                        this[11] = 0;
                        this[12] = c0x;
                        this[13] = c0y;
                        this[14] = c0z;
                        this[15] = 1;
                    }
                    break;
            }
        }
    },
    m3_copyColumnFrom: {
        value: function (column, vector3D) {
            column *= 4;
            this[column] = vector3D[0];
            this[column + 1] = vector3D[1];
            this[column + 2] = vector3D[2];
            this[column + 3] = vector3D[3];
        }
    },
    m3_copyColumnTo: {
        value: function (column, vector3D) {
            column *= 4;
            vector3D[0] = this[column];
            vector3D[1] = this[column + 1];
            vector3D[2] = this[column + 2];
            vector3D[3] = this[column + 3];
        }
    },
    m3_transformVector: {
        value: function (v, result) {
            var x = v[0], y = v[1], z = v[2];
            if (undefined == result) {
                result = new Float32Array(rf_v3_identity);
            }
            result[0] = x * this[0] + y * this[4] + z * this[8] + this[12];
            result[1] = x * this[1] + y * this[5] + z * this[9] + this[13];
            result[2] = x * this[2] + y * this[6] + z * this[10] + this[14];
            result[3] = x * this[3] + y * this[7] + z * this[11] + this[15];
            return result;
        }
    },
    m3_transformVectors: {
        value: function (vin, vout) {
            var i = 0;
            var v = [0, 0, 0];
            var v2 = [0, 0, 0];
            while (i + 3 <= vin.length) {
                v[0] = vin[i];
                v[1] = vin[i + 1];
                v[2] = vin[i + 2];
                this.transformVector(v, v2); //todo: simplify operation
                vout[i] = v2[0];
                vout[i + 1] = v2[1];
                vout[i + 2] = v2[2];
                i += 3;
            }
        }
    },
    m3_transformRotation: {
        value: function (v, result) {
            var x = v[0], y = v[1], z = v[2];
            if (undefined == result) {
                result = new Float32Array(rf_v3_identity);
            }
            result[0] = x * this[0] + y * this[4] + z * this[8];
            result[1] = x * this[1] + y * this[5] + z * this[9];
            result[2] = x * this[2] + y * this[6] + z * this[10];
            result[3] = x * this[3] + y * this[7] + z * this[11];
            return result;
        }
    }
});
Object.defineProperties(Float32Array.prototype, {
    v3_lengthSquared: {
        get: function () {
            var _a = this, x = _a[0], y = _a[1], z = _a[2];
            return x * x + y * y + z * z;
        }
    },
    v3_length: {
        get: function () {
            var _a = this, x = _a[0], y = _a[1], z = _a[2];
            return Math.sqrt(x * x + y * y + z * z);
        }
    },
    v3_add: {
        value: function (v) {
            var o = new Float32Array(4);
            for (var i = 0; i < 3; i++)
                o[i] = this[i] + v[i];
            return o;
        }
    },
    v3_sub: {
        value: function (v) {
            var o = new Float32Array(4);
            for (var i = 0; i < 3; i++)
                o[i] = this[i] - v[i];
            return o;
        }
    },
    v3_scale: {
        value: function (v) {
            this[0] *= v;
            this[1] *= v;
            this[2] *= v;
        }
    },
    v3_normalize: {
        value: function (from) {
            var leng = this.v3_length;
            if (leng != 0) {
                var v = 1 / leng;
                this[0] *= v;
                this[1] *= v;
                this[2] *= v;
            }
        }
    },
    v3_dotProduct: {
        value: function (t) {
            return this[0] * t[0] + this[1] * t[1] + this[2] * t[2];
        }
    },
    v3_crossProduct: {
        value: function (t, out) {
            var _a = this, x = _a[0], y = _a[1], z = _a[2];
            var ax = t[0], ay = t[1], az = t[2];
            if (undefined == out) {
                out = new Float32Array(4);
            }
            out[0] = y * az - z * ay;
            out[1] = z * ax - x * az;
            out[2] = x * ay - y * ax;
            return out;
        }
    }
});
Object.defineProperties(Float32Array.prototype, {
    m2_identitye: {
        value: function () {
            this.set(rf_m2_identity);
        }
    }
});
var rf;
(function (rf) {
    var DEG_2_RAD = Math.PI / 180;
    function newMatrix3D(v) {
        var out;
        if (v instanceof ArrayBuffer) {
            out = new Float32Array(v);
        }
        else {
            if (undefined != v) {
                out = new Float32Array(v);
            }
            else {
                out = new Float32Array(rf_m3_identity);
            }
        }
        return out;
    }
    rf.newMatrix3D = newMatrix3D;
    function newMatrix(v) {
        var out;
        if (v instanceof ArrayBuffer) {
            out = new Float32Array(v);
        }
        else {
            if (undefined != v) {
                out = new Float32Array(v);
            }
            else {
                out = new Float32Array(rf_m2_identity);
            }
        }
        return out;
    }
    rf.newMatrix = newMatrix;
    function newVector3D(x, y, z, w) {
        if (undefined == x) {
            return new Float32Array(rf_v3_identity);
        }
        if (x instanceof ArrayBuffer) {
            return new Float32Array(x);
        }
        if (undefined == y) {
            y = 0;
        }
        if (undefined == z) {
            z = 0;
        }
        if (undefined == w) {
            w = 0;
        }
        return new Float32Array([Number(x), y, z, w]);
    }
    rf.newVector3D = newVector3D;
    // export const matrix3d_identity = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    //  1,0,0,tx           
    //  0,1,0,ty          
    //  0,0,1,tz           
    //  0,0,0,1
    //a = a*b
    // export function matrix3d_multiply(a: ArrayLike<number>, b: ArrayLike<number>, out: Float32Array): void {
    //     const [
    //         a11, a12, a13, a14,
    //         a21, a22, a23, a24,
    //         a31, a32, a33, a34,
    //         a41, a42, a43, a44
    //     ] = a as any;//目前typescript还没支持  TypedArray destructure，不过目前已经标准化，后面 typescript 应该会支持
    //     const [
    //         b11, b12, b13, b14,
    //         b21, b22, b23, b24,
    //         b31, b32, b33, b34,
    //         b41, b42, b43, b44
    //     ] = b as any;
    //     // out[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    //     // out[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    //     // out[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    //     // out[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
    //     // out[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    //     // out[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    //     // out[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    //     // out[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
    //     // out[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    //     // out[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    //     // out[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    //     // out[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
    //     // out[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    //     // out[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    //     // out[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    //     // out[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
    //     out[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    //     out[1] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    //     out[2] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    //     out[3] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
    //     out[4] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    //     out[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    //     out[6] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    //     out[7] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
    //     out[8] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    //     out[9] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    //     out[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    //     out[11] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
    //     out[12] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    //     out[13] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    //     out[14] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    //     out[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
    // }
    // export function matrix3d_RotationAxis(from: ArrayLike<number>, axis: Point3D, angle: number, out: Float32Array, prepend: boolean = false): void {
    //     let c = Math.cos(angle);
    //     let s = Math.sin(angle);
    //     let t = 1 - c;
    //     const { x, y, z } = axis;
    //     let tx = t * x, ty = t * y;
    //     let b = RAW_DATA_CONTAINER;
    //     b.set([
    //         tx * x + c, tx * y - s * z, tx * z + s * y, 0,
    //         tx * y + s * z, ty * y + c, ty * z - s * x, 0,
    //         tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
    //         0, 0, 0, 1
    //     ]);
    //     if (prepend == false) {
    //         matrix3d_multiply(from, b, out);
    //     } else {
    //         matrix3d_multiply(b, from, out);
    //     }
    // }
    // export function matrix3d_decompose(from: ArrayLike<number>, pos: Point3DW, rot: Point3DW, sca: Point3DW, orientationStyle = Orientation3D.EULER_ANGLES): void {
    //     // const vec: Vector3D[] = [];
    //     // const m = this.clone();
    //     const m = new Float32Array(from);
    //     let [
    //         m0, m1, m2, m3,
    //         m4, m5, m6, m7,
    //         m8, m9, m10, m11,
    //         m12, m13, m14, m15
    //     ] = from as any;
    //     if (undefined != pos) {
    //         pos.x = m12;
    //         pos.y = m13;
    //         pos.z = m14;
    //     }
    //     // const pos = new Vector3D(m[12], m[13], m[14]);
    //     m[12] = 0;
    //     m[13] = 0;
    //     m[14] = 0;
    //     const sqrt = Math.sqrt;
    //     const sx = sqrt(m0 * m0 + m1 * m1 + m2 * m2);
    //     const sy = sqrt(m4 * m4 + m5 * m5 + m6 * m6);
    //     let sz = sqrt(m8 * m8 + m9 * m9 + m10 * m10);
    //     //determine 3*3
    //     if (m0 * (m5 * m10 - m6 * m9) - m1 * (m4 * m10 - m6 * m8) + m2 * (m4 * m9 - m5 * m8) < 0) {
    //         sz = -sz;
    //     }
    //     if (undefined != sca) {
    //         sca.x = sx;
    //         sca.y = sy;
    //         sca.z = sz;
    //     }
    //     m0 /= sx;
    //     m1 /= sx;
    //     m2 /= sx;
    //     m4 /= sy;
    //     m5 /= sy;
    //     m6 /= sy;
    //     m8 /= sz;
    //     m9 /= sz;
    //     m10 /= sz;
    //     switch (orientationStyle) {
    //         case Orientation3D.AXIS_ANGLE:
    //             rot.w = Math.acos((m0 + m5 + m10 - 1) / 2);
    //             var len: number = Math.sqrt((m6 - m9) * (m6 - m9) + (m8 - m2) * (m8 - m2) + (m1 - m4) * (m1 - m4));
    //             rot.x = (m6 - m9) / len;
    //             rot.y = (m8 - m2) / len;
    //             rot.z = (m1 - m4) / len;
    //             break;
    //         case Orientation3D.QUATERNION:
    //             const tr = m0 + m5 + m10;
    //             if (tr > 0) {
    //                 let rw = sqrt(1 + tr) / 2;
    //                 rot.w = rw;
    //                 rw *= 4;
    //                 rot.x = (m6 - m9) / rw;
    //                 rot.y = (m8 - m2) / rw;
    //                 rot.z = (m1 - m4) / rw;
    //             } else if ((m0 > m5) && (m0 > m10)) {
    //                 let rx = sqrt(1 + m0 - m5 - m10) / 2;
    //                 rot.x = rx;
    //                 rx *= 4;
    //                 rot.w = (m6 - m9) / rx;
    //                 rot.y = (m1 + m4) / rx;
    //                 rot.z = (m8 + m2) / rx;
    //             } else if (m5 > m10) {
    //                 rot.y = sqrt(1 + m5 - m0 - m10) / 2;
    //                 rot.x = (m1 + m4) / (4 * rot.y);
    //                 rot.w = (m8 - m2) / (4 * rot.y);
    //                 rot.z = (m6 + m9) / (4 * rot.y);
    //             } else {
    //                 rot.z = sqrt(1 + m10 - m0 - m5) / 2;
    //                 rot.x = (m8 + m2) / (4 * rot.z);
    //                 rot.y = (m6 + m9) / (4 * rot.z);
    //                 rot.w = (m1 - m4) / (4 * rot.z);
    //             }
    //             break;
    //         case Orientation3D.EULER_ANGLES:
    //             rot.y = Math.asin(-m2);
    //             //var cos:number = Math.cos(rot.y);
    //             if (m2 != 1 && m2 != -1) {
    //                 rot.x = Math.atan2(m6, m10);
    //                 rot.z = Math.atan2(m1, m0);
    //             } else {
    //                 rot.z = 0;
    //                 rot.x = Math.atan2(m4, m5);
    //             }
    //             break;
    //     }
    // }
    // export function matrix_recompose(pos: Point3DW, rot: Point3DW, sca: Point3DW, out: Float32Array, orientationStyle = Orientation3D.EULER_ANGLES) {
    //     const { x: scale_0_1_2, y: scale_4_5_6, z: scale_8_9_10 } = sca;
    //     if (scale_0_1_2 == 0 || scale_4_5_6 == 0 || scale_8_9_10 == 0) return;
    //     const { x: c0x, y: c0y, z: c0z } = pos;
    //     const { x: c1x, y: c1y, z: c1z, w: c1w } = rot;
    //     const { cos, sin } = Math;
    //     switch (orientationStyle) {
    //         case Orientation3D.EULER_ANGLES:
    //             {
    //                 var cx = cos(c1x);
    //                 var cy = cos(c1y);
    //                 var cz = cos(c1z);
    //                 var sx = sin(c1x);
    //                 var sy = sin(c1y);
    //                 var sz = sin(c1z);
    //                 out[0] = cy * cz * scale_0_1_2;
    //                 out[1] = cy * sz * scale_0_1_2;
    //                 out[2] = -sy * scale_0_1_2;
    //                 out[3] = 0;
    //                 out[4] = (sx * sy * cz - cx * sz) * scale_4_5_6;
    //                 out[5] = (sx * sy * sz + cx * cz) * scale_4_5_6;
    //                 out[6] = sx * cy * scale_4_5_6;
    //                 out[7] = 0;
    //                 out[8] = (cx * sy * cz + sx * sz) * scale_8_9_10;
    //                 out[9] = (cx * sy * sz - sx * cz) * scale_8_9_10;
    //                 out[10] = cx * cy * scale_8_9_10;
    //                 out[11] = 0;
    //                 out[12] = c0x;
    //                 out[13] = c0y;
    //                 out[14] = c0z;
    //                 out[15] = 1;
    //             }
    //             break;
    //         default:
    //             {
    //                 var x = c1x;
    //                 var y = c1y;
    //                 var z = c1z;
    //                 var w = c1w;
    //                 if (orientationStyle == Orientation3D.AXIS_ANGLE) {
    //                     const w_2 = w / 2;
    //                     const sinW_2 = sin(w_2);
    //                     x *= sinW_2;
    //                     y *= sinW_2;
    //                     z *= sinW_2;
    //                     w = cos(w_2);
    //                 };
    //                 out[0] = (1 - 2 * y * y - 2 * z * z) * scale_0_1_2;
    //                 out[1] = (2 * x * y + 2 * w * z) * scale_0_1_2;
    //                 out[2] = (2 * x * z - 2 * w * y) * scale_0_1_2;
    //                 out[3] = 0;
    //                 out[4] = (2 * x * y - 2 * w * z) * scale_4_5_6;
    //                 out[5] = (1 - 2 * x * x - 2 * z * z) * scale_4_5_6;
    //                 out[6] = (2 * y * z + 2 * w * x) * scale_4_5_6;
    //                 out[7] = 0;
    //                 out[8] = (2 * x * z + 2 * w * y) * scale_8_9_10;
    //                 out[9] = (2 * y * z - 2 * w * x) * scale_8_9_10;
    //                 out[10] = (1 - 2 * x * x - 2 * y * y) * scale_8_9_10;
    //                 out[11] = 0;
    //                 out[12] = c0x;
    //                 out[13] = c0y;
    //                 out[14] = c0z;
    //                 out[15] = 1;
    //             }
    //             break;
    //     };
    // }
    // export function matrixt_invert(rawData: Float32Array, out: Float32Array) {
    //     var a = rawData[0], b = rawData[1], c = rawData[2], d = rawData[3],
    //         e = rawData[4], f = rawData[5], g = rawData[6], h = rawData[7],
    //         i = rawData[8], j = rawData[9], k = rawData[10], l = rawData[11],
    //         m = rawData[12], n = rawData[13], o = rawData[14], p = rawData[15],
    //         q = a * f - b * e, r = a * g - c * e,
    //         s = a * h - d * e, t = b * g - c * f,
    //         u = b * h - d * f, v = c * h - d * g,
    //         w = i * n - j * m, x = i * o - k * m,
    //         y = i * p - l * m, z = j * o - k * n,
    //         A = j * p - l * n, B = k * p - l * o,
    //         ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);
    //     out[0] = (f * B - g * A + h * z) * ivd;
    //     out[1] = (-b * B + c * A - d * z) * ivd;
    //     out[2] = (n * v - o * u + p * t) * ivd;
    //     out[3] = (-j * v + k * u - l * t) * ivd;
    //     out[4] = (-e * B + g * y - h * x) * ivd;
    //     out[5] = (a * B - c * y + d * x) * ivd;
    //     out[6] = (-m * v + o * s - p * r) * ivd;
    //     out[7] = (i * v - k * s + l * r) * ivd;
    //     out[8] = (e * A - f * y + h * w) * ivd;
    //     out[9] = (-a * A + b * y - d * w) * ivd;
    //     out[10] = (m * u - n * s + p * q) * ivd;
    //     out[11] = (-i * u + j * s - l * q) * ivd;
    //     out[12] = (-e * z + f * x - g * w) * ivd;
    //     out[13] = (a * z - b * x + c * w) * ivd;
    //     out[14] = (-m * t + n * r - o * q) * ivd;
    //     out[15] = (i * t - j * r + k * q) * ivd;
    // }
    // export function matrix3d_create(v?: ArrayLike<number> | ArrayBuffer, out?: Float32Array) {
    //     if (v instanceof ArrayBuffer) {
    //         out = new Float32Array(v);
    //     } else {
    //         if (undefined == out) {
    //             out = new Float32Array(16);
    //         }
    //         if (undefined != v) {
    //             out.set(v);
    //         } else {
    //             out.set(rf_m3_identity);
    //         }
    //     }
    //     return out;
    // }
    // export function matrix3d_scale(rawData: ArrayLike<number>, x: number, y: number, z: number, out: Float32Array, prepend: boolean = false) {
    //     const [
    //         a00, a01, a02, a03,
    //         a10, a11, a12, a13,
    //         a20, a21, a22, a23,
    //         a30, a31, a32, a33
    //     ] = rawData as any;
    //     if (prepend) {
    //         out[0] = a00 * x; out[1] = a01 * y; out[2] = a02 * z;
    //         out[4] = a10 * x; out[5] = a11 * y; out[6] = a12 * z;
    //         out[8] = a20 * x; out[9] = a21 * y; out[10] = a22 * z;
    //         out[12] = a30 * x; out[13] = a31 * y; out[14] = a32 * z;
    //     } else {
    //         out[0] = a00 * x; out[4] = a10 * y; out[8] = a20 * z;
    //         out[1] = a01 * x; out[5] = a11 * y; out[9] = a21 * z;
    //         out[2] = a02 * x; out[6] = a12 * y; out[10] = a22 * z;
    //         out[3] = a03 * x; out[7] = a13 * y; out[11] = a23 * z;
    //     }
    // }
    // export function matrix3d_translation(rawData: ArrayLike<number>, x: number, y: number, z: number, out: Float32Array, prepend: boolean = false) {
    //     // const [
    //     //     a00, a01, a02, a03,
    //     //     a10, a11, a12, a13,
    //     //     a20, a21, a22, a23,
    //     //     a30, a31, a32, a33
    //     // ] = rawData as any;
    //     if (prepend) {
    //         let b = RAW_DATA_CONTAINER;
    //         b.set(rf_m3_identity);
    //         b[12] = x;
    //         b[13] = y;
    //         b[14] = z;
    //         matrix3d_multiply(b, rawData, out);
    //     } else {
    //         out[12] = rawData[12] + x;
    //         out[13] = rawData[13] + y;
    //         out[14] = rawData[14] + z;
    //     }
    // }
    // export function matrix3d_copyColumnFrom(column: number /*uint*/, vector3D: Point3DW) {
    //     if (column < 0 || column > 3)
    //         throw new Error("column error");
    //     const rawData = this.rawData;
    //     column *= 4
    //     rawData[column] = vector3D.x;
    //     rawData[column + 1] = vector3D.y;
    //     rawData[column + 2] = vector3D.z;
    //     rawData[column + 3] = vector3D.w;
    // }
    // /**
    //  * Copies specific column of the calling Matrix3D object into the Vector3D object.
    //  */
    // export function matrix3d_copyColumnTo(column: number /*uint*/, vector3D: Point3DW): void {
    //     if (column < 0 || column > 3)
    //         throw new Error("column error");
    //     column *= 4
    //     const rawData = this.rawData;
    //     vector3D.x = rawData[column];
    //     vector3D.y = rawData[column + 1];
    //     vector3D.z = rawData[column + 2];
    //     vector3D.w = rawData[column + 3];
    // }
    // export class Matrix3D {
    //     public rawData: Float32Array;
    //     constructor(v?: ArrayLike<number>|ArrayBuffer) {
    //         if(v instanceof ArrayBuffer){
    //             this.rawData = new Float32Array(v);
    //         }else if (undefined != v && v.length == 16)
    //             this.rawData = new Float32Array(v);
    //         else
    //             this.rawData = new Float32Array(matrix3d_identity);
    //     }
    //     identity() {
    //         this.rawData.set(matrix3d_identity);
    //     }
    //     append(lhs: Matrix3D) {
    //         matrix3d_multiply(this.rawData, lhs.rawData, this.rawData);
    //     }
    //     prepend(rhs: Matrix3D) {
    //         matrix3d_multiply(rhs.rawData, this.rawData, this.rawData);
    //     }
    //     public appendRotation(degrees: number, axis: Vector3D) {
    //         matrix3d_RotationAxis(this.rawData, axis, degrees * DEG_2_RAD, this.rawData);
    //     }
    //     public prependRotation(degrees: number, axis: Vector3D, pivotPoint?: Vector3D) {
    //         matrix3d_RotationAxis(this.rawData, axis, degrees * DEG_2_RAD, this.rawData, true);
    //     }
    //     /**
    //              * Appends an incremental scale change along the x, y, and z axes to a Matrix3D object.
    //              */
    //     public appendScale(xScale: number, yScale: number, zScale: number) {
    //         /*
    //          *              x 0 0 0
    //          *              0 y 0 0    *  this
    //          *              0 0 z 0
    //          *              0 0 0 1
    //          */
    //         const rawData = this.rawData;
    //         rawData[0] *= xScale; rawData[4] *= yScale; rawData[8] *= zScale;
    //         rawData[1] *= xScale; rawData[5] *= yScale; rawData[9] *= zScale;
    //         rawData[2] *= xScale; rawData[6] *= yScale; rawData[10] *= zScale;
    //         rawData[3] *= xScale; rawData[7] *= yScale; rawData[11] *= zScale;
    //     }
    //     /**
    //      * Prepends an incremental scale change along the x, y, and z axes to a Matrix3D object.
    //      */
    //     public prependScale(xScale: number, yScale: number, zScale: number) {
    //         /*
    //          *            x 0 0 0
    //          *    this *  0 y 0 0
    //          *            0 0 z 0
    //          *            0 0 0 1
    //          */
    //         const rawData = this.rawData;
    //         rawData[0] *= xScale; rawData[1] *= yScale; rawData[2] *= zScale;
    //         rawData[4] *= xScale; rawData[5] *= yScale; rawData[6] *= zScale;
    //         rawData[8] *= xScale; rawData[9] *= yScale; rawData[10] *= zScale;
    //         rawData[12] *= xScale; rawData[13] *= yScale; rawData[14] *= zScale;
    //     }
    //     /**
    //              * Appends an incremental translation, a repositioning along the x, y, and z axes, to a Matrix3D object.
    //              */
    //     public appendTranslation(x: number, y: number, z: number) {
    //         /*
    //          *             1 0 0 x
    //          *             0 1 0 y   *  this
    //          *             0 0 1 z
    //          *             0 0 0 1
    //          */
    //         // this.rawData[0] += this.rawData[12] * x; this.rawData[1] += this.rawData[13] * x;
    //         // this.rawData[2] += this.rawData[14] * x; this.rawData[3] += this.rawData[15] * x;
    //         // this.rawData[4] += this.rawData[12] * y; this.rawData[5] += this.rawData[14] * y;
    //         // this.rawData[6] += this.rawData[14] * y; this.rawData[7] += this.rawData[15] * y;
    //         // this.rawData[8] += this.rawData[12] * z; this.rawData[9] += this.rawData[13] * z;
    //         // this.rawData[10] += this.rawData[14] * z; this.rawData[11] += this.rawData[15] *z;
    //         const rawData = this.rawData;
    //         rawData[12] += x;
    //         rawData[13] += y;
    //         rawData[14] += z;
    //     }
    //     /**
    //      * Prepends an incremental translation, a repositioning along the x, y, and z axes, to a Matrix3D object.
    //      */
    //     public prependTranslation(x: number, y: number, z: number) {
    //         let b = RAW_DATA_CONTAINER;
    //         b.set(matrix3d_identity);
    //         b[12] = x;
    //         b[13] = y;
    //         b[14] = z;
    //         matrix3d_multiply(b, this.rawData, this.rawData);
    //         // const rawData = this.rawData;
    //         // rawData[3] += rawData[0] * x + rawData[1] * y + rawData[2] * z;
    //         // rawData[7] += rawData[4] * x + rawData[5] * y + rawData[6] * z;
    //         // rawData[11] += rawData[8] * x + rawData[9] * y + rawData[10] * z;
    //         // rawData[15] += rawData[12] * x + rawData[13] * y + rawData[14] * z;
    //     }
    //     /**
    //      * [read-only] A Number that determines whether a matrix is invertible.
    //      */
    //     public get determinant() {
    //         // const [
    //         //     a0, a1, a2, a3,
    //         //     a4, a5, a6, a7,
    //         //     a8, a9, a10, a11,
    //         //     a41, a42, a43, a44
    //         // ] = this.rawData as any;
    //         let rawData = this.rawData;
    //         return ((rawData[0] * rawData[5] - rawData[4] * rawData[1]) * (rawData[10] * rawData[15] - rawData[14] * rawData[11])
    //             - (rawData[0] * rawData[9] - rawData[8] * rawData[1]) * (rawData[6] * rawData[15] - rawData[14] * rawData[7])
    //             + (rawData[0] * rawData[13] - rawData[12] * rawData[1]) * (rawData[6] * rawData[11] - rawData[10] * rawData[7])
    //             + (rawData[4] * rawData[9] - rawData[8] * rawData[5]) * (rawData[2] * rawData[15] - rawData[14] * rawData[3])
    //             - (rawData[4] * rawData[13] - rawData[12] * rawData[5]) * (rawData[2] * rawData[11] - rawData[10] * rawData[3])
    //             + (rawData[8] * rawData[13] - rawData[12] * rawData[9]) * (rawData[2] * rawData[7] - rawData[6] * rawData[3]));
    //     }
    //     public get position() {
    //         const rawData = this.rawData;
    //         return new Vector3D(rawData[3], rawData[7], rawData[11]);
    //     }
    //     /**
    //      * Returns a new Matrix3D object that is an exact copy of the current Matrix3D object.
    //      */
    //     public clone() {
    //         return new Matrix3D(this.rawData);
    //     }
    //     /**
    //      *  Copies a Vector3D object into specific column of the calling Matrix3D object.
    //      */
    //     public copyColumnFrom(column: number /*uint*/, vector3D: Point3DW) {
    //         if (column < 0 || column > 3)
    //             throw new Error("column error");
    //         const rawData = this.rawData;
    //         column *= 4
    //         rawData[column] = vector3D.x;
    //         rawData[column + 1] = vector3D.y;
    //         rawData[column + 2] = vector3D.z;
    //         rawData[column + 3] = vector3D.w;
    //     }
    //     /**
    //      * Copies specific column of the calling Matrix3D object into the Vector3D object.
    //      */
    //     public copyColumnTo(column: number /*uint*/, vector3D: Point3DW): void {
    //         if (column < 0 || column > 3)
    //             throw new Error("column error");
    //         column *= 4
    //         const rawData = this.rawData;
    //         vector3D.x = rawData[column];
    //         vector3D.y = rawData[column + 1];
    //         vector3D.z = rawData[column + 2];
    //         vector3D.w = rawData[column + 3];
    //     }
    //     /**
    //      * Copies all of the matrix data from the source Matrix3D object into the calling Matrix3D object.
    //      */
    //     public copyFrom(sourceMatrix3D: Matrix3D): void {
    //         // let a = this.rawData;
    //         // let b = sourceMatrix3D.rawData;
    //         // for(var i=0;i<16;i++){
    //         //     a[i] = b[i];
    //         // }
    //         this.rawData.set(sourceMatrix3D.rawData);
    //     }
    //     /**
    //      * Copies all of the vector data from the source vector object into the calling Matrix3D object.
    //      */
    //     public copyRawDataFrom(vector: number[], index?: number /*uint*/, transpose?: boolean): void {
    //         if (transpose) {
    //             this.transpose();
    //         }
    //         index >>>= 0;
    //         let len = vector.length - index;
    //         if (len < 16) {
    //             throw new Error("Arguments Error");
    //         }
    //         else if (len > 16) {
    //             len = 16;
    //         }
    //         const rawData = this.rawData;
    //         for (let c = 0; c < len; c++) {
    //             rawData[c] = vector[c + index];
    //         }
    //         if (transpose) {
    //             this.transpose();
    //         }
    //     }
    //     /**
    //      * Copies all of the matrix data from the calling Matrix3D object into the provided vector.
    //      */
    //     public copyRawDataTo(vector: number[] | ArrayBufferLike, index: number /*uint*/ = 0, transpose: boolean = false): void {
    //         if (transpose)
    //             this.transpose();
    //         if (index > 0) {
    //             for (var i: number = 0; i < index; i++)
    //                 vector[i] = 0;
    //         }
    //         var len: number = this.rawData.length;
    //         for (var c: number = 0; c < len; c++)
    //             vector[c + index] = this.rawData[c];
    //         if (transpose)
    //             this.transpose();
    //     }
    //     /**
    //      * Copies a Vector3D object into specific row of the calling Matrix3D object.
    //      */
    //     public copyRowFrom(row: number /*uint*/, vector3D: Point3DW): void {
    //         if (row < 0 || row > 3) {
    //             throw Error("row error");
    //         }
    //         const rawData = this.rawData;
    //         row *= 4;
    //         rawData[row] = vector3D.x;
    //         rawData[row + 1] = vector3D.y;
    //         rawData[row + 2] = vector3D.z;
    //         rawData[row + 3] = vector3D.w;
    //     }
    //     /**
    //      * Copies specific row of the calling Matrix3D object into the Vector3D object.
    //      */
    //     public copyRowTo(row: number /*uint*/, vector3D: Point3DW): void {
    //         if (row < 0 || row > 3) {
    //             throw Error("row error");
    //         }
    //         const rawData = this.rawData;
    //         row *= 4;
    //         vector3D.x = rawData[row];
    //         vector3D.y = rawData[row + 1];
    //         vector3D.z = rawData[row + 2];
    //         vector3D.w = rawData[row + 3];
    //     }
    //     public copyToMatrix3D(dest: Matrix3D): void {
    //         dest.rawData.set(this.rawData);
    //     }
    //     /**
    //      * Returns the transformation matrix's translation, rotation, and scale settings as a Vector of three Vector3D objects.
    //      */
    //     // public decompose(orientationStyle = Orientation3D.EULER_ANGLES) {
    //     //     // http://www.gamedev.net/topic/467665-decomposing-rotationtranslationscale-from-matrix/
    //     //     const vec: Vector3D[] = [];
    //     //     const m = this.clone();
    //     //     const mr = m.rawData;
    //     //     const pos = new Vector3D(mr[12], mr[13], mr[14]);
    //     //     mr[12] = 0;
    //     //     mr[13] = 0;
    //     //     mr[14] = 0;
    //     //     const sqrt = Math.sqrt;
    //     //     const sx = sqrt(mr[0] * mr[0] + mr[1] * mr[1] + mr[2] * mr[2]);
    //     //     const sy = sqrt(mr[4] * mr[4] + mr[5] * mr[5] + mr[6] * mr[6]);
    //     //     let sz = sqrt(mr[8] * mr[8] + mr[9] * mr[9] + mr[10] * mr[10]);
    //     //     //determine 3*3
    //     //     if (mr[0] * (mr[5] * mr[10] - mr[6] * mr[9]) - mr[1] * (mr[4] * mr[10] - mr[6] * mr[8]) + mr[2] * (mr[4] * mr[9] - mr[5] * mr[8]) < 0) {
    //     //         sz = -sz;
    //     //     }
    //     //     mr[0] /= sx;
    //     //     mr[1] /= sx;
    //     //     mr[2] /= sx;
    //     //     mr[4] /= sy;
    //     //     mr[5] /= sy;
    //     //     mr[6] /= sy;
    //     //     mr[8] /= sz;
    //     //     mr[9] /= sz;
    //     //     mr[10] /= sz;
    //     //     var rot = new Vector3D();
    //     //     switch (orientationStyle) {
    //     //         case Orientation3D.AXIS_ANGLE:
    //     //             rot.w = Math.acos((mr[0] + mr[5] + mr[10] - 1) / 2);
    //     //             var len: number = Math.sqrt((mr[6] - mr[9]) * (mr[6] - mr[9]) + (mr[8] - mr[2]) * (mr[8] - mr[2]) + (mr[1] - mr[4]) * (mr[1] - mr[4]));
    //     //             rot.x = (mr[6] - mr[9]) / len;
    //     //             rot.y = (mr[8] - mr[2]) / len;
    //     //             rot.z = (mr[1] - mr[4]) / len;
    //     //             break;
    //     //         case Orientation3D.QUATERNION:
    //     //             const tr = mr[0] + mr[5] + mr[10];
    //     //             if (tr > 0) {
    //     //                 let rw = sqrt(1 + tr) / 2;
    //     //                 rot.w = rw;
    //     //                 rw *= 4;
    //     //                 rot.x = (mr[6] - mr[9]) / rw;
    //     //                 rot.y = (mr[8] - mr[2]) / rw;
    //     //                 rot.z = (mr[1] - mr[4]) / rw;
    //     //             } else if ((mr[0] > mr[5]) && (mr[0] > mr[10])) {
    //     //                 let rx = sqrt(1 + mr[0] - mr[5] - mr[10]) / 2;
    //     //                 rot.x = rx;
    //     //                 rx *= 4;
    //     //                 rot.w = (mr[6] - mr[9]) / rx;
    //     //                 rot.y = (mr[1] + mr[4]) / rx;
    //     //                 rot.z = (mr[8] + mr[2]) / rx;
    //     //             } else if (mr[5] > mr[10]) {
    //     //                 rot.y = sqrt(1 + mr[5] - mr[0] - mr[10]) / 2;
    //     //                 rot.x = (mr[1] + mr[4]) / (4 * rot.y);
    //     //                 rot.w = (mr[8] - mr[2]) / (4 * rot.y);
    //     //                 rot.z = (mr[6] + mr[9]) / (4 * rot.y);
    //     //             } else {
    //     //                 rot.z = sqrt(1 + mr[10] - mr[0] - mr[5]) / 2;
    //     //                 rot.x = (mr[8] + mr[2]) / (4 * rot.z);
    //     //                 rot.y = (mr[6] + mr[9]) / (4 * rot.z);
    //     //                 rot.w = (mr[1] - mr[4]) / (4 * rot.z);
    //     //             }
    //     //             break;
    //     //         case Orientation3D.EULER_ANGLES:
    //     //             rot.y = Math.asin(-mr[2]);
    //     //             //var cos:number = Math.cos(rot.y);
    //     //             if (mr[2] != 1 && mr[2] != -1) {
    //     //                 rot.x = Math.atan2(mr[6], mr[10]);
    //     //                 rot.z = Math.atan2(mr[1], mr[0]);
    //     //             } else {
    //     //                 rot.z = 0;
    //     //                 rot.x = Math.atan2(mr[4], mr[5]);
    //     //             }
    //     //             break;
    //     //     }
    //     //     vec.push(pos);
    //     //     vec.push(rot);
    //     //     vec.push(new Vector3D(sx, sy, sz));
    //     //     return vec;
    //     // }
    //     /**
    //      * [static] Interpolates the translation, rotation, and scale transformation of one matrix toward those of the target matrix.
    //      */
    //     //TODO: only support rotation matrix for now
    //     public static interpolate(thisMat: Matrix3D, toMat: Matrix3D, percent: number): Matrix3D {
    //         const a = new Quaternion().fromMatrix3D(thisMat);
    //         const b = new Quaternion().fromMatrix3D(toMat);
    //         return Quaternion.lerp(a, b, percent).toMatrix3D();
    //     }
    //     /**
    //      * Interpolates this matrix towards the translation, rotation, and scale transformations of the target matrix.
    //      */
    //     //TODO: only support rotation matrix for now
    //     public interpolateTo(toMat: Matrix3D, percent: number) {
    //         this.rawData.set(Matrix3D.interpolate(this, toMat, percent).rawData);
    //     }
    //     /**
    //      * Inverts the current matrix.
    //      */
    //     public invert() {
    //         const { rawData } = this;
    //         matrixt_invert(rawData,rawData);
    //         // const { rawData } = this;
    //         // var a = rawData[0], b = rawData[1], c = rawData[2], d = rawData[3],
    //         //     e = rawData[4], f = rawData[5], g = rawData[6], h = rawData[7],
    //         //     i = rawData[8], j = rawData[9], k = rawData[10], l = rawData[11],
    //         //     m = rawData[12], n = rawData[13], o = rawData[14], p = rawData[15],
    //         //     q = a * f - b * e, r = a * g - c * e,
    //         //     s = a * h - d * e, t = b * g - c * f,
    //         //     u = b * h - d * f, v = c * h - d * g,
    //         //     w = i * n - j * m, x = i * o - k * m,
    //         //     y = i * p - l * m, z = j * o - k * n,
    //         //     A = j * p - l * n, B = k * p - l * o,
    //         //     ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);
    //         // rawData[0] = (f * B - g * A + h * z) * ivd;
    //         // rawData[1] = (-b * B + c * A - d * z) * ivd;
    //         // rawData[2] = (n * v - o * u + p * t) * ivd;
    //         // rawData[3] = (-j * v + k * u - l * t) * ivd;
    //         // rawData[4] = (-e * B + g * y - h * x) * ivd;
    //         // rawData[5] = (a * B - c * y + d * x) * ivd;
    //         // rawData[6] = (-m * v + o * s - p * r) * ivd;
    //         // rawData[7] = (i * v - k * s + l * r) * ivd;
    //         // rawData[8] = (e * A - f * y + h * w) * ivd;
    //         // rawData[9] = (-a * A + b * y - d * w) * ivd;
    //         // rawData[10] = (m * u - n * s + p * q) * ivd;
    //         // rawData[11] = (-i * u + j * s - l * q) * ivd;
    //         // rawData[12] = (-e * z + f * x - g * w) * ivd;
    //         // rawData[13] = (a * z - b * x + c * w) * ivd;
    //         // rawData[14] = (-m * t + n * r - o * q) * ivd;
    //         // rawData[15] = (i * t - j * r + k * q) * ivd;
    //         // // let d: number = this.determinant;
    //         // // let invertable: boolean = Math.abs(d) > 0.00000000001;
    //         // // if (invertable) {
    //         // //     d = 1 / d;
    //         // //     const rawData = this.rawData;
    //         // //     const [
    //         // //         a1, a2, a3, a4,
    //         // //         b1, b2, b3, b4,
    //         // //         m31, m32, m33, m34,
    //         // //         m41, m42, m43, m44
    //         // //     ] = rawData as any;
    //         // //     const a2$b3_b2$a3 = a2 * b3 - b2 * a3;
    //         // //     const a2$b4_b2$a4 = a2 * b4 - b2 * a4;
    //         // //     const a2$m33_m32$a3 = a2 * m33 - m32 * a3;
    //         // //     const a2$m34_m32$a4 = a2 * m34 - m32 * a4;
    //         // //     const a2$m43_m42$a3 = a2 * m43 - m42 * a3;
    //         // //     const a2$m44_m42$a4 = a2 * m44 - m42 * a4;
    //         // //     const a3$b4_b3$a4 = a3 * b4 - b3 * a4;
    //         // //     const a3$m34_m33$a4 = a3 * m34 - m33 * a4;
    //         // //     const a3$m44_m43$a4 = a3 * m44 - m43 * a4;
    //         // //     const b2$m33_m32$b3 = b2 * m33 - m32 * b3;
    //         // //     const b2$m34_m32$b4 = b2 * m34 - m32 * b4;
    //         // //     const b2$m43_m42$b3 = b2 * m43 - m42 * b3;
    //         // //     const b2$m44_m42$b4 = b2 * m44 - m42 * b4;
    //         // //     const b3$m34_m33$b4 = b3 * m34 - m33 * b4;
    //         // //     const b3$m44_m43$b4 = b3 * m44 - m43 * b4;
    //         // //     const m32$m43_m42$m33 = m32 * m43 - m42 * m33;
    //         // //     const m32$m44_m42$m34 = m32 * m44 - m42 * m34;
    //         // //     const m33$m44_m43$m34 = m33 * m44 - m43 * m34;
    //         // //     rawData[0] = d * (b2 * (m33$m44_m43$m34) - m32 * (b3$m44_m43$b4) + m42 * (b3$m34_m33$b4));
    //         // //     rawData[1] = -d * (a2 * (m33$m44_m43$m34) - m32 * (a3$m44_m43$a4) + m42 * (a3$m34_m33$a4));
    //         // //     rawData[2] = d * (a2 * (b3$m44_m43$b4) - b2 * (a3$m44_m43$a4) + m42 * (a3$b4_b3$a4));
    //         // //     rawData[3] = -d * (a2 * (b3$m34_m33$b4) - b2 * (a3$m34_m33$a4) + m32 * (a3$b4_b3$a4));
    //         // //     rawData[4] = -d * (b1 * (m33$m44_m43$m34) - m31 * (b3$m44_m43$b4) + m41 * (b3$m34_m33$b4));
    //         // //     rawData[5] = d * (a1 * (m33$m44_m43$m34) - m31 * (a3$m44_m43$a4) + m41 * (a3$m34_m33$a4));
    //         // //     rawData[6] = -d * (a1 * (b3$m44_m43$b4) - b1 * (a3$m44_m43$a4) + m41 * (a3$b4_b3$a4));
    //         // //     rawData[7] = d * (a1 * (b3$m34_m33$b4) - b1 * (a3$m34_m33$a4) + m31 * (a3$b4_b3$a4));
    //         // //     rawData[8] = d * (b1 * (m32$m44_m42$m34) - m31 * (b2$m44_m42$b4) + m41 * (b2$m34_m32$b4));
    //         // //     rawData[9] = -d * (a1 * (m32$m44_m42$m34) - m31 * (a2$m44_m42$a4) + m41 * (a2$m34_m32$a4));
    //         // //     rawData[10] = d * (a1 * (b2$m44_m42$b4) - b1 * (a2$m44_m42$a4) + m41 * (a2$b4_b2$a4));
    //         // //     rawData[11] = -d * (a1 * (b2$m34_m32$b4) - b1 * (a2$m34_m32$a4) + m31 * (a2$b4_b2$a4));
    //         // //     rawData[12] = -d * (b1 * (m32$m43_m42$m33) - m31 * (b2$m43_m42$b3) + m41 * (b2$m33_m32$b3));
    //         // //     rawData[13] = d * (a1 * (m32$m43_m42$m33) - m31 * (a2$m43_m42$a3) + m41 * (a2$m33_m32$a3));
    //         // //     rawData[14] = -d * (a1 * (b2$m43_m42$b3) - b1 * (a2$m43_m42$a3) + m41 * (a2$b3_b2$a3));
    //         // //     rawData[15] = d * (a1 * (b2$m33_m32$b3) - b1 * (a2$m33_m32$a3) + m31 * (a2$b3_b2$a3));
    //         // // }
    //         // // return invertable;
    //     }
    //     /**
    //      * Rotates the display object so that it faces a specified position.
    //      */
    //     public pointAt(pos: Vector3D, at?: Vector3D, up?: Vector3D) {
    //         if (undefined == at) at = new Vector3D(0, 0, -1);
    //         if (undefined == up) up = new Vector3D(0, -1, 0);
    //         let dir = at.subtract(pos);
    //         let vup = up.clone();
    //         dir.normalize();
    //         vup.normalize();
    //         let dir2 = dir.clone();
    //         dir2.scaleBy(vup.dotProduct(dir));
    //         vup = vup.subtract(dir2);
    //         if (vup.length > 0) vup.normalize();
    //         else if (dir.x != 0) vup = new Vector3D(-dir.y, dir.x, 0);
    //         else vup = new Vector3D(1, 0, 0);
    //         let right = vup.crossProduct(dir);
    //         right.normalize();
    //         let rawData = this.rawData;
    //         rawData[0] = right.x;
    //         rawData[4] = right.y;
    //         rawData[8] = right.z;
    //         rawData[12] = 0.0;
    //         rawData[1] = vup.x;
    //         rawData[5] = vup.y;
    //         rawData[9] = vup.z;
    //         rawData[13] = 0.0;
    //         rawData[2] = dir.x;
    //         rawData[6] = dir.y;
    //         rawData[10] = dir.z;
    //         rawData[14] = 0.0;
    //         rawData[3] = pos.x;
    //         rawData[7] = pos.y;
    //         rawData[11] = pos.z;
    //         rawData[15] = 1.0;
    //     }
    //     // public recompose(components: Vector3D[], orientationStyle = Orientation3D.EULER_ANGLES) {
    //     //     if (components.length < 3) {
    //     //         return;
    //     //     }
    //     //     const [c0, c1, c2] = components;
    //     //     const { x: scale_0_1_2, y: scale_4_5_6, z: scale_8_9_10 } = c2;
    //     //     if (scale_0_1_2 == 0 || scale_4_5_6 == 0 || scale_8_9_10 == 0) return;
    //     //     this.identity();
    //     //     // const scale = [];
    //     //     // scale[0] = scale[1] = scale[2] = scale_0_1_2;// scale0 scale1 scale2
    //     //     // scale[4] = scale[5] = scale[6] = scale_4_5_6;// scale4 scale5 scale6
    //     //     // scale[8] = scale[9] = scale[10] = scale_8_9_10;//scale8 scale9 scale10
    //     //     const rawData = this.rawData;
    //     //     const { x: c0x, y: c0y, z: c0z } = c0;
    //     //     const { x: c1x, y: c1y, z: c1z, w: c1w } = c1;
    //     //     const { cos, sin } = Math;
    //     //     switch (orientationStyle) {
    //     //         case Orientation3D.EULER_ANGLES:
    //     //             {
    //     //                 var cx = cos(c1x);
    //     //                 var cy = cos(c1y);
    //     //                 var cz = cos(c1z);
    //     //                 var sx = sin(c1x);
    //     //                 var sy = sin(c1y);
    //     //                 var sz = sin(c1z);
    //     //                 rawData[0] = cy * cz * scale_0_1_2;
    //     //                 rawData[1] = cy * sz * scale_0_1_2;
    //     //                 rawData[2] = -sy * scale_0_1_2;
    //     //                 rawData[3] = 0;
    //     //                 rawData[4] = (sx * sy * cz - cx * sz) * scale_4_5_6;
    //     //                 rawData[5] = (sx * sy * sz + cx * cz) * scale_4_5_6;
    //     //                 rawData[6] = sx * cy * scale_4_5_6;
    //     //                 rawData[7] = 0;
    //     //                 rawData[8] = (cx * sy * cz + sx * sz) * scale_8_9_10;
    //     //                 rawData[9] = (cx * sy * sz - sx * cz) * scale_8_9_10;
    //     //                 rawData[10] = cx * cy * scale_8_9_10;
    //     //                 rawData[11] = 0;
    //     //                 rawData[12] = c0x;
    //     //                 rawData[13] = c0y;
    //     //                 rawData[14] = c0z;
    //     //                 rawData[15] = 1;
    //     //             }
    //     //             break;
    //     //         default:
    //     //             {
    //     //                 var x = c1x;
    //     //                 var y = c1y;
    //     //                 var z = c1z;
    //     //                 var w = c1w;
    //     //                 if (orientationStyle == Orientation3D.AXIS_ANGLE) {
    //     //                     const w_2 = w / 2;
    //     //                     const sinW_2 = sin(w_2);
    //     //                     x *= sinW_2;
    //     //                     y *= sinW_2;
    //     //                     z *= sinW_2;
    //     //                     w = cos(w_2);
    //     //                 };
    //     //                 rawData[0] = (1 - 2 * y * y - 2 * z * z) * scale_0_1_2;
    //     //                 rawData[1] = (2 * x * y + 2 * w * z) * scale_0_1_2;
    //     //                 rawData[2] = (2 * x * z - 2 * w * y) * scale_0_1_2;
    //     //                 rawData[3] = 0;
    //     //                 rawData[4] = (2 * x * y - 2 * w * z) * scale_4_5_6;
    //     //                 rawData[5] = (1 - 2 * x * x - 2 * z * z) * scale_4_5_6;
    //     //                 rawData[6] = (2 * y * z + 2 * w * x) * scale_4_5_6;
    //     //                 rawData[7] = 0;
    //     //                 rawData[8] = (2 * x * z + 2 * w * y) * scale_8_9_10;
    //     //                 rawData[9] = (2 * y * z - 2 * w * x) * scale_8_9_10;
    //     //                 rawData[10] = (1 - 2 * x * x - 2 * y * y) * scale_8_9_10;
    //     //                 rawData[11] = 0;
    //     //                 rawData[12] = c0x;
    //     //                 rawData[13] = c0y;
    //     //                 rawData[14] = c0z;
    //     //                 rawData[15] = 1;
    //     //             }
    //     //             break;
    //     //     };
    //     // }
    //     /**
    //      * Sets the transformation matrix's translation, rotation, and scale settings.
    //      */
    //     // public recompose2(components: Vector3D[], orientationStyle = Orientation3D.EULER_ANGLES) {
    //     //     if (components.length < 3) return false
    //     //     //TODO: only support euler angle for now
    //     //     const [pos_tmp, euler_tmp, scale_tmp] = components;
    //     //     this.identity();
    //     //     this.appendScale(scale_tmp.x, scale_tmp.y, scale_tmp.z);
    //     //     this.append(this.getRotateMatrix(Vector3D.X_AXIS, euler_tmp.x));
    //     //     this.append(this.getRotateMatrix(Vector3D.Y_AXIS, euler_tmp.y));
    //     //     this.append(this.getRotateMatrix(Vector3D.Z_AXIS, euler_tmp.z));
    //     //     const rawData = this.rawData;
    //     //     rawData[12] = pos_tmp.x;
    //     //     rawData[13] = pos_tmp.y;
    //     //     rawData[14] = pos_tmp.z;
    //     //     rawData[15] = 1;
    //     //     return true;
    //     // }
    //     /**
    //      * Uses the transformation matrix to transform a Vector3D object from one space coordinate to another.
    //      */
    //     public transformVector(v: Point3DW, result?: Point3DW) {
    //         /*
    //                   [ x
    //         this  *     y
    //                     z
    //                     1 ]
    //         */
    //         const { x, y, z } = v;
    //         const rawData = this.rawData;
    //         if (undefined == result) {
    //             result = new Vector3D();
    //         }
    //         result.x = x * rawData[0] + y * rawData[4] + z * rawData[8] + rawData[12],
    //             result.y = x * rawData[1] + y * rawData[5] + z * rawData[9] + rawData[13],
    //             result.z = x * rawData[2] + y * rawData[6] + z * rawData[10] + rawData[14],
    //             result.w = x * rawData[3] + y * rawData[7] + z * rawData[11] + rawData[15]
    //         return result;
    //     }
    //     public transformRotation(v: Point3DW, result?: Point3DW) {
    //         const { x, y, z } = v;
    //         const rawData = this.rawData;
    //         if (undefined == result) {
    //             result = new Vector3D();
    //         }
    //         result.x = x * rawData[0] + y * rawData[4] + z * rawData[8]
    //         result.y = x * rawData[1] + y * rawData[5] + z * rawData[9]
    //         result.z = x * rawData[2] + y * rawData[6] + z * rawData[10]
    //         result.w = x * rawData[3] + y * rawData[7] + z * rawData[11]
    //         return result;
    //     }
    //     /**
    //      * Uses the transformation matrix without its translation elements to transform a Vector3D object from one space coordinate to another.
    //      */
    //     public deltaTransformVector(v: Point3DW) {
    //         /*
    //                    [ x
    //          this  *     y
    //                      z
    //                      0 ]
    //          */
    //         const { x, y, z } = v;
    //         const rawData = this.rawData;
    //         return new Vector3D(
    //             x * rawData[0] + y * rawData[1] + z * rawData[2],
    //             x * rawData[4] + y * rawData[5] + z * rawData[6],
    //             x * rawData[8] + y * rawData[9] + z * rawData[10],
    //             0 //v.x * this.rawData[12] + v.y * this.rawData[13] + v.z * this.rawData[14]
    //         );
    //     }
    //     /**
    //      * Uses the transformation matrix to transform a Vector of Numbers from one coordinate space to another.
    //      */
    //     public transformVectors(vin: number[], vout: number[]): void {
    //         let i = 0;
    //         let v = new Vector3D();
    //         let v2 = new Vector3D();
    //         while (i + 3 <= vin.length) {
    //             v.x = vin[i];
    //             v.y = vin[i + 1];
    //             v.z = vin[i + 2];
    //             this.transformVector(v, v2);  //todo: simplify operation
    //             vout[i] = v2.x;
    //             vout[i + 1] = v2.y;
    //             vout[i + 2] = v2.z;
    //             i += 3;
    //         }
    //     }
    //     /**
    //      * Converts the current Matrix3D object to a matrix where the rows and columns are swapped.
    //      */
    //     public transpose() {
    //         const rawData = this.rawData;
    //         const [
    //             , a12, a13, a14,
    //             a21, a22, a23, a24,
    //             a31, a32, a33, a34,
    //             a41, a42, a43
    //         ] = rawData as any;
    //         rawData[1] = a21;
    //         rawData[2] = a31;
    //         rawData[3] = a41;
    //         rawData[4] = a12;
    //         rawData[6] = a32;
    //         rawData[7] = a42;
    //         rawData[8] = a13;
    //         rawData[9] = a23;
    //         rawData[11] = a43;
    //         rawData[12] = a14;
    //         rawData[13] = a24;
    //         rawData[14] = a34;
    //     }
    //     public toString() {
    //         let str = "[Matrix3D]\n";
    //         const rawData = this.rawData;
    //         for (let i: number = 0; i < rawData.length; i++) {
    //             str += rawData[i] + "  , ";
    //             if (((i + 1) % 4) == 0) {
    //                 str += "\n"
    //             }
    //         }
    //         return str;
    //     }
    //     private getRotateMatrix(axis: Vector3D, radians: number) {
    //         let { x, y, z } = axis;
    //         //var radians: number = Math.PI / 180 * degrees;
    //         const c = Math.cos(radians);
    //         const s = Math.sin(radians);
    //         //get rotation matrix
    //         let rMatrix: number[];
    //         if (x != 0 && y == 0 && z == 0) { //rotate about x axis ,from y to z
    //             rMatrix = [
    //                 1, 0, 0, 0,
    //                 0, c, -s, 0,
    //                 0, s, c, 0,
    //                 0, 0, 0, 1
    //             ];
    //         } else if (y != 0 && x == 0 && z == 0) { // rotate about y ,from z to x
    //             rMatrix = [
    //                 c, 0, s, 0,
    //                 0, 1, 0, 0,
    //                 -s, 0, c, 0,
    //                 0, 0, 0, 1
    //             ];
    //         } else if (z != 0 && x == 0 && y == 0) { // rotate about z axis ,from x to y
    //             rMatrix = [
    //                 c, -s, 0, 0,
    //                 s, c, 0, 0,
    //                 0, 0, 1, 0,
    //                 0, 0, 0, 1,
    //             ];
    //         } else {
    //             //make sure axis is a unit vector
    //             const lsq = axis.lengthSquared;
    //             if (Math.abs(lsq - 1) > 0.0001) {
    //                 const f = 1 / Math.sqrt(lsq);
    //                 x *= f;
    //                 y *= f;
    //                 z *= f;
    //             }
    //             const t = 1 - c;
    //             rMatrix = [
    //                 x * x * t + c, x * y * t - z * s, x * z * t + y * s, 0,
    //                 x * y * t + z * s, y * y * t + c, y * z * t - x * s, 0,
    //                 x * z * t - y * s, y * z * t + x * s, z * z * t + c, 0,
    //                 0, 0, 0, 1
    //             ];
    //         }
    //         return new Matrix3D(rMatrix);
    //     }
    // }
})(rf || (rf = {}));
///<reference path="../stage3d/geom/Matrix3D.ts" />
var rf;
(function (rf) {
    rf.rgb_color_temp = { r: 1, g: 1, b: 1, a: 1 };
    function hexToCSS(d, a) {
        if (a === void 0) { a = 1; }
        var r = ((d & 0x00ff0000) >>> 16) & 0xFF;
        var g = ((d & 0x0000ff00) >>> 8) & 0xFF;
        var b = d & 0x000000ff;
        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'; //"rgba(0, 0, 200, 0.5)";
    }
    rf.hexToCSS = hexToCSS;
    function toRGB(color, out) {
        if (undefined == out) {
            out = rf.rgb_color_temp;
        }
        out.hex = color;
        out.a = 1.0;
        out.r = ((color & 0x00ff0000) >>> 16) / 0xFF;
        out.g = ((color & 0x0000ff00) >>> 8) / 0xFF;
        out.b = (color & 0x000000ff) / 0xFF;
        return out;
    }
    rf.toRGB = toRGB;
    function toCSS(color) {
        return "rgba(" + color.r * 0xFF + "," + color.g * 0xFF + "," + color.b * 0xFF + "," + color.a * 0xFF + ")";
    }
    rf.toCSS = toCSS;
    function newColor(hex) {
        return toRGB(hex, {});
    }
    rf.newColor = newColor;
    /**
     * 有 `x` `y` 两个属性
     *
     * @export
     * @interface Point
     */
    var Point = /** @class */ (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Object.defineProperty(Point.prototype, "length", {
            get: function () {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            },
            enumerable: true,
            configurable: true
        });
        return Point;
    }());
    rf.Point = Point;
    /**
     * 矩形
     * 有`x`,`y`,`width`,`height` 4个属性
     *
     * @export
     * @interface Rect
     * @extends {Point}
     * @extends {Size}
     */
    var Rect = /** @class */ (function (_super) {
        __extends(Rect, _super);
        function Rect(x, y, w, h) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (w === void 0) { w = 0; }
            if (h === void 0) { h = 0; }
            var _this = _super.call(this, x, y) || this;
            _this.w = 0;
            _this.h = 0;
            _this.w = w;
            _this.h = h;
            return _this;
        }
        Rect.prototype.clone = function () {
            return new Rect(this.x, this.y, this.w, this.h);
        };
        return Rect;
    }(Point));
    rf.Rect = Rect;
    rf.RADIANS_TO_DEGREES = 180 / Math.PI;
    rf.DEGREES_TO_RADIANS = Math.PI / 180;
    rf.tempAxeX = rf.newVector3D();
    rf.tempAxeY = rf.newVector3D();
    rf.tempAxeZ = rf.newVector3D();
    rf.X_AXIS = rf.newVector3D(1, 0, 0);
    rf.Y_AXIS = rf.newVector3D(0, 1, 0);
    rf.Z_AXIS = rf.newVector3D(0, 0, 1);
    rf.PI2 = Math.PI * 2;
    rf.RAW_DATA_CONTAINER = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
    rf.TEMP_MATRIX = rf.newMatrix3D();
    // export let CALCULATION_MATRIX_2D:Matrix = new Matrix();
    rf.TEMP_VECTOR3D = rf.newVector3D();
    rf.TEMP_DECOMPOSE = [rf.newVector3D(), rf.newVector3D(), rf.newVector3D()];
    rf.Location = {
        /**
         * 根据两个经纬度获取距离(单位：米)
         *
         * @param {Location} l1
         * @param {Location} l2
         * @returns 距离(单位：米)
         */
        getDist: function (l1, l2) {
            var dtr = rf.DEGREES_TO_RADIANS;
            var radlat1 = l1.latitude * dtr;
            var radlat2 = l2.latitude * dtr;
            var a = radlat1 - radlat2;
            var b = (l1.longitude - l2.longitude) * dtr;
            return Math.asin(Math.sqrt(Math.pow(Math.sin(a * .5), 2) + Math.cos(radlat1) * Math.cos(radlat2) * (Math.pow(Math.sin(b * .5), 2)))) * 12756274;
        }
    };
    rf.EMPTY_POINT2D = new Point();
    rf.EMPTY_POINT2D_2 = new Point();
    rf.EMPTY_POINT2D_3 = new Point();
    // export function m2dTransform(matrix:ArrayLike<number>,p:Point2D,out:Point2D):void{
    //     const{
    //         m11,m12,m13,
    //         m21,m22,m23,
    //         m31,m32,m33
    //     } = matrix as any;
    //     const{
    //         x,y
    //     } = p;
    //     let dx = x * m11 + y * m21 + m31;
    //     let dy = x * m12 + y * m22 + m32;
    //     out.x = dx;
    //     out.y = dy;
    // }
    function m2dTransform(matrix, p, out) {
        var _a = matrix, m11 = _a[0], m12 = _a[1], m13 = _a[2], m21 = _a[3], m22 = _a[4], m23 = _a[5], m31 = _a[6], m32 = _a[7], m33 = _a[8];
        var x = p[0];
        var y = p[1];
        var dx = x * m11 + y * m21 + m31;
        var dy = x * m12 + y * m22 + m32;
        out[0] = dx;
        out[1] = dy;
    }
    rf.m2dTransform = m2dTransform;
    // export class Float32Byte {
    //     public array: Float32Array;
    //     constructor(array?: Float32Array) {
    //         if(undefined == array){
    //             array = new Float32Array(0);
    //         }
    //         this.array = array;
    //     }
    //     get length(): number {
    //         return this.array.length;
    //     }
    //     set length(value: number) {
    //         if (this.array.length == value) {
    //             return;
    //         }
    //         let nd = new Float32Array(value);
    //         let len = value < this.array.length ? value : this.array.length;
    //         if(len != 0){
    //             // nd.set(this.array.slice(0, len), 0);
    //             nd.set(this.array);
    //         }
    //         this.array = nd;
    //     }
    //     append(byte: Float32Byte, offset: number = 0, len: number = -1): void {
    //         var position: number = 0;
    //         if (0 > offset) {
    //             offset = 0;
    //         }
    //         if (-1 == len) {
    //             len = byte.length - offset;
    //         } else {
    //             if (len > byte.length - offset) {
    //                 len = byte.length - offset;
    //             }
    //         }
    //         position = this.array.length;
    //         length = this.array.length + byte.length;
    //         if (len == byte.length) {
    //             this.array.set(byte.array, position);
    //         } else {
    //             this.array.set(byte.array.slice(offset, len), position);
    //         }
    //     }
    //     set(position:number, byte: Float32Byte, offset: number = 0, len: number = -1):void{
    //         if (0 > offset) {
    //             offset = 0;
    //         }
    //         if (-1 == len) {
    //             len = byte.length - offset;
    //         } else {
    //             if (len > byte.length - offset) {
    //                 len = byte.length - offset;
    //             }
    //         }
    //         if (len == byte.length) {
    //             this.array.set(byte.array, position);
    //         } else {
    //             this.array.set(byte.array.slice(offset, len), position);
    //         }
    //     }
    //     wPoint1(position: number, x: number, y?: number, z?: number, w?: number): void {
    //         this.array[position] = x;
    //     }
    //     wPoint2(position: number, x: number, y: number, z?: number, w?: number): void {
    //         this.array[position] = x;
    //         this.array[position + 1] = y;
    //     }
    //     wPoint3(position: number, x: number, y: number, z: number, w?: number): void {
    //         this.array[position] = x;
    //         this.array[position + 1] = y;
    //         this.array[position + 2] = z;
    //     }
    //     wPoint4(position: number, x: number, y: number, z: number, w: number): void {
    //         this.array[position] = x;
    //         this.array[position + 1] = y;
    //         this.array[position + 2] = z;
    //         this.array[position + 3] = w;
    //     }
    //     wUIPoint(position: number, x: number, y: number, z: number, u: number, v: number, index: number, r: number, g: number, b: number, a: number): void {
    //         this.array[position] = x;
    //         this.array[position + 1] = y;
    //         this.array[position + 2] = z;
    //         this.array[position + 3] = u;
    //         this.array[position + 4] = v;
    //         this.array[position + 5] = index;
    //         this.array[position + 6] = r;
    //         this.array[position + 7] = g;
    //         this.array[position + 8] = b;
    //         this.array[position + 9] = a;
    //     }
    // }
})(rf || (rf = {}));
///<reference path="./CONFIG.ts" />
var rf;
(function (rf) {
    var Endian = /** @class */ (function () {
        function Endian() {
        }
        Endian.LITTLE_ENDIAN = true;
        Endian.BIG_ENDIAN = false;
        return Endian;
    }());
    rf.Endian = Endian;
    var ByteArray = /** @class */ (function () {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        function ByteArray(buffer, bufferExtSize) {
            if (bufferExtSize === void 0) { bufferExtSize = 0; }
            this.bufferExtSize = 0; //Buffer expansion size
            this.endian = true;
            /**
             * @private
             */
            this.EOF_byte = -1;
            /**
             * @private
             */
            this.EOF_code_point = -1;
            if (bufferExtSize < 0) {
                bufferExtSize = 0;
            }
            this.bufferExtSize = bufferExtSize;
            var bytes, wpos = 0;
            if (buffer) { //有数据，则可写字节数从字节尾开始
                var uint8 = void 0;
                if (buffer instanceof Uint8Array) {
                    uint8 = buffer;
                    wpos = buffer.length;
                }
                else {
                    wpos = buffer.byteLength;
                    uint8 = new Uint8Array(buffer);
                }
                if (bufferExtSize == 0) {
                    bytes = new Uint8Array(wpos);
                }
                else {
                    var multi = (wpos / bufferExtSize | 0) + 1;
                    bytes = new Uint8Array(multi * bufferExtSize);
                }
                bytes.set(uint8);
            }
            else {
                bytes = new Uint8Array(bufferExtSize);
            }
            this.write_position = wpos;
            this._position = 0;
            this._bytes = bytes;
            this.data = new DataView(bytes.buffer);
            this.endian = Endian.BIG_ENDIAN;
        }
        ByteArray.prototype.setArrayBuffer = function (buffer) {
        };
        Object.defineProperty(ByteArray.prototype, "readAvailable", {
            /**
             * 可读的剩余字节数
             *
             * @returns
             *
             * @memberOf ByteArray
             */
            get: function () {
                return this.write_position - this._position;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "buffer", {
            get: function () {
                return this.data.buffer.slice(0, this.write_position);
            },
            /**
             * @private
             */
            set: function (value) {
                var wpos = value.byteLength;
                var uint8 = new Uint8Array(value);
                var bufferExtSize = this.bufferExtSize;
                var bytes;
                if (bufferExtSize == 0) {
                    bytes = new Uint8Array(wpos);
                }
                else {
                    var multi = (wpos / bufferExtSize | 0) + 1;
                    bytes = new Uint8Array(multi * bufferExtSize);
                }
                bytes.set(uint8);
                this.write_position = wpos;
                this._bytes = bytes;
                this.data = new DataView(bytes.buffer);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "rawBuffer", {
            get: function () {
                return this.data.buffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "bytes", {
            get: function () {
                return this._bytes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "dataView", {
            /**
             * @private
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return this.data;
            },
            /**
             * @private
             */
            set: function (value) {
                this.buffer = value.buffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "bufferOffset", {
            /**
             * @private
             */
            get: function () {
                return this.data.byteOffset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "position", {
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
            get: function () {
                return this._position;
            },
            set: function (value) {
                this._position = value;
                if (value > this.write_position) {
                    this.write_position = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "length", {
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
            get: function () {
                return this.write_position;
            },
            set: function (value) {
                this.write_position = value;
                if (this.data.byteLength > value) {
                    this._position = value;
                }
                this._validateBuffer(value);
            },
            enumerable: true,
            configurable: true
        });
        ByteArray.prototype._validateBuffer = function (value) {
            if (this.data.byteLength < value) {
                var be = this.bufferExtSize;
                var tmp = void 0;
                if (be == 0) {
                    tmp = new Uint8Array(value);
                }
                else {
                    var nLen = ((value / be >> 0) + 1) * be;
                    tmp = new Uint8Array(nLen);
                }
                tmp.set(this._bytes);
                this._bytes = tmp;
                this.data = new DataView(tmp.buffer);
            }
        };
        Object.defineProperty(ByteArray.prototype, "bytesAvailable", {
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
            get: function () {
                return this.data.byteLength - this._position;
            },
            enumerable: true,
            configurable: true
        });
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
        ByteArray.prototype.clear = function () {
            var buffer = new ArrayBuffer(this.bufferExtSize);
            this.data = new DataView(buffer);
            this._bytes = new Uint8Array(buffer);
            this._position = 0;
            this.write_position = 0;
        };
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
        ByteArray.prototype.readBoolean = function () {
            if (this.validate(1 /* SIZE_OF_BOOLEAN */))
                return !!this._bytes[this.position++];
        };
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
        ByteArray.prototype.readByte = function () {
            if (this.validate(1 /* SIZE_OF_INT8 */))
                return this.data.getInt8(this.position++);
        };
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
        ByteArray.prototype.readBytes = function (bytes, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            if (!bytes) { //由于bytes不返回，所以new新的无意义
                return;
            }
            var pos = this._position;
            var available = this.write_position - pos;
            if (available < 0) {
                // egret.$error(1025);
                return;
            }
            if (length == 0) {
                length = available;
            }
            else if (length > available) {
                // egret.$error(1025);
                return;
            }
            var position = bytes._position;
            bytes._position = 0;
            bytes.validateBuffer(offset + length);
            bytes._position = position;
            bytes._bytes.set(this._bytes.subarray(pos, pos + length), offset);
            this.position += length;
        };
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
        ByteArray.prototype.readDouble = function () {
            if (this.validate(8 /* SIZE_OF_FLOAT64 */)) {
                var value = this.data.getFloat64(this._position, this.endian);
                this.position += 8 /* SIZE_OF_FLOAT64 */;
                return value;
            }
        };
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
        ByteArray.prototype.readFloat = function () {
            if (this.validate(4 /* SIZE_OF_FLOAT32 */)) {
                var value = this.data.getFloat32(this._position, this.endian);
                this.position += 4 /* SIZE_OF_FLOAT32 */;
                return value;
            }
        };
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
        ByteArray.prototype.readInt = function () {
            if (this.validate(4 /* SIZE_OF_INT32 */)) {
                var value = this.data.getInt32(this._position, this.endian);
                this.position += 4 /* SIZE_OF_INT32 */;
                return value;
            }
        };
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
        ByteArray.prototype.readShort = function () {
            if (this.validate(2 /* SIZE_OF_INT16 */)) {
                var value = this.data.getInt16(this._position, this.endian);
                this.position += 2 /* SIZE_OF_INT16 */;
                return value;
            }
        };
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
        ByteArray.prototype.readUnsignedByte = function () {
            if (this.validate(1 /* SIZE_OF_UINT8 */))
                return this._bytes[this.position++];
        };
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
        ByteArray.prototype.readUnsignedInt = function () {
            if (this.validate(4 /* SIZE_OF_UINT32 */)) {
                var value = this.data.getUint32(this._position, this.endian);
                this.position += 4 /* SIZE_OF_UINT32 */;
                return value;
            }
        };
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
        ByteArray.prototype.readUnsignedShort = function () {
            if (this.validate(2 /* SIZE_OF_UINT16 */)) {
                var value = this.data.getUint16(this._position, this.endian);
                this.position += 2 /* SIZE_OF_UINT16 */;
                return value;
            }
        };
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
        ByteArray.prototype.readUTF = function () {
            var length = this.readUnsignedShort();
            if (length > 0) {
                return this.readUTFBytes(length);
            }
            else {
                return "";
            }
        };
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
        ByteArray.prototype.readUTFBytes = function (length) {
            if (!this.validate(length)) {
                return;
            }
            var data = this.data;
            var bytes = new Uint8Array(data.buffer, data.byteOffset + this._position, length);
            this.position += length;
            return this.decodeUTF8(bytes);
        };
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
        ByteArray.prototype.writeBoolean = function (value) {
            this.validateBuffer(1 /* SIZE_OF_BOOLEAN */);
            this._bytes[this.position++] = +value;
        };
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
        ByteArray.prototype.writeByte = function (value) {
            this.validateBuffer(1 /* SIZE_OF_INT8 */);
            this._bytes[this.position++] = value & 0xff;
        };
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
        ByteArray.prototype.writeBytes = function (bytes, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            var writeLength;
            if (offset < 0) {
                return;
            }
            if (length < 0) {
                return;
            }
            else if (length == 0) {
                writeLength = bytes.length - offset;
            }
            else {
                writeLength = Math.min(bytes.length - offset, length);
            }
            if (writeLength > 0) {
                this.validateBuffer(writeLength);
                this._bytes.set(bytes._bytes.subarray(offset, offset + writeLength), this._position);
                this.position = this._position + writeLength;
            }
        };
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
        ByteArray.prototype.writeDouble = function (value) {
            this.validateBuffer(8 /* SIZE_OF_FLOAT64 */);
            this.data.setFloat64(this._position, value, this.endian);
            this.position += 8 /* SIZE_OF_FLOAT64 */;
        };
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
        ByteArray.prototype.writeFloat = function (value) {
            this.validateBuffer(4 /* SIZE_OF_FLOAT32 */);
            this.data.setFloat32(this._position, value, this.endian);
            this.position += 4 /* SIZE_OF_FLOAT32 */;
        };
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
        ByteArray.prototype.writeInt = function (value) {
            this.validateBuffer(4 /* SIZE_OF_INT32 */);
            this.data.setInt32(this._position, value, this.endian);
            this.position += 4 /* SIZE_OF_INT32 */;
        };
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
        ByteArray.prototype.writeShort = function (value) {
            this.validateBuffer(2 /* SIZE_OF_INT16 */);
            this.data.setInt16(this._position, value, this.endian);
            this.position += 2 /* SIZE_OF_INT16 */;
        };
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
        ByteArray.prototype.writeUnsignedInt = function (value) {
            this.validateBuffer(4 /* SIZE_OF_UINT32 */);
            this.data.setUint32(this._position, value, this.endian);
            this.position += 4 /* SIZE_OF_UINT32 */;
        };
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
        ByteArray.prototype.writeUnsignedShort = function (value) {
            this.validateBuffer(2 /* SIZE_OF_UINT16 */);
            this.data.setUint16(this._position, value, this.endian);
            this.position += 2 /* SIZE_OF_UINT16 */;
        };
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
        ByteArray.prototype.writeUTF = function (value) {
            var utf8bytes = this.encodeUTF8(value);
            var length = utf8bytes.length;
            this.validateBuffer(2 /* SIZE_OF_UINT16 */ + length);
            this.data.setUint16(this._position, length, this.endian);
            this.position += 2 /* SIZE_OF_UINT16 */;
            this._writeUint8Array(utf8bytes, false);
        };
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
        ByteArray.prototype.writeUTFBytes = function (value) {
            this._writeUint8Array(this.encodeUTF8(value));
        };
        /**
         *
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.toString = function () {
            return "[ByteArray] length:" + this.length + ", bytesAvailable:" + this.bytesAvailable;
        };
        /**
         * @private
         * 将 Uint8Array 写入字节流
         * @param bytes 要写入的Uint8Array
         * @param validateBuffer
         */
        ByteArray.prototype._writeUint8Array = function (bytes, validateBuffer) {
            if (validateBuffer === void 0) { validateBuffer = true; }
            var pos = this._position;
            var npos = pos + bytes.length;
            if (validateBuffer) {
                this.validateBuffer(npos);
            }
            this.bytes.set(bytes, pos);
            this.position = npos;
        };
        /**
         * @param len
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         * @private
         */
        ByteArray.prototype.validate = function (len) {
            var bl = this._bytes.length;
            if (bl > 0 && this._position + len <= bl) {
                return true;
            }
            else {
                // egret.$error(1025);
            }
        };
        /**********************/
        /*  PRIVATE METHODS   */
        /**********************/
        /**
         * @private
         * @param len
         * @param needReplace
         */
        ByteArray.prototype.validateBuffer = function (len) {
            this.write_position = len > this.write_position ? len : this.write_position;
            len += this._position;
            this._validateBuffer(len);
        };
        /**
         * @private
         * UTF-8 Encoding/Decoding
         */
        ByteArray.prototype.encodeUTF8 = function (str) {
            var pos = 0;
            var codePoints = this.stringToCodePoints(str);
            var outputBytes = [];
            while (codePoints.length > pos) {
                var code_point = codePoints[pos++];
                if (this.inRange(code_point, 0xD800, 0xDFFF)) {
                    this.encoderError(code_point);
                }
                else if (this.inRange(code_point, 0x0000, 0x007f)) {
                    outputBytes.push(code_point);
                }
                else {
                    var count = void 0, offset = void 0;
                    if (this.inRange(code_point, 0x0080, 0x07FF)) {
                        count = 1;
                        offset = 0xC0;
                    }
                    else if (this.inRange(code_point, 0x0800, 0xFFFF)) {
                        count = 2;
                        offset = 0xE0;
                    }
                    else if (this.inRange(code_point, 0x10000, 0x10FFFF)) {
                        count = 3;
                        offset = 0xF0;
                    }
                    outputBytes.push(this.div(code_point, Math.pow(64, count)) + offset);
                    while (count > 0) {
                        var temp = this.div(code_point, Math.pow(64, count - 1));
                        outputBytes.push(0x80 + (temp % 64));
                        count -= 1;
                    }
                }
            }
            return new Uint8Array(outputBytes);
        };
        /**
         * @private
         *
         * @param data
         * @returns
         */
        ByteArray.prototype.decodeUTF8 = function (data) {
            var fatal = false;
            var pos = 0;
            var result = "";
            var code_point;
            var utf8_code_point = 0;
            var utf8_bytes_needed = 0;
            var utf8_bytes_seen = 0;
            var utf8_lower_boundary = 0;
            while (data.length > pos) {
                var _byte = data[pos++];
                if (_byte == this.EOF_byte) {
                    if (utf8_bytes_needed != 0) {
                        code_point = this.decoderError(fatal);
                    }
                    else {
                        code_point = this.EOF_code_point;
                    }
                }
                else {
                    if (utf8_bytes_needed == 0) {
                        if (this.inRange(_byte, 0x00, 0x7F)) {
                            code_point = _byte;
                        }
                        else {
                            if (this.inRange(_byte, 0xC2, 0xDF)) {
                                utf8_bytes_needed = 1;
                                utf8_lower_boundary = 0x80;
                                utf8_code_point = _byte - 0xC0;
                            }
                            else if (this.inRange(_byte, 0xE0, 0xEF)) {
                                utf8_bytes_needed = 2;
                                utf8_lower_boundary = 0x800;
                                utf8_code_point = _byte - 0xE0;
                            }
                            else if (this.inRange(_byte, 0xF0, 0xF4)) {
                                utf8_bytes_needed = 3;
                                utf8_lower_boundary = 0x10000;
                                utf8_code_point = _byte - 0xF0;
                            }
                            else {
                                this.decoderError(fatal);
                            }
                            utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
                            code_point = null;
                        }
                    }
                    else if (!this.inRange(_byte, 0x80, 0xBF)) {
                        utf8_code_point = 0;
                        utf8_bytes_needed = 0;
                        utf8_bytes_seen = 0;
                        utf8_lower_boundary = 0;
                        pos--;
                        code_point = this.decoderError(fatal, _byte);
                    }
                    else {
                        utf8_bytes_seen += 1;
                        utf8_code_point = utf8_code_point + (_byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);
                        if (utf8_bytes_seen !== utf8_bytes_needed) {
                            code_point = null;
                        }
                        else {
                            var cp = utf8_code_point;
                            var lower_boundary = utf8_lower_boundary;
                            utf8_code_point = 0;
                            utf8_bytes_needed = 0;
                            utf8_bytes_seen = 0;
                            utf8_lower_boundary = 0;
                            if (this.inRange(cp, lower_boundary, 0x10FFFF) && !this.inRange(cp, 0xD800, 0xDFFF)) {
                                code_point = cp;
                            }
                            else {
                                code_point = this.decoderError(fatal, _byte);
                            }
                        }
                    }
                }
                //Decode string
                if (code_point !== null && code_point !== this.EOF_code_point) {
                    if (code_point <= 0xFFFF) {
                        if (code_point > 0)
                            result += String.fromCharCode(code_point);
                    }
                    else {
                        code_point -= 0x10000;
                        result += String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff));
                        result += String.fromCharCode(0xDC00 + (code_point & 0x3ff));
                    }
                }
            }
            return result;
        };
        /**
         * @private
         *
         * @param code_point
         */
        ByteArray.prototype.encoderError = function (code_point) {
            // egret.$error(1026, code_point);
        };
        /**
         * @private
         *
         * @param fatal
         * @param opt_code_point
         * @returns
         */
        ByteArray.prototype.decoderError = function (fatal, opt_code_point) {
            if (fatal) {
                // egret.$error(1027);
            }
            return opt_code_point || 0xFFFD;
        };
        /**
         * @private
         *
         * @param a
         * @param min
         * @param max
         */
        ByteArray.prototype.inRange = function (a, min, max) {
            return min <= a && a <= max;
        };
        /**
         * @private
         *
         * @param n
         * @param d
         */
        ByteArray.prototype.div = function (n, d) {
            return Math.floor(n / d);
        };
        /**
         * @private
         *
         * @param string
         */
        ByteArray.prototype.stringToCodePoints = function (string) {
            /** @type {Array.<number>} */
            var cps = [];
            // Based on http://www.w3.org/TR/WebIDL/#idl-DOMString
            var i = 0, n = string.length;
            while (i < string.length) {
                var c = string.charCodeAt(i);
                if (!this.inRange(c, 0xD800, 0xDFFF)) {
                    cps.push(c);
                }
                else if (this.inRange(c, 0xDC00, 0xDFFF)) {
                    cps.push(0xFFFD);
                }
                else { // (inRange(c, 0xD800, 0xDBFF))
                    if (i == n - 1) {
                        cps.push(0xFFFD);
                    }
                    else {
                        var d = string.charCodeAt(i + 1);
                        if (this.inRange(d, 0xDC00, 0xDFFF)) {
                            var a = c & 0x3FF;
                            var b = d & 0x3FF;
                            i += 1;
                            cps.push(0x10000 + (a << 10) + b);
                        }
                        else {
                            cps.push(0xFFFD);
                        }
                    }
                }
                i += 1;
            }
            return cps;
        };
        /**
         * 替换缓冲区
         *
         * @param {ArrayBuffer} value
         */
        ByteArray.prototype.replaceBuffer = function (value) {
            this.write_position = value.byteLength;
            this._bytes = new Uint8Array(value);
            this.data = new DataView(value);
        };
        /**
         *
         * 读取指定长度的Buffer
         * @param {number} length       指定的长度
         * @returns {Buffer}
         */
        ByteArray.prototype.readBuffer = function (length) {
            if (!this.validate(length))
                return;
            var start = this.position;
            this.position += length;
            return this.buffer.slice(start, this.position);
        };
        ByteArray.prototype.readInt64 = function () {
            if (this.validate(8 /* SIZE_OF_INT64 */)) {
                var low = void 0, high = void 0;
                var flag = this.endian == Endian.LITTLE_ENDIAN;
                var data = this.data;
                var pos = this._position;
                if (flag) {
                    low = data.getUint32(pos, flag);
                    high = data.getUint32(pos + 4 /* SIZE_OF_UINT32 */, flag);
                }
                else {
                    high = data.getUint32(pos, flag);
                    low = data.getUint32(pos + 4 /* SIZE_OF_UINT32 */, flag);
                }
                this.position = pos + 8 /* SIZE_OF_INT64 */;
                return Int64.toNumber(low, high);
            }
        };
        ByteArray.prototype.writeInt64 = function (value) {
            this.validateBuffer(8 /* SIZE_OF_INT64 */);
            var i64 = Int64.fromNumber(value);
            var high = i64.high, low = i64.low;
            var flag = this.endian == Endian.LITTLE_ENDIAN;
            var data = this.data;
            var pos = this._position;
            if (flag) {
                data.setUint32(pos, low, flag);
                data.setUint32(pos + 4 /* SIZE_OF_UINT32 */, high, flag);
            }
            else {
                data.setUint32(pos, high, flag);
                data.setUint32(pos + 4 /* SIZE_OF_UINT32 */, low, flag);
            }
            this.position = pos + 8 /* SIZE_OF_INT64 */;
        };
        /**
         * 读取ProtoBuf的`Double`
         * protobuf封装是使用littleEndian的，不受Endian影响
         */
        ByteArray.prototype.readPBDouble = function () {
            if (this.validate(8 /* SIZE_OF_DOUBLE */)) {
                var value = this.data.getFloat64(this._position, true);
                this.position += 8 /* SIZE_OF_DOUBLE */;
                return value;
            }
        };
        /**
         * 写入ProtoBuf的`Double`
         * protobuf封装是使用littleEndian的，不受Endian影响
         * @param value
         */
        ByteArray.prototype.writePBDouble = function (value) {
            this.validateBuffer(8 /* SIZE_OF_DOUBLE */);
            this.data.setFloat64(this._position, value, true);
            this.position += 8 /* SIZE_OF_DOUBLE */;
        };
        /**
         * 读取ProtoBuf的`Float`
         * protobuf封装是使用littleEndian的，不受Endian影响
         */
        ByteArray.prototype.readPBFloat = function () {
            if (this.validate(4 /* SIZE_OF_FLOAT */)) {
                var value = this.data.getFloat32(this._position, true);
                this.position += 4 /* SIZE_OF_FLOAT */;
                return value;
            }
        };
        /**
          * 写入ProtoBuf的`Float`
          * protobuf封装是使用littleEndian的，不受Endian影响
          * @param value
          */
        ByteArray.prototype.writePBFloat = function (value) {
            this.validateBuffer(4 /* SIZE_OF_FLOAT */);
            this.data.setFloat32(this._position, value, true);
            this.position += 4 /* SIZE_OF_FLOAT */;
        };
        ByteArray.prototype.readFix32 = function () {
            if (this.validate(4 /* SIZE_OF_FIX32 */)) {
                var value = this.data.getUint32(this._position, true);
                this.position += 4 /* SIZE_OF_UINT32 */;
                return value;
            }
        };
        ByteArray.prototype.writeFix32 = function (value) {
            this.validateBuffer(4 /* SIZE_OF_FIX32 */);
            this.data.setUint32(this._position, value, true);
            this.position += 4 /* SIZE_OF_FIX32 */;
        };
        ByteArray.prototype.readSFix32 = function () {
            if (this.validate(4 /* SIZE_OF_SFIX32 */)) {
                var value = this.data.getInt32(this._position, true);
                this.position += 4 /* SIZE_OF_SFIX32 */;
                return value;
            }
        };
        ByteArray.prototype.writeSFix32 = function (value) {
            this.validateBuffer(4 /* SIZE_OF_SFIX32 */);
            this.data.setInt32(this._position, value, true);
            this.position += 4 /* SIZE_OF_SFIX32 */;
        };
        ByteArray.prototype.readFix64 = function () {
            if (this.validate(8 /* SIZE_OF_FIX64 */)) {
                var pos = this._position;
                var data = this.data;
                var low = data.getUint32(pos, true);
                var high = data.getUint32(pos + 4 /* SIZE_OF_UINT32 */, true);
                this.position = pos + 8 /* SIZE_OF_FIX64 */;
                return Int64.toNumber(low, high);
            }
        };
        ByteArray.prototype.writeFix64 = function (value) {
            var i64 = Int64.fromNumber(value);
            this.validateBuffer(8 /* SIZE_OF_FIX64 */);
            var pos = this._position;
            var data = this.data;
            data.setUint32(pos, i64.low, true);
            data.setUint32(pos + 4 /* SIZE_OF_UINT32 */, i64.high, true);
            this.position = pos + 8 /* SIZE_OF_FIX64 */;
        };
        /**
         *
         * 读取指定长度的ByteArray
         * @param {number} length       指定的长度
         * @param {number} [ext=0]      ByteArray扩展长度参数
         * @returns {ByteArray}
         */
        ByteArray.prototype.readByteArray = function (length, ext) {
            if (ext === void 0) { ext = 0; }
            var ba = new ByteArray(this.readBuffer(length), ext);
            ba.endian = this.endian;
            return ba;
        };
        /**
         * 向字节流中写入64位的可变长度的整数(Protobuf)
         */
        ByteArray.prototype.writeVarint64 = function (value) {
            var i64 = Int64.fromNumber(value);
            var high = i64.high;
            var low = i64.low;
            if (high == 0) {
                this.writeVarint(low);
            }
            else {
                for (var i = 0; i < 4; ++i) {
                    this.writeByte((low & 0x7F) | 0x80);
                    low >>>= 7;
                }
                if ((high & (0xFFFFFFF << 3)) == 0) {
                    this.writeByte((high << 4) | low);
                }
                else {
                    this.writeByte((((high << 4) | low) & 0x7F) | 0x80);
                    this.writeVarint(high >>> 3);
                }
            }
        };
        /**
         * 向字节流中写入32位的可变长度的整数(Protobuf)
         */
        ByteArray.prototype.writeVarint = function (value) {
            for (;;) {
                if (value < 0x80) {
                    this.writeByte(value);
                    return;
                }
                else {
                    this.writeByte((value & 0x7F) | 0x80);
                    value >>>= 7;
                }
            }
        };
        /**
         * 读取字节流中的32位变长整数(Protobuf)
         */
        ByteArray.prototype.readVarint = function () {
            var result = 0;
            for (var i = 0;; i += 7) {
                if (i < 32) {
                    var b = this.readUnsignedByte();
                    if (b >= 0x80) {
                        result |= ((b & 0x7f) << i);
                    }
                    else {
                        result |= (b << i);
                        break;
                    }
                }
                else {
                    while (this.readUnsignedByte() >= 0x80) { }
                    break;
                }
            }
            return result;
        };
        /**
          * 读取字节流中的32位变长整数(Protobuf)
          */
        ByteArray.prototype.readVarint64 = function () {
            var b, low, high, i = 0;
            for (;; i += 7) {
                b = this.readUnsignedByte();
                if (i == 28) {
                    break;
                }
                else {
                    if (b >= 0x80) {
                        low |= ((b & 0x7f) << i);
                    }
                    else {
                        low |= (b << i);
                        return Int64.toNumber(low, high);
                    }
                }
            }
            if (b >= 0x80) {
                b &= 0x7f;
                low |= (b << i);
                high = b >>> 4;
            }
            else {
                low |= (b << i);
                high = b >>> 4;
                return Int64.toNumber(low, high);
            }
            for (i = 3;; i += 7) {
                b = this.readUnsignedByte();
                if (i < 32) {
                    if (b >= 0x80) {
                        high |= ((b & 0x7f) << i);
                    }
                    else {
                        high |= (b << i);
                        break;
                    }
                }
            }
            return Int64.toNumber(low, high);
        };
        Object.defineProperty(ByteArray.prototype, "outBytes", {
            /**
             * 获取写入的字节
             * 此方法不会新建 ArrayBuffer
             * @readonly
             * @memberof ByteArray
             */
            get: function () {
                return new Uint8Array(this._bytes.buffer, 0, this.write_position);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 重置索引
         *
         * @memberof ByteArray
         */
        ByteArray.prototype.reset = function () {
            this.write_position = this.position = 0;
        };
        return ByteArray;
    }());
    rf.ByteArray = ByteArray;
    /**
     * 项目中不使用long类型，此值暂时只用于存储Protobuff中的int64 sint64
     * @author
     *
     */
    var Int64 = /** @class */ (function () {
        function Int64(low, high) {
            this.low = low | 0;
            this.high = high | 0;
        }
        Int64.prototype.toNumber = function () {
            return this.high * _2_32 + (this.low >>> 0);
        };
        Int64.toNumber = function (low, high) {
            return (high | 0) * _2_32 + (low >>> 0);
        };
        Int64.fromNumber = function (value) {
            if (isNaN(value) || !isFinite(value)) {
                return ZERO;
            }
            if (value <= -_2_63) {
                return MIN_VALUE;
            }
            if (value + 1 >= _2_63) {
                return MAX_VALUE;
            }
            if (value < 0) {
                var v = Int64.fromNumber(-value);
                if (v.high === MIN_VALUE.high && v.low === MIN_VALUE.low) {
                    return MIN_VALUE;
                }
                v.low = ~v.low;
                v.high = ~v.high;
                return v.add(ONE);
            }
            else {
                return new Int64((value % _2_32) | 0, (value / _2_32) | 0);
            }
        };
        Int64.prototype.add = function (addend) {
            var a48 = this.high >>> 16;
            var a32 = this.high & 0xFFFF;
            var a16 = this.low >>> 16;
            var a00 = this.low & 0xFFFF;
            var b48 = addend.high >>> 16;
            var b32 = addend.high & 0xFFFF;
            var b16 = addend.low >>> 16;
            var b00 = addend.low & 0xFFFF;
            var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
            c00 += a00 + b00;
            c16 += c00 >>> 16;
            c00 &= 0xFFFF;
            c16 += a16 + b16;
            c32 += c16 >>> 16;
            c16 &= 0xFFFF;
            c32 += a32 + b32;
            c48 += c32 >>> 16;
            c32 &= 0xFFFF;
            c48 += a48 + b48;
            c48 &= 0xFFFF;
            return new Int64((c16 << 16) | c00, (c48 << 16) | c32);
        };
        return Int64;
    }());
    rf.Int64 = Int64;
    /**
     * 2的16次方
     */
    var _2_16 = 1 << 16;
    /**
     * 2的32次方
     */
    var _2_32 = _2_16 * _2_16;
    /**
     * 2的64次方
     */
    var _2_64 = _2_32 * _2_32;
    /**
     * 2的63次方
     */
    var _2_63 = _2_64 / 2;
    var ZERO = new Int64();
    var MAX_VALUE = new Int64(-1, 0x7FFFFFFF);
    var MIN_VALUE = new Int64(0, -2147483648);
    var ONE = new Int64(1);
})(rf || (rf = {}));
///<reference path="./CONFIG.ts" />
///<reference path="./Geom.ts" />
var rf;
(function (rf) {
    var BitmapData = /** @class */ (function () {
        //private _imageData:ImageData;
        function BitmapData(width, height, transparent, fillColor) {
            if (transparent === void 0) { transparent = true; }
            if (fillColor === void 0) { fillColor = 0xFFFFFFFF; }
            this._transparent = transparent;
            var canvas = this.canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            this.context = this.canvas.getContext("2d");
            this._rect = { x: 0, y: 0, width: width, height: height };
            if (!transparent)
                this.fillRect(0, 0, width, height, rf.hexToCSS(fillColor, 1));
        }
        BitmapData.fromImageElement = function (img) {
            var bmd = new BitmapData(img.width, img.height, true);
            bmd.context.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
            return bmd;
        };
        Object.defineProperty(BitmapData.prototype, "width", {
            get: function () {
                return this.canvas.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BitmapData.prototype, "height", {
            get: function () {
                return this.canvas.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BitmapData.prototype, "imageData", {
            get: function () {
                return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BitmapData.prototype, "rect", {
            get: function () {
                return this._rect;
            },
            enumerable: true,
            configurable: true
        });
        BitmapData.prototype.copyPixels = function (sourceBitmapData, sourceRect, destPoint) {
            if (sourceBitmapData instanceof BitmapData)
                this.context.drawImage(sourceBitmapData.canvas, sourceRect.x, sourceRect.y, sourceRect.w, sourceRect.h, destPoint.x, destPoint.y, sourceRect.w, sourceRect.h);
            else {
                this.context.drawImage(sourceBitmapData, sourceRect.x, sourceRect.y, sourceRect.w, sourceRect.h, destPoint.x, destPoint.y, sourceRect.w, sourceRect.h);
            }
        };
        BitmapData.prototype.draw = function (source /*,matrix:Matrix = null*/) {
            if (source instanceof BitmapData)
                this.context.drawImage(source.canvas, 0, 0);
            else
                this.context.drawImage(source, 0, 0);
        };
        /**
         * rgbaCSS:string = "rgba(r,g,b,a)" rgba ∈ (0 ~ 255)
         */
        BitmapData.prototype.fillRect = function (x, y, width, height, css) {
            this.context.fillStyle = css;
            this.context.fillRect(x, y, width, height);
        };
        return BitmapData;
    }());
    rf.BitmapData = BitmapData;
    var MaxRectsBinPack = /** @class */ (function () {
        function MaxRectsBinPack(width, height, rotations) {
            if (rotations === void 0) { rotations = false; }
            this.binWidth = 0;
            this.binHeight = 0;
            this.allowRotations = false;
            this.usedRects = [];
            this.freeRects = [];
            this.score1 = 0; // Unused in this function. We don't need to know the score after finding the position.
            this.score2 = 0;
            this.binWidth = width;
            this.binHeight = height;
            this.allowRotations = rotations;
            var n = new rf.Rect();
            n.x = 0;
            n.y = 0;
            n.w = width;
            n.h = height;
            this.usedRects.length = 0;
            this.freeRects.length = 0;
            this.freeRects.push(n);
        }
        MaxRectsBinPack.prototype.count = function (n) {
            if (n >= 2)
                return this.count(n / 2);
            return n;
        };
        /**
         * 插入一个矩形
         * @param width
         * @param height
         * @param method
         * @return 插入的位置
         *
         */
        MaxRectsBinPack.prototype.insert = function (width, height, method) {
            if (method === void 0) { method = 0; }
            var newNode = new rf.Rect();
            this.score1 = 0;
            this.score2 = 0;
            switch (method) {
                case MaxRectsBinPack.BESTSHORTSIDEFIT:
                    newNode = this.findPositionForNewNodeBestShortSideFit(width, height);
                    break;
                case MaxRectsBinPack.BOTTOMLEFTRULE:
                    newNode = this.findPositionForNewNodeBottomLeft(width, height, this.score1, this.score2);
                    break;
                case MaxRectsBinPack.CONTACTPOINTRULE:
                    newNode = this.findPositionForNewNodeContactPoint(width, height, this.score1);
                    break;
                case MaxRectsBinPack.BESTLONGSIDEFIT:
                    newNode = this.findPositionForNewNodeBestLongSideFit(width, height, this.score2, this.score1);
                    break;
                case MaxRectsBinPack.BESTAREAFIT:
                    newNode = this.findPositionForNewNodeBestAreaFit(width, height, this.score1, this.score2);
                    break;
            }
            if (newNode.h == 0)
                return newNode;
            this.placeRect(newNode);
            return newNode;
        };
        MaxRectsBinPack.prototype.insert2 = function (Rects, dst, method) {
            dst.length = 0;
            while (Rects.length > 0) {
                var bestScore1 = Infinity;
                var bestScore2 = Infinity;
                var bestRectIndex = -1;
                var bestNode = new rf.Rect();
                for (var i = 0; i < Rects.length; ++i) {
                    var score1 = 0;
                    var score2 = 0;
                    var newNode = this.scoreRect(Rects[i].w, Rects[i].h, method, score1, score2);
                    if (score1 < bestScore1 || (score1 == bestScore1 && score2 < bestScore2)) {
                        bestScore1 = score1;
                        bestScore2 = score2;
                        bestNode = newNode;
                        bestRectIndex = i;
                    }
                }
                if (bestRectIndex == -1)
                    return;
                this.placeRect(bestNode);
                Rects.splice(bestRectIndex, 1);
            }
        };
        MaxRectsBinPack.prototype.placeRect = function (node) {
            var numRectsToProcess = this.freeRects.length;
            for (var i = 0; i < numRectsToProcess; i++) {
                if (this.splitFreeNode(this.freeRects[i], node)) {
                    this.freeRects.splice(i, 1);
                    --i;
                    --numRectsToProcess;
                }
            }
            this.
                //去重
                pruneFreeList();
            this.usedRects.push(node);
        };
        MaxRectsBinPack.prototype.scoreRect = function (width, height, method, score1, score2) {
            var newNode = new rf.Rect();
            score1 = Infinity;
            score2 = Infinity;
            switch (method) {
                case MaxRectsBinPack.BESTSHORTSIDEFIT:
                    newNode = this.findPositionForNewNodeBestShortSideFit(width, height);
                    break;
                case MaxRectsBinPack.BOTTOMLEFTRULE:
                    newNode = this.findPositionForNewNodeBottomLeft(width, height, score1, score2);
                    break;
                case MaxRectsBinPack.CONTACTPOINTRULE:
                    newNode = this.findPositionForNewNodeContactPoint(width, height, score1);
                    // todo: reverse
                    score1 = -score1; // Reverse since we are minimizing, but for contact point score bigger is better.
                    break;
                case MaxRectsBinPack.BESTLONGSIDEFIT:
                    newNode = this.findPositionForNewNodeBestLongSideFit(width, height, score2, score1);
                    break;
                case MaxRectsBinPack.BESTAREAFIT:
                    newNode = this.findPositionForNewNodeBestAreaFit(width, height, score1, score2);
                    break;
            }
            // Cannot fit the current Rect.
            if (newNode.h == 0) {
                score1 = Infinity;
                score2 = Infinity;
            }
            return newNode;
        };
        /// Computes the ratio of used surface area.
        MaxRectsBinPack.prototype.occupancy = function () {
            var usedSurfaceArea = 0;
            for (var i = 0; i < this.usedRects.length; i++)
                usedSurfaceArea += this.usedRects[i].w * this.usedRects[i].h;
            return usedSurfaceArea / (this.binWidth * this.binHeight);
        };
        MaxRectsBinPack.prototype.findPositionForNewNodeBottomLeft = function (width, height, bestY, bestX) {
            var bestNode = new rf.Rect();
            //memset(bestNode, 0, sizeof(Rect));
            bestY = Infinity;
            var rect;
            var topSideY;
            for (var i = 0; i < this.freeRects.length; i++) {
                rect = this.freeRects[i];
                // Try to place the Rect in upright (non-flipped) orientation.
                if (rect.w >= width && rect.h >= height) {
                    topSideY = rect.y + height;
                    if (topSideY < bestY || (topSideY == bestY && rect.x < bestX)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.w = width;
                        bestNode.h = height;
                        bestY = topSideY;
                        bestX = rect.x;
                    }
                }
                if (this.allowRotations && rect.w >= height && rect.h >= width) {
                    topSideY = rect.y + width;
                    if (topSideY < bestY || (topSideY == bestY && rect.x < bestX)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.w = height;
                        bestNode.h = width;
                        bestY = topSideY;
                        bestX = rect.x;
                    }
                }
            }
            return bestNode;
        };
        MaxRectsBinPack.prototype.findPositionForNewNodeBestShortSideFit = function (width, height) {
            var bestNode = new rf.Rect();
            this.
                //memset(&bestNode, 0, sizeof(Rect));
                bestShortSideFit = Infinity;
            this.bestLongSideFit = this.score2;
            var rect;
            var leftoverHoriz;
            var leftoverVert;
            var shortSideFit;
            var longSideFit;
            for (var i = 0; i < this.freeRects.length; i++) {
                rect = this.freeRects[i];
                // Try to place the Rect in upright (non-flipped) orientation.
                if (rect.w >= width && rect.h >= height) {
                    leftoverHoriz = Math.abs(rect.w - width);
                    leftoverVert = Math.abs(rect.h - height);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    longSideFit = Math.max(leftoverHoriz, leftoverVert);
                    if (shortSideFit < this.bestShortSideFit || (shortSideFit == this.bestShortSideFit && longSideFit < this.bestLongSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.w = width;
                        bestNode.h = height;
                        this.bestShortSideFit = shortSideFit;
                        this.bestLongSideFit = longSideFit;
                    }
                }
                var flippedLeftoverHoriz;
                var flippedLeftoverVert;
                var flippedShortSideFit;
                var flippedLongSideFit;
                if (this.allowRotations && rect.w >= height && rect.h >= width) {
                    flippedLeftoverHoriz = Math.abs(rect.w - height);
                    flippedLeftoverVert = Math.abs(rect.h - width);
                    flippedShortSideFit = Math.min(flippedLeftoverHoriz, flippedLeftoverVert);
                    flippedLongSideFit = Math.max(flippedLeftoverHoriz, flippedLeftoverVert);
                    if (flippedShortSideFit < this.bestShortSideFit || (flippedShortSideFit == this.bestShortSideFit && flippedLongSideFit < this.bestLongSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.w = height;
                        bestNode.h = width;
                        this.bestShortSideFit = flippedShortSideFit;
                        this.bestLongSideFit = flippedLongSideFit;
                    }
                }
            }
            return bestNode;
        };
        MaxRectsBinPack.prototype.findPositionForNewNodeBestLongSideFit = function (width, height, bestShortSideFit, bestLongSideFit) {
            var bestNode = new rf.Rect();
            //memset(&bestNode, 0, sizeof(Rect));
            bestLongSideFit = Infinity;
            var rect;
            var leftoverHoriz;
            var leftoverVert;
            var shortSideFit;
            var longSideFit;
            for (var i = 0; i < this.freeRects.length; i++) {
                rect = this.freeRects[i];
                // Try to place the Rect in upright (non-flipped) orientation.
                if (rect.w >= width && rect.h >= height) {
                    leftoverHoriz = Math.abs(rect.w - width);
                    leftoverVert = Math.abs(rect.h - height);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    longSideFit = Math.max(leftoverHoriz, leftoverVert);
                    if (longSideFit < bestLongSideFit || (longSideFit == bestLongSideFit && shortSideFit < bestShortSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.w = width;
                        bestNode.h = height;
                        bestShortSideFit = shortSideFit;
                        bestLongSideFit = longSideFit;
                    }
                }
                if (this.allowRotations && rect.w >= height && rect.h >= width) {
                    leftoverHoriz = Math.abs(rect.w - height);
                    leftoverVert = Math.abs(rect.h - width);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    longSideFit = Math.max(leftoverHoriz, leftoverVert);
                    if (longSideFit < bestLongSideFit || (longSideFit == bestLongSideFit && shortSideFit < bestShortSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.w = height;
                        bestNode.h = width;
                        bestShortSideFit = shortSideFit;
                        bestLongSideFit = longSideFit;
                    }
                }
            }
            return bestNode;
        };
        MaxRectsBinPack.prototype.findPositionForNewNodeBestAreaFit = function (width, height, bestAreaFit, bestShortSideFit) {
            var bestNode = new rf.Rect();
            //memset(&bestNode, 0, sizeof(Rect));
            bestAreaFit = Infinity;
            var rect;
            var leftoverHoriz;
            var leftoverVert;
            var shortSideFit;
            var areaFit;
            for (var i = 0; i < this.freeRects.length; i++) {
                rect = this.freeRects[i];
                areaFit = rect.w * rect.h - width * height;
                // Try to place the Rect in upright (non-flipped) orientation.
                if (rect.w >= width && rect.h >= height) {
                    leftoverHoriz = Math.abs(rect.w - width);
                    leftoverVert = Math.abs(rect.h - height);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    if (areaFit < bestAreaFit || (areaFit == bestAreaFit && shortSideFit < bestShortSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.w = width;
                        bestNode.h = height;
                        bestShortSideFit = shortSideFit;
                        bestAreaFit = areaFit;
                    }
                }
                if (this.allowRotations && rect.w >= height && rect.h >= width) {
                    leftoverHoriz = Math.abs(rect.w - height);
                    leftoverVert = Math.abs(rect.h - width);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    if (areaFit < bestAreaFit || (areaFit == bestAreaFit && shortSideFit < bestShortSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.w = height;
                        bestNode.h = width;
                        bestShortSideFit = shortSideFit;
                        bestAreaFit = areaFit;
                    }
                }
            }
            return bestNode;
        };
        /// Returns 0 if the two intervals i1 and i2 are disjoint, or the length of their overlap otherwise.
        MaxRectsBinPack.prototype.commonIntervalLength = function (i1start, i1end, i2start, i2end) {
            if (i1end < i2start || i2end < i1start)
                return 0;
            return Math.min(i1end, i2end) - Math.max(i1start, i2start);
        };
        MaxRectsBinPack.prototype.contactPointScoreNode = function (x, y, width, height) {
            var score = 0;
            if (x == 0 || x + width == this.binWidth)
                score += height;
            if (y == 0 || y + height == this.binHeight)
                score += width;
            var rect;
            for (var i = 0; i < this.usedRects.length; i++) {
                rect = this.usedRects[i];
                if (rect.x == x + width || rect.x + rect.w == x)
                    score += this.commonIntervalLength(rect.y, rect.y + rect.h, y, y + height);
                if (rect.y == y + height || rect.y + rect.h == y)
                    score += this.commonIntervalLength(rect.x, rect.x + rect.w, x, x + width);
            }
            return score;
        };
        MaxRectsBinPack.prototype.findPositionForNewNodeContactPoint = function (width, height, bestContactScore) {
            var bestNode = new rf.Rect();
            //memset(&bestNode, 0, sizeof(Rect));
            bestContactScore = -1;
            var rect;
            var score;
            for (var i = 0; i < this.freeRects.length; i++) {
                rect = this.freeRects[i];
                // Try to place the Rect in upright (non-flipped) orientation.
                if (rect.w >= width && rect.h >= height) {
                    score = this.contactPointScoreNode(rect.x, rect.y, width, height);
                    if (score > bestContactScore) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.w = width;
                        bestNode.h = height;
                        bestContactScore = score;
                    }
                }
                if (this.allowRotations && rect.w >= height && rect.h >= width) {
                    score = this.contactPointScoreNode(rect.x, rect.y, height, width);
                    if (score > bestContactScore) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.w = height;
                        bestNode.h = width;
                        bestContactScore = score;
                    }
                }
            }
            return bestNode;
        };
        MaxRectsBinPack.prototype.splitFreeNode = function (freeNode, usedNode) {
            // Test with SAT if the Rects even intersect.
            if (usedNode.x >= freeNode.x + freeNode.w || usedNode.x + usedNode.w <= freeNode.x ||
                usedNode.y >= freeNode.y + freeNode.h || usedNode.y + usedNode.h <= freeNode.y)
                return false;
            var newNode;
            if (usedNode.x < freeNode.x + freeNode.w && usedNode.x + usedNode.w > freeNode.x) {
                // New node at the top side of the used node.
                if (usedNode.y > freeNode.y && usedNode.y < freeNode.y + freeNode.h) {
                    newNode = freeNode.clone();
                    newNode.h = usedNode.y - newNode.y;
                    this.freeRects.push(newNode);
                }
                // New node at the bottom side of the used node.
                if (usedNode.y + usedNode.h < freeNode.y + freeNode.h) {
                    newNode = freeNode.clone();
                    newNode.y = usedNode.y + usedNode.h;
                    newNode.h = freeNode.y + freeNode.h - (usedNode.y + usedNode.h);
                    this.freeRects.push(newNode);
                }
            }
            if (usedNode.y < freeNode.y + freeNode.h && usedNode.y + usedNode.h > freeNode.y) {
                // New node at the left side of the used node.
                if (usedNode.x > freeNode.x && usedNode.x < freeNode.x + freeNode.w) {
                    newNode = freeNode.clone();
                    newNode.w = usedNode.x - newNode.x;
                    this.freeRects.push(newNode);
                }
                // New node at the right side of the used node.
                if (usedNode.x + usedNode.w < freeNode.x + freeNode.w) {
                    newNode = freeNode.clone();
                    newNode.x = usedNode.x + usedNode.w;
                    newNode.w = freeNode.x + freeNode.w - (usedNode.x + usedNode.w);
                    this.freeRects.push(newNode);
                }
            }
            return true;
        };
        MaxRectsBinPack.prototype.pruneFreeList = function () {
            for (var i = 0; i < this.freeRects.length; i++)
                for (var j = i + 1; j < this.freeRects.length; j++) {
                    if (this.isContainedIn(this.freeRects[i], this.freeRects[j])) {
                        this.freeRects.splice(i, 1);
                        break;
                    }
                    if (this.isContainedIn(this.freeRects[j], this.freeRects[i])) {
                        this.freeRects.splice(j, 1);
                    }
                }
        };
        MaxRectsBinPack.prototype.isContainedIn = function (a, b) {
            return a.x >= b.x && a.y >= b.y
                && a.x + a.w <= b.x + b.w
                && a.y + a.h <= b.y + b.h;
        };
        MaxRectsBinPack.BESTSHORTSIDEFIT = 0; ///< -BSSF: Positions the Rectangle against the short side of a free Rectangle into which it fits the best.
        MaxRectsBinPack.BESTLONGSIDEFIT = 1; ///< -BLSF: Positions the Rectangle against the long side of a free Rectangle into which it fits the best.
        MaxRectsBinPack.BESTAREAFIT = 2; ///< -BAF: Positions the Rectangle into the smallest free Rectangle into which it fits.
        MaxRectsBinPack.BOTTOMLEFTRULE = 3; ///< -BL: Does the Tetris placement.
        MaxRectsBinPack.CONTACTPOINTRULE = 4; ///< -CP: Choosest the placement where the Rectangle touches other Rectangles as much as possible.
        return MaxRectsBinPack;
    }());
    rf.MaxRectsBinPack = MaxRectsBinPack;
})(rf || (rf = {}));
///<reference path="./CONFIG.ts" />
var rf;
(function (rf) {
    /**
     *
     * 调整ClassFactory
     * @export
     * @class ClassFactory
     * @template T
     */
    var ClassFactory = /** @class */ (function () {
        /**
         * @param {Creator<T>} creator
         * @param {Partial<T>} [props] 属性模板
         * @memberof ClassFactory
         */
        function ClassFactory(creator, props) {
            this._creator = creator;
            if (props != undefined)
                this._props = props;
        }
        /**
         * 获取实例
         *
         * @returns
         */
        ClassFactory.prototype.get = function () {
            var ins = new this._creator();
            var p = this._props;
            for (var key in p) {
                ins[key] = p[key];
            }
            return ins;
        };
        return ClassFactory;
    }());
    rf.ClassFactory = ClassFactory;
    /**
     * 回收池
     * @author 3tion
     *
     */
    var RecyclablePool = /** @class */ (function () {
        function RecyclablePool(TCreator, max) {
            if (max === void 0) { max = 100; }
            this._pool = [];
            this._max = max;
            this._creator = TCreator;
        }
        RecyclablePool.prototype.get = function () {
            var ins;
            var pool = this._pool;
            if (pool.length) {
                ins = pool.pop();
            }
            else {
                ins = new this._creator();
            }
            if (typeof ins.onSpawn === "function") {
                ins.onSpawn();
            }
            if (DEBUG) {
                ins._insid = _recid++;
            }
            return ins;
        };
        /**
         * 回收
         */
        RecyclablePool.prototype.recycle = function (t) {
            var pool = this._pool;
            var idx = pool.indexOf(t);
            if (!~idx) { //不在池中才进行回收
                if (typeof t.onRecycle === "function") {
                    t.onRecycle();
                }
                if (pool.length < this._max) {
                    pool.push(t);
                }
            }
        };
        return RecyclablePool;
    }());
    rf.RecyclablePool = RecyclablePool;
    if (DEBUG) {
        var _recid = 0;
    }
    function recyclable(clazz, addInstanceRecycle) {
        var pool;
        if (clazz.hasOwnProperty("_pool")) {
            pool = clazz._pool;
        }
        if (!pool) {
            if (addInstanceRecycle) {
                pool = new RecyclablePool(function () {
                    var ins = new clazz();
                    ins.recycle = recycle;
                    return ins;
                });
            }
            else {
                pool = new RecyclablePool(clazz);
                var pt = clazz.prototype;
                if (pt.recycle == undefined) {
                    pt.recycle = recycle;
                }
            }
            Object.defineProperty(clazz, "_pool", {
                value: pool
            });
        }
        return pool.get();
        function recycle() {
            pool.recycle(this);
        }
    }
    rf.recyclable = recyclable;
    /**
     * 单例工具
     * @param clazz 要做单例的类型
     */
    function singleton(clazz) {
        var instance;
        if (clazz.hasOwnProperty("_instance")) {
            instance = clazz._instance;
        }
        if (!instance) {
            instance = new clazz;
            Object.defineProperty(clazz, "_instance", {
                value: instance
            });
        }
        return instance;
    }
    rf.singleton = singleton;
})(rf || (rf = {}));
/// <reference path="./ClassUtils.ts" />
var rf;
(function (rf) {
    var LinkVO = /** @class */ (function () {
        function LinkVO() {
            this.close = true;
            this.data = undefined;
            this.args = undefined;
            this.next = undefined;
            this.pre = undefined;
            this.weight = 0;
        }
        LinkVO.prototype.onRecycle = function () {
            this.data = undefined;
            this.args = undefined;
            this.next = undefined;
            this.pre = undefined;
            this.weight = 0;
            this.close = true;
        };
        LinkVO.prototype.onSpawn = function () {
            this.close = false;
        };
        return LinkVO;
    }());
    rf.LinkVO = LinkVO;
    var Link = /** @class */ (function () {
        function Link() {
            this.last = undefined;
            this.first = undefined;
            this.id = undefined;
            this.length = 0;
            this.warningMax = 200;
            this.checkSameData = true;
        }
        Link.prototype.getFrist = function () {
            if (undefined == this.first)
                return undefined;
            var vo = this.first;
            while (vo) {
                if (false == vo.close) {
                    return vo;
                }
                vo = vo.next;
            }
            return undefined;
        };
        Link.prototype.getLast = function () {
            if (undefined == this.last)
                return undefined;
            var vo = this.last;
            while (vo) {
                if (false == vo.close) {
                    return vo;
                }
                vo = vo.pre;
            }
            return undefined;
        };
        Link.prototype.getValueLink = function (value) {
            var vo = this.getFrist();
            if (undefined == vo)
                return undefined;
            while (vo) {
                if (false == vo.close) {
                    if (value == vo.data) {
                        return vo;
                    }
                }
                vo = vo.next;
            }
            return undefined;
        };
        Link.prototype.add = function (value, args) {
            if (!value)
                return undefined;
            var vo;
            if (this.checkSameData) {
                vo = this.getValueLink(value);
                if (vo && vo.close == false)
                    return vo;
            }
            vo = rf.recyclable(LinkVO);
            vo.data = value;
            vo.args = args;
            this.length++;
            if (undefined == this.first) {
                this.first = this.last = vo;
            }
            else {
                vo.pre = this.last;
                this.last.next = vo;
                this.last = vo;
            }
            return vo;
        };
        Link.prototype.addByWeight = function (value, weight, args) {
            if (!value)
                return undefined;
            var vo;
            if (this.checkSameData) {
                vo = this.getValueLink(value);
                if (vo && vo.close == false) {
                    if (weight == vo.weight) {
                        return vo;
                    }
                    vo.close = true;
                }
            }
            vo = rf.recyclable(LinkVO);
            vo.weight = weight;
            vo.data = value;
            vo.args = args;
            this.length++;
            if (undefined == this.first) {
                this.first = this.last = vo;
            }
            else {
                var tempvo = this.getFrist();
                if (undefined == tempvo) {
                    vo.pre = this.last;
                    this.last.next = vo;
                    this.last = vo;
                }
                else {
                    while (tempvo) {
                        if (false == tempvo.close) {
                            if (tempvo.weight < weight) {
                                vo.next = tempvo;
                                vo.pre = tempvo.pre;
                                if (undefined != tempvo.pre) {
                                    tempvo.pre.next = vo;
                                }
                                tempvo.pre = vo;
                                if (tempvo == this.first) {
                                    this.first = vo;
                                }
                                break;
                            }
                        }
                        tempvo = tempvo.next;
                    }
                    if (undefined == tempvo) {
                        vo.pre = this.last;
                        this.last.next = vo;
                        this.last = vo;
                    }
                }
            }
            return vo;
        };
        Link.prototype.remove = function (value) {
            var vo = this.getValueLink(value);
            if (!vo)
                return;
            this.removeLink(vo);
        };
        Link.prototype.removeLink = function (vo) {
            this.length--;
            vo.close = true;
            vo.data = null;
            rf.TimerUtil.add(this.clean, 1000);
        };
        Link.prototype.clean = function () {
            var vo = this.first;
            var next;
            this.length = 0;
            while (vo) {
                next = vo.next;
                if (true == vo.close) {
                    if (vo == this.first) {
                        this.first = vo.next;
                        if (undefined != this.first) {
                            this.first.pre = undefined;
                        }
                    }
                    else {
                        vo.pre.next = vo.next;
                    }
                    if (vo == this.last) {
                        this.last = vo.pre;
                        if (undefined != this.last) {
                            this.last.next = undefined;
                        }
                    }
                    else {
                        vo.next.pre = vo.pre;
                    }
                    vo.recycle();
                }
                else {
                    this.length++;
                }
                vo = next;
            }
        };
        Link.prototype.pop = function () {
            var vo = this.getLast();
            if (vo) {
                var data = vo.data;
                this.removeLink(vo);
                return data;
            }
            return undefined;
        };
        Link.prototype.shift = function () {
            var vo = this.getFrist();
            if (vo) {
                var data = vo.data;
                this.removeLink(vo);
                return data;
            }
            return undefined;
        };
        Link.prototype.exec = function (f) {
            if (undefined == f)
                return;
            var vo = this.getFrist();
            while (vo) {
                var next = vo.next;
                if (false == vo.close) {
                    f(vo.data);
                }
                vo = vo.next;
            }
        };
        Link.prototype.onRecycle = function () {
            var vo = this.first;
            var next;
            while (vo) {
                next = vo.next;
                vo.recycle();
                vo = next;
            }
            this.first = this.last = undefined;
            this.length = 0;
            this.checkSameData = true;
        };
        Link.prototype.toString = function () {
            var vo = this.getFrist();
            var s = "list:";
            while (vo) {
                var next = vo.next;
                if (false == vo.close) {
                    s += vo.data + ",";
                }
                vo = vo.next;
            }
            return s;
        };
        return Link;
    }());
    rf.Link = Link;
})(rf || (rf = {}));
///<reference path="../core/ClassUtils.ts" />
var rf;
(function (rf) {
    var MouseEventData = /** @class */ (function () {
        function MouseEventData(id) {
            this.id = id;
        }
        MouseEventData.prototype.onRecycle = function () {
            this.ctrl = this.shift = this.alt = false;
            this.wheel = this.dx = this.dy = this.x = this.y = this.id = 0;
        };
        return MouseEventData;
    }());
    rf.MouseEventData = MouseEventData;
    var EventX = /** @class */ (function () {
        function EventX(type, data, bubbles) {
            this.type = undefined;
            this.type = type;
            this.data = data;
            this.bubbles = bubbles;
        }
        EventX.prototype.onRecycle = function () {
            this.data = undefined;
            this.type = undefined;
            this.target = undefined;
            this.currentTarget = undefined;
            this.bubbles = false;
            this.stopPropagation = false;
            this.stopImmediatePropagation = false;
        };
        return EventX;
    }());
    rf.EventX = EventX;
    /**
     *
     * @author crl
     *
     */
    var MiniDispatcher = /** @class */ (function () {
        /** Creates an EventDispatcher. */
        function MiniDispatcher(target) {
            if (target === void 0) { target = null; }
            this.addEventListener = this.on;
            this.removeEventListener = this.off;
            this.hasEventListener = this.has;
            if (target == null) {
                target = this;
            }
            this.mTarget = target;
        }
        /** Registers an event listener at a certain object. */
        MiniDispatcher.prototype.on = function (type, listener, thisObject, priority) {
            if (priority === void 0) { priority = 0; }
            if (undefined == this.mEventListeners) {
                this.mEventListeners = {};
            }
            var signal = this.mEventListeners[type];
            if (signal == null) {
                signal = this.mEventListeners[type] = rf.recyclable(rf.Link);
            }
            signal.addByWeight(listener, priority, thisObject);
        };
        /** Removes an event listener from the object. */
        MiniDispatcher.prototype.off = function (type, listener) {
            if (undefined != this.mEventListeners) {
                var signal = this.mEventListeners[type];
                if (undefined == signal)
                    return;
                signal.remove(listener);
                if (0 >= signal.length) {
                    signal.recycle();
                    this.mEventListeners[type] = undefined;
                }
            }
        };
        /** Removes all event listeners with a certain type, or all of them if type is null.
         *  Be careful when removing all event listeners: you never know who else was listening. */
        MiniDispatcher.prototype.removeEventListeners = function (type) {
            if (type === void 0) { type = undefined; }
            var signal;
            if (type && this.mEventListeners) {
                signal = this.mEventListeners[type];
                if (undefined != signal) {
                    signal.recycle();
                    this.mEventListeners[type] = undefined;
                }
                delete this.mEventListeners[type];
            }
            else if (this.mEventListeners) {
                for (type in this.mEventListeners) {
                    signal = this.mEventListeners[type];
                    if (undefined != signal) {
                        signal.recycle();
                        this.mEventListeners[type] = undefined;
                    }
                }
                this.mEventListeners = undefined;
            }
        };
        /** Dispatches an event to all objects that have registered listeners for its type.
         *  If an event with enabled 'bubble' property is dispatched to a display object, it will
         *  travel up along the line of parents, until it either hits the root object or someone
         *  stops its propagation manually. */
        MiniDispatcher.prototype.dispatchEvent = function (event) {
            if (undefined == this.mEventListeners || undefined == this.mEventListeners[event.type]) {
                return false;
            }
            event.currentTarget = this.mTarget;
            var signal = this.mEventListeners[event.type];
            var vo = signal.getFrist();
            while (vo) {
                if (event.stopPropagation || event.stopImmediatePropagation) {
                    break;
                }
                if (false == vo.close) {
                    var f = vo.data;
                    if (undefined != f) {
                        f.call(vo.args, event);
                        // f(vo.args,event);
                    }
                }
                vo = vo.next;
            }
            return false == event.stopPropagation;
        };
        MiniDispatcher.prototype.simpleDispatch = function (type, data, bubbles) {
            if (data === void 0) { data = undefined; }
            if (bubbles === void 0) { bubbles = false; }
            if (!bubbles && (undefined == this.mEventListeners || undefined == this.mEventListeners[type])) {
                return false;
            }
            var event = rf.recyclable(EventX);
            event.type = type;
            event.data = data;
            event.bubbles = bubbles;
            event.target = this.mTarget;
            var bool = this.dispatchEvent(event);
            event.recycle();
            return bool;
        };
        /** Returns if there are listeners registered for a certain event type. */
        MiniDispatcher.prototype.has = function (type) {
            if (undefined == this.mEventListeners) {
                return false;
            }
            var signal = this.mEventListeners[type];
            if (undefined == signal || 0 >= signal.length) {
                return false;
            }
            return true;
        };
        MiniDispatcher.prototype.onRecycle = function () {
            this.removeEventListeners();
        };
        return MiniDispatcher;
    }());
    rf.MiniDispatcher = MiniDispatcher;
})(rf || (rf = {}));
/// <reference path="./ClassUtils.ts" />
/// <reference path="./Link.ts" />
/// <reference path="./MiniDispatcher.ts" />
var rf;
(function (rf) {
    var EngineEvent = /** @class */ (function () {
        function EngineEvent() {
        }
        EngineEvent.VISIBILITY_CHANGE = 'visibility_change';
        EngineEvent.FPS_CHANGE = 'FPS_CHANGE';
        return EngineEvent;
    }());
    rf.EngineEvent = EngineEvent;
    function newTimeMixer(now, speed) {
        if (now === void 0) { now = 0; }
        if (speed === void 0) { speed = 1; }
        return { now: now, speed: speed };
    }
    rf.newTimeMixer = newTimeMixer;
    function tm_add(t, interval) {
        t.interval = interval * t.speed;
        t.now += t.interval;
        return t.now;
    }
    rf.tm_add = tm_add;
    rf.nativeMouseX = 0;
    rf.nativeMouseY = 0;
    rf.nextUpdateTime = 0;
    rf.frameInterval = 0;
    //当前程序运行了多长时间
    rf.engineNow = 0;
    rf.serverTime = 0;
    var _sharedDate = new Date();
    var _utcOffset = -_sharedDate.getTimezoneOffset() * 60000 /* ONE_MINUTE */;
    function getUTCTime(time) {
        return time + _utcOffset;
    }
    rf.getUTCTime = getUTCTime;
    function getFormatTime(time, format, isRaw) {
        if (isRaw === void 0) { isRaw = true; }
        if (isRaw) {
            time = this.getUTCTime(time);
        }
        _sharedDate.setTime(time);
        return _sharedDate.format(format);
    }
    rf.getFormatTime = getFormatTime;
    rf.getT = window.performance ? performance.now.bind(performance) : Date.now;
    rf.defaultTimeMixer = newTimeMixer(0.0, 1.0);
    // export let engie_animation_request:Function = undefined;
    var Engine = /** @class */ (function () {
        function Engine() {
        }
        Engine.start = function () {
            Engine.startTime = rf.getT();
            rf.engineNow = 0;
            Engine.frameRate = Engine._frameRate;
            rf.nextUpdateTime = Engine.startTime + rf.frameInterval;
            Engine._nextProfileTime = Engine.startTime + 1000;
            //动画ENTER_FRAME;
            var animationRequest = window['requestAnimationFrame'] ||
                window['webkitRequestAnimationFrame'] ||
                window['mozRequestAnimationFrame'] ||
                window['oRequestAnimationFrame'] ||
                window['msRequestAnimationFrame'];
            function onAnimationChange() {
                animationRequest(onAnimationChange);
                var time = rf.getT();
                if (time < rf.nextUpdateTime) {
                    return;
                }
                var now = time - Engine.startTime;
                var interval = (Engine.interval = now - rf.engineNow);
                rf.defaultTimeMixer.now = now;
                rf.defaultTimeMixer.interval = interval;
                rf.nextUpdateTime += rf.frameInterval;
                rf.engineNow = now;
                Engine.update(now, interval);
                Engine.profile();
            }
            animationRequest(onAnimationChange);
            //resize
            window.onresize = function () {
                rf.isWindowResized = true;
            };
            rf.stageWidth = window.innerWidth * rf.pixelRatio;
            rf.stageHeight = window.innerHeight * rf.pixelRatio;
            //窗口最大化最小化监听
            var hidden, state, visibilityChange;
            if (typeof document['hidden'] !== 'undefined') {
                hidden = 'hidden';
                visibilityChange = 'visibilitychange';
                state = 'visibilityState';
            }
            else if (typeof document['mozHidden'] !== 'undefined') {
                hidden = 'mozHidden';
                visibilityChange = 'mozvisibilitychange';
                state = 'mozVisibilityState';
            }
            else if (typeof document['msHidden'] !== 'undefined') {
                hidden = 'msHidden';
                visibilityChange = 'msvisibilitychange';
                state = 'msVisibilityState';
            }
            else if (typeof document['webkitHidden'] !== 'undefined') {
                hidden = 'webkitHidden';
                visibilityChange = 'webkitvisibilitychange';
                state = 'webkitVisibilityState';
            }
            document.addEventListener(visibilityChange, function () {
                var stateDesc = document[state];
                var hidden = stateDesc.toLocaleLowerCase().indexOf('hidden') != -1;
                Engine.hidden = hidden;
                if (hidden) {
                    Engine.hiddenTime = Date.now();
                }
                else {
                    if (0 != Engine.hiddenTime) {
                        var delayTime = Date.now() - Engine.hiddenTime;
                        Engine.startTime += delayTime;
                        Engine._nextProfileTime += delayTime;
                        rf.nextUpdateTime += delayTime;
                        Engine.hiddenTime = 0;
                    }
                }
                rf.ROOT.simpleDispatch(EngineEvent.VISIBILITY_CHANGE, hidden);
            }, false);
        };
        Engine.addResize = function (value) {
            Engine.resizeLink.add(value);
            value.resize(rf.stageWidth, rf.stageHeight);
        };
        Engine.removeResize = function (value) {
            Engine.resizeLink.remove(value);
        };
        Engine.resize = function (width, height) {
            //todo other
            var vo = Engine.resizeLink.getFrist();
            while (vo) {
                var next = vo.next;
                if (false == vo.close) {
                    var value = vo.data;
                    value.resize(width, height);
                }
                vo = next;
            }
            rf.ROOT.simpleDispatch(2 /* RESIZE */);
        };
        Engine.addTick = function (tick) {
            Engine.ticklink.add(tick);
        };
        Engine.removeTick = function (tick) {
            Engine.ticklink.remove(tick);
        };
        Engine.update = function (now, interval) {
            if (rf.isWindowResized) {
                rf.isWindowResized = false;
                rf.stageWidth = window.innerWidth * rf.pixelRatio;
                rf.stageHeight = window.innerHeight * rf.pixelRatio;
                Engine.resize(rf.stageWidth, rf.stageHeight);
            }
            var vo = Engine.ticklink.getFrist();
            while (vo) {
                var next = vo.next;
                if (false == vo.close) {
                    var tick = vo.data;
                    tick.update(now, interval);
                }
                vo = next;
            }
            rf.ROOT.simpleDispatch(1 /* ENTER_FRAME */);
        };
        Object.defineProperty(Engine, "frameRate", {
            get: function () {
                return Engine._frameRate;
            },
            set: function (value) {
                Engine._frameRate = value;
                rf.frameInterval = 1000 / value;
            },
            enumerable: true,
            configurable: true
        });
        Engine.profile = function () {
            var now = rf.getT();
            Engine._fpsCount++;
            Engine._codeTime += now - Engine.startTime - rf.engineNow;
            if (now > Engine._nextProfileTime) {
                Engine._nextProfileTime += 1000;
                Engine.fps = Engine._fpsCount;
                Engine.code = Engine._codeTime;
                Engine._fpsCount = 0;
                Engine._codeTime = 0;
                rf.ROOT.simpleDispatch(EngineEvent.FPS_CHANGE);
            }
        };
        //当前程序开始时间
        Engine.startTime = 0;
        //上一帧到本帧间隔时间
        Engine.interval = 0;
        //窗口是否最小化
        Engine.hidden = false;
        //窗口最小化开始时间
        Engine.hiddenTime = 0;
        //一秒内刷新次数
        Engine.fps = 0;
        //一秒内执行代码使用时间
        Engine.code = 0;
        Engine.ticklink = new rf.Link();
        Engine.resizeLink = new rf.Link();
        Engine._frameRate = 60;
        Engine._nextProfileTime = 0;
        Engine._fpsCount = 0;
        Engine._codeTime = 0;
        return Engine;
    }());
    rf.Engine = Engine;
    function getTimer() {
        return Date.now() - Engine.startTime;
    }
    rf.getTimer = getTimer;
    var TimerEventX = /** @class */ (function (_super) {
        __extends(TimerEventX, _super);
        function TimerEventX() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TimerEventX.TIMER = 'timer';
        TimerEventX.TIMER_COMPLETE = 'timerComplete';
        return TimerEventX;
    }(rf.EventX));
    rf.TimerEventX = TimerEventX;
    var Timer = /** @class */ (function (_super) {
        __extends(Timer, _super);
        function Timer(delay, repeatCount) {
            if (repeatCount === void 0) { repeatCount = 0; }
            var _this = _super.call(this) || this;
            _this._delay = 0;
            _this.currnetTime = 0;
            _this.repeatCount = 0;
            _this.running = false;
            _this.delay = delay;
            _this.repeatCount = repeatCount;
            return _this;
        }
        Object.defineProperty(Timer.prototype, "delay", {
            get: function () {
                return this._delay;
            },
            set: function (value) {
                if (value < 1) {
                    value = 1;
                }
                if (this._delay == value) {
                    return;
                }
                this._delay = value;
            },
            enumerable: true,
            configurable: true
        });
        Timer.prototype.start = function () {
            this.currnetTime = 0;
            Engine.addTick(this);
        };
        Timer.prototype.stop = function () {
            Engine.removeTick(this);
            this.currnetTime = 0;
            this._delay = 0;
            this.repeatCount = 0;
        };
        Timer.prototype.update = function (now, interval) {
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
        };
        return Timer;
    }(rf.MiniDispatcher));
    rf.Timer = Timer;
    var GTimer = /** @class */ (function () {
        function GTimer(delay) {
            this.link = new rf.Link();
            this.timer = new Timer(delay);
            this.timer.addEventListener(TimerEventX.TIMER, this.timerHandler, this);
        }
        GTimer.prototype.timerHandler = function (event) {
            var vo = this.link.getFrist();
            while (vo) {
                var next = vo.next;
                if (false == vo.close) {
                    var func = vo.data;
                    if (undefined != vo.args) {
                        func(vo.args);
                    }
                    else {
                        func();
                    }
                }
                vo = next;
            }
        };
        GTimer.prototype.add = function (func, args) {
            var vo = this.link.add(func, args);
            this.timer.start();
            return vo;
        };
        GTimer.prototype.remove = function (func) {
            this.link.remove(func);
            if (!this.link.length) {
                this.timer.stop();
            }
        };
        return GTimer;
    }());
    rf.GTimer = GTimer;
    var GTimerCallLater = /** @class */ (function (_super) {
        __extends(GTimerCallLater, _super);
        function GTimerCallLater() {
            return _super.call(this, 10) || this;
            //this.link.checkSameData = false;
        }
        GTimerCallLater.prototype.later = function (f, time, args) {
            if (undefined == f) {
                return;
            }
            _super.prototype.add.call(this, f, args).weight = rf.engineNow + time;
        };
        GTimerCallLater.prototype.add = function (func, args) {
            return undefined;
        };
        GTimerCallLater.prototype.timerHandler = function (event) {
            var now = rf.engineNow;
            var vo = this.link.getFrist();
            while (vo) {
                var next = vo.next;
                if (false == vo.close) {
                    if (now > vo.weight) {
                        var func = vo.data;
                        func.apply(this, vo.args);
                        vo.close = true;
                    }
                }
                vo = next;
            }
        };
        return GTimerCallLater;
    }(GTimer));
    var TimerUtil = /** @class */ (function () {
        function TimerUtil() {
        }
        TimerUtil.getTimer = function (time) {
            var gtimer = TimerUtil.timeobj[time];
            if (undefined == gtimer) {
                TimerUtil.timeobj[time] = gtimer = new GTimer(time);
            }
            return gtimer;
        };
        TimerUtil.add = function (f, time) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            TimerUtil.later.later(f, time, args);
        };
        TimerUtil.remove = function (f) {
            TimerUtil.later.remove(f);
        };
        TimerUtil.timeobj = {};
        TimerUtil.time250 = TimerUtil.getTimer(250);
        TimerUtil.time500 = TimerUtil.getTimer(500);
        TimerUtil.time1000 = TimerUtil.getTimer(1000);
        TimerUtil.time3000 = TimerUtil.getTimer(3000);
        TimerUtil.time4000 = TimerUtil.getTimer(4000);
        TimerUtil.time5000 = TimerUtil.getTimer(5000);
        TimerUtil.later = new GTimerCallLater();
        return TimerUtil;
    }());
    rf.TimerUtil = TimerUtil;
})(rf || (rf = {}));
var rf;
(function (rf) {
    /**
     * HTTP 请求类
     */
    var HttpRequest = /** @class */ (function (_super) {
        __extends(HttpRequest, _super);
        function HttpRequest() {
            return _super.call(this) || this;
        }
        Object.defineProperty(HttpRequest.prototype, "response", {
            get: function () {
                if (!this._xhr) {
                    return undefined;
                }
                if (this._xhr.response != undefined) {
                    return this._xhr.response;
                }
                if (this._responseType == 0 /* TEXT */) {
                    return this._xhr.responseText;
                }
                if (this._responseType == 1 /* ARRAY_BUFFER */ && /msie 9.0/i.test(navigator.userAgent)) {
                    var w = window;
                    return w["convertResponseBodyToText"](this._xhr["responseBody"]);
                }
                // if (this._responseType == "document") {
                //     return this._xhr.responseXML;
                // }
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HttpRequest.prototype, "responseType", {
            get: function () {
                return this._responseType;
            },
            set: function (value) {
                this._responseType = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HttpRequest.prototype, "withCredentials", {
            get: function () {
                return this._withCredentials;
            },
            /**
             * 表明在进行跨站(cross-site)的访问控制(Access-Control)请求时，是否使用认证信息(例如cookie或授权的header)。(这个标志不会影响同站的请求)
             */
            set: function (value) {
                this._withCredentials = value;
            },
            enumerable: true,
            configurable: true
        });
        HttpRequest.prototype.setRequestHeader = function (header, value) {
            if (!this.headerObj) {
                this.headerObj = {};
            }
            this.headerObj[header] = value;
        };
        HttpRequest.prototype.getResponseHeader = function (header) {
            if (!this._xhr) {
                return undefined;
            }
            var result = this._xhr.getResponseHeader(header);
            return result ? result : "";
        };
        HttpRequest.prototype.getAllResponseHeaders = function () {
            if (!this._xhr) {
                return undefined;
            }
            var result = this._xhr.getAllResponseHeaders();
            return result ? result : "";
        };
        HttpRequest.prototype.open = function (url, method) {
            if (method === void 0) { method = 0 /* GET */; }
            this._url = url;
            this._method = method;
            if (this._xhr) {
                this._xhr.abort();
                this._xhr = undefined;
            }
            this._xhr = this.getXHR();
            this._xhr.onreadystatechange = this.onReadyStateChange.bind(this);
            this._xhr.onprogress = this.updateProgress.bind(this);
            this._xhr.open(this._method == 1 /* POST */ ? "POST" : "GET", this._url, true);
        };
        HttpRequest.prototype.getXHR = function () {
            if (window["XMLHttpRequest"]) {
                return new window["XMLHttpRequest"]();
            }
            return new window["ActiveXObject"]("MSXML2.XMLHTTP");
        };
        HttpRequest.prototype.onReadyStateChange = function () {
            var _this = this;
            var xhr = this._xhr;
            if (xhr.readyState == 4) {
                var ioError_1 = (xhr.status >= 400 || xhr.status == 0);
                var url_1 = this._url;
                setTimeout(function () {
                    if (ioError_1) {
                        if (true && !_this.hasEventListener(16 /* IO_ERROR */)) {
                            rf.ThrowError("http request error: " + url_1);
                        }
                        _this.simpleDispatch(16 /* IO_ERROR */);
                    }
                    else {
                        _this.simpleDispatch(4 /* COMPLETE */);
                    }
                }, 0);
            }
        };
        HttpRequest.prototype.updateProgress = function (event) {
            if (event.lengthComputable) {
                this.simpleDispatch(15 /* PROGRESS */, [event.loaded, event.total]);
            }
        };
        HttpRequest.prototype.send = function (data) {
            if (this._responseType != undefined) {
                this._xhr.responseType = this._responseType == 0 /* TEXT */ ? "text" : "arraybuffer";
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
        };
        HttpRequest.prototype.abort = function () {
            if (this._xhr) {
                this._xhr.abort();
            }
        };
        return HttpRequest;
    }(rf.MiniDispatcher));
    rf.HttpRequest = HttpRequest;
    /**
     * 图片加载类
     */
    var ImageLoader = /** @class */ (function (_super) {
        __extends(ImageLoader, _super);
        function ImageLoader() {
            return _super.call(this) || this;
        }
        Object.defineProperty(ImageLoader, "crossOrigin", {
            get: function () {
                return this._crossOrigin;
            },
            /**
             * 当从其他站点加载一个图片时，指定是否启用跨域资源共享(CORS)，默认值为null。
             * 可以设置为"anonymous","use-credentials"或null,设置为其他值将等同于"anonymous"。
             */
            set: function (value) {
                this._crossOrigin = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageLoader.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageLoader.prototype, "crossOrigin", {
            get: function () {
                return this._crossOrigin;
            },
            set: function (value) {
                this._hasCrossOriginSet = true;
                this._crossOrigin = value;
            },
            enumerable: true,
            configurable: true
        });
        ImageLoader.prototype.load = function (url) {
            var image = document.createElement("img");
            image.crossOrigin = "Anonymous";
            this._data = undefined;
            this._currentImage = image;
            if (this._hasCrossOriginSet) {
                if (this._crossOrigin) {
                    image.crossOrigin = this._crossOrigin;
                }
            }
            else {
                if (ImageLoader.crossOrigin) {
                    image.crossOrigin = ImageLoader.crossOrigin;
                }
            }
            image.onload = this.onImageComplete.bind(this);
            image.onerror = this.onLoadError.bind(this);
            image.src = url;
        };
        ImageLoader.prototype.onImageComplete = function (event) {
            var _this = this;
            var image = this.getImage(event);
            if (!image) {
                return;
            }
            this._data = image;
            setTimeout(function () {
                _this.simpleDispatch(4 /* COMPLETE */);
            }, 0);
        };
        ImageLoader.prototype.onLoadError = function () {
            var image = this.getImage(event);
            if (!image) {
                return;
            }
            this.simpleDispatch(16 /* IO_ERROR */, image.src);
        };
        ImageLoader.prototype.getImage = function (event) {
            var image = event.target;
            image.onerror = undefined;
            image.onload = undefined;
            if (this._currentImage !== image) {
                return undefined;
            }
            this._currentImage = undefined;
            return image;
        };
        return ImageLoader;
    }(rf.MiniDispatcher));
    rf.ImageLoader = ImageLoader;
    /**
     * Socket 连接
     */
    var Socket = /** @class */ (function (_super) {
        __extends(Socket, _super);
        function Socket(host, port) {
            var _this = _super.call(this) || this;
            _this._connected = false;
            _this._addInputPosition = 0;
            _this.endian = true;
            /**
             * 不再缓存服务端发来的数据
             */
            _this.disableInput = false;
            if (host && port > 0 && port < 65535) {
                _this.connect(host, port);
            }
            return _this;
        }
        Object.defineProperty(Socket.prototype, "connected", {
            get: function () {
                return this._connected;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Socket.prototype, "input", {
            /**
             * 输入流，服务端发送的数据
             */
            get: function () {
                return this._input;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Socket.prototype, "output", {
            /**
             * 输出流，要发送给服务端的数据
             */
            get: function () {
                return this._output;
            },
            enumerable: true,
            configurable: true
        });
        Socket.prototype.connect = function (host, port) {
            var url = "ws://" + host + ":" + port;
            if (window.location.protocol == "https:") {
                url = "wss://" + host + ":" + port;
            }
            this.connectByUrl(url);
        };
        Socket.prototype.connectByUrl = function (url) {
            var _this = this;
            if (this._webSocket != null) {
                this.close();
            }
            this._webSocket && this.cleanSocket();
            this._webSocket = new WebSocket(url);
            this._webSocket.binaryType = "arraybuffer";
            this._input = new rf.ByteArray();
            this._input.endian = this.endian;
            this._output = new rf.ByteArray();
            this._output.endian = this.endian;
            this._addInputPosition = 0;
            this._webSocket.onopen = function (e) {
                _this.onOpen(e);
            };
            this._webSocket.onmessage = function (msg) {
                _this.onMessage(msg);
            };
            this._webSocket.onclose = function (e) {
                _this.onClose(e);
            };
            this._webSocket.onerror = function (e) {
                _this.onError(e);
            };
        };
        Socket.prototype.cleanSocket = function () {
            try {
                this._webSocket.close();
            }
            catch (e) {
            }
            this._connected = false;
            this._webSocket.onopen = null;
            this._webSocket.onmessage = null;
            this._webSocket.onclose = null;
            this._webSocket.onerror = null;
            this._webSocket = null;
        };
        Socket.prototype.onOpen = function (e) {
            this._connected = true;
            this.simpleDispatch(9 /* OPEN */, e);
        };
        Socket.prototype.onMessage = function (msg) {
            if (!msg || !msg.data) {
                return;
            }
            var data = msg.data;
            // 不缓存接收的数据则直接抛出数据
            if (this.disableInput && data) {
                this.simpleDispatch(17 /* MESSAGE */, data);
                return;
            }
            // 如果输入流全部被读取完毕则清空
            if (this._input.length > 0 && this._input.bytesAvailable < 1) {
                this._input.clear();
                this._addInputPosition = 0;
            }
            ;
            // 获取当前的指针位置
            var pre = this._input.position;
            if (!this._addInputPosition) {
                this._addInputPosition = 0;
            }
            // 指向添加数据的指针位置
            this._input.position = this._addInputPosition;
            if (data) {
                // 添加数据
                if ((typeof data == "string")) {
                    this._input.writeUTFBytes(data);
                }
                else {
                    this._input._writeUint8Array(new Uint8Array(data));
                }
                // 记录下一次添加数据的指针位置
                this._addInputPosition = this._input.position;
                // 还原到当前的指针位置
                this._input.position = pre;
            }
            this.simpleDispatch(17 /* MESSAGE */, data);
        };
        Socket.prototype.onClose = function (e) {
            this._connected = false;
            this.simpleDispatch(10 /* CLOSE */, e);
        };
        Socket.prototype.onError = function (e) {
            this.simpleDispatch(14 /* ERROR */, e);
        };
        /**
         * 发送数据到服务器
         * @param data 需要发送的数据 可以是String或者ArrayBuffer
         */
        Socket.prototype.send = function (data) {
            this._webSocket.send(data);
        };
        Socket.prototype.flush = function () {
            if (this._output && this._output.length > 0) {
                var evt;
                try {
                    this._webSocket && this._webSocket.send(this._output.buffer);
                }
                catch (e) {
                    evt = e;
                }
                this._output.endian = this.endian;
                this._output.clear();
                if (evt) {
                    this.simpleDispatch(14 /* ERROR */, evt);
                }
            }
        };
        Socket.prototype.close = function () {
            if (this._webSocket != undefined) {
                try {
                    this._webSocket.close();
                }
                catch (e) {
                }
            }
        };
        return Socket;
    }(rf.MiniDispatcher));
    rf.Socket = Socket;
})(rf || (rf = {}));
var rf;
(function (rf) {
    /**
         * 同一时刻最大可以同时启动的下载线程数
         */
    rf.res_max_loader = 5;
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
    function loadRes(url, complete, thisObj, type, priority, cache, noDispose, disposeTime) {
        if (type === void 0) { type = 0 /* bin */; }
        if (priority === void 0) { priority = 0 /* low */; }
        if (cache === void 0) { cache = true; }
        if (noDispose === void 0) { noDispose = false; }
        if (disposeTime === void 0) { disposeTime = 30000; }
        return Res.instance.load(url, complete, thisObj, type, priority, cache, noDispose, disposeTime);
    }
    rf.loadRes = loadRes;
    function removeLoad(url, complete) {
    }
    rf.removeLoad = removeLoad;
    /**
     * 资源加载管理类
     */
    var Res = /** @class */ (function () {
        // private _loadingMap: { [k: string]: ResItem };
        function Res() {
            // maxLoader: number = 5;
            this.nowLoader = 0;
            this._analyzerMap = {};
            this._analyzerMap[1 /* text */] = ResTextLoader;
            this._analyzerMap[0 /* bin */] = ResBinLoader;
            this._analyzerMap[2 /* sound */] = ResSoundLoader;
            this._analyzerMap[3 /* image */] = ResImageLoader;
            this.resMap = {};
            this.link = new rf.Link();
            // this._loadMap = {};
            // this._resMap = {};
            // this._loadingMap = {};
            // 资源释放机制
            // setInterval(this.clearRes.bind(this), 10 * 1000);
        }
        Object.defineProperty(Res, "instance", {
            get: function () {
                return this._instance || (this._instance = new Res());
            },
            enumerable: true,
            configurable: true
        });
        Res.prototype.removeLoad = function (url, complete) {
            var resMap = this.resMap;
            var item = resMap[url];
            if (undefined == item) {
                return;
            }
            var completes = item.complete;
            if (undefined == completes) {
                return;
            }
            var len = completes.length;
            var i = -1;
            for (i = 0; i < len; i++) {
                var o = completes[i];
                if (o.complete == complete) {
                    break;
                }
            }
            if (-1 != i) {
                completes.splice(i, 1);
            }
        };
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
        Res.prototype.load = function (url, complete, thisObj, type, priority, cache, noDispose, disposeTime) {
            if (type === void 0) { type = 0 /* bin */; }
            if (priority === void 0) { priority = 0 /* low */; }
            if (cache === void 0) { cache = true; }
            if (noDispose === void 0) { noDispose = false; }
            if (disposeTime === void 0) { disposeTime = 30000; }
            var resMap = this.resMap;
            var item = resMap[url];
            if (undefined == item) {
                //没创建
                var item_1 = rf.recyclable(ResItem);
                item_1.type = type;
                item_1.name = url;
                item_1.complete = [{ thisObj: thisObj, complete: complete }];
                item_1.states = 0 /* WAIT */;
                //添加进加载列表
                this.link.addByWeight(item_1, priority);
                //开始加载
                this.loadNext();
            }
            else if (undefined != item.complete) {
                //正在加载中
                item.complete.push({ thisObj: thisObj, complete: complete });
            }
            else if (undefined != item.data) {
                //加载完成了
                setTimeout(function () {
                    var event = rf.recyclable(rf.EventX);
                    event.type = 4 /* COMPLETE */;
                    event.data = item;
                    complete.call(thisObj, event);
                    event.recycle();
                }, 0);
            }
            else {
                //加载完成 但是404了
                setTimeout(function () {
                    var event = rf.recyclable(rf.EventX);
                    event.type = 3 /* FAILED */;
                    event.data = item;
                    complete.call(thisObj, event);
                    event.recycle();
                }, 0);
            }
            return item;
        };
        Res.prototype.loadNext = function () {
            var _a = this, nowLoader = _a.nowLoader, link = _a.link;
            var maxLoader = rf.res_max_loader;
            if (nowLoader >= maxLoader) {
                return;
            }
            while (nowLoader < maxLoader && link.length) {
                var item = link.shift();
                if (undefined == item) {
                    //全部没有了
                    break;
                }
                this.doLoad(item);
            }
        };
        Res.prototype.doLoad = function (item) {
            this.nowLoader++;
            item.states = 1 /* LOADING */;
            var loader = rf.recyclable(this._analyzerMap[item.type]);
            loader.loadFile(item, this.doLoadComplete, this);
        };
        Res.prototype.doLoadComplete = function (loader, event) {
            this.nowLoader--;
            loader.recycle();
            var item = event.data;
            item.preUseTime = rf.engineNow;
            item.states = event.data ? 2 /* COMPLETE */ : 3 /* FAILED */;
            item.complete.forEach(function (v, i) {
                if (v) {
                    v.complete.call(v.thisObj, event);
                }
            });
            item.complete = undefined;
            this.loadNext();
        };
        Res.prototype.gc = function (now) {
            var resMap = this.resMap;
            for (var url in resMap) {
                var item = resMap[url];
                if (!item.noDispose && undefined == item.complete) {
                    if (item.disposeTime < now - item.preUseTime) {
                        resMap[url] = undefined;
                    }
                }
            }
        };
        return Res;
    }());
    rf.Res = Res;
    /**
     * 资源数据
     */
    var ResItem = /** @class */ (function () {
        function ResItem() {
            this.states = 0;
        }
        ResItem.prototype.onRecycle = function () {
            this.name = this.complete = this.data = undefined;
            this.preUseTime = this.disposeTime = this.states = 0;
            this.noDispose = false;
        };
        return ResItem;
    }());
    rf.ResItem = ResItem;
    /**
     * 加载基类
     */
    var ResLoaderBase = /** @class */ (function () {
        function ResLoaderBase() {
        }
        ResLoaderBase.prototype.loadFile = function (resItem, compFunc, thisObject) {
            this._resItem = resItem;
            this._compFunc = compFunc;
            this._thisObject = thisObject;
        };
        return ResLoaderBase;
    }());
    rf.ResLoaderBase = ResLoaderBase;
    /**
     * 二进制加载
     */
    var ResBinLoader = /** @class */ (function (_super) {
        __extends(ResBinLoader, _super);
        function ResBinLoader() {
            var _this = _super.call(this) || this;
            var http = new rf.HttpRequest();
            _this._httpRequest = http;
            http.responseType = _this.getType();
            http.addEventListener(4 /* COMPLETE */, _this.onComplete, _this);
            http.addEventListener(16 /* IO_ERROR */, _this.onIOError, _this);
            return _this;
        }
        ResBinLoader.prototype.getType = function () {
            return 1 /* ARRAY_BUFFER */;
        };
        ResBinLoader.prototype.loadFile = function (resItem, compFunc, thisObject) {
            _super.prototype.loadFile.call(this, resItem, compFunc, thisObject);
            var http = this._httpRequest;
            http.abort();
            http.open(resItem.name, 0 /* GET */);
            http.send();
        };
        ResBinLoader.prototype.onComplete = function (event) {
            var _a = this, _resItem = _a._resItem, _compFunc = _a._compFunc, _thisObject = _a._thisObject, _httpRequest = _a._httpRequest;
            _resItem.data = _httpRequest.response;
            event.data = _resItem;
            this._resItem = this._compFunc = this._thisObject = undefined;
            if (undefined != _compFunc) {
                _compFunc.call(_thisObject, this, event);
            }
        };
        ResBinLoader.prototype.onIOError = function (event) {
            var _a = this, _resItem = _a._resItem, _compFunc = _a._compFunc, _thisObject = _a._thisObject, _httpRequest = _a._httpRequest;
            event.data = _resItem;
            this._resItem = this._compFunc = this._thisObject = undefined;
            if (_compFunc) {
                _compFunc.call(_thisObject, this, event);
            }
        };
        return ResBinLoader;
    }(ResLoaderBase));
    rf.ResBinLoader = ResBinLoader;
    /**
     * 文本加载
     */
    var ResTextLoader = /** @class */ (function (_super) {
        __extends(ResTextLoader, _super);
        function ResTextLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ResTextLoader.prototype.getType = function () {
            return 0 /* TEXT */;
        };
        ResTextLoader.prototype.onComplete = function (event) {
            var _a = this, _resItem = _a._resItem, _compFunc = _a._compFunc, _thisObject = _a._thisObject, _httpRequest = _a._httpRequest;
            _resItem.data = _httpRequest.response;
            event.data = _resItem;
            this._resItem = this._compFunc = this._thisObject = undefined;
            if (_compFunc) {
                _compFunc.call(_thisObject, this, event);
            }
        };
        return ResTextLoader;
    }(ResBinLoader));
    rf.ResTextLoader = ResTextLoader;
    /**
     * 音乐加载
     */
    var ResSoundLoader = /** @class */ (function (_super) {
        __extends(ResSoundLoader, _super);
        function ResSoundLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ResSoundLoader.prototype.onComplete = function (event) {
            var data = this._httpRequest.response;
            // TODO : 解码数据为 Sound 对象
            var sound;
            this._resItem.data = sound;
            event.data = this._resItem;
            var compFunc = this._compFunc;
            var thisObject = this._thisObject;
            this._resItem = this._compFunc = this._thisObject = undefined;
            if (compFunc) {
                compFunc.call(thisObject, this, event);
            }
        };
        return ResSoundLoader;
    }(ResBinLoader));
    rf.ResSoundLoader = ResSoundLoader;
    /**
     * 图片加载
     */
    var ResImageLoader = /** @class */ (function (_super) {
        __extends(ResImageLoader, _super);
        function ResImageLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ResImageLoader.prototype.loadFile = function (resItem, compFunc, thisObject) {
            var _this = this;
            var imageLoader = new rf.ImageLoader();
            imageLoader.addEventListener(4 /* COMPLETE */, function (e) {
                if (compFunc) {
                    resItem.data = imageLoader.data;
                    e.data = resItem;
                    compFunc.call(thisObject, _this, e);
                }
            }, this);
            imageLoader.addEventListener(16 /* IO_ERROR */, function (e) {
                if (compFunc) {
                    e.data = resItem;
                    compFunc.call(thisObject, _this, e);
                }
            }, this);
            imageLoader.load(resItem.name);
        };
        return ResImageLoader;
    }(ResLoaderBase));
    rf.ResImageLoader = ResImageLoader;
    var LoadTask = /** @class */ (function (_super) {
        __extends(LoadTask, _super);
        function LoadTask() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.queue = {};
            _this.total = 0;
            _this.progress = 0;
            return _this;
        }
        LoadTask.prototype.addBin = function (url) {
            var res = loadRes(url, this.complteHandler, this, 0 /* bin */);
            this.queue[url] = res;
            this.total++;
            return res;
        };
        LoadTask.prototype.addTxt = function (url) {
            var res = loadRes(url, this.complteHandler, this, 1 /* text */);
            this.queue[url] = res;
            this.total++;
            return res;
        };
        LoadTask.prototype.addImage = function (url) {
            var res = loadRes(url, this.complteHandler, this, 3 /* image */);
            this.queue[url] = res;
            this.total++;
            return res;
        };
        LoadTask.prototype.addTask = function (item) {
            this.queue[item.name] = item;
            this.total++;
            item.on(4 /* COMPLETE */, this.complteHandler, this);
        };
        LoadTask.prototype.complteHandler = function (event) {
            var item = event.data;
            if (item instanceof rf.MiniDispatcher) {
                item.off(4 /* COMPLETE */, this.complteHandler);
            }
            var queue = this.queue;
            var completeCount = 0;
            var totalCount = 0;
            for (var key in queue) {
                var item_2 = queue[key];
                if (item_2.states >= 2 /* COMPLETE */) {
                    completeCount++;
                }
                totalCount++;
            }
            this.progress = completeCount;
            this.total = totalCount;
            this.simpleDispatch(15 /* PROGRESS */, this);
            if (completeCount == totalCount) {
                this.simpleDispatch(4 /* COMPLETE */, this);
            }
        };
        LoadTask.prototype.onRecycle = function () {
            this.queue = {};
            this.progress = this.total = 0;
        };
        return LoadTask;
    }(rf.MiniDispatcher));
    rf.LoadTask = LoadTask;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var C = /** @class */ (function () {
        function C() {
        }
        C.prototype.init = function () {
            this.platform = navigator.platform;
            this.userAgent = navigator.userAgent;
            var g = rf.gl;
            this.supportWebGL = undefined != g;
            if (!this.supportWebGL) {
                return;
            }
            this.glVersion = g.getParameter(g.VERSION);
            this.shadingLanguageVersion = g.getParameter(g.SHADING_LANGUAGE_VERSION);
            this.vendor = g.getParameter(g.VENDOR);
            this.renderer = g.getParameter(g.RENDERER);
            var dbgRenderInfo = g.getExtension("WEBGL_debug_renderer_info");
            if (dbgRenderInfo != undefined) {
                this.unMaskedVendor = g.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL);
                this.unMaskedRenderer = g.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
            }
            this.antialias = !!g.getContextAttributes().antialias;
            this.ANGLE = this.getAngle(g);
            this.maxVertexAttributes = g.getParameter(g.MAX_VERTEX_ATTRIBS);
            this.maxVertexTextureImageUnits = g.getParameter(g.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
            this.maxVertexUniformVectors = g.getParameter(g.MAX_VERTEX_UNIFORM_VECTORS);
            this.maxVaryingVectors = g.getParameter(g.MAX_VARYING_VECTORS);
            this.aliasedLineWidthRange = g.getParameter(g.ALIASED_LINE_WIDTH_RANGE);
            this.aliasedPointSizeRange = g.getParameter(g.ALIASED_POINT_SIZE_RANGE);
            this.maxFragmentUniformVectors = g.getParameter(g.MAX_FRAGMENT_UNIFORM_VECTORS);
            this.maxTextureImageUnits = g.getParameter(g.MAX_TEXTURE_IMAGE_UNITS);
            this.maxTextureSize = g.getParameter(g.MAX_TEXTURE_SIZE);
            this.maxCubeMapTextureSize = g.getParameter(g.MAX_CUBE_MAP_TEXTURE_SIZE);
            this.maxCombinedTextureImageUnits = g.getParameter(g.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
            this.maxAnisotropy = this.getMaxAnisotropy(g);
            this.maxColorBuffers = this.getMaxColorBuffers(g);
            this.redBits = g.getParameter(g.RED_BITS);
            this.greenBits = g.getParameter(g.GREEN_BITS);
            this.blueBits = g.getParameter(g.BLUE_BITS);
            this.alphaBits = g.getParameter(g.ALPHA_BITS);
            this.depthBits = g.getParameter(g.DEPTH_BITS);
            this.stencilBits = g.getParameter(g.STENCIL_BITS);
            this.maxRenderBufferSize = g.getParameter(g.MAX_RENDERBUFFER_SIZE);
            this.maxViewportDimensions = g.getParameter(g.MAX_VIEWPORT_DIMS);
            this.isMobile = this.IsPC() == false;
        };
        C.prototype.IsPC = function () {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        };
        C.prototype.describeRange = function (value) {
            return '[' + value[0] + ', ' + value[1] + ']';
        };
        C.prototype.getAngle = function (g) {
            var lineWidthRange = this.describeRange(g.getParameter(g.ALIASED_LINE_WIDTH_RANGE));
            // Heuristic: ANGLE is only on Windows, not in IE, and not in Edge, and does not implement line width greater than one.
            var angle = ((navigator.platform === 'Win32') || (navigator.platform === 'Win64')) &&
                (g.getParameter(g.RENDERER) !== 'Internet Explorer') &&
                (g.getParameter(g.RENDERER) !== 'Microsoft Edge') &&
                (lineWidthRange === this.describeRange([1, 1]));
            if (angle) {
                // Heuristic: D3D11 backend does not appear to reserve uniforms like the D3D9 backend, e.g.,
                // D3D11 may have 1024 uniforms per stage, but D3D9 has 254 and 221.
                //
                // We could also test for WEBGL_draw_buffers, but many systems do not have it yet
                // due to driver bugs, etc.
                if (rf.isPowerOfTwo(g.getParameter(g.MAX_VERTEX_UNIFORM_VECTORS)) && rf.isPowerOfTwo(g.getParameter(g.MAX_FRAGMENT_UNIFORM_VECTORS))) {
                    return 'Yes, D3D11';
                }
                else {
                    return 'Yes, D3D9';
                }
            }
            return 'No';
        };
        C.prototype.getMaxAnisotropy = function (g) {
            var e = g.getExtension('EXT_texture_filter_anisotropic')
                || g.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
                || g.getExtension('MOZ_EXT_texture_filter_anisotropic');
            if (e) {
                var max = g.getParameter(e.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
                if (max === 0) {
                    max = 2;
                }
                return max;
            }
            return NaN;
        };
        C.prototype.getMaxColorBuffers = function (g) {
            var maxColorBuffers = 1;
            var ext = g.getExtension("WEBGL_draw_buffers");
            if (ext != null) {
                maxColorBuffers = g.getParameter(ext.MAX_DRAW_BUFFERS_WEBGL);
            }
            return maxColorBuffers;
        };
        return C;
    }());
    /**
     * 提供当前浏览器的功能描述
     */
    rf.Capabilities = new C();
})(rf || (rf = {}));
///<reference path="./CONFIG.ts" />
var rf;
(function (rf) {
    function call(info, ars) {
        var args = [];
        var i = 0;
        if (ars) {
            for (; i < ars.length; i++) {
                args[i] = ars[i];
            }
        }
        var argus = info.args;
        if (argus) {
            for (var j = 0; j < argus.length; j++) {
                args[i++] = argus[j];
            }
        }
        var callback = info.callback;
        if (callback != undefined) {
            try {
                return callback.apply(info.thisObj, args);
            }
            catch (e) {
                if (DEBUG) {
                    var debug = info["_debug"];
                    rf.ThrowError("CallbackInfo\u6267\u884C\u62A5\u9519\uFF0C\u8D4B\u503C\u5185\u5BB9\uFF1A============Function=============:\n" + debug.handle + "\n}==============Stack============:\n" + debug.stack + "\n\u5F53\u524D\u5806\u6808\uFF1A" + e.stack);
                    console.log.apply(console, ["参数列表"].concat(this.args));
                }
            }
        }
        else if (DEBUG) {
            var debug = info["_debug"];
            rf.ThrowError("\u5BF9\u5DF2\u56DE\u6536\u7684CallbackInfo\u6267\u884C\u4E86\u56DE\u8C03\uFF0C\u6700\u540E\u4E00\u6B21\u8D4B\u503C\u5185\u5BB9\uFF1A============Function=============:\n" + debug.handle + "\n==============Stack============:\n" + debug.stack + "\n\u5F53\u524D\u5806\u6808\uFF1A" + new Error().stack);
        }
    }
    /**
     * 回调信息，用于存储回调数据
     * @author 3tion
     *
     */
    var CallbackInfo = /** @class */ (function () {
        function CallbackInfo() {
            this.doRecycle = true;
            if (DEBUG) {
                var data = { enumerable: true, configurable: true };
                data.get = function () {
                    return this._cb;
                };
                data.set = function (value) {
                    if (this._cb != value) {
                        this._cb = value;
                        if (value != undefined) {
                            this._debug = { handle: value.toString(), stack: new Error().stack };
                        }
                    }
                };
                Object.defineProperty(this, "callback", data);
            }
        }
        CallbackInfo.prototype.init = function (callback, thisObj, args) {
            this.callback = callback;
            this.args = args;
            this.thisObj = thisObj;
        };
        /**
         * 检查回调是否一致，只检查参数和this对象,不检查参数
         */
        CallbackInfo.prototype.checkHandle = function (callback, thisObj) {
            return this.callback === callback && this.thisObj == thisObj /* 允许null==undefined */;
        };
        /**
         * 执行回调
         * 回调函数，将以args作为参数，callback作为函数执行
         * @param {boolean} [doRecycle] 是否回收CallbackInfo，默认为true
         */
        CallbackInfo.prototype.execute = function (doRecycle) {
            var callback = this.callback;
            var result = call(this);
            if (doRecycle == undefined) {
                doRecycle = this.doRecycle;
            }
            if (doRecycle) {
                this.recycle();
            }
            return result;
        };
        CallbackInfo.prototype.call = function () {
            return call(this, arguments);
        };
        CallbackInfo.prototype.callAndRecycle = function () {
            var result = call(this, arguments);
            this.recycle();
            return result;
        };
        CallbackInfo.prototype.onRecycle = function () {
            this.callback = undefined;
            this.args = undefined;
            this.thisObj = undefined;
            this.doRecycle = true;
        };
        /**
         * 获取CallbackInfo的实例
         */
        CallbackInfo.get = function (callback, thisObj) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var info = rf.recyclable(CallbackInfo);
            info.init(callback, thisObj, args);
            return info;
        };
        /**
         * 加入到数组
         * 检查是否有this和handle相同的callback，如果有，就用新的参数替换旧参数
         * @param list
         * @param handle
         * @param args
         * @param thisObj
         */
        CallbackInfo.addToList = function (list, handle, thisObj) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            //检查是否有this和handle相同的callback
            for (var _a = 0, list_1 = list; _a < list_1.length; _a++) {
                var callback = list_1[_a];
                if (callback.checkHandle(handle, thisObj)) {
                    callback.args = args;
                    return callback;
                }
            }
            callback = this.get.apply(this, [handle, thisObj].concat(args));
            list.push(callback);
            return callback;
        };
        return CallbackInfo;
    }());
    rf.CallbackInfo = CallbackInfo;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var BitmapSourceVO = /** @class */ (function () {
        function BitmapSourceVO() {
            this.name = undefined;
            this.used = 0;
            this.time = 0;
            this.source = undefined;
            this.x = 0;
            this.y = 0;
            this.ix = 0;
            this.iy = 0;
            this.w = 0;
            this.h = 0;
            this.rw = 0;
            this.rh = 0;
            this.ul = 0;
            this.ur = 0;
            this.vt = 0;
            this.vb = 0;
            // dispose():void{
            //     this.x = this.y = this.w = this.h = this.ix = this.iy = this.rw = this.rh = 0;
            //     this.name = undefined;
            //     this.used = this.time = 0;
            // }
        }
        BitmapSourceVO.prototype.refreshUV = function (mw, mh) {
            var _a = this, x = _a.x, y = _a.y, w = _a.w, h = _a.h;
            this.ul = x / mw;
            this.ur = (x + w) / mw;
            this.vt = y / mh;
            this.vb = (y + h) / mh;
        };
        return BitmapSourceVO;
    }());
    rf.BitmapSourceVO = BitmapSourceVO;
    var BitmapSourceArea = /** @class */ (function () {
        function BitmapSourceArea() {
            this.name = 0;
            this.source = undefined;
            this.frames = {};
        }
        BitmapSourceArea.prototype.init = function () { };
        BitmapSourceArea.prototype.getArea = function (name, x, y, w, h) {
            var vo = new BitmapSourceVO();
            vo.name = name;
            vo.x = x;
            vo.y = y;
            vo.w = vo.rw = w;
            vo.h = vo.rh = h;
            vo.source = this.source;
            this.frames[name] = vo;
            return vo;
        };
        BitmapSourceArea.prototype.createFrameArea = function (name, frame) {
            var x = frame.x, y = frame.y, w = frame.w, h = frame.h, ix = frame.ix, iy = frame.iy;
            var vo = this.getArea(name, ix - x, iy - y, w, h);
            if (undefined != vo) {
                vo.ix = ix;
                vo.iy = iy;
            }
            return vo;
        };
        BitmapSourceArea.prototype.getEmptyArea = function (name, sw, sh) {
            return undefined;
        };
        BitmapSourceArea.prototype.getUnusedArea = function (name, sw, sh) {
            var frames = this.frames;
            var vo;
            for (var name_1 in frames) {
                vo = frames[name_1];
                if (undefined == vo)
                    continue;
                if (0 >= vo.used && sw < vo.rw && sh < vo.rh) {
                    frames[vo.name] = undefined;
                    vo.name = name_1;
                    vo.w = sw;
                    vo.h = sh;
                    frames[name_1] = vo;
                    break;
                }
            }
            return vo;
        };
        return BitmapSourceArea;
    }());
    rf.BitmapSourceArea = BitmapSourceArea;
    var MixBitmapSourceArea = /** @class */ (function (_super) {
        __extends(MixBitmapSourceArea, _super);
        function MixBitmapSourceArea() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MixBitmapSourceArea.prototype.init = function () {
            this.maxRect = new rf.MaxRectsBinPack(this.r - this.l, this.b - this.t);
        };
        MixBitmapSourceArea.prototype.getEmptyArea = function (name, sw, sh) {
            var rect = this.maxRect.insert(sw, sh);
            var vo;
            if (rect.w != 0) {
                vo = this.getArea(name, rect.x + this.l, rect.y + this.t, sw, sh);
            }
            else {
                vo = this.getUnusedArea(name, sw, sh);
            }
            return vo;
        };
        return MixBitmapSourceArea;
    }(BitmapSourceArea));
    rf.MixBitmapSourceArea = MixBitmapSourceArea;
    var BitmapSource = /** @class */ (function (_super) {
        __extends(BitmapSource, _super);
        function BitmapSource() {
            var _this = _super.call(this) || this;
            _this.name = undefined;
            _this.width = 0;
            _this.height = 0;
            _this.originU = 0;
            _this.originV = 0;
            _this.areas = undefined;
            return _this;
        }
        BitmapSource.prototype.create = function (name, bmd, pack) {
            if (pack === void 0) { pack = false; }
            this.name = name;
            this.areas = {};
            this.bmd = bmd;
            this.width = bmd.width;
            this.height = bmd.height;
            if (pack == false) {
                this.setArea(0, 0, 0, this.width, this.height);
            }
            else {
                this.areas[0] = this.setArea(1, 0, 0, this.width, this.height);
            }
            rf.bitmapSources[name] = this;
            return this;
        };
        BitmapSource.prototype.setArea = function (name, x, y, w, h) {
            var area = this.areas[name];
            if (undefined == area) {
                if (1 == name) {
                    var mix = new MixBitmapSourceArea();
                    mix.l = x;
                    mix.t = y;
                    mix.r = x + w;
                    mix.b = y + h;
                    area = mix;
                }
                else {
                    area = new BitmapSourceArea();
                }
            }
            else {
                rf.ThrowError("area exist");
                return area;
            }
            area.source = this;
            area.name = name;
            area.init();
            this.areas[name] = area;
            return area;
        };
        BitmapSource.prototype.setSourceVO = function (name, w, h, area) {
            if (area === void 0) { area = 1; }
            var barea = this.areas[area];
            if (undefined == barea) {
                return undefined;
            }
            var vo = barea.getEmptyArea(name, w, h);
            vo.refreshUV(this.width, this.height);
            return vo;
        };
        BitmapSource.prototype.getSourceVO = function (name, area) {
            if (area === void 0) { area = 0; }
            var barea = this.areas[area];
            if (undefined == barea) {
                return undefined;
            }
            return barea.frames[name];
        };
        BitmapSource.prototype.drawimg = function (img, x, y, w, h) {
            var _a = this, bmd = _a.bmd, name = _a.name, textureData = _a.textureData;
            if (w == undefined && h == undefined) {
                bmd.context.drawImage(img, x, y);
            }
            else {
                bmd.context.drawImage(img, x, y, w, h);
            }
            var texture = rf.context3D.textureObj[textureData.key];
            if (undefined != texture) {
                texture.readly = false;
            }
        };
        BitmapSource.DEFAULT = 0;
        BitmapSource.PACK = 1;
        return BitmapSource;
    }(rf.MiniDispatcher));
    rf.BitmapSource = BitmapSource;
    rf.bitmapSources = {};
})(rf || (rf = {}));
var rf;
(function (rf) {
    var Byte = /** @class */ (function () {
        function Byte(buf) {
            this.setArrayBuffer(buf);
        }
        Byte.prototype.setArrayBuffer = function (buf) {
            if (undefined == buf) {
                this.length = this.position = 0;
            }
            else {
                this.buf = new DataView(buf);
                this.length = buf.byteLength;
                this.position = 0;
            }
        };
        Byte.prototype.outOfRange = function () {
        };
        Byte.prototype.readByte = function () {
            var position = this.position;
            if (position > this.length) {
                this.outOfRange();
                return;
            }
            ;
            var b = this.buf.getUint8(position);
            this.position++;
            return b;
        };
        Byte.prototype.readInt = function () {
            var position = this.position;
            if (position + 4 > this.length) {
                this.outOfRange();
                return;
            }
            var b = this.buf.getInt32(position);
            this.position = position + 4;
            return b;
        };
        Byte.prototype.readUInt = function () {
            var position = this.position;
            if (position + 4 > this.length) {
                this.outOfRange();
                return;
            }
            var b = this.buf.getUint32(position);
            this.position = position + 4;
            return b;
        };
        Byte.prototype.readDouble = function () {
            var position = this.position;
            if (position + 8 > this.length) {
                this.outOfRange();
                return;
            }
            var b = this.buf.getFloat64(position);
            this.position = position + 8;
            return b;
        };
        Byte.prototype.readFloat = function () {
            var position = this.position;
            if (position + 4 > this.length) {
                this.outOfRange();
                return;
            }
            var b = this.buf.getFloat32(position);
            this.position = position + 4;
            return b;
        };
        Byte.prototype.readMultiByte = function (length, charSet) {
            if (charSet === void 0) { charSet = "utf-8"; }
            var _a = this, position = _a.position, buf = _a.buf;
            if (position + length > this.length) {
                this.outOfRange();
                return;
            }
            var str = "";
            for (var i = 0; i < length; i++) {
                str += String.fromCharCode(buf.getUint8(position + i));
            }
            // try{
            // 	var u8 = new Uint8Array(length);
            // 	u8.set(new Uint8Array(buf.buffer.slice(position, position + length)));
            // 	var decoder = new TextDecoder(charSet);
            // 	var str = decoder.decode(u8);
            // }catch (err){
            // 	//str = String.fromCharCode.apply(null, u8);
            // 	str = "";
            // 	for (var i:number = 0; i < length;i++ ){
            // 		str += String.fromCharCode(buf.getUint8(position + i));
            // 	}
            // }
            this.position += length;
            return str;
        };
        Byte.prototype.readByteArray = function (length) {
            var position = this.position;
            var buf = this.buf.buffer.slice(position, position + length);
            this.position += length;
            return buf;
        };
        return Byte;
    }());
    rf.Byte = Byte;
    var ClassDefine = /** @class */ (function () {
        function ClassDefine(className, members) {
        }
        return ClassDefine;
    }());
    rf.ClassDefine = ClassDefine;
    var AMF3 = /** @class */ (function (_super) {
        __extends(AMF3, _super);
        function AMF3(buf) {
            var _this = _super.call(this, buf) || this;
            _this.flags = 0;
            _this.stringsTable = [];
            _this.objectsTable = [];
            _this.traitsTable = [];
            _this.clsNameMap = {};
            _this.MASK = 1 << 28;
            return _this;
        }
        AMF3.prototype.read29 = function (unsign) {
            var v = 0, a = 0;
            // v = this.readByte() & 0xff
            // if (v >= 0x80)
            // {
            // 	a = this.readByte();
            // 	v += (a<<7) - 0x80;
            // 	if (a >= 0x80)
            // 	{
            // 		a = this.readByte();
            // 		v += (a<<14) - 0x4000;
            // 		if (a >= 0x80)
            // 		{
            // 			a = this.readByte();
            // 			v += (a << 21) - 0x200000;
            // 		}
            // 	}
            // }
            v = this.readByte();
            if (v >= 0x80) { //U29 1bytes 0x00-0x7f
                a = this.readByte();
                v = (v & 0x7f) << 7;
                if (a < 0x80) { //U29 2bytes 0x80-0xFF 0x00-0x7f
                    v = v | a;
                }
                else {
                    v = (v | a & 0x7f) << 7;
                    a = this.readByte();
                    if (a < 0x80) { //U29 3bytes 0x80-0xFF 0x80-0xFF 0x00-0x7f
                        v = v | a;
                    }
                    else { //u29 4bytes 0x80-0xFF 0x80-0xFF 0x80-0xFF 0x00-0xFF
                        v = (v | a & 0x7f) << 8;
                        a = this.readByte();
                        v = v | a;
                    }
                }
                v = -(v & 0x10000000) | v;
            }
            // if(unsign){
            // 	return v;
            // }
            // if (v & 1)
            // 	return -1 - (v>>1);
            // else
            // 	return v>>1;
            return v;
            // v = this.readByte() & 0xff;
            // if (v < 128){
            // 	return v;
            // }
            // let tmp;
            // v = (v & 0x7f) << 7;
            // tmp = this.readByte()&0xff;
            // if (tmp < 128){
            // 	v = v | tmp;
            // }else{
            // 	v = (v | tmp & 0x7f) << 7;
            // 	tmp = this.readByte()&0xff;
            // 	if (tmp < 128){
            // 		v = v | tmp;
            // 	}else{
            // 		v = (v | tmp & 0x7f) << 8;
            // 		tmp = this.readByte()&0xff;
            // 		v = v | tmp;
            // 	}
            // }
            // return -(v & this.MASK) | v;
        };
        AMF3.prototype.readInt = function () {
            return this.read29(false);
        };
        AMF3.prototype.readString = function () {
            var handle = this.read29(true);
            var inline = (handle & 1) != 0;
            handle = handle >> 1;
            if (inline) {
                if (0 == handle) {
                    return "";
                }
                var str = this.readMultiByte(handle);
                this.stringsTable.push(str);
                return str;
            }
            return this.stringsTable[handle];
        };
        AMF3.prototype.readDate = function (u29D) {
            return new Date(this.readDouble());
        };
        AMF3.prototype.readObjectVector = function (length) {
            var fixed = this.read29(true);
            var list = [];
            this.objectsTable.push(list);
            var index = -1;
            while (++index < length) {
                list[index] = this.readObject();
            }
            return list;
        };
        AMF3.prototype.readArray = function (length) {
            var objectsTable = this.objectsTable;
            var instance = [];
            objectsTable.push(instance);
            var key;
            while (key = this.readString()) {
                instance[key] = this.readObject();
            }
            var index = -1;
            while (++index < length) {
                instance[index] = this.readObject();
            }
            return instance;
        };
        AMF3.prototype.readDictionary = function (length) {
            var weakKeys = this.readByte() != 0;
            var dic = {};
            this.objectsTable.push(dic);
            var key;
            var value;
            for (var i = 0; i < length; i++) {
                key = this.readObject();
                value = this.readObject();
                dic[key] = value;
            }
            return dic;
        };
        AMF3.prototype.readObject = function () {
            var value;
            var marker = this.readByte();
            switch (marker) {
                case 4 /* INT */:
                    value = this.read29(false);
                    if (value >= 0x10000000) {
                        value = value - 0xFFFFFFFF - 1;
                    }
                    break;
                case 5 /* DOUBLE */:
                    value = this.readDouble();
                    break;
                case 2 /* FALSE */:
                case 3 /* TRUE */:
                    value = (marker == 3 /* TRUE */);
                    break;
                case 1 /* NULL */:
                    value = null;
                    break;
                case 0 /* UNDEFINED */:
                    value = undefined;
                    break;
                case 6 /* STRING */:
                    value = this.readString();
                    break;
                case 9 /* ARRAY */:
                case 10 /* OBJECT */:
                case 8 /* DATE */:
                case 11 /* XML */:
                case 7 /* XMLDOC */:
                case 12 /* BYTEARRAY */:
                case 16 /* OBJECTVECTOR */:
                case 13 /* INTVECTOR */:
                case 14 /* UINTVECTOR */:
                case 15 /* DOUBLEVECTOR */:
                case 17 /* DICTIONARY */:
                    value = this.readReferencableObject(marker);
                    break;
                default:
                    throw Error("not implement:" + marker);
            }
            return value;
        };
        AMF3.prototype.readByteArray = function (length) {
            var objectsTable = this.objectsTable;
            var buf = _super.prototype.readByteArray.call(this, length);
            objectsTable.push(buf);
            return buf;
        };
        AMF3.prototype._readObject = function (handle) {
            var _a = this, traitsTable = _a.traitsTable, objectsTable = _a.objectsTable;
            var traits;
            var classDef;
            var className;
            var len;
            var i;
            var inlineClassDef = ((handle & 1) != 0);
            handle = handle >> 1;
            if (inlineClassDef) {
                className = this.readString();
                var isIExternalizable = (handle & 1) != 0;
                handle = handle >> 1;
                var isDynamic = (handle & 1) != 0;
                len = handle >> 1;
                traits = [];
                for (i = 0; i < len; i++) {
                    traits[i] = this.readString();
                }
                classDef = new ClassDefine(className, traits);
                classDef.isExternalizable = isIExternalizable;
                classDef.isDynamic = isDynamic;
                traitsTable.push(classDef);
            }
            else {
                classDef = traitsTable[handle];
                if (!classDef) {
                    throw new Error("no trait found with refId: " + handle);
                }
                traits = classDef.members;
                className = classDef.className;
            }
            var instance;
            instance = {};
            objectsTable.push(instance);
            for (var key in traits) {
                key = traits[key];
                instance[key] = this.readObject();
            }
            if (classDef.isDynamic) {
                var key = void 0;
                while (key = this.readString()) {
                    instance[key] = this.readObject();
                }
            }
            return instance;
        };
        AMF3.prototype.readReferencableObject = function (marker) {
            var objectsTable = this.objectsTable;
            var object;
            var handle = this.read29(true);
            var isIn = (handle & 1) == 0;
            handle = handle >> 1;
            if (isIn) {
                object = objectsTable[handle];
                return object;
            }
            else {
                switch (marker) {
                    case 9 /* ARRAY */:
                        object = this.readArray(handle);
                        break;
                    case 10 /* OBJECT */:
                        object = this._readObject(handle);
                        break;
                    case 8 /* DATE */:
                        object = this.readDate(handle);
                        break;
                    case 11 /* XML */:
                        object = this.readMultiByte(handle);
                        break;
                    case 7 /* XMLDOC */:
                        object = this.readMultiByte(handle);
                        break;
                    case 12 /* BYTEARRAY */:
                        object = this.readByteArray(handle);
                        break;
                    case 16 /* OBJECTVECTOR */:
                    case 14 /* UINTVECTOR */:
                    case 13 /* INTVECTOR */:
                    case 15 /* DOUBLEVECTOR */:
                        object = this.readObjectVector(handle);
                        break;
                    case 17 /* DICTIONARY */:
                        object = this.readDictionary(handle);
                        break;
                    default:
                        throw Error("not implement:" + handle);
                }
            }
            return object;
        };
        return AMF3;
    }(Byte));
    rf.AMF3 = AMF3;
    var AMF3Encode = /** @class */ (function (_super) {
        __extends(AMF3Encode, _super);
        function AMF3Encode(buf) {
            var _this = _super.call(this, buf || new ArrayBuffer(10240 * 1024)) || this;
            _this.stringsTable = [];
            _this.objectsTable = [];
            _this.traitsTable = [];
            _this.unit8 = new Uint8Array(_this.buf.buffer);
            return _this;
        }
        AMF3Encode.prototype.writeByte = function (value) {
            this.buf.setUint8(this.position, value);
            this.position++;
        };
        AMF3Encode.prototype.writeFloat = function (value) {
            this.buf.setFloat32(this.position, value);
            this.position += 4;
        };
        AMF3Encode.prototype.writeDouble = function (value) {
            this.buf.setFloat64(this.position, value);
            this.position += 8;
        };
        AMF3Encode.prototype.writeString = function (str) {
            var stringsTable = this.stringsTable;
            var index = stringsTable.indexOf(str);
            var handle;
            if (index == -1) {
                var length_1 = str.length;
                handle = length_1 << 1;
                handle |= 1;
                this.write29(handle, true);
                var _a = this, position = _a.position, buf = _a.buf;
                for (var i = 0; i < length_1; i++) {
                    buf.setUint8(position++, str.charCodeAt(i));
                }
                this.position = position;
                stringsTable.push(str);
            }
            else {
                handle = index << 1;
                handle |= 0;
                this.write29(handle, true);
            }
        };
        AMF3Encode.prototype.write29 = function (v, unsign) {
            // if(unsign == false){
            // 	if (v < 0)
            // 		v = (-v - 1)*2 + 1;
            // 	else
            // 		v *= 2;
            // }
            var len = 0;
            if (v < 0x80)
                len = 1;
            else if (v < 0x4000)
                len = 2;
            else if (v < 0x200000)
                len = 3;
            else
                len = 4;
            // else if (v < 0x40000000) len = 4;
            // else throw new Error("U29 Range Error");// 0x40000000 - 0xFFFFFFFF : throw range exception
            switch (len) {
                case 1: // 0x00000000 - 0x0000007F : 0xxxxxxx
                    this.writeByte(v);
                    break;
                case 2: // 0x00000080 - 0x00003FFF : 1xxxxxxx 0xxxxxxx
                    this.writeByte(((v >> 7) & 0x7F) | 0x80);
                    this.writeByte(v & 0x7F);
                    break;
                case 3: // 0x00004000 - 0x001FFFFF : 1xxxxxxx 1xxxxxxx 0xxxxxxx
                    this.writeByte(((v >> 14) & 0x7F) | 0x80);
                    this.writeByte(((v >> 7) & 0x7F) | 0x80);
                    this.writeByte(v & 0x7F);
                    break;
                case 4: // 0x00200000 - 0x3FFFFFFF : 1xxxxxxx 1xxxxxxx 1xxxxxxx xxxxxxxx
                    this.writeByte(((v >> 22) & 0x7F) | 0x80);
                    this.writeByte(((v >> 15) & 0x7F) | 0x80);
                    this.writeByte(((v >> 8) & 0x7F) | 0x80);
                    this.writeByte(v & 0xFF);
                    break;
            }
            // // 写入 7 位
            // if (v < 0x80)
            // 	return this.writeByte (v);
            // this.writeByte (v|0x80);
            // v = v >> 7;
            // // 写入 7 位
            // if (v < 0x80)
            // 	return this.writeByte (v);
            // 	this.writeByte (v|0x80);
            // v = v >> 7;
            // // 写入 7 位
            // if (v < 0x80)
            // 	return this.writeByte (v);
            // 	this.writeByte (v|0x80);
            // v = v >> 7;
            // // 写入 8 位
            // if (v >= 0x100)
            // 	throw new Error ('bad integer value');
            // this.writeByte (v);
        };
        AMF3Encode.prototype.isRealNum = function (val) {
            // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
            if (val === "" || val == null) {
                return false;
            }
            if (!isNaN(val)) {
                return true;
            }
            else {
                return false;
            }
        };
        AMF3Encode.prototype.writeObject = function (o) {
            var type = typeof o;
            if (type === "string") {
                this.writeByte(6 /* STRING */);
                this.writeString(String(o));
            }
            else if (type === "boolean") {
                this.writeByte(o == true ? 3 /* TRUE */ : 2 /* FALSE */);
            }
            else if ('number' === type) {
                if ((o >> 0) === o && o >= -0x10000000 && o < 0x10000000) {
                    if (o < 0) {
                        o = 0xFFFFFFFF - (o + 1);
                    }
                    this.writeByte(4 /* INT */);
                    this.write29(o, false);
                }
                else {
                    this.writeByte(5 /* DOUBLE */);
                    this.writeDouble(o);
                }
            }
            else if (o instanceof Uint8Array
                || (o instanceof Uint32Array)
                || (o instanceof Uint16Array)
                || (o instanceof Float32Array)
                || o instanceof Float64Array) {
                this.writeBytes(o.buffer);
            }
            else if (o instanceof Array) {
                this.writeArray(o);
            }
            else if (o instanceof Object) {
                this.writeByte(10 /* OBJECT */);
                var objectsTable = this.objectsTable;
                var index = objectsTable.indexOf(o);
                var ins = 0;
                if (index != -1) {
                    this.write29(index << 1, true);
                    return;
                }
                objectsTable.push(o);
                this.write29(11, true); //isDynamic && isIExternalizable && inlineClassDef && 新对象
                this.write29(1, true); //class name
                for (var key in o) {
                    this.writeString(key);
                    this.writeObject(o[key]);
                }
                this.writeByte(1); //结束
            }
            else if (null === o) {
                this.writeByte(1 /* NULL */);
            }
            else if (undefined === o) {
                this.writeByte(0 /* UNDEFINED */);
            }
        };
        AMF3Encode.prototype.writeArray = function (arr) {
            this.writeByte(9 /* ARRAY */);
            var objectsTable = this.objectsTable;
            var index = objectsTable.indexOf(arr);
            var ins = 0;
            if (index != -1) {
                this.write29(index << 1, true);
                return;
            }
            objectsTable.push(arr);
            var len = arr.length;
            this.write29((len << 1) | 1, true);
            this.writeByte(1);
            for (var i = 0; i < len; i++) {
                this.writeObject(arr[i]);
            }
        };
        AMF3Encode.prototype.writeBytes = function (buffer) {
            this.writeByte(12 /* BYTEARRAY */);
            var objectsTable = this.objectsTable;
            var index = objectsTable.indexOf(buffer);
            var ins = 0;
            if (index != -1) {
                this.write29(index << 1, true);
                return;
            }
            objectsTable.push(buffer);
            var length = buffer.byteLength;
            this.write29((length << 1) | 1, true);
            this.unit8.set(new Uint8Array(buffer), this.position);
            this.position += buffer.byteLength;
        };
        AMF3Encode.prototype.toUint8Array = function () {
            return new Uint8Array(this.buf.buffer).slice(0, this.position);
        };
        return AMF3Encode;
    }(Byte));
    rf.AMF3Encode = AMF3Encode;
    function amf_readObject(byte) {
        var amf = rf.singleton(AMF3);
        var inflate = new Zlib.Inflate(new Uint8Array(byte));
        var plain;
        if (inflate instanceof Uint8Array) {
            plain = inflate;
        }
        else {
            plain = inflate.decompress();
        }
        amf.setArrayBuffer(plain.buffer);
        var o = amf.readObject();
        return o;
    }
    rf.amf_readObject = amf_readObject;
})(rf || (rf = {}));
var rf;
(function (rf) {
    //===========================================================================================
    // Tweener
    //===========================================================================================
    function defaultEasingFunction(t, b, c, d) {
        return c * t / d + b;
    }
    rf.defaultEasingFunction = defaultEasingFunction;
    rf.tweenLink = new rf.Link();
    function createTweener(eo, duration, tm, target, ease, so) {
        var tweener = { data: [], caster: target, tm: tm, st: tm.now, ease: ease ? ease : defaultEasingFunction, duration: duration };
        var data = tweener.data;
        var l = 0, e = 0, d = 0, s = 0;
        for (var k in eo) {
            if (target) {
                s = target[k];
                if (undefined != s) {
                    s = (so && undefined != so[k]) ? so[k] : s;
                }
                else {
                    s = 0;
                }
            }
            else {
                s = (so && undefined != so[k]) ? so[k] : 0;
            }
            e = eo[k];
            data[l++] = { k: k, s: s, e: e, d: e - s, n: 0 };
        }
        tweener.l = l;
        return tweener;
    }
    rf.createTweener = createTweener;
    function tweenTo(eo, duration, tm, target, ease, so) {
        var tweener = createTweener(eo, duration, tm, target, ease, so);
        if (tweener.l > 0) {
            rf.tweenLink.add(tweener);
        }
        return tweener;
    }
    rf.tweenTo = tweenTo;
    function tweenUpdate() {
        for (var vo = rf.tweenLink.getFrist(); vo; vo = vo.next) {
            if (vo.close == false) {
                var tweener = vo.data;
                var caster = tweener.caster, l = tweener.l, data = tweener.data, ease = tweener.ease, tm = tweener.tm, st = tweener.st, duration = tweener.duration, update = tweener.update, thisObj = tweener.thisObj;
                var now = tm.now - st;
                if (now >= duration) {
                    tweenEnd(tweener);
                }
                else {
                    for (var i = 0; i < l; i++) {
                        var item = data[i];
                        var k = item.k, s = item.s, d = item.d; //data[i];
                        item.n = ease(now, s, d, duration);
                        if (caster) {
                            caster[k] = item.n;
                        }
                    }
                    if (undefined != update) {
                        update.call(thisObj, tweener);
                    }
                }
            }
        }
    }
    rf.tweenUpdate = tweenUpdate;
    function tweenEnd(tweener) {
        var _a = tweener, caster = _a.caster, l = _a.l, data = _a.data, complete = _a.complete, thisObj = _a.thisObj;
        for (var i = 0; i < l; i++) {
            var item = data[i];
            var k = item.k, e = item.e;
            item.n = e;
            if (caster) {
                caster[k] = e;
            }
        }
        if (undefined != complete) {
            complete.call(thisObj, tweener);
        }
        rf.tweenLink.remove(tweener);
    }
    rf.tweenEnd = tweenEnd;
    function tweenStop(tweener) {
        rf.tweenLink.remove(tweener);
    }
    rf.tweenStop = tweenStop;
})(rf || (rf = {}));
///<reference path="Matrix3D.ts"/>
var rf;
(function (rf) {
    var Quaternion = /** @class */ (function () {
        function Quaternion(x, y, z, w) {
            if (w === void 0) { w = 1; }
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w;
        }
        Quaternion.lerp = function (qa, qb, percent) {
            var qax = qa.x, qay = qa.y, qaz = qa.z, qaw = qa.w;
            var qbx = qb.x, qby = qb.y, qbz = qb.z, qbw = qb.w;
            // shortest direction
            if (qax * qbx + qay * qby + qaz * qbz + qaw * qbw < 0) {
                return new Quaternion(qax + percent * (-qbx - qax), qay + percent * (-qby - qay), qaz + percent * (-qbz - qaz), qaw + percent * (-qbw - qaw));
            }
            return new Quaternion(qax + percent * (qbx - qax), qay + percent * (qby - qay), qaz + percent * (qbz - qaz), qaw + percent * (qbw - qaw));
        };
        Quaternion.prototype.fromMatrix3D = function (m) {
            var _a = m, m11 = _a[0], m12 = _a[1], m13 = _a[2], m21 = _a[4], m22 = _a[5], m23 = _a[6], m31 = _a[8], m32 = _a[9], m33 = _a[10];
            var tr = m11 + m22 + m33;
            var tmp;
            if (tr > 0) {
                tmp = 1 / (2 * Math.sqrt(tr + 1));
                this.x = (m23 - m32) * tmp;
                this.y = (m31 - m13) * tmp;
                this.z = (m12 - m21) * tmp;
                this.w = 0.25 / tmp;
            }
            else {
                if ((m11 > m22) && (m11 > m33)) {
                    tmp = 1 / (2 * Math.sqrt(1 + m11 - m22 + m33));
                    this.x = (m21 + m12) * tmp;
                    this.y = (m13 + m31) * tmp;
                    this.z = (m32 - m23) * tmp;
                    this.w = 0.25 / tmp;
                }
                else if ((m22 > m11) && (m22 > m33)) {
                    tmp = 1 / (Math.sqrt(1 + m22 - m11 - m33));
                    this.x = 0.25 / tmp;
                    this.y = (m32 + m23) * tmp;
                    this.z = (m13 - m31) * tmp;
                    this.w = (m21 + m12) * tmp;
                }
                else if ((m33 > m11) && (m33 > m22)) {
                    tmp = 1 / (Math.sqrt(1 + m33 - m11 - m22));
                    this.x = (m32 + m23) * tmp;
                    this.y = 0.25 / tmp;
                    this.z = (m21 - m12) * tmp;
                    this.w = (m13 + m31) * tmp;
                }
            }
            return this;
        };
        Quaternion.prototype.toMatrix3D = function (target) {
            var _a = this, x = _a.x, y = _a.y, z = _a.z, w = _a.w;
            var x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
            if (!target) {
                target = rf.newMatrix3D();
            }
            var rawData = target;
            rawData[0] = 1 - (yy + zz);
            rawData[1] = xy + wz;
            rawData[2] = xz - wy;
            rawData[3] = 0;
            rawData[4] = xy - wz;
            rawData[5] = 1 - (xx + zz);
            rawData[6] = yz + wx;
            rawData[7] = 0;
            rawData[8] = xz + wy;
            rawData[9] = yz - wx;
            rawData[10] = 1 - (xx + yy);
            rawData[11] = 0;
            rawData[12] = 0;
            rawData[13] = 0;
            rawData[14] = 0;
            rawData[15] = 1;
            return target;
        };
        /**
         * @param axis   must be a normalized vector
         * @param angleInRadians
         */
        Quaternion.prototype.fromAxisAngle = function (axis, angleInRadians) {
            var angle = angleInRadians * 0.5;
            var sin_a = Math.sin(angle);
            var cos_a = Math.cos(angle);
            this.x = axis.x * sin_a;
            this.y = axis.y * sin_a;
            this.z = axis.z * sin_a;
            this.w = cos_a;
        };
        Quaternion.prototype.conjugate = function () {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
        };
        Quaternion.prototype.toString = function () {
            return "[Quaternion] (x:" + this.x + " ,y:" + this.y + ", z:" + this.z + ", w:" + this.w + ")";
        };
        return Quaternion;
    }());
    rf.Quaternion = Quaternion;
})(rf || (rf = {}));
var rf;
(function (rf) {
    rf.vertex_ui_variable = {
        //x,y,z,u,v,index,r,g,b,a
        "pos": { size: 3, offset: 0 },
        "uv": { size: 3, offset: 3 },
        "color": { size: 4, offset: 6 },
        "data32PerVertex": { size: 10, offset: 0 }
    };
    /**
     * 可合并的UI对象完整体
     */
    rf.vertex_ui_full_variable = {
        //x,y,z,u,v,index,r,g,b,a
        "pos": { size: 3, offset: 0 },
        "normal": { size: 3, offset: 3 },
        "uv": { size: 3, offset: 6 },
        "color": { size: 4, offset: 9 },
        "data32PerVertex": { size: 13, offset: 0 }
    };
    rf.vertex_mesh_variable = {
        "pos": { size: 3, offset: 0 },
        "normal": { size: 3, offset: 3 },
        "uv": { size: 2, offset: 6 },
        "data32PerVertex": { size: 8, offset: 0 }
    };
    rf.vertex_mesh_full_variable = {
        "pos": { size: 3, offset: 0 },
        "normal": { size: 3, offset: 3 },
        "uv": { size: 2, offset: 6 },
        "color": { size: 4, offset: 8 },
        "data32PerVertex": { size: 12, offset: 0 }
    };
    rf.vertex_skeleton_variable = {
        "index": { size: 4, offset: 0 },
        "weight": { size: 4, offset: 4 },
        "data32PerVertex": { size: 8, offset: 0 }
    };
    rf.EMPTY_MAX_NUMVERTICES = Math.pow(2, 13);
    rf.empty_float32_pos = new Float32Array(3 * rf.EMPTY_MAX_NUMVERTICES);
    rf.empty_float32_normal = new Float32Array(3 * rf.EMPTY_MAX_NUMVERTICES);
    rf.empty_float32_tangent = new Float32Array(3 * rf.EMPTY_MAX_NUMVERTICES);
    rf.empty_float32_uv = new Float32Array(2 * rf.EMPTY_MAX_NUMVERTICES);
    rf.empty_float32_color = new Float32Array(4 * rf.EMPTY_MAX_NUMVERTICES);
    //2000面应该很多了吧
    rf.empty_uint16_indexs = new Uint16Array(3 * rf.EMPTY_MAX_NUMVERTICES);
    rf.empty_float32_object = {
        "pos": rf.empty_float32_pos,
        "normal": rf.empty_float32_normal,
        "uv": rf.empty_float32_uv,
        "color": rf.empty_float32_color
    };
    /**
     * pos:Float32Array
     * noraml:Float32Array
     * uv:Float32Array
     * color:Float32Array
     */
    function createGeometry(data, variables, numVertices, result) {
        var data32PerVertex = variables["data32PerVertex"].size;
        if (undefined == result) {
            result = new Float32Array(data32PerVertex * numVertices);
        }
        var offset = 0;
        var offsetIndex = 0;
        var offsetData = 0;
        var key = "";
        var index = 0;
        for (var i = 0; i < numVertices; i++) {
            offset = data32PerVertex * i;
            for (key in data) {
                var variable = variables[key];
                if (undefined == variable) {
                    continue;
                }
                var array = data[key];
                offsetData = i * variable.size;
                offsetIndex = offset + variable.offset;
                for (index = 0; index < variable.size; index++) {
                    result[offsetIndex + index] = array[offsetData + index];
                }
            }
        }
        return result;
    }
    rf.createGeometry = createGeometry;
    var VertexInfo = /** @class */ (function () {
        function VertexInfo(value, data32PerVertex, variables) {
            this.numVertices = 0;
            this.data32PerVertex = 0;
            if (value instanceof Float32Array) {
                this.vertex = value;
            }
            else {
                this.vertex = new Float32Array(value);
            }
            this.data32PerVertex = data32PerVertex;
            this.numVertices = this.vertex.length / data32PerVertex;
            this.variables = variables;
        }
        VertexInfo.prototype.regVariable = function (variable, offset, size) {
            if (undefined == this.variables) {
                this.variables = {};
            }
            this.variables[variable] = { size: size, offset: offset };
        };
        return VertexInfo;
    }());
    rf.VertexInfo = VertexInfo;
    var Temp_Float32Byte = /** @class */ (function () {
        function Temp_Float32Byte() {
            this.data32PerVertex = 1;
            this.numVertices = 0;
            this.position = 0;
            this.data = new Float32Array(2048); //先无脑申请个8KB内存
        }
        Temp_Float32Byte.prototype.onSpawn = function () {
            this.data32PerVertex = 1;
            this.numVertices = 0;
            this.position = 0;
        };
        Temp_Float32Byte.prototype.set = function (array, offset) {
            if (undefined == offset) {
                offset = this.position;
            }
            this.data.set(array, offset);
            this.position = offset + array.length;
        };
        Temp_Float32Byte.prototype.toArray = function () {
            var len = this.data32PerVertex * this.numVertices;
            var arr = new Float32Array(len);
            arr.set(this.data.slice(0, len));
            return arr;
        };
        return Temp_Float32Byte;
    }());
    rf.Temp_Float32Byte = Temp_Float32Byte;
    function geometry_plane(width, height, position, variables, matrix3D) {
        var width_half = width * 0.5;
        var height_half = height * 0.5;
        var points = [
            width_half, height_half, 0, 0, 0,
            -width_half, height_half, 0, 1, 0,
            -width_half, -height_half, 0, 1, 1,
            width_half, -height_half, 0, 0, 1
        ];
        var v = rf.TEMP_VECTOR3D;
        var variable = variables["pos" /* pos */];
        var pos = variable ? variable.size * 4 : -1;
        variable = variables["normal" /* normal */];
        var normal = variable ? variable.size * 4 : -1;
        variable = variables["uv" /* uv */];
        var uv = variable ? variable.size * 4 : -1;
        for (var i = 0; i < 4; i++) {
            var p = i * 5;
            if (-1 != pos) {
                v.x = points[p];
                v.y = points[p + 1];
                v.z = points[p + 2];
                if (undefined != matrix3D) {
                    matrix3D.m3_transformVector(v, v);
                }
                rf.empty_float32_pos.wPoint3(position * pos + (i * 3), v.x, v.y, v.z);
            }
            if (-1 != normal) {
                v.x = 0;
                v.y = 0;
                v.z = 1;
                if (undefined != matrix3D) {
                    matrix3D.m3_transformRotation(v, v);
                }
                rf.empty_float32_normal.wPoint3(position * normal + (i * 3), v.x, v.y, v.z);
            }
            if (-1 != uv) {
                rf.empty_float32_uv.wPoint2(position * uv + (i * 2), points[p + 3], points[p + 4]);
            }
        }
    }
    rf.geometry_plane = geometry_plane;
    var GeometryBase = /** @class */ (function () {
        function GeometryBase(variables) {
            this.data32PerVertex = 0;
            this.numVertices = 0;
            this.numTriangles = 0;
            if (undefined == variables) {
                variables = rf.vertex_mesh_variable;
            }
            this.variables = variables;
            this.data32PerVertex = variables["data32PerVertex"].size;
        }
        GeometryBase.prototype.initData = function (data) {
            var c = rf.context3D;
            var variables = data.variables, data32PerVertex = data.data32PerVertex, vertex = data.vertex, index = data.index, vertexBuffer = data.vertexBuffer, indexBuffer = data.indexBuffer;
            if (!vertexBuffer) {
                var info = new VertexInfo(vertex, data32PerVertex, variables);
                data.vertexBuffer = vertexBuffer = c.createVertexBuffer(info);
            }
            if (!indexBuffer) {
                if (index) {
                    data.indexBuffer = indexBuffer = c.createIndexBuffer(index);
                }
            }
        };
        GeometryBase.prototype.setData = function (data) {
            this.data = data;
            var meshVar = data.variables, numVertices = data.numVertices, numTriangles = data.numTriangles, data32PerVertex = data.data32PerVertex;
            var variables = this.variables;
            var c = rf.context3D;
            if (!meshVar) {
                data.variables = variables;
                data.data32PerVertex = data32PerVertex;
            }
            else {
                variables = data.variables;
            }
            this.numVertices = numVertices;
            this.numTriangles = numTriangles;
            this.data32PerVertex = data32PerVertex;
            this.initData(data);
            var vertexBuffer = data.vertexBuffer, indexBuffer = data.indexBuffer;
            this.vertex = vertexBuffer;
            this.index = indexBuffer;
            // if (index) {
            //     geometry.index = c.createIndexBuffer(new Uint16Array(index));
            // }else{
            //     geometry.numTriangles *= 3;
            // }
        };
        Object.defineProperty(GeometryBase.prototype, "pos", {
            get: function () {
                var _a = this.vertex.data, numVertices = _a.numVertices, vertex = _a.vertex, data32PerVertex = _a.data32PerVertex;
                var pos = [];
                for (var i = 0; i < numVertices; i++) {
                    var p = i * data32PerVertex;
                    pos.push([vertex[p], vertex[p + 1], vertex[p + 2]]);
                }
                return pos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeometryBase.prototype, "uv", {
            get: function () {
                var _a = this.vertex.data, numVertices = _a.numVertices, vertex = _a.vertex, data32PerVertex = _a.data32PerVertex, variables = _a.variables;
                var uv = variables["uv"];
                var uvs = [];
                for (var i = 0; i < numVertices; i++) {
                    var p = i * data32PerVertex + uv.offset;
                    uvs.push([vertex[p], vertex[p + 1]]);
                }
                return uvs;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeometryBase.prototype, "triangles", {
            get: function () {
                var numTriangles = this.numTriangles;
                var data = this.index.data;
                var triangles = [];
                for (var i = 0; i < numTriangles; i++) {
                    var p = i * 3;
                    triangles.push([data[p], data[p + 1], data[p + 2]]);
                }
                return triangles;
            },
            enumerable: true,
            configurable: true
        });
        GeometryBase.prototype.uploadContext = function (camera, mesh, program, now, interval) {
            var c = rf.context3D;
            this.vertex.uploadContext(program);
            var sceneTransform = mesh.sceneTransform, invSceneTransform = mesh.invSceneTransform;
            var worldTranform = rf.TEMP_MATRIX;
            worldTranform.m3_append(camera.worldTranform, false, sceneTransform);
            c.setProgramConstantsFromMatrix("mvp" /* mvp */, worldTranform);
            c.setProgramConstantsFromMatrix("invm" /* invm */, invSceneTransform);
        };
        return GeometryBase;
    }());
    rf.GeometryBase = GeometryBase;
    var SkeletonGeometry = /** @class */ (function (_super) {
        __extends(SkeletonGeometry, _super);
        function SkeletonGeometry() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SkeletonGeometry;
    }(GeometryBase));
    rf.SkeletonGeometry = SkeletonGeometry;
    var PlaneGeometry = /** @class */ (function (_super) {
        __extends(PlaneGeometry, _super);
        function PlaneGeometry() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PlaneGeometry.prototype.create = function (width, height) {
            if (width === void 0) { width = 1; }
            if (height === void 0) { height = 1; }
            var numVertices = 0;
            var quad = 0;
            var variables = this.variables;
            var matrix3D = rf.newMatrix3D();
            geometry_plane(width, height, 0, variables);
            numVertices += 4;
            quad++;
            matrix3D.m3_rotation(180 * rf.DEGREES_TO_RADIANS, rf.Y_AXIS);
            geometry_plane(width, height, 1, variables, matrix3D);
            numVertices += 4;
            quad++;
            var c = rf.context3D;
            var arr = createGeometry(rf.empty_float32_object, variables, numVertices);
            this.vertex = c.createVertexBuffer(new VertexInfo(arr, this.data32PerVertex, variables));
            this.index = c.getIndexByQuad(quad);
            this.numVertices = numVertices;
            this.numTriangles = quad * 2;
            return this;
        };
        return PlaneGeometry;
    }(GeometryBase));
    rf.PlaneGeometry = PlaneGeometry;
    var BoxGeometry = /** @class */ (function (_super) {
        __extends(BoxGeometry, _super);
        function BoxGeometry() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BoxGeometry.prototype.create = function (width, height, depth) {
            var matrix3D = rf.newMatrix3D();
            var numVertices = 0;
            var quad = 0;
            var variables = this.variables;
            matrix3D.m3_translation(0, 0, depth * 0.5);
            geometry_plane(width, height, quad, variables, matrix3D);
            numVertices += 4;
            quad++;
            matrix3D.m3_identity();
            matrix3D.m3_rotation(180 * rf.DEGREES_TO_RADIANS, rf.Y_AXIS);
            matrix3D.m3_translation(0, 0, -depth * 0.5);
            geometry_plane(width, height, quad, variables, matrix3D);
            numVertices += 4;
            quad++;
            matrix3D.m3_identity();
            matrix3D.m3_rotation(-90 * rf.DEGREES_TO_RADIANS, rf.Y_AXIS);
            matrix3D.m3_translation(width * 0.5, 0, 0);
            geometry_plane(depth, height, quad, variables, matrix3D);
            numVertices += 4;
            quad++;
            matrix3D.m3_identity();
            matrix3D.m3_rotation(90 * rf.DEGREES_TO_RADIANS, rf.Y_AXIS);
            matrix3D.m3_translation(-width * 0.5, 0, 0);
            geometry_plane(depth, height, quad, variables, matrix3D);
            numVertices += 4;
            quad++;
            matrix3D.m3_identity();
            matrix3D.m3_rotation(90 * rf.DEGREES_TO_RADIANS, rf.X_AXIS);
            matrix3D.m3_translation(0, height * 0.5, 0);
            geometry_plane(width, depth, quad, variables, matrix3D);
            numVertices += 4;
            quad++;
            matrix3D.m3_identity();
            matrix3D.m3_rotation(-90 * rf.DEGREES_TO_RADIANS, rf.X_AXIS);
            matrix3D.m3_translation(0, -height * 0.5, 0);
            geometry_plane(width, depth, quad, variables, matrix3D);
            numVertices += 4;
            quad++;
            var c = rf.context3D;
            var arr = createGeometry(rf.empty_float32_object, variables, numVertices);
            this.vertex = c.createVertexBuffer(new VertexInfo(arr, this.data32PerVertex, variables));
            this.index = c.getIndexByQuad(quad);
            this.numVertices = numVertices;
            this.numTriangles = quad * 2;
            return this;
        };
        return BoxGeometry;
    }(GeometryBase));
    rf.BoxGeometry = BoxGeometry;
    function hsva(h, s, v, a) {
        if (s > 1 || v > 1 || a > 1) {
            return;
        }
        var th = h % 360;
        var i = Math.floor(th / 60);
        var f = th / 60 - i;
        var m = v * (1 - s);
        var n = v * (1 - s * f);
        var k = v * (1 - s * (1 - f));
        var color = [];
        var r = [v, n, m, m, k, v];
        var g = [k, v, v, n, m, m];
        var b = [m, m, k, v, v, n];
        color.push(r[i], g[i], b[i], a);
        return color;
    }
    rf.hsva = hsva;
    var SphereGeometry = /** @class */ (function (_super) {
        __extends(SphereGeometry, _super);
        function SphereGeometry() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SphereGeometry.prototype.create = function (row, column, rad, color) {
            var numVertices = 0;
            for (var i = 0; i <= row; i++) {
                var r = Math.PI / row * i;
                var ry = Math.cos(r);
                var rr = Math.sin(r);
                for (var ii = 0; ii <= column; ii++) {
                    var tr = Math.PI * 2 / column * ii;
                    var tx = rr * rad * Math.cos(tr);
                    var ty = ry * rad;
                    var tz = rr * rad * Math.sin(tr);
                    var rx = rr * Math.cos(tr);
                    var rz = rr * Math.sin(tr);
                    var tc = color;
                    if (undefined == tc) {
                        tc = hsva(360 / row * i, 1, 1, 1);
                    }
                    rf.empty_float32_pos.wPoint3(numVertices * 3, tx, ty, tz);
                    rf.empty_float32_normal.wPoint3(numVertices * 3, rx, ry, rz);
                    rf.empty_float32_uv.wPoint2(numVertices * 2, 1 - 1 / column * ii, 1 / row * i);
                    rf.empty_float32_color.wPoint4(numVertices * 4, tc[0], tc[1], tc[2], tc[3]);
                    numVertices++;
                }
            }
            var position = 0;
            for (var i = 0; i < row; i++) {
                for (var ii = 0; ii < column; ii++) {
                    var r = (column + 1) * i + ii;
                    rf.empty_uint16_indexs.set([r, r + 1, r + column + 2, r, r + column + 2, r + column + 1], position);
                    position += 6;
                }
            }
            var variables = this.variables;
            var c = rf.context3D;
            var arr = createGeometry(rf.empty_float32_object, variables, numVertices);
            this.vertex = c.createVertexBuffer(new VertexInfo(arr, this.data32PerVertex, variables));
            this.index = c.createIndexBuffer(rf.empty_uint16_indexs.slice(0, position));
            this.numVertices = numVertices;
            this.numTriangles = position / 3;
            return this;
        };
        return SphereGeometry;
    }(GeometryBase));
    rf.SphereGeometry = SphereGeometry;
    var TorusGeomerty = /** @class */ (function (_super) {
        __extends(TorusGeomerty, _super);
        function TorusGeomerty() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TorusGeomerty.prototype.create = function (row, column, irad, orad) {
            var numVertices = 0;
            for (var i = 0; i <= row; i++) {
                var r = Math.PI * 2 / row * i;
                var rr = Math.cos(r);
                var ry = Math.sin(r);
                for (var ii = 0; ii <= column; ii++) {
                    var tr = Math.PI * 2 / column * ii;
                    var tx = (rr * irad + orad) * Math.cos(tr);
                    var ty = ry * irad;
                    var tz = (rr * irad + orad) * Math.sin(tr);
                    var rx = rr * Math.cos(tr);
                    var rz = rr * Math.sin(tr);
                    // if(color){
                    //     var tc = color;
                    // }else{
                    //     tc = hsva(360 / column * ii, 1, 1, 1);
                    // }
                    var rs = 1 / column * ii;
                    var rt = 1 / row * i + 0.5;
                    if (rt > 1.0) {
                        rt -= 1.0;
                    }
                    rt = 1.0 - rt;
                    rf.empty_float32_pos.wPoint3(numVertices * 3, tx, ty, tz);
                    rf.empty_float32_normal.wPoint3(numVertices * 3, rx, ry, rz);
                    rf.empty_float32_uv.wPoint2(numVertices * 2, rs, rt);
                    // empty_float32_color.wPoint4(numVertices * 4 , tc[0], tc[1], tc[2], tc[3]);
                    numVertices++;
                }
            }
            var position = 0;
            for (i = 0; i < row; i++) {
                for (ii = 0; ii < column; ii++) {
                    r = (column + 1) * i + ii;
                    rf.empty_uint16_indexs.set([r, r + column + 1, r + 1, r + column + 1, r + column + 2, r + 1], position);
                    position += 6;
                }
            }
            var variables = this.variables;
            var c = rf.context3D;
            var arr = createGeometry(rf.empty_float32_object, variables, numVertices);
            this.vertex = c.createVertexBuffer(new VertexInfo(arr, this.data32PerVertex, variables));
            this.index = c.createIndexBuffer(rf.empty_uint16_indexs.slice(0, position));
            this.numVertices = numVertices;
            this.numTriangles = position / 3;
            return this;
        };
        return TorusGeomerty;
    }(GeometryBase));
    rf.TorusGeomerty = TorusGeomerty;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var Material = /** @class */ (function () {
        function Material() {
            this.depthMask = false;
        }
        Material.prototype.createProgram = function (mesh) {
            return this.program;
        };
        Material.prototype.setData = function (data) {
            if (!data) {
                this.cull = 1029 /* BACK */;
                this.depthMask = true;
                this.passCompareMode = 515 /* LEQUAL */;
                this.srcFactor = 770 /* SRC_ALPHA */;
                this.dstFactor = 771 /* ONE_MINUS_SRC_ALPHA */;
                this.alphaTest = -1;
            }
            else {
                var cull = data.cull, depthMask = data.depthMask, passCompareMode = data.passCompareMode, srcFactor = data.srcFactor, dstFactor = data.dstFactor, alphaTest = data.alphaTest, diffTex = data.diffTex;
                this.cull = (undefined != cull) ? cull : 1029 /* BACK */;
                this.depthMask = undefined != depthMask ? depthMask : true;
                this.passCompareMode = passCompareMode ? passCompareMode : 515 /* LEQUAL */;
                this.srcFactor = srcFactor ? srcFactor : 770 /* SRC_ALPHA */;
                this.dstFactor = dstFactor ? dstFactor : 771 /* ONE_MINUS_SRC_ALPHA */;
                this.alphaTest = Number(alphaTest);
                if (diffTex) {
                    this.diffTex = diffTex;
                }
                else {
                    this.diff = rf.newColor(0xFFFFFF);
                }
            }
        };
        Material.prototype.uploadContext = function (camera, mesh, now, interval) {
            return false;
        };
        Material.prototype.checkTexs = function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var c = rf.context3D;
            var b = true;
            args.forEach(function (data) {
                if (undefined != data) {
                    var tex = void 0;
                    if (data.key) {
                        tex = c.textureObj[data.key];
                    }
                    if (undefined == tex) {
                        tex = c.createTexture(data, undefined);
                        b = false;
                    }
                    var readly = tex.readly, status_1 = tex.status;
                    if (false == readly) {
                        if (2 /* COMPLETE */ != status_1) {
                            if (0 /* WAIT */ == status_1) {
                                tex.load(_this.getTextUrl(data));
                            }
                            b = false;
                        }
                    }
                }
            });
            return b;
        };
        Material.prototype.getTextUrl = function (data) {
            return data.url;
        };
        return Material;
    }());
    rf.Material = Material;
    var PhongMaterial = /** @class */ (function (_super) {
        __extends(PhongMaterial, _super);
        function PhongMaterial() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PhongMaterial.prototype.uploadContext = function (camera, mesh, now, interval) {
            var scene = mesh.scene;
            var c = rf.context3D;
            var _a = this, program = _a.program, diff = _a.diff, emissive = _a.emissive, specular = _a.specular, diffTex = _a.diffTex, emissiveTex = _a.emissiveTex, specularTex = _a.specularTex;
            var skAnim = mesh.skAnim;
            if (!diff && !diffTex) {
                return false;
            }
            var b = this.checkTexs(diffTex, emissiveTex, specularTex);
            if (false == b) {
                return false;
            }
            if (undefined == program) {
                this.program = program = this.createProgram(mesh);
            }
            var sun = scene.sun;
            c.setProgram(program);
            c.setCulling(this.cull);
            c.setProgramConstantsFromVector("lightDirection" /* lightDirection */, [sun._x, sun._y, sun._z], 3);
            var t;
            if (undefined != diffTex) {
                t = c.textureObj[diffTex.key];
                t.uploadContext(program, 0, "diff" /* diff */);
            }
            // c.setProgramConstantsFromVector(VC.lightDirection,[100,100,100],3);
            // c.setProgramConstantsFromVector(VC.vc_diff,[Math.random(),Math.random(),Math.random(),1.0],4);
            if (undefined != diff) {
                c.setProgramConstantsFromVector("vc_diff" /* vc_diff */, [diff.r, diff.g, diff.b, diff.a], 4);
            }
            if (undefined != emissive) {
                c.setProgramConstantsFromVector("vc_emissive" /* vc_emissive */, [emissive.r, emissive.g, emissive.b, 0.0], 4);
            }
            return true;
        };
        PhongMaterial.prototype.createProgram = function (mesh) {
            var _a = this, diffTex = _a.diffTex, emissiveTex = _a.emissiveTex, specularTex = _a.specularTex, diff = _a.diff;
            var skAnim = mesh.skAnim;
            var c = rf.context3D;
            var f_def = "";
            var v_def = "";
            var key = "PhongMaterial";
            if (undefined != diffTex) {
                key += "-diff";
                f_def += "#define DIFF\n";
            }
            else if (undefined != diff) {
                f_def += "#define VC_DIFF\n";
            }
            if (undefined != emissiveTex) {
                key += "-emissive";
            }
            if (undefined != specularTex) {
                key += "-specular";
            }
            if (undefined != skAnim) {
                key += "-skeleton";
                v_def += "#define USE_SKINNING\n           #define MAX_BONES 50\n";
            }
            var p = c.programs[key];
            if (undefined != p) {
                return p;
            }
            var vertexCode = "\n                precision mediump float;\n                " + v_def + "\n                attribute vec3 " + "pos" /* pos */ + ";\n                attribute vec3 " + "normal" /* normal */ + ";\n                attribute vec2 " + "uv" /* uv */ + ";\n                #ifdef USE_SKINNING\n                    attribute vec4 " + "index" /* index */ + ";\n                    attribute vec4 " + "weight" /* weight */ + ";\n                #endif\n                uniform mat4 " + "mvp" /* mvp */ + ";\n                uniform mat4 " + "invm" /* invm */ + ";\n                uniform vec3 " + "lightDirection" /* lightDirection */ + ";\n                varying vec4 vDiffuse;\n                varying vec2 vUV;\n#ifdef USE_SKINNING\n                uniform mat4 " + "bones" /* vc_bones */ + "[ MAX_BONES ];\n                mat4 getBoneMatrix( const in float i ) {\n                    mat4 bone = " + "bones" /* vc_bones */ + "[ int(i) ];\n                    return bone;\n                }\n#endif\n                void main() {\n                    vec4 t_pos = vec4(" + "pos" /* pos */ + ", 1.0);\n                    vec3 t_normal = " + "normal" /* normal */ + ";\n\n                    #ifdef USE_SKINNING\n                        mat4 boneMatX = getBoneMatrix( " + "index" /* index */ + ".x );\n                        mat4 boneMatY = getBoneMatrix( " + "index" /* index */ + ".y );\n                        mat4 boneMatZ = getBoneMatrix( " + "index" /* index */ + ".z );\n                        mat4 boneMatW = getBoneMatrix( " + "index" /* index */ + ".w );\n                    #endif\n\n                    #ifdef USE_SKINNING\n                        mat4 skinMatrix = mat4( 0.0 );\n                        skinMatrix += " + "weight" /* weight */ + ".x * boneMatX;\n                        skinMatrix += " + "weight" /* weight */ + ".y * boneMatY;\n                        skinMatrix += " + "weight" /* weight */ + ".z * boneMatZ;\n                        skinMatrix += " + "weight" /* weight */ + ".w * boneMatW;\n                        t_normal = vec4( skinMatrix * vec4( t_normal, 0.0 ) ).xyz;\n                        t_pos = skinMatrix * t_pos;\n                    #endif\n\n                    vec3  invLight = normalize(" + "invm" /* invm */ + " * vec4(" + "lightDirection" /* lightDirection */ + ", 0.0)).xyz;\n                    float diffuse  = clamp(dot(t_normal.xyz, invLight), 0.1, 1.0);\n                    diffuse += 0.5;\n                    vDiffuse = vec4(vec3(diffuse), 1.0);\n                    vUV = " + "uv" /* uv */ + ";\n                    gl_Position = " + "mvp" /* mvp */ + " * t_pos;\n                }\n            ";
            var fragmentCode = "\n                precision highp float;\n                precision highp int;\n\n                " + f_def + "\n\n                uniform sampler2D " + "diff" /* diff */ + ";\n\n                uniform vec4 " + "vc_diff" /* vc_diff */ + ";\n                uniform vec4 " + "vc_emissive" /* vc_emissive */ + ";\n\n                varying vec4 vDiffuse;\n                varying vec2 vUV;\n\n\n                \n                void main(void){\n\n                    vec2 tUV = vUV;\n\n                    #ifdef DIFF\n                        vec4 c = texture2D(" + "diff" /* diff */ + ", tUV);\n                    #else\n                        #ifdef VC_DIFF\n                            vec4 c = " + "vc_diff" /* vc_diff */ + ";\n                        #else\n                            vec4 c = vec4(1.0,1.0,1.0,1.0) ;\n                        #endif\n                    #endif\n                    c *= vDiffuse;\n\n                    if(c.w < 0.1){\n                        discard;\n                    }\n                    gl_FragColor = c;\n                    // gl_FragColor = vec4(1.0,1.0,1.0,1.0);\n                    // gl_FragColor = vec4(vUV,0.0,1.0);\n                }\n            ";
            p = c.createProgram(vertexCode, fragmentCode, key);
            return p;
        };
        return PhongMaterial;
    }(Material));
    rf.PhongMaterial = PhongMaterial;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var Shader = /** @class */ (function () {
        function Shader() {
            this.att_uv_ui = {
                key: "a1",
                vdef: "\n                attribute vec4 " + "color" /* color */ + ";\n                attribute vec3 " + "uv" /* uv */ + ";\n                uniform vec4 ui[" + rf.max_vc + "];\n            ",
                vary: "\n                varying vec2 vUV;  \n                varying vec4 vColor;\n            ",
                vcode: "\n                vec4 tv = ui[int(" + "uv" /* uv */ + ".z)];\n                p.xy = p.xy + tv.xy;\n                p.xy = p.xy * tv.zz;\n\n                vec4 tc = " + "color" /* color */ + ";\n                tc.w = tc.w * tv.w;\n                vColor = tc;\n                vUV.xy = " + "uv" /* uv */ + ".xy;\n            ",
                fcode: "\n                color = vColor*color;\n            "
            };
            this.att_uv = {
                key: "a2",
                vdef: "\n                attribute vec2 " + "uv" /* uv */ + "\n            ",
                vary: "\n                varying vec2 vUV;  \n            ",
                vcode: "\n                vUV.xy = " + "uv" /* uv */ + ".xy;\n            ",
                fcode: "\n                vec2 tUV = vUV;\n            "
            };
            this.att_color = {
                key: "a3",
                vdef: "\n                attribute vec4 " + "color" /* color */ + ";\n            ",
                vary: "\n                varying vec4 vColor;\n            ",
                vcode: "\n                vColor = " + "color" /* color */ + ";\n            ",
                fcode: "\n                color = vColor;\n            "
            };
            this.att_normal = {
                key: "a4",
                vdef: "\n                attribute vec3 " + "normal" /* normal */ + ";\n            ",
                vcode: "\n                _normal = " + "normal" /* normal */ + ";\n            "
            };
            // uni_v_m = {
            //     key:"u1",
            //     vdef:`
            //         uniform mat4 m;
            //     `
            // }
            // uni_v_v = {
            //     key:"u2",
            //     vdef:`
            //         uniform mat4 v;
            //     `
            // }
            this.uni_v_p = {
                key: "u3",
                vdef: "\n                uniform mat4 " + "p" /* p */ + ";\n            "
            };
            this.uni_v_mv = {
                key: "u4",
                vdef: "\n                uniform mat4 " + "mv" /* mv */ + ";\n            "
            };
            this.uni_v_mvp = {
                key: "u5",
                vdef: "\n                uniform mat4 " + "mvp" /* mvp */ + ";\n            ",
                vcode: "\n                p = mvp * p;\n            "
            };
            this.uni_f_diff = {
                key: "u5",
                fdef: "\n                uniform sampler2D " + "diff" /* diff */ + ";\n            ",
                fcode: "\n                vec4 color = texture2D(" + "diff" /* diff */ + ", tUV);\n            "
            };
            this.uni_v_inv_m = {
                key: "u6",
                vdef: "\n                uniform mat4 " + "invm" /* invm */ + ";\n            "
            };
            this.uni_v_dir = {
                key: "u7",
                vdef: "\n                uniform vec3 lightDirection;\n            "
            };
            this.uni_v_light = {};
        }
        Shader.prototype.createVertex = function (define, modules) {
            var code = "";
            var chunk;
            for (var str in define) {
                code += "#define " + str + "\n";
            }
            code += "attribute vec3 " + "pos" /* pos */ + ";\n";
            for (var str in modules) {
                chunk = modules[str];
                if (undefined != chunk.vdef) {
                    code += chunk.vdef;
                }
                if (undefined != chunk.vary) {
                    code += chunk.vary;
                }
            }
            code += "\n            void main(void){\n                vec4 p = vec4(" + "pos" /* pos */ + ",1.0);\n            ";
            chunk = modules[this.att_uv_ui.key];
            if (undefined != chunk) {
                code += chunk.vcode + "\n";
            }
            chunk = modules[this.uni_v_mvp.key];
            if (undefined != chunk) {
                code += chunk.vcode + "\n";
            }
            code += "\n                gl_Position = p;\n            }\n            ";
            return code;
        };
        Shader.prototype.createFragment = function (define, modules) {
            var code = "";
            var chunk;
            for (var str in define) {
                code += "#define " + str + "\n";
            }
            code += "precision mediump float;\n";
            for (var str in modules) {
                chunk = modules[str];
                if (undefined != chunk.fdef) {
                    code += chunk.fdef + "\n";
                }
                if (undefined != chunk.vary) {
                    code += chunk.vary + "\n";
                }
            }
            code += "\n            void main(void){\n            ";
            chunk = modules[this.att_uv.key];
            if (undefined != chunk) {
                code += chunk.fcode + "\n";
            }
            chunk = modules[this.att_uv_ui.key];
            if (undefined != chunk) {
                code += "vec2 tUV = vUV;\n";
            }
            chunk = modules[this.uni_f_diff.key];
            if (undefined != chunk) {
                code += chunk.fcode + "\n";
            }
            chunk = modules[this.att_uv_ui.key];
            if (undefined != chunk) {
                code += chunk.fcode + "\n";
            }
            code += "\n                gl_FragColor = color;\n\n            }\n            ";
            return code;
        };
        return Shader;
    }());
    rf.Shader = Shader;
})(rf || (rf = {}));
///<reference path="./core/Config.ts" />
///<reference path="./core/Geom.ts" />
///<reference path="./core/ByteArray.ts" />
///<reference path="./core/BitmapData.ts" />
///<reference path="./core/ClassUtils.ts" />
///<reference path="./core/Link.ts" />
///<reference path="./core/MiniDispatcher.ts" />
///<reference path="./core/Engine.ts" />
///<reference path="./core/Net.ts" />
///<reference path="./core/Res.ts" />
///<reference path="./core/Capabilities.ts" />
///<reference path="./core/ThrowError.ts" />
///<reference path="./core/CallbackInfo.ts" />
///<reference path="./core/SourceManager.ts" />
///<reference path="./core/AMF3.ts" />
///<reference path="./core/Tween.ts" />
///<reference path="./stage3d/geom/Matrix3D.ts" />
///<reference path="./stage3d/geom/Quaternion.ts" />
///<reference path="./stage3d/three/Geometry.ts" />
///<reference path="./stage3d/three/Material.ts" />
///<reference path="./stage3d/Shader.ts" />
///<reference path="../../rfreference.ts" />
var rf;
(function (rf) {
    var HitArea = /** @class */ (function () {
        function HitArea() {
            this.left = 0;
            this.right = 0;
            this.top = 0;
            this.bottom = 0;
            this.front = 0;
            this.back = 0;
        }
        HitArea.prototype.clean = function () {
            this.left = this.right = this.top = this.bottom = this.front = this.back = 0;
        };
        HitArea.prototype.combine = function (hitArea, x, y) {
            var b = false;
            if (this.left > hitArea.left + x) {
                this.left = hitArea.left + x;
                b = true;
            }
            if (this.right < hitArea.right + x) {
                this.right = hitArea.right + x;
                b = true;
            }
            if (this.top > hitArea.top + y) {
                this.top = hitArea.top + y;
                b = true;
            }
            if (this.bottom < hitArea.bottom + y) {
                this.bottom = hitArea.bottom + y;
                b = true;
            }
            if (this.front > hitArea.front) {
                this.front = hitArea.front;
                b = true;
            }
            if (this.back < hitArea.back) {
                this.back = hitArea.back;
                b = true;
            }
            return b;
        };
        HitArea.prototype.updateArea = function (x, y, z) {
            var b = false;
            if (this.left > x) {
                this.left = x;
                b = true;
            }
            else if (this.right < x) {
                this.right = x;
                b = true;
            }
            if (this.top > y) {
                this.top = y;
                b = true;
            }
            else if (this.bottom < y) {
                this.bottom = y;
                b = true;
            }
            if (this.front > z) {
                this.front = z;
                b = true;
            }
            else if (this.back < z) {
                this.back = z;
                b = true;
            }
            return b;
        };
        HitArea.prototype.checkIn = function (x, y, scale) {
            if (scale === void 0) { scale = 1; }
            if (this.allWays) {
                return true;
            }
            if (x > this.left * scale && x < this.right * scale && y > this.top * scale && y < this.bottom * scale) {
                return true;
            }
            return false;
        };
        HitArea.prototype.toString = function () {
            return "HitArea left:" + this.left + " right:" + this.right + " top:" + this.top + " bottom:" + this.bottom + " front:" + this.front + " back:" + this.back;
        };
        return HitArea;
    }());
    rf.HitArea = HitArea;
    var DisplayObject = /** @class */ (function (_super) {
        __extends(DisplayObject, _super);
        function DisplayObject() {
            var _this = _super.call(this) || this;
            _this.mouseEnabled = false;
            _this.mouseChildren = true;
            _this.mousedown = false;
            _this.mouseroll = false;
            _this.up = rf.newVector3D(0, 1, 0);
            _this._x = 0;
            _this._y = 0;
            _this._z = 0;
            _this._rotationX = 0;
            _this._rotationY = 0;
            _this._rotationZ = 0;
            _this._scaleX = 1;
            _this._scaleY = 1;
            _this._scaleZ = 1;
            _this._alpha = 1;
            _this.sceneAlpha = 1;
            _this._visible = true;
            _this.states = 0;
            _this.pivotZero = false;
            _this.w = 0;
            _this.h = 0;
            _this.invalidateFuncs = [];
            _this.pos = rf.newVector3D();
            _this.rot = rf.newVector3D();
            _this.sca = rf.newVector3D(1, 1, 1);
            _this.transform = rf.newMatrix3D();
            _this.sceneTransform = rf.newMatrix3D();
            return _this;
        }
        /**
         * 逻辑规则
         * 改变对象 transform  alpha   vertexData  vcData  hitArea
         * 1.transform alpha 改变需要递归计算 并且上层是需要下层有改变的 引申出 ct 对象 childTranformORAlphaChange
         * 2.vertexData vcData 是要让batcher知道数据改变了 本层不需要做任何处理
         * 3.hitArea 改变 需要递归计算，引申出 ca对象 childHitAreaChange
         */
        DisplayObject.prototype.setChange = function (value, p, c) {
            if (p === void 0) { p = 0; }
            if (c === void 0) { c = false; }
            //batcher相关的都和我无关
            this.states |= (value & ~12 /* batch */); //本层不需要batcher对象识别
            if (undefined != this.parent) {
                if (value & 3 /* ta */) {
                    value |= 16 /* ct */; //如果本层transform or alpha 改变了 那就得通知上层
                }
                if (value & 32 /* area */) {
                    value |= 64 /* ca */; //如果本层hitArea改变了 那就得通知上层
                }
                this.parent.setChange(/*给batcher用的*/ value & 12 /* batch */, /*给顶层通知说下层有情况用的*/ value & 80 /* c_all */, true);
            }
        };
        Object.defineProperty(DisplayObject.prototype, "visible", {
            get: function () { return this._visible; },
            set: function (value) {
                if (this._visible != value) {
                    this._visible = value;
                    this.setChange(4 /* vertex */);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "alpha", {
            get: function () {
                return this._alpha;
            },
            set: function (value) {
                if (this._alpha == value) {
                    return;
                }
                var vertex = 0;
                if (this._alpha <= 0 || value == 0) {
                    vertex |= 4 /* vertex */;
                }
                this._alpha = value;
                this.setChange(vertex | 2 /* alpha */ | 8 /* vcdata */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "scaleX", {
            get: function () { return this._scaleX; },
            set: function (value) {
                if (this._scaleX == value)
                    return;
                this._scaleX = value;
                this.sca.x = value;
                this.setChange(1 /* trasnform */ | 8 /* vcdata */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "scaleY", {
            get: function () { return this._scaleY; },
            set: function (value) { this._scaleY = value; this.sca.y = value; this.setChange(1 /* trasnform */); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "scaleZ", {
            get: function () { return this._scaleZ; },
            set: function (value) { this._scaleZ = value; this.sca.z = value; this.setChange(1 /* trasnform */); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "rotationX", {
            get: function () { return this._rotationX * rf.RADIANS_TO_DEGREES; },
            set: function (value) {
                value %= 360;
                value *= rf.DEGREES_TO_RADIANS;
                if (value == this._rotationX)
                    return;
                this._rotationX = value;
                this.rot.x = value;
                this.setChange(1 /* trasnform */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "rotationY", {
            get: function () { return this._rotationY * rf.RADIANS_TO_DEGREES; },
            set: function (value) {
                value %= 360;
                value *= rf.DEGREES_TO_RADIANS;
                if (value == this._rotationY)
                    return;
                this._rotationY = value;
                this.rot.y = value;
                this.setChange(1 /* trasnform */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "rotationZ", {
            get: function () { return this._rotationZ * rf.RADIANS_TO_DEGREES; },
            set: function (value) {
                value %= 360;
                value *= rf.DEGREES_TO_RADIANS;
                if (value == this._rotationZ)
                    return;
                this._rotationZ = value;
                this.rot.z = value;
                this.setChange(1 /* trasnform */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "x", {
            get: function () { return this._x; },
            set: function (value) {
                if (value == this._x)
                    return;
                this._x = value;
                this.pos.x = value;
                this.setChange(1 /* trasnform */ | 8 /* vcdata */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "y", {
            get: function () { return this._y; },
            set: function (value) {
                if (value == this._y)
                    return;
                this._y = value;
                this.pos.y = value;
                this.setChange(1 /* trasnform */ | 8 /* vcdata */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "z", {
            get: function () { return this._z; },
            set: function (value) {
                if (value == this._z)
                    return;
                this._z = value;
                this.pos.z = value;
                this.setChange(1 /* trasnform */);
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.setPos = function (x, y, z, update) {
            if (z === void 0) { z = 0; }
            if (update === void 0) { update = true; }
            this.pos.x = this._x = x;
            this.pos.y = this._y = y;
            this.pos.z = this._z = z;
            if (update) {
                this.setChange(1 /* trasnform */ | 8 /* vcdata */);
            }
        };
        Object.defineProperty(DisplayObject.prototype, "eulers", {
            set: function (value) {
                this._rotationX = value.x * rf.DEGREES_TO_RADIANS;
                this._rotationY = value.y * rf.DEGREES_TO_RADIANS;
                this._rotationZ = value.z * rf.DEGREES_TO_RADIANS;
                this.setChange(1 /* trasnform */);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 当前方向Z轴移动
         * @param distance
         *
         */
        DisplayObject.prototype.forwardPos = function (distance, target) {
            var pos = this.pos;
            this.transform.m3_copyColumnTo(2, rf.tempAxeX);
            rf.tempAxeX.v3_normalize();
            if (undefined != target) {
                pos.x = -rf.tempAxeX.x * distance + target.x;
                pos.y = -rf.tempAxeX.y * distance + target.y;
                pos.z = -rf.tempAxeX.z * distance + target.z;
            }
            else {
                pos.x += rf.tempAxeX.x * distance;
                pos.y += rf.tempAxeX.y * distance;
                pos.z += rf.tempAxeX.z * distance;
            }
            this._x = pos.x;
            this._y = pos.y;
            this._z = pos.z;
            this.setChange(1 /* trasnform */ | 8 /* vcdata */);
        };
        /**
         * 当前方向Y轴移动
         * @param distance
         *
         */
        DisplayObject.prototype.upPos = function (distance) {
            this.transform.m3_copyColumnTo(1, rf.tempAxeX);
            rf.tempAxeX.v3_normalize();
            this.pos.x += rf.tempAxeX.x * distance;
            this.pos.y += rf.tempAxeX.y * distance;
            this.pos.z += rf.tempAxeX.z * distance;
            this._x = this.pos.x;
            this._y = this.pos.y;
            this._z = this.pos.z;
            this.setChange(1 /* trasnform */ | 8 /* vcdata */);
        };
        /**
         * 当前方向X轴移动
         * @param distance
         *
         */
        DisplayObject.prototype.rightPos = function (distance) {
            this.transform.m3_copyColumnTo(0, rf.tempAxeX);
            rf.tempAxeX.v3_normalize();
            this.pos.x += rf.tempAxeX.x * distance;
            this.pos.y += rf.tempAxeX.y * distance;
            this.pos.z += rf.tempAxeX.z * distance;
            this._x = this.pos.x;
            this._y = this.pos.y;
            this._z = this.pos.z;
            this.setChange(1 /* trasnform */ | 8 /* vcdata */);
        };
        /**
         *
         * @param rx
         * @param ry
         * @param rz
         *
         */
        DisplayObject.prototype.setRot = function (rx, ry, rz, update) {
            if (update === void 0) { update = true; }
            this.rot.x = this._rotationX = rx * rf.DEGREES_TO_RADIANS;
            this.rot.y = this._rotationY = ry * rf.DEGREES_TO_RADIANS;
            this.rot.z = this._rotationZ = rz * rf.DEGREES_TO_RADIANS;
            if (update) {
                this.setChange(1 /* trasnform */);
            }
        };
        /**
         *
         * @param rx
         * @param ry
         * @param rz
         *
         */
        DisplayObject.prototype.setRotRadians = function (rx, ry, rz, update) {
            if (update === void 0) { update = true; }
            this.rot.x = this._rotationX = rx;
            this.rot.y = this._rotationY = ry;
            this.rot.z = this._rotationZ = rz;
            if (update) {
                this.setChange(1 /* trasnform */);
            }
        };
        Object.defineProperty(DisplayObject.prototype, "scale", {
            get: function () {
                if (this._scaleX == this._scaleY && this._scaleX == this._scaleZ) {
                    return this._scaleX;
                }
                return 1;
            },
            set: function (value) {
                this.setSca(value, value, value);
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.setSca = function (sx, sy, sz, update) {
            if (update === void 0) { update = true; }
            this.sca.x = this._scaleX = sx;
            this.sca.y = this._scaleY = sy;
            this.sca.z = this._scaleZ = sz;
            if (update) {
                this.setChange(1 /* trasnform */ | 8 /* vcdata */);
            }
        };
        DisplayObject.prototype.setPivotPonumber = function (x, y, z) {
            if (undefined == this.pivotPonumber) {
                this.pivotPonumber = rf.newVector3D();
            }
            ;
            this.pivotPonumber.x = x;
            this.pivotPonumber.y = y;
            this.pivotPonumber.z = z;
            this.pivotZero = (x != 0 || y != 0 || z != 0);
        };
        DisplayObject.prototype.setTransform = function (matrix) {
            var _a = this, transform = _a.transform, pos = _a.pos, rot = _a.rot, sca = _a.sca;
            transform.set(matrix);
            transform.m3_decompose(pos, rot, sca);
            this._x = pos.x;
            this._y = pos.y;
            this._z = pos.z;
            this._rotationX = rot.x;
            this._rotationY = rot.y;
            this._rotationZ = rot.z;
            this._scaleX = sca.x;
            this._scaleY = sca.y;
            this._scaleZ = sca.z;
            this.setChange(1 /* trasnform */ | 8 /* vcdata */);
        };
        /**
         *
         */
        DisplayObject.prototype.updateTransform = function () {
            var transform = this.transform;
            if (this.pivotZero) {
                var pivotPonumber = this.pivotPonumber;
                transform.m3_identity();
                transform.m3_translation(-pivotPonumber.x, -pivotPonumber.y, -pivotPonumber.z);
                transform.m3_scale(this._scaleX, this._scaleY, this._scaleZ);
                transform.m3_translation(this._x, this._y, this._z);
                transform.m3_translation(pivotPonumber.x, pivotPonumber.y, pivotPonumber.z);
            }
            else {
                transform.m3_recompose(this.pos, this.rot, this.sca);
            }
            this.states &= ~1 /* trasnform */;
        };
        /**
         *
         *
         */
        DisplayObject.prototype.updateSceneTransform = function (sceneTransform) {
            this.sceneTransform.set(this.transform);
            this.sceneTransform.m3_append(sceneTransform);
        };
        DisplayObject.prototype.updateAlpha = function (sceneAlpha) {
            this.sceneAlpha = this.sceneAlpha * this._alpha;
            this.states &= ~2 /* alpha */;
        };
        DisplayObject.prototype.remove = function () {
            if (this.parent) {
                this.parent.removeChild(this);
            }
        };
        DisplayObject.prototype.addToStage = function () { };
        ;
        DisplayObject.prototype.removeFromStage = function () { };
        ;
        DisplayObject.prototype.setSize = function (width, height) {
            this._width = width;
            this._height = height;
            this.invalidate();
        };
        DisplayObject.prototype.invalidate = function (func) {
            if (func === void 0) { func = null; }
            rf.ROOT.addEventListener(1 /* ENTER_FRAME */, this.onInvalidate, this);
            if (null == func) {
                func = this.doResize;
            }
            if (this.invalidateFuncs.indexOf(func) == -1) {
                this.invalidateFuncs.push(func);
            }
        };
        DisplayObject.prototype.invalidateRemove = function (func) {
            if (func === void 0) { func = null; }
            if (null == func) {
                func = this.doResize;
            }
            var i = this.invalidateFuncs.indexOf(func);
            if (i != -1) {
                this.invalidateFuncs.splice(i, 1);
                if (!this.invalidateFuncs.length) {
                    rf.ROOT.removeEventListener(1 /* ENTER_FRAME */, this.onInvalidate);
                }
            }
        };
        DisplayObject.prototype.onInvalidate = function (event) {
            event.currentTarget.off(1 /* ENTER_FRAME */, this.onInvalidate);
            var arr = this.invalidateFuncs.concat();
            this.invalidateFuncs.length = 0;
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var func = arr_1[_i];
                func();
            }
        };
        DisplayObject.prototype.doResize = function () { };
        //==============================================================
        DisplayObject.prototype.dispatchEvent = function (event) {
            var bool = false;
            if (undefined != this.mEventListeners && event.type in this.mEventListeners) {
                bool = _super.prototype.dispatchEvent.call(this, event);
            }
            if (false == event.stopImmediatePropagation && event.bubbles) {
                if (this.parent) {
                    this.parent.dispatchEvent(event);
                }
            }
            return bool;
        };
        DisplayObject.prototype.updateHitArea = function () {
            this.states &= ~96 /* ac */;
        };
        DisplayObject.prototype.getObjectByPoint = function (dx, dy, scale) {
            var area = this.hitArea;
            if (undefined == area) {
                return undefined;
            }
            if (area.checkIn(dx, dy, this._scaleX * scale) == true) {
                return this;
            }
            return undefined;
        };
        Object.defineProperty(DisplayObject.prototype, "mouseX", {
            get: function () {
                return rf.nativeMouseX - this.sceneTransform[12];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "mouseY", {
            get: function () {
                return rf.nativeMouseY - this.sceneTransform[13];
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.render = function (camera, now, interval, target) {
        };
        DisplayObject.prototype.lookat = function (target, upAxis) {
            if (upAxis === void 0) { upAxis = null; }
            var xAxis = rf.tempAxeX;
            var yAxis = rf.tempAxeY;
            var zAxis = rf.tempAxeZ;
            var _a = this, transform = _a.transform, _scaleX = _a._scaleX, _scaleY = _a._scaleY, _scaleZ = _a._scaleZ, _x = _a._x, _y = _a._y, _z = _a._z, rot = _a.rot;
            if (undefined == upAxis) {
                upAxis = rf.Y_AXIS;
            }
            upAxis = transform.m3_transformVector(upAxis, rf.TEMP_VECTOR3D);
            zAxis.x = target.x - _x;
            zAxis.y = target.y - _y;
            zAxis.z = target.z - _z;
            zAxis.v3_normalize();
            xAxis.x = upAxis.y * zAxis.z - upAxis.z * zAxis.y;
            xAxis.y = upAxis.z * zAxis.x - upAxis.x * zAxis.z;
            xAxis.z = upAxis.x * zAxis.y - upAxis.y * zAxis.x;
            xAxis.v3_normalize();
            if (xAxis.v3_length < .05) {
                xAxis.x = upAxis.y;
                xAxis.y = upAxis.x;
                xAxis.z = 0;
                xAxis.v3_normalize();
            }
            yAxis.x = zAxis.y * xAxis.z - zAxis.z * xAxis.y;
            yAxis.y = zAxis.z * xAxis.x - zAxis.x * xAxis.z;
            yAxis.z = zAxis.x * xAxis.y - zAxis.y * xAxis.x;
            var raw = transform;
            raw[0] = _scaleX * xAxis.x;
            raw[1] = _scaleX * xAxis.y;
            raw[2] = _scaleX * xAxis.z;
            raw[3] = 0;
            raw[4] = _scaleY * yAxis.x;
            raw[5] = _scaleY * yAxis.y;
            raw[6] = _scaleY * yAxis.z;
            raw[7] = 0;
            raw[8] = _scaleZ * zAxis.x;
            raw[9] = _scaleZ * zAxis.y;
            raw[10] = _scaleZ * zAxis.z;
            raw[11] = 0;
            raw[12] = _x;
            raw[13] = _y;
            raw[14] = _z;
            raw[15] = 1;
            // if (zAxis.z < 0) {
            // 	this.rotationY = (180 - this.rotationY);
            // 	this.rotationX -= 180;
            // 	this.rotationZ -= 180;
            // }
            transform.m3_decompose(undefined, rot, undefined);
            // let v = transform.decompose();
            // xAxis = v[1];
            this._rotationX = rot.x;
            this._rotationY = rot.y;
            this._rotationZ = rot.z;
            this.setChange(1 /* trasnform */);
        };
        Object.defineProperty(DisplayObject.prototype, "width", {
            get: function () {
                return this._width == undefined ? this.w : this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "height", {
            get: function () {
                return this._height == undefined ? this.h : this._height;
            },
            enumerable: true,
            configurable: true
        });
        return DisplayObject;
    }(rf.MiniDispatcher));
    rf.DisplayObject = DisplayObject;
})(rf || (rf = {}));
///<reference path="./DisplayObject.ts" />
var rf;
(function (rf) {
    var DisplayObjectContainer = /** @class */ (function (_super) {
        __extends(DisplayObjectContainer, _super);
        function DisplayObjectContainer() {
            var _this = _super.call(this) || this;
            _this.childrens = [];
            return _this;
        }
        DisplayObjectContainer.prototype.setChange = function (value, p, c) {
            if (p === void 0) { p = 0; }
            if (c === void 0) { c = false; }
            if (true == c) {
                this.states |= p;
                if (this.parent) {
                    this.parent.setChange(value, p, true);
                }
            }
            else {
                _super.prototype.setChange.call(this, value);
            }
        };
        Object.defineProperty(DisplayObjectContainer.prototype, "numChildren", {
            get: function () {
                return this.childrens.length;
            },
            enumerable: true,
            configurable: true
        });
        DisplayObjectContainer.prototype.addChild = function (child) {
            if (undefined == child || child == this)
                return;
            var childrens = this.childrens;
            var i = childrens.indexOf(child);
            if (i == -1) {
                if (child.parent)
                    child.remove();
                childrens.push(child);
                child.parent = this;
                child.setChange(35 /* base */);
                if (this.stage) {
                    if (!child.stage) {
                        child.stage = this.stage;
                        child.addToStage();
                    }
                }
            }
            else {
                childrens.splice(i, 1);
                childrens.push(child);
            }
            //需要更新Transform
        };
        DisplayObjectContainer.prototype.addChildAt = function (child, index) {
            if (undefined == child || child == this)
                return;
            if (child.parent)
                child.remove();
            if (index < 0) {
                index = 0;
            }
            else if (index > this.childrens.length) {
                index = this.childrens.length;
            }
            this.childrens.splice(index, 0, child);
            child.parent = this;
            //需要更新Transform
            child.setChange(35 /* base */);
            if (this.stage) {
                if (!child.stage) {
                    child.stage = this.stage;
                    child.addToStage();
                }
            }
        };
        DisplayObjectContainer.prototype.getChildIndex = function (child) {
            return this.childrens.indexOf(child);
        };
        DisplayObjectContainer.prototype.removeChild = function (child) {
            if (undefined == child) {
                return;
            }
            var i = this.childrens.indexOf(child);
            if (i == -1) {
                return;
            }
            this.childrens.splice(i, 1);
            child.stage = undefined;
            child.parent = undefined;
            this.setChange(12 /* batch */);
            child.removeFromStage();
        };
        DisplayObjectContainer.prototype.removeAllChild = function () {
            var childrens = this.childrens;
            var len = childrens.length;
            for (var i = 0; i < len; i++) {
                var child = childrens[i];
                child.stage = undefined;
                child.parent = undefined;
                child.removeFromStage();
            }
            if (len > 0) {
                this.setChange(12 /* batch */);
            }
            this.childrens.length = 0;
        };
        DisplayObjectContainer.prototype.removeFromStage = function () {
            var childrens = this.childrens;
            var len = childrens.length;
            for (var i = 0; i < len; i++) {
                var child = childrens[i];
                child.stage = undefined;
                child.removeFromStage();
            }
            _super.prototype.removeFromStage.call(this);
        };
        DisplayObjectContainer.prototype.addToStage = function () {
            var _a = this, childrens = _a.childrens, stage = _a.stage;
            var len = childrens.length;
            for (var i = 0; i < len; i++) {
                var child = childrens[i];
                child.stage = stage;
                child.addToStage();
            }
            _super.prototype.addToStage.call(this);
        };
        /**
         * 讲真  这块更新逻辑还没有到最优化的结果 判断不会写了
         */
        DisplayObjectContainer.prototype.updateTransform = function () {
            var states = this.states;
            if (states & 1 /* trasnform */) {
                //如果自己的transform发生了变化
                //  step1 : 更新自己的transform
                //  step2 : 全部子集都要更新sceneTransform;
                _super.prototype.updateTransform.call(this);
                this.updateSceneTransform();
            }
            if (states & 2 /* alpha */) {
                this.updateAlpha(this.parent.sceneAlpha);
            }
            if (states & 16 /* ct */) {
                for (var _i = 0, _a = this.childrens; _i < _a.length; _i++) {
                    var child = _a[_i];
                    if (child instanceof DisplayObjectContainer) {
                        if (child.states & 19 /* t_all */) {
                            child.updateTransform();
                        }
                    }
                    else {
                        if (child.states & 1 /* trasnform */) {
                            child.updateTransform();
                            child.updateSceneTransform(this.sceneTransform);
                        }
                        if (child.states & 2 /* alpha */) {
                            child.updateAlpha(this.sceneAlpha);
                        }
                    }
                }
                this.states &= ~16 /* ct */;
            }
        };
        DisplayObjectContainer.prototype.updateSceneTransform = function () {
            this.sceneTransform.set(this.transform);
            if (this.parent)
                this.sceneTransform.m3_append(this.parent.sceneTransform);
            for (var _i = 0, _a = this.childrens; _i < _a.length; _i++) {
                var child = _a[_i];
                if ((child.states & 1 /* trasnform */) != 0) {
                    //这里不更新其transform 是因为后续有人来让其更新
                    child.updateSceneTransform(this.sceneTransform);
                }
            }
        };
        DisplayObjectContainer.prototype.updateAlpha = function (sceneAlpha) {
            this.sceneAlpha = sceneAlpha * this._alpha;
            for (var _i = 0, _a = this.childrens; _i < _a.length; _i++) {
                var child = _a[_i];
                child.updateAlpha(this.sceneAlpha);
            }
            this.states &= ~2 /* alpha */;
        };
        DisplayObjectContainer.prototype.updateHitArea = function () {
            var hitArea = this.hitArea;
            if (hitArea) {
                hitArea.clean();
                for (var _i = 0, _a = this.childrens; _i < _a.length; _i++) {
                    var child = _a[_i];
                    var hit = child.hitArea;
                    if (undefined == hit)
                        continue;
                    if (child.states & 96 /* ac */) {
                        child.updateHitArea();
                    }
                    hitArea.combine(hit, child._x, child._y);
                }
            }
            this.states &= ~96 /* ac */;
        };
        return DisplayObjectContainer;
    }(rf.DisplayObject));
    rf.DisplayObjectContainer = DisplayObjectContainer;
})(rf || (rf = {}));
///<reference path="../display/DisplayObject.ts" />
var rf;
(function (rf) {
    var Camera = /** @class */ (function (_super) {
        __extends(Camera, _super);
        function Camera(far) {
            if (far === void 0) { far = 10000; }
            var _this = _super.call(this) || this;
            _this.far = far;
            _this.originFar = far / Math.PI2;
            _this.len = rf.newMatrix3D();
            _this.worldTranform = rf.newMatrix3D();
            return _this;
        }
        Camera.prototype.resize = function (width, height) { };
        Camera.prototype.updateSceneTransform = function (sceneTransform) {
            if (this.states | 1 /* trasnform */) {
                this.updateTransform();
                this.sceneTransform.set(this.transform);
                this.sceneTransform.m3_invert();
                this.worldTranform.set(this.sceneTransform);
                this.worldTranform.m3_append(this.len);
                this.states &= ~1 /* trasnform */;
            }
        };
        return Camera;
    }(rf.DisplayObject));
    rf.Camera = Camera;
    var CameraUI = /** @class */ (function (_super) {
        __extends(CameraUI, _super);
        function CameraUI() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CameraUI.prototype.resize = function (width, height) {
            this.w = width;
            this.h = height;
            var rawData = this.len;
            rawData[0] = 2 / width;
            rawData[1] = 0;
            rawData[2] = 0;
            rawData[3] = 0;
            rawData[4] = 0;
            rawData[5] = -2 / height;
            rawData[6] = 0;
            rawData[7] = 0;
            rawData[8] = 0;
            rawData[9] = 0;
            rawData[10] = 1 / this.far;
            rawData[11] = 0;
            rawData[12] = -1;
            rawData[13] = 1;
            rawData[14] = 0;
            rawData[15] = 1;
            this.states |= 1 /* trasnform */;
        };
        return CameraUI;
    }(Camera));
    rf.CameraUI = CameraUI;
    // Orthographic Projection
    var CameraOrth = /** @class */ (function (_super) {
        __extends(CameraOrth, _super);
        function CameraOrth() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CameraOrth.prototype.resize = function (width, height) {
            this.w = width;
            this.h = height;
            var rawData = this.len;
            rawData[0] = 2 / width;
            rawData[1] = 0;
            rawData[2] = 0;
            rawData[3] = 0;
            rawData[4] = 0;
            rawData[5] = 2 / height;
            rawData[6] = 0;
            rawData[7] = 0;
            rawData[8] = 0;
            rawData[9] = 0;
            rawData[10] = 1 / this.far;
            rawData[11] = 0;
            rawData[12] = 0;
            rawData[13] = 0;
            rawData[14] = -1 / this.far * Math.PI * 100;
            rawData[15] = 1;
            this.states |= 1 /* trasnform */;
        };
        return CameraOrth;
    }(Camera));
    rf.CameraOrth = CameraOrth;
    //  Perspective Projection Matrix
    var Camera3D = /** @class */ (function (_super) {
        __extends(Camera3D, _super);
        function Camera3D() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Camera3D.prototype.resize = function (width, height) {
            this.w = width;
            this.h = height;
            var zNear = 0.1;
            var zFar = this.far;
            // let len = new PerspectiveMatrix3D();
            // len.perspectiveFieldOfViewLH(45,width/height,0.1,10000);
            // len.perspectiveFieldOfViewRH(45,width/height,0.1,10000);
            // this.len = len;
            // len.transpose();
            // xScale, 0.0, 0.0, 0.0,
            // 0.0, yScale, 0.0, 0.0,
            // 0.0, 0.0, (zFar + zNear) / (zFar - zNear), 1.0,
            // 0.0, 0.0, 2.0 * zFar * zNear / (zNear - zFar), 0.0
            // (zFar + zNear) / (zFar - zNear)
            // 2.0 * zFar * zNear / (zNear - zFar)
            // this.len = len;
            var rawData = this.len;
            // let yScale: number = 1.0 / Math.tan(45 / 2.0);
            // let xScale: number = yScale / width * height;
            // rawData[0] = xScale;        rawData[1] = 0;                   rawData[2] = 0;                                       rawData[3] = 0;
            // rawData[4] = 0;             rawData[5] = yScale;              rawData[6] = 0;                                       rawData[7] = 0;
            // rawData[8] = 0;             rawData[9] = 0;                   rawData[10] = (zFar + zNear) / (zFar - zNear);        rawData[11] = 1.0;
            // rawData[12] = 0;            rawData[13] = 0;                  rawData[14] = 2.0 * zFar * zNear / (zNear - zFar);    rawData[15] = 0;
            rawData[0] = 2 / width;
            rawData[1] = 0;
            rawData[2] = 0;
            rawData[3] = 0;
            rawData[4] = 0;
            rawData[5] = 2 / height;
            rawData[6] = 0;
            rawData[7] = 0;
            rawData[8] = 0;
            rawData[9] = 0;
            rawData[10] = 1 / this.far;
            rawData[11] = 1 / this.originFar;
            rawData[12] = 0;
            rawData[13] = 0;
            rawData[14] = -1 / this.far * Math.PI * 100;
            rawData[15] = 0;
            this.states |= 1 /* trasnform */;
        };
        return Camera3D;
    }(Camera));
    rf.Camera3D = Camera3D;
})(rf || (rf = {}));
var rf;
(function (rf) {
    function newFilterBase(target, type) {
        return { type: type, target: target };
    }
    rf.newFilterBase = newFilterBase;
})(rf || (rf = {}));
///<reference path="./DisplayObjectContainer.ts" />
///<reference path="../camera/Camera.ts" />
///<reference path="./Filter.ts" />
var rf;
(function (rf) {
    var RenderBase = /** @class */ (function (_super) {
        __extends(RenderBase, _super);
        function RenderBase(variables) {
            var _this = _super.call(this) || this;
            _this.nativeRender = false;
            _this.tm = rf.defaultTimeMixer;
            _this.variables = variables;
            return _this;
        }
        // triangleFaceToCull: string = Context3DTriangleFace.NONE;
        // sourceFactor: number;
        // destinationFactor: number;
        // depthMask: boolean = false;
        // passCompareMode: number;
        RenderBase.prototype.render = function (camera, now, interval) {
            var i = 0;
            var childrens = this.childrens;
            var len = childrens.length;
            for (i = 0; i < len; i++) {
                var child = childrens[i];
                child.render(camera, now, interval);
            }
        };
        RenderBase.prototype.addToStage = function () {
            _super.prototype.addToStage.call(this);
            this.setChange(4 /* vertex */);
        };
        return RenderBase;
    }(rf.DisplayObjectContainer));
    rf.RenderBase = RenderBase;
    var Sprite = /** @class */ (function (_super) {
        __extends(Sprite, _super);
        function Sprite(source, variables) {
            var _this = _super.call(this) || this;
            _this.$graphics = undefined;
            _this.$batchGeometry = undefined;
            _this.$vcIndex = -1;
            _this.$vcox = 0;
            _this.$vcoy = 0;
            _this.$vcos = 1;
            _this.hitArea = new rf.HitArea();
            _this.source = source ? source : rf.componentSource;
            _this.variables = variables ? variables : rf.vertex_ui_variable;
            _this.mouseChildren = true;
            _this.mouseEnabled = true;
            return _this;
        }
        Object.defineProperty(Sprite.prototype, "graphics", {
            get: function () {
                if (undefined == this.$graphics) {
                    this.$graphics = new Graphics(this, rf.vertex_ui_variable);
                }
                return this.$graphics;
            },
            enumerable: true,
            configurable: true
        });
        Sprite.prototype.setChange = function (value, p, c) {
            if (p === void 0) { p = 0; }
            if (c === void 0) { c = false; }
            if (undefined != this.renderer) {
                this.states |= (value | p);
            }
            else {
                _super.prototype.setChange.call(this, value, p, c);
            }
        };
        Sprite.prototype.render = function (camera, now, interval) {
            if (undefined != this.renderer) {
                if (this.states & 19 /* t_all */) { //如果本层或者下层有transform alpha 改编 那就进入updateTransform吧
                    this.updateTransform();
                }
                this.renderer.render(camera, now, interval);
            }
        };
        Sprite.prototype.addToStage = function () {
            if (this.$graphics && this.$graphics.numVertices) {
                this.setChange(4 /* vertex */);
            }
            if (this.renderer) {
                if (this.parent) {
                    this.parent.setChange(4 /* vertex */);
                }
            }
            _super.prototype.addToStage.call(this);
        };
        Sprite.prototype.cleanAll = function () {
            if (this.childrens.length) {
                this.removeAllChild();
            }
            var g = this.$graphics;
            if (g && g.numVertices > 0) {
                g.clear();
                g.end();
            }
        };
        Sprite.prototype.updateHitArea = function () {
            var hitArea = this.hitArea;
            hitArea.clean();
            for (var _i = 0, _a = this.childrens; _i < _a.length; _i++) {
                var child = _a[_i];
                if (child.states & 96 /* ac */) {
                    child.updateHitArea();
                }
                hitArea.combine(child.hitArea, child._x, child._y);
            }
            if (this.$graphics) {
                hitArea.combine(this.$graphics.hitArea, 0, 0);
            }
            // if(hitArea.allWays){
            //     this.w = stageWidth;
            //     this.h = stageHeight;
            // }else{
            this.w = hitArea.right - hitArea.left;
            this.h = hitArea.bottom - hitArea.top;
            // }
            this.states &= ~96 /* ac */;
        };
        Sprite.prototype.getObjectByPoint = function (dx, dy, scale) {
            if (this.mouseEnabled == false && this.mouseChildren == false) {
                return undefined;
            }
            if (this.states & 96 /* ac */) {
                this.updateHitArea();
            }
            dx -= this._x;
            dy -= this._y;
            scale *= this._scaleX;
            if (this.hitArea.checkIn(dx, dy, scale) == true) {
                if (this.mouseChildren) {
                    var children = this.childrens;
                    var len = children.length;
                    for (var i = len - 1; i >= 0; i--) {
                        var child = children[i];
                        var d = child.getObjectByPoint(dx, dy, scale);
                        if (undefined != d) {
                            return d;
                        }
                    }
                }
                if (this.mouseEnabled) {
                    if (this.hitArea.allWays) {
                        return this;
                    }
                    if (this.hitArea.checkIn(dx, dy, scale) == true) {
                        return this;
                    }
                    // let g = this.$graphics;
                    // if(undefined != g){
                    //     if( g.hitArea.checkIn(dx,dy,scale) == true ){
                    //         return this;
                    //     }
                    // }
                }
            }
            return undefined;
        };
        return Sprite;
    }(RenderBase));
    rf.Sprite = Sprite;
    var Image = /** @class */ (function (_super) {
        __extends(Image, _super);
        function Image(source) {
            return _super.call(this, source) || this;
        }
        Image.prototype.load = function (url) {
            if (this._url == url) {
                return;
            }
            //clear
            if (url) {
                this._url = url;
                rf.loadRes(url, this.onImageComplete, this, 3 /* image */);
            }
        };
        Image.prototype.onImageComplete = function (e) {
            if (e.type != 4 /* COMPLETE */) {
                return;
            }
            var res = e.data;
            var image = res.data;
            var source = this.source;
            var vo = source.setSourceVO(this._url, image.width, image.height, 1);
            source.drawimg(image, vo.x, vo.y);
            var g = this.graphics;
            g.clear();
            g.drawBitmap(0, 0, vo);
            g.end();
        };
        return Image;
    }(Sprite));
    rf.Image = Image;
    var IconView = /** @class */ (function (_super) {
        __extends(IconView, _super);
        function IconView(source) {
            var _this = _super.call(this, source) || this;
            _this.isReady = false;
            return _this;
        }
        IconView.prototype.setUrl = function (url) {
            if (url == null) {
                var g = this.graphics;
                g.clear();
                g.end();
                return;
            }
            this.isReady = false;
            this.load(url);
        };
        IconView.prototype.resetSize = function (_width, _height) {
            this.drawW = _width;
            this.drawH = _height;
            if (this.isReady && this.img) {
                this._draw(this.img);
            }
        };
        IconView.prototype.onImageComplete = function (e) {
            if (e.type != 4 /* COMPLETE */) {
                this.drawFault();
                return;
            }
            var res = e.data;
            this.img = res.data;
            this._draw(this.img);
            this.simpleDispatch(4 /* COMPLETE */);
            this.isReady = true;
        };
        IconView.prototype._draw = function (img) {
            if (!this._url) {
                return;
            }
            // var matrix = new Matrix();
            // matrix.identity();
            var dw = this.drawW;
            var dh = this.drawH;
            // if(dw && dh)
            // {
            //    if(dw != img.width || dh != img.height)
            //    {
            //     //    matrix.scale(dw / img.width,dh / img.height);
            //    }
            // }else{
            //     dw = img.width;
            //     dh = img.height;
            // }
            if (!dw || !dh) {
                dw = img.width;
                dh = img.height;
            }
            var source = this.source;
            var vo = source.setSourceVO(this._url, img.width, img.height, 1);
            // source.bmd.context.drawImage(img,vo.x,vo.y);
            source.drawimg(img, vo.x, vo.y, dw, dh);
            var g = this.graphics;
            g.clear();
            g.drawBitmap(0, 0, vo);
            // g.drawBitmap(0,0,vo,0xFFFFFF,matrix.rawData);
            g.end();
        };
        IconView.prototype.drawFault = function () {
            var g = this.graphics;
            g.clear();
            g.end();
            this.img = null;
            this.simpleDispatch(14 /* ERROR */);
        };
        return IconView;
    }(Image));
    rf.IconView = IconView;
    var Graphics = /** @class */ (function () {
        function Graphics(target, variables) {
            this.numVertices = 0;
            this.$batchOffset = 0;
            this.preNumVertices = 0;
            this.target = target;
            // this.byte = new Float32Byte(new Float32Array(0));
            this.numVertices = 0;
            this.hitArea = new rf.HitArea();
        }
        Graphics.prototype.clear = function () {
            this.preNumVertices = this.numVertices;
            this.numVertices = 0;
            this.byte = undefined;
            this.hitArea.clean();
        };
        Graphics.prototype.end = function () {
            var target = this.target;
            var change = 0;
            if (this.numVertices > 0) {
                var float = rf.createGeometry(rf.empty_float32_object, target.variables, this.numVertices);
                this.byte = float;
                if (target.$batchGeometry && this.preNumVertices == this.numVertices) {
                    target.$batchGeometry.update(this.$batchOffset, float);
                }
                else {
                    change |= 4 /* vertex */;
                }
                if (target.hitArea.combine(this.hitArea, 0, 0)) {
                    change |= 32 /* area */;
                }
            }
            else {
                change |= (4 /* vertex */ | 32 /* area */);
            }
            if (change > 0) {
                target.setChange(change);
            }
        };
        Graphics.prototype.addPoint = function (pos, noraml, uv, color) {
            var variables = this.target.variables;
            var numVertices = this.numVertices;
            function set(variable, array, data) {
                if (undefined == data || undefined == variable) {
                    return;
                }
                var size = variable.size;
                var offset = numVertices * size;
                if (data.length == size) {
                    array.set(data, offset);
                }
                else {
                    array.set(data.slice(0, size), offset);
                }
                // for(let i = 0;i<size;i++){
                //     array[offset + i] = data[i];
                // }
            }
            set(variables["pos" /* pos */], rf.empty_float32_pos, pos);
            set(variables["normal" /* normal */], rf.empty_float32_normal, noraml);
            set(variables["uv" /* uv */], rf.empty_float32_uv, uv);
            set(variables["color" /* color */], rf.empty_float32_color, color);
            this.hitArea.updateArea(pos[0], pos[1], pos[2]);
            this.numVertices++;
        };
        Graphics.prototype.drawRect = function (x, y, width, height, color, alpha, matrix, z) {
            if (alpha === void 0) { alpha = 1; }
            if (matrix === void 0) { matrix = undefined; }
            if (z === void 0) { z = 0; }
            var _a = this.target.source, originU = _a.originU, originV = _a.originV;
            var rgba = [
                ((color & 0x00ff0000) >>> 16) / 0xFF,
                ((color & 0x0000ff00) >>> 8) / 0xFF,
                (color & 0x000000ff) / 0xFF,
                alpha
            ];
            var uv = [originU, originV, this.target.$vcIndex];
            var noraml = [0, 0, 1];
            var r = x + width;
            var b = y + height;
            var f = rf.m2dTransform;
            var p = [0, 0, 0];
            var points = [x, y, r, y, r, b, x, b];
            for (var i = 0; i < 8; i += 2) {
                p[0] = points[i];
                p[1] = points[i + 1];
                p[2] = z;
                if (undefined != matrix) {
                    f(matrix, p, p);
                }
                this.addPoint(p, noraml, uv, rgba);
            }
            // let position = this.byte.array.length;
            // let d = this.variables["data32PerVertex"].size;
            // let v = this.variables;
            // let f = m2dTransform;
            // let p = EMPTY_POINT2D;
            // let byte = this.byte;
            // const {originU,originV} = this.target.source;
            // this.byte.length = position + d * 4;
            // let pos = v[VA.pos];
            // let uv = v[VA.uv];
            // let vacolor = v[VA.color];
            // let normal = v[VA.normal];
            // let points = [x,y,r,y,r,b,x,b];
            // for(let i=0;i<8;i+=2){
            //     let dp = position + (i / 2) * d;
            //     p.x = points[i];
            //     p.y = points[i+1];
            //     if(undefined != matrix){
            //         f(matrix,p,p);
            //     }
            //     this.hitArea.updateArea(p.x,p.y,z);
            //     byte.wPoint3(dp+pos.offset,p.x,p.y,z)
            //     if(undefined != normal){
            //         byte.wPoint3(dp+normal.offset,0,0,1)
            //     }
            //     if(undefined != uv){
            //         byte.wPoint3(dp+uv.offset,originU,originV,0)
            //     }
            //     if(undefined != vacolor){
            //         byte.wPoint4(dp+vacolor.offset,red,green,blue,alpha)
            //     }
            //     this.numVertices += 1;
            // }
        };
        Graphics.prototype.drawBitmap = function (x, y, vo, color, matrix, alpha, z) {
            if (color === void 0) { color = 0xFFFFFF; }
            if (matrix === void 0) { matrix = undefined; }
            if (alpha === void 0) { alpha = 1; }
            if (z === void 0) { z = 0; }
            var w = vo.w, h = vo.h, ul = vo.ul, ur = vo.ur, vt = vo.vt, vb = vo.vb;
            var r = x + w;
            var b = y + h;
            var rgba = [
                ((color & 0x00ff0000) >>> 16) / 0xFF,
                ((color & 0x0000ff00) >>> 8) / 0xFF,
                (color & 0x000000ff) / 0xFF,
                alpha
            ];
            var noraml = [0, 0, 1];
            var index = this.target.$vcIndex;
            var f = rf.m2dTransform;
            var p = [0, 0, 0];
            var points = [x, y, ul, vt, r, y, ur, vt, r, b, ur, vb, x, b, ul, vb];
            for (var i = 0; i < 16; i += 4) {
                p[0] = points[i];
                p[1] = points[i + 1];
                p[2] = z;
                if (undefined != matrix) {
                    f(matrix, p, p);
                }
                this.addPoint(p, noraml, [points[i + 2], points[i + 3], index], rgba);
            }
            // let v = this.target.variables;
            // let f = m2dTransform;
            // let d = v["data32PerVertex"].size;
            // let position = this.byte.array.length;
            // this.byte.length = position + d*4;
            // let p = EMPTY_POINT2D;
            // let byte = this.byte;
            // let pos = v[VA.pos];
            // let uv = v[VA.uv];
            // let vacolor = v[VA.color];
            // let normal = v[VA.normal];
            // let red = ((color & 0x00ff0000) >>> 16) / 0xFF;
            // let green = ((color & 0x0000ff00) >>> 8) / 0xFF;
            // let blue = (color & 0x000000ff) / 0xFF;
            // let points = [x,y,ul,vt,r,y,ur,vt,r,b,ur,vb,x,b,ul,vb];
            // for(let i=0;i<16;i+=4){
            //     let dp = position + (i / 4) * d;
            //     p.x = points[i];
            //     p.y = points[i+1];
            //     if(undefined != matrix){
            //         f(matrix,p,p);
            //     }
            //     this.hitArea.updateArea(p.x,p.y,z);
            //     byte.wPoint3(dp+pos.offset,p.x,p.y,z)
            //     if(undefined != normal){
            //         byte.wPoint3(dp+normal.offset,0,0,1)
            //     }
            //     if(undefined != uv){
            //         byte.wPoint3(dp+uv.offset,points[i+2],points[i+3],0)
            //     }
            //     if(undefined != vacolor){
            //         byte.wPoint4(dp+vacolor.offset,red,green,blue,alpha)
            //     }
            //     this.numVertices += 1;
            // }
        };
        Graphics.prototype.drawCube = function (x, y, z, width, height, deep, color, alpha) {
            if (alpha === void 0) { alpha = 1; }
            var _a = this.target.source, originU = _a.originU, originV = _a.originV;
            var rgba = [
                ((color & 0x00ff0000) >>> 16) / 0xFF,
                ((color & 0x0000ff00) >>> 8) / 0xFF,
                (color & 0x000000ff) / 0xFF,
                alpha
            ];
            var uv = [originU, originV, this.target.$vcIndex];
            var noraml = [0, 0, 1];
            var x2 = x + width;
            var y2 = y + height;
            var z2 = z + deep;
            //前
            this.addPoint([x, y, z], noraml, uv, rgba);
            this.addPoint([x2, y, z], noraml, uv, rgba);
            this.addPoint([x2, y2, z], noraml, uv, rgba);
            this.addPoint([x, y2, z], noraml, uv, rgba);
            // beginFill(0x00FF00)
            //上
            this.addPoint([x, y, z], noraml, uv, rgba);
            this.addPoint([x, y, z2], noraml, uv, rgba);
            this.addPoint([x2, y, z2], noraml, uv, rgba);
            this.addPoint([x2, y, z], noraml, uv, rgba);
            // addPoint(x,		y,		z,		0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x,		y,		z2,	0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x2,	y,		z2,		0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x2,	y,		z,		0,0,	_fr,_fg,_fb,_fa);
            //左
            //			beginFill(0x0000FF)
            // addPoint(x,		y,		z,		0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x,		y2,	z,		0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x,		y2,	z2,		0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x,		y,		z2,	0,0,	_fr,_fg,_fb,_fa);
            //右
            //			beginFill(0xFFFF00)
            // addPoint(x2,	y,		z,		0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x2,	y,		z2,	0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x2,	y2,	z2,		0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x2,	y2,	z,		0,0,	_fr,_fg,_fb,_fa);
            //后
            //			beginFill(0x00FFFF);
            // addPoint(x,		y,		z2,	0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x,		y2,	z2,	0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x2,	y2,	z2,	0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x2,	y,		z2,	0,0,	_fr,_fg,_fb,_fa);
            //下
            //			beginFill(0xFF00FF)
            // addPoint(x,		y2,	z,		0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x,		y2,	z2,	0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x2,	y2,	z2,		0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x2,	y2,	z,		0,0,	_fr,_fg,_fb,_fa);
        };
        return Graphics;
    }());
    rf.Graphics = Graphics;
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
    var BatchRenderer = /** @class */ (function () {
        function BatchRenderer(target) {
            this.geo = undefined;
            this.target = target;
            this.renders = new rf.Link();
            this.worldTransform = rf.newMatrix3D();
        }
        BatchRenderer.prototype.render = function (camera, now, interval) {
            var target = this.target;
            var c = rf.context3D;
            var _a = this.target, source = _a.source, sceneTransform = _a.sceneTransform, states = _a.states, _x = _a._x, _y = _a._y, _scaleX = _a._scaleX;
            if (undefined == source) {
                return;
            }
            var textureData = source.textureData;
            if (!textureData) {
                source.textureData = textureData = c.getTextureData(source.name);
            }
            var t = rf.context3D.textureObj[textureData.key];
            if (undefined == t) {
                t = rf.context3D.createTexture(textureData, source.bmd);
            }
            this.t = t;
            if (states & 4 /* vertex */) {
                this.cleanBatch();
                //step1 收集所有可合并对象
                this.getBatchTargets(target, -_x, -_y, 1 / _scaleX);
                //step2 合并模型 和 vc信息
                this.toBatch();
                this.geo = undefined;
                target.states &= ~12 /* batch */;
            }
            else if (states & 8 /* vcdata */) {
                //坐标发生了变化 需要更新vcdata 逻辑想不清楚  那就全部vc刷一遍吧
                this.updateVCData(target, -_x, -_y, 1 / _scaleX);
                target.states &= ~8 /* vcdata */;
            }
            if (undefined == this.program) {
                this.createProgram();
            }
            this.worldTransform.set(sceneTransform);
            this.worldTransform.m3_append(camera.worldTranform);
            var vo = this.renders.getFrist();
            while (vo) {
                if (vo.close == false) {
                    var render = vo.data;
                    if (render instanceof BatchGeometry) {
                        this.dc(render);
                    }
                    else {
                        render.render(camera, now, interval);
                    }
                }
                vo = vo.next;
            }
        };
        BatchRenderer.prototype.dc = function (geo) {
            // context3D.setBlendFactors()
            var c = rf.context3D;
            var v = geo.$vertexBuffer;
            if (undefined == v) {
                geo.$vertexBuffer = v = c.createVertexBuffer(geo.vertex, geo.vertex.data32PerVertex);
            }
            var i = c.getIndexByQuad(geo.quadcount);
            var p = this.program;
            c.setProgram(p);
            c.setProgramConstantsFromMatrix("mvp" /* mvp */, this.worldTransform);
            c.setProgramConstantsFromVector("ui" /* ui */, geo.vcData, 4);
            this.t.uploadContext(p, 0, "diff" /* diff */);
            v.uploadContext(p);
            c.drawTriangles(i, geo.quadcount * 2);
        };
        BatchRenderer.prototype.createProgram = function () {
            var chunk = rf.singleton(rf.Shader);
            var keys = {};
            keys[chunk.att_uv_ui.key] = chunk.att_uv_ui;
            keys[chunk.uni_v_mvp.key] = chunk.uni_v_mvp;
            var vcode = chunk.createVertex(undefined, keys);
            // let vcode = `
            //     attribute vec3 pos;
            //     attribute vec3 uv;
            //     attribute vec4 color;
            //     uniform mat4 mvp;
            //     uniform vec4 ui[${max_vc}];
            //     varying vec2 vUV;
            //     varying vec4 vColor;
            //     void main(void){
            //         vec4 p = vec4(pos,1.0);
            //         vec4 t = ui[int(uv.z)];
            //         p.xy = p.xy + t.xy;
            //         p.xy = p.xy * t.zz;
            //         gl_Position = mvp * p;
            //         vUV.xy = uv.xy;
            //         p = color;
            //         p.w = color.w * t.w;
            //         vColor = p;
            //     }
            // `
            keys = {};
            keys[chunk.uni_f_diff.key] = chunk.uni_f_diff;
            keys[chunk.att_uv_ui.key] = chunk.att_uv_ui;
            var fcode = chunk.createFragment(undefined, keys);
            // let fcode = `
            //     precision mediump float;
            //     uniform sampler2D diff;
            //     varying vec4 vColor;
            //     varying vec2 vUV;
            //     void main(void){
            //         vec4 color = texture2D(diff, vUV);
            //         gl_FragColor = vColor*color;
            //     }
            // `
            // let vcode = `
            //     attribute vec3 pos;
            //     uniform mat4 mvp;
            //     void main(void){
            //         vec4 p = vec4(pos,1.0);
            //         gl_Position = mvp * p;
            //     }
            // `
            // let fcode = `
            //     precision mediump float;
            //     void main(void){
            //         gl_FragColor = vec4(1,0,0,1);
            //     }
            // `
            this.program = rf.context3D.createProgram(vcode, fcode);
        };
        BatchRenderer.prototype.cleanBatch = function () {
            var vo = this.renders.getFrist();
            while (vo) {
                if (vo.close == false) {
                    var render = vo.data;
                    if (render instanceof BatchGeometry) {
                        render.recycle();
                    }
                    vo.close = true;
                }
                vo = vo.next;
            }
            this.renders.clean();
        };
        BatchRenderer.prototype.getBatchTargets = function (render, ox, oy, os) {
            var target;
            if (render instanceof Sprite) {
                target = render;
            }
            else {
                this.renders.add(render);
                this.geo = undefined;
                return;
            }
            if (false == target._visible || 0.0 >= target.sceneAlpha) {
                target.$vcIndex = -1;
                target.$batchGeometry = null;
                return;
            }
            var g = target.$graphics;
            ox = target._x + ox;
            oy = target._y + oy;
            os = target._scaleX * os;
            if (target == this.target || (null == target.renderer && false == target.nativeRender)) {
                if (undefined == g || 0 >= g.numVertices) {
                    target.$vcIndex = -1;
                    target.$batchGeometry = null;
                }
                else {
                    if (undefined == this.geo) {
                        this.geo = rf.recyclable(BatchGeometry);
                        this.renders.add(this.geo);
                    }
                    var i = this.geo.add(target, g);
                    target.$vcox = ox;
                    target.$vcoy = oy;
                    target.$vcos = os;
                    if (i >= rf.max_vc) {
                        this.geo = undefined;
                    }
                }
            }
            else {
                this.renders.add(target);
                this.geo = undefined;
                return;
            }
            for (var _i = 0, _a = target.childrens; _i < _a.length; _i++) {
                var child = _a[_i];
                if (child instanceof Sprite) {
                    this.getBatchTargets(child, ox, oy, os);
                }
                else if (child instanceof RenderBase) {
                    this.renders.add(child);
                    this.geo = undefined;
                }
            }
        };
        BatchRenderer.prototype.updateVCData = function (render, ox, oy, os) {
            var target;
            if (render instanceof Sprite) {
                target = render;
            }
            else {
                return;
            }
            if (false == target._visible || 0.0 >= target.sceneAlpha) {
                target.$vcIndex = -1;
                target.$batchGeometry = null;
                return;
            }
            var g = target.$graphics;
            ox = target._x + ox;
            oy = target._y + oy;
            os = target._scaleX * os;
            if (target == this.target || (null == target.renderer && false == target.nativeRender)) {
                if (undefined != target.$batchGeometry) {
                    target.$vcox = ox;
                    target.$vcoy = oy;
                    target.$vcos = os;
                    target.$batchGeometry.vcData.wPoint4(rf.sp.$vcIndex * 4, rf.sp.$vcox, rf.sp.$vcoy, rf.sp.$vcos, rf.sp.sceneAlpha);
                }
            }
            else {
                return;
            }
            for (var _i = 0, _a = target.childrens; _i < _a.length; _i++) {
                var child = _a[_i];
                if (child instanceof Sprite) {
                    this.updateVCData(child, ox, oy, os);
                }
            }
        };
        BatchRenderer.prototype.toBatch = function () {
            var vo = this.renders.getFrist();
            var target = this.target;
            while (vo) {
                if (vo.close == false) {
                    var render = vo.data;
                    if (render instanceof BatchGeometry) {
                        render.build(target);
                    }
                }
                vo = vo.next;
            }
        };
        return BatchRenderer;
    }());
    rf.BatchRenderer = BatchRenderer;
    var BatchGeometry = /** @class */ (function () {
        function BatchGeometry() {
            this.vci = 0;
            this.verlen = 0;
        }
        ;
        BatchGeometry.prototype.add = function (target, g) {
            if (undefined == this.link) {
                this.link = new rf.Link();
            }
            target.$vcIndex = this.vci++;
            target.$batchGeometry = this;
            g.$batchOffset = this.verlen;
            this.verlen += g.byte.length;
            this.link.add(target);
            return this.vci;
        };
        BatchGeometry.prototype.build = function (target) {
            var variables = target.variables;
            this.vertex = new rf.VertexInfo(this.verlen, variables["data32PerVertex"].size);
            this.vertex.variables = variables;
            this.quadcount = this.vertex.numVertices / 4;
            this.vcData = new Float32Array(this.quadcount * 4);
            var byte = this.vertex.vertex;
            var vo = this.link.getFrist();
            while (vo) {
                if (vo.close == false) {
                    var sp_1 = vo.data;
                    var g = sp_1.$graphics;
                    if (sp_1.$vcIndex > 0) {
                        g.byte.update(this.vertex.data32PerVertex, rf.vertex_ui_variable["uv"].offset + 2, sp_1.$vcIndex);
                    }
                    byte.set(g.byte, g.$batchOffset);
                    this.vcData.wPoint4(sp_1.$vcIndex * 4, sp_1.$vcox, sp_1.$vcoy, sp_1.$vcos, sp_1.sceneAlpha);
                }
                vo = vo.next;
            }
        };
        BatchGeometry.prototype.update = function (position, byte) {
            if (undefined != this.vertex) {
                this.vertex.vertex.set(byte, position);
            }
            if (undefined != this.$vertexBuffer) {
                this.$vertexBuffer.readly = false;
            }
        };
        BatchGeometry.prototype.updateVC = function (sp) {
            this.vcData.wPoint4(sp.$vcIndex * 4, sp.$vcox, sp.$vcoy, sp.$vcos, sp.sceneAlpha);
        };
        //x,y,z,u,v,vci,r,g,b,a;
        BatchGeometry.prototype.onRecycle = function () {
            this.vertex = undefined;
            this.verlen = 0;
            this.vci = 0;
            this.$vertexBuffer = null;
            this.vcData = null;
            var vo = this.link.getFrist();
            while (vo) {
                if (vo.close == false) {
                    var sp_2 = vo.data;
                    if (sp_2.$batchGeometry == this) {
                        sp_2.$batchGeometry = null;
                        sp_2.$vcIndex = -1;
                        sp_2.$vcos = 1;
                        sp_2.$vcox = 0;
                        sp_2.$vcoy = 0;
                    }
                }
                vo = vo.next;
            }
            this.link.onRecycle();
        };
        return BatchGeometry;
    }());
    rf.BatchGeometry = BatchGeometry;
})(rf || (rf = {}));
///<reference path="../core/Config.ts"/>
///<reference path="three/Geometry.ts"/>
var rf;
(function (rf) {
    var Buffer3D = /** @class */ (function () {
        function Buffer3D() {
            this.preusetime = 0;
            this.readly = false;
        }
        Buffer3D.prototype.awaken = function () { };
        ;
        Buffer3D.prototype.sleep = function () { };
        ;
        Buffer3D.prototype.onRecycle = function () {
            this.readly = false;
            this.preusetime = 0;
        };
        return Buffer3D;
    }());
    rf.Buffer3D = Buffer3D;
    var Program3D = /** @class */ (function (_super) {
        __extends(Program3D, _super);
        function Program3D() {
            var _this = _super.call(this) || this;
            _this.uniforms = {};
            _this.attribs = {};
            return _this;
        }
        Program3D.prototype.awaken = function () {
            if (undefined != this.program) {
                return true;
            }
            if (!this.vertexCode || !this.fragmentCode) {
                rf.ThrowError("vertexCode or fragmentCode is empty");
                return false;
            }
            var g = rf.gl;
            //创建 vertexShader
            this.vShader = this.createShader(this.vertexCode, g.VERTEX_SHADER);
            this.fShader = this.createShader(this.fragmentCode, g.FRAGMENT_SHADER);
            this.program = g.createProgram();
            g.attachShader(this.program, this.vShader);
            g.attachShader(this.program, this.fShader);
            g.linkProgram(this.program);
            if (!g.getProgramParameter(this.program, rf.gl.LINK_STATUS)) {
                this.dispose();
                rf.ThrowError("create program error:" + g.getProgramInfoLog(this.program));
                return false;
            }
            //加入资源管理
            rf.context3D.bufferLink.add(this);
            return true;
        };
        Program3D.prototype.dispose = function () {
            var g = rf.gl;
            if (this.vShader) {
                g.detachShader(this.program, this.vShader);
                g.deleteShader(this.vShader);
                this.vShader = null;
            }
            if (this.fShader) {
                g.detachShader(this.program, this.fShader);
                g.deleteShader(this.fShader);
                this.fShader = null;
            }
            if (this.program) {
                g.deleteProgram(this.program);
                this.program = null;
            }
        };
        Program3D.prototype.recycle = function () {
            this.dispose();
            // this.vertexCode = undefined;
            // this.fragmentCode = undefined;
            this.preusetime = 0;
            this.readly = false;
            this.uniforms = {};
            this.attribs = {};
            // context3D.bufferLink.remove(this);
        };
        /*
         * load shader from html file by document.getElementById
         */
        Program3D.prototype.createShader = function (code, type) {
            var g = rf.gl;
            var shader = g.createShader(type);
            g.shaderSource(shader, code);
            g.compileShader(shader);
            // Check the result of compilation
            if (!g.getShaderParameter(shader, g.COMPILE_STATUS)) {
                var error = g.getShaderInfoLog(shader);
                g.deleteShader(shader);
                throw new Error(error);
            }
            return shader;
        };
        return Program3D;
    }(Buffer3D));
    rf.Program3D = Program3D;
    var VertexBuffer3D = /** @class */ (function (_super) {
        __extends(VertexBuffer3D, _super);
        function VertexBuffer3D() {
            var _this = _super.call(this) || this;
            // private varibles: { [key: string]: { size: number, offset: number } } = undefined;
            _this.numVertices = 0;
            _this.data32PerVertex = 0;
            _this.buffer = null;
            // regVariable(variable: string, offset: number, size: number): void {
            //     if (undefined == this.varibles) {
            //         this.varibles = {};
            //     }
            //     this.varibles[variable] = { size: size, offset: offset * 4 };
            // }
            _this.attribarray = {};
            return _this;
        }
        VertexBuffer3D.prototype.recycle = function () {
            if (this.buffer) {
                rf.gl.deleteBuffer(this.buffer);
                this.buffer = undefined;
            }
            this.readly = false;
            this.preusetime = 0;
            this.attribarray = {};
            // this.numVertices = 0;
            // this.data32PerVertex = 0;
            // this.data = null;
            // context3D.bufferLink.remove(this);
        };
        VertexBuffer3D.prototype.awaken = function () {
            if (!this.data || !this.data32PerVertex || !this.numVertices) {
                this.readly = false;
                rf.ThrowError("vertexBuffer3D unavailable");
                return false;
            }
            var g = rf.gl;
            if (undefined == this.buffer) {
                this.buffer = g.createBuffer();
            }
            g.bindBuffer(g.ARRAY_BUFFER, this.buffer);
            g.bufferData(g.ARRAY_BUFFER, this.data.vertex, g.STATIC_DRAW);
            g.bindBuffer(g.ARRAY_BUFFER, null);
            this.readly = true;
            //加入资源管理
            rf.context3D.bufferLink.add(this);
            return true;
        };
        VertexBuffer3D.prototype.uploadFromVector = function (data, startVertex, numVertices) {
            if (startVertex === void 0) { startVertex = 0; }
            if (numVertices === void 0) { numVertices = -1; }
            if (data instanceof rf.VertexInfo) {
                this.data = data;
                this.numVertices = data.numVertices;
                return;
            }
            if (0 > startVertex) {
                startVertex = 0;
            }
            var nd;
            var data32PerVertex = this.data32PerVertex;
            if (numVertices != -1) {
                this.numVertices = data.length / data32PerVertex;
                if (this.numVertices - startVertex < numVertices) {
                    rf.ThrowError("numVertices out of range");
                    return;
                }
                if (this.numVertices != numVertices && startVertex == 0) {
                    this.numVertices = numVertices;
                    nd = new Float32Array(data32PerVertex * numVertices);
                    nd.set(data.slice(startVertex * data32PerVertex, numVertices * data32PerVertex));
                    data = nd;
                }
            }
            if (0 < startVertex) {
                if (numVertices == -1) {
                    numVertices = data.length / data32PerVertex - startVertex;
                }
                nd = new Float32Array(data32PerVertex * numVertices);
                nd.set(data.slice(startVertex * data32PerVertex, numVertices * data32PerVertex));
                data = nd;
                this.numVertices = numVertices;
            }
            else {
                if (false == (data instanceof Float32Array)) {
                    data = new Float32Array(data);
                }
                this.numVertices = data.length / data32PerVertex;
            }
            this.data = new rf.VertexInfo(data, data32PerVertex);
        };
        VertexBuffer3D.prototype.uploadContext = function (program) {
            if (false == this.readly) {
                if (false == this.awaken()) {
                    throw new Error("create VertexBuffer error!");
                }
            }
            var loc = -1;
            var g = rf.gl;
            var attribs = program.attribs;
            var p = program.program;
            var attribarray = this.attribarray;
            g.bindBuffer(g.ARRAY_BUFFER, this.buffer);
            var variables = this.data.variables;
            for (var variable in variables) {
                if (true == (variable in attribs)) {
                    loc = attribs[variable];
                }
                else {
                    loc = g.getAttribLocation(p, variable);
                    attribs[variable] = loc;
                }
                if (loc < 0) {
                    continue;
                }
                var o = variables[variable];
                g.vertexAttribPointer(loc, o.size, g.FLOAT, false, this.data32PerVertex * 4, o.offset * 4);
                if (true != attribarray[loc]) {
                    g.enableVertexAttribArray(loc);
                    attribarray[loc] = true;
                }
            }
            this.preusetime = rf.engineNow;
        };
        return VertexBuffer3D;
    }(Buffer3D));
    rf.VertexBuffer3D = VertexBuffer3D;
    var IndexBuffer3D = /** @class */ (function (_super) {
        __extends(IndexBuffer3D, _super);
        function IndexBuffer3D() {
            var _this = _super.call(this) || this;
            _this.quadid = -1;
            return _this;
        }
        IndexBuffer3D.prototype.recycle = function () {
            if (this.buffer) {
                rf.gl.deleteBuffer(this.buffer);
                this.buffer = undefined;
            }
            this.readly = false;
            this.preusetime = 0;
            // this.numIndices = 0;
            // this.data = null;
            // context3D.bufferLink.remove(this);
        };
        IndexBuffer3D.prototype.awaken = function () {
            if (true == this.readly) {
                if (DEBUG) {
                    if (undefined == this.buffer) {
                        rf.ThrowError("indexBuffer readly is true but buffer is null");
                        return false;
                    }
                }
                return true;
            }
            if (!this.data) {
                this.readly = false;
                rf.ThrowError("indexData unavailable");
                return false;
            }
            var g = rf.gl;
            if (undefined == this.buffer) {
                this.buffer = g.createBuffer();
            }
            g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, this.buffer);
            g.bufferData(g.ELEMENT_ARRAY_BUFFER, this.data, g.STATIC_DRAW);
            g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, null);
            //加入资源管理
            this.readly = true;
            rf.context3D.bufferLink.add(this);
        };
        IndexBuffer3D.prototype.uploadFromVector = function (data, startOffset, count) {
            if (startOffset === void 0) { startOffset = 0; }
            if (count === void 0) { count = -1; }
            if (0 > startOffset) {
                startOffset = 0;
            }
            if (count != -1) {
                if (this.numIndices - startOffset < count) {
                    rf.ThrowError("VectorData out of range");
                    return;
                }
            }
            if (0 < startOffset) {
                if (-1 == count) {
                    count = data.length - startOffset;
                }
                var nd = new Uint16Array(count);
                nd.set(data.slice(startOffset, startOffset + count));
                data = nd;
            }
            else {
                if (false == (data instanceof Uint16Array)) {
                    data = new Uint16Array(data);
                }
            }
            this.numIndices = data.length;
            this.data = data;
        };
        return IndexBuffer3D;
    }(Buffer3D));
    rf.IndexBuffer3D = IndexBuffer3D;
    //TODO:cube texture
    var Texture = /** @class */ (function (_super) {
        __extends(Texture, _super);
        function Texture() {
            var _this = _super.call(this) || this;
            _this.width = 0;
            _this.height = 0;
            _this.status = 0 /* WAIT */;
            return _this;
        }
        Texture.prototype.awaken = function () {
            var tex = this.texture;
            var g = rf.gl;
            var data = this.pixels;
            if (undefined == data) {
                this.readly = false;
                return false;
            }
            if (data instanceof rf.BitmapData) {
                data = data.canvas;
            }
            if (undefined == tex) {
                this.texture = tex = g.createTexture();
            }
            g.bindTexture(g.TEXTURE_2D, tex);
            var textureData = this.data;
            // g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL,true);
            g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, textureData.mag);
            g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, textureData.mix);
            var pepeat = textureData.repeat;
            g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, pepeat); //U方向上设置
            g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, pepeat);
            // if(textureData.mipmap){
            //     g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
            //     g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR_MIPMAP_LINEAR);
            //     g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.REPEAT);   //U方向上设置
            //     g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.REPEAT);   //v方向上设置
            // }else{
            //     //设置纹理参数 https://blog.csdn.net/a23366192007/article/details/51264454
            // /**
            //  * void texParameteri(GLenum target, GLenum pname, GLint param) ;
            //     @pname:是纹理的参数：只能是下列四个
            //         GL_TEXTURE_MIN_FILTER：指定纹理图片缩小时用到的算法
            //         GL_TEXTURE_MAG_FILTER：指定纹理图片放大时用到的算法 
            //         GL_TEXTURE_WRAP_S ：纹理包装算法，在s(u)方向 
            //         GL_TEXTURE_WRAP_T ：纹理包装算法，在t(v)方向
            //     @param:是第二个参数的值（value）
            //         放大和缩小所用的算法只有两个 NEAREST和LINEAR,
            //         （即第三个参数param的值是webgl.NEAREST或webgl.LINEAR）分别是最近点采样和线性采样，
            //         前者效率高单效果不好，后者效率不高单效果比较好。
            //  */
            // /**
            //  *  Mag Modes
            //  *      gl.NEAREST
            //  *      gl.LINEAR
            //  */
            // g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.NEAREST);
            // /**  Min Modes
            // *      gl.NEAREST
            // *      gl.LINEAR
            //        gl.NEAREST_MIPMAP_NEAREST;      limit:power of two   
            //        gl.NEAREST_MIPMAP_LINEAR;       limit:power of two
            //        gl.LINEAR_MIPMAP_LINEAR         limit:power of two
            //        gl.LINEAR_MIPMAP_NEAREST        limit:power of two
            // * */
            // //如果我们的贴图长宽不满足2的幂条件。那么MIN_FILTER 和 MAG_FILTER, 只能是 NEAREST或者LINEAR
            // g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.NEAREST);
            // g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);   //U方向上设置
            // g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);   //v方向上设置
            // }
            //如果我们的贴图长宽不满足2的幂条件。那么wrap_s 和 wrap_t 必须是 clap_to_edge
            //Wrapping Modes 
            //g.REPEAT                  limit:power of two   
            //g.MIRRORED_REPEAT         limit:power of two   
            //g.CLAMP_TO_EDGE
            /**
                ====format=====
                g.ALPHA
                g.RGB
                g.RGBA
                g.LUMINANCE
                g.LUMINANCE_ALPHA
                g.DEPTH_COMPONENT
                g.DEPTH_STENCIL
             */
            /**
                ===type====
                g.UNSIGNED_BYTE
                g.BYTE
                g.SHORT
                g.INT
                g.FLOAT
                g.UNSIGNED_BYTE;
                g.UNSIGNED_INT
                g.UNSIGNED_SHORT
                g.UNSIGNED_SHORT_4_4_4_4;
                g.UNSIGNED_SHORT_5_5_5_1;
                g.UNSIGNED_SHORT_5_6_5;
                //halfFloat
                g.getExtension('OES_texture_half_float').HALF_FLOAT_OES
                g.getExtension('WEBGL_depth_texture').UNSIGNED_INT_24_8_WEBGL
             */
            g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, data);
            //  createmipmap  limit:power of two
            if (textureData.mipmap) {
                g.generateMipmap(g.TEXTURE_2D);
            }
            g.bindTexture(g.TEXTURE_2D, null);
            this.readly = true;
            //加入资源管理
            rf.context3D.bufferLink.add(this);
            return true;
        };
        Texture.prototype.uploadContext = function (program, index, variable) {
            if (false == this.readly) {
                this.awaken();
            }
            var uniforms = program.uniforms;
            var g = rf.gl;
            var index_tex;
            g.activeTexture(rf.gl["TEXTURE" + index]);
            g.bindTexture(g.TEXTURE_2D, this.texture);
            if (true == uniforms.hasOwnProperty(variable)) {
                index_tex = uniforms[variable];
            }
            else {
                index_tex = g.getUniformLocation(program.program, variable);
                uniforms[variable] = index_tex;
            }
            // var index_tex = gl.getUniformLocation(program.program, variable);
            if (undefined != index_tex) {
                g.uniform1i(index_tex, index);
            }
            this.preusetime = rf.engineNow;
        };
        Texture.prototype.load = function (url) {
            if (undefined == url) {
                url = this.data.url;
            }
            if (0 /* WAIT */ == this.status) {
                this.status = 1 /* LOADING */;
                rf.loadRes(url, this.loadComplete, this, 3 /* image */);
            }
        };
        Texture.prototype.loadComplete = function (e) {
            if (e.type == 4 /* COMPLETE */) {
                this.status = 2 /* COMPLETE */;
                var res = e.data;
                var image = res.data;
                this.width = image.width;
                this.height = image.height;
                this.pixels = image;
            }
            else {
                this.status = 3 /* FAILED */;
            }
        };
        Texture.prototype.recycle = function () {
            if (this.texture) {
                rf.gl.deleteTexture(this.texture);
                this.texture = undefined;
            }
            this.readly = false;
            // if (this.pixels) {
            //     this.pixels = undefined;
            // }
            // this.width = 0;
            // this.height = 0;
        };
        return Texture;
    }(Buffer3D));
    rf.Texture = Texture;
    var RttTexture = /** @class */ (function (_super) {
        __extends(RttTexture, _super);
        function RttTexture() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RttTexture.prototype.create = function (width, height) {
            this.width = width;
            this.height = height;
        };
        return RttTexture;
    }(Texture));
    rf.RttTexture = RttTexture;
})(rf || (rf = {}));
///<reference path="./Buffer3D.ts"/>
var rf;
(function (rf) {
    // export const enum Context3DTriangleFace {
    // 	BACK = 'back', //CCW
    // 	FRONT = 'front', //CW
    // 	FRONT_AND_BACK = 'frontAndBack',
    // 	NONE = 'none'
    // }
    var Context3D = /** @class */ (function () {
        function Context3D() {
            this.textureObj = {};
            this.programs = {};
            this.cProgram = undefined;
            this.bufferLink = new rf.Link();
            // ROOT.on(EngineEvent.FPS_CHANGE,this.gc,this)
        }
        Context3D.prototype.configureBackBuffer = function (width, height, antiAlias, enableDepthAndStencil) {
            if (enableDepthAndStencil === void 0) { enableDepthAndStencil = true; }
            var g = rf.gl;
            g.viewport(0, 0, width, height);
            g.canvas.width = width;
            g.canvas.height = height;
            //TODO: antiAlias , Stencil
            if (enableDepthAndStencil) {
                this._clearBit = g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT | g.STENCIL_BUFFER_BIT;
                g.enable(g.DEPTH_TEST);
                g.enable(g.STENCIL_TEST);
            }
            else {
                this._clearBit = g.COLOR_BUFFER_BIT;
                g.disable(g.DEPTH_TEST);
                g.disable(g.STENCIL_TEST);
            }
        };
        Context3D.prototype.clear = function (red, green, blue, alpha, depth, stencil, mask) {
            if (red === void 0) { red = 0.0; }
            if (green === void 0) { green = 0.0; }
            if (blue === void 0) { blue = 0.0; }
            if (alpha === void 0) { alpha = 1.0; }
            if (depth === void 0) { depth = 1.0; }
            if (stencil === void 0) { stencil = 0; }
            if (mask === void 0) { mask = 0xffffffff; }
            var g = rf.gl;
            g.clearColor(red, green, blue, alpha);
            g.clearDepth(depth); // TODO:dont need to call this every time
            g.clearStencil(stencil); //stencil buffer
            g.clear(this._clearBit);
            this.triangles = 0;
            this.dc = 0;
        };
        Context3D.prototype.setCulling = function (triangleFaceToCull) {
            if (this.triangleFaceToCull == triangleFaceToCull) {
                return;
            }
            this.triangleFaceToCull = triangleFaceToCull;
            var g = rf.gl;
            g.frontFace(g.CW);
            if (triangleFaceToCull == 0) {
                g.disable(g.CULL_FACE);
            }
            else {
                g.enable(g.CULL_FACE);
                g.cullFace(triangleFaceToCull);
            }
            // switch (triangleFaceToCull) {
            // 	case Context3DTriangleFace.NONE:
            // 		g.disable(g.CULL_FACE);
            // 		break;
            // 	case Context3DTriangleFace.BACK:
            // 		g.enable(g.CULL_FACE);
            // 		g.cullFace(g.BACK);
            // 		break;
            // 	case Context3DTriangleFace.FRONT:
            // 		g.enable(g.CULL_FACE);
            // 		g.cullFace(g.FRONT);
            // 		break;
            // 	case Context3DTriangleFace.FRONT_AND_BACK:
            // 		g.enable(g.CULL_FACE);
            // 		g.cullFace(g.FRONT_AND_BACK);
            // 		break;
            // }
        };
        Context3D.prototype.setDepthTest = function (depthMask, passCompareMode) {
            if (this.depthMask == depthMask && this.passCompareMode == passCompareMode) {
                return;
            }
            this.depthMask = depthMask;
            this.passCompareMode = passCompareMode;
            var g = rf.gl;
            g.enable(g.DEPTH_TEST);
            g.depthMask(depthMask);
            g.depthFunc(passCompareMode);
        };
        Context3D.prototype.setBlendFactors = function (sourceFactor, destinationFactor) {
            if (this.sourceFactor == sourceFactor && this.destinationFactor == destinationFactor) {
                return;
            }
            this.sourceFactor = sourceFactor;
            this.destinationFactor = destinationFactor;
            var g = rf.gl;
            g.enable(g.BLEND); //stage3d cant disable blend?
            g.blendFunc(sourceFactor, destinationFactor);
        };
        Context3D.prototype.createVertexBuffer = function (data, data32PerVertex, startVertex, numVertices) {
            if (data32PerVertex === void 0) { data32PerVertex = -1; }
            if (startVertex === void 0) { startVertex = 0; }
            if (numVertices === void 0) { numVertices = -1; }
            var buffer = rf.recyclable(rf.VertexBuffer3D);
            if (data instanceof rf.VertexInfo) {
                buffer.data32PerVertex = data.data32PerVertex;
            }
            else {
                if (data32PerVertex == -1) {
                    rf.ThrowError("mast set data32PerVertex");
                    return null;
                }
                buffer.data32PerVertex = data32PerVertex;
            }
            buffer.uploadFromVector(data, startVertex, numVertices);
            return buffer;
        };
        Context3D.prototype.getIndexByQuad = function (quadCount) {
            var count = 1000;
            if (quadCount > count) {
                rf.ThrowError("你要这么多四边形干嘛？");
                return null;
            }
            // if (undefined == this.indexs) {
            // 	this.indexs = {};
            // }
            // let buffer = this.indexs[quadCount];
            // let length = quadCount * 6;
            // if (undefined == buffer) {
            // let array = new Uint16Array(length)
            if (undefined == this.indexByte) {
                var byte = new Uint16Array(count * 6);
                count *= 4;
                var j = 0;
                for (var i = 0; i < count; i += 4) {
                    byte[j++] = i;
                    byte[j++] = i + 1;
                    byte[j++] = i + 3;
                    byte[j++] = i + 1;
                    byte[j++] = i + 2;
                    byte[j++] = i + 3;
                }
                this.indexByte = this.createIndexBuffer(byte);
            }
            return this.indexByte;
            // array.set(this.indexByte.slice(0, length));
            // this.indexs[quadCount] = buffer = this.createIndexBuffer(array);
            // }
            // return buffer;
        };
        Context3D.prototype.createIndexBuffer = function (data) {
            var buffer = rf.recyclable(rf.IndexBuffer3D);
            if (data instanceof ArrayBuffer) {
                buffer.uploadFromVector(new Uint16Array(data));
            }
            else {
                buffer.uploadFromVector(data);
            }
            return buffer;
        };
        Context3D.prototype.getTextureData = function (url, mipmap, mag, mix, repeat) {
            var data = {};
            data.url = url;
            data.mipmap = undefined != mipmap ? mipmap : false;
            data.mag = undefined != mag ? mag : 9728 /* NEAREST */;
            data.mix = undefined != mix ? mix : 9728 /* NEAREST */;
            data.repeat = undefined != repeat ? repeat : 33071 /* CLAMP_TO_EDGE */;
            return data;
        };
        Context3D.prototype.createTexture = function (key, pixels, mipmap) {
            if (mipmap === void 0) { mipmap = false; }
            var texture = rf.recyclable(rf.Texture);
            texture.key = key.key ? key.key : (key.key = key.url + "_" + key.mipmap + "_" + key.mag + "_" + key.mix + "_" + key.repeat);
            texture.data = key;
            texture.pixels = pixels;
            if (pixels) {
                texture.width = pixels.width;
                texture.height = pixels.height;
            }
            this.textureObj[key.key] = texture;
            return texture;
        };
        Context3D.prototype.createEmptyTexture = function (key, width, height, mipmap) {
            if (mipmap === void 0) { mipmap = false; }
            var texture = rf.recyclable(rf.Texture);
            texture.key = key;
            texture.pixels = new rf.BitmapData(width, height);
            texture.width = width;
            texture.height = height;
            this.textureObj[key] = texture;
            return texture;
        };
        Context3D.prototype.setRenderToTexture = function (texture, enableDepthAndStencil, antiAlias, surfaceSelector, colorOutputIndex) {
            if (enableDepthAndStencil === void 0) { enableDepthAndStencil = false; }
            if (antiAlias === void 0) { antiAlias = 0; }
            if (surfaceSelector === void 0) { surfaceSelector = 0; }
            if (colorOutputIndex === void 0) { colorOutputIndex = 0; }
            if (enableDepthAndStencil) {
                this._clearBit = rf.gl.COLOR_BUFFER_BIT | rf.gl.DEPTH_BUFFER_BIT | rf.gl.STENCIL_BUFFER_BIT;
                rf.gl.enable(rf.gl.DEPTH_TEST);
                rf.gl.enable(rf.gl.STENCIL_TEST);
            }
            else {
                this._clearBit = rf.gl.COLOR_BUFFER_BIT;
                rf.gl.disable(rf.gl.DEPTH_TEST);
                rf.gl.disable(rf.gl.STENCIL_TEST);
            }
            //TODO: antiAlias surfaceSelector colorOutputIndex
            if (!this._rttFramebuffer) {
                this._rttFramebuffer = rf.gl.createFramebuffer();
                rf.gl.bindFramebuffer(rf.gl.FRAMEBUFFER, this._rttFramebuffer);
                var renderbuffer = rf.gl.createRenderbuffer();
                rf.gl.bindRenderbuffer(rf.gl.RENDERBUFFER, renderbuffer);
                rf.gl.renderbufferStorage(rf.gl.RENDERBUFFER, rf.gl.DEPTH_COMPONENT16, 512, 512); //force 512
                rf.gl.framebufferRenderbuffer(rf.gl.FRAMEBUFFER, rf.gl.DEPTH_ATTACHMENT, rf.gl.RENDERBUFFER, renderbuffer);
                rf.gl.framebufferTexture2D(rf.gl.FRAMEBUFFER, rf.gl.COLOR_ATTACHMENT0, rf.gl.TEXTURE_2D, texture.texture, 0);
            }
            rf.gl.bindFramebuffer(rf.gl.FRAMEBUFFER, this._rttFramebuffer);
        };
        Context3D.prototype.setRenderToBackBuffer = function () {
            rf.gl.bindFramebuffer(rf.gl.FRAMEBUFFER, null);
        };
        Context3D.prototype.createProgram = function (vertexCode, fragmentCode, key) {
            var program;
            if (undefined != key) {
                program = this.programs[key];
                if (undefined == program) {
                    this.programs[key] = program = rf.recyclable(rf.Program3D);
                }
            }
            else {
                program = rf.recyclable(rf.Program3D);
            }
            program.vertexCode = vertexCode;
            program.fragmentCode = fragmentCode;
            return program;
        };
        /**
         *
         * @param variable
         * @param data
         * @param format FLOAT_1 2 3 4
         */
        Context3D.prototype.setProgramConstantsFromVector = function (variable, data, format, array) {
            if (array === void 0) { array = true; }
            var p = this.cProgram;
            var uniforms = p.uniforms;
            var g = rf.gl;
            var index;
            if (true == (variable in uniforms)) {
                index = uniforms[variable];
            }
            else {
                index = g.getUniformLocation(p.program, variable);
                uniforms[variable] = index;
            }
            if (undefined != index) {
                if (array) {
                    rf.gl['uniform' + format + 'fv'](index, data);
                }
                else {
                    rf.gl['uniform' + format + 'f'](index, data);
                }
            }
        };
        /**
        *  @variable must predefined in glsl
        */
        Context3D.prototype.setProgramConstantsFromMatrix = function (variable, rawData) {
            var p = this.cProgram;
            var uniforms = p.uniforms;
            var g = rf.gl;
            var index;
            if (true == (variable in uniforms)) {
                index = uniforms[variable];
            }
            else {
                index = g.getUniformLocation(p.program, variable);
                uniforms[variable] = index;
            }
            if (undefined != index) {
                g.uniformMatrix4fv(index, false, rawData);
            }
        };
        Context3D.prototype.setProgram = function (program) {
            if (program == undefined)
                return;
            program.preusetime = rf.engineNow;
            if (false == program.readly) {
                if (false == program.awaken()) {
                    rf.ThrowError("program create error!");
                    return;
                }
            }
            else {
                if (program == this.cProgram)
                    return;
            }
            this.cProgram = program;
            rf.gl.useProgram(program.program);
        };
        Context3D.prototype.drawTriangles = function (indexBuffer, numTriangles, firstIndex) {
            if (firstIndex === void 0) { firstIndex = 0; }
            var g = rf.gl;
            if (undefined != indexBuffer) {
                if (false == indexBuffer.readly) {
                    if (false == indexBuffer.awaken()) {
                        throw new Error("create indexBuffer error!");
                    }
                }
                indexBuffer.preusetime = rf.engineNow;
                // g.drawArrays(g.TRIANGLES,0,numTriangles)
                g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
                g.drawElements(g.TRIANGLES, numTriangles * 3, g.UNSIGNED_SHORT, firstIndex * 2);
            }
            else {
                g.drawArrays(g.TRIANGLES, 0, numTriangles * 3);
            }
            this.triangles += numTriangles;
            this.dc++;
        };
        /*
         *  [Webgl only]
         *   For instance indices = [1,3,0,4,1,2]; will draw 3 lines :
         *   from vertex number 1 to vertex number 3, from vertex number 0 to vertex number 4, from vertex number 1 to vertex number 2
         */
        Context3D.prototype.drawLines = function (indexBuffer, numTriangles, firstIndex, numLines) {
            if (firstIndex === void 0) { firstIndex = 0; }
            if (numLines === void 0) { numLines = -1; }
            if (false == indexBuffer.readly) {
                if (false == indexBuffer.awaken()) {
                    throw new Error("create indexBuffer error!");
                }
            }
            indexBuffer.preusetime = rf.engineNow;
            var g = rf.gl;
            g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
            g.drawElements(g.LINES, numTriangles < 0 ? indexBuffer.numIndices : numTriangles * 3, g.UNSIGNED_SHORT, firstIndex * 2);
            this.triangles += numTriangles;
            this.dc++;
        };
        // /*
        //  * [Webgl only]
        //  *  For instance indices = [1,2,3] ; will only render vertices number 1, number 2, and number 3 
        //  */
        // public drawPoints(indexBuffer: IndexBuffer3D, firstIndex: number = 0, numPoints: number = -1): void {
        // 	if (false == indexBuffer.readly) {
        // 		if (false == indexBuffer.awaken()) {
        // 			throw new Error("create indexBuffer error!");
        // 		}
        // 	}
        // 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
        // 	gl.drawElements(gl.POINTS, numPoints < 0 ? indexBuffer.numIndices : numPoints, gl.UNSIGNED_SHORT, firstIndex * 2);
        // }
        // /**
        //  * [Webgl only]
        //  * draws a closed loop connecting the vertices defined in the indexBuffer to the next one
        //  */
        // public drawLineLoop(indexBuffer: IndexBuffer3D, firstIndex: number = 0, numPoints: number = -1): void {
        // 	if (false == indexBuffer.readly) {
        // 		if (false == indexBuffer.awaken()) {
        // 			throw new Error("create indexBuffer error!");
        // 		}
        // 	}
        // 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
        // 	gl.drawElements(gl.LINE_LOOP, numPoints < 0 ? indexBuffer.numIndices : numPoints, gl.UNSIGNED_SHORT, firstIndex * 2);
        // }
        // /**
        //  * [Webgl only]
        //  * It is similar to drawLineLoop(). The difference here is that WebGL does not connect the last vertex to the first one (not a closed loop).
        //  */
        // public drawLineStrip(indexBuffer: IndexBuffer3D, firstIndex: number = 0, numPoints: number = -1): void {
        // 	if (false == indexBuffer.readly) {
        // 		if (false == indexBuffer.awaken()) {
        // 			throw new Error("create indexBuffer error!");
        // 		}
        // 	}
        // 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
        // 	gl.drawElements(
        // 		gl.LINE_STRIP,
        // 		numPoints < 0 ? indexBuffer.numIndices : numPoints,
        // 		gl.UNSIGNED_SHORT,
        // 		firstIndex * 2
        // 	);
        // }
        // /**
        // * [Webgl only]
        // *  indices = [0, 1, 2, 3, 4];, then we will generate the triangles:(0, 1, 2), (1, 2, 3), and(2, 3, 4).
        // */
        // public drawTriangleStrip(indexBuffer: IndexBuffer3D): void {
        // 	if (false == indexBuffer.readly) {
        // 		if (false == indexBuffer.awaken()) {
        // 			throw new Error("create indexBuffer error!");
        // 		}
        // 	}
        // 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
        // 	gl.drawElements(gl.TRIANGLE_STRIP, indexBuffer.numIndices, gl.UNSIGNED_SHORT, 0);
        // }
        // /**
        //  * [Webgl only]
        //  * creates triangles in a similar way to drawTriangleStrip(). 
        //  * However, the first vertex defined in the indexBuffer is taken as the origin of the fan(the only shared vertex among consecutive triangles).
        //  * In our example, indices = [0, 1, 2, 3, 4]; will create the triangles: (0, 1, 2) and(0, 3, 4).
        //  */
        // public drawTriangleFan(indexBuffer: IndexBuffer3D): void {
        // 	if (false == indexBuffer.readly) {
        // 		if (false == indexBuffer.awaken()) {
        // 			throw new Error("create indexBuffer error!");
        // 		}
        // 	}
        // 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
        // 	gl.drawElements(gl.TRIANGLE_FAN, indexBuffer.numIndices, gl.UNSIGNED_SHORT, 0);
        // }
        /**
        *   In webgl we dont need to call present , browser will do this for us.
        */
        // public present(): void { }
        // private enableTex(keyInCache): void {
        // 	var tex: Texture = this._texCache[keyInCache];
        // 	gl.activeTexture(gl['TEXTURE' + tex.textureUnit]);
        // 	gl.TEXTURE31\
        // 	var l: WebGLUniformLocation = gl.getUniformLocation(this._linkedProgram.program, keyInCache);
        // 	gl.uniform1i(l, tex.textureUnit); // TODO:multiple textures
        // }
        Context3D.prototype.gc = function (now) {
            var link = this.bufferLink;
            var vo = link.getFrist();
            var hasChange = false;
            while (vo) {
                if (false == vo.close) {
                    var buffer = vo.data;
                    if (now - buffer.preusetime > 3000) {
                        buffer.recycle();
                        vo.close = true;
                        hasChange = true;
                    }
                }
                vo = vo.next;
            }
            if (hasChange)
                link.clean();
        };
        Context3D.prototype.toString = function () {
            var link = this.bufferLink;
            var vo = link.getFrist();
            var v = 0, t = 0, p = 0, i = 0;
            while (vo) {
                if (false == vo.close) {
                    var buffer = vo.data;
                    if (buffer instanceof rf.VertexBuffer3D) {
                        v++;
                    }
                    else if (buffer instanceof rf.IndexBuffer3D) {
                        i++;
                    }
                    else if (buffer instanceof rf.Texture) {
                        t++;
                    }
                    else if (buffer instanceof rf.Program3D) {
                        p++;
                    }
                }
                vo = vo.next;
            }
            return "p:" + p + " i:" + i + " v:" + v + " t:" + t;
        };
        return Context3D;
    }());
    rf.Context3D = Context3D;
    /**
     * todo
     */
    function webGLSimpleReport() {
        //http://webglreport.com/
        // Vertex Shader
        // Max Vertex Attributes:
        // Max Vertex Uniform Vectors:
        // Max Vertex Texture Image Units:
        // Max Varying Vectors:
        rf.gl.getParameter(rf.gl.MAX_VERTEX_ATTRIBS);
        rf.gl.getParameter(rf.gl.MAX_VERTEX_UNIFORM_VECTORS);
        rf.gl.getParameter(rf.gl.MAX_FRAGMENT_UNIFORM_VECTORS);
        rf.gl.getParameter(rf.gl.MAX_VARYING_VECTORS);
        rf.gl.getParameter(rf.gl.MAX_TEXTURE_IMAGE_UNITS);
        // Fragment Shader
        // Max Fragment Uniform Vectors:
        // Max Texture Image Units:
        // float/int precision:highp/highp
        return {};
    }
    rf.webGLSimpleReport = webGLSimpleReport;
})(rf || (rf = {}));
///<reference path="../Stage3D.ts" />
var rf;
(function (rf) {
    var Light = /** @class */ (function (_super) {
        __extends(Light, _super);
        function Light() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.color = 0xFFFFFF;
            _this.intensity = 1.0;
            return _this;
        }
        return Light;
    }(rf.DisplayObject));
    rf.Light = Light;
    var DirectionalLight = /** @class */ (function (_super) {
        __extends(DirectionalLight, _super);
        function DirectionalLight() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return DirectionalLight;
    }(Light));
    rf.DirectionalLight = DirectionalLight;
})(rf || (rf = {}));
///<reference path="./display/Sprite.ts" />
///<reference path="./Context3D.ts" />
///<reference path="./three/Light.ts" />
var rf;
(function (rf) {
    var SceneObject = /** @class */ (function (_super) {
        __extends(SceneObject, _super);
        function SceneObject() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SceneObject.prototype.addChild = function (child) {
            _super.prototype.addChild.call(this, child);
            if (child instanceof SceneObject) {
                child.scene = this.scene;
            }
        };
        SceneObject.prototype.addChildAt = function (child, index) {
            _super.prototype.addChildAt.call(this, child, index);
            if (child instanceof SceneObject) {
                child.scene = this.scene;
            }
        };
        SceneObject.prototype.removeChild = function (child) {
            if (undefined == child) {
                return;
            }
            _super.prototype.removeChild.call(this, child);
            if (child instanceof SceneObject) {
                child.scene = undefined;
            }
        };
        SceneObject.prototype.removeAllChild = function () {
            var childrens = this.childrens;
            var len = childrens.length;
            for (var i = 0; i < len; i++) {
                var child = childrens[i];
                child.stage = undefined;
                child.parent = undefined;
                if (child instanceof SceneObject) {
                    child.scene = undefined;
                }
                child.removeFromStage();
            }
            this.childrens.length = 0;
        };
        SceneObject.prototype.removeFromStage = function () {
            var childrens = this.childrens;
            var len = childrens.length;
            for (var i = 0; i < len; i++) {
                var child = childrens[i];
                child.stage = undefined;
                if (child instanceof SceneObject) {
                    child.scene = undefined;
                }
                child.removeFromStage();
            }
        };
        SceneObject.prototype.addToStage = function () {
            var _a = this, childrens = _a.childrens, scene = _a.scene, stage = _a.stage;
            var len = childrens.length;
            for (var i = 0; i < len; i++) {
                var child = childrens[i];
                child.stage = stage;
                if (child instanceof SceneObject) {
                    child.scene = scene;
                }
                child.addToStage();
            }
        };
        return SceneObject;
    }(rf.RenderBase));
    rf.SceneObject = SceneObject;
    var Scene = /** @class */ (function (_super) {
        __extends(Scene, _super);
        function Scene(variables) {
            var _this = _super.call(this, variables) || this;
            _this.scene = _this;
            _this.hitArea = new rf.HitArea();
            _this.hitArea.allWays = true;
            return _this;
        }
        Scene.prototype.render = function (camera, now, interval) {
            var _camera = this.camera;
            var _a = this.material, depthMask = _a.depthMask, passCompareMode = _a.passCompareMode, srcFactor = _a.srcFactor, dstFactor = _a.dstFactor, cull = _a.cull;
            var c = rf.context3D;
            var g = rf.gl;
            if (undefined == _camera) {
                _camera = camera;
            }
            if (_camera.states) {
                _camera.updateSceneTransform();
            }
            c.setCulling(cull);
            c.setDepthTest(depthMask, passCompareMode);
            c.setBlendFactors(srcFactor, dstFactor);
            _super.prototype.render.call(this, _camera, now, interval);
        };
        return Scene;
    }(SceneObject));
    rf.Scene = Scene;
    var AllActiveSprite = /** @class */ (function (_super) {
        __extends(AllActiveSprite, _super);
        function AllActiveSprite(source, variables) {
            var _this = _super.call(this, source, variables) || this;
            _this.hitArea.allWays = true;
            return _this;
        }
        return AllActiveSprite;
    }(rf.Sprite));
    rf.AllActiveSprite = AllActiveSprite;
    rf.popContainer = new AllActiveSprite();
    rf.tipContainer = new AllActiveSprite();
    var Stage3D = /** @class */ (function (_super) {
        __extends(Stage3D, _super);
        function Stage3D() {
            var _this = _super.call(this) || this;
            _this.camera2D = new rf.CameraOrth();
            _this.camera3D = new rf.Camera3D();
            _this.cameraUI = new rf.CameraUI();
            _this.renderer = new rf.BatchRenderer(_this);
            _this.camera = _this.cameraUI;
            _this.stage = _this;
            return _this;
        }
        Stage3D.prototype.requestContext3D = function (canvas) {
            this.canvas = canvas;
            for (var _i = 0, _a = Stage3D.names; _i < _a.length; _i++) {
                var name = _a[_i];
                try {
                    rf.gl = this.canvas.getContext(name);
                }
                catch (e) {
                }
                if (rf.gl) {
                    break;
                }
            }
            if (undefined == rf.gl) {
                rf.context3D = null;
                this.simpleDispatch(14 /* ERROR */, "webgl is not available");
                return false;
            }
            rf.context3D = rf.singleton(rf.Context3D);
            rf.Capabilities.init();
            rf.MouseInstance.init(rf.Capabilities.isMobile);
            rf.mainKey.init();
            rf.KeyManagerV2.resetDefaultMainKey();
            canvas.addEventListener('webglcontextlost', this.webglContextLostHandler);
            canvas.addEventListener("webglcontextrestored", this.webglContextRestoredHandler);
            this.simpleDispatch(5 /* CONTEXT3D_CREATE */, rf.gl);
            return true;
        };
        Stage3D.prototype.webglContextLostHandler = function (e) {
            console.log("Lost:" + e);
        };
        Stage3D.prototype.webglContextRestoredHandler = function (e) {
            console.log("RestoredHandler:" + e);
        };
        //在这里驱动渲染
        Stage3D.prototype.update = function (now, interval) {
            if (this.states & 16 /* ct */) {
                this.updateTransform();
            }
            rf.context3D.clear(0, 0, 0, 1);
            this.render(this.camera, now, interval);
        };
        Stage3D.prototype.resize = function (width, height) {
            this.camera2D.resize(width, height);
            this.camera3D.resize(width, height);
            this.cameraUI.resize(width, height);
        };
        Stage3D.names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
        return Stage3D;
    }(AllActiveSprite));
    rf.Stage3D = Stage3D;
    var PassContainer = /** @class */ (function (_super) {
        __extends(PassContainer, _super);
        function PassContainer(variables) {
            var _this = _super.call(this, variables) || this;
            _this.hitArea = new rf.HitArea();
            _this.hitArea.allWays = true;
            return _this;
        }
        PassContainer.prototype.render = function (camera, now, interval) {
            var _camera = this.camera;
            var _a = this.material, depthMask = _a.depthMask, passCompareMode = _a.passCompareMode, srcFactor = _a.srcFactor, dstFactor = _a.dstFactor, cull = _a.cull;
            var c = rf.context3D;
            var g = rf.gl;
            if (undefined == _camera) {
                _camera = camera;
            }
            if (_camera.states) {
                _camera.updateSceneTransform();
            }
            c.setCulling(cull);
            c.setDepthTest(depthMask, passCompareMode);
            c.setBlendFactors(srcFactor, dstFactor);
            _super.prototype.render.call(this, _camera, now, interval);
        };
        return PassContainer;
    }(rf.RenderBase));
    rf.PassContainer = PassContainer;
    var UIContainer = /** @class */ (function (_super) {
        __extends(UIContainer, _super);
        function UIContainer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UIContainer.prototype.render = function (camera, now, interval) {
            var cameraUI = rf.ROOT.cameraUI;
            var _a = this.material, depthMask = _a.depthMask, passCompareMode = _a.passCompareMode, srcFactor = _a.srcFactor, dstFactor = _a.dstFactor, cull = _a.cull;
            var c = rf.context3D;
            var g = rf.gl;
            if (cameraUI.states) {
                cameraUI.updateSceneTransform();
            }
            c.setCulling(cull);
            c.setDepthTest(depthMask, passCompareMode);
            c.setBlendFactors(srcFactor, dstFactor);
            _super.prototype.render.call(this, cameraUI, now, interval);
        };
        return UIContainer;
    }(AllActiveSprite));
    rf.UIContainer = UIContainer;
})(rf || (rf = {}));
///<reference path="../Stage3D.ts" />
var rf;
(function (rf) {
    var Mesh = /** @class */ (function (_super) {
        __extends(Mesh, _super);
        function Mesh(variables) {
            var _this = _super.call(this, variables ? variables : rf.vertex_mesh_variable) || this;
            _this.invSceneTransform = rf.newMatrix3D();
            _this.nativeRender = true;
            return _this;
        }
        Mesh.prototype.updateSceneTransform = function () {
            _super.prototype.updateSceneTransform.call(this);
            var _a = this, invSceneTransform = _a.invSceneTransform, sceneTransform = _a.sceneTransform;
            invSceneTransform.set(sceneTransform);
            invSceneTransform.m3_invert();
        };
        Mesh.prototype.render = function (camera, now, interval) {
            var _a = this, geometry = _a.geometry, material = _a.material, skAnim = _a.skAnim;
            if (undefined != geometry && undefined != material) {
                var b = material.uploadContext(camera, this, now, interval);
                if (true == b) {
                    var program = material.program;
                    if (undefined != skAnim) {
                        skAnim.uploadContext(camera, this, program, now, interval);
                    }
                    geometry.uploadContext(camera, this, program, now, interval);
                    rf.context3D.drawTriangles(geometry.index, geometry.numTriangles);
                }
            }
            _super.prototype.render.call(this, camera, now, interval);
        };
        return Mesh;
    }(rf.SceneObject));
    rf.Mesh = Mesh;
    var KFMMesh = /** @class */ (function (_super) {
        __extends(KFMMesh, _super);
        function KFMMesh(material, variables) {
            var _this = _super.call(this, variables) || this;
            _this.material = material;
            return _this;
        }
        KFMMesh.prototype.load = function (url) {
            this.id = url;
            url += "mesh.km";
            rf.loadRes(url, this.loadCompelte, this, 0 /* bin */);
        };
        KFMMesh.prototype.loadCompelte = function (e) {
            var item = e.data;
            var byte = item.data;
            var o = rf.amf_readObject(byte);
            this.setKFM(o);
        };
        KFMMesh.prototype.setKFM = function (kfm) {
            var mesh = kfm.mesh, skeletonData = kfm.skeleton, materialData = kfm.material, anims = kfm.anims;
            var _a = this, material = _a.material, geometry = _a.geometry;
            var c = rf.context3D;
            if (!geometry) {
                this.geometry = geometry = new rf.GeometryBase(this.variables);
            }
            geometry.setData(mesh);
            if (!material) {
                this.material = material = new rf.PhongMaterial();
            }
            material.setData(kfm.material);
            material.diffTex.url = this.id + material.diffTex.url;
            // this.material["diffTex"] = this.id + kfm["diff"];
            // this.material["diffTex"] = this.id + "diff.png";
            //=========================
            //skeleton
            //=========================
            var skeleton = new Skeleton(kfm.skeleton);
            //===========================
            //  Animation
            //===========================
            this.skAnim = skeleton.createAnimation();
            // let action = "Take 001";
            // let action = "stand";
            // let animationData = kfm.anims[action];
            // skeleton.initAnimationData(animationData);
            // this.skAnim.play(animationData, engineNow);
        };
        KFMMesh.prototype.refreshGUI = function (gui) {
            alert(gui);
        };
        return KFMMesh;
    }(Mesh));
    rf.KFMMesh = KFMMesh;
    var Skeleton = /** @class */ (function () {
        function Skeleton(config) {
            this.animations = {};
            var _a = this, boneCount = _a.boneCount, defaultMatrices = _a.defaultMatrices;
            this.boneCount = boneCount = config.boneCount;
            var buffer = new ArrayBuffer(16 * 4 * boneCount);
            this.defaultMatrices = defaultMatrices = new Float32Array(buffer);
            function init(bone) {
                var inv = bone.inv, matrix = bone.matrix, parent = bone.parent, children = bone.children, name = bone.name, index = bone.index;
                if (undefined != inv) {
                    bone.inv = inv = new Float32Array(inv);
                }
                bone.matrix = matrix = new Float32Array(matrix);
                var sceneTransform = new Float32Array(matrix);
                if (parent) {
                    sceneTransform.m3_append(parent.sceneTransform);
                    // matrix3d_multiply(sceneTransform, parent.sceneTransform, sceneTransform);
                }
                if (index > -1) {
                    var matrice = new Float32Array(buffer, index * 16 * 4, 16);
                    matrice.m3_append(sceneTransform, false, inv);
                    // matrix3d_multiply(inv,sceneTransform,matrice);
                }
                bone.sceneTransform = sceneTransform;
                children.forEach(function (b) {
                    init(b);
                });
            }
            init(config.root);
            this.rootBone = config.root;
            this.vertex = rf.context3D.createVertexBuffer(new rf.VertexInfo(new Float32Array(config.vertex), config.data32PerVertex, rf.vertex_skeleton_variable));
        }
        Skeleton.prototype.initAnimationData = function (anim) {
            anim.skeleton = this;
            anim.matrices = [];
            var frames = anim.frames;
            for (var key in frames) {
                frames[key] = new Float32Array(frames[key]);
            }
            this.animations[anim.name] = anim;
        };
        Skeleton.prototype.createAnimation = function () {
            var anim = rf.recyclable(SkeletonAnimation);
            anim.skeleton = this;
            return anim;
        };
        Skeleton.prototype.getMatricesData = function (anim, frame) {
            var result = anim.matrices[frame];
            if (undefined != result) {
                return result;
            }
            var _a = this, boneCount = _a.boneCount, rootBone = _a.rootBone;
            var frames = anim.frames;
            var map = {};
            var buffer = new ArrayBuffer(16 * 4 * boneCount);
            result = new Float32Array(buffer);
            anim.matrices[frame] = result;
            function update(bone) {
                var inv = bone.inv, matrix = bone.matrix, sceneTransform = bone.sceneTransform, parent = bone.parent, children = bone.children, name = bone.name, index = bone.index;
                var frameData = frames[bone.name];
                if (frameData) {
                    matrix.set(frameData.slice(frame * 16, (frame + 1) * 16));
                }
                if (parent) {
                    sceneTransform.m3_append(parent.sceneTransform, false, matrix);
                    // matrix3d_multiply(matrix, parent.sceneTransform, sceneTransform);
                    // multiplyMatrices(parent.sceneTransform,matrix,sceneTransform);
                }
                else {
                    sceneTransform.set(matrix);
                }
                if (index > -1) {
                    var matrice = new Float32Array(buffer, index * 16 * 4, 16);
                    // matrix3d_multiply(inv, sceneTransform, matrice);
                    matrice.m3_append(sceneTransform, false, inv);
                    // multiplyMatrices(sceneTransform,inv,matrice);
                }
                map[bone.name] = bone;
                children.forEach(function (element) {
                    update(element);
                });
            }
            update(rootBone);
            return result;
        };
        return Skeleton;
    }());
    rf.Skeleton = Skeleton;
    var SkeletonAnimation = /** @class */ (function () {
        function SkeletonAnimation() {
            this.pose = {};
            this.currentFrame = 0;
        }
        SkeletonAnimation.prototype.play = function (animationData, now) {
            this.animationData = animationData;
            this.nextTime = now + animationData.eDuration * 1000;
        };
        SkeletonAnimation.prototype.uploadContext = function (camera, mesh, program, now, interval) {
            var _a = this, animationData = _a.animationData, skeleton = _a.skeleton, starttime = _a.starttime, currentFrame = _a.currentFrame, nextTime = _a.nextTime;
            skeleton.vertex.uploadContext(program);
            var matrixes;
            if (undefined == animationData) {
                matrixes = skeleton.defaultMatrices;
            }
            else {
                if (currentFrame >= animationData.totalFrame) {
                    currentFrame = 0;
                }
                if (now > nextTime) {
                    this.nextTime = nextTime + animationData.eDuration * 1000;
                    this.currentFrame = currentFrame + 1;
                }
                matrixes = skeleton.getMatricesData(animationData, currentFrame);
            }
            rf.context3D.setProgramConstantsFromMatrix("bones" /* vc_bones */, matrixes);
        };
        return SkeletonAnimation;
    }());
    rf.SkeletonAnimation = SkeletonAnimation;
})(rf || (rf = {}));
/// <reference path="./com/youbt/rfreference.ts" />
/// <reference path="./com/youbt/stage3d/Stage3D.ts" />
///<reference path="./com/youbt/stage3d/three/Mesh.ts" />
var rf;
(function (rf) {
    var AppBase = /** @class */ (function () {
        function AppBase() {
            this.gcDelay = 3000;
            this.createSource();
            rf.Engine.start();
            rf.ROOT = rf.singleton(rf.Stage3D);
        }
        AppBase.prototype.init = function (canvas) {
            if (undefined == canvas) {
                canvas = document.createElement("canvas");
                document.body.appendChild(canvas);
            }
            var b = rf.ROOT.requestContext3D(canvas);
            if (false == b) {
                console.log("GL create fail");
                return;
            }
            this.initContainer();
            rf.Engine.addResize(this);
            rf.Engine.addTick(this);
            rf.ROOT.addEventListener(rf.EngineEvent.FPS_CHANGE, this.gcChangeHandler, this);
            this.nextGCTime = rf.engineNow + this.gcDelay;
        };
        AppBase.prototype.createSource = function () {
            // panels= singleton(PanelSourceManage)
            var bmd = new rf.BitmapData(2048, 2048, true);
            var source = new rf.BitmapSource().create("component", bmd, true);
            var vo = source.setSourceVO("origin", 1, 1);
            bmd.fillRect(vo.x, vo.y, vo.w, vo.h, "rgba(255,255,255,255)");
            source.originU = vo.ul;
            source.originV = vo.vt;
            rf.componentSource = source;
            var getPixelRatio = function (context) {
                var backingStore = context.backingStorePixelRatio ||
                    context.webkitBackingStorePixelRatio ||
                    context.mozBackingStorePixelRatio ||
                    context.msBackingStorePixelRatio ||
                    context.oBackingStorePixelRatio ||
                    context.backingStorePixelRatio || 1;
                return (window.devicePixelRatio || 1) / backingStore;
            };
            rf.pixelRatio = getPixelRatio(bmd.context);
            // pixelRatio = 1;
        };
        AppBase.prototype.initContainer = function () {
            var g = rf.gl;
            var container = new rf.Scene(rf.vertex_mesh_variable);
            var material = new rf.Material();
            material.depthMask = true;
            material.passCompareMode = 515 /* LEQUAL */;
            material.srcFactor = 770 /* SRC_ALPHA */;
            material.dstFactor = 771 /* ONE_MINUS_SRC_ALPHA */;
            ;
            material.cull = 0 /* NONE */;
            ;
            container.material = material;
            container.camera = rf.ROOT.camera3D;
            rf.ROOT.addChild(container);
            rf.scene = container;
            var uiContainer = new rf.UIContainer(undefined, rf.vertex_ui_variable);
            uiContainer.renderer = new rf.BatchRenderer(uiContainer);
            material = new rf.Material();
            material.depthMask = false;
            material.passCompareMode = 519 /* ALWAYS */;
            material.srcFactor = 770 /* SRC_ALPHA */;
            material.dstFactor = 771 /* ONE_MINUS_SRC_ALPHA */;
            material.cull = 0 /* NONE */;
            uiContainer.material = material;
            rf.ROOT.addChild(uiContainer);
            rf.popContainer.mouseEnabled = false;
            rf.tipContainer.mouseEnabled = false;
            uiContainer.addChild(rf.popContainer);
            uiContainer.addChild(rf.tipContainer);
        };
        AppBase.prototype.update = function (now, interval) {
            //todo
            rf.ROOT.update(now, interval);
            rf.tweenUpdate();
        };
        AppBase.prototype.resize = function (width, height) {
            rf.context3D.configureBackBuffer(rf.stageWidth, rf.stageHeight, 0);
            rf.ROOT.resize(width, height);
        };
        AppBase.prototype.gcChangeHandler = function (event) {
            var _a = this, nextGCTime = _a.nextGCTime, gcDelay = _a.gcDelay;
            var now = rf.engineNow;
            if (now > nextGCTime) {
                rf.context3D.gc(now);
                rf.Res.instance.gc(now);
                this.nextGCTime += gcDelay;
            }
        };
        return AppBase;
    }());
    rf.AppBase = AppBase;
})(rf || (rf = {}));
/// <reference path="./com/youbt/rfreference.ts" />
/// <reference path="./AppBase.ts" />
var rf;
(function (rf) {
    // export var line;
    var Main = /** @class */ (function (_super) {
        __extends(Main, _super);
        function Main() {
            return _super.call(this) || this;
        }
        Main.prototype.init = function (canvas) {
            _super.prototype.init.call(this, canvas);
            if (undefined == rf.gl) {
                return;
            }
            // var matrix = new Matrix3D([-1.0938435201278621e-8,-0.968181073665619,-0.2502503693103784,0,-1.4972529544683223e-8,-0.2502503567352837,0.9681810250144678,0,-0.9999999403953552,1.4337268631142944e-8,-1.1758774204986801e-8,0,6.187005396895984e-8,1.6862283945083618,-0.09339626878499985,1]);
            // var vs = matrix.decompose();
            // matrix.invert();
            // let amfEncode = new AMF3Encode();
            // let amfDecode = new AMF3();
            // amfEncode.writeObject(1000);
            // let b = amfEncode.toUint8Array().buffer;
            // amfDecode.setArrayBuffer(b);
            // let re = amfDecode.readObject();
            // gl.enable(gl.DEPTH_TEST);  
            // gl.depthMask(true);
            // gl.depthFunc(gl.LEQUAL);
            // context3D.setDepthTest(true,gl.LEQUAL)
            var sun = new rf.DirectionalLight();
            sun.setPos(100, 100, 100);
            rf.scene.sun = sun;
            var g;
            var camera = rf.ROOT.camera3D;
            rf.scene.camera = camera;
            // let f = Math.sin(45 * DEGREES_TO_RADIANS) * camera.originFar / 2;
            var f = camera.originFar / 2;
            f = Math.sqrt(f * f / 3);
            // let{x,y,z} = camera;
            // let cos = Math.cos(45 * DEGREES_TO_RADIANS);
            // let sin = Math.sin(45 * DEGREES_TO_RADIANS);
            // x = f * sin * cos;
            // y = f * sin * sin;
            // z = f * cos;
            // camera.setPos(f * sin * cos,f * sin * sin,f * cos);
            camera.setPos(f, f, f);
            // camera.z = f
            // camera.y = f;
            camera.lookat(rf.newVector3D(0, 0, 0));
            new rf.TrackballControls(camera);
            var w = 500;
            var t = 2;
            var tr = new rf.Trident(w, t);
            rf.scene.addChild(tr);
            rf.sp = tr;
            // line.rotationX = 45;
            // let line = new Line3D();
            // line.clear();
            // line.moveTo(-500,0,500,t);
            // line.lineTo(500,0,500,t);
            // line.lineTo(500,0,-500,t);
            // line.lineTo(-500,0,-500,t);
            // line.lineTo(-500,0,500,t);
            // line.end();
            // scene.addChild(line);
            var variables = rf.vertex_mesh_variable;
            var w_e = w * 1.1;
            var m = new rf.PhongMaterial();
            m.cull = 1029 /* BACK */;
            // let geo = new BoxGeometry(variables).create(w,w,w)
            var r = 40;
            // m.diffTex = context3D.getTextureData("../assets/mesh/a10010m/diff.png");
            m.diff = rf.newColor(0xAAAAAA);
            var plane = new rf.PlaneGeometry(variables).create(w * 2, w * 2);
            var mesh = new rf.Mesh(variables);
            mesh.rotationX = -90;
            mesh.geometry = plane;
            mesh.material = m;
            rf.scene.addChild(mesh);
            // plane = new PlaneGeometry(variables).create(w*2,w);
            // mesh = new Mesh(variables);
            // mesh.init(plane,m);
            // mesh.setPos(w+80,0,0);
            // scene.addChild(mesh);
            // let box = new BoxGeometry(variables).create(w,w,w);
            // mesh = new Mesh(variables);
            // mesh.init(box,m);
            // mesh.setPos(0,-110,0);
            // scene.addChild(mesh);
            // let sphere = new SphereGeometry(variables).create(r,r,w*.5);
            // mesh = new Mesh(variables);
            // mesh.init(sphere,m);
            // mesh.setPos(0,0,0);
            // scene.addChild(mesh);
            // let torus = new TorusGeomerty(variables).create(r,r,w*.1375,w*.375);
            // mesh = new Mesh(variables);
            // mesh.init(torus,m);
            // mesh.setPos(0,70,0);
            // scene.addChild(mesh);
            var kfmMesh = new rf.KFMMesh(new rf.PhongMaterial());
            kfmMesh.setSca(100, 100, 100);
            kfmMesh.load("../assets/mesh/a10010m/");
            // kfmMesh.load("http://192.168.3.214/webgl/ss/mesh/a01100nan/")
            // kfmMesh.load("assets/hero001/");
            rf.scene.addChild(kfmMesh);
            var gui = new dat.GUI();
            var folder = gui.addFolder("mesh");
            // folder.add(kfmMesh,"refreshGUI");
            // var posFolder = folder.addFolder("position");
            // posFolder.add(kfmMesh,"x",-1000,1000).step(0.01);
            // posFolder.add(kfmMesh,"y",-1000,1000).step(0.01);
            // posFolder.add(kfmMesh,"z",-1000,1000).step(0.01);
            // var rotFolder = folder.addFolder("rotation");
            // rotFolder.add(kfmMesh,"rotationX",-360,360);
            // rotFolder.add(kfmMesh,"rotationY",-360,360);
            // rotFolder.add(kfmMesh,"rotationZ",-360,360);
            // particle_Perfix = "http://192.168.3.214/webgl/ss/particle/";
            // particle_Texture_Perfix = "http://192.168.3.214/webgl/ss/tex/particle/";
            // particle_Perfix = "assets/particle/";
            // particle_Texture_Perfix = "assets/tex/particle/";
            // let particle = new Particle();
            // particle.setSca(100,100,100);
            // particle.load("a");
            // scene.addChild(particle);
            // new AMF3Test().load("assets/test.dat");
            // let geo = new TorusGeomerty(variables).create(r,r,w*.1375,w*.375);
            // let geo = new SphereGeometry(variables).create(r,r,w*.5);
            // let geo = new BoxGeometry(variables).create(w,w,w);
            // let geo = new PlaneGeometry(variables).create(w,w);
            // let qc = 10;
            // let count = qc*qc;
            // let tx = -(qc-1)/2 * w_e;
            // let ty = -(qc-1)/2 * w_e;
            // for(let i=0;i<count;i++){
            //     let c =Math.floor(i / qc);
            //     let p = i % qc;
            //     let mesh = new Mesh(variables);
            //     mesh.init(geo,m);
            //     mesh.setPos(tx + p * w_e,ty + c * w_e,0);
            //     scene.addChild(mesh);
            // }
            // mesh.rotationX = -90;
            // let m  = new Matrix3D();
            // m.appendRotation(45,Vector3D.Z_AXIS);
            // m.appendTranslation(100,100,100);
            // m.invert();
            // m.invert();
            var profile = rf.singleton(rf.GUIProfile);
            rf.tipContainer.addChild(profile);
            // let s = new Sprite();
            // s.renderer = new BatchRenderer(s);
            // g = s.graphics;
            // g.clear();
            // g.drawCube(-100,-100,-100,200,200,200,0xFFFFFF);
            // g.end();
            // s.rotationX = 45
            // ROOT.addChild(s);
            // var m:Matrix3D = new Matrix3D();
            // m.appendRotation(90,Vector3D.X_AXIS);
            // m.appendRotation(90,Vector3D.Y_AXIS);
            // m.appendRotation(90,Vector3D.Z_AXIS);
            // let c = m.toString();
            // let icon = new IconView();
            // icon.x = 0;
            // icon.y = 0;
            // icon.resetSize(100,100);
            // ROOT.addChild(icon);
            // icon.setUrl("assets/ranger.png");
            // let profile = singleton(GUIProfile);
            // ROOT.addChild(profile);
            // line = new Trident(200,4);
            // ROOT.addChild(line);
            // ROOT.camera2D.z = -1.5
            // let s = new Sprite();
            // s.renderer = new BatchRenderer(s);
            // s.x = 100;
            // g = s.graphics;
            // g.clear();
            // g.drawRect(0,0,100,100,0xFF0000)
            // g.end();
            // s.setPos(100,100,0)
            // ROOT.addChild(s);
            //p3d加载并显示
            // let span = document.getElementById("fps");
            // var t = new TextField();
            // t.init();
            // t.format.size = 30;
            // t.format.init();
            // t.y = 40;
            // ROOT.addChild(t);
            // Engine.dispatcher.addEventListener(EngineEvent.FPS_CHANGE,function (){
            //     let str = `pixelRatio:${pixelRatio} fps:${Engine.fps} code:${Engine.code.toFixed(2)}`
            //     span.innerHTML = str;
            //     t.text = str;
            // });
            // let bmd = componentSource.bmd.canvas;
            // let style = bmd.style;
            // style.position="fixed";
            // style.left = "500px";
            // style.top = "0px";
            // document.body.appendChild(bmd);
            // canvas.id = "component";
            // let div = document.getElementById("game");
            // div.appendChild(bmd);
            // canvas.style="position:absolutly;left:100px;top:100px";
            // 
            // let bw = 100;
            // let ba = 1;
            // let bb = 1;
            // let bitmapData = new BitmapData(bw,bw,true,0xFFFFFFFF);
            // bitmapData.fillRect(0,0,ba,bb,"rgba(255,255,255,255)")
            // context3D.createTexture("test",bitmapData);
            // document.body.appendChild(bitmapData.canvas);
            // for(let i = 0;i<1;i++){
            //     sp = new Sprite();
            //     sp.x = Math.random() * stageWidth;
            //     sp.y = Math.random() * stageHeight;
            //     sp.alpha = Math.random() * 0.3 + 0.2;
            //     g = sp.graphics;
            //     g.clear();
            //     g.drawRect(0,0,100,100,0xFFDD00);
            //     g.end();
            //     ROOT.addChild(sp);
            // }
            // g = ROOT.graphics;
            // g.clear();
            // g.drawRect(0,0,500,500,0xFF0000);
            // g.end();
            // Engine.removeTick(this);
            // ROOT.update(10,10);
            // this.bitmapDataTest();
            // new MaxRectsBinPackTest();
            // new WebglTest();
            // new MaxRectsTest();
            // new Dc_Texture();
            // let _image:Image = new Image();
            // _image.load("assets/ranger.png");
            // ROOT.addChild(_image);
            // t.html = true;
            // t.x = 10;
            // t.y = 10;
            // let format = t.format;
            // format.oy = 0;
            // t.w = 200;
            // t.wordWrap = true;
            // t.format = new TextFormat();
            // t.format.size = 30;
            // t.format.oy = 3;
            // t.format.italic = "italic";
            // t.format.bold = "bold";
            // t.format.gradient = [{color: 0xffff00}];
            // t.format.gradient = [{color: 0xff0000, percent: 0}, {color: 0x00ff00, percent: 1}];
            // t.format.stroke = {size: 2, color: 0x556600};
            // t.format.shadow = {color: 0xffffff, blur: 4, offsetX: 10, offsetY: 10};
            // t.format.init();
            // t.text = "<font color='#FF0000'>你好</font>啊\n这是<font size='20'>一个<font color='#00FF00'>HTMLTEXT</font></font>";
            // t.text = "你好啊\n这是一个HTMLTEXT";
            // ROOT.addChild(t);
            // format.size = 12;
            // format.init();
            // t.text = "FPS:60";
            // t.text = "fps:60";
            // t.text = "abc";
            // Engine.dispatcher.addEventListener(EngineEvent.FPS_CHANGE,function (){
            //     t.text =`fps:${Engine.fps}\ncode:${Engine.code.toFixed(2)}`
            // });
            // let icon = new IconView();
            // icon.x = 100;
            // icon.y = 100;
            // icon.resetSize(100,100);
            // ROOT.addChild(icon);
            // icon.setUrl("assets/ranger.png");
            // let panel = new Panelui();
            // panel.x = 300;
            // panel.y = 300;
            // ROOT.addChild(panel);
            // let panelutil = new PanelUtils();
            // 潘华专用  
            new rf.Pan_Test();
            // new Eva_Text();
        };
        Main.prototype.onTest = function () {
        };
        return Main;
    }(rf.AppBase));
    rf.Main = Main;
})(rf || (rf = {}));
var rf;
(function (rf) {
    //var facade
    //facade 注册记录保存所有Model class 等信息
    var Facade = /** @class */ (function (_super) {
        __extends(Facade, _super);
        function Facade() {
            var _this = _super.call(this) || this;
            _this.SINGLETON_MSG = "Facade Singleton already constructed!";
            _this.mediatorMap = {};
            _this.modelMap = {};
            _this.mediator = null;
            return _this;
        }
        Facade.prototype.toggleMediator = function (mediator, type) {
            if (type === void 0) { type = -1; }
            var panel = mediator._panel;
            if (panel == null)
                return null;
            if (mediator.isReady == false && mediator.startSync()) {
                this.mediator = mediator;
                this.type = type;
                mediator.addEventListener(21 /* COMPLETE_LOADED */, this.onCompleteHandle, this);
                return;
            }
            this.mediator = null;
            switch (type) {
                case 1:
                    if (panel.isShow == false) {
                        panel.show();
                    }
                    else {
                        panel.bringTop();
                    }
                    break;
                case 0:
                    if (panel.isShow)
                        panel.hide();
                    break;
                case -1:
                    panel.isShow ? panel.hide() : panel.show();
                    break;
            }
            return mediator;
        };
        Facade.prototype.onCompleteHandle = function (e) {
            var mediator = this.mediator;
            if (mediator && mediator.hasEventListener(21 /* COMPLETE_LOADED */)) {
                mediator.off(21 /* COMPLETE_LOADED */, this.onCompleteHandle);
            }
            if (mediator) {
                this.toggleMediator(this.mediator, this.type);
            }
        };
        Facade.prototype.registerEvent = function (events, thisobj) {
            for (var key in events) {
                var fun = events[key];
                this.on(key, fun, thisobj);
            }
        };
        Facade.prototype.removeEvent = function (event) {
            for (var key in event) {
                var fun = event[key];
                this.off(key, fun);
            }
        };
        return Facade;
    }(rf.MiniDispatcher));
    rf.Facade = Facade;
    rf.facade = rf.singleton(Facade);
    var Mediator = /** @class */ (function (_super) {
        __extends(Mediator, _super);
        function Mediator(NAME) {
            var _this = _super.call(this) || this;
            _this.isReady = false;
            _this.name = NAME;
            _this.mEventListeners = {};
            rf.facade.mediatorMap[_this.name] = _this;
            _this.eventInterests = {};
            return _this;
        }
        Mediator.prototype.setPanel = function (panel) {
            if (this._panel) {
                this.setBindView(false);
            }
            this._panel = panel;
            if ("$panel" in this) {
                this["$panel"] = panel;
            }
        };
        Mediator.prototype.startSync = function () {
            var panel = this._panel;
            if (panel.loaded == false) {
                panel.load();
                panel.addEventListener(4 /* COMPLETE */, this.preViewCompleteHandler, this);
            }
            else {
                this.preViewCompleteHandler(undefined);
            }
            return true;
        };
        Mediator.prototype.preViewCompleteHandler = function (e) {
            if (e) {
                var skin = e.currentTarget;
                skin.removeEventListener(4 /* COMPLETE */, this.preViewCompleteHandler);
                this.setBindView(true);
            }
            //checkModeldata
            // TimerUtil.add(this.mediatorReadyHandle,100);
            this.mediatorReadyHandle();
            this.simpleDispatch(21 /* COMPLETE_LOADED */, this);
        };
        // _readyExecutes:Function[];
        // _readyExecutesArgs:{[key:string]:any} = {}
        // addReadyExecute(fun:Function,...args):void{
        // const {_panel} = this;
        // let _readyExecutes = this._readyExecutes;
        // let _readyExecutesArgs = this._readyExecutesArgs
        // if(this.isReady){
        // 	if(_panel && !_panel.loaded)
        // 	{
        //         let length:number = _readyExecutes.length;
        //         _readyExecutes.push(fun);
        //         _readyExecutesArgs[length] =args;
        // 		return;
        //     }
        //     fun.apply(null,args);
        // 	return;
        // }else{
        // 	this.startSync();
        // }
        // let length:number = _readyExecutes.length;
        // _readyExecutes.push(fun);
        // _readyExecutesArgs[length] =args;
        // }
        Mediator.prototype.awakenAndSleepHandle = function (e) {
            var type = e.type;
            switch (type) {
                case 19 /* ADD_TO_STAGE */:
                    rf.facade.registerEvent(this.eventInterests, this);
                    this.awaken();
                    break;
                case 20 /* REMOVE_FROM_STAGE */:
                    rf.facade.removeEvent(this.eventInterests);
                    this.sleep();
                    break;
            }
        };
        Mediator.prototype.setBindView = function (isBind) {
            if (isBind) {
                this._panel.addEventListener(19 /* ADD_TO_STAGE */, this.awakenAndSleepHandle, this);
                this._panel.addEventListener(20 /* REMOVE_FROM_STAGE */, this.awakenAndSleepHandle, this);
            }
            else {
                this._panel.removeEventListener(19 /* ADD_TO_STAGE */, this.awakenAndSleepHandle);
                this._panel.removeEventListener(20 /* REMOVE_FROM_STAGE */, this.awakenAndSleepHandle);
            }
        };
        Mediator.prototype.mediatorReadyHandle = function () {
            this.isReady = true;
            //    let _readyExecutes = this._readyExecutes;
            //    let _readyExecutesArgs = this._readyExecutesArgs;
            //     if(_readyExecutes.length){
            //         let i = 0;
            //         while(_readyExecutes.length){
            //             let fun = _readyExecutes.shift();
            //             let args = _readyExecutesArgs[i];
            //             fun.apply(null,args);
            //             i++;
            //         }
            // 	}
            if (this._panel.isShow) {
                rf.facade.registerEvent(this.eventInterests, this);
                this.awaken();
            }
        };
        Mediator.prototype.sleep = function () {
        };
        Mediator.prototype.awaken = function () {
        };
        Mediator.prototype.onRemove = function () {
        };
        return Mediator;
    }(rf.MiniDispatcher));
    rf.Mediator = Mediator;
    var BaseMode = /** @class */ (function (_super) {
        __extends(BaseMode, _super);
        function BaseMode(modelName) {
            var _this = _super.call(this) || this;
            _this.modelName = modelName;
            //注册
            rf.facade.modelMap[modelName] = _this;
            return _this;
        }
        BaseMode.prototype.refreshRuntimeData = function (type, data) {
        };
        BaseMode.prototype.initRuntime = function () {
        };
        BaseMode.prototype.onRegister = function () {
        };
        BaseMode.prototype.onRemove = function () {
        };
        return BaseMode;
    }(rf.MiniDispatcher));
    rf.BaseMode = BaseMode;
})(rf || (rf = {}));
//之后移植到Sprite里面
var rf;
(function (rf) {
    var DataBase = /** @class */ (function () {
        function DataBase() {
        }
        DataBase.prototype.DataBase3D = function () {
        };
        Object.defineProperty(DataBase.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
                this.doData();
            },
            enumerable: true,
            configurable: true
        });
        DataBase.prototype.doData = function () {
        };
        DataBase.prototype.dispose = function () {
        };
        DataBase.prototype.clear = function () {
        };
        return DataBase;
    }());
    rf.DataBase = DataBase;
    var SkinBase = /** @class */ (function (_super) {
        __extends(SkinBase, _super);
        function SkinBase(skin) {
            if (skin === void 0) { skin = null; }
            var _this = _super.call(this) || this;
            _this._enabled = true;
            if (skin) {
                _this.skin = skin;
                skin.mouseEnabled = true;
            }
            return _this;
        }
        Object.defineProperty(SkinBase.prototype, "skin", {
            get: function () { return this._skin; },
            set: function (value) {
                if (this._skin) {
                    // this._skin.skinBase = null;
                }
                this._skin = value;
                if (this._skin) {
                    // this._skin.skinBase = this;
                }
                this.bindComponents();
            },
            enumerable: true,
            configurable: true
        });
        SkinBase.prototype.bindComponents = function () { };
        SkinBase.prototype.refreshData = function () { this.doData(); };
        Object.defineProperty(SkinBase.prototype, "selected", {
            get: function () { return this._selected; },
            set: function (value) { this._selected = value; this.doSelected(); },
            enumerable: true,
            configurable: true
        });
        SkinBase.prototype.doSelected = function () { };
        Object.defineProperty(SkinBase.prototype, "enabled", {
            get: function () { return this._enabled; },
            set: function (value) { if (this._enabled == value) {
                return;
            } this._enabled = value; this.doEnabled(); },
            enumerable: true,
            configurable: true
        });
        SkinBase.prototype.doEnabled = function () { this._skin.mouseEnabled = false; this._skin.mouseChildren = false; };
        // get scenePos():Vector3D{return this._skin.scenePos};
        SkinBase.prototype.awaken = function () { };
        SkinBase.prototype.sleep = function () { };
        SkinBase.prototype.addEventListener = function (type, listener, thisobj, priority) {
            if (priority === void 0) { priority = 0; }
            this._skin.addEventListener(type, listener, thisobj, priority);
        };
        SkinBase.prototype.dispatchEvent = function (event) {
            return this._skin.dispatchEvent(event);
        };
        SkinBase.prototype.hasEventListener = function (type) {
            return this._skin.hasEventListener(type);
        };
        SkinBase.prototype.removeEventListener = function (type, listener) {
            this._skin.removeEventListener(type, listener);
        };
        SkinBase.prototype.simpleDispatch = function (type, data, bubbles) {
            if (data === void 0) { data = null; }
            if (bubbles === void 0) { bubbles = false; }
            return this._skin.simpleDispatch(type, data, bubbles);
        };
        Object.defineProperty(SkinBase.prototype, "visible", {
            get: function () {
                var _skin = this._skin;
                if (_skin) {
                    return _skin.visible;
                }
                return true;
            },
            set: function (value) {
                var _skin = this._skin;
                if (_skin) {
                    _skin.visible = value;
                    this.doVisible();
                }
            },
            enumerable: true,
            configurable: true
        });
        SkinBase.prototype.doVisible = function () {
        };
        Object.defineProperty(SkinBase.prototype, "alpha", {
            get: function () { return this._skin.alpha; },
            set: function (val) { this._skin.alpha = val; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkinBase.prototype, "scale", {
            get: function () { return this._skin.scaleX; },
            set: function (val) { this._skin.scaleX = val; this._skin.scaleY = val; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkinBase.prototype, "x", {
            get: function () { return this._skin.x; },
            set: function (value) { this._skin.x = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkinBase.prototype, "y", {
            get: function () { return this._skin.y; },
            set: function (value) { this._skin.y = value; },
            enumerable: true,
            configurable: true
        });
        SkinBase.prototype.addChild = function (child) {
            this._skin.addChild(child);
        };
        SkinBase.prototype.addChildAt = function (child, index) {
            this._skin.addChildAt(child, index);
        };
        SkinBase.prototype.invalidate = function (func) {
            if (func === void 0) { func = null; }
            // nativeStage.addEventListener(Event.ENTER_FRAME, onInvalidate);
            // if(null == func){
            // 	func = draw;
            // }
            // if(!invalidateFuncs)
            // {
            // 	invalidateFuncs = [];
            // }
            // if(invalidateFuncs.indexOf(func) == -1){
            // 	invalidateFuncs.push(func);
            // }
        };
        SkinBase.prototype.invalidateRemove = function (func) {
            if (func === void 0) { func = null; }
            // if(null == func){
            // 	func = draw;
            // }
            // var i:int = invalidateFuncs.indexOf(func);
            // if(i != -1){
            // 	invalidateFuncs.splice(i,1);
            // 	if(!invalidateFuncs.length){
            // 		nativeStage.removeEventListener(Event.ENTER_FRAME, onInvalidate);
            // 	}
            // }
        };
        SkinBase.prototype.onInvalidate = function (event) {
            // IEventDispatcher(event.currentTarget).removeEventListener(Event.ENTER_FRAME, onInvalidate);
            // var arr:Array = invalidateFuncs.concat();
            // invalidateFuncs.length = 0;
            // for each(var func:Function in arr){
            // 	func();
            // }
        };
        SkinBase.prototype.remove = function (event) {
            if (event === void 0) { event = null; }
            if (this._skin && this._skin.parent) {
                this._skin.parent.removeChild(this._skin);
            }
        };
        return SkinBase;
    }(DataBase));
    rf.SkinBase = SkinBase;
    var PanelBase = /** @class */ (function (_super) {
        __extends(PanelBase, _super);
        function PanelBase() {
            var _this = _super.call(this, new rf.Component()) || this;
            _this.isShow = false;
            return _this;
        }
        PanelBase.prototype.show = function (container, isModal) {
            if (container === void 0) { container = null; }
            if (isModal === void 0) { isModal = false; }
            if (this.isShow) {
                this.bringTop();
                return;
            }
            if (!container) {
                container = rf.popContainer;
            }
            container.addChild(this._skin);
            this.isShow = true;
            this.awaken();
            this.effectTween(1);
            this.addEventListener(50 /* MouseDown */, this.panelClickHandler, this);
            if (this.hasEventListener("PanelEvent_SHOW" /* SHOW */)) {
                this.simpleDispatch("PanelEvent_SHOW" /* SHOW */);
            }
        };
        PanelBase.prototype.effectTween = function (type) {
            this.getTweener(type);
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
                this._skin.remove();
            }
        };
        PanelBase.prototype.getTweener = function (type) {
            // if(this._skin.alpha == 1)
            // {
            // 	this._skin.alpha = 0;
            // }
        };
        PanelBase.prototype.effectEndByBitmapCache = function (type) {
            if (type == 0) {
                this._skin.remove();
            }
            else {
                // this._skin.alpha = 1;
            }
        };
        PanelBase.prototype.hide = function (e) {
            if (e === void 0) { e = undefined; }
            if (!this.isShow) {
                return;
            }
            this.isShow = false;
            this.sleep();
            this.effectTween(0);
            // this.hideState();
            this.removeEventListener(50 /* MouseDown */, this.panelClickHandler);
            if (this.hasEventListener("PanelEvent_HIDE" /* HIDE */)) {
                this.simpleDispatch("PanelEvent_HIDE" /* HIDE */);
            }
            console.log("Mediatro sleep");
        };
        PanelBase.prototype.bringTop = function () {
            var skin = this._skin;
            if (skin.parent == null)
                return;
            skin.parent.addChild(skin);
        };
        PanelBase.prototype.panelClickHandler = function (e) {
            this.bringTop();
        };
        return PanelBase;
    }(SkinBase));
    rf.PanelBase = PanelBase;
    var TPanel = /** @class */ (function (_super) {
        __extends(TPanel, _super);
        function TPanel(uri, cls) {
            var _this = _super.call(this) || this;
            _this.isReadyShow = false;
            _this.loaded = false;
            _this.uri = uri;
            _this.clsName = cls;
            _this._resizeable = true;
            return _this;
        }
        TPanel.prototype.getURL = function () {
            var url = "";
            if (!url) {
                url = "../assets/" + this.uri + ".p3d";
            }
            return url;
        };
        TPanel.prototype.show = function (container, isModal) {
            if (container === void 0) { container = null; }
            if (isModal === void 0) { isModal = false; }
            if (this.loaded == false) {
                this.isReadyShow = true;
                this.container = container;
                this.isModel = isModal;
                this.load();
                return;
            }
            _super.prototype.show.call(this, container, isModal);
        };
        TPanel.prototype.load = function () {
            if (this.source == undefined || this.source.status == 0) {
                var url = this.getURL();
                var source = rf.manage.load(url, this.uri);
                source.addEventListener(4 /* COMPLETE */, this.asyncsourceComplete, this);
                this.source = source;
                // this.showload();
            }
            else {
                this.asyncsourceComplete(undefined);
            }
        };
        TPanel.prototype.asyncsourceComplete = function (e) {
            var source = this.source;
            var cs = source.setting[this.clsName];
            if (cs) {
                var skin = this.skin;
                skin.source = source.source;
                skin.setSymbol(cs);
                skin.renderer = new rf.BatchRenderer(skin);
            }
            this.loaded = true;
            this.simpleDispatch(4 /* COMPLETE */);
            if (this.isReadyShow) {
                this.show(this.container, this.isModel);
            }
        };
        TPanel.prototype.hide = function (e) {
            if (e === void 0) { e = undefined; }
            _super.prototype.hide.call(this, e);
            this.isReadyShow = false;
        };
        return TPanel;
    }(PanelBase));
    rf.TPanel = TPanel;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var PanelSource = /** @class */ (function (_super) {
        __extends(PanelSource, _super);
        // ungc:boolean = false;
        function PanelSource() {
            var _this = _super.call(this) || this;
            _this.isReady = false;
            return _this;
        }
        return PanelSource;
    }(rf.BitmapSource));
    rf.PanelSource = PanelSource;
})(rf || (rf = {}));
///<reference path="../PanelSource.ts" />
var rf;
(function (rf) {
    var PanelSourceManage = /** @class */ (function () {
        function PanelSourceManage() {
            this.all_res = {};
        }
        PanelSourceManage.prototype.load = function (url, uri) {
            var res = this.getres(url, uri);
            if (res.status == 0) {
                res.load(url);
            }
            return res;
        };
        PanelSourceManage.prototype.getres = function (url, uri) {
            var all_res = this.all_res;
            var res = all_res[uri];
            if (res == undefined) {
                var index = url.lastIndexOf(".");
                if (index == -1) {
                    return undefined;
                }
                res = new AsyncResource();
                all_res[uri] = res;
            }
            return res;
        };
        return PanelSourceManage;
    }());
    rf.PanelSourceManage = PanelSourceManage;
    var AsyncResource = /** @class */ (function (_super) {
        __extends(AsyncResource, _super);
        function AsyncResource() {
            var _this = _super.call(this) || this;
            _this.status = 0;
            return _this;
        }
        AsyncResource.prototype.load = function (url) {
            rf.loadRes(url, this.p3dloadComplete, this, 1 /* text */);
        };
        AsyncResource.prototype.p3dloadComplete = function (e) {
            if (e.type != 4 /* COMPLETE */) {
                return;
            }
            var res = e.data;
            var o = JSON.parse(res.data);
            this.resourceComplete(o);
        };
        AsyncResource.prototype.resourceComplete = function (o) {
            //生成对应的模块 一次只有一个对象    
            //创建bitmapsource
            this.d_setting = o;
            //加载对应的图片资源
            var url = "../assets/" + o['image'] + '.png';
            rf.loadRes(url, this.onImageComplete, this, 3 /* image */);
        };
        AsyncResource.prototype.onImageComplete = function (e) {
            var status = this.status;
            if (e.type != 4 /* COMPLETE */) {
                status = 0;
                return;
            }
            status = 1;
            var d_setting = this.d_setting;
            var res = e.data;
            var image = res.data;
            var bw = (d_setting['txtwidth'] >= image.width) ? d_setting['txtwidth'] : image.width;
            var bh = d_setting['txtheight'] + image.height;
            var bmd = new rf.BitmapData(bw, bh, true);
            bmd.draw(image);
            this.source = new rf.PanelSource();
            this.source.create(d_setting['image'], bmd, true);
            var vo = this.source.setSourceVO("panelimg", image.width, image.height, 1);
            // this.source.bmd.context.drawImage(image,vo.x,vo.y);
            var framekeys = Object.keys(d_setting['frames']);
            var areavo = this.source.areas[1];
            var bitvo;
            var frameObj;
            for (var _i = 0, framekeys_1 = framekeys; _i < framekeys_1.length; _i++) {
                var key = framekeys_1[_i];
                frameObj = d_setting['frames'][key];
                bitvo = areavo.createFrameArea(key, { x: frameObj['ox'], y: frameObj['oy'], w: frameObj['width'], h: frameObj['height'], ix: frameObj['ix'], iy: frameObj['iy'] });
                bitvo.refreshUV(this.source.width, this.source.height);
            }
            this.source.isReady = true;
            this.setting = d_setting["symbols"];
            this.simpleDispatch(4 /* COMPLETE */);
        };
        return AsyncResource;
    }(rf.MiniDispatcher));
    rf.AsyncResource = AsyncResource;
})(rf || (rf = {}));
///<reference path="./Stage3D.ts" />
var rf;
(function (rf) {
    var Mouse = /** @class */ (function () {
        function Mouse() {
            this.mouseElement = {};
            this.touchElement = {};
            this.touchCenterY = 0;
            this.touchLen = 0;
        }
        Mouse.prototype.init = function (mobile) {
            var _a = this, touchElement = _a.touchElement, mouseElement = _a.mouseElement;
            mouseElement[0] = { target: undefined, time: 0, down: 50 /* MouseDown */, up: 53 /* MouseUp */, click: 56 /* CLICK */ };
            mouseElement[1] = { target: undefined, time: 0, down: 52 /* MouseMiddleDown */, up: 55 /* MouseMiddleUp */, click: 58 /* middleClick */ };
            mouseElement[2] = { target: undefined, time: 0, down: 51 /* MouseRightDown */, up: 54 /* MouseRightUp */, click: 57 /* RightClick */ };
            //10个指头应该够了吧
            // touchElement[0] = {target:undefined,time:0,data:new MouseEventData(0)};
            // touchElement[1] = {target:undefined,time:0,data:new MouseEventData(1)};
            // touchElement[2] = {target:undefined,time:0,data:new MouseEventData(2)};
            // touchElement[3] = {target:undefined,time:0,data:new MouseEventData(3)};
            // touchElement[4] = {target:undefined,time:0,data:new MouseEventData(4)};
            // touchElement[5] = {target:undefined,time:0,data:new MouseEventData(5)};
            // touchElement[6] = {target:undefined,time:0,data:new MouseEventData(6)};
            // touchElement[7] = {target:undefined,time:0,data:new MouseEventData(7)};
            // touchElement[8] = {target:undefined,time:0,data:new MouseEventData(8)};
            // touchElement[9] = {target:undefined,time:0,data:new MouseEventData(9)};
            var _this = this;
            function m(e) {
                _this.mouseHanlder(e);
            }
            ;
            var canvas = rf.ROOT.canvas;
            if (false == mobile) {
                canvas.onmousedown = m;
                canvas.onmouseup = m;
                canvas.onmousewheel = m;
                canvas.onmousemove = this.mouseMoveHandler;
                canvas.oncontextmenu = function (event) {
                    event.preventDefault();
                };
            }
            else {
                canvas.ontouchstart = this.touchHandler;
                canvas.ontouchmove = this.touchMoveHandler;
                canvas.ontouchend = this.touchHandler;
                canvas.ontouchcancel = this.touchHandler;
            }
        };
        Mouse.prototype.mouseHanlder = function (e) {
            var mouse = rf.MouseInstance;
            var mouseX = e.clientX * rf.pixelRatio;
            var mouseY = e.clientY * rf.pixelRatio;
            rf.nativeMouseX = mouseX;
            rf.nativeMouseY = mouseY;
            var d;
            var now = rf.engineNow;
            var numType = 0;
            var element;
            if (mouse.preMouseTime != now) {
                mouse.preMouseTime = now;
                d = rf.ROOT.getObjectByPoint(mouseX, mouseY, 1);
            }
            else {
                d = mouse.preTarget;
            }
            if (undefined != d) {
                var data = rf.recyclable(rf.MouseEventData);
                data.id = e.button;
                data.x = mouseX;
                data.y = mouseY;
                data.ctrl = e.ctrlKey;
                data.alt = e.altKey;
                data.shift = e.shiftKey;
                var type = e.type;
                if (type == "mousedown") {
                    //判断左右按键
                    element = mouse.mouseElement[data.id];
                    element.target = d;
                    element.time = now;
                    d.simpleDispatch(element.down, data, true);
                }
                else if (type == "mouseup") {
                    element = mouse.mouseElement[data.id];
                    d.simpleDispatch(element.up, event, true);
                    if (element.target == d && now - element.time < 500) {
                        d.simpleDispatch(element.click, data, true);
                    }
                    element.target = null;
                    element.time = 0;
                }
                else if (type == "mousewheel") {
                    data.wheel = e.deltaY;
                    d.simpleDispatch(59 /* MouseWheel */, data, true);
                }
                data.recycle();
            }
        };
        Mouse.prototype.mouseMoveHandler = function (e) {
            var mouse = rf.MouseInstance;
            var now = rf.engineNow;
            if (mouse.preMoveTime == now) {
                return;
            }
            mouse.preMoveTime = now;
            var mouseX = e.clientX * rf.pixelRatio;
            var mouseY = e.clientY * rf.pixelRatio;
            rf.nativeMouseX = mouseX;
            rf.nativeMouseY = mouseY;
            var d = rf.ROOT.getObjectByPoint(mouseX, mouseY, 1);
            if (undefined != d) {
                var data = rf.recyclable(rf.MouseEventData);
                data.id = e.button;
                data.x = mouseX;
                data.y = mouseY;
                data.ctrl = e.ctrlKey;
                data.alt = e.altKey;
                data.shift = e.shiftKey;
                data.dx = (e.movementX || e.mozMovementX || e.webkitMovementX || 0) * rf.pixelRatio;
                data.dy = (e.movementY || e.mozMovementY || e.webkitMovementY || 0) * rf.pixelRatio;
                d.simpleDispatch(60 /* MouseMove */, data, true);
                var preRolled = mouse.preRolled;
                if (preRolled != d) {
                    if (undefined != preRolled) {
                        preRolled.mouseroll = false;
                        preRolled.simpleDispatch(62 /* ROLL_OUT */, data, true);
                    }
                    if (d) {
                        d.mouseroll = true;
                        d.simpleDispatch(61 /* ROLL_OVER */, data, true);
                    }
                    mouse.preRolled = d;
                }
                data.recycle();
            }
        };
        Mouse.prototype.touchHandler = function (e) {
            var mouse = rf.MouseInstance;
            var elements = mouse.touchElement, touchLen = mouse.touchLen, centerY = mouse.touchCenterY;
            var touch = e.changedTouches[0];
            var touches = e.touches;
            var element;
            var data;
            var now = rf.engineNow;
            var d;
            var mouseX = touch.clientX * rf.pixelRatio;
            var mouseY = touch.clientY * rf.pixelRatio;
            rf.nativeMouseX = mouseX;
            rf.nativeMouseY = mouseY;
            element = elements[touch.identifier];
            if (undefined == element) {
                elements[touch.identifier] = element = { target: undefined, time: 0, data: new rf.MouseEventData(touch.identifier) };
            }
            data = element.data;
            data.dx = mouseX - data.x;
            data.dy = mouseY - data.y;
            data.x = mouseX;
            data.y = mouseY;
            if (touches.length == 2) {
                var _a = touches[0], x0 = _a.clientX, y0 = _a.clientY;
                var _b = touches[1], x1 = _b.clientX, y1 = _b.clientY;
                var x = (x0 + x1) / 2;
                var y = (y0 + y1) / 2;
                var dx = x1 - x0;
                var dy = y1 - y0;
                var len = Math.sqrt(dx * dx + dy * dy);
                mouse.touchCenterY = y;
                mouse.touchLen = len;
            }
            if (mouse.preMouseTime != now) {
                mouse.preMouseTime = now;
                d = rf.ROOT.getObjectByPoint(mouseX, mouseY, 1);
            }
            else {
                d = mouse.preTarget;
            }
            if (undefined != d) {
                if (e.type == "touchstart") {
                    if (true == d.mousedown) {
                        return;
                    }
                    element.target = d;
                    element.time = now;
                    d.mousedown = true;
                    d.simpleDispatch(50 /* MouseDown */, data, true);
                }
                else {
                    if (false == d.mousedown) {
                        return;
                    }
                    d.mousedown = false;
                    d.simpleDispatch(53 /* MouseUp */, data, true);
                    if (element.target == d && now - element.time < 500) {
                        d.simpleDispatch(56 /* CLICK */, data, true);
                    }
                }
            }
        };
        Mouse.prototype.touchMoveHandler = function (e) {
            var mouse = rf.MouseInstance;
            var now = rf.engineNow;
            if (mouse.preMoveTime == now) {
                return;
            }
            mouse.preMoveTime = now;
            var elements = mouse.touchElement, centerY = mouse.touchCenterY, touchLen = mouse.touchLen, preTarget = mouse.preTarget;
            var touches = e.touches, changedTouches = e.changedTouches;
            var element;
            var data;
            var len = touches.length;
            if (len == 1) {
                var touch = changedTouches[0];
                var mouseX = touch.clientX * rf.pixelRatio;
                var mouseY = touch.clientY * rf.pixelRatio;
                rf.nativeMouseX = mouseX;
                rf.nativeMouseY = mouseY;
                var d = rf.ROOT.getObjectByPoint(mouseX, mouseY, 1);
                if (undefined != d) {
                    element = elements[touch.identifier];
                    data = element.data;
                    data.dx = mouseX - data.x;
                    data.dy = mouseY - data.y;
                    data.x = mouseX;
                    data.y = mouseY;
                    d.simpleDispatch(60 /* MouseMove */, data, true);
                }
                return;
            }
            else if (len == 2) {
                if (undefined == preTarget) {
                    preTarget = rf.ROOT;
                }
                var _a = touches[0], x0 = _a.clientX, y0 = _a.clientY;
                var _b = touches[1], x1 = _b.clientX, y1 = _b.clientY;
                var x = (x0 + x1) / 2;
                var y = (y0 + y1) / 2;
                var dx = x1 - x0;
                var dy = y1 - y0;
                len = Math.sqrt(dx * dx + dy * dy);
                var dlen = (touchLen - len) / rf.pixelRatio;
                dy = (y - centerY) / rf.pixelRatio;
                if (Math.abs(dlen) > 1.0) {
                    //scale
                    var data_1 = rf.recyclable(rf.MouseEventData);
                    data_1.x = x;
                    data_1.y = y;
                    data_1.wheel = dlen > 0 ? 120 : -120;
                    preTarget.simpleDispatch(59 /* MouseWheel */, data_1, true);
                    // console.log( "scale" , dlen.toFixed(2));
                    data_1.recycle();
                }
                else if (Math.abs(dy) > 1.0) {
                    var data_2 = rf.recyclable(rf.MouseEventData);
                    data_2.x = x;
                    data_2.y = y;
                    data_2.wheel = dy > 0 ? 120 : -120;
                    preTarget.simpleDispatch(59 /* MouseWheel */, data_2, true);
                    // console.log( "scale" , dlen.toFixed(2));
                    data_2.recycle();
                }
                mouse.touchCenterY = y;
                mouse.touchLen = len;
            }
        };
        return Mouse;
    }());
    rf.Mouse = Mouse;
    rf.MouseInstance = new Mouse();
})(rf || (rf = {}));
var rf;
(function (rf) {
    var TrackballControls = /** @class */ (function () {
        function TrackballControls(object) {
            this.mouseSitivity = 0.3;
            this.object = object;
            this.target = rf.newVector3D();
            this.distance = this.object.pos.v3_sub(this.target).v3_length;
            rf.ROOT.on(50 /* MouseDown */, this.mouseDownHandler, this);
            rf.ROOT.on(59 /* MouseWheel */, this.mouseWheelHandler, this);
            rf.ROOT.on(51 /* MouseRightDown */, this.mouseRightDownHandler, this);
            this.updateSun();
        }
        TrackballControls.prototype.updateSun = function () {
            // const{object,target}=this;
            // let sun = scene.sun;
            // sun.x = object._x - target.x;
            // sun.y = object._y - target.y;
            // sun.z = object._z - target.z;
        };
        Object.defineProperty(TrackballControls.prototype, "tdistance", {
            get: function () {
                return this.distance;
            },
            set: function (value) {
                // console.log(value);
                this.distance = value;
                this.object.forwardPos(value, this.target);
            },
            enumerable: true,
            configurable: true
        });
        TrackballControls.prototype.mouseWheelHandler = function (event) {
            // const{distance} = this;
            var distance = this.object.pos.v3_sub(this.target).v3_length;
            this.distance = distance;
            var wheel = event.data.wheel;
            var step = 1;
            if (wheel < 0 && distance < 500) {
                step = distance / 500;
            }
            wheel = wheel * step;
            var tweener = this.tweener;
            if (tweener) {
                rf.tweenStop(tweener);
            }
            this.tweener = rf.tweenTo({ tdistance: distance + wheel * 2 }, Math.abs(wheel) * 2, rf.defaultTimeMixer, this);
            // this.object.z += e.deltaY > 0 ? 1: -1
            // this.distance = this.object.pos.subtract(this.target).length;
        };
        TrackballControls.prototype.mouseDownHandler = function (event) {
            rf.ROOT.on(60 /* MouseMove */, this.mouseMoveHandler, this);
            rf.ROOT.on(53 /* MouseUp */, this.mouseUpHandler, this);
            this.distance = this.object.pos.v3_sub(this.target).v3_length;
        };
        TrackballControls.prototype.mouseUpHandler = function (e) {
            rf.ROOT.off(60 /* MouseMove */, this.mouseMoveHandler);
            rf.ROOT.off(53 /* MouseUp */, this.mouseUpHandler);
        };
        TrackballControls.prototype.mouseMoveHandler = function (e) {
            var _a = this, object = _a.object, target = _a.target, mouseSitivity = _a.mouseSitivity, distance = _a.distance;
            var _b = e.data, dx = _b.dx, dy = _b.dy;
            // let dx:number = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            // let dy:number = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
            // dx *= pixelRatio;
            // dy *= pixelRatio;
            var speed = (distance > 1000) ? mouseSitivity : mouseSitivity * distance / 1000;
            speed = Math.max(speed, 0.1);
            var rx = dy * speed + object.rotationX;
            var ry = -dx * speed + object.rotationY;
            if (target) {
                var transform = rf.TEMP_MATRIX;
                transform.m3_identity();
                transform.m3_translation(0, 0, -distance);
                transform.m3_rotation(rx * rf.DEGREES_TO_RADIANS, rf.X_AXIS);
                transform.m3_rotation(ry * rf.DEGREES_TO_RADIANS, rf.Y_AXIS);
                transform.m3_translation(target.x, target.y, target.z);
                object.setPos(transform[12], transform[13], transform[14]);
            }
            object.rotationX = rx;
            object.rotationY = ry;
            this.updateSun();
        };
        TrackballControls.prototype.mouseRightDownHandler = function (event) {
            rf.ROOT.on(60 /* MouseMove */, this.mouseRightMoveHandler, this);
            rf.ROOT.on(54 /* MouseRightUp */, this.mouseRightUpHandler, this);
        };
        TrackballControls.prototype.mouseRightMoveHandler = function (event) {
            var _a = event.data, dx = _a.dx, dy = _a.dy;
            var _b = this, object = _b.object, target = _b.target;
            dy *= (this.distance / object.originFar);
            target.y += dy;
            object.setPos(object._x, object._y += dy, object._z);
            this.updateSun();
        };
        TrackballControls.prototype.mouseRightUpHandler = function (event) {
            rf.ROOT.off(60 /* MouseMove */, this.mouseRightMoveHandler);
            rf.ROOT.off(54 /* MouseRightUp */, this.mouseRightUpHandler);
        };
        return TrackballControls;
    }());
    rf.TrackballControls = TrackballControls;
})(rf || (rf = {}));
// module rf{
//     export class Button extends SkinBase{
//         text:TextField;
//         public mouseDown:Boolean;
// 		public mouseRoll:Boolean;
//         private _label:string;
//         constructor(skin:Component){
//             super(skin);
//             skin.mouseChildren = false;
//         }
//         bindComponents():void
//         {
//             const{_skin} = this;
//             if(_skin["label"] != undefined)
//             {
//                 this.text = _skin["label"];
//                 this.text.html = true;
//             }
//             this.setEnable(true);
//         }
//         private setEnable(show:Boolean):void
// 		{
//             const{_skin} = this;
// 			// _enableFlag = show;
// 			if(show){
// 				_skin.addEventListener(MouseEventX.MouseDown,this.mouseDownHandler, this);
// 				_skin.addEventListener(MouseEventX.ROLL_OVER,this.rollHandler, this);
// 				_skin.addEventListener(MouseEventX.ROLL_OUT,this.rollHandler, this);
// 				_skin.mouseEnabled = true;
// 			}else{
//                 _skin.removeEventListener(MouseEventX.MouseDown,this.mouseDownHandler);
// 				_skin.removeEventListener(MouseEventX.ROLL_OVER,this.rollHandler);
// 				_skin.removeEventListener(MouseEventX.ROLL_OUT,this.rollHandler);
// 				_skin.mouseEnabled = false;
// 			}
//         }
//         protected mouseDownHandler(event:EventX):void{
//             const{_skin} = this;
//             _skin.addEventListener(MouseEventX.MouseUp, this.mouseUpHandler, this);
//             this.mouseDown = true;
//             this.clipRefresh();
//         }
//         protected mouseUpHandler(event:EventX):void{
//             const{_skin} = this;
//             this.mouseDown = false;
//             _skin.removeEventListener(MouseEventX.MouseUp, this.mouseUpHandler);
//             this.clipRefresh();
//         }
//         protected rollHandler(event:EventX):void{
//             this.clipRefresh();
//         }
//         protected clipRefresh():void{
//             const{_skin, mouseDown} = this;
//             (_skin as Component).gotoAndStop(mouseDown ? 2 : (this._skin.mouseRoll ? 1 : 0));
//         }
//         set label(val:string)
//         {
//             const{text} = this;
//             this._label = val;
//             if(text != undefined)
//             {
//                 text.text = val;
//             }
//         }
//         get label()
//         {
//             return this._label;
//         }
//         addClick(func:Function):void
// 		{
//             const{_skin} = this;
// 			_skin.addEventListener(MouseEventX.CLICK, func, this);
// 		}
//     }
// }
///<reference path="./Sprite.ts" />
var rf;
(function (rf) {
    var Component = /** @class */ (function (_super) {
        __extends(Component, _super);
        function Component(source) {
            var _this = _super.call(this, source) || this;
            _this._enabled = true;
            _this._skin = {};
            return _this;
        }
        Component.prototype.setSymbol = function (symbol, matrix) {
            this.symbol = symbol;
            if (!symbol) {
                var graphics = this.graphics;
                graphics.clear();
                graphics.end();
                return;
            }
            this.x = symbol.x;
            this.y = symbol.y;
            this.gotoAndStop(symbol.displayClip, true);
            this.updateHitArea();
            this.bindComponents();
        };
        Component.prototype.gotoAndStop = function (clip, refresh) {
            if (refresh === void 0) { refresh = false; }
            var _a = this, symbol = _a.symbol, graphics = _a.graphics;
            if (symbol == undefined) {
                // this.gotoAndStop(clip,refresh);
                return;
            }
            if (this.currentClip == clip && !refresh) {
                return;
            }
            graphics.clear();
            this.currentClip = clip;
            var elements = symbol.displayFrames[clip];
            if (undefined == elements) {
                graphics.end();
                return;
            }
            var sp;
            var tempMatrix = rf.newMatrix();
            for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                var ele = elements_1[_i];
                if (ele.type == 0 /* SYMBOL */) {
                    if (null == ele.name) {
                        // ele.name = RFProfile.addInstance(element);
                    }
                    sp = this[ele.name];
                    if (!sp) {
                        if (ele.rect) { //目前还没写9宫
                            //sp = new ScaleRectSprite3D(source);
                        }
                        else {
                            sp = new Component(this.source);
                        }
                        sp.mouseEnabled = true;
                        sp.x = ele.x;
                        sp.y = ele.y;
                        if (ele.matrix2d) {
                            tempMatrix.set(ele.matrix2d);
                        }
                        else {
                            tempMatrix.m2_identity();
                        }
                        // if(sceneMatrix){
                        // 	tempMatrix.concat(sceneMatrix);
                        // }
                        sp.setSymbol(ele, tempMatrix);
                        this._skin[ele.name] = sp;
                        this[ele.name] = sp;
                        sp.name = ele.name;
                        sp.setSize(Math.round(sp.width * ele.scaleX), Math.round(sp.height * ele.scaleY));
                    }
                    this.addChild(sp);
                }
                else if (ele.type == 2 /* TEXT */) {
                    var textElement = ele;
                    if (!this._skin.hasOwnProperty(ele.name)) {
                        sp = rf.recyclable(rf.TextField);
                        var e_format = textElement.format;
                        var format = rf.recyclable(rf.TextFormat).init();
                        format.size = e_format["size"] == undefined ? 12 : e_format["size"];
                        format.align = e_format["alignment"] == undefined ? "left" : e_format["alignment"];
                        sp.init(this.source, format);
                        sp.color = textElement.color;
                        sp.multiline = textElement.multiline;
                        if (textElement.input) {
                            sp.type = "input" /* INPUT */;
                            sp.mouseEnabled = true;
                        }
                        else {
                            sp.type = "dynamic" /* DYNAMIC */;
                        }
                        sp.setSize(textElement.width, textElement.height);
                        sp.text = textElement.text;
                        sp.x = ele.x;
                        sp.y = ele.y;
                        this.addChild(sp);
                        if (ele.name) {
                            this._skin[ele.name] = sp;
                            this[ele.name] = sp;
                            sp.name = ele.name;
                        }
                    }
                    else {
                        sp = this[ele.name];
                        if (sp.text != textElement.text) {
                            textElement.text = sp.text;
                        }
                        this.addChild(sp);
                    }
                }
                else {
                    this.renderFrameElement(ele);
                }
            }
            graphics.end();
        };
        Component.prototype.addToStage = function () {
            _super.prototype.addToStage.call(this);
            this.simpleDispatch(19 /* ADD_TO_STAGE */);
        };
        Component.prototype.removeFromStage = function () {
            _super.prototype.removeFromStage.call(this);
            this.simpleDispatch(20 /* REMOVE_FROM_STAGE */);
        };
        // var scaleGeomrtry:ScaleNGeomrtry;
        Component.prototype.renderFrameElement = function (element, clean) {
            if (clean === void 0) { clean = false; }
            var vo = this.source.getSourceVO(element.libraryItemName);
            if (vo == undefined) {
                return;
            }
            var graphics = this.graphics;
            if (clean) {
                graphics.clear();
            }
            if (element.rect) {
                // scaleGeomrtry = _graphics.scale9(vo,element.rect,scaleGeomrtry);
                // if(_width == 0){
                // 	_width = vo.w;
                // }
                // if(_height == 0){
                // 	_height = vo.h;
                // }
                // scaleGeomrtry.set9Size(_width,_height);
            }
            else {
                graphics.drawBitmap(0, 0, vo); //,element.matrix2d
            }
            if (clean) {
                graphics.end();
            }
        };
        Object.defineProperty(Component.prototype, "selected", {
            get: function () { return this._selected; },
            set: function (value) { this._selected = value; this.doSelected(); },
            enumerable: true,
            configurable: true
        });
        Component.prototype.doSelected = function () { };
        Object.defineProperty(Component.prototype, "enabled", {
            get: function () { return this._enabled; },
            set: function (value) { if (this._enabled == value) {
                return;
            } this._enabled = value; this.doEnabled(); },
            enumerable: true,
            configurable: true
        });
        Component.prototype.doEnabled = function () { };
        Object.defineProperty(Component.prototype, "data", {
            get: function () { return this._data; },
            set: function (value) { this._data = value; this.doData(); },
            enumerable: true,
            configurable: true
        });
        Component.prototype.doData = function () { };
        Component.prototype.bindComponents = function () { };
        return Component;
    }(rf.Sprite));
    rf.Component = Component;
    var Label = /** @class */ (function (_super) {
        __extends(Label, _super);
        function Label() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(Label.prototype, "label", {
            get: function () { var _a = this, _editable = _a._editable, text = _a.text, _label = _a._label; if (_editable) {
                return text.text;
            } return _label; },
            set: function (value) { this._label = value + ""; this.doLabel(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "editable", {
            get: function () { return this._editable; },
            set: function (value) { this._editable = value; this.doEditable(); },
            enumerable: true,
            configurable: true
        });
        Label.prototype.doEditable = function () { };
        ;
        Label.prototype.bindComponents = function () {
        };
        Label.prototype.doLabel = function () {
            var _a = this, text = _a.text, _label = _a._label, _editable = _a._editable;
            if (text) {
                text.text = _label;
                // if(!_editable){
                // 	textField.w = textField.textWidth+5;
                // 	textField.h = textField.textHeight+5;
                // }
                this.textResize();
            }
        };
        Label.prototype.textResize = function () { };
        return Label;
    }(Component));
    rf.Label = Label;
    var Button = /** @class */ (function (_super) {
        __extends(Button, _super);
        function Button() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Button.prototype.bindComponents = function () {
        };
        Button.prototype.addClick = function (listener, thisObj) {
            this.on(56 /* CLICK */, listener, thisObj);
        };
        return Button;
    }(Label));
    rf.Button = Button;
})(rf || (rf = {}));
///<reference path="./Sprite.ts" />
var rf;
(function (rf) {
    var TextEditor = /** @class */ (function (_super) {
        __extends(TextEditor, _super);
        function TextEditor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //将需要编辑的textfiled传递进来
        //根据样式生成对应的页面input
        //input编辑完成后失去焦点及更新原有的textfiled
        //
        //
        //根据文本是否是多行文本 单行使用input多行使用textarea
        //新建文本容器 文本容器使用rect进行裁剪
        //根据文本确定宽高 属性
        //
        TextEditor.prototype.init = function () {
            var self = this;
            var inputele;
            var div = document.createElement("div");
            div.setAttribute("id", "edittxt");
            div.style.opacity = "0";
            self._defaultValue(div);
            self._inputdiv = div;
            document.body.appendChild(div);
            //创建html textarea 将文本属性赋值
            inputele = document.createElement("input");
            self._defaultValue(inputele);
            self._defaultTxt(inputele);
            self._input = inputele;
            div.appendChild(inputele);
            inputele.type = "text";
            inputele = document.createElement("textarea");
            inputele.style["resize"] = "none";
            self._defaultValue(inputele);
            self._defaultTxt(inputele);
            self._area = inputele;
            div.appendChild(inputele);
        };
        TextEditor.prototype.setTextfiled = function (text) {
            var self = this;
            if (self._inputdiv == undefined) {
                this.init();
            }
            if (self._text != undefined) {
                this.blurHandler();
            }
            self._text = text;
            //根据传递进来的textfiled选择对应的输入
            var inpunt = text.multiline ? this._area : this._input;
            self._current = inpunt;
            this.updateinfo(); //更新文本的父对象宽高和坐标 文本信息
        };
        TextEditor.prototype.updateinfo = function () {
            var self = this;
            var _text = self._text;
            var _inputdiv = self._inputdiv;
            var _current = self._current;
            var lineheight = _text.lineheight;
            var tw = _text.width;
            var th = _text.height < lineheight ? lineheight : _text.height;
            _inputdiv.style.opacity = "1";
            _inputdiv.style.width = tw + "px";
            _inputdiv.style.height = th + "px";
            _inputdiv.style.left = _text.x + "px";
            _inputdiv.style.top = _text.y + "px";
            _inputdiv.style.clip = "rect(0px," + tw + "px," + th + "px, 0px)"; //rect(top,right,bottom,left)
            //需要设置字体 颜色 字体大小 默认值 
            //传递进来的textfiled需要不显示
            //需要正确计算出位置 需要赋值间距
            var format = _text.format;
            _current.style.width = tw + "px";
            _current.style.height = th + "px";
            _current.style.top = "0px";
            if (_text.maxChars != undefined) {
                _current.setAttribute("maxlength", _text.maxChars);
            }
            else {
                _current.removeAttribute("maxlength");
            }
            _current.style["text-align"] = format.align;
            _current.style.color = format.getColorStr(_text.color);
            _current.style.font = format.font;
            _current.style["letter-spacing"] = "1px";
            // _current.style.lineheight = "2em";//lineheight + "px";
            _current.value = _text.$text;
            if (_current.onblur == undefined) {
                _current.onblur = this.blurHandler.bind(this);
            }
            _current.selectionStart = _current.value.length;
            _current.selectionEnd = _current.value.length;
            setTimeout(function () {
                _current.focus();
            }, 20);
        };
        TextEditor.prototype._defaultValue = function (ele) {
            ele.style.position = "absolute";
            ele.style.left = "0px";
            ele.style.top = "-300px";
            ele.style.border = "none";
            ele.style.padding = "0";
            ele.style.width = "0px";
            ele.style.height = "0px";
        };
        TextEditor.prototype._defaultTxt = function (ele) {
            ele.setAttribute("tabindex", "-1"); //关闭tab切换
            ele.style.outline = "thin";
            ele.style.background = "none";
            ele.style.color = "#ffffff";
            ele.style.overflow = "hidden";
            ele.style.wordBreak = "break-all";
        };
        TextEditor.prototype.blurHandler = function () {
            var self = this;
            //抛出事件 更新文本
            this.dispatchEvent(new rf.EventX("onblur", self._current.value));
            self._inputdiv.style.opacity = "0";
            self._inputdiv.style.top = "-300px";
            self._inputdiv.style.width = "0px";
            self._inputdiv.style.height = "0px";
            self._current.style.width = "0px";
            self._current.style.height = "0px";
            self._current.onblur = null;
            self._current.maxlength = 0;
            self._current.value = "";
            self._current.style.top = "-300px";
            self._current = null;
            self._text = null;
        };
        return TextEditor;
    }(rf.MiniDispatcher));
    rf.TextEditor = TextEditor;
    var txtedit = new TextEditor();
    rf.emote_images = {};
    ;
    var TextFormat = /** @class */ (function () {
        function TextFormat() {
            this.family = "微软雅黑";
            this.oy = 0.25;
            this.size = 15;
            //"align":"left";
            this.align = "left";
            // "bold " : "normal "
            this.bold = "normal";
            // "italic " : "normal "
            this.italic = "normal";
        }
        TextFormat.prototype.init = function () {
            this.oy = 0.25 * (this.size + 1);
            this.font = this.bold + " " + this.italic + " " + this.size + "px " + this.family;
            return this;
        };
        TextFormat.prototype.test = function (context, text, out) {
            var _a = this, family = _a.family, size = _a.size, bold = _a.bold, italic = _a.italic;
            //设置字体
            context.font = this.font;
            out.x = context.measureText(text).width + 1;
            out.y = size + this.oy;
            if (this.stroke) {
                out.x += this.stroke.size * 2;
                out.y += this.stroke.size * 2;
            }
            if (this.shadow) {
                out.x += this.shadow.blur * 2 + Math.abs(this.shadow.offsetX || 0);
                out.y += this.shadow.blur * 2 + Math.abs(this.shadow.offsetY || 0);
            }
        };
        TextFormat.prototype.draw = function (context, text, s) {
            var x = s.x, y = s.y, w = s.w, h = s.h;
            var _a = this, oy = _a.oy, family = _a.family, size = _a.size, bold = _a.bold, italic = _a.italic, stroke = _a.stroke, shadow = _a.shadow, gradient = _a.gradient, align = _a.align;
            //设置字体
            context.font = this.font;
            //只有一个渐变色则文字颜色为渐变色
            if (gradient && gradient.length == 1) {
                context.fillStyle = this.getColorStr(gradient[0].color);
            }
            //有多个渐变色
            else if (gradient && gradient.length > 1) {
                var style = context.createLinearGradient(x, y - h, x, y + h);
                for (var _i = 0, gradient_1 = gradient; _i < gradient_1.length; _i++) {
                    var g = gradient_1[_i];
                    var v = g.percent || 0;
                    var c = this.getColorStr(g.color);
                    style.addColorStop(v, c);
                }
                context.fillStyle = style;
            }
            //如果只是文字 没渐变色 那文字颜色永远用白色;
            else {
                context.fillStyle = rf.c_white;
            }
            //阴影
            if (shadow) {
                context.shadowColor = this.getColorStr(shadow.color);
                context.shadowBlur = shadow.blur;
                context.shadowOffsetX = shadow.offsetX || 0;
                context.shadowOffsetY = shadow.offsetY || 0;
            }
            //描边
            if (stroke) {
                context.strokeStyle = this.getColorStr(stroke.color || 0);
                context.lineWidth = stroke.size * 2;
                context.strokeText(text, x, y + h, w);
            }
            context.fillText(text, x, y + h - oy, w);
        };
        TextFormat.prototype.getColorStr = function (color) {
            var s = color.toString(16);
            return "#000000".substr(0, 7 - s.length) + s;
        };
        TextFormat.prototype.clone = function (format) {
            if (undefined == format) {
                format = new TextFormat();
            }
            format.family = this.family;
            format.size = this.size;
            format.bold = this.bold;
            format.italic = this.italic;
            format.stroke = this.stroke;
            format.shadow = this.shadow;
            format.gradient = this.gradient;
            format.font = this.font;
            format.oy = this.oy;
            format.align = this.align;
            return format;
        };
        return TextFormat;
    }());
    rf.TextFormat = TextFormat;
    var defalue_format = new TextFormat().init();
    /**
     * 优化计划
     * 1. textformat.oy 这东西不应该存在 他的作用主要是用于修正微软雅黑取jqpy等下标超界值。 需要研究 如何取获得 渲染文字的定义。上标 下标等渲染值。
     * 2. set text: 现在只要set text就会触发计算 绘制 渲染操作 如果后期一帧内频繁修改text可能会卡。所以应该换成1帧最多渲染1次的策略。
     */
    var TextField = /** @class */ (function (_super) {
        __extends(TextField, _super);
        function TextField() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.html = false;
            _this.$text = "";
            _this.gap = 0;
            // wordWrap: boolean = false;
            _this.multiline = false;
            _this._edit = false;
            _this._type = "dynamic" /* DYNAMIC */;
            _this.lines = [];
            _this.textLines = [];
            return _this;
        }
        TextField.prototype.init = function (source, format) {
            if (undefined != source) {
                this.source = source;
            }
            if (undefined == format) {
                format = defalue_format.clone();
            }
            this.format = format;
        };
        Object.defineProperty(TextField.prototype, "text", {
            set: function (value) {
                if (this.$text == value) {
                    return;
                }
                this.$text = value;
                var element = this.element;
                if (undefined == element) {
                    this.element = element = new HtmlElement();
                }
                else {
                    element.clear();
                }
                var format = this.format;
                if (undefined == format) {
                    this.format = format = defalue_format.clone();
                }
                element.format = format;
                element.color = this.color;
                if (this.html) {
                    formatHtml(value, element, this.source);
                }
                else {
                    element.str = value;
                }
                var lines = this.tranfromHtmlElement2CharDefine(element, this.multiline ? this.width : Infinity);
                var len = lines.length;
                var oy = 0;
                var lineh;
                for (var i = 0; i < len; i++) {
                    var line = lines[i];
                    var textLine = this.textLines[i];
                    if (undefined == textLine) {
                        this.textLines[i] = textLine = rf.recyclable(TextLine);
                    }
                    textLine.y = oy;
                    textLine.source = this.source;
                    textLine.renderText(line);
                    textLine.updateHitArea(); //必须更新hitarea w h 会出现不正确现象
                    oy += line.h + 4;
                    this.addChild(textLine);
                    if (lineh == undefined) {
                        lineh = line.h;
                    }
                }
                this.lineheight = lineh;
                while (lines.length > len) {
                    var textLine = lines.pop();
                    textLine.recycle();
                }
                this.layout();
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.cleanAll = function () {
            _super.prototype.cleanAll.call(this);
        };
        TextField.prototype.layout = function () {
            var format = this.format;
            if (format.align == "left" /* LEFT */) {
                return;
            }
            this.updateHitArea();
            var childrens = this.childrens;
            //根据align属性进行重新布局
            var _w = this.width;
            if (_w == 0) {
                return;
            }
            var align_type = 0;
            if (format.align == "center" /* CENTER */) {
                align_type = 1;
            }
            else if (format.align == "right" /* RIGHT */) {
                align_type = 2;
            }
            var len = childrens.length;
            //fisrt 取出完整的width
            //second 根据align获取偏移offsetx
            for (var i = 0; i < len; i++) {
                var display = childrens[i];
                if (align_type == 1) {
                    display.x = _w - display.width >> 1;
                }
                else if (align_type == 2) {
                    display.x = _w - display.width;
                }
            }
            //             if(u){
            // //				-偏移量
            //                 var _offy:int = txtSet ? currentHtml.text2dDefine.offsety : 0;
            //                 graphics.clear();
            //                 _graphics.lineStyle(1,_textColor);
            //                 _graphics.moveTo(lx,height+reduceLineHeight - _offy);
            //                 _graphics.lineTo(lx + textWidth + reduceLineWidth,height+reduceLineHeight - _offy);
            //                 _graphics.endFill();
            //             }
            //             else
            //             {
            //                 graphics.clear();
            //             }
        };
        TextField.prototype.getCharSourceVO = function (char, format) {
            var source = this.source;
            var name = format.font + "_" + char;
            var vo = source.getSourceVO(name, 1);
            if (undefined == vo) {
                var p = rf.EMPTY_POINT2D;
                var bmd = source.bmd;
                var context = bmd.context;
                format.test(context, char, p);
                vo = source.setSourceVO(name, p.x, p.y, 1);
                if (undefined != vo) {
                    format.draw(context, char, vo);
                    var c = rf.context3D;
                    var textureData = source.textureData;
                    if (!textureData) {
                        source.textureData = textureData = c.getTextureData(source.name);
                    }
                    var texture = rf.context3D.textureObj[textureData.key];
                    if (undefined != texture) {
                        texture.readly = false;
                    }
                }
            }
            return vo;
        };
        TextField.prototype.tranfromHtmlElement2CharDefine = function (html, width) {
            if (width === void 0) { width = Infinity; }
            var char;
            var str;
            var i = 0;
            var oi = 0;
            var len;
            var ox = 0;
            var lineCount = 0;
            var lines = this.lines;
            var line = lines[lineCount];
            if (!line) {
                lines[lineCount] = line = rf.recyclable(Line);
            }
            var chars = line.chars;
            lineCount++;
            //			chars = [];
            //			lines = [chars]
            while (html) {
                if (!html.image && !html.str) {
                    html = html.next;
                    continue;
                }
                if (html.image) {
                    if (html.newline) {
                        //自动换行开始
                        while (chars.length > oi) {
                            char = chars.pop();
                            char.recycle();
                        }
                        line = lines[lineCount];
                        if (!line) {
                            lines[lineCount] = line = rf.recyclable(Line);
                        }
                        chars = line.chars;
                        ox = 0;
                        oi = 0;
                        lineCount++;
                        //自动换行结束
                    }
                    if (ox && ox + html.image.width > width) {
                        //自动换行开始
                        while (chars.length > oi) {
                            char = chars.pop();
                            char.recycle();
                        }
                        line = lines[lineCount];
                        if (!line) {
                            lines[lineCount] = line = rf.recyclable(Line);
                        }
                        chars = line.chars;
                        ox = 0;
                        oi = 0;
                        lineCount++;
                        //自动换行结束
                    }
                    char = chars[oi];
                    if (!char) {
                        chars[oi] = char = rf.recyclable(Char);
                    }
                    char.index = oi;
                    char.w = html.w;
                    char.h = html.h;
                    char.sx = ox;
                    char.ex = ox + char.w;
                    char.ox = ox + char.h * .5;
                    char.name = null;
                    char.display = html.image;
                    char.element = html;
                    line.w = ox + char.w;
                    if (line.h < char.h) {
                        line.h = char.h;
                    }
                    ox += (char.w + this.gap - 2);
                    oi++;
                }
                else {
                    if (html.newline) {
                        while (chars.length > oi) {
                            char = chars.pop();
                            char.recycle();
                        }
                        line = lines[lineCount];
                        if (!line) {
                            lines[lineCount] = line = rf.recyclable(Line);
                        }
                        chars = line.chars;
                        ox = 0;
                        oi = 0;
                        lineCount++;
                    }
                    str = html.str;
                    len = str.length;
                    for (i = 0; i < len; i++) {
                        var c = str.charAt(i);
                        var vo = this.getCharSourceVO(c, html.format);
                        if (!vo) {
                            continue;
                        }
                        //自动换行开始
                        if (ox + vo.w > width) {
                            while (chars.length > oi) {
                                char = chars.pop();
                                char.recycle();
                            }
                            line = lines[lineCount];
                            if (!line) {
                                lines[lineCount] = line = rf.recyclable(Line);
                            }
                            chars = line.chars;
                            ox = 0;
                            oi = 0;
                            lineCount++;
                        }
                        //自动换行结束
                        char = chars[oi];
                        if (!char) {
                            chars[oi] = char = rf.recyclable(Char);
                        }
                        char.index = oi;
                        char.w = vo.w;
                        char.h = vo.h;
                        char.sx = ox;
                        char.ex = ox + vo.w;
                        char.ox = ox + vo.w * .5;
                        char.name = c;
                        char.element = html;
                        char.display = vo;
                        line.w = ox + vo.w;
                        if (line.h < vo.h) {
                            line.h = vo.h;
                        }
                        ox += (vo.w + this.gap);
                        oi++;
                    }
                }
                html = html.next;
            }
            while (chars.length > oi) {
                char = chars.pop();
                char.recycle();
            }
            while (lines.length > lineCount) {
                line = lines.pop();
                for (var _i = 0, _a = line.chars; _i < _a.length; _i++) {
                    char = _a[_i];
                    char.recycle();
                }
                line.chars.length = 0;
            }
            return lines;
        };
        TextField.prototype.updateHitArea = function () {
            _super.prototype.updateHitArea.call(this);
            //可编辑的需要固定hitarea
            var _type = this._type;
            if (_type == "input" /* INPUT */) {
                var _a = this, _width = _a._width, _height = _a._height;
                var hitarea = this.hitArea;
                hitarea.updateArea(_width, _height, 0);
            }
        };
        Object.defineProperty(TextField.prototype, "type", {
            get: function () {
                return this._type;
            },
            set: function (val) {
                this._type = val;
                if (val == "input" /* INPUT */) {
                    this.addEventListener(50 /* MouseDown */, this.mouseDownHandler, this);
                }
                else {
                    this.removeEventListener(50 /* MouseDown */, this.mouseDownHandler);
                }
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.mouseDownHandler = function (event) {
            var editing = this._edit;
            if (editing) {
                return;
            }
            this._edit = editing = true;
            //启动文本编辑器
            txtedit.setTextfiled(this);
            txtedit.addEventListener("onblur", this.onblurHandler, this);
            this.visible = false;
        };
        TextField.prototype.onblurHandler = function (event) {
            this._edit = false;
            txtedit.removeEventListener("onblur", this.onblurHandler);
            var val = event.data;
            this.visible = true;
            this.text = val;
        };
        return TextField;
    }(rf.Sprite));
    rf.TextField = TextField;
    var ImageVO = /** @class */ (function () {
        function ImageVO() {
            this.x = 0;
            this.y = 0;
            this.w = 0;
            this.h = 0;
        }
        ImageVO.prototype.clone = function (vo) {
            if (undefined == vo) {
                vo = new ImageVO();
            }
            vo.name = this.name;
            vo.tag = this.tag;
            vo.w = this.w;
            vo.h = this.h;
            return vo;
        };
        ImageVO.prototype.dispose = function () {
            this.display = undefined;
        };
        return ImageVO;
    }());
    rf.ImageVO = ImageVO;
    var HtmlElement = /** @class */ (function () {
        function HtmlElement() {
            /**
             * 是否需要换行
             */
            this.newline = false;
            this.str = undefined;
            this.start = 0;
            //		id:String;
            this.color = 0;
        }
        // set color(value:number){
        //     this._color = value;
        //     this.r = ((value >> 16) & 0xFF) / 0xFF;
        //     this.g = ((value >> 8) & 0xFF) / 0xFF;
        //     this.b = (value & 0xFF) / 0xFF;
        // }
        HtmlElement.prototype.createAndCopyFormat = function (last, newline) {
            if (last === void 0) { last = null; }
            if (newline === void 0) { newline = false; }
            var ele = new HtmlElement();
            ele.format = this.format;
            ele.underline = this.underline;
            ele.color = this.color;
            ele.newline = newline;
            if (last) {
                last.next = ele;
                ele.pre = last;
            }
            return ele;
        };
        HtmlElement.prototype.clear = function () {
            var next;
            while (next) {
                if (next.image) {
                    var images_1 = rf.emote_images;
                    if (next.imageTag > -1) {
                        images_1[next.imageTag] = null;
                        next.imageTag = -1;
                    }
                    next.image.remove();
                    next.image = null;
                }
                next = next.next;
            }
            this.next = null;
            this.pre = null;
            this.str = undefined;
            this.color = 0;
            this.image = undefined;
            this.imageTag = undefined;
        };
        return HtmlElement;
    }());
    rf.HtmlElement = HtmlElement;
    // let regHTML: RegExp = /\<(?<HtmlTag>(font|u|a|image))([^\>]*?)\>(.*?)\<\/\k<HtmlTag>\>/m;
    // let regPro: RegExp = /(color|size|face|href|target|width|height)=(?<m>['|"])(.*?)\k<m>/;
    var regPro = /(color|size|face|href|target|width|height)=(['|"])(.*?)(['|"])/; //兼容手机机机机机机
    var regTag = /<(font|u|a|image|b)([^\>]*?)\>/;
    var _imgtag = /({tag (.*?) (.*?)})/g;
    var _emotiontag = /\#[0-9]/g;
    var newLineChar = "∏々";
    function getTagStr(value) {
        var o = regTag.exec(value);
        if (undefined == o) {
            return undefined;
        }
        var tag = o[1];
        var flag = 1;
        var findTag = "<" + tag;
        var findTagLen = findTag.length;
        var endTag = "</" + tag;
        var endTagLen = endTag.length;
        var sindex;
        var findindex;
        var endindex;
        var test;
        sindex = o[0].length + o.index;
        while (flag) {
            findindex = value.indexOf(findTag, sindex);
            endindex = value.indexOf(endTag, sindex);
            if (findindex != -1 && findindex < endindex) {
                flag++;
                sindex = findindex + findTagLen;
            }
            else {
                if (endindex == -1) {
                    console.log("htmltext format error at tag " + tag + "\nvalue:" + value);
                    return undefined;
                }
                flag--;
                sindex = endindex + endTagLen;
            }
            test = value.slice(sindex);
        }
        endindex = value.indexOf(">", sindex);
        if (endindex == -1) {
            console.log("htmltext format error at tag " + tag + "\nvalue:" + value);
            return undefined;
        }
        var result = value.slice(o.index, endindex + 1);
        o[3] = value.slice(o.index + o[0].length, sindex - endTagLen);
        o[0] = result;
        return o;
    }
    function doFormatHtml(value, source, parent, last) {
        if (parent === void 0) { parent = null; }
        if (last === void 0) { last = null; }
        var html;
        var o;
        var str;
        var len;
        var i;
        if (parent) {
            if (parent.str || parent.image) {
                last = html = parent.createAndCopyFormat(last);
            }
            else {
                html = parent;
            }
        }
        var nextnew;
        o = getTagStr(value); //取出html标签
        if (o) {
            var index = o.index;
            if (index != 0) {
                str = value.slice(0, index);
                while ((i = str.indexOf(newLineChar)) != -1) {
                    if (html.str || parent.image) {
                        last = html = parent.createAndCopyFormat(last, nextnew);
                    }
                    html.str = str.slice(0, i);
                    nextnew = true;
                    str = str.slice(i + newLineChar.length);
                }
                if (html.str || parent.image) {
                    last = html = parent.createAndCopyFormat(last, nextnew);
                    if (str) {
                        nextnew = false;
                    }
                }
                if (nextnew) {
                    last = html = parent.createAndCopyFormat(last, nextnew);
                    html.str = str;
                }
                else {
                    html.str = str; //如果是换行符nextnew属性不改变继续
                }
                if (str) {
                    nextnew = false;
                }
            }
            value = value.slice(o.index + o[0].length);
            if (o[1] == "image") {
                var image = rf.emote_images[o[3]];
                if (image) {
                    if (parent.str || parent.image) {
                        last = html = parent.createAndCopyFormat(last, html.newline);
                    }
                    html.imageTag = o[3];
                    html.image = image;
                    html.w = image.width;
                    html.h = image.height;
                    htmlProParser(o[1], o[2], html, html.image);
                }
            }
            else if (o[1] == "a") {
                if (parent.str || parent.image) {
                    last = html = parent.createAndCopyFormat(last, html.newline);
                }
                var text = rf.recyclable(TextALink);
                text.init(source, html.format);
                text.color = html.color;
                html.image = text;
                html.imageTag = -1;
                htmlProParser(o[1], o[2], html, text);
                text.text = o[3];
                html.w = text.width;
                html.h = text.height;
            }
            else if (o[1] == "b") {
                last = html = parent.createAndCopyFormat(last, html.newline);
                var format = parent.format;
                if (format.bold != "bold") {
                    format = format.clone();
                    format.bold = "bold";
                    format.init();
                }
                html.format = format;
                htmlProParser(o[1], o[2], html);
                last = doFormatHtml(o[3], source, html, last);
            }
            else {
                last = html = parent.createAndCopyFormat(last, nextnew);
                //复制属性
                htmlProParser(o[1], o[2], html);
                last = doFormatHtml(o[3], source, html, last);
            }
            if (value.length) {
                last = html = parent.createAndCopyFormat(last);
                last = doFormatHtml(value, source, html, last);
            }
        }
        else {
            str = value;
            nextnew = false;
            while ((i = str.indexOf(newLineChar)) != -1) {
                if (html.str || parent.image) {
                    last = html = parent.createAndCopyFormat(last, nextnew);
                }
                html.str = str.slice(0, i);
                nextnew = true;
                str = str.slice(i + newLineChar.length);
            }
            if (html.str || parent.image) {
                last = html = parent.createAndCopyFormat(last, html.newline);
            }
            html.str = str;
            if (nextnew) {
                html.newline = nextnew;
                nextnew = false;
            }
        }
        return last;
    }
    var emotion = {};
    var imageCreateFunctions = {};
    var imageTag = 0;
    var images = {};
    function checkImage() {
        for (var i = 0; i < imageTag; i++) {
            if (images[i] == null) {
                return i;
            }
        }
        return imageTag++;
    }
    function createImage(tag, value, source) {
        var func = imageCreateFunctions[tag];
        if (null == func) {
            return "";
        }
        var imagevo = func(value, source);
        var index = checkImage();
        images[index] = imagevo.display;
        imagevo.dispose();
        var str = "<image>{0}</image>".substitute(index);
        return str;
    }
    function imageStrFormat(value, source) {
        var _strs;
        var len;
        var index = 0;
        var arr;
        _strs = "";
        value = value.replace(/\'#/g, "'$");
        value = value.replace(/\"#/g, "\"$");
        len = value.length;
        index = _imgtag.lastIndex = 0;
        var temp1;
        var temp;
        while (index < len) {
            arr = _imgtag.exec(value);
            if (arr) {
                temp1 = arr[0]; //整个
                //普通字符串
                temp = value.substring(index, _imgtag.lastIndex - temp1.length);
                if (temp) {
                    _strs += temp;
                }
                index = _imgtag.lastIndex;
                //					tag = (imageTextField as GImageTextField).setImgImagevo(arr[2],arr[3]);
                _strs += createImage(arr[2], arr[3], source);
            }
            else {
                temp = value.substring(index);
                if (temp) {
                    _strs += temp;
                }
                break;
            }
        }
        value = _strs;
        var imageCheck = 0;
        var i;
        var imageVO;
        var tag;
        if (emotion) {
            do {
                i = value.indexOf("#", index);
                if (i == -1) {
                    break;
                }
                index = i + 1;
                imageCheck = 5;
                while (imageCheck > 2) {
                    tag = value.slice(i, i + imageCheck);
                    imageVO = emotion[tag];
                    if (!imageVO) {
                        imageCheck--;
                        continue;
                    }
                    //					
                    var s = _emotiontag.exec(tag);
                    if (s && s.length) {
                        break;
                    }
                    var image = createImage("em", tag, source);
                    value = value.replace(tag, image);
                    break;
                }
            } while (i != -1);
        }
        value = value.replace(/\'\$/g, "'#");
        value = value.replace(/\"\$/g, "\"#");
        value = value.replace(/\'\$/g, "'#");
        return value;
    }
    function formatHtml(value, html, source) {
        value = value.replace(/<br\/>/g, newLineChar);
        value = value.replace(/\n/g, newLineChar);
        value = value.replace(/\&lt;/g, "<");
        value = value.replace(/\&gt;/g, ">");
        value = value.replace(/\&apos;/g, "'");
        value = value.replace(/\&quot;/g, '"');
        value = value.replace(/\&amp;/g, "&");
        value = imageStrFormat(value, source);
        doFormatHtml(value, source, html, html);
        var next;
        while (html) {
            if (html.pre && !html.str && !html.newline && !html.image) {
                html.pre.next = html.next;
                if (html.next) {
                    html.next.pre = html.pre;
                }
                html = html.next;
            }
            else {
                html = html.next;
            }
        }
    }
    rf.formatHtml = formatHtml;
    function htmlProParser(pro, value, html, sp) {
        regPro.lastIndex = 0;
        value = value.replace(/\s/g, "");
        var o = regPro.exec(value);
        var cloneFormat;
        while (o) {
            var p = o[1];
            var v = o[3];
            p = p.trim();
            if (p == "color") {
                html.color = Number(v.replace("#", "0x"));
            }
            else if (p == "href") {
                if (v.indexOf("event:") == 0) {
                    v = v.replace("event:", "");
                }
            }
            else if (p == "size") {
                var size = Number(v);
                var format = html.format;
                if (format.size != size) {
                    format = format.clone();
                    format.size = size;
                    format.init();
                    html.format = format;
                }
            }
            if (undefined != sp) {
                if (sp.hasOwnProperty(p)) {
                    sp[p] = v;
                }
            }
            else {
                if (p != "color" && html.hasOwnProperty(p)) {
                    html[p] = v;
                }
            }
            value = value.replace(o[0], "");
            o = regPro.exec(value);
        }
    }
    var Char = /** @class */ (function () {
        function Char() {
            this.ox = 0;
            this.sx = 0;
            this.ex = 0;
        }
        Char.prototype.onRecycle = function () {
            this.element = undefined;
            this.display = undefined;
        };
        return Char;
    }());
    rf.Char = Char;
    var Line = /** @class */ (function () {
        function Line() {
            this.w = 0;
            this.h = 0;
            this.chars = [];
        }
        return Line;
    }());
    rf.Line = Line;
    var TextLine = /** @class */ (function (_super) {
        __extends(TextLine, _super);
        function TextLine() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TextLine.prototype.renderText = function (line) {
            this.removeAllChild();
            this.line = line;
            var h = line.h;
            var chars = line.chars;
            var len = chars.length;
            var g = this.graphics;
            g.clear();
            for (var i = 0; i < len; i++) {
                var char = chars[i];
                var ele = char.element;
                var display = char.display;
                if (display instanceof rf.Sprite) {
                    display.x = char.sx;
                    display.y = (h - display.height) >> 1;
                    this.addChild(display);
                }
                else {
                    g.drawBitmap(char.sx, h - display.h, display, ele.color);
                }
            }
            g.end();
        };
        return TextLine;
    }(rf.Sprite));
    rf.TextLine = TextLine;
    var TextALink = /** @class */ (function (_super) {
        __extends(TextALink, _super);
        function TextALink() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TextALink;
    }(TextField));
    rf.TextALink = TextALink;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var PerspectiveMatrix3D = /** @class */ (function (_super) {
        __extends(PerspectiveMatrix3D, _super);
        function PerspectiveMatrix3D() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PerspectiveMatrix3D.prototype.lookAtLH = function (eye, at, up) {
            //http://msdn.microsoft.com/en-us/library/windows/desktop/bb281710(v=vs.85).aspx
            //zaxis = normal(at - eye)
            var sqrt = Math.sqrt;
            var eyex = eye.x, eyey = eye.y, eyez = eye.z;
            var upx = up.x, upy = up.y, upz = up.z;
            var zX = at.x - eyex;
            var zY = at.y - eyey;
            var zZ = at.z - eyez;
            var len = 1 / sqrt(zX * zX + zY * zY + zZ * zZ);
            zX *= len;
            zY *= len;
            zZ *= len;
            //xaxis = normal(cross(up,zaxis))
            var xX = upy * zZ - upz * zY;
            var xY = upz * zX - upx * zZ;
            var xZ = upx * zY - upy * zX;
            len = 1 / sqrt(xX * xX + xY * xY + xZ * xZ);
            xX *= len;
            xY *= len;
            xZ *= len;
            //yaxis = cross(zaxis,xaxis)
            var yX = zY * xZ - zZ * xY;
            var yY = zZ * xX - zX * xZ;
            var yZ = zX * xY - zY * xX;
            this.set([
                xX, xY, xZ, -(xX * eyex + xY * eyey + xZ * eyez),
                yX, yY, yZ, -(yX * eyex + yY * eyey + yZ * eyez),
                zX, zY, zZ, -(zX * eyex + zY * eyey + zZ * eyez),
                0.0, 0.0, 0.0, 1.0
            ]);
        };
        PerspectiveMatrix3D.prototype.lookAtRH = function (eye, at, up) {
            //http://msdn.microsoft.com/en-us/library/windows/desktop/bb281711(v=vs.85).aspx
            //http://blog.csdn.net/popy007/article/details/5120158
            var sqrt = Math.sqrt;
            var eyex = eye.x, eyey = eye.y, eyez = eye.z;
            var upx = up.x, upy = up.y, upz = up.z;
            //zaxis = normal(eye - at)
            var zX = eyex - at.x;
            var zY = eyey - at.y;
            var zZ = eyez - at.z;
            var len = 1 / sqrt(zX * zX + zY * zY + zZ * zZ);
            zX *= len;
            zY *= len;
            zZ *= len;
            // xaxis = normal(cross(up,zaxis))
            var xX = upy * zZ - upz * zY;
            var xY = upz * zX - upx * zZ;
            var xZ = upx * zY - upy * zX;
            len = 1 / sqrt(xX * xX + xY * xY + xZ * xZ);
            xX *= len;
            xY *= len;
            xZ *= len;
            //yaxis = cross(zaxis,xaxis)
            var yX = zY * xZ - zZ * xY;
            var yY = zZ * xX - zX * xZ;
            var yZ = zX * xY - zY * xX;
            this.set([
                xX, xY, xZ, -(xX * eyex + xY * eyey + xZ * eyez),
                yX, yY, yZ, -(yX * eyex + yY * eyey + yZ * eyez),
                zX, zY, zZ, -(zX * eyex + zY * eyey + zZ * eyez),
                0.0, 0.0, 0.0, 1.0
            ]);
        };
        PerspectiveMatrix3D.prototype.perspectiveOffCenterLH = function (left, right, bottom, top, zNear, zFar) {
            this.set([
                2.0 * zNear / (right - left), 0.0, (left + right) / (left - right), 0.0,
                0.0, 2.0 * zNear / (top - bottom), (bottom + top) / (bottom - top), 0.0,
                0.0, 0.0, (zFar + zNear) / (zFar - zNear), 2.0 * zFar * zNear / (zNear - zFar),
                0.0, 0.0, 1.0, 0.0
            ]);
        };
        PerspectiveMatrix3D.prototype.perspectiveLH = function (width, height, zNear, zFar) {
            this.set([
                2.0 * zNear / width, 0.0, 0.0, 0.0,
                0.0, 2.0 * zNear / height, 0.0, 0.0,
                0.0, 0.0, (zFar + zNear) / (zFar - zNear), 2.0 * zFar * zNear / (zNear - zFar),
                0.0, 0.0, 1.0, 0.0
            ]);
        };
        PerspectiveMatrix3D.prototype.perspectiveFieldOfViewLH = function (fieldOfViewY, aspectRatio, zNear, zFar) {
            var yScale = 1.0 / Math.tan(fieldOfViewY / 2.0);
            var xScale = yScale / aspectRatio;
            this.set([
                xScale, 0.0, 0.0, 0.0,
                0.0, yScale, 0.0, 0.0,
                0.0, 0.0, (zFar + zNear) / (zFar - zNear), 1.0,
                0.0, 0.0, 2.0 * zFar * zNear / (zNear - zFar), 0.0
            ]);
        };
        PerspectiveMatrix3D.prototype.orthoOffCenterLH = function (left, right, bottom, top, zNear, zFar) {
            this.set([
                2.0 / (right - left), 0.0, 0.0, (left + right) / (left - right),
                0.0, 2.0 / (top - bottom), 0.0, (bottom + top) / (bottom - top),
                0.0, 0.0, 2 / (zFar - zNear), (zNear + zFar) / (zNear - zFar),
                0.0, 0.0, 0.0, 1.0
            ]);
        };
        PerspectiveMatrix3D.prototype.orthoLH = function (width, height, zNear, zFar) {
            this.set([
                2.0 / width, 0.0, 0.0, 0.0,
                0.0, 2.0 / height, 0.0, 0.0,
                0.0, 0.0, 2 / (zFar - zNear), (zNear + zFar) / (zNear - zFar),
                0.0, 0.0, 0.0, 1.0
            ]);
        };
        //pass test
        PerspectiveMatrix3D.prototype.perspectiveOffCenterRH = function (left, right, bottom, top, zNear, zFar) {
            this.set([
                2.0 * zNear / (right - left), 0.0, (right + left) / (right - left), 0.0,
                0.0, 2.0 * zNear / (top - bottom), (top + bottom) / (top - bottom), 0.0,
                0.0, 0.0, (zNear + zFar) / (zNear - zFar), 2.0 * zNear * zFar / (zNear - zFar),
                0.0, 0.0, -1.0, 0.0
            ]);
        };
        //pass test
        PerspectiveMatrix3D.prototype.perspectiveRH = function (width, height, zNear, zFar) {
            this.set([
                2.0 * zNear / width, 0.0, 0.0, 0.0,
                0.0, 2.0 * zNear / height, 0.0, 0.0,
                0.0, 0.0, (zNear + zFar) / (zNear - zFar), 2.0 * zNear * zFar / (zNear - zFar),
                0.0, 0.0, -1.0, 0.0
            ]);
        };
        //pass test
        PerspectiveMatrix3D.prototype.perspectiveFieldOfViewRH = function (fieldOfViewY, aspectRatio, zNear, zFar) {
            var yScale = 1.0 / Math.tan(fieldOfViewY / 2.0);
            var xScale = yScale / aspectRatio;
            this.set([
                xScale, 0.0, 0.0, 0.0,
                0.0, yScale, 0.0, 0.0,
                0.0, 0.0, (zFar + zNear) / (zNear - zFar), 2.0 * zNear * zFar / (zNear - zFar),
                0.0, 0.0, -1.0, 0.0
            ]);
        };
        PerspectiveMatrix3D.prototype.orthoOffCenterRH = function (left, right, bottom, top, zNear, zFar) {
            this.set([
                2.0 / (right - left), 0.0, 0.0, (left + right) / (left - right),
                0.0, 2.0 / (top - bottom), 0.0, (bottom + top) / (bottom - top),
                0.0, 0.0, -2.0 / (zFar - zNear), (zNear + zFar) / (zNear - zFar),
                0.0, 0.0, 0.0, 1.0
            ]);
        };
        PerspectiveMatrix3D.prototype.orthoRH = function (width, height, zNear, zFar) {
            this.set([
                2.0 / width, 0.0, 0.0, 0.0,
                0.0, 2.0 / height, 0.0, 0.0,
                0.0, 0.0, -2.0 / (zFar - zNear), (zNear + zFar) / (zNear - zFar),
                0.0, 0.0, 0.0, 1.0
            ]);
        };
        return PerspectiveMatrix3D;
    }(Float32Array));
    rf.PerspectiveMatrix3D = PerspectiveMatrix3D;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var Particle = /** @class */ (function (_super) {
        __extends(Particle, _super);
        function Particle() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Particle.prototype.load = function (url) {
            if (url.lastIndexOf(".pa" /* PARTICLE */) == -1) {
                url += ".pa" /* PARTICLE */;
            }
            if (url.indexOf("://") == -1) {
                url = rf.particle_Perfix + url;
            }
            rf.loadRes(url, this.loadCompelte, this, 0 /* bin */);
        };
        Particle.prototype.loadCompelte = function (e) {
            var item = e.data;
            var byte = item.data;
            var o = rf.amf_readObject(byte);
            this.play(o);
        };
        Particle.prototype.play = function (data) {
            this.data = data;
            var settingData = data.setting, meshData = data.mesh, materialData = data.material, runtimeData = data.runtime;
            var _a = this, geometry = _a.geometry, material = _a.material;
            if (!geometry) {
                this.geometry = geometry = new ParticleGeometry();
            }
            geometry.setData(meshData);
            geometry.setRuntime(runtimeData);
            if (!material) {
                this.material = material = new ParticleMaterial();
            }
            material.setData(materialData);
        };
        return Particle;
    }(rf.Mesh));
    rf.Particle = Particle;
    var ParticleGeometry = /** @class */ (function (_super) {
        __extends(ParticleGeometry, _super);
        function ParticleGeometry() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ParticleGeometry.prototype.setRuntime = function (runtime) {
            this.initData(runtime);
            this.runtimeData = runtime;
        };
        ParticleGeometry.prototype.uploadContext = function (camera, mesh, program, now, interval) {
            // super.uploadContext(camera, mesh, program, now, interval);
            var c = rf.context3D;
            var sceneTransform = mesh.sceneTransform;
            var vertexBuffer = this.runtimeData.vertexBuffer;
            var _a = mesh.data, setting = _a.setting, nodes = _a.nodes;
            //设置模型顶点数据 (pos uv)
            this.vertex.uploadContext(program);
            //设置模型particle点数据(pos rot sca time velocity accelerition billboard ...)
            vertexBuffer.uploadContext(program);
            var worldTranform = rf.TEMP_MATRIX;
            var rot = rf.TEMP_VECTOR3D;
            //设置矩阵信息
            worldTranform.m3_append(camera.worldTranform, false, sceneTransform);
            c.setProgramConstantsFromMatrix("mvp" /* mvp */, worldTranform);
            //BILLBOARD
            if (nodes["p_billboard" /* BILLBOARD */]) {
                worldTranform.m3_append(camera.sceneTransform, false, sceneTransform);
                if (nodes["p_rotation2head" /* ROTATION_HEAD */]) {
                    c.setProgramConstantsFromMatrix("mv" /* mv */, worldTranform);
                }
                worldTranform.m3_decompose(undefined, rot, undefined, 1 /* AXIS_ANGLE */);
                worldTranform.m3_rotation(-rot.w, rot, false, rf_m3_identity);
                c.setProgramConstantsFromMatrix("invm" /* invm */, worldTranform);
            }
            var node = nodes["p_segment_color" /* SEGMENT_COLOR */];
            if (node) {
                var segmentData = node.data;
                if (segmentData instanceof ArrayBuffer) {
                    node.data = segmentData = new Float32Array(segmentData);
                }
                c.setProgramConstantsFromVector("p_segment_color" /* SEGMENT_COLOR */, segmentData, 4);
            }
            node = nodes["p_sprite_sheet_anim" /* SPRITE_SHEET */];
            if (node) {
                var data = node.data;
                if (data instanceof ArrayBuffer) {
                    node.data = data = new Float32Array(data);
                }
                c.setProgramConstantsFromVector("p_sprite_sheet_anim" /* SPRITE_SHEET */, data, 4);
            }
            //TIME
            c.setProgramConstantsFromVector("now" /* NOW */, rf.engineNow / 1000 * setting.speed, 1, false);
        };
        return ParticleGeometry;
    }(rf.GeometryBase));
    rf.ParticleGeometry = ParticleGeometry;
    var ParticleMaterial = /** @class */ (function (_super) {
        __extends(ParticleMaterial, _super);
        function ParticleMaterial() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ParticleMaterial.prototype.getTextUrl = function (data) {
            return rf.particle_Texture_Perfix + data.url;
        };
        ParticleMaterial.prototype.uploadContext = function (camera, mesh, now, interval) {
            var c = rf.context3D;
            var _a = this, program = _a.program, diffTex = _a.diffTex;
            if (!diffTex) {
                return false;
            }
            var b = this.checkTexs(diffTex);
            if (false == b) {
                return false;
            }
            if (!program) {
                this.program = program = this.createProgram(mesh);
            }
            var _b = this, cull = _b.cull, srcFactor = _b.srcFactor, dstFactor = _b.dstFactor, depthMask = _b.depthMask, passCompareMode = _b.passCompareMode;
            c.setProgram(program);
            c.setCulling(cull);
            c.setBlendFactors(srcFactor, dstFactor);
            var t;
            if (undefined != diffTex) {
                t = c.textureObj[diffTex.key];
                t.uploadContext(program, 0, "diff" /* diff */);
            }
            return true;
        };
        ParticleMaterial.prototype.createProgram = function (mesh) {
            var nodes = mesh.data.nodes;
            var node = nodes["p_time" /* TIME */];
            var vertexDefine = "";
            var vertexFunctions = this.timeNode(node);
            var fragmentDefine = "";
            var fragmentFunctions = "";
            //速度
            node = nodes["p_velocity" /* VELOCITY */];
            if (node) {
                vertexDefine += "#define VELOCITY\n";
            }
            //加速度
            node = nodes["p_accelerition" /* ACCELERITION */];
            if (node) {
                vertexDefine += "#define ACCELERITION\n";
            }
            //初始化旋转
            node = nodes["p_init_rotation" /* ROTATION */];
            if (node) {
                vertexDefine += "#define ROTATION\n";
            }
            //旋转速度
            node = nodes["p_vrotation" /* VROTATION */];
            if (node) {
                vertexDefine += "#define VROTATION\n";
            }
            //旋转到方向
            node = nodes["p_rotation2head" /* ROTATION_HEAD */];
            if (node) {
                vertexDefine += "#define ROTATION_HEAD\n";
            }
            //缩放
            node = nodes["p_scale" /* SCALE */];
            if (node) {
                vertexFunctions += this.scaleNode(node);
                vertexDefine += "#define SCALE\n";
            }
            //公告板(始终面朝摄像机)
            node = nodes["p_billboard" /* BILLBOARD */];
            if (node) {
                vertexDefine += "#define BILLBOARD\n";
            }
            node = nodes["p_position" /* POSITION */];
            if (node) {
                vertexDefine += "#define POSITION\n";
            }
            node = nodes["p_segment_color" /* SEGMENT_COLOR */];
            if (node) {
                vertexFunctions += this.segmentColorNode(node);
                vertexDefine += "#define SegmentColor\n";
                fragmentDefine += "#define SegmentColor\n";
            }
            node = nodes["p_sprite_sheet_anim" /* SPRITE_SHEET */];
            if (node) {
                fragmentFunctions += this.spriteSheetNode(node);
                fragmentDefine += "#define SPRITE_SHEET\n";
            }
            var vertexCode = "\n                " + vertexDefine + "\n\n                precision mediump float;\n\n                attribute vec3 " + "pos" /* pos */ + ";\n                attribute vec2 " + "uv" /* uv */ + ";\n                attribute vec4 " + "p_time" /* TIME */ + ";\n                attribute vec3 " + "p_velocity" /* VELOCITY */ + ";\n                attribute vec3 " + "p_accelerition" /* ACCELERITION */ + ";\n                attribute vec4 " + "p_init_rotation" /* ROTATION */ + ";\n                attribute vec4 " + "p_vrotation" /* VROTATION */ + ";\n                attribute vec4 " + "p_scale" /* SCALE */ + ";\n                attribute vec3 " + "p_position" /* POSITION */ + ";\n\n                uniform mat4 " + "mvp" /* mvp */ + ";\n                uniform mat4 " + "invm" /* invm */ + ";\n                uniform mat4 " + "mv" /* mv */ + ";\n\n                uniform float " + "now" /* NOW */ + ";\n                \n\n                varying vec2 vUV;\n                varying vec2 vTime;\n                varying vec4 vSegMul;\n                varying vec4 vSegAdd;\n\n                " + vertexFunctions + "\n\n                void quaXpos(in vec4 qua,inout vec3 pos){\n                    vec4 temp = vec4(cross(qua.xyz,pos.xyz) + (qua.w * pos.xyz) , -dot(qua.xyz,pos.xyz));\n                    pos = cross(temp.xyz,-qua.xyz) + (qua.w * temp.xyz) - (temp.w * qua.xyz);\n                }\n\n                void main(void) {\n                    vec3 b_pos = " + "pos" /* pos */ + ";\n                    vec3 p_pos = vec3(0.0);\n                    vec3 b_veo = vec3(0.0);\n                    vec4 temp = vec4(0.0);\n                    \n                    //\u5148\u5904\u7406\u65F6\u95F4  vec2 timeNode(float now,in vec3 pos,in vec4 time)\n                    vec2 time = timeNode(" + "now" /* NOW */ + ",b_pos," + "p_time" /* TIME */ + ");\n\n#ifdef VELOCITY\n                    //\u5904\u7406\u901F\u5EA6\n                    b_veo += " + "p_velocity" /* VELOCITY */ + ";\n                    p_pos += (time.xxx * b_veo);\n#endif\n                    \n                   \n#ifdef ACCELERITION \n                    //\u52A0\u901F\u5EA6\n                    temp = " + "p_accelerition" /* ACCELERITION */ + " * time.x; //at;\n                    b_veo += temp;                              //vt = v0+a*t;\n                    p_pos += temp * time.x * 0.5;               //s = v0*t + a*t*t*0.5;\n#endif\n\n#ifdef ROTATION     \n                    //\u521D\u59CB\u5316\u65CB\u8F6C\u89D2\u5EA6\n                    quaXpos(" + "p_init_rotation" /* ROTATION */ + ",b_pos);\n#endif\n\n#ifdef VROTATION    \n                        //\u65CB\u8F6C\u52A8\u753B\n                    temp = " + "p_vrotation" /* VROTATION */ + ";\n                    temp.w *= time.x;\n                    temp.xyz *= sin(temp.w);\n                    temp.w = cos(temp.w);\n                    quaXpos(temp,b_pos);\n#endif\n\n#ifdef ROTATION_HEAD    \n                    // b_veo = vec3(-1.0,0.0,0.0);\n                    //if b_veo.yz is (0,0) ,change it to (0.00001,0);\n                    b_veo.y += step(b_veo.y+b_veo.z,0.0) * 0.00001;\n    #ifdef BILLBOARD\n                    temp = " + "mv" /* mv */ + " * vec4(b_veo,0.0);\n                    temp.xyz = normalize(vec3(temp.xy,0.0));\n                    b_pos =  b_pos * mat3(\n                        temp.x,-temp.y,0.0,\n                        temp.y,temp.x,0.0,\n                        0.0,0.0,1.0);\n    #else\n                    b_veo = normalize(b_veo);\n                    vec3 xAxis = vec3(1.0,0.0,0.0);\n                    temp.w = dot(b_veo,xAxis);\n                    temp.xyz = normalize(cross(xAxis,b_veo));\n\n                    //\u4E24\u500D\u89D2\u516C\u5F0F\u83B7\u5F97 cos sin\n                    //cos2a = cosa^2 - sina^2 = 2cosa^2 - 1 = 1 - 2sina^2;\n                    //cosa = sqt((1 + cos2a)/2);\n                    //sina = sqt((1 - cos2a)/2);\n\n                    temp.xyz *= sqrt( (1.0-temp.w) * 0.5);\n                    temp.w = sqrt((1.0 + temp.w) * 0.5);\n                    quaXpos(temp,b_pos);\n                   \n    #endif\n#endif\n\n#ifdef SCALE\n                    //\u7F29\u653E\n                    scaleNode(" + "p_scale" /* SCALE */ + ",time,b_pos);\n#endif\n\n#ifdef BILLBOARD\n                     b_pos = (vec4(b_pos,0.0) * " + "invm" /* invm */ + ").xyz;\n#endif\n\n#ifdef POSITION\n                     b_pos += " + "p_position" /* POSITION */ + ";\n#endif\n\n\n#ifdef SegmentColor\n                    segmentColorNode(time);\n#endif\n\n                    vUV = " + "uv" /* uv */ + ";\n                    vTime = time;\n                    gl_Position = " + "mvp" /* mvp */ + " * vec4(b_pos + p_pos,1.0);\n                }\n";
            var fragmentCode = "\n                precision mediump float;\n\n                " + fragmentDefine + "\n\n                " + fragmentFunctions + "\n\n                uniform sampler2D " + "diff" /* diff */ + ";\n\n                varying vec2 vUV;\n                varying vec2 vTime;\n                varying vec4 vSegMul;\n                varying vec4 vSegAdd;\n\n                void main(void){\n                    vec2 tUV = vUV;\n#ifdef SPRITE_SHEET\n                    segmentColorNode(vTime,tUV);\n#endif\n                    vec4 c = texture2D(" + "diff" /* diff */ + ", tUV);\n                    // c = vec4(vTime.y);\n                    // c.w = 1.0;\n#ifdef SegmentColor\n                    c *= vSegMul;\n                    c += vSegAdd;\n#endif\n                    gl_FragColor = c;\n                    // gl_FragColor = vec4(1.0);\n                }\n\n            ";
            var c = rf.context3D;
            var p = c.createProgram(vertexCode, fragmentCode);
            return p;
        };
        //======================================================================
        //Nodes
        //======================================================================
        //==========================TimeNode====================================
        ParticleMaterial.prototype.timeNode = function (info) {
            var vcode = "\n                vec2 timeNode(float now,in vec3 pos,in vec4 time){\n                    //time: x:startTime, y:durtion,z:delay+durtion,w:1/durtion;\n                    //o: time, time * 1/durtion;\n\n                    now = now - time.x;\n                    pos *= step(0.0,now);\n                    \n                    vec2 o = vec2(0.0,0.0);\n            ";
            if (info.usesDuration) {
                if (info.usesLooping) {
                    if (info.usesDelay) {
                        vcode += "\n                    o.x = fract(now / time.z) * time.z\n                    pos *= step(o.x,time.y);\n                        ";
                    }
                    else {
                        vcode += "\n                    o.x = fract(now * time.w) * time.y;      \n                        ";
                    }
                }
                else {
                    vcode += "\n                    o.x = now * time.w;\n                    pos *= step(now,time.y);  \n                    ";
                }
            }
            else {
                vcode += "\n                    o.x = now;\n                ";
            }
            vcode += "\n                    o.y = o.x * time.w;\n                    return o;\n                }\n            ";
            return vcode;
        };
        //==========================VELOCITY_Node====================================
        ParticleMaterial.prototype.scaleNode = function (info) {
            var vcode = "\n                void scaleNode(in vec4 scale,in vec2 time,inout vec3 pos){\n                    float temp = 0.0;";
            if (info.usesCycle) {
                if (info.usesPhase) {
                    vcode += "\n                    temp += sin(scale.z * time.y + scale.w);";
                }
                else {
                    vcode += "\n                    temp = sin(scale.z * time.y);";
                }
            }
            else {
                vcode += "\n                    temp = time.y;";
            }
            vcode += "\n                    temp = (temp * scale.y) + scale.x;\n            ";
            switch (info.scaleType) {
                case 0:
                    vcode += "\n                    pos.xyz *= temp;";
                    break;
                case 1:
                    vcode += "\n                    pos.x *= temp;";
                    break;
                case 2:
                    vcode += "\n                    pos.y *= temp;";
                    break;
                case 3:
                    vcode += "\n                    pos.z *= temp;";
                    break;
            }
            vcode += "\n                }\n            ";
            return vcode;
        };
        ParticleMaterial.prototype.segmentColorNode = function (info) {
            var data = info.data, usesMul = info.usesMul, usesAdd = info.usesAdd, add = info.add, mul = info.mul, len = info.len;
            if (data instanceof ArrayBuffer) {
                info.data = data = new Float32Array(info.data);
            }
            var vcode = "\n                uniform vec4 " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + data.length / 4 + "];\n                void segmentColorNode(in vec2 time){\n                    vec4 life = " + "p_segment_color" /* SEGMENT_COLOR */ + "[0];\n                    vec4 temp = vec4(0.0);";
            if (usesMul) {
                vcode += "\n                    vec4 mul = " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + mul + "];";
            }
            else {
                vcode += "\n                    vec4 mul = vec4(1.0);";
            }
            if (usesAdd) {
                vcode += "\n                    vec4 add = " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + add + "];";
            }
            else {
                vcode += "\n                    vec4 add = vec4(0.0);";
            }
            if (len > 0) {
                vcode += "\n                    temp.x = min(life.x , time.y);";
                if (usesMul) {
                    vcode += "\n                    mul += temp.x * " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + (mul + 2) + "];";
                }
                if (usesAdd) {
                    vcode += "\n                    add += temp.x * " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + (add + 2) + "];";
                }
            }
            if (len > 1) {
                vcode += "\n                    temp.x = min(life.y , max(0.0 , time.y - life.x));";
                if (usesMul) {
                    vcode += "\n                    mul += temp.x * " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + (mul + 3) + "];";
                }
                if (usesAdd) {
                    vcode += "\n                    add += temp.x * " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + (add + 3) + "];";
                }
            }
            if (len > 2) {
                vcode += "\n                    temp.x = min(life.z , max(0.0 , temp.x - life.y));";
                if (usesMul) {
                    vcode += "\n                    mul += temp.x * " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + (mul + 4) + "];";
                }
                if (usesAdd) {
                    vcode += "\n                    add += temp.x * " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + (add + 4) + "];";
                }
            }
            if (len > 3) {
                vcode += "\n                    temp.x = min(life.w , max(0.0 , temp.x - life.z));";
                if (usesMul) {
                    vcode += "\n                    mul += temp.x * " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + (mul + 5) + "];";
                }
                if (usesAdd) {
                    vcode += "\n                    add += temp.x * " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + (add + 5) + "];";
                }
            }
            if (len == 0) {
                vcode += "\n                    temp.y = time.y;";
            }
            else {
                switch (len) {
                    case 1:
                        vcode += "\n                    temp.y = max(0.0,time.y - life.x);";
                        break;
                    case 2:
                        vcode += "\n                    temp.y = max(0.0,time.y - life.y);";
                        break;
                    case 3:
                        vcode += "\n                    temp.y = max(0.0,time.y - life.z);";
                        break;
                    case 4:
                        vcode += "\n                    temp.y = max(0.0,time.y - life.w);";
                        break;
                }
            }
            if (usesMul) {
                vcode += "\n                    mul += temp.y * " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + (mul + 1) + "];";
            }
            if (usesAdd) {
                vcode += "\n                    add += temp.y * " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + (add + 1) + "];";
            }
            vcode += "\n                    vSegMul = mul;\n                    vSegAdd = add;";
            vcode += "\n                }";
            return vcode;
        };
        ParticleMaterial.prototype.spriteSheetNode = function (info) {
            var rows = info.rows, usesCycle = info.usesCycle, usesPhase = info.usesPhase;
            var code = "\n                uniform vec4 " + "p_sprite_sheet_anim" /* SPRITE_SHEET */ + "[2];\n                void segmentColorNode(in vec2 time,inout vec2 uv){\n                    vec4 data = " + "p_sprite_sheet_anim" /* SPRITE_SHEET */ + "[0];\n                    vec4 info = " + "p_sprite_sheet_anim" /* SPRITE_SHEET */ + "[1];\n                    vec2 temp = vec2(0.0);\n                    uv.x *= data.y;";
            if (rows > 1) {
                code += "\n                    uv.y *= data.z;";
            }
            if (usesCycle) {
                if (usesPhase) {
                    code += "\n                    temp.x = time.x + info.z;\n                    ";
                }
                else {
                    code += "\n                    temp.x = time.x;\n                    ";
                }
                code += "\n                    temp.y = fract(temp.x / info.y) * info.y * info.x;";
            }
            else {
                code += "\n                    temp.y = time.y * data.x;";
            }
            if (rows > 1) {
                code += "\n                    uv.y += (temp.y - fract(temp.y)) * data.z;";
            }
            code += "\n                    temp.x = temp.y / data.y;\n                    temp.x = (temp.x - fract(temp.x)) * data.y;";
            if (rows > 1) {
                code += "\n                    uv.x += fract(temp.x);";
            }
            else {
                code += "\n                    uv.x += temp.x;";
            }
            code += "\n                }";
            return code;
        };
        return ParticleMaterial;
    }(rf.Material));
    rf.ParticleMaterial = ParticleMaterial;
})(rf || (rf = {}));
var rf;
(function (rf) {
    function skill_MeshCreate(line, event) {
        var mesh = line.runtime[event.key];
    }
    rf.skill_MeshCreate = skill_MeshCreate;
    var Skill = /** @class */ (function (_super) {
        __extends(Skill, _super);
        function Skill() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Skill.prototype.load = function (url) {
            if (url.lastIndexOf(".sk" /* SKILL */) == -1) {
                url += ".sk" /* SKILL */;
            }
            if (url.indexOf("://") == -1) {
                url = rf.skill_Perfix + url;
            }
            rf.loadRes(url, this.loadCompelte, this, 0 /* bin */);
        };
        Skill.prototype.loadCompelte = function (e) {
            var item = e.data;
            var byte = item.data;
            this.play(rf.amf_readObject(byte));
        };
        Skill.prototype.play = function (data) {
        };
        Skill.prototype.update = function (now, interval) {
        };
        return Skill;
    }(rf.SceneObject));
    rf.Skill = Skill;
})(rf || (rf = {}));
/// <reference path="../com/youbt/stage3d/Stage3D.ts" />
var rf;
(function (rf) {
    var GUIProfile = /** @class */ (function (_super) {
        __extends(GUIProfile, _super);
        // span:HTMLElement;
        function GUIProfile() {
            var _this = _super.call(this) || this;
            _this.bindComponents();
            return _this;
        }
        GUIProfile.prototype.bindComponents = function () {
            this.timeTex = this.createText();
            this.fpsTxt = this.createText();
            this.bufferTex = this.createText();
            this.dcTxt = this.createText();
            rf.ROOT.addEventListener(rf.EngineEvent.FPS_CHANGE, this.fpsChangeHandler, this);
            // this.span = document.getElementById("fps");
        };
        GUIProfile.prototype.createText = function () {
            var text = new rf.TextField();
            text.init();
            text.y = this.h;
            this.h += text.format.size;
            this.addChild(text);
            return text;
        };
        GUIProfile.prototype.fpsChangeHandler = function (event) {
            var con = rf.context3D;
            this.timeTex.text = "time:" + rf.getFormatTime(rf.engineNow, "HH:mm:ss", false);
            this.fpsTxt.text = "F:" + rf.Engine.fps + " C:" + rf.Engine.code.toFixed(2);
            this.bufferTex.text = con.toString();
            this.dcTxt.text = "tri:" + con.triangles + " dc:" + con.dc;
            // this.span.innerHTML = `pixelRatio:${pixelRatio} fps:${Engine.fps} code:${Engine.code.toFixed(2)}`
        };
        return GUIProfile;
    }(rf.Sprite));
    rf.GUIProfile = GUIProfile;
})(rf || (rf = {}));
var rf;
(function (rf) {
    rf.line_variable = {
        "posX": { size: 3, offset: 0 },
        "posY": { size: 3, offset: 3 },
        "len": { size: 1, offset: 6 },
        "color": { size: 4, offset: 7 },
        "data32PerVertex": { size: 11, offset: 0 }
    };
    var Line3DPoint = /** @class */ (function () {
        function Line3DPoint() {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.r = 1;
            this.g = 1;
            this.b = 1;
            this.a = 1;
            this.t = 1;
        }
        Line3DPoint.prototype.clear = function () {
            this.x = this.y = this.z = 0;
            this.r = this.g = this.b = this.a = this.t = 1;
        };
        Line3DPoint.prototype.clone = function () {
            var vo = new Line3DPoint();
            vo.x = this.x;
            vo.y = this.y;
            vo.z = this.z;
            vo.r = this.r;
            vo.g = this.g;
            vo.b = this.b;
            vo.a = this.a;
            vo.t = this.t;
            return vo;
        };
        return Line3DPoint;
    }());
    rf.Line3DPoint = Line3DPoint;
    /**
     * 直线 不管放大 缩小 都不变
     */
    var Line3D = /** @class */ (function (_super) {
        __extends(Line3D, _super);
        function Line3D() {
            var _this = _super.call(this, rf.line_variable) || this;
            _this.points = [];
            _this.data32PerVertex = rf.line_variable["data32PerVertex"].size;
            _this.nativeRender = true;
            _this.worldTransform = rf.newMatrix3D();
            return _this;
        }
        Line3D.prototype.clear = function () {
            var tempVertex = this.tempVertex;
            if (undefined == tempVertex) {
                this.tempVertex = tempVertex = rf.recyclable(rf.Temp_Float32Byte);
            }
            tempVertex.data32PerVertex = this.data32PerVertex;
            tempVertex.numVertices = 0;
            var origin = this.origin;
            if (undefined == origin) {
                this.origin = origin = rf.recyclable(Line3DPoint);
            }
            this.points.length = 0;
            this.vertexBuffer = null;
        };
        Line3D.prototype.moveTo = function (x, y, z, thickness, color, alpha) {
            if (thickness === void 0) { thickness = 1; }
            if (color === void 0) { color = 0xFFFFFF; }
            if (alpha === void 0) { alpha = 1; }
            var _a = this, origin = _a.origin, points = _a.points;
            if (points.length) {
                this.build();
            }
            origin.x = x;
            origin.y = y;
            origin.z = z;
            origin.t = thickness;
            rf.toRGB(color, origin);
            origin.a = alpha;
            points.push(origin.clone());
        };
        Line3D.prototype.lineTo = function (x, y, z, thickness, color, alpha) {
            if (thickness === void 0) { thickness = 1; }
            if (color === void 0) { color = 0xFFFFFF; }
            if (alpha === void 0) { alpha = 1; }
            var _a = this, vo = _a.origin, points = _a.points;
            vo.x = x;
            vo.y = y;
            vo.z = z;
            vo.a = alpha;
            vo.t = thickness;
            rf.toRGB(color, vo);
            points.push(vo.clone());
        };
        Line3D.prototype.build = function () {
            var _a = this, points = _a.points, tempVertex = _a.tempVertex;
            var j = 0;
            var m = points.length - 1;
            for (j = 0; j < m; j++) {
                var p1 = points[j];
                var p2 = points[j + 1];
                tempVertex.set([p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, -p1.t * 0.5, p1.r, p1.g, p1.b, p1.a]);
                tempVertex.set([p2.x, p2.y, p2.z, p1.x, p1.y, p1.z, p2.t * 0.5, p2.r, p2.g, p2.b, p2.a]);
                tempVertex.set([p2.x, p2.y, p2.z, p1.x, p1.y, p1.z, -p2.t * 0.5, p2.r, p2.g, p2.b, p2.a]);
                tempVertex.set([p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p1.t * 0.5, p1.r, p1.g, p1.b, p1.a]);
                tempVertex.numVertices += 4;
            }
            points.length = 0;
        };
        Line3D.prototype.end = function () {
            var _a = this, origin = _a.origin, data32PerVertex = _a.data32PerVertex, points = _a.points, tempVertex = _a.tempVertex, variables = _a.variables;
            if (points.length) {
                this.build();
            }
            var arr = tempVertex.toArray();
            var info = new rf.VertexInfo(arr, data32PerVertex, variables);
            var v = this.vertexBuffer = rf.context3D.createVertexBuffer(info);
            this.triangles = v.numVertices / 2;
            this.quad = this.triangles / 2;
            tempVertex.recycle();
            origin.recycle();
            this.tempVertex = this.origin = undefined;
        };
        Line3D.prototype.updateTransform = function () {
            _super.prototype.updateTransform.call(this);
        };
        Line3D.prototype.render = function (camera, now, interval) {
            var c = rf.context3D;
            // c.setDepthTest(true,gl.LEQUAL);
            var _a = this, v = _a.vertexBuffer, m = _a.worldTransform, quad = _a.quad, triangles = _a.triangles;
            if (undefined == v) {
                return;
            }
            var p = this.program;
            if (undefined == p) {
                p = c.programs["Line3D"];
                if (undefined == p) {
                    p = this.createProgram();
                }
                this.program = p;
            }
            var _b = rf.scene.material, depthMask = _b.depthMask, passCompareMode = _b.passCompareMode, srcFactor = _b.srcFactor, dstFactor = _b.dstFactor, cull = _b.cull;
            c.setCulling(cull);
            c.setDepthTest(depthMask, passCompareMode);
            c.setBlendFactors(srcFactor, dstFactor);
            // c.setBlendFactors(gl.ONE,gl.ZERO);
            // c.setDepthTest(true,gl.LESS);
            c.setProgram(p);
            m.set(this.sceneTransform);
            m.m3_append(camera.sceneTransform);
            c.setProgramConstantsFromMatrix("mv" /* mv */, m);
            c.setProgramConstantsFromMatrix("p" /* p */, camera.len);
            v.uploadContext(p);
            var i = c.getIndexByQuad(quad);
            c.drawTriangles(i, triangles);
        };
        Line3D.prototype.createProgram = function () {
            var vertexCode = "\n                attribute vec3 posX;\n                attribute vec3 posY;\n                attribute float len;\n                attribute vec4 color;\n\n                uniform mat4 mv;\n                uniform mat4 p;\n                varying vec4 vColor;\n\n                void main(void){\n                    vec4 pos = mv * vec4(posX,1.0); \n                    vec4 t = pos - mv * vec4(posY,1.0);\n                    vec3 v = cross(t.xyz,vec3(0,0,1));\n                    v = normalize(v);\n                    float t2 = pos.z * p[2].w;\n                    if(t2 <= 0.0){\n                       v.xyz *= len;\n                    }else{\n                        v.xyz *= len * t2;\n                    }\n                    pos.xy += v.xy;\n                    pos = p * pos;\n                    gl_Position = pos;\n                    vColor = color;\n                    // t2 = pos.z;\n                    // pos = vec4(t2,t2,t2,1.0);\n                    // vColor.xyzw = pos;\n                }\n            ";
            var fragmentCode = " \n                precision mediump float;\n                varying vec4 vColor;\n                void main(void){\n                    gl_FragColor = vColor;\n                }\n            ";
            return rf.context3D.createProgram(vertexCode, fragmentCode, "Line3D");
        };
        return Line3D;
    }(rf.RenderBase));
    rf.Line3D = Line3D;
    var Trident = /** @class */ (function (_super) {
        __extends(Trident, _super);
        function Trident(len, think) {
            if (len === void 0) { len = 200; }
            if (think === void 0) { think = 2; }
            var _this = _super.call(this) || this;
            var line;
            if (len * 0.1 > 60) {
                line = len - 60;
            }
            else {
                line = len * 0.9;
            }
            _this.clear();
            var color = 0xFF0000;
            _this.moveTo(0, 0, 0, think, color);
            _this.lineTo(line, 0, 0, think, color);
            _this.moveTo(line, 0, 0, think * 5, color);
            _this.lineTo(len, 0, 0, 0, color);
            color = 0x00FF00;
            _this.moveTo(0, 0, 0, think, color);
            _this.lineTo(0, line, 0, think, color);
            _this.moveTo(0, line, 0, think * 5, color);
            _this.lineTo(0, len, 0, 0, color);
            color = 0x0000FF;
            _this.moveTo(0, 0, 0, think, color);
            _this.lineTo(0, 0, line, think, color);
            _this.moveTo(0, 0, line, think * 5, color);
            _this.lineTo(0, 0, len, 0, color);
            _this.end();
            return _this;
        }
        return Trident;
    }(Line3D));
    rf.Trident = Trident;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var PanelUtils = /** @class */ (function () {
        function PanelUtils() {
            var manage = this.manage;
            manage = rf.singleton(rf.PanelSourceManage);
            this.source = manage.load("../assets/create.p3d", "create");
            this.source.addEventListener(4 /* COMPLETE */, this.asyncsourceComplete, this);
        }
        PanelUtils.prototype.asyncsourceComplete = function (e) {
            var source = this.source;
            var clsname = "ui.asyncpanel.create";
            var cs = source.setting[clsname];
            this.skin = new rf.Component(source.source);
            this.skin.setSymbol(cs);
            this.skin.renderer = new rf.BatchRenderer(this.skin);
            rf.popContainer.addChild(this.skin);
            this.bindComponents();
        };
        PanelUtils.prototype.bindComponents = function () {
            var skin = this.skin;
            this.btn_random = new rf.Button(skin["btn_random"]);
            this.btn_create = new rf.Button(skin['btn_create']);
            this.bg = new rf.IconView(skin.source);
            skin.addChildAt(this.bg, 0);
            this.bg.setUrl('assets/createbg.jpg');
            this.btn_random.addClick(this.randomHandler);
        };
        PanelUtils.prototype.randomHandler = function (e) {
            alert("随机按钮点击");
        };
        return PanelUtils;
    }());
    rf.PanelUtils = PanelUtils;
    var sourceManger = rf.singleton(rf.PanelSourceManage);
})(rf || (rf = {}));
var rf;
(function (rf) {
    var Eva_Text = /** @class */ (function () {
        function Eva_Text() {
            // window.onkeyup = this.onKeyDownHandle;
            rf.mainKey.regKeyDown(65 /* A */, this.onKeyDownHandle, this);
        }
        Eva_Text.prototype.onKeyDownHandle = function (e) {
            var m = rf.singleton(TestMediator);
            rf.facade.toggleMediator(m);
        };
        return Eva_Text;
    }());
    rf.Eva_Text = Eva_Text;
    var TestMediator = /** @class */ (function (_super) {
        __extends(TestMediator, _super);
        function TestMediator() {
            var _this = _super.call(this, "TestMediator") || this;
            _this.setPanel(new TestPanel());
            return _this;
        }
        TestMediator.prototype.mediatorReadyHandle = function () {
            _super.prototype.mediatorReadyHandle.call(this);
        };
        TestMediator.prototype.awaken = function () {
            console.log("mediator awaken");
        };
        return TestMediator;
    }(rf.Mediator));
    rf.TestMediator = TestMediator;
    var TestPanel = /** @class */ (function (_super) {
        __extends(TestPanel, _super);
        function TestPanel() {
            return _super.call(this, "create", "ui.asyncpanel.create") || this;
        }
        TestPanel.prototype.awaken = function () {
            this.key = new rf.KeyManagerV2(this.skin);
            this.key.regKeyDown(66 /* B */, this.onKeyHandle, this);
            this.key.awaken();
        };
        TestPanel.prototype.onKeyHandle = function (e) {
            console.log("key_down_" + e.keyCode);
        };
        TestPanel.prototype.sleep = function () {
            this.key.sleep();
            console.log("key_sleep");
        };
        return TestPanel;
    }(rf.TPanel));
    rf.TestPanel = TestPanel;
    var TestModel = /** @class */ (function (_super) {
        __extends(TestModel, _super);
        function TestModel() {
            return _super.call(this, "Test") || this;
        }
        return TestModel;
    }(rf.BaseMode));
    rf.TestModel = TestModel;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var KeyManagerV2 = /** @class */ (function (_super) {
        __extends(KeyManagerV2, _super);
        function KeyManagerV2(target) {
            var _this = _super.call(this) || this;
            _this.keylist = [];
            _this.keylimit = [];
            /**
             *用于独占按键响应，如果为true，则即使该管理器没有响应 按键回调，也不会在mainKey管理器中响应
             */
            _this.isClosed = false;
            /**
             * 执行快捷键
             * @param e
             * @param keyvalue
             */
            _this.keyDict = {};
            _this.keyObj = {};
            if (target) {
                target.addEventListener(50 /* MouseDown */, _this.mouseDownHandler, _this);
            }
            _this.keyDict = {};
            return _this;
        }
        KeyManagerV2.prototype.mouseDownHandler = function (e) {
            KeyManagerV2.currentKey = this;
        };
        KeyManagerV2.resetDefaultMainKey = function (value) {
            KeyManagerV2._defaultMainKey = value == null ? rf.mainKey : value;
            this.setFocus(KeyManagerV2._defaultMainKey);
        };
        KeyManagerV2.setFocus = function (focus) {
            if (KeyManagerV2.currentKey && KeyManagerV2.currentKey.isClosed) {
                return;
            }
            if (!focus) {
                focus = KeyManagerV2._defaultMainKey;
            }
            KeyManagerV2.currentKey = focus;
        };
        KeyManagerV2.prototype.awaken = function () {
            KeyManagerV2.currentKey = this;
        };
        KeyManagerV2.prototype.sleep = function () {
            KeyManagerV2.setFocus(KeyManagerV2._defaultMainKey);
        };
        KeyManagerV2.prototype.init = function () {
            var $this = this;
            function m(e) {
                $this.onKeyHandle(e);
            }
            ;
            var canvas = rf.ROOT.canvas;
            window.onkeydown = m;
            window.onkeyup = m;
            this.keylimit = [16 /* SHIFT */, 17 /* CONTROL */, 18 /* ALTERNATE */];
            this.keylist = [];
        };
        KeyManagerV2.prototype.onKeyHandle = function (e) {
            e.stopImmediatePropagation();
            var keyList = this.keylist;
            var i;
            var code = e.keyCode;
            if (!this.check()) {
                i = keyList.indexOf(code);
                if (i != -1) {
                    keyList.splice(i, 1);
                }
                return;
            }
            if (this.keylimit.indexOf(code) != -1)
                return;
            if (e.type == "keydown") {
                if (keyList.indexOf(code) != -1) {
                    return;
                }
                keyList.push(code);
            }
            else {
                i = keyList.indexOf(code);
                if (i != -1) {
                    keyList.splice(i, 1);
                }
            }
            var type = (e.type == "keydown") ? 0 : 1;
            var shiftKey, ctrlKey, altKey;
            shiftKey = e.shiftKey ? 1 : 0;
            ctrlKey = e.ctrlKey ? 1 : 0;
            altKey = e.altKey ? 1 : 0;
            var keyvalue = type << 12 | shiftKey << 11 | ctrlKey << 10 | altKey << 9 | e.keyCode;
            if ((!KeyManagerV2.currentKey || !KeyManagerV2.currentKey.doKey(e, keyvalue)) && rf.mainKey) {
                rf.mainKey.doKey(e, keyvalue);
            }
        };
        KeyManagerV2.prototype.doKey = function (e, keyvalue) {
            var f = this.keyDict[keyvalue];
            this.currentKeyCode = keyvalue & 0xFF;
            if (f != null) {
                if (f.length == 1) {
                    f.call(this.keyObj[keyvalue], e);
                }
                else {
                    f.call(this.keyObj[keyvalue]);
                }
                return true;
            }
            return this.isClosed;
        };
        KeyManagerV2.prototype.check = function () {
            if (!KeyManagerV2.enabled) {
                return false;
            }
            //check input
            return true;
        };
        KeyManagerV2.prototype.regKeyDown = function (key, func, thisobj, shift, ctrl, alt) {
            if (shift === void 0) { shift = false; }
            if (ctrl === void 0) { ctrl = false; }
            if (alt === void 0) { alt = false; }
            var shiftKey, ctrlKey, altKey;
            shiftKey = shift ? 1 : 0;
            ctrlKey = ctrl ? 1 : 0;
            altKey = alt ? 1 : 0;
            this.keyDict[shiftKey << 11 | ctrlKey << 10 | altKey << 9 | key] = func;
            this.keyObj[shiftKey << 11 | ctrlKey << 10 | altKey << 9 | key] = thisobj;
        };
        KeyManagerV2.prototype.removeKeyDown = function (key, func, shift, ctrl, alt) {
            if (shift === void 0) { shift = false; }
            if (ctrl === void 0) { ctrl = false; }
            if (alt === void 0) { alt = false; }
            var shiftKey, ctrlKey, altKey;
            shiftKey = shift ? 1 : 0;
            ctrlKey = ctrl ? 1 : 0;
            altKey = alt ? 1 : 0;
            var d = shiftKey << 11 | ctrlKey << 10 | altKey << 9 | key;
            if (this.keyDict[d] == func) {
                this.keyDict[d] = null;
                delete this.keyDict[d];
                this.keyObj[d] = null;
                delete this.keyObj[d];
            }
        };
        KeyManagerV2.enabled = true;
        return KeyManagerV2;
    }(rf.MiniDispatcher));
    rf.KeyManagerV2 = KeyManagerV2;
    rf.mainKey = new KeyManagerV2();
})(rf || (rf = {}));
var rf;
(function (rf) {
    var Pan_Test = /** @class */ (function () {
        function Pan_Test() {
            // let utils = new PanelUtils();
        }
        return Pan_Test;
    }());
    rf.Pan_Test = Pan_Test;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var TextTest = /** @class */ (function () {
        function TextTest() {
            var c = document.createElement("canvas");
            // c.style.cssText = "width:100px;height:100px";
            c.width = 200;
            c.height = 200;
            var ctx = c.getContext("2d");
            ctx.fillRect(0, 0, c.width, c.height);
            // ctx.putImageData()
            // ctx.drawImage()
            var getPixelRatio = function (context) {
                var backingStore = context.backingStorePixelRatio ||
                    context.webkitBackingStorePixelRatio ||
                    context.mozBackingStorePixelRatio ||
                    context.msBackingStorePixelRatio ||
                    context.oBackingStorePixelRatio ||
                    context.backingStorePixelRatio || 1;
                return (window.devicePixelRatio || 1) / backingStore;
            };
            var ratio = getPixelRatio(ctx);
            // ctx.scale(ratio,ratio);
            // alert(ctx.fillText);
            // 注意，这里的 width 和 height 变成了 width * ratio 和 height * ratio
            // ctx.drawImage(document.querySelector('img'), 0, 0, 300 * ratio, 90 * ratio);
            // ctx.font = "12px Microsoft YaHei";
            // ctx.fillText("你好啊"+ratio,0,24);
            // ctx.strokeText("你好啊",0,50);
            document.body.appendChild(c);
            ctx.font = '40pt Calibri';
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'green';
            ctx.strokeText('汪鸿海!', 20, 100);
            ctx.fillStyle = 'red';
            ctx.fillText('汪鸿海!', 20, 100);
            ctx.measureText("汪").width;
            // var d:TextMetrics=ctx.measureText("你");
            // alert(d.width)
        }
        return TextTest;
    }());
    rf.TextTest = TextTest;
})(rf || (rf = {}));
//# sourceMappingURL=rfstage3d.js.map