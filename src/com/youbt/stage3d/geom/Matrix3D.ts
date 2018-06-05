//Matrix3D算法相关
const rf_v3_identity = [0, 0, 0, 1];
const rf_m3_identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const rf_m2_identity = [1, 0, 0, 0, 1, 0, 0, 0, 1];
const rf_m3_temp = new Float32Array(16);

interface IArrayBase {
    clone(): IArrayBase;
    set(array: ArrayLike<number> | IArrayBase, offset?: number): void;
    readonly length: number;
    [n: number]: number;
}

interface IMatrix3D extends IArrayBase {
    m3_identity():IMatrix3D;
    m3_append(m3: ArrayLike<number> | IArrayBase, prepend?: boolean, from?: ArrayLike<number>):IMatrix3D;
    m3_rotation(degrees: number, axis: IVector3D | number[], prepend?: boolean, from?: ArrayLike<number>):IMatrix3D;
    m3_scale(x: number, y: number, z: number, prepend?: boolean, from?: ArrayLike<number>):IMatrix3D;
    m3_translation(x: number, y: number, z: number, prepend?: boolean, from?: ArrayLike<number>):IMatrix3D;
    m3_invert(from?: ArrayLike<number>):IMatrix3D;
    m3_decompose(pos: IVector3D | number[], rot: IVector3D | number[], sca: IVector3D | number[], orientationStyle?: number);
    m3_recompose(pos: IVector3D | number[], rot: IVector3D | number[], sca: IVector3D | number[], orientationStyle?: number):IMatrix3D;
    m3_copyColumnFrom(column: number, vector3D: IVector3D | number[]);
    m3_copyColumnTo(column: number, vector3D: IVector3D | number[]);
    m3_transformVector(v: IVector3D | number[], result?: IVector3D | number[]);
    m3_transformVectors(vin: ArrayLike<number>, vout: Float32Array | number[]);
    m3_transformRotation(v: IVector3D | number[], result?: IVector3D | number[]);
    m3_getMaxScaleOnAxis();
}

