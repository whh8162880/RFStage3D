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
        isClientCheck: true
    };
    rf.errorPrefix = "";
    if (RELEASE) {
        var errorMsg = [];
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
    function getMsg(msg) {
        return new Date()["format"]("[yyyy-MM-dd HH:mm:ss]", true) + "[info:]" + msg;
    }
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
function zeroize(value, length) {
    if (length === void 0) { length = 2; }
    var str = "" + value;
    var zeros = "";
    for (var i = 0, len = length - str.length; i < len; i++) {
        zeros += "0";
    }
    return zeros + str;
}
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
                if (!data || (data.set || data.writable)) {
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
if (!Number.isSafeInteger) {
    Number.isSafeInteger = function (value) { return value < 9007199254740991 && value >= -9007199254740991; };
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
                        var value = obj_1[key];
                        if (handler) {
                            var func = String.subHandler[handler];
                            if (func) {
                                value = func(value);
                            }
                        }
                        return (value !== undefined) ? '' + value : match;
                    });
                }
            }
            return this.toString();
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
})(rf || (rf = {}));
var rf;
(function (rf) {
    rf.stageWidth = 0;
    rf.stageHeight = 0;
    rf.isWindowResized = false;
    rf.max_vc = 100;
    rf.c_white = "rgba(255,255,255,255)";
})(rf || (rf = {}));
var rf;
(function (rf) {
    var Vector3D = (function () {
        function Vector3D(x, y, z, w) {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w || 0;
        }
        Object.defineProperty(Vector3D.prototype, "length", {
            get: function () {
                return Math.sqrt(this.lengthSquared);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3D.prototype, "lengthSquared", {
            get: function () {
                return this.x * this.x + this.y * this.y + this.z * this.z;
            },
            enumerable: true,
            configurable: true
        });
        Vector3D.angleBetween = function (a, b) {
            return Math.acos(a.dotProduct(b) / (a.length * b.length));
        };
        Vector3D.distance = function (pt1, pt2) {
            var x = pt1.x - pt2.x;
            var y = pt1.y - pt2.y;
            var z = pt1.z - pt2.z;
            return Math.sqrt(x * x + y * y + z * z);
        };
        Vector3D.prototype.add = function (a) {
            return new Vector3D(this.x + a.x, this.y + a.y, this.z + a.z);
        };
        Vector3D.prototype.subtract = function (a) {
            return new Vector3D(this.x - a.x, this.y - a.y, this.z - a.z);
        };
        Vector3D.prototype.incrementBy = function (a) {
            this.x += a.x;
            this.y += a.y;
            this.z += a.z;
        };
        Vector3D.prototype.decrementBy = function (a) {
            this.x -= a.x;
            this.y -= a.y;
            this.z -= a.z;
        };
        Vector3D.prototype.equals = function (toCompare, allFour) {
            return (this.x == toCompare.x && this.y == toCompare.y && this.z == toCompare.z && (allFour ? this.w == toCompare.w : true));
        };
        Vector3D.prototype.nearEquals = function (toCompare, tolerance, allFour) {
            var abs = Math.abs;
            return ((abs(this.x - toCompare.x) < tolerance) && (abs(this.y - toCompare.y) < tolerance) && (abs(this.z - toCompare.z) < tolerance) && (allFour ? (abs(this.w - toCompare.w) < tolerance) : true));
        };
        Vector3D.prototype.clone = function () {
            return new Vector3D(this.x, this.y, this.z, this.w);
        };
        Vector3D.prototype.copyFrom = function (sourceVector3D) {
            this.x = sourceVector3D.x;
            this.y = sourceVector3D.y;
            this.z = sourceVector3D.z;
            this.w = sourceVector3D.w;
        };
        Vector3D.prototype.negate = function () {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
        };
        Vector3D.prototype.scaleBy = function (s) {
            this.x *= s;
            this.y *= s;
            this.z *= s;
        };
        Vector3D.prototype.setTo = function (xa, ya, za) {
            this.x = xa;
            this.y = ya;
            this.z = za;
        };
        Vector3D.prototype.normalize = function () {
            var leng = this.length;
            if (leng != 0)
                this.scaleBy(1 / leng);
            return leng;
        };
        Vector3D.prototype.crossProduct = function (a) {
            var _a = this, x = _a.x, y = _a.y, z = _a.z;
            var ax = a.x, ay = a.y, az = a.z;
            return new Vector3D(y * az - z * ay, z * ax - x * az, x * ay - y * ax);
        };
        Vector3D.prototype.dotProduct = function (a) {
            return this.x * a.x + this.y * a.y + this.z * a.z;
        };
        Vector3D.prototype.project = function () {
            var w = this.w;
            if (w == 0)
                return;
            this.x /= w;
            this.y /= w;
            this.z /= w;
        };
        Vector3D.prototype.toString = function () {
            return "[Vector3D] (x:" + this.x + " ,y:" + this.y + ", z:" + this.z + ", w:" + this.w + ")";
        };
        Vector3D.X_AXIS = new Vector3D(1, 0, 0);
        Vector3D.Y_AXIS = new Vector3D(0, 1, 0);
        Vector3D.Z_AXIS = new Vector3D(0, 0, 1);
        return Vector3D;
    }());
    rf.Vector3D = Vector3D;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var DEG_2_RAD = Math.PI / 180;
    var Matrix3D = (function () {
        function Matrix3D(v) {
            if (undefined != v && v.length == 16)
                this.rawData = new Float32Array(v);
            else
                this.rawData = new Float32Array([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                ]);
        }
        Object.defineProperty(Matrix3D.prototype, "determinant", {
            get: function () {
                var rawData = this.rawData;
                return ((rawData[0] * rawData[5] - rawData[4] * rawData[1]) * (rawData[10] * rawData[15] - rawData[14] * rawData[11])
                    - (rawData[0] * rawData[9] - rawData[8] * rawData[1]) * (rawData[6] * rawData[15] - rawData[14] * rawData[7])
                    + (rawData[0] * rawData[13] - rawData[12] * rawData[1]) * (rawData[6] * rawData[11] - rawData[10] * rawData[7])
                    + (rawData[4] * rawData[9] - rawData[8] * rawData[5]) * (rawData[2] * rawData[15] - rawData[14] * rawData[3])
                    - (rawData[4] * rawData[13] - rawData[12] * rawData[5]) * (rawData[2] * rawData[11] - rawData[10] * rawData[3])
                    + (rawData[8] * rawData[13] - rawData[12] * rawData[9]) * (rawData[2] * rawData[7] - rawData[6] * rawData[3]));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix3D.prototype, "position", {
            get: function () {
                var rawData = this.rawData;
                return new rf.Vector3D(rawData[3], rawData[7], rawData[11]);
            },
            enumerable: true,
            configurable: true
        });
        Matrix3D.prototype.append = function (lhs) {
            var rawData = this.rawData;
            var _a = rawData, m111 = _a[0], m112 = _a[1], m113 = _a[2], m114 = _a[3], m121 = _a[4], m122 = _a[5], m123 = _a[6], m124 = _a[7], m131 = _a[8], m132 = _a[9], m133 = _a[10], m134 = _a[11], m141 = _a[12], m142 = _a[13], m143 = _a[14], m144 = _a[15];
            var _b = lhs.rawData, m211 = _b[0], m212 = _b[1], m213 = _b[2], m214 = _b[3], m221 = _b[4], m222 = _b[5], m223 = _b[6], m224 = _b[7], m231 = _b[8], m232 = _b[9], m233 = _b[10], m234 = _b[11], m241 = _b[12], m242 = _b[13], m243 = _b[14], m244 = _b[15];
            rawData[0] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241;
            rawData[1] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242;
            rawData[2] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243;
            rawData[3] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244;
            rawData[4] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241;
            rawData[5] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242;
            rawData[6] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243;
            rawData[7] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244;
            rawData[8] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241;
            rawData[9] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242;
            rawData[10] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243;
            rawData[11] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244;
            rawData[12] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241;
            rawData[13] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242;
            rawData[14] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243;
            rawData[15] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244;
        };
        Matrix3D.prototype.prepend = function (rhs) {
            var _a = rhs.rawData, a11 = _a[0], a12 = _a[1], a13 = _a[2], a14 = _a[3], a21 = _a[4], a22 = _a[5], a23 = _a[6], a24 = _a[7], a31 = _a[8], a32 = _a[9], a33 = _a[10], a34 = _a[11], a41 = _a[12], a42 = _a[13], a43 = _a[14], a44 = _a[15];
            var rawData = this.rawData;
            var _b = rawData, b11 = _b[0], b12 = _b[1], b13 = _b[2], b14 = _b[3], b21 = _b[4], b22 = _b[5], b23 = _b[6], b24 = _b[7], b31 = _b[8], b32 = _b[9], b33 = _b[10], b34 = _b[11], b41 = _b[12], b42 = _b[13], b43 = _b[14], b44 = _b[15];
            rawData[0] = b11 * a11 + b12 * a21 + b13 * a31 + b14 * a41;
            rawData[1] = b11 * a12 + b12 * a22 + b13 * a32 + b14 * a42;
            rawData[2] = b11 * a13 + b12 * a23 + b13 * a33 + b14 * a43;
            rawData[3] = b11 * a14 + b12 * a24 + b13 * a34 + b14 * a44;
            rawData[4] = b21 * a11 + b22 * a21 + b23 * a31 + b24 * a41;
            rawData[5] = b21 * a12 + b22 * a22 + b23 * a32 + b24 * a42;
            rawData[6] = b21 * a13 + b22 * a23 + b23 * a33 + b24 * a43;
            rawData[7] = b21 * a14 + b22 * a24 + b23 * a34 + b24 * a44;
            rawData[8] = b31 * a11 + b32 * a21 + b33 * a31 + b34 * a41;
            rawData[9] = b31 * a12 + b32 * a22 + b33 * a32 + b34 * a42;
            rawData[10] = b31 * a13 + b32 * a23 + b33 * a33 + b34 * a43;
            rawData[11] = b31 * a14 + b32 * a24 + b33 * a34 + b34 * a44;
            rawData[12] = b41 * a11 + b42 * a21 + b43 * a31 + b44 * a41;
            rawData[13] = b41 * a12 + b42 * a22 + b43 * a32 + b44 * a42;
            rawData[14] = b41 * a13 + b42 * a23 + b43 * a33 + b44 * a43;
            rawData[15] = b41 * a14 + b42 * a24 + b43 * a34 + b44 * a44;
        };
        Matrix3D.prototype.appendScale = function (xScale, yScale, zScale) {
            var rawData = this.rawData;
            rawData[0] *= xScale;
            rawData[1] *= xScale;
            rawData[2] *= xScale;
            rawData[3] *= xScale;
            rawData[4] *= yScale;
            rawData[5] *= yScale;
            rawData[6] *= yScale;
            rawData[7] *= yScale;
            rawData[8] *= zScale;
            rawData[9] *= zScale;
            rawData[10] *= zScale;
            rawData[11] *= zScale;
        };
        Matrix3D.prototype.prependScale = function (xScale, yScale, zScale) {
            var rawData = this.rawData;
            rawData[0] *= xScale;
            rawData[1] *= yScale;
            rawData[2] *= zScale;
            rawData[4] *= xScale;
            rawData[5] *= yScale;
            rawData[6] *= zScale;
            rawData[8] *= xScale;
            rawData[9] *= yScale;
            rawData[10] *= zScale;
            rawData[12] *= xScale;
            rawData[13] *= yScale;
            rawData[14] *= zScale;
        };
        Matrix3D.prototype.appendTranslation = function (x, y, z) {
            var rawData = this.rawData;
            rawData[12] += x;
            rawData[13] += y;
            rawData[14] += z;
        };
        Matrix3D.prototype.prependTranslation = function (x, y, z) {
            var rawData = this.rawData;
            rawData[3] += rawData[0] * x + rawData[1] * y + rawData[2] * z;
            rawData[7] += rawData[4] * x + rawData[5] * y + rawData[6] * z;
            rawData[11] += rawData[8] * x + rawData[9] * y + rawData[10] * z;
            rawData[15] += rawData[12] * x + rawData[13] * y + rawData[14] * z;
        };
        Matrix3D.prototype.appendRotation = function (degrees, axis, pivotPoint) {
            var r = this.getRotateMatrix(axis, degrees * DEG_2_RAD);
            if (pivotPoint) {
                var x = pivotPoint.x, y = pivotPoint.y, z = pivotPoint.z;
                this.appendTranslation(-x, -y, -z);
                this.append(r);
                this.appendTranslation(x, y, z);
            }
            else {
                this.append(r);
            }
        };
        Matrix3D.prototype.prependRotation = function (degrees, axis, pivotPoint) {
            var r = this.getRotateMatrix(axis, degrees * DEG_2_RAD);
            if (pivotPoint) {
                var x = pivotPoint.x, y = pivotPoint.y, z = pivotPoint.z;
                this.prependTranslation(x, y, z);
                this.prepend(r);
                this.prependTranslation(-x, -y, -z);
            }
            else {
                this.prepend(r);
            }
        };
        Matrix3D.prototype.clone = function () {
            return new Matrix3D(this.rawData);
        };
        Matrix3D.prototype.copyColumnFrom = function (column, vector3D) {
            if (column < 0 || column > 3)
                throw new Error("column error");
            var rawData = this.rawData;
            rawData[column] = vector3D.x;
            rawData[column + 4] = vector3D.y;
            rawData[column + 8] = vector3D.z;
            rawData[column + 12] = vector3D.w;
        };
        Matrix3D.prototype.copyColumnTo = function (column, vector3D) {
            if (column < 0 || column > 3)
                throw new Error("column error");
            var rawData = this.rawData;
            vector3D.x = rawData[column];
            vector3D.y = rawData[column + 4];
            vector3D.z = rawData[column + 8];
            vector3D.w = rawData[column + 12];
        };
        Matrix3D.prototype.copyFrom = function (sourceMatrix3D) {
            this.rawData.set(sourceMatrix3D.rawData);
        };
        Matrix3D.prototype.copyRawDataFrom = function (vector, index, transpose) {
            if (transpose) {
                this.transpose();
            }
            index >>>= 0;
            var len = vector.length - index;
            if (len < 16) {
                throw new Error("Arguments Error");
            }
            else if (len > 16) {
                len = 16;
            }
            var rawData = this.rawData;
            for (var c = 0; c < len; c++) {
                rawData[c] = vector[c + index];
            }
            if (transpose) {
                this.transpose();
            }
        };
        Matrix3D.prototype.copyRawDataTo = function (vector, index, transpose) {
            if (index === void 0) { index = 0; }
            if (transpose === void 0) { transpose = false; }
            if (transpose)
                this.transpose();
            if (index > 0) {
                for (var i = 0; i < index; i++)
                    vector[i] = 0;
            }
            var len = this.rawData.length;
            for (var c = 0; c < len; c++)
                vector[c + index] = this.rawData[c];
            if (transpose)
                this.transpose();
        };
        Matrix3D.prototype.copyRowFrom = function (row, vector3D) {
            if (row < 0 || row > 3) {
                throw Error("row error");
            }
            var rawData = this.rawData;
            row *= 4;
            rawData[row] = vector3D.x;
            rawData[row + 1] = vector3D.y;
            rawData[row + 2] = vector3D.z;
            rawData[row + 3] = vector3D.w;
        };
        Matrix3D.prototype.copyRowTo = function (row, vector3D) {
            if (row < 0 || row > 3) {
                throw Error("row error");
            }
            var rawData = this.rawData;
            row *= 4;
            vector3D.x = rawData[row];
            vector3D.y = rawData[row + 1];
            vector3D.z = rawData[row + 2];
            vector3D.w = rawData[row + 3];
        };
        Matrix3D.prototype.copyToMatrix3D = function (dest) {
            dest.rawData.set(this.rawData);
        };
        Matrix3D.prototype.decompose = function (orientationStyle) {
            if (orientationStyle === void 0) { orientationStyle = 0; }
            var vec = [];
            var m = this.clone();
            var mr = m.rawData;
            var pos = new rf.Vector3D(mr[12], mr[13], mr[14]);
            mr[12] = 0;
            mr[13] = 0;
            mr[14] = 0;
            var sqrt = Math.sqrt;
            var sx = sqrt(mr[0] * mr[0] + mr[1] * mr[1] + mr[2] * mr[2]);
            var sy = sqrt(mr[4] * mr[4] + mr[5] * mr[5] + mr[6] * mr[6]);
            var sz = sqrt(mr[8] * mr[8] + mr[9] * mr[9] + mr[10] * mr[10]);
            if (mr[0] * (mr[5] * mr[10] - mr[6] * mr[9]) - mr[1] * (mr[4] * mr[10] - mr[6] * mr[8]) + mr[2] * (mr[4] * mr[9] - mr[5] * mr[8]) < 0) {
                sz = -sz;
            }
            mr[0] /= sx;
            mr[1] /= sx;
            mr[2] /= sx;
            mr[4] /= sy;
            mr[5] /= sy;
            mr[6] /= sy;
            mr[8] /= sz;
            mr[9] /= sz;
            mr[10] /= sz;
            var rot = new rf.Vector3D();
            switch (orientationStyle) {
                case 1:
                    rot.w = Math.acos((mr[0] + mr[5] + mr[10] - 1) / 2);
                    var len = Math.sqrt((mr[6] - mr[9]) * (mr[6] - mr[9]) + (mr[8] - mr[2]) * (mr[8] - mr[2]) + (mr[1] - mr[4]) * (mr[1] - mr[4]));
                    rot.x = (mr[6] - mr[9]) / len;
                    rot.y = (mr[8] - mr[2]) / len;
                    rot.z = (mr[1] - mr[4]) / len;
                    break;
                case 2:
                    var tr = mr[0] + mr[5] + mr[10];
                    if (tr > 0) {
                        var rw = sqrt(1 + tr) / 2;
                        rot.w = rw;
                        rw *= 4;
                        rot.x = (mr[6] - mr[9]) / rw;
                        rot.y = (mr[8] - mr[2]) / rw;
                        rot.z = (mr[1] - mr[4]) / rw;
                    }
                    else if ((mr[0] > mr[5]) && (mr[0] > mr[10])) {
                        var rx = sqrt(1 + mr[0] - mr[5] - mr[10]) / 2;
                        rot.x = rx;
                        rx *= 4;
                        rot.w = (mr[6] - mr[9]) / rx;
                        rot.y = (mr[1] + mr[4]) / rx;
                        rot.z = (mr[8] + mr[2]) / rx;
                    }
                    else if (mr[5] > mr[10]) {
                        rot.y = sqrt(1 + mr[5] - mr[0] - mr[10]) / 2;
                        rot.x = (mr[1] + mr[4]) / (4 * rot.y);
                        rot.w = (mr[8] - mr[2]) / (4 * rot.y);
                        rot.z = (mr[6] + mr[9]) / (4 * rot.y);
                    }
                    else {
                        rot.z = sqrt(1 + mr[10] - mr[0] - mr[5]) / 2;
                        rot.x = (mr[8] + mr[2]) / (4 * rot.z);
                        rot.y = (mr[6] + mr[9]) / (4 * rot.z);
                        rot.w = (mr[1] - mr[4]) / (4 * rot.z);
                    }
                    break;
                case 0:
                    rot.y = Math.asin(-mr[2]);
                    if (mr[2] != 1 && mr[2] != -1) {
                        rot.x = Math.atan2(mr[6], mr[10]);
                        rot.z = Math.atan2(mr[1], mr[0]);
                    }
                    else {
                        rot.z = 0;
                        rot.x = Math.atan2(mr[4], mr[5]);
                    }
                    break;
            }
            vec.push(pos);
            vec.push(rot);
            vec.push(new rf.Vector3D(sx, sy, sz));
            return vec;
        };
        Matrix3D.prototype.identity = function () {
            this.rawData = new Float32Array([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);
        };
        Matrix3D.interpolate = function (thisMat, toMat, percent) {
            var a = new rf.Quaternion().fromMatrix3D(thisMat);
            var b = new rf.Quaternion().fromMatrix3D(toMat);
            return rf.Quaternion.lerp(a, b, percent).toMatrix3D();
        };
        Matrix3D.prototype.interpolateTo = function (toMat, percent) {
            this.rawData.set(Matrix3D.interpolate(this, toMat, percent).rawData);
        };
        Matrix3D.prototype.invert = function () {
            var d = this.determinant;
            var invertable = Math.abs(d) > 0.00000000001;
            if (invertable) {
                d = 1 / d;
                var rawData = this.rawData;
                var _a = rawData, m11 = _a[0], m12 = _a[1], m13 = _a[2], m14 = _a[3], m21 = _a[4], m22 = _a[5], m23 = _a[6], m24 = _a[7], m31 = _a[8], m32 = _a[9], m33 = _a[10], m34 = _a[11], m41 = _a[12], m42 = _a[13], m43 = _a[14], m44 = _a[15];
                var m12$m23_m22$m13 = m12 * m23 - m22 * m13;
                var m12$m24_m22$m14 = m12 * m24 - m22 * m14;
                var m12$m33_m32$m13 = m12 * m33 - m32 * m13;
                var m12$m34_m32$m14 = m12 * m34 - m32 * m14;
                var m12$m43_m42$m13 = m12 * m43 - m42 * m13;
                var m12$m44_m42$m14 = m12 * m44 - m42 * m14;
                var m13$m24_m23$m14 = m13 * m24 - m23 * m14;
                var m13$m34_m33$m14 = m13 * m34 - m33 * m14;
                var m13$m44_m43$m14 = m13 * m44 - m43 * m14;
                var m22$m33_m32$m23 = m22 * m33 - m32 * m23;
                var m22$m34_m32$m24 = m22 * m34 - m32 * m24;
                var m22$m43_m42$m23 = m22 * m43 - m42 * m23;
                var m22$m44_m42$m24 = m22 * m44 - m42 * m24;
                var m23$m34_m33$m24 = m23 * m34 - m33 * m24;
                var m23$m44_m43$m24 = m23 * m44 - m43 * m24;
                var m32$m43_m42$m33 = m32 * m43 - m42 * m33;
                var m32$m44_m42$m34 = m32 * m44 - m42 * m34;
                var m33$m44_m43$m34 = m33 * m44 - m43 * m34;
                rawData[0] = d * (m22 * (m33$m44_m43$m34) - m32 * (m23$m44_m43$m24) + m42 * (m23$m34_m33$m24));
                rawData[1] = -d * (m12 * (m33$m44_m43$m34) - m32 * (m13$m44_m43$m14) + m42 * (m13$m34_m33$m14));
                rawData[2] = d * (m12 * (m23$m44_m43$m24) - m22 * (m13$m44_m43$m14) + m42 * (m13$m24_m23$m14));
                rawData[3] = -d * (m12 * (m23$m34_m33$m24) - m22 * (m13$m34_m33$m14) + m32 * (m13$m24_m23$m14));
                rawData[4] = -d * (m21 * (m33$m44_m43$m34) - m31 * (m23$m44_m43$m24) + m41 * (m23$m34_m33$m24));
                rawData[5] = d * (m11 * (m33$m44_m43$m34) - m31 * (m13$m44_m43$m14) + m41 * (m13$m34_m33$m14));
                rawData[6] = -d * (m11 * (m23$m44_m43$m24) - m21 * (m13$m44_m43$m14) + m41 * (m13$m24_m23$m14));
                rawData[7] = d * (m11 * (m23$m34_m33$m24) - m21 * (m13$m34_m33$m14) + m31 * (m13$m24_m23$m14));
                rawData[8] = d * (m21 * (m32$m44_m42$m34) - m31 * (m22$m44_m42$m24) + m41 * (m22$m34_m32$m24));
                rawData[9] = -d * (m11 * (m32$m44_m42$m34) - m31 * (m12$m44_m42$m14) + m41 * (m12$m34_m32$m14));
                rawData[10] = d * (m11 * (m22$m44_m42$m24) - m21 * (m12$m44_m42$m14) + m41 * (m12$m24_m22$m14));
                rawData[11] = -d * (m11 * (m22$m34_m32$m24) - m21 * (m12$m34_m32$m14) + m31 * (m12$m24_m22$m14));
                rawData[12] = -d * (m21 * (m32$m43_m42$m33) - m31 * (m22$m43_m42$m23) + m41 * (m22$m33_m32$m23));
                rawData[13] = d * (m11 * (m32$m43_m42$m33) - m31 * (m12$m43_m42$m13) + m41 * (m12$m33_m32$m13));
                rawData[14] = -d * (m11 * (m22$m43_m42$m23) - m21 * (m12$m43_m42$m13) + m41 * (m12$m23_m22$m13));
                rawData[15] = d * (m11 * (m22$m33_m32$m23) - m21 * (m12$m33_m32$m13) + m31 * (m12$m23_m22$m13));
            }
            return invertable;
        };
        Matrix3D.prototype.pointAt = function (pos, at, up) {
            console.log('pointAt not impletement');
        };
        Matrix3D.prototype.recompose = function (components, orientationStyle) {
            if (orientationStyle === void 0) { orientationStyle = 0; }
            if (components.length < 3) {
                return;
            }
            var c0 = components[0], c1 = components[1], c2 = components[2];
            var scale_0_1_2 = c2.x, scale_4_5_6 = c2.y, scale_8_9_10 = c2.z;
            if (scale_0_1_2 == 0 || scale_4_5_6 == 0 || scale_8_9_10 == 0)
                return;
            this.identity();
            var rawData = this.rawData;
            var c0x = c0.x, c0y = c0.y, c0z = c0.z;
            var c1x = c1.x, c1y = c1.y, c1z = c1.z, c1w = c1.w;
            var cos = Math.cos, sin = Math.sin;
            switch (orientationStyle) {
                case 0:
                    {
                        var cx = cos(c1x);
                        var cy = cos(c1y);
                        var cz = cos(c1z);
                        var sx = sin(c1x);
                        var sy = sin(c1y);
                        var sz = sin(c1z);
                        rawData[0] = cy * cz * scale_0_1_2;
                        rawData[1] = cy * sz * scale_0_1_2;
                        rawData[2] = -sy * scale_0_1_2;
                        rawData[3] = 0;
                        rawData[4] = (sx * sy * cz - cx * sz) * scale_4_5_6;
                        rawData[5] = (sx * sy * sz + cx * cz) * scale_4_5_6;
                        rawData[6] = sx * cy * scale_4_5_6;
                        rawData[7] = 0;
                        rawData[8] = (cx * sy * cz + sx * sz) * scale_8_9_10;
                        rawData[9] = (cx * sy * sz - sx * cz) * scale_8_9_10;
                        rawData[10] = cx * cy * scale_8_9_10;
                        rawData[11] = 0;
                        rawData[12] = c0x;
                        rawData[13] = c0y;
                        rawData[14] = c0z;
                        rawData[15] = 1;
                    }
                    break;
                default:
                    {
                        var x = c1x;
                        var y = c1y;
                        var z = c1z;
                        var w = c1w;
                        if (orientationStyle == 1) {
                            var w_2 = w / 2;
                            var sinW_2 = sin(w_2);
                            x *= sinW_2;
                            y *= sinW_2;
                            z *= sinW_2;
                            w = cos(w_2);
                        }
                        ;
                        rawData[0] = (1 - 2 * y * y - 2 * z * z) * scale_0_1_2;
                        rawData[1] = (2 * x * y + 2 * w * z) * scale_0_1_2;
                        rawData[2] = (2 * x * z - 2 * w * y) * scale_0_1_2;
                        rawData[3] = 0;
                        rawData[4] = (2 * x * y - 2 * w * z) * scale_4_5_6;
                        rawData[5] = (1 - 2 * x * x - 2 * z * z) * scale_4_5_6;
                        rawData[6] = (2 * y * z + 2 * w * x) * scale_4_5_6;
                        rawData[7] = 0;
                        rawData[8] = (2 * x * z + 2 * w * y) * scale_8_9_10;
                        rawData[9] = (2 * y * z - 2 * w * x) * scale_8_9_10;
                        rawData[10] = (1 - 2 * x * x - 2 * y * y) * scale_8_9_10;
                        rawData[11] = 0;
                        rawData[12] = c0x;
                        rawData[13] = c0y;
                        rawData[14] = c0z;
                        rawData[15] = 1;
                    }
                    break;
            }
            ;
        };
        Matrix3D.prototype.recompose2 = function (components, orientationStyle) {
            if (orientationStyle === void 0) { orientationStyle = 0; }
            if (components.length < 3)
                return false;
            var pos_tmp = components[0], euler_tmp = components[1], scale_tmp = components[2];
            this.identity();
            this.appendScale(scale_tmp.x, scale_tmp.y, scale_tmp.z);
            this.append(this.getRotateMatrix(rf.Vector3D.X_AXIS, euler_tmp.x));
            this.append(this.getRotateMatrix(rf.Vector3D.Y_AXIS, euler_tmp.y));
            this.append(this.getRotateMatrix(rf.Vector3D.Z_AXIS, euler_tmp.z));
            var rawData = this.rawData;
            rawData[12] = pos_tmp.x;
            rawData[13] = pos_tmp.y;
            rawData[14] = pos_tmp.z;
            rawData[15] = 1;
            return true;
        };
        Matrix3D.prototype.transformVector = function (v) {
            var x = v.x, y = v.y, z = v.z;
            var rawData = this.rawData;
            return new rf.Vector3D(x * rawData[0] + y * rawData[1] + z * rawData[2] + rawData[3], x * rawData[4] + y * rawData[5] + z * rawData[6] + rawData[7], x * rawData[8] + y * rawData[9] + z * rawData[10] + rawData[11], 1);
        };
        Matrix3D.prototype.deltaTransformVector = function (v) {
            var x = v.x, y = v.y, z = v.z;
            var rawData = this.rawData;
            return new rf.Vector3D(x * rawData[0] + y * rawData[1] + z * rawData[2], x * rawData[4] + y * rawData[5] + z * rawData[6], x * rawData[8] + y * rawData[9] + z * rawData[10], 0);
        };
        Matrix3D.prototype.transformVectors = function (vin, vout) {
            var i = 0;
            var v = new rf.Vector3D();
            var v2 = new rf.Vector3D();
            while (i + 3 <= vin.length) {
                v.x = vin[i];
                v.y = vin[i + 1];
                v.z = vin[i + 2];
                v2 = this.transformVector(v);
                vout[i] = v2.x;
                vout[i + 1] = v2.y;
                vout[i + 2] = v2.z;
                i += 3;
            }
        };
        Matrix3D.prototype.transpose = function () {
            var rawData = this.rawData;
            var _a = rawData, a12 = _a[1], a13 = _a[2], a14 = _a[3], a21 = _a[4], a22 = _a[5], a23 = _a[6], a24 = _a[7], a31 = _a[8], a32 = _a[9], a33 = _a[10], a34 = _a[11], a41 = _a[12], a42 = _a[13], a43 = _a[14];
            rawData[1] = a21;
            rawData[2] = a31;
            rawData[3] = a41;
            rawData[4] = a12;
            rawData[6] = a32;
            rawData[7] = a42;
            rawData[8] = a13;
            rawData[9] = a23;
            rawData[11] = a43;
            rawData[12] = a14;
            rawData[13] = a24;
            rawData[14] = a34;
        };
        Matrix3D.prototype.toString = function () {
            var str = "[Matrix3D]\n";
            var rawData = this.rawData;
            for (var i = 0; i < rawData.length; i++) {
                str += rawData[i] + "  , ";
                if (((i + 1) % 4) == 0) {
                    str += "\n";
                }
            }
            return str;
        };
        Matrix3D.prototype.getRotateMatrix = function (axis, radians) {
            var x = axis.x, y = axis.y, z = axis.z;
            var c = Math.cos(radians);
            var s = Math.sin(radians);
            var rMatrix;
            if (x != 0 && y == 0 && z == 0) {
                rMatrix = [
                    1, 0, 0, 0,
                    0, c, -s, 0,
                    0, s, c, 0,
                    0, 0, 0, 1
                ];
            }
            else if (y != 0 && x == 0 && z == 0) {
                rMatrix = [
                    c, 0, s, 0,
                    0, 1, 0, 0,
                    -s, 0, c, 0,
                    0, 0, 0, 1
                ];
            }
            else if (z != 0 && x == 0 && y == 0) {
                rMatrix = [
                    c, -s, 0, 0,
                    s, c, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1,
                ];
            }
            else {
                var lsq = axis.lengthSquared;
                if (Math.abs(lsq - 1) > 0.0001) {
                    var f = 1 / Math.sqrt(lsq);
                    x *= f;
                    y *= f;
                    z *= f;
                }
                var t = 1 - c;
                rMatrix = [
                    x * x * t + c, x * y * t - z * s, x * z * t + y * s, 0,
                    x * y * t + z * s, y * y * t + c, y * z * t - x * s, 0,
                    x * z * t - y * s, y * z * t + x * s, z * z * t + c, 0,
                    0, 0, 0, 1
                ];
            }
            return new Matrix3D(rMatrix);
        };
        return Matrix3D;
    }());
    rf.Matrix3D = Matrix3D;
})(rf || (rf = {}));
var rf;
(function (rf) {
    function hexToCSS(d, a) {
        if (a === void 0) { a = 1; }
        var r = (d & 0x00ff0000) >>> 16;
        var g = (d & 0x0000ff00) >>> 8;
        var b = d & 0x000000ff;
        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    }
    rf.hexToCSS = hexToCSS;
    function toRGB(color, out) {
        out.r = ((color & 0x00ff0000) >>> 16) / 0xFF;
        out.g = ((color & 0x0000ff00) >>> 8) / 0xFF;
        out.b = (color & 0x000000ff) / 0xFF;
    }
    rf.toRGB = toRGB;
    function toCSS(color) {
        return "rgba(" + color.r * 0xFF + "," + color.g * 0xFF + "," + color.b * 0xFF + "," + color.a * 0xFF + ")";
    }
    rf.toCSS = toCSS;
    var Point = (function () {
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
    var Rect = (function (_super) {
        __extends(Rect, _super);
        function Rect(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            var _this = _super.call(this, x, y) || this;
            _this.width = 0;
            _this.height = 0;
            _this.width = width;
            _this.height = height;
            return _this;
        }
        Rect.prototype.clone = function () {
            return new Rect(this.x, this.y, this.width, this.height);
        };
        return Rect;
    }(Point));
    rf.Rect = Rect;
    rf.RADIANS_TO_DEGREES = 180 / Math.PI;
    rf.DEGREES_TO_RADIANS = Math.PI / 180;
    rf.tempAxeX = new rf.Vector3D();
    rf.tempAxeY = new rf.Vector3D();
    rf.tempAxeZ = new rf.Vector3D();
    rf.PI2 = Math.PI * 2;
    rf.RAW_DATA_CONTAINER = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
    rf.CALCULATION_MATRIX = new rf.Matrix3D();
    rf.CALCULATION_VECTOR3D = new rf.Vector3D();
    rf.CALCULATION_DECOMPOSE = [new rf.Vector3D(), new rf.Vector3D(), new rf.Vector3D()];
    rf.Location = {
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
    function m2dTransform(matrix, p, out) {
        var _a = matrix, m11 = _a.m11, m12 = _a.m12, m13 = _a.m13, m21 = _a.m21, m22 = _a.m22, m23 = _a.m23, m31 = _a.m31, m32 = _a.m32, m33 = _a.m33;
        var x = p.x, y = p.y;
        var dx = x * m11 + y * m21 + m31;
        var dy = x * m12 + y * m22 + m32;
        out.x = dx;
        out.y = dy;
    }
    rf.m2dTransform = m2dTransform;
    var Float32Byte = (function () {
        function Float32Byte(array) {
            if (undefined == array) {
                array = new Float32Array(0);
            }
            this.array = array;
        }
        Object.defineProperty(Float32Byte.prototype, "length", {
            get: function () {
                return this.array.length;
            },
            set: function (value) {
                if (this.array.length == value) {
                    return;
                }
                var nd = new Float32Array(value);
                var len = value < this.array.length ? value : this.array.length;
                if (len != 0) {
                    nd.set(this.array);
                }
                this.array = nd;
            },
            enumerable: true,
            configurable: true
        });
        Float32Byte.prototype.append = function (byte, offset, len) {
            if (offset === void 0) { offset = 0; }
            if (len === void 0) { len = -1; }
            var position = 0;
            if (0 > offset) {
                offset = 0;
            }
            if (-1 == len) {
                len = byte.length - offset;
            }
            else {
                if (len > byte.length - offset) {
                    len = byte.length - offset;
                }
            }
            position = this.array.length;
            length = this.array.length + byte.length;
            if (len == byte.length) {
                this.array.set(byte.array, position);
            }
            else {
                this.array.set(byte.array.slice(offset, len), position);
            }
        };
        Float32Byte.prototype.set = function (position, byte, offset, len) {
            if (offset === void 0) { offset = 0; }
            if (len === void 0) { len = -1; }
            if (0 > offset) {
                offset = 0;
            }
            if (-1 == len) {
                len = byte.length - offset;
            }
            else {
                if (len > byte.length - offset) {
                    len = byte.length - offset;
                }
            }
            if (len == byte.length) {
                this.array.set(byte.array, position);
            }
            else {
                this.array.set(byte.array.slice(offset, len), position);
            }
        };
        Float32Byte.prototype.wPoint1 = function (position, x, y, z, w) {
            this.array[position] = x;
        };
        Float32Byte.prototype.wPoint2 = function (position, x, y, z, w) {
            this.array[position] = x;
            this.array[position + 1] = y;
        };
        Float32Byte.prototype.wPoint3 = function (position, x, y, z, w) {
            this.array[position] = x;
            this.array[position + 1] = y;
            this.array[position + 2] = z;
        };
        Float32Byte.prototype.wPoint4 = function (position, x, y, z, w) {
            this.array[position] = x;
            this.array[position + 1] = y;
            this.array[position + 2] = z;
            this.array[position + 3] = w;
        };
        Float32Byte.prototype.wUIPoint = function (position, x, y, z, u, v, index, r, g, b, a) {
            this.array[position] = x;
            this.array[position + 1] = y;
            this.array[position + 2] = z;
            this.array[position + 3] = u;
            this.array[position + 4] = v;
            this.array[position + 5] = index;
            this.array[position + 6] = r;
            this.array[position + 7] = g;
            this.array[position + 8] = b;
            this.array[position + 9] = a;
        };
        Float32Byte.prototype.update = function (data32PerVertex, offset, v) {
            var len = this.array.length;
            for (var i = 0; i < len; i += data32PerVertex) {
                this.array[i + offset] = v;
            }
        };
        return Float32Byte;
    }());
    rf.Float32Byte = Float32Byte;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var Endian = (function () {
        function Endian() {
        }
        Endian.LITTLE_ENDIAN = true;
        Endian.BIG_ENDIAN = false;
        return Endian;
    }());
    rf.Endian = Endian;
    var ByteArray = (function () {
        function ByteArray(buffer, bufferExtSize) {
            if (bufferExtSize === void 0) { bufferExtSize = 0; }
            this.bufferExtSize = 0;
            this.endian = true;
            this.EOF_byte = -1;
            this.EOF_code_point = -1;
            if (bufferExtSize < 0) {
                bufferExtSize = 0;
            }
            this.bufferExtSize = bufferExtSize;
            var bytes, wpos = 0;
            if (buffer) {
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
            get: function () {
                return this.data;
            },
            set: function (value) {
                this.buffer = value.buffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "bufferOffset", {
            get: function () {
                return this.data.byteOffset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "position", {
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
            get: function () {
                return this.data.byteLength - this._position;
            },
            enumerable: true,
            configurable: true
        });
        ByteArray.prototype.clear = function () {
            var buffer = new ArrayBuffer(this.bufferExtSize);
            this.data = new DataView(buffer);
            this._bytes = new Uint8Array(buffer);
            this._position = 0;
            this.write_position = 0;
        };
        ByteArray.prototype.readBoolean = function () {
            if (this.validate(1))
                return !!this._bytes[this.position++];
        };
        ByteArray.prototype.readByte = function () {
            if (this.validate(1))
                return this.data.getInt8(this.position++);
        };
        ByteArray.prototype.readBytes = function (bytes, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            if (!bytes) {
                return;
            }
            var pos = this._position;
            var available = this.write_position - pos;
            if (available < 0) {
                return;
            }
            if (length == 0) {
                length = available;
            }
            else if (length > available) {
                return;
            }
            var position = bytes._position;
            bytes._position = 0;
            bytes.validateBuffer(offset + length);
            bytes._position = position;
            bytes._bytes.set(this._bytes.subarray(pos, pos + length), offset);
            this.position += length;
        };
        ByteArray.prototype.readDouble = function () {
            if (this.validate(8)) {
                var value = this.data.getFloat64(this._position, this.endian);
                this.position += 8;
                return value;
            }
        };
        ByteArray.prototype.readFloat = function () {
            if (this.validate(4)) {
                var value = this.data.getFloat32(this._position, this.endian);
                this.position += 4;
                return value;
            }
        };
        ByteArray.prototype.readInt = function () {
            if (this.validate(4)) {
                var value = this.data.getInt32(this._position, this.endian);
                this.position += 4;
                return value;
            }
        };
        ByteArray.prototype.readShort = function () {
            if (this.validate(2)) {
                var value = this.data.getInt16(this._position, this.endian);
                this.position += 2;
                return value;
            }
        };
        ByteArray.prototype.readUnsignedByte = function () {
            if (this.validate(1))
                return this._bytes[this.position++];
        };
        ByteArray.prototype.readUnsignedInt = function () {
            if (this.validate(4)) {
                var value = this.data.getUint32(this._position, this.endian);
                this.position += 4;
                return value;
            }
        };
        ByteArray.prototype.readUnsignedShort = function () {
            if (this.validate(2)) {
                var value = this.data.getUint16(this._position, this.endian);
                this.position += 2;
                return value;
            }
        };
        ByteArray.prototype.readUTF = function () {
            var length = this.readUnsignedShort();
            if (length > 0) {
                return this.readUTFBytes(length);
            }
            else {
                return "";
            }
        };
        ByteArray.prototype.readUTFBytes = function (length) {
            if (!this.validate(length)) {
                return;
            }
            var data = this.data;
            var bytes = new Uint8Array(data.buffer, data.byteOffset + this._position, length);
            this.position += length;
            return this.decodeUTF8(bytes);
        };
        ByteArray.prototype.writeBoolean = function (value) {
            this.validateBuffer(1);
            this._bytes[this.position++] = +value;
        };
        ByteArray.prototype.writeByte = function (value) {
            this.validateBuffer(1);
            this._bytes[this.position++] = value & 0xff;
        };
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
        ByteArray.prototype.writeDouble = function (value) {
            this.validateBuffer(8);
            this.data.setFloat64(this._position, value, this.endian);
            this.position += 8;
        };
        ByteArray.prototype.writeFloat = function (value) {
            this.validateBuffer(4);
            this.data.setFloat32(this._position, value, this.endian);
            this.position += 4;
        };
        ByteArray.prototype.writeInt = function (value) {
            this.validateBuffer(4);
            this.data.setInt32(this._position, value, this.endian);
            this.position += 4;
        };
        ByteArray.prototype.writeShort = function (value) {
            this.validateBuffer(2);
            this.data.setInt16(this._position, value, this.endian);
            this.position += 2;
        };
        ByteArray.prototype.writeUnsignedInt = function (value) {
            this.validateBuffer(4);
            this.data.setUint32(this._position, value, this.endian);
            this.position += 4;
        };
        ByteArray.prototype.writeUnsignedShort = function (value) {
            this.validateBuffer(2);
            this.data.setUint16(this._position, value, this.endian);
            this.position += 2;
        };
        ByteArray.prototype.writeUTF = function (value) {
            var utf8bytes = this.encodeUTF8(value);
            var length = utf8bytes.length;
            this.validateBuffer(2 + length);
            this.data.setUint16(this._position, length, this.endian);
            this.position += 2;
            this._writeUint8Array(utf8bytes, false);
        };
        ByteArray.prototype.writeUTFBytes = function (value) {
            this._writeUint8Array(this.encodeUTF8(value));
        };
        ByteArray.prototype.toString = function () {
            return "[ByteArray] length:" + this.length + ", bytesAvailable:" + this.bytesAvailable;
        };
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
        ByteArray.prototype.validate = function (len) {
            var bl = this._bytes.length;
            if (bl > 0 && this._position + len <= bl) {
                return true;
            }
            else {
            }
        };
        ByteArray.prototype.validateBuffer = function (len) {
            this.write_position = len > this.write_position ? len : this.write_position;
            len += this._position;
            this._validateBuffer(len);
        };
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
        ByteArray.prototype.encoderError = function (code_point) {
        };
        ByteArray.prototype.decoderError = function (fatal, opt_code_point) {
            if (fatal) {
            }
            return opt_code_point || 0xFFFD;
        };
        ByteArray.prototype.inRange = function (a, min, max) {
            return min <= a && a <= max;
        };
        ByteArray.prototype.div = function (n, d) {
            return Math.floor(n / d);
        };
        ByteArray.prototype.stringToCodePoints = function (string) {
            var cps = [];
            var i = 0, n = string.length;
            while (i < string.length) {
                var c = string.charCodeAt(i);
                if (!this.inRange(c, 0xD800, 0xDFFF)) {
                    cps.push(c);
                }
                else if (this.inRange(c, 0xDC00, 0xDFFF)) {
                    cps.push(0xFFFD);
                }
                else {
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
        ByteArray.prototype.replaceBuffer = function (value) {
            this.write_position = value.byteLength;
            this._bytes = new Uint8Array(value);
            this.data = new DataView(value);
        };
        ByteArray.prototype.readBuffer = function (length) {
            if (!this.validate(length))
                return;
            var start = this.position;
            this.position += length;
            return this.buffer.slice(start, this.position);
        };
        ByteArray.prototype.readInt64 = function () {
            if (this.validate(8)) {
                var low = void 0, high = void 0;
                var flag = this.endian == Endian.LITTLE_ENDIAN;
                var data = this.data;
                var pos = this._position;
                if (flag) {
                    low = data.getUint32(pos, flag);
                    high = data.getUint32(pos + 4, flag);
                }
                else {
                    high = data.getUint32(pos, flag);
                    low = data.getUint32(pos + 4, flag);
                }
                this.position = pos + 8;
                return Int64.toNumber(low, high);
            }
        };
        ByteArray.prototype.writeInt64 = function (value) {
            this.validateBuffer(8);
            var i64 = Int64.fromNumber(value);
            var high = i64.high, low = i64.low;
            var flag = this.endian == Endian.LITTLE_ENDIAN;
            var data = this.data;
            var pos = this._position;
            if (flag) {
                data.setUint32(pos, low, flag);
                data.setUint32(pos + 4, high, flag);
            }
            else {
                data.setUint32(pos, high, flag);
                data.setUint32(pos + 4, low, flag);
            }
            this.position = pos + 8;
        };
        ByteArray.prototype.readPBDouble = function () {
            if (this.validate(8)) {
                var value = this.data.getFloat64(this._position, true);
                this.position += 8;
                return value;
            }
        };
        ByteArray.prototype.writePBDouble = function (value) {
            this.validateBuffer(8);
            this.data.setFloat64(this._position, value, true);
            this.position += 8;
        };
        ByteArray.prototype.readPBFloat = function () {
            if (this.validate(4)) {
                var value = this.data.getFloat32(this._position, true);
                this.position += 4;
                return value;
            }
        };
        ByteArray.prototype.writePBFloat = function (value) {
            this.validateBuffer(4);
            this.data.setFloat32(this._position, value, true);
            this.position += 4;
        };
        ByteArray.prototype.readFix32 = function () {
            if (this.validate(4)) {
                var value = this.data.getUint32(this._position, true);
                this.position += 4;
                return value;
            }
        };
        ByteArray.prototype.writeFix32 = function (value) {
            this.validateBuffer(4);
            this.data.setUint32(this._position, value, true);
            this.position += 4;
        };
        ByteArray.prototype.readSFix32 = function () {
            if (this.validate(4)) {
                var value = this.data.getInt32(this._position, true);
                this.position += 4;
                return value;
            }
        };
        ByteArray.prototype.writeSFix32 = function (value) {
            this.validateBuffer(4);
            this.data.setInt32(this._position, value, true);
            this.position += 4;
        };
        ByteArray.prototype.readFix64 = function () {
            if (this.validate(8)) {
                var pos = this._position;
                var data = this.data;
                var low = data.getUint32(pos, true);
                var high = data.getUint32(pos + 4, true);
                this.position = pos + 8;
                return Int64.toNumber(low, high);
            }
        };
        ByteArray.prototype.writeFix64 = function (value) {
            var i64 = Int64.fromNumber(value);
            this.validateBuffer(8);
            var pos = this._position;
            var data = this.data;
            data.setUint32(pos, i64.low, true);
            data.setUint32(pos + 4, i64.high, true);
            this.position = pos + 8;
        };
        ByteArray.prototype.readByteArray = function (length, ext) {
            if (ext === void 0) { ext = 0; }
            var ba = new ByteArray(this.readBuffer(length), ext);
            ba.endian = this.endian;
            return ba;
        };
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
            get: function () {
                return new Uint8Array(this._bytes.buffer, 0, this.write_position);
            },
            enumerable: true,
            configurable: true
        });
        ByteArray.prototype.reset = function () {
            this.write_position = this.position = 0;
        };
        return ByteArray;
    }());
    rf.ByteArray = ByteArray;
    var Int64 = (function () {
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
    var _2_16 = 1 << 16;
    var _2_32 = _2_16 * _2_16;
    var _2_64 = _2_32 * _2_32;
    var _2_63 = _2_64 / 2;
    var ZERO = new Int64();
    var MAX_VALUE = new Int64(-1, 0x7FFFFFFF);
    var MIN_VALUE = new Int64(0, -2147483648);
    var ONE = new Int64(1);
})(rf || (rf = {}));
var rf;
(function (rf) {
    var BitmapData = (function () {
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
        BitmapData.prototype.draw = function (source) {
            if (source instanceof BitmapData)
                this.context.drawImage(source.canvas, 0, 0);
            else
                this.context.drawImage(source, 0, 0);
        };
        BitmapData.prototype.fillRect = function (x, y, width, height, css) {
            this.context.fillStyle = css;
            this.context.fillRect(x, y, width, height);
        };
        return BitmapData;
    }());
    rf.BitmapData = BitmapData;
    var MaxRectsBinPack = (function () {
        function MaxRectsBinPack(width, height, rotations) {
            if (rotations === void 0) { rotations = false; }
            this.binWidth = 0;
            this.binHeight = 0;
            this.allowRotations = false;
            this.usedRects = [];
            this.freeRects = [];
            this.score1 = 0;
            this.score2 = 0;
            this.binWidth = width;
            this.binHeight = height;
            this.allowRotations = rotations;
            var n = new rf.Rect();
            n.x = 0;
            n.y = 0;
            n.width = width;
            n.height = height;
            this.usedRects.length = 0;
            this.freeRects.length = 0;
            this.freeRects.push(n);
        }
        MaxRectsBinPack.prototype.count = function (n) {
            if (n >= 2)
                return this.count(n / 2);
            return n;
        };
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
            if (newNode.height == 0)
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
                    var newNode = this.scoreRect(Rects[i].width, Rects[i].height, method, score1, score2);
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
                    score1 = -score1;
                    break;
                case MaxRectsBinPack.BESTLONGSIDEFIT:
                    newNode = this.findPositionForNewNodeBestLongSideFit(width, height, score2, score1);
                    break;
                case MaxRectsBinPack.BESTAREAFIT:
                    newNode = this.findPositionForNewNodeBestAreaFit(width, height, score1, score2);
                    break;
            }
            if (newNode.height == 0) {
                score1 = Infinity;
                score2 = Infinity;
            }
            return newNode;
        };
        MaxRectsBinPack.prototype.occupancy = function () {
            var usedSurfaceArea = 0;
            for (var i = 0; i < this.usedRects.length; i++)
                usedSurfaceArea += this.usedRects[i].width * this.usedRects[i].height;
            return usedSurfaceArea / (this.binWidth * this.binHeight);
        };
        MaxRectsBinPack.prototype.findPositionForNewNodeBottomLeft = function (width, height, bestY, bestX) {
            var bestNode = new rf.Rect();
            bestY = Infinity;
            var rect;
            var topSideY;
            for (var i = 0; i < this.freeRects.length; i++) {
                rect = this.freeRects[i];
                if (rect.width >= width && rect.height >= height) {
                    topSideY = rect.y + height;
                    if (topSideY < bestY || (topSideY == bestY && rect.x < bestX)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = width;
                        bestNode.height = height;
                        bestY = topSideY;
                        bestX = rect.x;
                    }
                }
                if (this.allowRotations && rect.width >= height && rect.height >= width) {
                    topSideY = rect.y + width;
                    if (topSideY < bestY || (topSideY == bestY && rect.x < bestX)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = height;
                        bestNode.height = width;
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
                bestShortSideFit = Infinity;
            this.bestLongSideFit = this.score2;
            var rect;
            var leftoverHoriz;
            var leftoverVert;
            var shortSideFit;
            var longSideFit;
            for (var i = 0; i < this.freeRects.length; i++) {
                rect = this.freeRects[i];
                if (rect.width >= width && rect.height >= height) {
                    leftoverHoriz = Math.abs(rect.width - width);
                    leftoverVert = Math.abs(rect.height - height);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    longSideFit = Math.max(leftoverHoriz, leftoverVert);
                    if (shortSideFit < this.bestShortSideFit || (shortSideFit == this.bestShortSideFit && longSideFit < this.bestLongSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = width;
                        bestNode.height = height;
                        this.bestShortSideFit = shortSideFit;
                        this.bestLongSideFit = longSideFit;
                    }
                }
                var flippedLeftoverHoriz;
                var flippedLeftoverVert;
                var flippedShortSideFit;
                var flippedLongSideFit;
                if (this.allowRotations && rect.width >= height && rect.height >= width) {
                    flippedLeftoverHoriz = Math.abs(rect.width - height);
                    flippedLeftoverVert = Math.abs(rect.height - width);
                    flippedShortSideFit = Math.min(flippedLeftoverHoriz, flippedLeftoverVert);
                    flippedLongSideFit = Math.max(flippedLeftoverHoriz, flippedLeftoverVert);
                    if (flippedShortSideFit < this.bestShortSideFit || (flippedShortSideFit == this.bestShortSideFit && flippedLongSideFit < this.bestLongSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = height;
                        bestNode.height = width;
                        this.bestShortSideFit = flippedShortSideFit;
                        this.bestLongSideFit = flippedLongSideFit;
                    }
                }
            }
            return bestNode;
        };
        MaxRectsBinPack.prototype.findPositionForNewNodeBestLongSideFit = function (width, height, bestShortSideFit, bestLongSideFit) {
            var bestNode = new rf.Rect();
            bestLongSideFit = Infinity;
            var rect;
            var leftoverHoriz;
            var leftoverVert;
            var shortSideFit;
            var longSideFit;
            for (var i = 0; i < this.freeRects.length; i++) {
                rect = this.freeRects[i];
                if (rect.width >= width && rect.height >= height) {
                    leftoverHoriz = Math.abs(rect.width - width);
                    leftoverVert = Math.abs(rect.height - height);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    longSideFit = Math.max(leftoverHoriz, leftoverVert);
                    if (longSideFit < bestLongSideFit || (longSideFit == bestLongSideFit && shortSideFit < bestShortSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = width;
                        bestNode.height = height;
                        bestShortSideFit = shortSideFit;
                        bestLongSideFit = longSideFit;
                    }
                }
                if (this.allowRotations && rect.width >= height && rect.height >= width) {
                    leftoverHoriz = Math.abs(rect.width - height);
                    leftoverVert = Math.abs(rect.height - width);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    longSideFit = Math.max(leftoverHoriz, leftoverVert);
                    if (longSideFit < bestLongSideFit || (longSideFit == bestLongSideFit && shortSideFit < bestShortSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = height;
                        bestNode.height = width;
                        bestShortSideFit = shortSideFit;
                        bestLongSideFit = longSideFit;
                    }
                }
            }
            return bestNode;
        };
        MaxRectsBinPack.prototype.findPositionForNewNodeBestAreaFit = function (width, height, bestAreaFit, bestShortSideFit) {
            var bestNode = new rf.Rect();
            bestAreaFit = Infinity;
            var rect;
            var leftoverHoriz;
            var leftoverVert;
            var shortSideFit;
            var areaFit;
            for (var i = 0; i < this.freeRects.length; i++) {
                rect = this.freeRects[i];
                areaFit = rect.width * rect.height - width * height;
                if (rect.width >= width && rect.height >= height) {
                    leftoverHoriz = Math.abs(rect.width - width);
                    leftoverVert = Math.abs(rect.height - height);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    if (areaFit < bestAreaFit || (areaFit == bestAreaFit && shortSideFit < bestShortSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = width;
                        bestNode.height = height;
                        bestShortSideFit = shortSideFit;
                        bestAreaFit = areaFit;
                    }
                }
                if (this.allowRotations && rect.width >= height && rect.height >= width) {
                    leftoverHoriz = Math.abs(rect.width - height);
                    leftoverVert = Math.abs(rect.height - width);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    if (areaFit < bestAreaFit || (areaFit == bestAreaFit && shortSideFit < bestShortSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = height;
                        bestNode.height = width;
                        bestShortSideFit = shortSideFit;
                        bestAreaFit = areaFit;
                    }
                }
            }
            return bestNode;
        };
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
                if (rect.x == x + width || rect.x + rect.width == x)
                    score += this.commonIntervalLength(rect.y, rect.y + rect.height, y, y + height);
                if (rect.y == y + height || rect.y + rect.height == y)
                    score += this.commonIntervalLength(rect.x, rect.x + rect.width, x, x + width);
            }
            return score;
        };
        MaxRectsBinPack.prototype.findPositionForNewNodeContactPoint = function (width, height, bestContactScore) {
            var bestNode = new rf.Rect();
            bestContactScore = -1;
            var rect;
            var score;
            for (var i = 0; i < this.freeRects.length; i++) {
                rect = this.freeRects[i];
                if (rect.width >= width && rect.height >= height) {
                    score = this.contactPointScoreNode(rect.x, rect.y, width, height);
                    if (score > bestContactScore) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = width;
                        bestNode.height = height;
                        bestContactScore = score;
                    }
                }
                if (this.allowRotations && rect.width >= height && rect.height >= width) {
                    score = this.contactPointScoreNode(rect.x, rect.y, height, width);
                    if (score > bestContactScore) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = height;
                        bestNode.height = width;
                        bestContactScore = score;
                    }
                }
            }
            return bestNode;
        };
        MaxRectsBinPack.prototype.splitFreeNode = function (freeNode, usedNode) {
            if (usedNode.x >= freeNode.x + freeNode.width || usedNode.x + usedNode.width <= freeNode.x ||
                usedNode.y >= freeNode.y + freeNode.height || usedNode.y + usedNode.height <= freeNode.y)
                return false;
            var newNode;
            if (usedNode.x < freeNode.x + freeNode.width && usedNode.x + usedNode.width > freeNode.x) {
                if (usedNode.y > freeNode.y && usedNode.y < freeNode.y + freeNode.height) {
                    newNode = freeNode.clone();
                    newNode.height = usedNode.y - newNode.y;
                    this.freeRects.push(newNode);
                }
                if (usedNode.y + usedNode.height < freeNode.y + freeNode.height) {
                    newNode = freeNode.clone();
                    newNode.y = usedNode.y + usedNode.height;
                    newNode.height = freeNode.y + freeNode.height - (usedNode.y + usedNode.height);
                    this.freeRects.push(newNode);
                }
            }
            if (usedNode.y < freeNode.y + freeNode.height && usedNode.y + usedNode.height > freeNode.y) {
                if (usedNode.x > freeNode.x && usedNode.x < freeNode.x + freeNode.width) {
                    newNode = freeNode.clone();
                    newNode.width = usedNode.x - newNode.x;
                    this.freeRects.push(newNode);
                }
                if (usedNode.x + usedNode.width < freeNode.x + freeNode.width) {
                    newNode = freeNode.clone();
                    newNode.x = usedNode.x + usedNode.width;
                    newNode.width = freeNode.x + freeNode.width - (usedNode.x + usedNode.width);
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
                && a.x + a.width <= b.x + b.width
                && a.y + a.height <= b.y + b.height;
        };
        MaxRectsBinPack.BESTSHORTSIDEFIT = 0;
        MaxRectsBinPack.BESTLONGSIDEFIT = 1;
        MaxRectsBinPack.BESTAREAFIT = 2;
        MaxRectsBinPack.BOTTOMLEFTRULE = 3;
        MaxRectsBinPack.CONTACTPOINTRULE = 4;
        return MaxRectsBinPack;
    }());
    rf.MaxRectsBinPack = MaxRectsBinPack;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var ClassFactory = (function () {
        function ClassFactory(creator, props) {
            this._creator = creator;
            if (props != undefined)
                this._props = props;
        }
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
    var RecyclablePool = (function () {
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
        RecyclablePool.prototype.recycle = function (t) {
            var pool = this._pool;
            var idx = pool.indexOf(t);
            if (!~idx) {
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
        var pool = clazz._pool;
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
    function singleton(clazz) {
        var instance = clazz._instance;
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
var rf;
(function (rf) {
    var LinkVO = (function () {
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
    var Link = (function () {
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
                if (vo)
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
                if (vo) {
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
            length = 0;
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
                        this.last = vo;
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
                    length++;
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
            length = 0;
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
var rf;
(function (rf) {
    var EventT;
    (function (EventT) {
        EventT[EventT["ENTER_FRAME"] = 0] = "ENTER_FRAME";
        EventT[EventT["RESIZE"] = 1] = "RESIZE";
        EventT[EventT["COMPLETE"] = 2] = "COMPLETE";
        EventT[EventT["FAIL"] = 3] = "FAIL";
        EventT[EventT["CONTEXT3D_CREATE"] = 4] = "CONTEXT3D_CREATE";
        EventT[EventT["CHANGE"] = 5] = "CHANGE";
        EventT[EventT["CANCEL"] = 6] = "CANCEL";
        EventT[EventT["SCROLL"] = 7] = "SCROLL";
        EventT[EventT["OPEN"] = 8] = "OPEN";
        EventT[EventT["CLOSE"] = 9] = "CLOSE";
        EventT[EventT["SELECT"] = 10] = "SELECT";
        EventT[EventT["DISPOSE"] = 11] = "DISPOSE";
        EventT[EventT["DATA"] = 12] = "DATA";
        EventT[EventT["ERROR"] = 13] = "ERROR";
        EventT[EventT["PROGRESS"] = 14] = "PROGRESS";
        EventT[EventT["IO_ERROR"] = 15] = "IO_ERROR";
        EventT[EventT["MESSAGE"] = 16] = "MESSAGE";
        EventT[EventT["RECYCLE"] = 17] = "RECYCLE";
    })(EventT = rf.EventT || (rf.EventT = {}));
    var MouseEventX;
    (function (MouseEventX) {
        MouseEventX["MouseDown"] = "mousedown";
        MouseEventX["MouseUp"] = "mouseup";
        MouseEventX["MouseWheel"] = "mousewheel";
        MouseEventX[MouseEventX["MouseMove"] = 50] = "MouseMove";
        MouseEventX[MouseEventX["CLICK"] = 51] = "CLICK";
    })(MouseEventX = rf.MouseEventX || (rf.MouseEventX = {}));
    var EventX = (function () {
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
    var MiniDispatcher = (function () {
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
        MiniDispatcher.prototype.off = function (type, listener) {
            if (undefined == this.mEventListeners) {
                var signal = this.mEventListeners[type];
                if (undefined == signal)
                    return;
                signal.remove(listener);
                if (0 >= signal.length) {
                    signal.recycle();
                }
            }
        };
        MiniDispatcher.prototype.removeEventListeners = function (type) {
            if (type === void 0) { type = undefined; }
            var signal;
            if (type && this.mEventListeners) {
                signal = this.mEventListeners[type];
                if (undefined != signal) {
                    signal.recycle();
                }
                delete this.mEventListeners[type];
            }
            else if (this.mEventListeners) {
                for (type in this.mEventListeners) {
                    signal = this.mEventListeners[type];
                    if (undefined != signal) {
                        signal.recycle();
                    }
                }
                this.mEventListeners = undefined;
            }
        };
        MiniDispatcher.prototype.dispatchEvent = function (event) {
            if (undefined == this.mEventListeners || false == (event.type in this.mEventListeners)) {
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
                    }
                }
                vo = vo.next;
            }
            return false == event.stopPropagation;
        };
        MiniDispatcher.prototype.simpleDispatch = function (type, data, bubbles) {
            if (data === void 0) { data = undefined; }
            if (bubbles === void 0) { bubbles = false; }
            if (!bubbles && (undefined == this.mEventListeners || false == (type in this.mEventListeners))) {
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
var rf;
(function (rf) {
    var EngineEvent = (function () {
        function EngineEvent() {
        }
        EngineEvent.VISIBILITY_CHANGE = 'visibility_change';
        EngineEvent.FPS_CHANGE = 'FPS_CHANGE';
        return EngineEvent;
    }());
    rf.EngineEvent = EngineEvent;
    rf.nextUpdateTime = 0;
    rf.frameInterval = 0;
    rf.engineNow = 0;
    rf.getT = window.performance ? performance.now.bind(performance) : Date.now;
    var Engine = (function () {
        function Engine() {
        }
        Engine.start = function () {
            Engine.startTime = rf.getT();
            rf.engineNow = 0;
            Engine.frameRate = Engine._frameRate;
            rf.nextUpdateTime = Engine.startTime + rf.frameInterval;
            Engine._nextProfileTime = Engine.startTime + 1000;
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
                rf.nextUpdateTime += rf.frameInterval;
                rf.engineNow = now;
                Engine.update(now, interval);
                Engine.profile();
            }
            animationRequest(onAnimationChange);
            window.onresize = function () {
                rf.isWindowResized = true;
            };
            rf.stageWidth = window.innerWidth;
            rf.stageHeight = window.innerHeight;
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
                Engine.dispatcher.simpleDispatch(EngineEvent.VISIBILITY_CHANGE, hidden);
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
            var vo = Engine.resizeLink.getFrist();
            while (vo) {
                var next = vo.next;
                if (false == vo.close) {
                    var value = vo.data;
                    value.resize(width, height);
                }
                vo = next;
            }
            Engine.dispatcher.simpleDispatch(rf.EventT.RESIZE);
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
                rf.stageWidth = window.innerWidth;
                rf.stageHeight = window.innerHeight;
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
            Engine.dispatcher.simpleDispatch(rf.EventT.ENTER_FRAME);
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
                Engine.dispatcher.simpleDispatch(EngineEvent.FPS_CHANGE);
            }
        };
        Engine.dispatcher = new rf.MiniDispatcher();
        Engine.startTime = 0;
        Engine.interval = 0;
        Engine.hidden = false;
        Engine.hiddenTime = 0;
        Engine.fps = 0;
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
    var TimerEventX = (function (_super) {
        __extends(TimerEventX, _super);
        function TimerEventX() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TimerEventX.TIMER = 'timer';
        TimerEventX.TIMER_COMPLETE = 'timerComplete';
        return TimerEventX;
    }(rf.EventX));
    rf.TimerEventX = TimerEventX;
    var Timer = (function (_super) {
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
    var GTimer = (function () {
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
    var GTimerCallLater = (function (_super) {
        __extends(GTimerCallLater, _super);
        function GTimerCallLater() {
            return _super.call(this, 10) || this;
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
    var TimerUtil = (function () {
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
    var HttpResponseType;
    (function (HttpResponseType) {
        HttpResponseType[HttpResponseType["TEXT"] = 0] = "TEXT";
        HttpResponseType[HttpResponseType["ARRAY_BUFFER"] = 1] = "ARRAY_BUFFER";
    })(HttpResponseType = rf.HttpResponseType || (rf.HttpResponseType = {}));
    var HttpMethod;
    (function (HttpMethod) {
        HttpMethod[HttpMethod["GET"] = 0] = "GET";
        HttpMethod[HttpMethod["POST"] = 1] = "POST";
    })(HttpMethod = rf.HttpMethod || (rf.HttpMethod = {}));
    var HttpRequest = (function (_super) {
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
                if (this._responseType == HttpResponseType.TEXT) {
                    return this._xhr.responseText;
                }
                if (this._responseType == HttpResponseType.ARRAY_BUFFER && /msie 9.0/i.test(navigator.userAgent)) {
                    var w = window;
                    return w["convertResponseBodyToText"](this._xhr["responseBody"]);
                }
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
            if (method === void 0) { method = HttpMethod.GET; }
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
                        if (true && !_this.hasEventListener(rf.EventT.IO_ERROR)) {
                            rf.ThrowError("http request error: " + url_1);
                        }
                        _this.simpleDispatch(rf.EventT.IO_ERROR);
                    }
                    else {
                        _this.simpleDispatch(rf.EventT.COMPLETE);
                    }
                }, 0);
            }
        };
        HttpRequest.prototype.updateProgress = function (event) {
            if (event.lengthComputable) {
                this.simpleDispatch(rf.EventT.PROGRESS, [event.loaded, event.total]);
            }
        };
        HttpRequest.prototype.send = function (data) {
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
        };
        HttpRequest.prototype.abort = function () {
            if (this._xhr) {
                this._xhr.abort();
            }
        };
        return HttpRequest;
    }(rf.MiniDispatcher));
    rf.HttpRequest = HttpRequest;
    var ImageLoader = (function (_super) {
        __extends(ImageLoader, _super);
        function ImageLoader() {
            return _super.call(this) || this;
        }
        Object.defineProperty(ImageLoader, "crossOrigin", {
            get: function () {
                return this._crossOrigin;
            },
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
                _this.simpleDispatch(rf.EventT.COMPLETE);
            }, 0);
        };
        ImageLoader.prototype.onLoadError = function () {
            var image = this.getImage(event);
            if (!image) {
                return;
            }
            this.simpleDispatch(rf.EventT.IO_ERROR, image.src);
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
    var Socket = (function (_super) {
        __extends(Socket, _super);
        function Socket(host, port) {
            var _this = _super.call(this) || this;
            _this._connected = false;
            _this._addInputPosition = 0;
            _this.endian = true;
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
            get: function () {
                return this._input;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Socket.prototype, "output", {
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
            this.simpleDispatch(rf.EventT.OPEN, e);
        };
        Socket.prototype.onMessage = function (msg) {
            if (!msg || !msg.data) {
                return;
            }
            var data = msg.data;
            if (this.disableInput && data) {
                this.simpleDispatch(rf.EventT.MESSAGE, data);
                return;
            }
            if (this._input.length > 0 && this._input.bytesAvailable < 1) {
                this._input.clear();
                this._addInputPosition = 0;
            }
            ;
            var pre = this._input.position;
            if (!this._addInputPosition) {
                this._addInputPosition = 0;
            }
            this._input.position = this._addInputPosition;
            if (data) {
                if ((typeof data == "string")) {
                    this._input.writeUTFBytes(data);
                }
                else {
                    this._input._writeUint8Array(new Uint8Array(data));
                }
                this._addInputPosition = this._input.position;
                this._input.position = pre;
            }
            this.simpleDispatch(rf.EventT.MESSAGE, data);
        };
        Socket.prototype.onClose = function (e) {
            this._connected = false;
            this.simpleDispatch(rf.EventT.CLOSE, e);
        };
        Socket.prototype.onError = function (e) {
            this.simpleDispatch(rf.EventT.ERROR, e);
        };
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
                    this.simpleDispatch(rf.EventT.ERROR, evt);
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
    var LoadPriority;
    (function (LoadPriority) {
        LoadPriority[LoadPriority["low"] = 0] = "low";
        LoadPriority[LoadPriority["middle"] = 1] = "middle";
        LoadPriority[LoadPriority["high"] = 2] = "high";
        LoadPriority[LoadPriority["max"] = 3] = "max";
    })(LoadPriority = rf.LoadPriority || (rf.LoadPriority = {}));
    function loadRes(url, complete, thisObj, type, priority, cache, noDispose, disposeTime) {
        if (type === void 0) { type = ResType.bin; }
        if (priority === void 0) { priority = LoadPriority.low; }
        if (cache === void 0) { cache = true; }
        if (noDispose === void 0) { noDispose = false; }
        if (disposeTime === void 0) { disposeTime = 30000; }
        Res.instance.load(url, complete, thisObj, type, priority, cache, noDispose, disposeTime);
    }
    rf.loadRes = loadRes;
    var Res = (function () {
        function Res() {
            this.maxLoader = 5;
            this.nowLoader = 0;
            this._analyzerMap = {};
            this._analyzerMap[ResType.text] = ResTextLoader;
            this._analyzerMap[ResType.bin] = ResBinLoader;
            this._analyzerMap[ResType.sound] = ResSoundLoader;
            this._analyzerMap[ResType.image] = ResImageLoader;
            this._loadMap = {};
            this._resMap = {};
            this._loadingMap = {};
            setInterval(this.clearRes.bind(this), 10 * 1000);
        }
        Object.defineProperty(Res, "instance", {
            get: function () {
                return this._instance || (this._instance = new Res());
            },
            enumerable: true,
            configurable: true
        });
        Res.prototype.load = function (url, complete, thisObj, type, priority, cache, noDispose, disposeTime) {
            var _this = this;
            if (type === void 0) { type = ResType.bin; }
            if (priority === void 0) { priority = LoadPriority.low; }
            if (cache === void 0) { cache = true; }
            if (noDispose === void 0) { noDispose = false; }
            if (disposeTime === void 0) { disposeTime = 30000; }
            var urls;
            if (typeof url === "string") {
                urls = [url];
            }
            else {
                urls = url;
            }
            urls.forEach(function (v) {
                if (_this._resMap[v]) {
                    var item_1 = _this._resMap[v];
                    item_1.noDispose = noDispose;
                    item_1.disposeTime = disposeTime;
                    setTimeout(function () {
                        if (complete) {
                            var event_1 = new rf.EventX(rf.EventT.COMPLETE, item_1);
                            complete.call(thisObj, event_1);
                        }
                    }, 0);
                }
                else if (_this._loadingMap[v]) {
                    var item = _this._loadingMap[v];
                    item.complete.push(complete);
                    item.thisObj.push(thisObj);
                }
                else {
                    var item = new ResItem();
                    item.type = type;
                    item.url = v;
                    item.cache = cache;
                    item.complete = [complete];
                    item.thisObj = [thisObj];
                    item.noDispose = noDispose;
                    item.disposeTime = disposeTime;
                    if (!_this._loadMap[priority]) {
                        _this._loadMap[priority] = [];
                    }
                    var list = _this._loadMap[priority];
                    list.push(item);
                    _this._loadingMap[v] = item;
                    _this.loadNext();
                }
            });
        };
        Res.prototype.loadNext = function () {
            if (this.nowLoader >= this.maxLoader) {
                return;
            }
            for (var i = LoadPriority.max; i >= 0; --i) {
                if (this._loadMap[i]) {
                    var list = this._loadMap[i];
                    if (list.length > 0) {
                        var item = list.shift();
                        this.doLoad(item);
                        return;
                    }
                }
            }
            if (this.nowLoader == 0) {
            }
        };
        Res.prototype.doLoad = function (item) {
            this.nowLoader++;
            var loader = rf.recyclable(this._analyzerMap[item.type]);
            loader.loadFile(item, this.doLoadComplete, this);
        };
        Res.prototype.doLoadComplete = function (loader, event) {
            this.nowLoader--;
            loader.recycle();
            var item = event.data;
            if (item) {
                item.loadedTime = rf.getTimer();
                if (item.cache) {
                    this._resMap[item.url] = item;
                }
            }
            else {
            }
            item.complete.forEach(function (v, i) {
                if (v) {
                    v.call(item.thisObj[i], event);
                }
            });
            item.complete = item.thisObj = undefined;
            delete this._loadingMap[item.url];
            this.loadNext();
        };
        Res.prototype.clearRes = function () {
            var now = rf.getTimer();
            for (var url in this._resMap) {
                var item = this._resMap[url];
                if (!item.noDispose) {
                    var time = now - item.loadedTime;
                    if (item.disposeTime < time) {
                        delete this._resMap[url];
                        if (item.type == ResType.image) {
                        }
                    }
                }
            }
        };
        return Res;
    }());
    rf.Res = Res;
    var ResType;
    (function (ResType) {
        ResType[ResType["bin"] = 0] = "bin";
        ResType[ResType["text"] = 1] = "text";
        ResType[ResType["sound"] = 2] = "sound";
        ResType[ResType["image"] = 3] = "image";
    })(ResType = rf.ResType || (rf.ResType = {}));
    var ResItem = (function () {
        function ResItem() {
        }
        return ResItem;
    }());
    rf.ResItem = ResItem;
    var ResLoaderBase = (function () {
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
    var ResBinLoader = (function (_super) {
        __extends(ResBinLoader, _super);
        function ResBinLoader() {
            var _this = _super.call(this) || this;
            _this._httpRequest = new rf.HttpRequest();
            _this._httpRequest.responseType = _this.getType();
            _this._httpRequest.addEventListener(rf.EventT.COMPLETE, _this.onComplete, _this);
            _this._httpRequest.addEventListener(rf.EventT.IO_ERROR, _this.onIOError, _this);
            return _this;
        }
        ResBinLoader.prototype.getType = function () {
            return rf.HttpResponseType.ARRAY_BUFFER;
        };
        ResBinLoader.prototype.loadFile = function (resItem, compFunc, thisObject) {
            _super.prototype.loadFile.call(this, resItem, compFunc, thisObject);
            this._httpRequest.abort();
            this._httpRequest.open(resItem.url, rf.HttpMethod.GET);
            this._httpRequest.send();
        };
        ResBinLoader.prototype.onComplete = function (event) {
            this._resItem.data = new rf.ByteArray(this._httpRequest.response);
            event.data = this._resItem;
            var compFunc = this._compFunc;
            var thisObject = this._thisObject;
            this._resItem = this._compFunc = this._thisObject = undefined;
            if (compFunc) {
                compFunc.call(thisObject, this, event);
            }
        };
        ResBinLoader.prototype.onIOError = function (event) {
            event.data = this._resItem;
            var compFunc = this._compFunc;
            var thisObject = this._thisObject;
            this._resItem = this._compFunc = this._thisObject = undefined;
            if (compFunc) {
                compFunc.call(thisObject, this, event);
            }
        };
        return ResBinLoader;
    }(ResLoaderBase));
    rf.ResBinLoader = ResBinLoader;
    var ResTextLoader = (function (_super) {
        __extends(ResTextLoader, _super);
        function ResTextLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ResTextLoader.prototype.getType = function () {
            return rf.HttpResponseType.TEXT;
        };
        ResTextLoader.prototype.onComplete = function (event) {
            this._resItem.data = this._httpRequest.response;
            event.data = this._resItem;
            var compFunc = this._compFunc;
            var thisObject = this._thisObject;
            this._resItem = this._compFunc = this._thisObject = undefined;
            if (compFunc) {
                compFunc.call(thisObject, this, event);
            }
        };
        return ResTextLoader;
    }(ResBinLoader));
    rf.ResTextLoader = ResTextLoader;
    var ResSoundLoader = (function (_super) {
        __extends(ResSoundLoader, _super);
        function ResSoundLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ResSoundLoader.prototype.onComplete = function (event) {
            var data = this._httpRequest.response;
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
    var ResImageLoader = (function (_super) {
        __extends(ResImageLoader, _super);
        function ResImageLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ResImageLoader.prototype.loadFile = function (resItem, compFunc, thisObject) {
            var _this = this;
            var imageLoader = new rf.ImageLoader();
            imageLoader.addEventListener(rf.EventT.COMPLETE, function (e) {
                if (compFunc) {
                    resItem.data = imageLoader.data;
                    e.data = resItem;
                    compFunc.call(thisObject, _this, e);
                }
            }, this);
            imageLoader.addEventListener(rf.EventT.IO_ERROR, function (e) {
                if (compFunc) {
                    e.data = resItem;
                    compFunc.call(thisObject, _this, e);
                }
            }, this);
            imageLoader.load(resItem.url);
        };
        return ResImageLoader;
    }(ResLoaderBase));
    rf.ResImageLoader = ResImageLoader;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var C = (function () {
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
        };
        C.prototype.isPowerOfTwo = function (n) {
            return (n !== 0) && ((n & (n - 1)) === 0);
        };
        C.prototype.describeRange = function (value) {
            return '[' + value[0] + ', ' + value[1] + ']';
        };
        C.prototype.getAngle = function (g) {
            var lineWidthRange = this.describeRange(g.getParameter(g.ALIASED_LINE_WIDTH_RANGE));
            var angle = ((navigator.platform === 'Win32') || (navigator.platform === 'Win64')) &&
                (g.getParameter(g.RENDERER) !== 'Internet Explorer') &&
                (g.getParameter(g.RENDERER) !== 'Microsoft Edge') &&
                (lineWidthRange === this.describeRange([1, 1]));
            if (angle) {
                if (this.isPowerOfTwo(g.getParameter(g.MAX_VERTEX_UNIFORM_VECTORS)) && this.isPowerOfTwo(g.getParameter(g.MAX_FRAGMENT_UNIFORM_VECTORS))) {
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
    rf.Capabilities = new C();
})(rf || (rf = {}));
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
    var CallbackInfo = (function () {
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
        CallbackInfo.prototype.checkHandle = function (callback, thisObj) {
            return this.callback === callback && this.thisObj == thisObj;
        };
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
        CallbackInfo.get = function (callback, thisObj) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var info = rf.recyclable(CallbackInfo);
            info.init(callback, thisObj, args);
            return info;
        };
        CallbackInfo.addToList = function (list, handle, thisObj) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
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
    var BitmapSourceVO = (function () {
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
    var BitmapSourceArea = (function () {
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
    var MixBitmapSourceArea = (function (_super) {
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
            if (rect.width != 0) {
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
    var BitmapSource = (function (_super) {
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
        BitmapSource.DEFAULT = 0;
        BitmapSource.PACK = 1;
        return BitmapSource;
    }(rf.MiniDispatcher));
    rf.BitmapSource = BitmapSource;
    rf.bitmapSources = {};
})(rf || (rf = {}));
var rf;
(function (rf) {
    var Quaternion = (function () {
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
            if (qax * qbx + qay * qby + qaz * qbz + qaw * qbw < 0) {
                return new Quaternion(qax + percent * (-qbx - qax), qay + percent * (-qby - qay), qaz + percent * (-qbz - qaz), qaw + percent * (-qbw - qbw));
            }
            return new Quaternion(qax + percent * (qbx - qax), qay + percent * (qby - qay), qaz + percent * (qbz - qaz), qaw + percent * (qbw - qbw));
        };
        Quaternion.prototype.fromMatrix3D = function (m) {
            var _a = m.rawData, m11 = _a[0], m12 = _a[1], m13 = _a[2], m21 = _a[4], m22 = _a[5], m23 = _a[6], m31 = _a[8], m32 = _a[9], m33 = _a[10];
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
                target = new rf.Matrix3D();
            }
            var rawData = target.rawData;
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
        "pos": { size: 3, offset: 0 },
        "uv": { size: 3, offset: 3 },
        "color": { size: 4, offset: 6 },
        "data32PerVertex": { size: 10, offset: 0 }
    };
    rf.vertex_mesh_variable = {
        "pos": { size: 3, offset: 0 },
        "normal": { size: 3, offset: 3 },
        "uv": { size: 2, offset: 6 },
        "data32PerVertex": { size: 8, offset: 0 }
    };
    var VertexInfo = (function () {
        function VertexInfo(value, data32PerVertex) {
            this.numVertices = 0;
            this.data32PerVertex = 0;
            this.variables = undefined;
            if (value instanceof Float32Array) {
                this.vertex = new rf.Float32Byte(value);
            }
            else {
                this.vertex = new rf.Float32Byte(new Float32Array(value));
            }
            this.data32PerVertex = data32PerVertex;
            this.numVertices = this.vertex.length / data32PerVertex;
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
})(rf || (rf = {}));
var rf;
(function (rf) {
    var DChange;
    (function (DChange) {
        DChange[DChange["trasnform"] = 1] = "trasnform";
        DChange[DChange["alpha"] = 2] = "alpha";
        DChange[DChange["vertex"] = 4] = "vertex";
        DChange[DChange["vcdata"] = 8] = "vcdata";
        DChange[DChange["ct"] = 16] = "ct";
        DChange[DChange["area"] = 32] = "area";
        DChange[DChange["ca"] = 64] = "ca";
        DChange[DChange["c_all"] = 80] = "c_all";
        DChange[DChange["ac"] = 96] = "ac";
        DChange[DChange["ta"] = 3] = "ta";
        DChange[DChange["batch"] = 12] = "batch";
        DChange[DChange["base"] = 35] = "base";
        DChange[DChange["t_all"] = 19] = "t_all";
    })(DChange = rf.DChange || (rf.DChange = {}));
    var HitArea = (function () {
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
    var DisplayObject = (function (_super) {
        __extends(DisplayObject, _super);
        function DisplayObject() {
            var _this = _super.call(this) || this;
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
            _this.w = 0;
            _this.h = 0;
            _this._visible = true;
            _this.states = 0;
            _this.pivotZero = false;
            _this.pivotPonumber = undefined;
            _this.parent = undefined;
            _this.stage = undefined;
            _this.name = undefined;
            _this.invalidateFuncs = [];
            _this.pos = new rf.Vector3D();
            _this.rot = new rf.Vector3D();
            _this.sca = new rf.Vector3D();
            _this.transformComponents = [_this.pos, _this.rot, _this.sca];
            _this.transform = new rf.Matrix3D();
            _this.sceneTransform = new rf.Matrix3D();
            return _this;
        }
        DisplayObject.prototype.setChange = function (value, p, c) {
            if (p === void 0) { p = 0; }
            if (c === void 0) { c = false; }
            this.states |= (value & ~DChange.batch);
            if (undefined != this.parent) {
                if (value & DChange.ta) {
                    value |= DChange.ct;
                }
                if (value & DChange.area) {
                    value |= DChange.ca;
                }
                this.parent.setChange(value & DChange.batch, value & DChange.c_all, true);
            }
        };
        Object.defineProperty(DisplayObject.prototype, "visible", {
            get: function () { return this._visible; },
            set: function (value) {
                if (this._visible != value) {
                    this._visible = value;
                    this.setChange(DChange.vertex);
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
                    vertex |= DChange.vertex;
                }
                this._alpha = value;
                this.setChange(vertex | DChange.alpha | DChange.vcdata);
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
                this.setChange(DChange.trasnform | DChange.vcdata);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "scaleY", {
            get: function () { return this._scaleY; },
            set: function (value) { this._scaleY = value; this.sca.y = value; this.setChange(DChange.trasnform); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "scaleZ", {
            get: function () { return this._scaleZ; },
            set: function (value) { this._scaleZ = value; this.sca.z = value; this.setChange(DChange.trasnform); },
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
                this.setChange(DChange.trasnform);
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
                this.setChange(DChange.trasnform);
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
                this.setChange(DChange.trasnform);
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
                this.setChange(DChange.trasnform | DChange.vcdata);
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
                this.setChange(DChange.trasnform | DChange.vcdata);
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
                this.setChange(DChange.trasnform);
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
                this.setChange(DChange.trasnform | DChange.vcdata);
            }
        };
        Object.defineProperty(DisplayObject.prototype, "eulers", {
            set: function (value) {
                this._rotationX = value.x * rf.DEGREES_TO_RADIANS;
                this._rotationY = value.y * rf.DEGREES_TO_RADIANS;
                this._rotationZ = value.z * rf.DEGREES_TO_RADIANS;
                this.setChange(DChange.trasnform);
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.forwardPos = function (distance, or) {
            if (or === void 0) { or = false; }
            this.transform.copyColumnTo(2, rf.tempAxeX);
            rf.tempAxeX.normalize();
            if (or) {
                this.pos.x = -rf.tempAxeX.x * distance;
                this.pos.y = -rf.tempAxeX.y * distance;
                this.pos.z = -rf.tempAxeX.z * distance;
            }
            else {
                this.pos.x += rf.tempAxeX.x * distance;
                this.pos.y += rf.tempAxeX.y * distance;
                this.pos.z += rf.tempAxeX.z * distance;
            }
            this._x = this.pos.x;
            this._y = this.pos.y;
            this._z = this.pos.z;
            this.setChange(DChange.trasnform | DChange.vcdata);
        };
        DisplayObject.prototype.upPos = function (distance) {
            this.transform.copyColumnTo(1, rf.tempAxeX);
            rf.tempAxeX.normalize();
            this.pos.x += rf.tempAxeX.x * distance;
            this.pos.y += rf.tempAxeX.y * distance;
            this.pos.z += rf.tempAxeX.z * distance;
            this._x = this.pos.x;
            this._y = this.pos.y;
            this._z = this.pos.z;
            this.setChange(DChange.trasnform | DChange.vcdata);
        };
        DisplayObject.prototype.rightPos = function (distance) {
            this.transform.copyColumnTo(0, rf.tempAxeX);
            rf.tempAxeX.normalize();
            this.pos.x += rf.tempAxeX.x * distance;
            this.pos.y += rf.tempAxeX.y * distance;
            this.pos.z += rf.tempAxeX.z * distance;
            this._x = this.pos.x;
            this._y = this.pos.y;
            this._z = this.pos.z;
            this.setChange(DChange.trasnform | DChange.vcdata);
        };
        DisplayObject.prototype.setRot = function (rx, ry, rz, update) {
            if (update === void 0) { update = true; }
            this.rot.x = this._rotationX = rx * rf.DEGREES_TO_RADIANS;
            this.rot.y = this._rotationY = ry * rf.DEGREES_TO_RADIANS;
            this.rot.z = this._rotationZ = rz * rf.DEGREES_TO_RADIANS;
            if (update) {
                this.setChange(DChange.trasnform);
            }
        };
        DisplayObject.prototype.setRotRadians = function (rx, ry, rz, update) {
            if (update === void 0) { update = true; }
            this.rot.x = this._rotationX = rx;
            this.rot.y = this._rotationY = ry;
            this.rot.z = this._rotationZ = rz;
            if (update) {
                this.setChange(DChange.trasnform);
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
                this.setChange(DChange.trasnform | DChange.vcdata);
            }
        };
        DisplayObject.prototype.setPivotPonumber = function (x, y, z) {
            if (undefined == this.pivotPonumber) {
                this.pivotPonumber = new rf.Vector3D();
            }
            ;
            this.pivotPonumber.x = x;
            this.pivotPonumber.y = y;
            this.pivotPonumber.z = z;
            this.pivotZero = (x != 0 || y != 0 || z != 0);
        };
        DisplayObject.prototype.setTransform = function (matrix) {
            var vs = matrix.decompose();
            this.pos.copyFrom(vs[0]);
            this._x = this.pos.x;
            this._y = this.pos.y;
            this._z = this.pos.z;
            this.rot.copyFrom(vs[1]);
            this._rotationX = this.rot.x;
            this._rotationY = this.rot.y;
            this._rotationZ = this.rot.z;
            this.sca.copyFrom(vs[2]);
            this._scaleX = this.sca.x;
            this._scaleY = this.sca.y;
            this._scaleZ = this.sca.z;
            this.setChange(DChange.trasnform | DChange.vcdata);
        };
        DisplayObject.prototype.updateTransform = function () {
            if (this.pivotZero) {
                this.transform.identity();
                this.transform.appendTranslation(-this.pivotPonumber.x, -this.pivotPonumber.y, -this.pivotPonumber.z);
                this.transform.appendScale(this._scaleX, this._scaleY, this._scaleZ);
                this.transform.appendTranslation(this._x, this._y, this._z);
                this.transform.appendTranslation(this.pivotPonumber.x, this.pivotPonumber.y, this.pivotPonumber.z);
            }
            else {
                this.transform.recompose(this.transformComponents);
            }
            this.states &= ~DChange.trasnform;
        };
        DisplayObject.prototype.updateSceneTransform = function (sceneTransform) {
            this.sceneTransform.copyFrom(this.transform);
            this.sceneTransform.append(sceneTransform);
        };
        DisplayObject.prototype.updateAlpha = function (sceneAlpha) {
            this.sceneAlpha = this.sceneAlpha * this._alpha;
            this.states &= ~DChange.alpha;
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
            this.w = width;
            this.h = height;
            this.invalidate();
        };
        DisplayObject.prototype.invalidate = function (func) {
            if (func === void 0) { func = null; }
            rf.ROOT.addEventListener(rf.EventT.ENTER_FRAME, this.onInvalidate, this);
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
                    rf.ROOT.removeEventListener(rf.EventT.ENTER_FRAME, this.onInvalidate);
                }
            }
        };
        DisplayObject.prototype.onInvalidate = function (event) {
            event.currentTarget.off(rf.EventT.ENTER_FRAME, this.onInvalidate);
            var arr = this.invalidateFuncs.concat();
            this.invalidateFuncs.length = 0;
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var func = arr_1[_i];
                func();
            }
        };
        DisplayObject.prototype.doResize = function () { };
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
            this.states &= ~DChange.ac;
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
        return DisplayObject;
    }(rf.MiniDispatcher));
    rf.DisplayObject = DisplayObject;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var DisplayObjectContainer = (function (_super) {
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
            if (child.parent)
                child.remove();
            this.childrens.push(child);
            child.parent = this;
            child.setChange(rf.DChange.base | rf.DChange.vertex);
            if (this.stage) {
                if (!child.stage) {
                    child.stage = this.stage;
                    child.addToStage();
                }
            }
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
            child.setChange(rf.DChange.base | rf.DChange.vertex);
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
            child.removeFromStage();
        };
        DisplayObjectContainer.prototype.removeAllChild = function () {
            for (var _i = 0, _a = this.childrens; _i < _a.length; _i++) {
                var child = _a[_i];
                child.stage = undefined;
                child.parent = undefined;
                child.removeFromStage();
            }
            this.childrens.length = 0;
        };
        DisplayObjectContainer.prototype.removeFromStage = function () {
            for (var _i = 0, _a = this.childrens; _i < _a.length; _i++) {
                var child = _a[_i];
                child.stage = undefined;
                child.removeFromStage();
            }
            _super.prototype.removeFromStage.call(this);
        };
        DisplayObjectContainer.prototype.addToStage = function () {
            for (var _i = 0, _a = this.childrens; _i < _a.length; _i++) {
                var child = _a[_i];
                child.stage = this.stage;
                child.addToStage();
            }
        };
        DisplayObjectContainer.prototype.updateTransform = function () {
            var states = this.states;
            if (states & rf.DChange.trasnform) {
                _super.prototype.updateTransform.call(this);
                this.updateSceneTransform();
            }
            if (states & rf.DChange.alpha) {
                this.updateAlpha(this.parent.sceneAlpha);
            }
            if (states & rf.DChange.ct) {
                for (var _i = 0, _a = this.childrens; _i < _a.length; _i++) {
                    var child = _a[_i];
                    if (child instanceof DisplayObjectContainer) {
                        if (child.states & rf.DChange.t_all) {
                            child.updateTransform();
                        }
                    }
                    else {
                        if (child.states & rf.DChange.trasnform) {
                            child.updateTransform();
                            child.updateSceneTransform(this.sceneTransform);
                        }
                        if (child.states & rf.DChange.alpha) {
                            child.updateAlpha(this.sceneAlpha);
                        }
                    }
                }
                this.states &= ~rf.DChange.ct;
            }
        };
        DisplayObjectContainer.prototype.updateSceneTransform = function () {
            this.sceneTransform.copyFrom(this.transform);
            if (this.parent)
                this.sceneTransform.append(this.parent.sceneTransform);
            for (var _i = 0, _a = this.childrens; _i < _a.length; _i++) {
                var child = _a[_i];
                if ((child.states & rf.DChange.trasnform) != 0) {
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
            this.states &= ~rf.DChange.alpha;
        };
        return DisplayObjectContainer;
    }(rf.DisplayObject));
    rf.DisplayObjectContainer = DisplayObjectContainer;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var Camera = (function (_super) {
        __extends(Camera, _super);
        function Camera(far) {
            if (far === void 0) { far = 10000; }
            var _this = _super.call(this) || this;
            _this.far = far;
            _this.len = new rf.Matrix3D();
            _this.worldTranform = new rf.Matrix3D();
            return _this;
        }
        Camera.prototype.resize = function (width, height) { };
        return Camera;
    }(rf.DisplayObject));
    rf.Camera = Camera;
    var Camera2D = (function (_super) {
        __extends(Camera2D, _super);
        function Camera2D() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Camera2D.prototype.resize = function (width, height) {
            this.w = width;
            this.h = height;
            var rawData = this.len.rawData;
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
            this.states |= rf.DChange.trasnform;
        };
        Camera2D.prototype.updateSceneTransform = function (sceneTransform) {
            if (this.states | rf.DChange.trasnform) {
                this.updateTransform();
                this.sceneTransform.copyFrom(this.transform);
                this.sceneTransform.invert();
                this.worldTranform.copyFrom(this.sceneTransform);
                this.worldTranform.append(this.len);
                this.states &= ~rf.DChange.trasnform;
            }
        };
        return Camera2D;
    }(Camera));
    rf.Camera2D = Camera2D;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        function Sprite(source, variables) {
            if (source === void 0) { source = undefined; }
            if (variables === void 0) { variables = undefined; }
            var _this = _super.call(this) || this;
            _this.batcherAvailable = true;
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
                if (this.states & rf.DChange.t_all) {
                    this.updateTransform();
                }
                this.renderer.render(camera, now, interval);
            }
        };
        Sprite.prototype.addToStage = function () {
            if (this.$graphics && this.$graphics.numVertices) {
                this.setChange(rf.DChange.vertex);
            }
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
                if (child.states & rf.DChange.ac) {
                    child.updateHitArea();
                }
                hitArea.combine(child.hitArea, child._x, child._y);
            }
            if (this.$graphics) {
                hitArea.combine(this.$graphics.hitArea, 0, 0);
            }
            this.states &= ~rf.DChange.ac;
        };
        Sprite.prototype.getObjectByPoint = function (dx, dy, scale) {
            if (this.mouseEnabled == false && this.mouseChildren == false) {
                return undefined;
            }
            if (this.states & rf.DChange.ac) {
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
                    var g = this.$graphics;
                    if (undefined != g) {
                        if (g.hitArea.checkIn(dx, dy, scale) == true) {
                            return this;
                        }
                    }
                }
            }
            return undefined;
        };
        return Sprite;
    }(rf.DisplayObjectContainer));
    rf.Sprite = Sprite;
    var Image = (function (_super) {
        __extends(Image, _super);
        function Image() {
            return _super.call(this) || this;
        }
        Image.prototype.load = function (url) {
            if (this._url == url) {
                return;
            }
            if (url) {
                this._url = url;
                rf.loadRes(url, this.onImageComplete, this, rf.ResType.image);
            }
        };
        Image.prototype.onImageComplete = function (e) {
            if (e.type != rf.EventT.COMPLETE) {
                return;
            }
            var res = e.data;
            var image = res.data;
            var source = this.source;
            var vo = source.setSourceVO(this._url, image.width, image.height, 1);
            source.bmd.context.drawImage(image, vo.x, vo.y);
            var g = this.graphics;
            g.clear();
            g.drawBitmap(0, 0, vo);
            g.end();
        };
        return Image;
    }(Sprite));
    rf.Image = Image;
    var Graphics = (function () {
        function Graphics(target, variables) {
            this.numVertices = 0;
            this.variables = undefined;
            this.$batchOffset = 0;
            this.preNumVertices = 0;
            this.target = target;
            this.variables = variables;
            this.byte = new rf.Float32Byte(new Float32Array(0));
            this.numVertices = 0;
            this.hitArea = new rf.HitArea();
        }
        Graphics.prototype.clear = function () {
            this.preNumVertices = this.numVertices;
            this.numVertices = 0;
            this.byte.length = 0;
            this.hitArea.clean();
        };
        Graphics.prototype.end = function () {
            var target = this.target;
            var change = 0;
            if (target.$batchGeometry && this.numVertices > 0 && this.preNumVertices == this.numVertices) {
                this.preNumVertices = 0;
                target.$batchGeometry.update(this.$batchOffset, this.byte);
            }
            else {
                change |= rf.DChange.vertex;
            }
            if (target.hitArea.combine(this.hitArea, 0, 0)) {
                change |= rf.DChange.area;
            }
            target.setChange(change);
        };
        Graphics.prototype.drawRect = function (x, y, width, height, color, alpha, matrix, z) {
            if (alpha === void 0) { alpha = 1; }
            if (matrix === void 0) { matrix = undefined; }
            if (z === void 0) { z = 0; }
            var red = ((color & 0x00ff0000) >>> 16) / 0xFF;
            var green = ((color & 0x0000ff00) >>> 8) / 0xFF;
            var blue = (color & 0x000000ff) / 0xFF;
            var r = x + width;
            var b = y + height;
            var position = this.byte.array.length;
            var d = this.variables["data32PerVertex"].size;
            var v = this.variables;
            var f = rf.m2dTransform;
            var p = rf.EMPTY_POINT2D;
            var byte = this.byte;
            var _a = this.target.source, originU = _a.originU, originV = _a.originV;
            this.byte.length = position + d * 4;
            var pos = v[rf.VA.pos];
            var uv = v[rf.VA.uv];
            var vacolor = v[rf.VA.color];
            var normal = v[rf.VA.normal];
            var points = [x, y, r, y, r, b, x, b];
            for (var i = 0; i < 8; i += 2) {
                var dp = position + (i / 2) * d;
                p.x = points[i];
                p.y = points[i + 1];
                if (undefined != matrix) {
                    f(matrix, p, p);
                }
                this.hitArea.updateArea(p.x, p.y, z);
                byte.wPoint3(dp + pos.offset, p.x, p.y, z);
                if (undefined != normal) {
                    byte.wPoint3(dp + normal.offset, 0, 0, 1);
                }
                if (undefined != uv) {
                    byte.wPoint3(dp + uv.offset, originU, originV, 0);
                }
                if (undefined != vacolor) {
                    byte.wPoint4(dp + vacolor.offset, red, green, blue, alpha);
                }
                this.numVertices += 1;
            }
        };
        Graphics.prototype.drawBitmap = function (x, y, vo, color, matrix, alpha, z) {
            if (color === void 0) { color = 0xFFFFFF; }
            if (matrix === void 0) { matrix = undefined; }
            if (alpha === void 0) { alpha = 1; }
            if (z === void 0) { z = 0; }
            var w = vo.w, h = vo.h, ul = vo.ul, ur = vo.ur, vt = vo.vt, vb = vo.vb;
            var r = x + w;
            var b = y + h;
            var d = this.variables["data32PerVertex"].size;
            var position = this.byte.array.length;
            this.byte.length = position + d * 4;
            var v = this.variables;
            var f = rf.m2dTransform;
            var p = rf.EMPTY_POINT2D;
            var byte = this.byte;
            var pos = v[rf.VA.pos];
            var uv = v[rf.VA.uv];
            var vacolor = v[rf.VA.color];
            var normal = v[rf.VA.normal];
            var red = ((color & 0x00ff0000) >>> 16) / 0xFF;
            var green = ((color & 0x0000ff00) >>> 8) / 0xFF;
            var blue = (color & 0x000000ff) / 0xFF;
            var points = [x, y, ul, vt, r, y, ur, vt, r, b, ur, vb, x, b, ul, vb];
            for (var i = 0; i < 16; i += 4) {
                var dp = position + (i / 4) * d;
                p.x = points[i];
                p.y = points[i + 1];
                if (undefined != matrix) {
                    f(matrix, p, p);
                }
                this.hitArea.updateArea(p.x, p.y, z);
                byte.wPoint3(dp + pos.offset, p.x, p.y, z);
                if (undefined != normal) {
                    byte.wPoint3(dp + normal.offset, 0, 0, 1);
                }
                if (undefined != uv) {
                    byte.wPoint3(dp + uv.offset, points[i + 2], points[i + 3], 0);
                }
                if (undefined != vacolor) {
                    byte.wPoint4(dp + vacolor.offset, red, green, blue, alpha);
                }
                this.numVertices += 1;
            }
        };
        return Graphics;
    }());
    rf.Graphics = Graphics;
    var RenderBase = (function () {
        function RenderBase() {
            this.triangleFaceToCull = rf.Context3DTriangleFace.NONE;
            this.depthMask = false;
            if (undefined != rf.gl) {
                this.sourceFactor = rf.gl.SRC_ALPHA;
                this.destinationFactor = rf.gl.ONE_MINUS_CONSTANT_ALPHA;
                this.passCompareMode = rf.gl.ALWAYS;
            }
        }
        RenderBase.prototype.render = function (camera, now, interval) { };
        return RenderBase;
    }());
    rf.RenderBase = RenderBase;
    var BatchRenderer = (function (_super) {
        __extends(BatchRenderer, _super);
        function BatchRenderer(target) {
            var _this = _super.call(this) || this;
            _this.geo = undefined;
            _this.target = target;
            _this.renders = new rf.Link();
            _this.worldTransform = new rf.Matrix3D();
            return _this;
        }
        BatchRenderer.prototype.render = function (camera, now, interval) {
            var target = this.target;
            var source = target.source;
            if (undefined == source) {
                return;
            }
            var t = rf.context3D.textureObj[source.name];
            if (undefined == t) {
                t = rf.context3D.createTexture(source.name, source.bmd);
            }
            this.t = t;
            if (target.states & rf.DChange.vertex) {
                this.cleanBatch();
                this.getBatchTargets(target, -target._x, -target._y, 1 / target._scaleX);
                this.toBatch();
                this.geo = undefined;
                target.states &= ~rf.DChange.batch;
            }
            else if (target.states & rf.DChange.vcdata) {
                this.updateVCData(target, -target._x, -target._y, 1 / target._scaleX);
                target.states &= ~rf.DChange.vcdata;
            }
            if (undefined == this.program) {
                this.createProgram();
            }
            this.worldTransform.copyFrom(target.sceneTransform);
            this.worldTransform.append(camera.worldTranform);
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
            var c = rf.context3D;
            var v = geo.$vertexBuffer;
            if (undefined == v) {
                geo.$vertexBuffer = v = c.createVertexBuffer(geo.vertex, geo.vertex.data32PerVertex);
            }
            var i = c.getIndexByQuad(geo.quadcount);
            var p = this.program;
            c.setProgram(p);
            c.setProgramConstantsFromMatrix(rf.VC.mvp, this.worldTransform);
            c.setProgramConstantsFromVector(rf.VC.ui, geo.vcData.array, 4);
            this.t.uploadContext(p, 0, rf.FS.diff);
            v.uploadContext(p);
            c.drawTriangles(i);
        };
        BatchRenderer.prototype.createProgram = function () {
            var vcode = "\n                attribute vec3 pos;\n                attribute vec3 uv;\n                attribute vec4 color;\n                uniform mat4 mvp;\n                uniform vec4 ui[" + rf.max_vc + "];\n                varying vec2 vUV;\n                varying vec4 vColor;\n                void main(void){\n                    vec4 p = vec4(pos,1.0);\n                    vec4 t = ui[int(uv.z)];\n                    p.xy = p.xy + t.xy;\n                    p.xy = p.xy * t.zz;\n                    gl_Position = mvp * p;\n                    vUV.xy = uv.xy;\n                    p = color;\n                    p.w = color.w * t.w;\n                    vColor = p;\n                }\n            ";
            var fcode = "\n                precision mediump float;\n                uniform sampler2D diff;\n                varying vec4 vColor;\n                varying vec2 vUV;\n                void main(void){\n                    vec4 color = texture2D(diff, vUV);\n                    gl_FragColor = vColor*color;\n                }\n            ";
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
        BatchRenderer.prototype.getBatchTargets = function (target, ox, oy, os) {
            if (false == target._visible || 0.0 >= target.sceneAlpha) {
                target.$vcIndex = -1;
                target.$batchGeometry = null;
                return;
            }
            var g = target.$graphics;
            ox = target._x + ox;
            oy = target._y + oy;
            os = target._scaleX * os;
            if (target == this.target || (null == target.renderer && true == target.batcherAvailable)) {
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
            }
            for (var _i = 0, _a = target.childrens; _i < _a.length; _i++) {
                var child = _a[_i];
                if (child instanceof Sprite) {
                    this.getBatchTargets(child, ox, oy, os);
                }
            }
        };
        BatchRenderer.prototype.updateVCData = function (target, ox, oy, os) {
            if (false == target._visible || 0.0 >= target.sceneAlpha) {
                target.$vcIndex = -1;
                target.$batchGeometry = null;
                return;
            }
            var g = target.$graphics;
            ox = target._x + ox;
            oy = target._y + oy;
            os = target._scaleX * os;
            if (target == this.target || (null == target.renderer && true == target.batcherAvailable)) {
                if (undefined != target.$batchGeometry) {
                    target.$vcox = ox;
                    target.$vcoy = oy;
                    target.$vcos = os;
                    target.$batchGeometry.vcData.wPoint4(rf.sp.$vcIndex * 4, rf.sp.$vcox, rf.sp.$vcoy, rf.sp.$vcos, rf.sp.sceneAlpha);
                }
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
    }(RenderBase));
    rf.BatchRenderer = BatchRenderer;
    var BatchGeometry = (function () {
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
            this.vcData = new rf.Float32Byte(new Float32Array(this.quadcount * 4));
            var byte = this.vertex.vertex;
            var vo = this.link.getFrist();
            while (vo) {
                if (vo.close == false) {
                    var sp_1 = vo.data;
                    var g = sp_1.$graphics;
                    if (sp_1.$vcIndex > 0) {
                        g.byte.update(this.vertex.data32PerVertex, rf.vertex_ui_variable["uv"].offset + 2, sp_1.$vcIndex);
                    }
                    byte.set(g.$batchOffset, g.byte);
                    this.vcData.wPoint4(sp_1.$vcIndex * 4, sp_1.$vcox, sp_1.$vcoy, sp_1.$vcos, sp_1.sceneAlpha);
                }
                vo = vo.next;
            }
        };
        BatchGeometry.prototype.update = function (position, byte) {
            if (undefined != this.vcData) {
                this.vcData.set(position, byte);
            }
            if (undefined != this.$vertexBuffer) {
                this.$vertexBuffer.readly = false;
            }
        };
        BatchGeometry.prototype.updateVC = function (sp) {
            this.vcData.wPoint4(sp.$vcIndex * 4, sp.$vcox, sp.$vcoy, sp.$vcos, sp.sceneAlpha);
        };
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
var rf;
(function (rf) {
    var VA;
    (function (VA) {
        VA["pos"] = "pos";
        VA["normal"] = "normal";
        VA["tangent"] = "tangent";
        VA["color"] = "color";
        VA["uv"] = "uv";
    })(VA = rf.VA || (rf.VA = {}));
    var FS;
    (function (FS) {
        FS["diff"] = "diff";
    })(FS = rf.FS || (rf.FS = {}));
    var VC;
    (function (VC) {
        VC["mv"] = "mv";
        VC["p"] = "p";
        VC["mvp"] = "mvp";
        VC["ui"] = "ui";
    })(VC = rf.VC || (rf.VC = {}));
    var Buffer3D = (function () {
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
    var Program3D = (function (_super) {
        __extends(Program3D, _super);
        function Program3D() {
            return _super.call(this) || this;
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
        Program3D.prototype.onRecycle = function () {
            this.dispose();
            this.vertexCode = undefined;
            this.fragmentCode = undefined;
            this.preusetime = 0;
            this.readly = false;
        };
        Program3D.prototype.createShader = function (code, type) {
            var g = rf.gl;
            var shader = g.createShader(type);
            g.shaderSource(shader, code);
            g.compileShader(shader);
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
    var VertexBuffer3D = (function (_super) {
        __extends(VertexBuffer3D, _super);
        function VertexBuffer3D() {
            var _this = _super.call(this) || this;
            _this.numVertices = 0;
            _this.data32PerVertex = 0;
            _this.buffer = null;
            return _this;
        }
        VertexBuffer3D.prototype.onRecycle = function () {
            if (this.buffer) {
                rf.gl.deleteBuffer(this.buffer);
                this.buffer = undefined;
            }
            this.readly = false;
            this.preusetime = 0;
            this.numVertices = 0;
            this.data32PerVertex = 0;
            this.data = null;
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
            g.bufferData(g.ARRAY_BUFFER, this.data.vertex.array, g.STATIC_DRAW);
            g.bindBuffer(g.ARRAY_BUFFER, null);
            this.readly = true;
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
            g.bindBuffer(g.ARRAY_BUFFER, this.buffer);
            var variables = this.data.variables;
            for (var variable in variables) {
                loc = g.getAttribLocation(program.program, variable);
                if (loc < 0) {
                    continue;
                }
                var o = variables[variable];
                g.vertexAttribPointer(loc, o.size, g.FLOAT, false, this.data32PerVertex * 4, o.offset * 4);
                g.enableVertexAttribArray(loc);
            }
        };
        return VertexBuffer3D;
    }(Buffer3D));
    rf.VertexBuffer3D = VertexBuffer3D;
    var IndexBuffer3D = (function (_super) {
        __extends(IndexBuffer3D, _super);
        function IndexBuffer3D() {
            var _this = _super.call(this) || this;
            _this.quadid = -1;
            return _this;
        }
        IndexBuffer3D.prototype.onRecycle = function () {
            if (this.buffer) {
                rf.gl.deleteBuffer(this.buffer);
                this.buffer = undefined;
            }
            this.readly = false;
            this.preusetime = 0;
            this.numIndices = 0;
            this.data = null;
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
    var Texture = (function (_super) {
        __extends(Texture, _super);
        function Texture() {
            var _this = _super.call(this) || this;
            _this.key = undefined;
            _this.texture = undefined;
            _this.mipmap = false;
            _this.width = 0;
            _this.height = 0;
            _this.pixels = undefined;
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
            g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
            rf.gl.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
            rf.gl.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
            rf.gl.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
            g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, data);
            g.bindTexture(g.TEXTURE_2D, null);
            return true;
        };
        Texture.prototype.uploadContext = function (program, index, variable) {
            if (false == this.readly) {
                this.awaken();
            }
            rf.gl.activeTexture(rf.gl["TEXTURE" + index]);
            rf.gl.bindTexture(rf.gl.TEXTURE_2D, this.texture);
            var index_tex = rf.gl.getUniformLocation(program.program, variable);
            rf.gl.uniform1i(index_tex, index);
        };
        Texture.prototype.onRecycle = function () {
            if (this.texture) {
                rf.gl.deleteTexture(this.texture);
                this.texture = null;
                this.mipmap = false;
            }
            if (this.pixels) {
                this.pixels = null;
            }
            this.width = 0;
            this.height = 0;
        };
        return Texture;
    }(Buffer3D));
    rf.Texture = Texture;
    var RttTexture = (function (_super) {
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
var rf;
(function (rf) {
    var Context3DTextureFormat;
    (function (Context3DTextureFormat) {
        Context3DTextureFormat["BGRA"] = "bgra";
    })(Context3DTextureFormat = rf.Context3DTextureFormat || (rf.Context3DTextureFormat = {}));
    var Context3DVertexBufferFormat;
    (function (Context3DVertexBufferFormat) {
        Context3DVertexBufferFormat[Context3DVertexBufferFormat["BYTES_4"] = 4] = "BYTES_4";
        Context3DVertexBufferFormat[Context3DVertexBufferFormat["FLOAT_1"] = 1] = "FLOAT_1";
        Context3DVertexBufferFormat[Context3DVertexBufferFormat["FLOAT_2"] = 2] = "FLOAT_2";
        Context3DVertexBufferFormat[Context3DVertexBufferFormat["FLOAT_3"] = 3] = "FLOAT_3";
        Context3DVertexBufferFormat[Context3DVertexBufferFormat["FLOAT_4"] = 4] = "FLOAT_4";
    })(Context3DVertexBufferFormat = rf.Context3DVertexBufferFormat || (rf.Context3DVertexBufferFormat = {}));
    var Context3DTriangleFace;
    (function (Context3DTriangleFace) {
        Context3DTriangleFace["BACK"] = "back";
        Context3DTriangleFace["FRONT"] = "front";
        Context3DTriangleFace["FRONT_AND_BACK"] = "frontAndBack";
        Context3DTriangleFace["NONE"] = "none";
    })(Context3DTriangleFace = rf.Context3DTriangleFace || (rf.Context3DTriangleFace = {}));
    var Context3D = (function () {
        function Context3D() {
            this._bendDisabled = true;
            this._depthDisabled = true;
            this.indexByte = undefined;
            this.textureObj = {};
            this.programs = {};
            this._linkedProgram = undefined;
        }
        Context3D.prototype.configureBackBuffer = function (width, height, antiAlias, enableDepthAndStencil) {
            if (enableDepthAndStencil === void 0) { enableDepthAndStencil = true; }
            var g = rf.gl;
            g.viewport(0, 0, width, height);
            g.canvas.width = width;
            g.canvas.height = height;
            this._depthDisabled = enableDepthAndStencil;
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
        Context3D.prototype.initIndexByQuadCount = function (count) {
            var byte = this.indexByte = new Uint16Array(count * 6);
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
        };
        Context3D.prototype.getIndexByQuad = function (quadCount) {
            if (quadCount > 2000) {
                rf.ThrowError("你要这么多四边形干嘛？");
                return null;
            }
            if (undefined == this.indexs) {
                this.indexs = {};
            }
            var buffer = this.indexs[quadCount];
            var length = quadCount * 6;
            if (undefined == buffer) {
                var array = new Uint16Array(length);
                if (undefined == this.indexByte) {
                    this.initIndexByQuadCount(2000);
                }
                array.set(this.indexByte.slice(0, length));
                this.indexs[quadCount] = buffer = this.createIndexBuffer(array);
            }
            return buffer;
        };
        Context3D.prototype.createIndexBuffer = function (data) {
            var buffer = rf.recyclable(rf.IndexBuffer3D);
            buffer.uploadFromVector(data);
            return buffer;
        };
        Context3D.prototype.createTexture = function (key, pixels, mipmap) {
            if (mipmap === void 0) { mipmap = false; }
            var texture = rf.recyclable(rf.Texture);
            texture.key = key;
            texture.pixels = pixels;
            texture.width = pixels.width;
            texture.height = pixels.height;
            texture.mipmap = mipmap;
            this.textureObj[key] = texture;
            return texture;
        };
        Context3D.prototype.createEmptyTexture = function (key, width, height, mipmap) {
            if (mipmap === void 0) { mipmap = false; }
            var texture = rf.recyclable(rf.Texture);
            texture.key = key;
            texture.pixels = new rf.BitmapData(width, height);
            texture.width = width;
            texture.height = height;
            texture.mipmap = mipmap;
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
            if (!this._rttFramebuffer) {
                this._rttFramebuffer = rf.gl.createFramebuffer();
                rf.gl.bindFramebuffer(rf.gl.FRAMEBUFFER, this._rttFramebuffer);
                var renderbuffer = rf.gl.createRenderbuffer();
                rf.gl.bindRenderbuffer(rf.gl.RENDERBUFFER, renderbuffer);
                rf.gl.renderbufferStorage(rf.gl.RENDERBUFFER, rf.gl.DEPTH_COMPONENT16, 512, 512);
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
        Context3D.prototype.setProgramConstantsFromVector = function (variable, data, format) {
            var index = rf.gl.getUniformLocation(this._linkedProgram.program, variable);
            if (index) {
                rf.gl['uniform' + format + 'fv'](index, data);
                ;
            }
        };
        Context3D.prototype.setProgramConstantsFromMatrix = function (variable, matrix) {
            var index = rf.gl.getUniformLocation(this._linkedProgram.program, variable);
            if (index) {
                rf.gl.uniformMatrix4fv(index, false, matrix.rawData);
            }
        };
        Context3D.prototype.setProgram = function (program) {
            if (program == null || program == this._linkedProgram)
                return;
            if (false == program.readly) {
                if (false == program.awaken()) {
                    rf.ThrowError("program create error!");
                    return;
                }
            }
            this._linkedProgram = program;
            rf.gl.useProgram(program.program);
        };
        Context3D.prototype.clear = function (red, green, blue, alpha, depth, stencil, mask) {
            if (red === void 0) { red = 0.0; }
            if (green === void 0) { green = 0.0; }
            if (blue === void 0) { blue = 0.0; }
            if (alpha === void 0) { alpha = 1.0; }
            if (depth === void 0) { depth = 1.0; }
            if (stencil === void 0) { stencil = 0; }
            if (mask === void 0) { mask = 0xffffffff; }
            rf.gl.clearColor(red, green, blue, alpha);
            rf.gl.clearDepth(depth);
            rf.gl.clearStencil(stencil);
            rf.gl.clear(this._clearBit);
        };
        Context3D.prototype.setCulling = function (triangleFaceToCull) {
            rf.gl.frontFace(rf.gl.CW);
            switch (triangleFaceToCull) {
                case Context3DTriangleFace.NONE:
                    rf.gl.disable(rf.gl.CULL_FACE);
                    break;
                case Context3DTriangleFace.BACK:
                    rf.gl.enable(rf.gl.CULL_FACE);
                    rf.gl.cullFace(rf.gl.BACK);
                    break;
                case Context3DTriangleFace.FRONT:
                    rf.gl.enable(rf.gl.CULL_FACE);
                    rf.gl.cullFace(rf.gl.FRONT);
                    break;
                case Context3DTriangleFace.FRONT_AND_BACK:
                    rf.gl.enable(rf.gl.CULL_FACE);
                    rf.gl.cullFace(rf.gl.FRONT_AND_BACK);
                    break;
            }
        };
        Context3D.prototype.setDepthTest = function (depthMask, passCompareMode) {
            if (this._depthDisabled) {
                rf.gl.enable(rf.gl.DEPTH_TEST);
                this._depthDisabled = false;
            }
            rf.gl.depthMask(depthMask);
            rf.gl.depthFunc(passCompareMode);
        };
        Context3D.prototype.setBlendFactors = function (sourceFactor, destinationFactor) {
            if (this._bendDisabled) {
                rf.gl.enable(rf.gl.BLEND);
                this._bendDisabled = false;
            }
            rf.gl.blendFunc(sourceFactor, destinationFactor);
        };
        Context3D.prototype.drawTriangles = function (indexBuffer, firstIndex, numTriangles) {
            if (firstIndex === void 0) { firstIndex = 0; }
            if (numTriangles === void 0) { numTriangles = -1; }
            if (false == indexBuffer.readly) {
                if (false == indexBuffer.awaken()) {
                    throw new Error("create indexBuffer error!");
                }
            }
            rf.gl.bindBuffer(rf.gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
            rf.gl.drawElements(rf.gl.TRIANGLES, numTriangles < 0 ? indexBuffer.numIndices : numTriangles * 3, rf.gl.UNSIGNED_SHORT, firstIndex * 2);
        };
        Context3D.prototype.drawLines = function (indexBuffer, firstIndex, numLines) {
            if (firstIndex === void 0) { firstIndex = 0; }
            if (numLines === void 0) { numLines = -1; }
            if (false == indexBuffer.readly) {
                if (false == indexBuffer.awaken()) {
                    throw new Error("create indexBuffer error!");
                }
            }
            rf.gl.bindBuffer(rf.gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
            rf.gl.drawElements(rf.gl.LINES, numLines < 0 ? indexBuffer.numIndices : numLines * 2, rf.gl.UNSIGNED_SHORT, firstIndex * 2);
        };
        Context3D.prototype.drawPoints = function (indexBuffer, firstIndex, numPoints) {
            if (firstIndex === void 0) { firstIndex = 0; }
            if (numPoints === void 0) { numPoints = -1; }
            if (false == indexBuffer.readly) {
                if (false == indexBuffer.awaken()) {
                    throw new Error("create indexBuffer error!");
                }
            }
            rf.gl.bindBuffer(rf.gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
            rf.gl.drawElements(rf.gl.POINTS, numPoints < 0 ? indexBuffer.numIndices : numPoints, rf.gl.UNSIGNED_SHORT, firstIndex * 2);
        };
        Context3D.prototype.drawLineLoop = function (indexBuffer, firstIndex, numPoints) {
            if (firstIndex === void 0) { firstIndex = 0; }
            if (numPoints === void 0) { numPoints = -1; }
            if (false == indexBuffer.readly) {
                if (false == indexBuffer.awaken()) {
                    throw new Error("create indexBuffer error!");
                }
            }
            rf.gl.bindBuffer(rf.gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
            rf.gl.drawElements(rf.gl.LINE_LOOP, numPoints < 0 ? indexBuffer.numIndices : numPoints, rf.gl.UNSIGNED_SHORT, firstIndex * 2);
        };
        Context3D.prototype.drawLineStrip = function (indexBuffer, firstIndex, numPoints) {
            if (firstIndex === void 0) { firstIndex = 0; }
            if (numPoints === void 0) { numPoints = -1; }
            if (false == indexBuffer.readly) {
                if (false == indexBuffer.awaken()) {
                    throw new Error("create indexBuffer error!");
                }
            }
            rf.gl.bindBuffer(rf.gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
            rf.gl.drawElements(rf.gl.LINE_STRIP, numPoints < 0 ? indexBuffer.numIndices : numPoints, rf.gl.UNSIGNED_SHORT, firstIndex * 2);
        };
        Context3D.prototype.drawTriangleStrip = function (indexBuffer) {
            if (false == indexBuffer.readly) {
                if (false == indexBuffer.awaken()) {
                    throw new Error("create indexBuffer error!");
                }
            }
            rf.gl.bindBuffer(rf.gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
            rf.gl.drawElements(rf.gl.TRIANGLE_STRIP, indexBuffer.numIndices, rf.gl.UNSIGNED_SHORT, 0);
        };
        Context3D.prototype.drawTriangleFan = function (indexBuffer) {
            if (false == indexBuffer.readly) {
                if (false == indexBuffer.awaken()) {
                    throw new Error("create indexBuffer error!");
                }
            }
            rf.gl.bindBuffer(rf.gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
            rf.gl.drawElements(rf.gl.TRIANGLE_FAN, indexBuffer.numIndices, rf.gl.UNSIGNED_SHORT, 0);
        };
        Context3D.prototype.present = function () { };
        return Context3D;
    }());
    rf.Context3D = Context3D;
    function webGLSimpleReport() {
        rf.gl.getParameter(rf.gl.MAX_VERTEX_ATTRIBS);
        rf.gl.getParameter(rf.gl.MAX_VERTEX_UNIFORM_VECTORS);
        rf.gl.getParameter(rf.gl.MAX_FRAGMENT_UNIFORM_VECTORS);
        rf.gl.getParameter(rf.gl.MAX_VARYING_VECTORS);
        rf.gl.getParameter(rf.gl.MAX_TEXTURE_IMAGE_UNITS);
        return {};
    }
    rf.webGLSimpleReport = webGLSimpleReport;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var Stage3D = (function (_super) {
        __extends(Stage3D, _super);
        function Stage3D() {
            var _this = _super.call(this) || this;
            _this.camera2D = new rf.Camera2D();
            _this.renderer = new rf.BatchRenderer(_this);
            _this.mouse = new rf.Mouse();
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
                this.simpleDispatch(rf.EventT.ERROR, "webgl is not available");
                return false;
            }
            rf.context3D = rf.singleton(rf.Context3D);
            canvas.addEventListener('webglcontextlost', this.webglContextLostHandler);
            canvas.addEventListener("webglcontextrestored", this.webglContextRestoredHandler);
            this.mouse.init();
            this.simpleDispatch(rf.EventT.CONTEXT3D_CREATE, rf.gl);
            return true;
        };
        Stage3D.prototype.webglContextLostHandler = function (e) {
            console.log("Lost:" + e);
        };
        Stage3D.prototype.webglContextRestoredHandler = function (e) {
            console.log("RestoredHandler:" + e);
        };
        Stage3D.prototype.update = function (now, interval) {
            if (this.states & rf.DChange.ct) {
                this.updateTransform();
            }
            rf.context3D.clear(0, 0, 0, 1);
            rf.context3D.setBlendFactors(rf.gl.SRC_ALPHA, rf.gl.ONE_MINUS_SRC_ALPHA);
            if (this.camera2D.states) {
                this.camera2D.updateSceneTransform();
            }
            this.render(this.camera2D, now, interval);
        };
        Stage3D.prototype.resize = function (width, height) {
            this.camera2D.resize(width, height);
        };
        Stage3D.names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
        return Stage3D;
    }(rf.Sprite));
    rf.Stage3D = Stage3D;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var AppBase = (function () {
        function AppBase() {
            rf.Engine.start();
            this.createSource();
            rf.ROOT = rf.singleton(rf.Stage3D);
            rf.Engine.addResize(this);
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
            rf.Engine.addTick(this);
        };
        AppBase.prototype.createSource = function () {
            var bmd = new rf.BitmapData(2048, 2048, true);
            var source = new rf.BitmapSource().create("component", bmd, true);
            var vo = source.setSourceVO("origin", 1, 1);
            bmd.fillRect(vo.x, vo.y, vo.w, vo.h, "rgba(255,255,255,255)");
            source.originU = vo.ul;
            source.originV = vo.vt;
            rf.componentSource = source;
        };
        AppBase.prototype.update = function (now, interval) {
            rf.ROOT.update(now, interval);
        };
        AppBase.prototype.resize = function (width, height) {
            rf.ROOT.resize(width, height);
        };
        return AppBase;
    }());
    rf.AppBase = AppBase;
})(rf || (rf = {}));
var rf;
(function (rf) {
    rf.emote_images = {};
    var TextFormat = (function () {
        function TextFormat() {
            this.family = "微软雅黑";
            this.oy = 2;
            this.size = 12;
            this.bold = "normal";
            this.italic = "normal";
        }
        TextFormat.prototype.init = function () {
            this.font = this.bold + " " + this.italic + " " + this.size + "px " + this.family;
            return this;
        };
        TextFormat.prototype.test = function (context, text, out) {
            var _a = this, family = _a.family, size = _a.size, bold = _a.bold, italic = _a.italic;
            context.font = this.font;
            out.x = context.measureText(text).width;
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
            var _a = this, oy = _a.oy, family = _a.family, size = _a.size, bold = _a.bold, italic = _a.italic, stroke = _a.stroke, shadow = _a.shadow, gradient = _a.gradient;
            context.font = this.font;
            if (gradient && gradient.length == 1) {
                context.fillStyle = this.getColorStr(gradient[0].color);
            }
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
            else {
                context.fillStyle = rf.c_white;
            }
            if (shadow) {
                context.shadowColor = this.getColorStr(shadow.color);
                context.shadowBlur = shadow.blur;
                context.shadowOffsetX = shadow.offsetX || 0;
                context.shadowOffsetY = shadow.offsetY || 0;
            }
            if (stroke) {
                context.strokeStyle = this.getColorStr(stroke.color || 0);
                context.lineWidth = stroke.size * 2;
                context.strokeText(text, x, y + h - oy, w);
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
            return format;
        };
        return TextFormat;
    }());
    rf.TextFormat = TextFormat;
    var defalue_format = new TextFormat().init();
    var TextField = (function (_super) {
        __extends(TextField, _super);
        function TextField() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.html = false;
            _this.$text = "";
            _this.gap = 0;
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
                var lines = this.tranfromHtmlElement2CharDefine(element, this.wordWrap ? this.w : Infinity);
                var len = lines.length;
                var oy = 0;
                for (var i = 0; i < len; i++) {
                    var line = lines[i];
                    var textLine = this.textLines[i];
                    if (undefined == textLine) {
                        this.textLines[i] = textLine = rf.recyclable(TextLine);
                    }
                    textLine.y = oy;
                    textLine.source = this.source;
                    textLine.renderText(line);
                    oy += line.h + 4;
                    this.addChild(textLine);
                }
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
        };
        TextField.prototype.getCharSourceVO = function (char, format) {
            var source = this.source;
            var name = format.font + "_" + char;
            var vo = source.getSourceVO(name, 1);
            if (undefined == vo) {
                var p = rf.EMPTY_POINT2D;
                var context = source.bmd.context;
                format.test(context, char, p);
                vo = source.setSourceVO(name, p.x, p.y, 1);
                if (undefined != vo) {
                    format.draw(context, char, vo);
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
            while (html) {
                if (!html.image && !html.str) {
                    html = html.next;
                    continue;
                }
                if (html.image) {
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
                    if (ox && ox + html.image.w > width) {
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
        return TextField;
    }(rf.Sprite));
    rf.TextField = TextField;
    var ImageVO = (function () {
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
    var HtmlElement = (function () {
        function HtmlElement() {
            this.newline = false;
            this.str = undefined;
            this.start = 0;
            this.color = 0;
        }
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
        };
        return HtmlElement;
    }());
    rf.HtmlElement = HtmlElement;
    var regPro = /(color|size|face|href|target|width|height)=(['|"])(.*?)(['|"])/;
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
        o = getTagStr(value);
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
                    html.str = str;
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
                    html.w = image.w;
                    html.h = image.h;
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
                html.w = text.w;
                html.h = text.h;
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
                temp1 = arr[0];
                temp = value.substring(index, _imgtag.lastIndex - temp1.length);
                if (temp) {
                    _strs += temp;
                }
                index = _imgtag.lastIndex;
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
    var Char = (function () {
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
    var Line = (function () {
        function Line() {
            this.w = 0;
            this.h = 0;
            this.chars = [];
        }
        return Line;
    }());
    rf.Line = Line;
    var TextLine = (function (_super) {
        __extends(TextLine, _super);
        function TextLine() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TextLine.prototype.renderText = function (line) {
            this.cleanAll();
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
                    display.y = (h - display.h) >> 1;
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
    var TextALink = (function (_super) {
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
    var PerspectiveMatrix3D = (function (_super) {
        __extends(PerspectiveMatrix3D, _super);
        function PerspectiveMatrix3D() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PerspectiveMatrix3D.prototype.lookAtLH = function (eye, at, up) {
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
            var xX = upy * zZ - upz * zY;
            var xY = upz * zX - upx * zZ;
            var xZ = upx * zY - upy * zX;
            len = 1 / sqrt(xX * xX + xY * xY + xZ * xZ);
            xX *= len;
            xY *= len;
            xZ *= len;
            var yX = zY * xZ - zZ * xY;
            var yY = zZ * xX - zX * xZ;
            var yZ = zX * xY - zY * xX;
            this.copyRawDataFrom([
                xX, xY, xZ, -(xX * eyex + xY * eyey + xZ * eyez),
                yX, yY, yZ, -(yX * eyex + yY * eyey + yZ * eyez),
                zX, zY, zZ, -(zX * eyex + zY * eyey + zZ * eyez),
                0.0, 0.0, 0.0, 1.0
            ]);
        };
        PerspectiveMatrix3D.prototype.lookAtRH = function (eye, at, up) {
            var sqrt = Math.sqrt;
            var eyex = eye.x, eyey = eye.y, eyez = eye.z;
            var upx = up.x, upy = up.y, upz = up.z;
            var zX = eyex - at.x;
            var zY = eyey - at.y;
            var zZ = eyez - at.z;
            var len = 1 / sqrt(zX * zX + zY * zY + zZ * zZ);
            zX *= len;
            zY *= len;
            zZ *= len;
            var xX = upy * zZ - upz * zY;
            var xY = upz * zX - upx * zZ;
            var xZ = upx * zY - upy * zX;
            len = 1 / sqrt(xX * xX + xY * xY + xZ * xZ);
            xX *= len;
            xY *= len;
            xZ *= len;
            var yX = zY * xZ - zZ * xY;
            var yY = zZ * xX - zX * xZ;
            var yZ = zX * xY - zY * xX;
            this.copyRawDataFrom([
                xX, xY, xZ, -(xX * eyex + xY * eyey + xZ * eyez),
                yX, yY, yZ, -(yX * eyex + yY * eyey + yZ * eyez),
                zX, zY, zZ, -(zX * eyex + zY * eyey + zZ * eyez),
                0.0, 0.0, 0.0, 1.0
            ]);
        };
        PerspectiveMatrix3D.prototype.perspectiveOffCenterLH = function (left, right, bottom, top, zNear, zFar) {
            this.copyRawDataFrom([
                2.0 * zNear / (right - left), 0.0, (left + right) / (left - right), 0.0,
                0.0, 2.0 * zNear / (top - bottom), (bottom + top) / (bottom - top), 0.0,
                0.0, 0.0, (zFar + zNear) / (zFar - zNear), 2.0 * zFar * zNear / (zNear - zFar),
                0.0, 0.0, 1.0, 0.0
            ]);
        };
        PerspectiveMatrix3D.prototype.perspectiveLH = function (width, height, zNear, zFar) {
            this.copyRawDataFrom([
                2.0 * zNear / width, 0.0, 0.0, 0.0,
                0.0, 2.0 * zNear / height, 0.0, 0.0,
                0.0, 0.0, (zFar + zNear) / (zFar - zNear), 2.0 * zFar * zNear / (zNear - zFar),
                0.0, 0.0, 1.0, 0.0
            ]);
        };
        PerspectiveMatrix3D.prototype.perspectiveFieldOfViewLH = function (fieldOfViewY, aspectRatio, zNear, zFar) {
            var yScale = 1.0 / Math.tan(fieldOfViewY / 2.0);
            var xScale = yScale / aspectRatio;
            this.copyRawDataFrom([
                xScale, 0.0, 0.0, 0.0,
                0.0, yScale, 0.0, 0.0,
                0.0, 0.0, (zFar + zNear) / (zFar - zNear), 2.0 * zFar * zNear / (zNear - zFar),
                0.0, 0.0, 1.0, 0.0
            ]);
        };
        PerspectiveMatrix3D.prototype.orthoOffCenterLH = function (left, right, bottom, top, zNear, zFar) {
            this.copyRawDataFrom([
                2.0 / (right - left), 0.0, 0.0, (left + right) / (left - right),
                0.0, 2.0 / (top - bottom), 0.0, (bottom + top) / (bottom - top),
                0.0, 0.0, 2 / (zFar - zNear), (zNear + zFar) / (zNear - zFar),
                0.0, 0.0, 0.0, 1.0
            ]);
        };
        PerspectiveMatrix3D.prototype.orthoLH = function (width, height, zNear, zFar) {
            this.copyRawDataFrom([
                2.0 / width, 0.0, 0.0, 0.0,
                0.0, 2.0 / height, 0.0, 0.0,
                0.0, 0.0, 2 / (zFar - zNear), (zNear + zFar) / (zNear - zFar),
                0.0, 0.0, 0.0, 1.0
            ]);
        };
        PerspectiveMatrix3D.prototype.perspectiveOffCenterRH = function (left, right, bottom, top, zNear, zFar) {
            this.copyRawDataFrom([
                2.0 * zNear / (right - left), 0.0, (right + left) / (right - left), 0.0,
                0.0, 2.0 * zNear / (top - bottom), (top + bottom) / (top - bottom), 0.0,
                0.0, 0.0, (zNear + zFar) / (zNear - zFar), 2.0 * zNear * zFar / (zNear - zFar),
                0.0, 0.0, -1.0, 0.0
            ]);
        };
        PerspectiveMatrix3D.prototype.perspectiveRH = function (width, height, zNear, zFar) {
            this.copyRawDataFrom([
                2.0 * zNear / width, 0.0, 0.0, 0.0,
                0.0, 2.0 * zNear / height, 0.0, 0.0,
                0.0, 0.0, (zNear + zFar) / (zNear - zFar), 2.0 * zNear * zFar / (zNear - zFar),
                0.0, 0.0, -1.0, 0.0
            ]);
        };
        PerspectiveMatrix3D.prototype.perspectiveFieldOfViewRH = function (fieldOfViewY, aspectRatio, zNear, zFar) {
            var yScale = 1.0 / Math.tan(fieldOfViewY / 2.0);
            var xScale = yScale / aspectRatio;
            this.copyRawDataFrom([
                xScale, 0.0, 0.0, 0.0,
                0.0, yScale, 0.0, 0.0,
                0.0, 0.0, (zFar + zNear) / (zNear - zFar), 2.0 * zNear * zFar / (zNear - zFar),
                0.0, 0.0, -1.0, 0.0
            ]);
        };
        PerspectiveMatrix3D.prototype.orthoOffCenterRH = function (left, right, bottom, top, zNear, zFar) {
            this.copyRawDataFrom([
                2.0 / (right - left), 0.0, 0.0, (left + right) / (left - right),
                0.0, 2.0 / (top - bottom), 0.0, (bottom + top) / (bottom - top),
                0.0, 0.0, -2.0 / (zFar - zNear), (zNear + zFar) / (zNear - zFar),
                0.0, 0.0, 0.0, 1.0
            ]);
        };
        PerspectiveMatrix3D.prototype.orthoRH = function (width, height, zNear, zFar) {
            this.copyRawDataFrom([
                2.0 / width, 0.0, 0.0, 0.0,
                0.0, 2.0 / height, 0.0, 0.0,
                0.0, 0.0, -2.0 / (zFar - zNear), (zNear + zFar) / (zNear - zFar),
                0.0, 0.0, 0.0, 1.0
            ]);
        };
        return PerspectiveMatrix3D;
    }(rf.Matrix3D));
    rf.PerspectiveMatrix3D = PerspectiveMatrix3D;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var Mouse = (function () {
        function Mouse() {
        }
        Mouse.prototype.init = function () {
            var canvas = rf.ROOT.canvas;
            canvas.onmousedown = this.mouseHanlder;
            canvas.onmouseup = this.mouseHanlder;
            canvas.onmousewheel = this.mouseHanlder;
            canvas.onmousemove = this.mouseMoveHandler;
            canvas.ontouchstart = this.touchHandler;
            canvas.ontouchmove = this.touchHandler;
            canvas.ontouchend = this.touchHandler;
            canvas.ontouchcancel = this.touchHandler;
        };
        Mouse.prototype.mouseHanlder = function (e) {
            var d;
            var now = rf.engineNow;
            if (this.preMouseTime != now) {
                this.preMouseTime = now;
                d = rf.ROOT.getObjectByPoint(e.clientX, e.clientY, 1);
            }
            else {
                d = this.preTarget;
            }
            if (undefined != d) {
                var type = e.type;
                if (type == rf.MouseEventX.MouseDown) {
                    this.clickTarget = d;
                    this.preMouseDownTime = now;
                }
                else if (type == rf.MouseEventX.MouseUp) {
                    d.simpleDispatch(e.type, event, true);
                    if (this.clickTarget != d) {
                        this.clickTarget = null;
                        this.preMouseDownTime = 0;
                    }
                    else if (now - this.preMouseDownTime < 500) {
                        d.simpleDispatch(rf.MouseEventX.CLICK, e, true);
                    }
                    return;
                }
                d.simpleDispatch(e.type, e, true);
            }
        };
        Mouse.prototype.mouseMoveHandler = function (e) {
            if (this.preMoveTime == rf.engineNow) {
                return;
            }
            var d = rf.ROOT.getObjectByPoint(e.clientX, e.clientY, 1);
            if (undefined != d) {
                d.simpleDispatch(rf.MouseEventX.MouseMove, e, true);
            }
        };
        Mouse.prototype.touchHandler = function (e) {
            console.log(e);
        };
        return Mouse;
    }());
    rf.Mouse = Mouse;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var Ease = (function () {
        function Ease() {
        }
        Ease.getValue = function (v0, v1, ratio) {
            if (v0 == v1 || ratio == 0 || ratio == 1 || (typeof v0 != "number")) {
                return ratio == 1 ? v1 : v0;
            }
            else {
                return v0 + (v1 - v0) * ratio;
            }
        };
        Ease.get = function (amount) {
            if (amount < -1) {
                amount = -1;
            }
            if (amount > 1) {
                amount = 1;
            }
            return function (t) {
                if (amount == 0) {
                    return t;
                }
                if (amount < 0) {
                    return t * (t * -amount + 1 + amount);
                }
                return t * ((2 - t) * amount + (1 - amount));
            };
        };
        Ease.getPowIn = function (pow) {
            return function (t) {
                return Math.pow(t, pow);
            };
        };
        Ease.getPowOut = function (pow) {
            return function (t) {
                return 1 - Math.pow(1 - t, pow);
            };
        };
        Ease.getPowInOut = function (pow) {
            return function (t) {
                if ((t *= 2) < 1)
                    return 0.5 * Math.pow(t, pow);
                return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
            };
        };
        Ease.sineIn = function (t) {
            return 1 - Math.cos(t * Math.PI / 2);
        };
        Ease.sineOut = function (t) {
            return Math.sin(t * Math.PI / 2);
        };
        Ease.sineInOut = function (t) {
            return -0.5 * (Math.cos(Math.PI * t) - 1);
        };
        Ease.getBackIn = function (amount) {
            return function (t) {
                return t * t * ((amount + 1) * t - amount);
            };
        };
        Ease.getBackOut = function (amount) {
            return function (t) {
                return (--t * t * ((amount + 1) * t + amount) + 1);
            };
        };
        Ease.getBackInOut = function (amount) {
            amount *= 1.525;
            return function (t) {
                if ((t *= 2) < 1)
                    return 0.5 * (t * t * ((amount + 1) * t - amount));
                return 0.5 * ((t -= 2) * t * ((amount + 1) * t + amount) + 2);
            };
        };
        Ease.circIn = function (t) {
            return -(Math.sqrt(1 - t * t) - 1);
        };
        Ease.circOut = function (t) {
            return Math.sqrt(1 - (--t) * t);
        };
        Ease.circInOut = function (t) {
            if ((t *= 2) < 1) {
                return -0.5 * (Math.sqrt(1 - t * t) - 1);
            }
            return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
        };
        Ease.bounceIn = function (t) {
            return 1 - Ease.bounceOut(1 - t);
        };
        Ease.bounceOut = function (t) {
            if (t < 1 / 2.75) {
                return (7.5625 * t * t);
            }
            else if (t < 2 / 2.75) {
                return (7.5625 * (t -= 1.5 / 2.75) * t + 0.75);
            }
            else if (t < 2.5 / 2.75) {
                return (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375);
            }
            else {
                return (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
            }
        };
        Ease.bounceInOut = function (t) {
            if (t < 0.5)
                return Ease.bounceIn(t * 2) * .5;
            return Ease.bounceOut(t * 2 - 1) * 0.5 + 0.5;
        };
        Ease.getElasticIn = function (amplitude, period) {
            return function (t) {
                if (t == 0 || t == 1)
                    return t;
                var s = period / rf.PI2 * Math.asin(1 / amplitude);
                return -(amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * rf.PI2 / period));
            };
        };
        Ease.getElasticOut = function (amplitude, period) {
            return function (t) {
                if (t == 0 || t == 1)
                    return t;
                var s = period / rf.PI2 * Math.asin(1 / amplitude);
                return (amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * rf.PI2 / period) + 1);
            };
        };
        Ease.getElasticInOut = function (amplitude, period) {
            return function (t) {
                var s = period / rf.PI2 * Math.asin(1 / amplitude);
                if ((t *= 2) < 1)
                    return -0.5 * (amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * rf.PI2 / period));
                return amplitude * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * rf.PI2 / period) * 0.5 + 1;
            };
        };
        Ease.quadIn = Ease.getPowIn(2);
        Ease.quadOut = Ease.getPowOut(2);
        Ease.quadInOut = Ease.getPowInOut(2);
        Ease.cubicIn = Ease.getPowIn(3);
        Ease.cubicOut = Ease.getPowOut(3);
        Ease.cubicInOut = Ease.getPowInOut(3);
        Ease.quartIn = Ease.getPowIn(4);
        Ease.quartOut = Ease.getPowOut(4);
        Ease.quartInOut = Ease.getPowInOut(4);
        Ease.quintIn = Ease.getPowIn(5);
        Ease.quintOut = Ease.getPowOut(5);
        Ease.quintInOut = Ease.getPowInOut(5);
        Ease.backIn = Ease.getBackIn(1.7);
        Ease.backOut = Ease.getBackOut(1.7);
        Ease.backInOut = Ease.getBackInOut(1.7);
        Ease.elasticIn = Ease.getElasticIn(1, 0.3);
        Ease.elasticOut = Ease.getElasticOut(1, 0.3);
        Ease.elasticInOut = Ease.getElasticInOut(1, 0.3 * 1.5);
        return Ease;
    }());
    rf.Ease = Ease;
})(rf || (rf = {}));
var rf;
(function (rf) {
    rf.MotionGuidePlugin = (function () {
        return {
            priority: 0,
            install: function (manager) {
                manager.installPlugin(this, ["guide", "x", "y", "rotation"]);
            },
            init: function (tween, prop, value) {
                var target = tween.target;
                if (target.x == undefined) {
                    target.x = 0;
                }
                if (target.y == undefined) {
                    target.y = 0;
                }
                if (target.rotation == undefined) {
                    target.rotation = 0;
                }
                if (prop == "rotation") {
                    tween.__needsRot = true;
                }
                return prop == "guide" ? null : value;
            },
            step: function (tween, prop, startValue, endValue, injectProps) {
                if (prop == "rotation") {
                    tween.__rotGlobalS = startValue;
                    tween.__rotGlobalE = endValue;
                    testRotData(tween, injectProps);
                }
                if (prop != "guide") {
                    return endValue;
                }
                var temp, data = endValue;
                if (!data.hasOwnProperty("path")) {
                    data.path = [];
                }
                var path = data.path;
                if (!data.hasOwnProperty("end")) {
                    data.end = 1;
                }
                if (!data.hasOwnProperty("start")) {
                    data.start = (startValue && startValue.hasOwnProperty("end") && startValue.path === path) ? startValue.end : 0;
                }
                if (data.hasOwnProperty("_segments") && data._length) {
                    return endValue;
                }
                var l = path.length;
                var accuracy = 10;
                if (l >= 6 && (l - 2) % 4 == 0) {
                    data._segments = [];
                    data._length = 0;
                    for (var i = 2; i < l; i += 4) {
                        var sx = path[i - 2], sy = path[i - 1];
                        var cx = path[i + 0], cy = path[i + 1];
                        var ex = path[i + 2], ey = path[i + 3];
                        var oldX = sx, oldY = sy;
                        var tempX, tempY, total = 0;
                        var sublines = [];
                        for (var j = 1; j <= accuracy; j++) {
                            var t = j / accuracy;
                            var inv = 1 - t;
                            tempX = inv * inv * sx + 2 * inv * t * cx + t * t * ex;
                            tempY = inv * inv * sy + 2 * inv * t * cy + t * t * ey;
                            total += sublines[sublines.push(Math.sqrt((temp = tempX - oldX) * temp + (temp = tempY - oldY) * temp)) - 1];
                            oldX = tempX;
                            oldY = tempY;
                        }
                        data._segments.push(total);
                        data._segments.push(sublines);
                        data._length += total;
                    }
                }
                else {
                    throw ("invalid 'path' data, please see documentation for valid paths");
                }
                temp = data.orient;
                data.orient = true;
                var o = {};
                calc(data, data.start, o);
                tween.__rotPathS = Number(o.rotation.toFixed(5));
                calc(data, data.end, o);
                tween.__rotPathE = Number(o.rotation.toFixed(5));
                data.orient = false;
                calc(data, data.end, injectProps);
                data.orient = temp;
                if (!data.orient) {
                    return endValue;
                }
                tween.__guideData = data;
                testRotData(tween, injectProps);
                return endValue;
            },
            tween: function (tween, prop, value, startValues, endValues, ratio, wait, end) {
                var data = endValues.guide;
                if (data == undefined || data === startValues.guide) {
                    return value;
                }
                if (data.lastRatio != ratio) {
                    var t = ((data.end - data.start) * (wait ? data.end : ratio) + data.start);
                    calc(data, t, tween.target);
                    switch (data.orient) {
                        case "cw":
                        case "ccw":
                        case "auto":
                            tween.target.rotation += data.rotOffS + data.rotDelta * ratio || 0;
                            break;
                        case "fixed":
                        default:
                            tween.target.rotation += data.rotOffS || 0;
                            break;
                    }
                    data.lastRatio = ratio;
                }
                if (prop == "rotation" && ((!data.orient) || data.orient == "false")) {
                    return value;
                }
                return tween.target[prop];
            }
        };
        function testRotData(tween, injectProps) {
            if (tween.__rotGlobalS === undefined || tween.__rotGlobalE === undefined) {
                if (tween.__needsRot) {
                    return;
                }
                var _curQueueProps = tween._curQueueProps;
                if (_curQueueProps.rotation !== undefined) {
                    tween.__rotGlobalS = tween.__rotGlobalE = _curQueueProps.rotation;
                }
                else {
                    tween.__rotGlobalS = tween.__rotGlobalE = injectProps.rotation = tween.target.rotation || 0;
                }
            }
            if (tween.__guideData === undefined) {
                return;
            }
            var data = tween.__guideData;
            var rotGlobalD = tween.__rotGlobalE - tween.__rotGlobalS || 0;
            var rotPathD = tween.__rotPathE - tween.__rotPathS || 0;
            var rot = rotGlobalD - rotPathD || 0;
            if (data.orient == "auto") {
                if (rot > 180) {
                    rot -= 360;
                }
                else if (rot < -180) {
                    rot += 360;
                }
            }
            else if (data.orient == "cw") {
                while (rot < 0) {
                    rot += 360;
                }
                if (rot == 0 && rotGlobalD > 0 && rotGlobalD != 180) {
                    rot += 360;
                }
            }
            else if (data.orient == "ccw") {
                rot = rotGlobalD - ((rotPathD > 180) ? (360 - rotPathD) : (rotPathD));
                while (rot > 0) {
                    rot -= 360;
                }
                if (rot == 0 && rotGlobalD < 0 && rotGlobalD != -180) {
                    rot -= 360;
                }
            }
            data.rotDelta = rot;
            data.rotOffS = tween.__rotGlobalS - tween.__rotPathS;
            tween.__rotGlobalS = tween.__rotGlobalE = tween.__guideData = tween.__needsRot = undefined;
        }
        function calc(data, ratio, target) {
            if (data._segments == undefined) {
                throw ("Missing critical pre-calculated information, please file a bug");
            }
            if (target == undefined) {
                target = { x: 0, y: 0, rotation: 0 };
            }
            var seg = data._segments;
            var path = data.path;
            var pos = data._length * ratio;
            var cap = seg.length - 2;
            var n = 0;
            while (pos > seg[n] && n < cap) {
                pos -= seg[n];
                n += 2;
            }
            var sublines = seg[n + 1];
            var i = 0;
            cap = sublines.length - 1;
            while (pos > sublines[i] && i < cap) {
                pos -= sublines[i];
                i++;
            }
            var t = (i / ++cap) + (pos / (cap * sublines[i]));
            n = (n * 2) + 2;
            var inv = 1 - t;
            target.x = inv * inv * path[n - 2] + 2 * inv * t * path[n + 0] + t * t * path[n + 2];
            target.y = inv * inv * path[n - 1] + 2 * inv * t * path[n + 1] + t * t * path[n + 3];
            if (data.orient) {
                target.rotation = 57.2957795 * Math.atan2((path[n + 1] - path[n - 1]) * inv + (path[n + 3] - path[n + 1]) * t, (path[n + 0] - path[n - 2]) * inv + (path[n + 2] - path[n + 0]) * t);
            }
            return target;
        }
        ;
    })();
})(rf || (rf = {}));
var rf;
(function (rf) {
    var Tween = (function (_super) {
        __extends(Tween, _super);
        function Tween(target, props, pluginData, manager) {
            var _this = _super.call(this) || this;
            _this.loop = false;
            _this.duration = 0;
            _this._prevPos = -1;
            _this.position = null;
            _this._prevPosition = 0;
            _this._stepPosition = 0;
            _this.passive = false;
            _this.initialize(target, props, pluginData, manager);
            return _this;
        }
        Tween.prototype.initialize = function (target, props, pluginData, manager) {
            this.target = target;
            var oldManager = this._manager;
            if (oldManager && oldManager != manager) {
                oldManager.removeTweens(target);
            }
            if (props) {
                this._useTicks = props.useTicks;
                this.ignoreGlobalPause = props.ignoreGlobalPause;
                this.loop = props.loop;
                props.onChange && this.addEventListener(rf.EventT.CHANGE, props.onChange, props.onChangeObj);
                if (props.override) {
                    manager.removeTweens(target);
                }
                this._int = props.int;
            }
            this._manager = manager;
            this.pluginData = pluginData || {};
            this._curQueueProps = {};
            this._initQueueProps = {};
            this._steps = [];
            this._actions = [];
            if (props && props.paused) {
                this.paused = true;
            }
            else {
                manager._register(this, true);
            }
            if (props && props.position != null) {
                this.setPosition(props.position, 0);
            }
        };
        Tween.prototype.setPosition = function (value, actionsMode) {
            if (actionsMode === void 0) { actionsMode = 1; }
            if (value < 0) {
                value = 0;
            }
            var t = value;
            var end = false;
            if (t >= this.duration) {
                if (this.loop) {
                    t = t % this.duration;
                }
                else {
                    t = this.duration;
                    end = true;
                }
            }
            if (t == this._prevPos) {
                return end;
            }
            var prevPos = this._prevPos;
            this.position = this._prevPos = t;
            this._prevPosition = value;
            if (this.target) {
                if (end) {
                    this._updateTargetProps(null, 1);
                }
                else if (this._steps.length > 0) {
                    for (var i = 0, l = this._steps.length; i < l; i++) {
                        if (this._steps[i].t > t) {
                            break;
                        }
                    }
                    var step = this._steps[i - 1];
                    this._updateTargetProps(step, (this._stepPosition = t - step.t) / step.d);
                }
            }
            if (end) {
                this.setPaused(true);
            }
            if (actionsMode != 0 && this._actions.length > 0) {
                if (this._useTicks) {
                    this._runActions(t, t);
                }
                else if (actionsMode == 1 && t < prevPos) {
                    if (prevPos != this.duration) {
                        this._runActions(prevPos, this.duration);
                    }
                    this._runActions(0, t, true);
                }
                else {
                    this._runActions(prevPos, t);
                }
            }
            this.simpleDispatch(rf.EventT.CHANGE);
            return end;
        };
        Tween.prototype._runActions = function (startPos, endPos, includeStart) {
            if (includeStart === void 0) { includeStart = false; }
            var sPos = startPos;
            var ePos = endPos;
            var i = -1;
            var j = this._actions.length;
            var k = 1;
            if (startPos > endPos) {
                sPos = endPos;
                ePos = startPos;
                i = j;
                j = k = -1;
            }
            while ((i += k) != j) {
                var action = this._actions[i];
                var pos = action.t;
                if (pos == ePos || (pos > sPos && pos < ePos) || (includeStart && pos == startPos)) {
                    action.f.apply(action.o, action.p);
                }
            }
        };
        Tween.prototype._updateTargetProps = function (step, ratio) {
            var p0, p1, v, v0, v1, arr;
            if (!step && ratio == 1) {
                this.passive = false;
                p0 = p1 = this._curQueueProps;
            }
            else {
                this.passive = !!step.v;
                if (this.passive) {
                    return;
                }
                if (step.e) {
                    ratio = step.e(ratio, 0, 1, 1);
                }
                p0 = step.p0;
                p1 = step.p1;
            }
            for (var n in this._initQueueProps) {
                if ((v0 = p0[n]) == null) {
                    p0[n] = v0 = this._initQueueProps[n];
                }
                if ((v1 = p1[n]) == null) {
                    p1[n] = v1 = v0;
                }
                if (v0 == v1 || ratio == 0 || ratio == 1 || (typeof v0 != "number")) {
                    v = ratio == 1 ? v1 : v0;
                }
                else {
                    v = v0 + (v1 - v0) * ratio;
                }
                var ignore = false;
                if (arr = this._manager._plugins[n]) {
                    for (var i = 0, l = arr.length; i < l; i++) {
                        var v2 = arr[i].tween(this, n, v, p0, p1, ratio, !!step && p0 == p1, !step);
                        if (v2 == Tween.IGNORE) {
                            ignore = true;
                        }
                        else {
                            v = v2;
                        }
                    }
                }
                if (!ignore) {
                    if (this._int && this._int[n])
                        v = Math.round(v);
                    this.target[n] = v;
                }
            }
        };
        Tween.prototype._addStep = function (o) {
            if (o.d > 0) {
                this._steps.push(o);
                o.t = this.duration;
                this.duration += o.d;
            }
            return this;
        };
        Tween.prototype._appendQueueProps = function (o) {
            var arr, oldValue, i, l, injectProps;
            for (var n in o) {
                if (this._initQueueProps[n] === undefined) {
                    oldValue = this.target[n];
                    if (arr = this._manager._plugins[n]) {
                        for (i = 0, l = arr.length; i < l; i++) {
                            oldValue = arr[i].init(this, n, oldValue);
                        }
                    }
                    this._initQueueProps[n] = this._curQueueProps[n] = (oldValue === undefined) ? null : oldValue;
                }
                else {
                    oldValue = this._curQueueProps[n];
                }
            }
            for (var n in o) {
                oldValue = this._curQueueProps[n];
                if (arr = this._manager._plugins[n]) {
                    injectProps = injectProps || {};
                    for (i = 0, l = arr.length; i < l; i++) {
                        if (arr[i].step) {
                            arr[i].step(this, n, oldValue, o[n], injectProps);
                        }
                    }
                }
                this._curQueueProps[n] = o[n];
            }
            if (injectProps) {
                this._appendQueueProps(injectProps);
            }
            return this._curQueueProps;
        };
        Tween.prototype._addAction = function (o) {
            o.t = this.duration;
            this._actions.push(o);
            return this;
        };
        Tween.prototype._set = function (props, o) {
            for (var n in props) {
                o[n] = props[n];
            }
        };
        Tween.prototype.setPaused = function (value) {
            this.paused = value;
            this._manager._register(this, !value);
            return this;
        };
        Tween.prototype.wait = function (duration, passive) {
            if (duration == null || duration <= 0) {
                return this;
            }
            var o = this._curQueueProps.clone();
            return this._addStep({ d: duration, p0: o, p1: o, v: passive });
        };
        Tween.prototype.to = function (props, duration, ease) {
            if (isNaN(duration) || duration < 0) {
                duration = 0;
            }
            return this._addStep({ d: duration || 0, p0: this._curQueueProps.clone(), e: ease, p1: this._appendQueueProps(props).clone() });
        };
        Tween.prototype.call = function (callback, thisObj) {
            var params = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                params[_i - 2] = arguments[_i];
            }
            return this._addAction({ f: callback, p: params, o: thisObj ? thisObj : this.target });
        };
        Tween.prototype.set = function (props, target) {
            return this._addAction({ f: this._set, o: this, p: [props, target || this.target] });
        };
        Tween.prototype.play = function (tween) {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, tween, false);
        };
        Tween.prototype.pause = function (tween) {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, tween, true);
        };
        Tween.prototype.tick = function (delta) {
            if (this.paused) {
                return;
            }
            this.setPosition(this._prevPosition + delta);
        };
        Tween.prototype.onRecycle = function () {
            this._int = undefined;
        };
        Tween.IGNORE = {};
        return Tween;
    }(rf.MiniDispatcher));
    rf.Tween = Tween;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var TweenManager = (function () {
        function TweenManager() {
            this._tweens = [];
            this._plugins = {};
        }
        TweenManager.prototype.get = function (target, props, pluginData, override) {
            if (override) {
                this.removeTweens(target);
            }
            return new rf.Tween(target, props, pluginData, this);
        };
        TweenManager.prototype.removeTweens = function (target) {
            if (!target.tween_count) {
                return;
            }
            var tweens = this._tweens;
            var j = 0;
            for (var i = 0, len = tweens.length; i < len; i++) {
                var tween = tweens[i];
                if (tween.target == target) {
                    tween.paused = true;
                    tween.onRecycle();
                }
                else {
                    tweens[j++] = tween;
                }
            }
            tweens.length = j;
            target.tween_count = 0;
        };
        TweenManager.prototype.removeTween = function (twn) {
            if (!twn) {
                return;
            }
            var tweens = this._tweens;
            for (var i = tweens.length - 1; i >= 0; i--) {
                var tween = tweens[i];
                if (tween == twn) {
                    tween.paused = true;
                    tweens.splice(i, 1);
                    tween.onRecycle();
                    break;
                }
            }
        };
        TweenManager.prototype.pauseTweens = function (target) {
            if (!target.tween_count) {
                return;
            }
            var tweens = this._tweens;
            for (var i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i].target == target) {
                    tweens[i].paused = true;
                }
            }
        };
        TweenManager.prototype.resumeTweens = function (target) {
            if (!target.tween_count) {
                return;
            }
            var tweens = this._tweens;
            for (var i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i].target == target) {
                    tweens[i].paused = false;
                }
            }
        };
        TweenManager.prototype.tick = function (delta, paused) {
            if (!this._tweens.length) {
                return;
            }
            var tweens = this._tweens.concat();
            for (var i = tweens.length - 1; i >= 0; i--) {
                var tween = tweens[i];
                if ((paused && !tween.ignoreGlobalPause) || tween.paused) {
                    continue;
                }
                tween.tick(tween._useTicks ? 1 : delta);
            }
        };
        TweenManager.prototype._register = function (tween, value) {
            var target = tween.target;
            var tweens = this._tweens;
            if (value && !tween._registered) {
                if (target) {
                    target.tween_count = target.tween_count > 0 ? target.tween_count + 1 : 1;
                }
                tweens.push(tween);
            }
            else {
                if (target) {
                    target.tween_count--;
                }
                var i = tweens.length;
                while (i--) {
                    if (tweens[i] == tween) {
                        tweens.splice(i, 1);
                        tween.onRecycle();
                        return;
                    }
                }
            }
        };
        TweenManager.prototype.removeAllTweens = function () {
            var tweens = this._tweens;
            for (var i = 0, l = tweens.length; i < l; i++) {
                var tween = tweens[i];
                tween.paused = true;
                tween.onRecycle();
                tween.target.tweenjs_count = 0;
            }
            tweens.length = 0;
        };
        TweenManager.prototype.hasActiveTweens = function (target) {
            if (target) {
                return target.tweenjs_count != null && !!target.tweenjs_count;
            }
            return this._tweens && !!this._tweens.length;
        };
        TweenManager.prototype.installPlugin = function (plugin, properties) {
            var priority = plugin.priority;
            if (priority == null) {
                plugin.priority = priority = 0;
            }
            for (var i = 0, l = properties.length, p = this._plugins; i < l; i++) {
                var n = properties[i];
                if (!p[n]) {
                    p[n] = [plugin];
                }
                else {
                    var arr = p[n];
                    for (var j = 0, jl = arr.length; j < jl; j++) {
                        if (priority < arr[j].priority) {
                            break;
                        }
                    }
                    p[n].splice(j, 0, plugin);
                }
            }
        };
        return TweenManager;
    }());
    rf.TweenManager = TweenManager;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var Dc_Texture = (function () {
        function Dc_Texture() {
            this._url = "http://shushanh5.com/web/data/zhcn/o/server/logo.png";
            rf.loadRes(this._url, this.onComplete, this, rf.ResType.image, rf.LoadPriority.low, false);
        }
        Dc_Texture.prototype.onComplete = function (e) {
            if (e.type != rf.EventT.COMPLETE) {
                return;
            }
            var res = e.data;
            this.image = res.data;
            if (!this.image) {
                return;
            }
            this.init();
            this.render3();
        };
        Dc_Texture.prototype.init = function () {
            this.vertexCode =
                "\n                attribute vec3 pos;\n                attribute vec2 uv;\n                uniform mat4 mvp;\n                varying vec2 v_TexCoord;\n                void main(void){\n                    vec4 temp = vec4(pos,1.0);\n                    gl_Position = mvp * temp;\n                    v_TexCoord = uv;\n                }\n            ";
            this.fragmentCode = "\n                precision mediump float;\n                uniform sampler2D diff;\n                varying vec2 v_TexCoord;\n                void main(void){\n                    gl_FragColor = texture2D(diff, v_TexCoord);\n                }\n            ";
            var w = this.image.width;
            var h = this.image.height;
            this.vertexData = new Float32Array([
                0, 0, 0.0, 0.0,
                w, 0, 1.0, 0.0,
                w, h, 1.0, 1.0,
                0, h, 0.0, 1.0
            ]);
            this.indexData = new Uint16Array([0, 1, 3, 1, 2, 3]);
            var info = new rf.VertexInfo(this.vertexData, 4);
            info.regVariable(rf.VA.pos, 0, 2);
            info.regVariable(rf.VA.uv, 2, 2);
            this.vertexInfo = info;
        };
        Dc_Texture.prototype.renderWebGL = function () {
            var vertexShader = rf.gl.createShader(rf.gl.VERTEX_SHADER);
            var fragmentShader = rf.gl.createShader(rf.gl.FRAGMENT_SHADER);
            rf.gl.shaderSource(vertexShader, this.vertexCode);
            rf.gl.shaderSource(fragmentShader, this.fragmentCode);
            rf.gl.compileShader(vertexShader);
            rf.gl.compileShader(fragmentShader);
            var program = rf.gl.createProgram();
            rf.gl.attachShader(program, vertexShader);
            rf.gl.attachShader(program, fragmentShader);
            rf.gl.linkProgram(program);
            rf.gl.useProgram(program);
            var vertexbuffer = rf.gl.createBuffer();
            rf.gl.bindBuffer(rf.gl.ARRAY_BUFFER, vertexbuffer);
            rf.gl.bufferData(rf.gl.ARRAY_BUFFER, this.vertexData, rf.gl.STATIC_DRAW);
            rf.gl.bindBuffer(rf.gl.ARRAY_BUFFER, null);
            var indexBuffer = rf.gl.createBuffer();
            rf.gl.bindBuffer(rf.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            rf.gl.bufferData(rf.gl.ELEMENT_ARRAY_BUFFER, this.indexData, rf.gl.STATIC_DRAW);
            rf.gl.bindBuffer(rf.gl.ELEMENT_ARRAY_BUFFER, null);
            var tex = rf.gl.createTexture();
            rf.gl.activeTexture(rf.gl.TEXTURE0);
            rf.gl.bindTexture(rf.gl.TEXTURE_2D, tex);
            rf.gl.texParameteri(rf.gl.TEXTURE_2D, rf.gl.TEXTURE_MIN_FILTER, rf.gl.NEAREST);
            rf.gl.texParameteri(rf.gl.TEXTURE_2D, rf.gl.TEXTURE_MAG_FILTER, rf.gl.NEAREST);
            rf.gl.texParameteri(rf.gl.TEXTURE_2D, rf.gl.TEXTURE_WRAP_S, rf.gl.CLAMP_TO_EDGE);
            rf.gl.texParameteri(rf.gl.TEXTURE_2D, rf.gl.TEXTURE_WRAP_T, rf.gl.CLAMP_TO_EDGE);
            rf.gl.texImage2D(rf.gl.TEXTURE_2D, 0, rf.gl.RGB, rf.gl.RGB, rf.gl.UNSIGNED_BYTE, this.image);
            var uniformTexture = rf.gl.getUniformLocation(program, "diff");
            rf.gl.uniform1i(uniformTexture, 0);
            rf.gl.bindBuffer(rf.gl.ARRAY_BUFFER, vertexbuffer);
            rf.gl.bindBuffer(rf.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            rf.gl.useProgram(program);
            var a_Position = rf.gl.getAttribLocation(program, "pos");
            var uv = rf.gl.getAttribLocation(program, "uv");
            rf.gl.enableVertexAttribArray(a_Position);
            rf.gl.enableVertexAttribArray(uv);
            rf.gl.vertexAttribPointer(a_Position, 2, rf.gl.FLOAT, false, 4 * 4, 0);
            rf.gl.vertexAttribPointer(uv, 2, rf.gl.FLOAT, false, 4 * 4, 4 * 2);
            var matrix = new Float32Array([
                2 / rf.stageWidth, 0, 0, 0,
                0, -2 / rf.stageHeight, 0, 0,
                0, 0, 1, 0,
                -1.0, 1.0, 1, 1
            ]);
            var _world = rf.gl.getUniformLocation(program, "mvp");
            rf.gl.uniformMatrix4fv(_world, false, matrix);
            rf.gl.clearColor(0, 0, 0, 1);
            rf.gl.clear(rf.gl.COLOR_BUFFER_BIT);
            rf.gl.drawElements(rf.gl.TRIANGLES, 6, rf.gl.UNSIGNED_SHORT, 0);
        };
        Dc_Texture.prototype.renderNow = function () {
            rf.context3D.clear(1, 1, 1, 1);
            var program = rf.context3D.createProgram(this.vertexCode, this.fragmentCode);
            rf.context3D.setProgram(program);
            var vertexBuffer = rf.context3D.createVertexBuffer(this.vertexData, 4);
            var indexBuffer = rf.context3D.createIndexBuffer(this.indexData);
            vertexBuffer.data.regVariable(rf.VA.pos, 0, 2);
            vertexBuffer.data.regVariable(rf.VA.uv, 2, 2);
            vertexBuffer.uploadContext(program);
            var texture = rf.context3D.createTexture(this._url, this.image);
            texture.pixels = this.image;
            texture.uploadContext(program, 0, rf.FS.diff);
            rf.ROOT.camera2D.updateSceneTransform();
            var matrix = new rf.Matrix3D();
            matrix.append(rf.ROOT.camera2D.worldTranform);
            rf.context3D.setProgramConstantsFromMatrix(rf.VC.mvp, matrix);
            rf.context3D.drawTriangles(indexBuffer);
        };
        Dc_Texture.prototype.render3 = function () {
            var camera = rf.ROOT.camera2D;
            if (camera.states & rf.DChange.trasnform)
                camera.updateSceneTransform();
            var c = rf.context3D;
            var v = c.createVertexBuffer(this.vertexInfo);
            var i = c.getIndexByQuad(1);
            var t = c.createTexture(this._url, this.image);
            var p = c.createProgram(this.vertexCode, this.fragmentCode);
            c.clear(1, 1, 1, 1);
            c.setProgram(p);
            t.uploadContext(p, 0, rf.FS.diff);
            v.uploadContext(p);
            c.setProgramConstantsFromMatrix(rf.VC.mvp, camera.worldTranform);
            c.drawTriangles(i);
        };
        return Dc_Texture;
    }());
    rf.Dc_Texture = Dc_Texture;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var MaxRectsTest = (function () {
        function MaxRectsTest() {
            this._urls = [
                "http://shushanh5.com/web/data/zhcn/n/a/B001/i3.png",
                "http://shushanh5.com/web/data/zhcn/o/server/logo.png",
                "http://shushanh5.com/web/data/zhcn/m/1/mini.jpg",
            ];
            this._count = 0;
            this._images = [];
            rf.loadRes(this._urls, this.onComplete, this, rf.ResType.image);
        }
        MaxRectsTest.prototype.onComplete = function (event) {
            if (event.type == rf.EventT.COMPLETE) {
                var data = event.data;
                if (data.type == rf.ResType.image) {
                    this._images.push(data.data);
                }
            }
            this._count++;
            if (this._count >= this._urls.length) {
                this.drawMaxRect();
            }
        };
        MaxRectsTest.prototype.drawMaxRect = function () {
            var canvas = document.createElement("canvas");
            document.body.appendChild(canvas);
            canvas.width = 512;
            canvas.height = 512;
            var context = canvas.getContext("2d");
            var rect;
            var binpack = new rf.MaxRectsBinPack(512, 512);
            for (var _i = 0, _a = this._images; _i < _a.length; _i++) {
                var img = _a[_i];
                rect = binpack.insert(img.width, img.height);
                context.drawImage(img, rect.x, rect.y);
            }
            var text = "我前面有不少关于canvas的文章，其中最近一篇是关于canvas绘制video，其实canvas的功能还有很多，我们还可以利用canvas来过滤视频纯色背景，还可以获取图片背景颜色。这里用到了canvas的一个ImageData 对象，今天就介绍一下canvas的ImageData 对象及其应用！";
            var map = {};
            for (var _b = 0, text_1 = text; _b < text_1.length; _b++) {
                var char = text_1[_b];
                map[char] = true;
            }
            var s = "";
            for (var key in map) {
                s += key;
            }
            s = s.replace(/\s/g, "");
            for (var _c = 0, s_1 = s; _c < s_1.length; _c++) {
                var char = s_1[_c];
                context.font = "30px Arial";
                var w = context.measureText(char).width;
                var h = 30;
                rect = binpack.insert(w, h);
                context.fillStyle = 'rgb(255, 255, 255)';
                context.fillText(char, rect.x, rect.y + h, w);
            }
        };
        return MaxRectsTest;
    }());
    rf.MaxRectsTest = MaxRectsTest;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var TextTest = (function () {
        function TextTest() {
            var c = document.createElement("canvas");
            c.width = 200;
            c.height = 200;
            var ctx = c.getContext("2d");
            ctx.fillRect(0, 0, c.width, c.height);
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
            document.body.appendChild(c);
            ctx.font = '40pt Calibri';
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'green';
            ctx.strokeText('汪鸿海!', 20, 100);
            ctx.fillStyle = 'red';
            ctx.fillText('汪鸿海!', 20, 100);
            ctx.measureText("汪").width;
        }
        return TextTest;
    }());
    rf.TextTest = TextTest;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var WebglTest = (function () {
        function WebglTest() {
            rf.Engine.addResize(this);
            this.render2();
        }
        WebglTest.prototype.render2 = function () {
            rf.context3D.clear(0, 0, 0, 1);
            var vcode = "\n                attribute vec3 pos;\n                uniform mat4 mvp;\n                void main(void){\n                    vec4 p = vec4(pos,1.0);\n                    gl_Position = mvp * p;\n                }\n            ";
            var fcode = "\n                precision mediump float;\n                void main(void){\n                    gl_FragColor = vec4(1,0,0,1);\n                }\n            ";
            var p = rf.context3D.createProgram(vcode, fcode);
            var v = rf.context3D.createVertexBuffer([
                0, 0, 0,
                100, 0, 0,
                100, 100, 0,
                0, 100, 0
            ], 3);
            v.data.regVariable("pos", 0, 3);
            var i = rf.context3D.getIndexByQuad(1);
            rf.ROOT.camera2D.updateSceneTransform();
            rf.context3D.setProgram(p);
            rf.context3D.setProgramConstantsFromMatrix(rf.VC.mvp, rf.ROOT.camera2D.worldTranform);
            v.uploadContext(p);
            rf.context3D.drawTriangles(i);
        };
        WebglTest.prototype.render = function () {
            rf.context3D.clear(0, 0, 0, 1);
            var vertexCode = "\n                attribute vec2 pos;\n                attribute float index;\n                uniform vec4 color[100];\n                varying vec4 vColor;\n                void main(void){\n                    gl_Position = vec4(pos,0.0,1.0);\n                    vColor = color[int(index)];\n                }\n            ";
            var fragmentCode = "\n                precision mediump float;\n                varying vec4 vColor;\n                void main(void){\n                    gl_FragColor = vColor;\n                }\n                \n                \n                ";
            var vertices = new Float32Array([
                -1.0, 1.0, 0,
                1.0, 1.0, 1,
                -1.0, -1.0, 2
            ]);
            var indexs = new Uint16Array([0, 1, 2]);
            var color = new Float32Array([
                1, 0, 0, 1,
                0, 1, 0, 1,
                0, 0, 1, 0.5
            ]);
            var v = rf.context3D.createVertexBuffer(vertices, 3);
            v.data.regVariable(rf.VA.pos, 0, 2);
            v.data.regVariable("index", 2, 1);
            var i = rf.context3D.createIndexBuffer(indexs);
            var p = rf.context3D.createProgram(vertexCode, fragmentCode);
            rf.context3D.setProgram(p);
            rf.context3D.setProgramConstantsFromVector("color", color, 4);
            v.uploadContext(p);
            rf.context3D.drawTriangles(i);
        };
        WebglTest.prototype.loadImage = function () {
            rf.loadRes("assets/ranger.png", this.renderImage, this, rf.ResType.image);
        };
        WebglTest.prototype.renderImage = function (event) {
            if (event.type != rf.EventT.COMPLETE) {
                return;
            }
            var res = event.data;
            var image = res.data;
            rf.context3D.configureBackBuffer(rf.stageWidth, rf.stageHeight, 0);
            rf.context3D.clear(0, 0, 0, 1);
            var vertexCode = "\n                attribute vec3 pos;\n                attribute vec2 uv;\n                uniform mat4 mvp;\n                varying vec2 v_TexCoord;\n                void main(void){\n                    vec4 temp = vec4(pos,1.0);\n                    gl_Position = mvp * temp;\n                    v_TexCoord = uv;\n                }\n            ";
            var fragmentCode = "\n                precision mediump float;\n                uniform sampler2D diff;\n                varying vec2 v_TexCoord;\n                void main(void){\n                    gl_FragColor = texture2D(diff, v_TexCoord);\n                }\n            ";
            rf.ROOT.camera2D.updateSceneTransform();
            var vertices = new Float32Array([
                0, 0, 0.0, 0.0,
                image.width, 0, 1.0, 0.0,
                image.width, image.height, 1.0, 1.0,
                0, image.height, 0.0, 1.0
            ]);
            var indexs = new Uint16Array([0, 1, 3, 1, 2, 3]);
            var v = rf.context3D.createVertexBuffer(vertices, 4);
            v.data.regVariable(rf.VA.pos, 0, 2);
            v.data.regVariable(rf.VA.uv, 2, 2);
            var i = rf.context3D.createIndexBuffer(indexs);
            var p = rf.context3D.createProgram(vertexCode, fragmentCode);
            rf.context3D.setProgram(p);
            var matrix = new rf.Matrix3D();
            matrix.appendTranslation(200, 100, 0);
            matrix.append(rf.ROOT.camera2D.worldTranform);
            rf.context3D.setProgramConstantsFromMatrix(rf.VC.mvp, matrix);
            var t = rf.context3D.createTexture("test", image);
            t.pixels = image;
            t.uploadContext(p, 0, rf.FS.diff);
            v.uploadContext(p);
            rf.context3D.drawTriangles(i);
        };
        WebglTest.prototype.resize = function (width, height) {
        };
        return WebglTest;
    }());
    rf.WebglTest = WebglTest;
})(rf || (rf = {}));
var rf;
(function (rf) {
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main() {
            return _super.call(this) || this;
        }
        Main.prototype.init = function (canvas) {
            _super.prototype.init.call(this, canvas);
            if (undefined == rf.gl) {
                return;
            }
            rf.Capabilities.init();
            rf.context3D.configureBackBuffer(rf.stageWidth, rf.stageHeight, 0);
            rf.context3D.setDepthTest(false, rf.gl.ALWAYS);
            rf.context3D.setBlendFactors(rf.gl.SRC_ALPHA, rf.gl.ONE_MINUS_SRC_ALPHA);
            var t = new rf.TextField();
            t.html = true;
            t.x = 100;
            t.y = 100;
            t.format = new rf.TextFormat();
            t.format.size = 30;
            t.format.oy = 3;
            t.format.init();
            window["aaa"] = t;
            rf.ROOT.addChild(t);
            rf.Engine.dispatcher.addEventListener(rf.EngineEvent.FPS_CHANGE, function () {
                t.text = "<font size=\"12\">fps:<font color=\"#00FF00\">" + rf.Engine.fps + "</font></font>";
            });
        };
        Main.prototype.linktest = function () {
            var vo = rf.recyclable(rf.Link);
            vo.add(1);
            vo.add(2);
            vo.add(3);
            console.log(vo.toString());
            vo.remove(2);
            console.log(vo.toString());
            vo.pop();
            console.log(vo.toString());
            vo.add(4);
            vo.addByWeight(5, 3);
            vo.addByWeight(6, 4);
            console.log(vo.toString());
            vo.recycle();
        };
        Main.prototype.engineTest = function () {
        };
        Main.prototype.callLaterTest = function () {
            function sayHello(msg, age) {
                console.log(msg + "," + age);
            }
            function sayHello2() {
                console.log("hello2");
            }
            rf.TimerUtil.time500.add(sayHello2);
        };
        Main.prototype.netTest = function () {
            {
                var http_1 = rf.recyclable(rf.HttpRequest);
                http_1.responseType = rf.HttpResponseType.TEXT;
                http_1.addEventListener(rf.EventT.PROGRESS, function (e) {
                    console.log("PROGRESS " + e.data);
                }, this);
                http_1.addEventListener(rf.EventT.COMPLETE, function (e) {
                    console.log("COMPLETE " + http_1.response);
                    http_1.recycle();
                }, this);
                http_1.addEventListener(rf.EventT.IO_ERROR, function (e) {
                    console.log("IO_ERROR " + e.data);
                    http_1.recycle();
                }, this);
                http_1.open("http://shushanh5.com/web/config/zhcn/trunk/gonggao.js", rf.HttpMethod.GET);
                http_1.send();
            }
            {
                var http_2 = rf.recyclable(rf.HttpRequest);
                http_2.responseType = rf.HttpResponseType.ARRAY_BUFFER;
                http_2.addEventListener(rf.EventT.PROGRESS, function (e) {
                    console.log("PROGRESS " + e.data);
                }, this);
                http_2.addEventListener(rf.EventT.COMPLETE, function (e) {
                    var bytes = new rf.ByteArray(http_2.response);
                    console.log("COMPLETE " + bytes.length + " " + bytes.readInt());
                    http_2.recycle();
                }, this);
                http_2.addEventListener(rf.EventT.IO_ERROR, function (e) {
                    console.log("IO_ERROR " + e.data);
                    http_2.recycle();
                }, this);
                http_2.open("http://shushanh5.com/web/data/zhcn/n/w/BW001/d.json", rf.HttpMethod.GET);
                http_2.send();
            }
            {
                var loader_1 = rf.recyclable(rf.ImageLoader);
                loader_1.crossOrigin = "anonymous";
                loader_1.addEventListener(rf.EventT.COMPLETE, function (e) {
                    console.log("Image COMPLETE " + loader_1.data);
                    loader_1.recycle();
                }, this);
                loader_1.addEventListener(rf.EventT.IO_ERROR, function (e) {
                    console.log("Image IO_ERROR " + e.data);
                    loader_1.recycle();
                }, this);
                loader_1.load("http://shushanh5.com/web/data/zhcn/n/a/B001/i3.png");
            }
            {
                var socket_1 = new rf.Socket();
                socket_1.addEventListener(rf.EventT.OPEN, function (e) {
                    console.log("socket open!");
                }, this);
                socket_1.addEventListener(rf.EventT.MESSAGE, function (e) {
                    console.log("服务器返回的数据: " + socket_1.input.bytesAvailable);
                    console.log("具体的数据: " + socket_1.input.readUTFBytes(socket_1.input.bytesAvailable));
                }, this);
                socket_1.addEventListener(rf.EventT.CLOSE, function (e) {
                    console.log("socket close");
                }, this);
                socket_1.addEventListener(rf.EventT.ERROR, function (e) {
                    console.log("socket error! " + e.data);
                }, this);
                socket_1.connect("121.40.165.18", 8088);
                setTimeout(function () {
                    console.log("发送：ss");
                    socket_1.send("ss");
                    setTimeout(function () {
                        console.log("发送：你好!");
                        socket_1.output.writeUTFBytes("你好!");
                        socket_1.flush();
                        console.log("发送：hello!");
                        socket_1.send("hello!");
                    }, 1000);
                }, 1000);
            }
        };
        Main.prototype.bitmapDataTest = function () {
            var b = new rf.BitmapData(512, 512, false, 0);
            var canvas = b.canvas;
            document.body.appendChild(canvas);
        };
        Main.prototype.resTest = function () {
            var _this = this;
            function onComplete(event) {
                if (event.type == rf.EventT.COMPLETE) {
                    console.log("加载完毕: " + event.type);
                    var type = event.data.type;
                    var url = event.data.url;
                    var data = event.data.data;
                    if (type == rf.ResType.text) {
                        console.log("\u6587\u672C\u52A0\u8F7D\u6210\u529F url: " + url + " data: " + data);
                    }
                    else if (type == rf.ResType.bin) {
                        console.log("\u4E8C\u8FDB\u5236\u52A0\u8F7D\u6210\u529F url: " + url + " data: " + data.bytesAvailable);
                    }
                    else if (type == rf.ResType.image) {
                        console.log("\u56FE\u7247\u52A0\u8F7D\u6210\u529F url: " + url + " data: " + data);
                    }
                }
                else {
                    console.log("加载失败: " + event.type + ", " + event.data.url);
                }
            }
            rf.Res.instance.maxLoader = 1;
            rf.Res.instance.load([
                "http://shushanh5.com/web/config/zhcn/trunk/errorcode.js",
            ], onComplete, this, rf.ResType.text, rf.LoadPriority.low);
            rf.Res.instance.load([
                "http://shushanh5.com/web/data/zhcn/n/w/BW001/d.json",
                "http://shushanh5.com/web/data/zhcn/n/a/B001/d.json",
            ], onComplete, this, rf.ResType.bin, rf.LoadPriority.middle);
            rf.Res.instance.load([
                "http://shushanh5.com/web/data/zhcn/n/a/B001/i3.png",
                "http://shushanh5.com/web/data/zhcn/o/server/logo.png",
                "http://shushanh5.com/web/data/zhcn/m/1/mini.jpg",
            ], onComplete, this, rf.ResType.image, rf.LoadPriority.high);
            setTimeout(function () {
                console.log(rf.Res.instance["_resMap"]);
                rf.Res.instance.load([
                    "http://shushanh5.com/web/config/zhcn/trunk/gonggao.js",
                    "http://shushanh5.com/web/config/zhcn/trunk/gonggao.js",
                    "http://shushanh5.com/web/config/zhcn/trunk/gonggao.js",
                ], onComplete, _this, rf.ResType.text, rf.LoadPriority.low);
            }, 3000);
        };
        Main.prototype.arrayTest = function (value) {
            var array = new Uint8Array(value);
            var data = new DataView(array.buffer);
            var n = rf.getTimer();
            var temp = new Uint8Array(value);
            array.set(temp);
            console.log("array.set::" + (rf.getTimer() - n));
            n = rf.getTimer();
            for (var i = 0; i < value; i++) {
                data.setUint8(i, array[i]);
            }
            console.log("DataView.set::" + (rf.getTimer() - n));
        };
        Main.prototype.caleTest = function (value) {
            var temp = 0;
            var n = rf.getTimer();
            for (var i = 0; i < value; i++) {
                temp = temp + 1;
            }
            console.log("time::" + (rf.getTimer() - n));
        };
        Main.prototype.functionTest = function (value) {
            var temp = 0;
            function test() { var a = 0; a = a + 1; }
            ;
            var n = rf.getTimer();
            for (var i = 0; i < value; i++) {
                test();
            }
            console.log("time::" + (rf.getTimer() - n));
        };
        return Main;
    }(rf.AppBase));
    rf.Main = Main;
})(rf || (rf = {}));