/*********************************************************
 * Matrix3D
********************************************************/
Object.defineProperties(Float32Array.prototype, {
    m3_identity: {
        value: function () {
            this.set(rf_m3_identity);
            return this;
        }
    },

    m3_append: {
        value: function (m3: ArrayLike<number>, prepend?: boolean, from?: ArrayLike<number>) {
            let a: ArrayLike<number>;
            let b: ArrayLike<number>;
            if (!prepend) {
                a = from ? from : this;
                b = m3
            } else {
                a = m3;
                b = from ? from : this;
            }
            const [
                a11, a12, a13, a14,
                a21, a22, a23, a24,
                a31, a32, a33, a34,
                a41, a42, a43, a44
            ] = a as any;//目前typescript还没支持  TypedArray destructure，不过目前已经标准化，后面 typescript 应该会支持

            const [
                b11, b12, b13, b14,
                b21, b22, b23, b24,
                b31, b32, b33, b34,
                b41, b42, b43, b44
            ] = b as any;

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

            return this;
        }
    },

    m3_rotation: {
        value: function (angle: number, axis: Float32Array | number[], prepend?: boolean, from?: ArrayLike<number>) {
            let c = Math.cos(angle);
            let s = Math.sin(angle);
            let t = 1 - c;
            const { 0: x, 1: y, 2: z } = axis;
            let tx = t * x, ty = t * y;
            let b = rf_m3_temp;
            b.set([
                tx * x + c, tx * y - s * z, tx * z + s * y, 0,
                tx * y + s * z, ty * y + c, ty * z - s * x, 0,
                tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
                0, 0, 0, 1
            ]);
            return this.m3_append(b, prepend, from);
        }
    },


    m3_scale: {
        value: function (x: number, y: number, z: number, prepend?: boolean, from?: ArrayLike<number>) {
            if (from) this.set(from);
            if (prepend) {
                this[0] *= x; this[1] *= y; this[2] *= z;
                this[4] *= x; this[5] *= y; this[6] *= z;
                this[8] *= x; this[9] *= y; this[10] *= z;
                this[12] *= x; this[13] *= y; this[14] *= z;
            } else {
                this[0] *= x; this[4] *= y; this[8] *= z;
                this[1] *= x; this[5] *= y; this[9] *= z;
                this[2] *= x; this[6] *= y; this[10] *= z;
                this[3] *= x; this[7] *= y; this[11] *= z;
            }
            return this;
        }
    },

    m3_translation: {
        value: function (x: number, y: number, z: number, prepend?: boolean, from?: ArrayLike<number>) {
            if (prepend) {
                let b = rf_m3_temp;
                b.set(rf_m3_identity);
                b[12] = x;
                b[13] = y;
                b[14] = z;
                this.m3_append(b, undefined, from);
            } else {
                from = from ? from : this;
                this[12] = from[12] + x;
                this[13] = from[13] + y;
                this[14] = from[14] + z;
            }
            return this;
        }
    },

    m3_invert: {
        value: function (from?: ArrayLike<number>) {
            from = from ? from : this;
            var a = from[0], b = from[1], c = from[2], d = from[3],
                e = from[4], f = from[5], g = from[6], h = from[7],
                i = from[8], j = from[9], k = from[10], l = from[11],
                m = from[12], n = from[13], o = from[14], p = from[15],
                q = a * f - b * e, r = a * g - c * e,
                s = a * h - d * e, t = b * g - c * f,
                u = b * h - d * f, v = c * h - d * g,
                w = i * n - j * m, x = i * o - k * m,
                y = i * p - l * m, z = j * o - k * n,
                A = j * p - l * n, B = k * p - l * o,
                ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);
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

            return this;
        }
    },

    /**
     * @param orientationStyle
        EULER_ANGLES = 0
        AXIS_ANGLE = 1
        QUATERNION = 2
     */
    m3_decompose: {
        value: function (pos: Float32Array | number[], rot: Float32Array | number[], sca: Float32Array | number[], orientationStyle?: number) {
            if (undefined == orientationStyle) {
                orientationStyle = 0;
            }

            let [
                m0, m1, m2, m3,
                m4, m5, m6, m7,
                m8, m9, m10, m11,
                m12, m13, m14, m15
            ] = this as any;

            if (undefined != pos) {
                pos[0] = m12;
                pos[1] = m13;
                pos[2] = m14;
            }

            const { sqrt, atan2 } = Math;

            const sx = sqrt(m0 * m0 + m1 * m1 + m2 * m2);
            const sy = sqrt(m4 * m4 + m5 * m5 + m6 * m6);
            let sz = sqrt(m8 * m8 + m9 * m9 + m10 * m10);
            //determine 3*3
            if (m0 * (m5 * m10 - m6 * m9) - m1 * (m4 * m10 - m6 * m8) + m2 * (m4 * m9 - m5 * m8) < 0) {
                sz = -sz;
            }

            if (undefined != sca) {
                sca[0] = sx;
                sca[1] = sy;
                sca[2] = sz;
            }

            m0 /= sx; m1 /= sx; m2 /= sx;
            m4 /= sy; m5 /= sy; m6 /= sy;
            m8 /= sz; m9 /= sz; m10 /= sz;


            switch (orientationStyle) {
                case 0: //EULER_ANGLES
                    rot[1] = Math.asin(-m2);
                    if (m2 != 1 && m2 != -1) {
                        rot[0] = atan2(m6, m10);
                        rot[2] = atan2(m1, m0);
                    } else {
                        rot[2] = 0;
                        rot[0] = atan2(m4, m5);
                    }
                    break;
                case 2: //QUATERNION
                    const tr = m0 + m5 + m10;
                    if (tr > 0) {
                        let rw = sqrt(1 + tr) / 2;
                        rot[3] = rw;
                        rw *= 4;
                        rot[0] = (m6 - m9) / rw;
                        rot[1] = (m8 - m2) / rw;
                        rot[2] = (m1 - m4) / rw;
                    } else if ((m0 > m5) && (m0 > m10)) {
                        let rx = sqrt(1 + m0 - m5 - m10) / 2;
                        rot[0] = rx;
                        rx *= 4;
                        rot[3] = (m6 - m9) / rx;
                        rot[1] = (m1 + m4) / rx;
                        rot[2] = (m8 + m2) / rx;
                    } else if (m5 > m10) {
                        rot[1] = sqrt(1 + m5 - m0 - m10) / 2;
                        rot[0] = (m1 + m4) / (4 * rot[1]);
                        rot[3] = (m8 - m2) / (4 * rot[1]);
                        rot[2] = (m6 + m9) / (4 * rot[1]);
                    } else {
                        rot[2] = sqrt(1 + m10 - m0 - m5) / 2;
                        rot[0] = (m8 + m2) / (4 * rot[2]);
                        rot[1] = (m6 + m9) / (4 * rot[2]);
                        rot[3] = (m1 - m4) / (4 * rot[2]);
                    }
                    break;
                case 1://AXIS_ANGLE
                    rot[3] = Math.acos((m0 + m5 + m10 - 1) / 2);
                    var len: number = Math.sqrt((m6 - m9) * (m6 - m9) + (m8 - m2) * (m8 - m2) + (m1 - m4) * (m1 - m4));
                    rot[0] = (m6 - m9) / len;
                    rot[1] = (m8 - m2) / len;
                    rot[2] = (m1 - m4) / len;
                    break;
            }
        }
    },

    m3_recompose: {
        value: function (pos: Float32Array | number[], rot: Float32Array | number[], sca: Float32Array | number[], orientationStyle?: number) {
            if (undefined == orientationStyle) {
                orientationStyle = 0;
            }

            const { 0: scale_0_1_2, 1: scale_4_5_6, 2: scale_8_9_10 } = sca;
            if (scale_0_1_2 == 0 || scale_4_5_6 == 0 || scale_8_9_10 == 0) return;

            const { 0: c0x, 1: c0y, 2: c0z } = pos;
            const { 0: c1x, 1: c1y, 2: c1z, 3: c1w } = rot;

            const { cos, sin } = Math;

            switch (orientationStyle) {
                case 0://Orientation3D.EULER_ANGLES:
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
                        if (orientationStyle == 1/*Orientation3D.AXIS_ANGLE*/) {
                            const w_2 = w / 2;
                            const sinW_2 = sin(w_2);
                            x *= sinW_2;
                            y *= sinW_2;
                            z *= sinW_2;
                            w = cos(w_2);
                        };
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
            return this;
        }
    },

    m3_copyColumnFrom: {
        value: function (column: number, vector3D: ArrayLike<number>) {
            column *= 4
            this[column] = vector3D[0];
            this[column + 1] = vector3D[1];
            this[column + 2] = vector3D[2];
            this[column + 3] = vector3D[3];
        }
    },

    m3_copyColumnTo: {
        value: function (column: number, vector3D: Float32Array | number[]) {
            column *= 4
            vector3D[0] = this[column];
            vector3D[1] = this[column + 1];
            vector3D[2] = this[column + 2];
            vector3D[3] = this[column + 3];
        }
    },

    m3_transformVector: {
        value: function (v: Float32Array | number[], result?: IVector3D | number[]) {
            let { 0: x, 1: y, 2: z , 3 : w } = v;
            // w = 1;
            if (undefined == result) {
                result = new Float32Array(rf_v3_identity);
            }
            result[0] = x * this[0] + y * this[4] + z * this[8] + w * this[12];
            result[1] = x * this[1] + y * this[5] + z * this[9] + w * this[13];
            result[2] = x * this[2] + y * this[6] + z * this[10] + w *this[14];
            result[3] = x * this[3] + y * this[7] + z * this[11] + w *this[15];

            return result;
        }
    },

    m3_transformVectors: {
        value: function (vin: ArrayLike<number>, vout: Float32Array | number[]) {
            let i = 0;
            let v = [0, 0, 0];
            let v2 = [0, 0, 0];
            while (i + 3 <= vin.length) {
                v[0] = vin[i];
                v[1] = vin[i + 1];
                v[2] = vin[i + 2];
                this.transformVector(v, v2);  //todo: simplify operation
                vout[i] = v2[0];
                vout[i + 1] = v2[1];
                vout[i + 2] = v2[2];
                i += 3;
            }
        }
    },


    m3_transformRotation: {
        value: function (v: Float32Array | number[], result?: IVector3D | number[]) {
            const { 0: x, 1: y, 2: z } = v;
            if (undefined == result) {
                result = new Float32Array(rf_v3_identity);
            }
            result[0] = x * this[0] + y * this[4] + z * this[8];
            result[1] = x * this[1] + y * this[5] + z * this[9];
            result[2] = x * this[2] + y * this[6] + z * this[10];
            result[3] = x * this[3] + y * this[7] + z * this[11];

            return result;
        }
    },
    m3_getMaxScaleOnAxis: {
        value: function(){
            let scaleXSq = this[ 0 ] * this[ 0 ] + this[ 1 ] * this[ 1 ] + this[ 2 ] * this[ 2 ];
            let scaleYSq = this[ 4 ] * this[ 4 ] + this[ 5 ] * this[ 5 ] + this[ 6 ] * this[ 6 ];
            let scaleZSq = this[ 8 ] * this[ 8 ] + this[ 9 ] * this[ 9 ] + this[ 10 ] * this[ 10 ];
            return Math.sqrt( Math.max( scaleXSq, scaleYSq, scaleZSq ) );
        }
        

    }
})

interface IVector3D extends IArrayBase {
    x: number;
    y: number;
    z: number;
    w: number;
    v3_lengthSquared: number;
    v3_length: number;
    v3_add(v: IVector3D | ArrayLike<number>): IVector3D;
    v3_sub(v: IVector3D | ArrayLike<number>): IVector3D;
    v3_scale(v: number);
    v3_normalize(from?: ArrayLike<number>);
    v3_dotProduct(t: ArrayLike<number>);
    v3_crossProduct(t: ArrayLike<number>, out?: IVector3D | number[]);
    v3_applyMatrix4(e: ArrayLike<number>, out?: IVector3D | number[])
}

Object.defineProperties(Float32Array.prototype, {
    v3_lengthSquared: {
        get() {
            const { 0: x, 1: y, 2: z } = this;
            return x * x + y * y + z * z;
        }
    },
    v3_length: {
        get() {
            const { 0: x, 1: y, 2: z } = this;
            return Math.sqrt(x * x + y * y + z * z);
        }
    },
    v3_add: {
        value: function (v: IVector3D | ArrayLike<number>) {
            let o = new Float32Array(4);
            for (let i = 0; i < 3; i++) o[i] = this[i] + v[i];
            return o;
        }
    },
    v3_sub: {
        value: function (v: IVector3D | ArrayLike<number>) {
            let o = new Float32Array(4);
            for (let i = 0; i < 3; i++) o[i] = this[i] - v[i];
            return o;
        }
    },
    v3_scale: {
        value: function (v: number) {
            this[0] *= v;
            this[1] *= v;
            this[2] *= v;
            this[3] *= v;
        }
    },
    v3_normalize: {
        value: function (from?: ArrayLike<number>) {
            let leng = this.v3_length;
            if (leng != 0) {
                let v = 1 / leng;
                this[0] *= v;
                this[1] *= v;
                this[2] *= v;
            }
        }
    },
    v3_dotProduct: {
        value: function (t: ArrayLike<number>) {
            return this[0] * t[0] + this[1] * t[1] + this[2] * t[2];
        }
    },
    v3_crossProduct: {
        value: function (t: ArrayLike<number>, out?: IVector3D | number[]) {
            const { 0: x, 1: y, 2: z } = this;
            const { 0: ax, 1: ay, 2: az } = t;

            if (undefined == out) {
                out = new Float32Array(4);
            }

            out[0] = y * az - z * ay;
            out[1] = z * ax - x * az;
            out[2] = x * ay - y * ax;

            return out;
        }
    },

    v3_applyMatrix4:{
        value: function (e: ArrayLike<number>, out?: IVector3D | number[]) {
            const { 0: x, 1: y, 2: z } = this;

            if (undefined == out) {
                out = this;
            }

            var w = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] );

            out[0] = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] ) * w;
            out[1] = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] ) * w;
            out[2] = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * w;
            out[3] = 1
            return out;
        }
    }

})

interface IMatrixComposeData{
    x:number;
    y:number;
    scaleX:number;
    scaleY:number;
    rotaiton:number;
}

interface IMatrix extends IArrayBase {
    m2_identity();
    m2_append(m2: ArrayLike<number> | IArrayBase, prepend?: boolean, from?: ArrayLike<number>):IMatrix;
    m2_scale(scalex:number,scaley:number);
    m2_decompose(result?:IMatrixComposeData):IMatrixComposeData;
    m2_recompose(value:IMatrixComposeData):IMatrix;
    m2_clone():IMatrix;
}

Object.defineProperties(Float32Array.prototype, {
    m2_identitye: {
        value: function () {
            this.set(rf_m2_identity);
        }
    },


    m2_clone: {
        value: function () {
            return new Float32Array(this);
        }
    },

    m2_scale: {
        value: function (scalex:number,scaley:number) {
            this[0] *= scalex;
            this[4] *= scaley;
        }
    },

    m2_append: {
        value: function (m2: ArrayLike<number>, prepend?: boolean, from?: ArrayLike<number>) {
            let a: ArrayLike<number>;
            let b: ArrayLike<number>;
            if (!prepend) {
                a = from ? from : this;
                b = m2
            } else {
                a = m2;
                b = from ? from : this;
            }
            const [
                a11, a12, a13,
                a21, a22, a23,
                a31, a32, a33,
            ] = a as any;//目前typescript还没支持  TypedArray destructure，不过目前已经标准化，后面 typescript 应该会支持

            const [
                b11, b12, b13,
                b21, b22, b23,
                b31, b32, b33,
            ] = b as any;

            this[0] = a11 * b11 + a12 * b21 + a13 * b31;
            this[1] = a11 * b12 + a12 * b22 + a13 * b32;
            this[2] = a11 * b13 + a12 * b23 + a13 * b33;

            this[3] = a21 * b11 + a22 * b21 + a23 * b31;
            this[4] = a21 * b12 + a22 * b22 + a23 * b32;
            this[5] = a21 * b13 + a22 * b23 + a23 * b33;

            this[6] = a31 * b11 + a32 * b21 + a33 * b31;
            this[7] = a31 * b12 + a32 * b22 + a33 * b32;
            this[8] = a31 * b13 + a32 * b23 + a33 * b33;
            return this;
        }
    },


    m2_decompose: {
        value: function (result?:IMatrixComposeData) {

            let{
                0:m0,1:m1,2:m2,
                3:m3,4:m4,5:m5,
                6:m6,7:m7
            }= this as any;

            let sx = Math.sqrt(m0*m0 + m1*m1) , sy = Math.sqrt(m3*m3 + m4*m4);

            let x = m6,y = m7;

            let rotaiton = Math.acos(m0/sx) * rf.RADIANS_TO_DEGREES;

            if(!result){
                result = {x:x,y:y,scaleX:sx,scaleY:sy,rotaiton:rotaiton} as IMatrixComposeData;
            }else{
                result.x = x;
                result.y = y;
                result.scaleX = sx;
                result.scaleY = sy;
                result.rotaiton = rotaiton;
            }

            return result;
        }
    },

    m2_recompose: {
        value: function (value:IMatrixComposeData){
            let x = value.x === undefined ? 0 : value.x;
            let y = value.y === undefined ? 0 : value.y;
            let sx = value.scaleX === undefined ? 1 :  value.scaleX;
            let sy = value.scaleY === undefined ? 1 :  value.scaleY;
            let rotaiton = value.rotaiton  === undefined ? 0 : value.rotaiton;

            rotaiton *= rf.DEGREES_TO_RADIANS;

            let cos = Math.cos(rotaiton),sin = Math.sin(rotaiton);

            this[0] = sx * cos;
            this[1] = -sin;
            this[3] = sin;
            this[4] = cos * sy;
            this[6] = x;
            this[7] = y;
        }
    }
});


// export class Matrix {
//     public rawData: Float32Array;

//     constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, tx: number = 0, ty: number = 0) {
//         this.rawData = new Float32Array(
//             [
//                 a, b, tx,
//                 c, d, ty,
//                 0, 0, 1
//             ]
//         )
//     }


//     public get determinant() {
//         const rawData = this.rawData;
//         //3 * 3 对角线法
//         return (rawData[0] * rawData[4] * rawData[8]
//             + rawData[1] * rawData[5] * rawData[6]
//             + rawData[2] * rawData[3] * rawData[7]
//             - rawData[2] * rawData[4] * rawData[6]
//             - rawData[7] * rawData[5] * rawData[0]
//             - rawData[8] * rawData[3] * rawData[1]
//         );
//     }


//     public clone(): Matrix {
//         const rawData = this.rawData;
//         return new Matrix(
//             rawData[0], rawData[1], rawData[2],
//             rawData[3], rawData[4], rawData[5]
//         )
//     }


//     public copyFrom(m: Matrix): void {
//         this.rawData = m.rawData;
//     }

//     public identity(): void {
//         this.rawData = new Float32Array([
//             1, 0, 0,
//             0, 1, 0,
//             0, 0, 1]);
//     }

//     public rotate(degrees: number): void {
//         let radians: number = degrees * DEG_2_RAD;
//         const rawData = this.rawData;
//         //X’ = cos(50)*X + sin(50)*Y + tx;
//         //Y’ = -sin(50)*X + cos(50)*Y + ty;
//         let rm = new Matrix(Math.cos(radians), -Math.sin(radians), 0, Math.sin(radians), Math.cos(radians), 0);
//         this.concat(rm);
//     }

//     public scale(a: number, b: number): void {
//         const rawData = this.rawData;
//         rawData[0] *= a;
//         rawData[4] *= b;
//     }

//     public concat(m: Matrix): void {
//         //m*m
//         const rawData = this.rawData;
//         const [
//             a11, a12, a13,
//             a21, a22, a23,
//             a31, a32, a33,
//         ] = rawData as any;//目前typescript还没支持  TypedArray destructure，不过目前已经标准化，后面 typescript 应该会支持

//         const [
//             b11, b12, b13,
//             b21, b22, b23,
//             b31, b32, b33
//         ] = m.rawData as any;


//         rawData[0] = a11 * b11 + a12 * b21 + a13 * b31;
//         rawData[1] = a11 * b12 + a12 * b22 + a13 * b32;
//         rawData[2] = a11 * b13 + a12 * b23 + a13 * b33;

//         rawData[3] = a21 * b11 + a22 * b21 + a23 * b31;
//         rawData[4] = a21 * b12 + a22 * b22 + a23 * b32;
//         rawData[5] = a21 * b13 + a22 * b23 + a23 * b33;

//         rawData[6] = a31 * b11 + a32 * b21 + a33 * b31;
//         rawData[7] = a31 * b12 + a32 * b22 + a33 * b32;
//         rawData[8] = a31 * b13 + a32 * b23 + a33 * b33;

//     }

//     public invert(): boolean {
//         let d: number = this.determinant;
//         let invertable: boolean = Math.abs(d) > 0.00000000001;

//         if (invertable) {


//             d = 1 / d;
//             const rawData = this.rawData;

//             const [
//                 a1, a2, a3,
//                 b1, b2, b3,
//                 m31, m32, m33
//             ] = rawData as any;

//             const b2$m33_m32$b3 = b2 * m33 - m32 * b3;
//             const b1$m33_m31$b3 = b1 * m33 - m31 * b3;
//             const b1$m32_m31$b2 = b1 * m32 - m31 * b2;

//             const a2$m33_m32$a3 = a2 * m33 - m32 * a3;
//             const a1$m33_m31$a3 = a1 * m33 - m31 * a3;
//             const a1$m32_m31$a2 = a1 * m32 - m31 * a2;

//             const a2$b3_b2$a3 = a2 * b3 - b2 * a3;
//             const a1$b3_b1$a3 = a1 * b3 - b1 * a3;
//             const a1$b2_b1$a2 = a1 * b2 - b1 * a2;

//             //逆矩阵 = 1/d * 伴随矩阵
//             rawData[0] = d * b2$m33_m32$b3;
//             rawData[1] = -d * b1$m32_m31$b2;
//             rawData[2] = d * b1$m32_m31$b2;

//             rawData[3] = -d * a2$m33_m32$a3;
//             rawData[4] = d * a1$m33_m31$a3;
//             rawData[5] = -d * a1$m32_m31$a2;

//             rawData[6] = d * a2$b3_b2$a3;
//             rawData[7] = -d * a1$b3_b1$a3;
//             rawData[8] = d * a1$b2_b1$a2;
//         }
//         return invertable;
//     }

//     public setTo(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
//         const rawData = this.rawData;
//         rawData[0] = a; rawData[1] = b; rawData[2] = tx;
//         rawData[3] = c; rawData[4] = d; rawData[5] = ty;
//     }

//     public translate(tx: number, ty: number): void {
//         const rawData = this.rawData;
//         rawData[2] += tx;
//         rawData[5] += ty;
//     }
// }













interface Float32Array extends IMatrix3D, IMatrix, IVector3D {

}

module rf {

    export const enum Orientation3D {
        EULER_ANGLES,// = "eulerAngles",
        AXIS_ANGLE,// = "axisAngle",
        QUATERNION,// = "quaternion",
    }

    const DEG_2_RAD = Math.PI / 180;

    export function newMatrix3D(v?: ArrayLike<number> | ArrayBuffer) {
        let out: Float32Array;
        if (v instanceof ArrayBuffer) {
            out = new Float32Array(v);
        } else {
            if (undefined != v) {
                out = new Float32Array(v);
            } else {
                out = new Float32Array(rf_m3_identity);
            }
        }
        return out;
    }

    export function newMatrix(v?: ArrayLike<number> | ArrayBuffer) {
        let out: Float32Array;
        if (v instanceof ArrayBuffer) {
            out = new Float32Array(v);
        } else {
            if (undefined != v) {
                out = new Float32Array(v);
            } else {
                out = new Float32Array(rf_m2_identity);
            }
        }
        return out;
    }

    export function newVector3D(x?: ArrayLike<number> | ArrayBuffer | number, y?: number, z?: number, w?: number) {
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


    export function matrix2d_clearScale(matrix:IMatrix){
    
    }

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

}

