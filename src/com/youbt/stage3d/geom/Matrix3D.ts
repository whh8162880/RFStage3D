module rf {

    const DEG_2_RAD = Math.PI / 180;
    export class Matrix3D {


        /**
         * [read-only] A Number that determines whether a matrix is invertible.
         */
        public get determinant() {
            const rawData = this.rawData;
            return ((rawData[0] * rawData[5] - rawData[4] * rawData[1]) * (rawData[10] * rawData[15] - rawData[14] * rawData[11])
                - (rawData[0] * rawData[9] - rawData[8] * rawData[1]) * (rawData[6] * rawData[15] - rawData[14] * rawData[7])
                + (rawData[0] * rawData[13] - rawData[12] * rawData[1]) * (rawData[6] * rawData[11] - rawData[10] * rawData[7])
                + (rawData[4] * rawData[9] - rawData[8] * rawData[5]) * (rawData[2] * rawData[15] - rawData[14] * rawData[3])
                - (rawData[4] * rawData[13] - rawData[12] * rawData[5]) * (rawData[2] * rawData[11] - rawData[10] * rawData[3])
                + (rawData[8] * rawData[13] - rawData[12] * rawData[9]) * (rawData[2] * rawData[7] - rawData[6] * rawData[3]));
        }

        public get position() {
            const rawData = this.rawData;
            return new Vector3D(rawData[3], rawData[7], rawData[11]);
        }

        /**
             矩阵要保存到这样
             1, 0, 0, x,
             0, 1, 0, y,
             0, 0, 1, z,
             0  0, 0, 0
            上传时会自动转置
         */
        public rawData: Float32Array;


        /**
         * Creates a Matrix3D object.
         */
        constructor(v?: ArrayLike<number>) {
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

        /**
         * Appends the matrix by multiplying another Matrix3D object by the current Matrix3D object.
         * Apply a transform after this transform
         */
        public append(lhs: Matrix3D) {
            //lhs * this
            const rawData = this.rawData;
            const [
                m111, m112, m113, m114,
                m121, m122, m123, m124,
                m131, m132, m133, m134,
                m141, m142, m143, m144
            ] = rawData as any;//目前typescript还没支持  TypedArray destructure，不过目前已经标准化，后面 typescript 应该会支持

            const [
                m211, m212, m213, m214,
                m221, m222, m223, m224,
                m231, m232, m233, m234,
                m241, m242, m243, m244
            ] = lhs.rawData as any;


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
        }

        /**
        * Prepends a matrix by multiplying the current Matrix3D object by another Matrix3D object.
        */
        public prepend(rhs: Matrix3D) {
            // this * rhs
            const [
                a11, a12, a13, a14,
                a21, a22, a23, a24,
                a31, a32, a33, a34,
                a41, a42, a43, a44
            ] = rhs.rawData as any;

            const rawData = this.rawData;

            const [
                b11, b12, b13, b14,
                b21, b22, b23, b24,
                b31, b32, b33, b34,
                b41, b42, b43, b44
            ] = rawData as any;


            //b * a
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
        }


        /**
         * Appends an incremental scale change along the x, y, and z axes to a Matrix3D object.
         */
        public appendScale(xScale: number, yScale: number, zScale: number) {
            /*
             *              x 0 0 0
             *              0 y 0 0    *  this
             *              0 0 z 0
             *              0 0 0 1
             */
            const rawData = this.rawData;

            rawData[0] *= xScale; rawData[1] *= xScale; rawData[2] *= xScale; rawData[3] *= xScale;
            rawData[4] *= yScale; rawData[5] *= yScale; rawData[6] *= yScale; rawData[7] *= yScale;
            rawData[8] *= zScale; rawData[9] *= zScale; rawData[10] *= zScale; rawData[11] *= zScale;
        }
        /**
         * Prepends an incremental scale change along the x, y, and z axes to a Matrix3D object.
         */
        public prependScale(xScale: number, yScale: number, zScale: number) {
            /*
             *            x 0 0 0
             *    this *  0 y 0 0
             *            0 0 z 0
             *            0 0 0 1
             */
            const rawData = this.rawData;
            rawData[0] *= xScale; rawData[1] *= yScale; rawData[2] *= zScale;
            rawData[4] *= xScale; rawData[5] *= yScale; rawData[6] *= zScale;
            rawData[8] *= xScale; rawData[9] *= yScale; rawData[10] *= zScale;
            rawData[12] *= xScale; rawData[13] *= yScale; rawData[14] *= zScale;

        }


        /**
         * Appends an incremental translation, a repositioning along the x, y, and z axes, to a Matrix3D object.
         */
        public appendTranslation(x: number, y: number, z: number) {
            /*
             *             1 0 0 x
             *             0 1 0 y   *  this
             *             0 0 1 z
             *             0 0 0 1
             */

            // this.rawData[0] += this.rawData[12] * x; this.rawData[1] += this.rawData[13] * x;
            // this.rawData[2] += this.rawData[14] * x; this.rawData[3] += this.rawData[15] * x;
            // this.rawData[4] += this.rawData[12] * y; this.rawData[5] += this.rawData[14] * y;
            // this.rawData[6] += this.rawData[14] * y; this.rawData[7] += this.rawData[15] * y;
            // this.rawData[8] += this.rawData[12] * z; this.rawData[9] += this.rawData[13] * z;
            // this.rawData[10] += this.rawData[14] * z; this.rawData[11] += this.rawData[15] *z;
            const rawData = this.rawData;
            rawData[12] += x;
            rawData[13] += y;
            rawData[14] += z;

        }

        /**
         * Prepends an incremental translation, a repositioning along the x, y, and z axes, to a Matrix3D object.
         */
        public prependTranslation(x: number, y: number, z: number) {

            /*
                         1 0 0 x
                this *   0 1 0 y
                         0 0 0 z
                         0 0 0 1
             */
            const rawData = this.rawData;
            rawData[3] += rawData[0] * x + rawData[1] * y + rawData[2] * z;
            rawData[7] += rawData[4] * x + rawData[5] * y + rawData[6] * z;
            rawData[11] += rawData[8] * x + rawData[9] * y + rawData[10] * z;
            rawData[15] += rawData[12] * x + rawData[13] * y + rawData[14] * z;
        }



        /**
         * Appends an incremental rotation to a Matrix3D object.
         */
        public appendRotation(degrees: number, axis: Vector3D, pivotPoint?: Point3DW) {

            var r: Matrix3D = this.getRotateMatrix(axis, degrees * DEG_2_RAD);

            if (pivotPoint) {
                //TODO:simplify
                const { x, y, z } = pivotPoint;
                this.appendTranslation(-x, -y, -z);
                this.append(r);
                this.appendTranslation(x, y, z);

            } else {
                this.append(r);
            }

        }


        /**
         * Prepends an incremental rotation to a Matrix3D object.
         */
        public prependRotation(degrees: number, axis: Vector3D, pivotPoint?: Vector3D) {
            var r: Matrix3D = this.getRotateMatrix(axis, degrees * DEG_2_RAD);
            if (pivotPoint) {
                //TODO:simplify
                const { x, y, z } = pivotPoint;
                this.prependTranslation(x, y, z);
                this.prepend(r);
                this.prependTranslation(-x, -y, -z);

            } else {
                this.prepend(r);
            }
        }





        /**
         * Returns a new Matrix3D object that is an exact copy of the current Matrix3D object.
         */
        public clone() {
            return new Matrix3D(this.rawData);
        }

        /**
         *  Copies a Vector3D object into specific column of the calling Matrix3D object.
         */
        public copyColumnFrom(column: number /*uint*/, vector3D: Point3DW) {
            if (column < 0 || column > 3)
                throw new Error("column error");
            const rawData = this.rawData;
            rawData[column] = vector3D.x;
            rawData[column + 4] = vector3D.y;
            rawData[column + 8] = vector3D.z;
            rawData[column + 12] = vector3D.w;

        }

        /**
         * Copies specific column of the calling Matrix3D object into the Vector3D object.
         */
        public copyColumnTo(column: number /*uint*/, vector3D: Point3DW): void {
            if (column < 0 || column > 3)
                throw new Error("column error");
            const rawData = this.rawData;
            vector3D.x = rawData[column];
            vector3D.y = rawData[column + 4];
            vector3D.z = rawData[column + 8];
            vector3D.w = rawData[column + 12];
        }

        /**
         * Copies all of the matrix data from the source Matrix3D object into the calling Matrix3D object.
         */
        public copyFrom(sourceMatrix3D: Matrix3D): void {
            this.rawData.set(sourceMatrix3D.rawData);
        }

        /**
         * Copies all of the vector data from the source vector object into the calling Matrix3D object.
         */
        public copyRawDataFrom(vector: number[], index?: number /*uint*/, transpose?: boolean): void {
            if (transpose) {
                this.transpose();
            }
            index >>>= 0;
            let len = vector.length - index;
            if (len < 16) {
                throw new Error("Arguments Error");
            }
            else if (len > 16) {
                len = 16;
            }
            const rawData = this.rawData;
            for (let c = 0; c < len; c++) {
                rawData[c] = vector[c + index];
            }

            if (transpose) {
                this.transpose();
            }
        }

        /**
         * Copies all of the matrix data from the calling Matrix3D object into the provided vector.
         */
        public copyRawDataTo(vector: number[] | ArrayBufferLike, index: number /*uint*/ = 0, transpose: boolean = false): void {
            if (transpose)
                this.transpose();
            if (index > 0) {
                for (var i: number = 0; i < index; i++)
                    vector[i] = 0;
            }
            var len: number = this.rawData.length;
            for (var c: number = 0; c < len; c++)
                vector[c + index] = this.rawData[c];

            if (transpose)
                this.transpose();
        }

        /**
         * Copies a Vector3D object into specific row of the calling Matrix3D object.
         */
        public copyRowFrom(row: number /*uint*/, vector3D: Point3DW): void {
            if (row < 0 || row > 3) {
                throw Error("row error");
            }
            const rawData = this.rawData;
            row *= 4;
            rawData[row] = vector3D.x;
            rawData[row + 1] = vector3D.y;
            rawData[row + 2] = vector3D.z;
            rawData[row + 3] = vector3D.w;
        }

        /**
         * Copies specific row of the calling Matrix3D object into the Vector3D object.
         */
        public copyRowTo(row: number /*uint*/, vector3D: Point3DW): void {
            if (row < 0 || row > 3) {
                throw Error("row error");
            }
            const rawData = this.rawData;
            row *= 4;
            vector3D.x = rawData[row];
            vector3D.y = rawData[row + 1];
            vector3D.z = rawData[row + 2];
            vector3D.w = rawData[row + 3];

        }

        public copyToMatrix3D(dest: Matrix3D): void {
            dest.rawData.set(this.rawData);
        }

        /**
         * Returns the transformation matrix's translation, rotation, and scale settings as a Vector of three Vector3D objects.
         */
        public decompose(orientationStyle = Orientation3D.EULER_ANGLES) {
            // http://www.gamedev.net/topic/467665-decomposing-rotationtranslationscale-from-matrix/

            const vec: Vector3D[] = [];
            const m = this.clone();
            const mr = m.rawData;

            const pos = new Vector3D(mr[12], mr[13], mr[14]);
            mr[12] = 0;
            mr[13] = 0;
            mr[14] = 0;

            const sqrt = Math.sqrt;

            const sx = sqrt(mr[0] * mr[0] + mr[1] * mr[1] + mr[2] * mr[2]);
            const sy = sqrt(mr[4] * mr[4] + mr[5] * mr[5] + mr[6] * mr[6]);
            let sz = sqrt(mr[8] * mr[8] + mr[9] * mr[9] + mr[10] * mr[10]);

            //determine 3*3
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

            var rot = new Vector3D();

            switch (orientationStyle) {
                case Orientation3D.AXIS_ANGLE:

                    rot.w = Math.acos((mr[0] + mr[5] + mr[10] - 1) / 2);

                    var len: number = Math.sqrt((mr[6] - mr[9]) * (mr[6] - mr[9]) + (mr[8] - mr[2]) * (mr[8] - mr[2]) + (mr[1] - mr[4]) * (mr[1] - mr[4]));
                    rot.x = (mr[6] - mr[9]) / len;
                    rot.y = (mr[8] - mr[2]) / len;
                    rot.z = (mr[1] - mr[4]) / len;

                    break;
                case Orientation3D.QUATERNION:

                    const tr = mr[0] + mr[5] + mr[10];

                    if (tr > 0) {
                        let rw = sqrt(1 + tr) / 2;
                        rot.w = rw;
                        rw *= 4;
                        rot.x = (mr[6] - mr[9]) / rw;
                        rot.y = (mr[8] - mr[2]) / rw;
                        rot.z = (mr[1] - mr[4]) / rw;
                    } else if ((mr[0] > mr[5]) && (mr[0] > mr[10])) {
                        let rx = sqrt(1 + mr[0] - mr[5] - mr[10]) / 2;
                        rot.x = rx;
                        rx *= 4;
                        rot.w = (mr[6] - mr[9]) / rx;
                        rot.y = (mr[1] + mr[4]) / rx;
                        rot.z = (mr[8] + mr[2]) / rx;
                    } else if (mr[5] > mr[10]) {
                        rot.y = sqrt(1 + mr[5] - mr[0] - mr[10]) / 2;

                        rot.x = (mr[1] + mr[4]) / (4 * rot.y);
                        rot.w = (mr[8] - mr[2]) / (4 * rot.y);
                        rot.z = (mr[6] + mr[9]) / (4 * rot.y);
                    } else {
                        rot.z = sqrt(1 + mr[10] - mr[0] - mr[5]) / 2;

                        rot.x = (mr[8] + mr[2]) / (4 * rot.z);
                        rot.y = (mr[6] + mr[9]) / (4 * rot.z);
                        rot.w = (mr[1] - mr[4]) / (4 * rot.z);
                    }


                    break;
                case Orientation3D.EULER_ANGLES:

                    rot.y = Math.asin(-mr[2]);

                    //var cos:number = Math.cos(rot.y);

                    if (mr[2] != 1 && mr[2] != -1) {
                        rot.x = Math.atan2(mr[6], mr[10]);
                        rot.z = Math.atan2(mr[1], mr[0]);
                    } else {
                        rot.z = 0;
                        rot.x = Math.atan2(mr[4], mr[5]);
                    }

                    break;
            }

            vec.push(pos);
            vec.push(rot);
            vec.push(new Vector3D(sx, sy, sz));

            return vec;
        }



        /**
         * Converts the current matrix to an identity or unit matrix.
         */
        public identity(): void {
            this.rawData = new Float32Array([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1]);
        }

        /**
         * [static] Interpolates the translation, rotation, and scale transformation of one matrix toward those of the target matrix.
         */
        //TODO: only support rotation matrix for now
        public static interpolate(thisMat: Matrix3D, toMat: Matrix3D, percent: number): Matrix3D {
            const a = new Quaternion().fromMatrix3D(thisMat);
            const b = new Quaternion().fromMatrix3D(toMat);

            return Quaternion.lerp(a, b, percent).toMatrix3D();
        }

        /**
         * Interpolates this matrix towards the translation, rotation, and scale transformations of the target matrix.
         */
        //TODO: only support rotation matrix for now
        public interpolateTo(toMat: Matrix3D, percent: number) {
            this.rawData.set(Matrix3D.interpolate(this, toMat, percent).rawData);
        }

        /**
         * Inverts the current matrix.
         */
        public invert() {
            let d: number = this.determinant;
            let invertable: boolean = Math.abs(d) > 0.00000000001;

            if (invertable) {
                d = 1 / d;
                const rawData = this.rawData;

                const [
                    m11, m12, m13, m14,
                    m21, m22, m23, m24,
                    m31, m32, m33, m34,
                    m41, m42, m43, m44
                ] = rawData as any;

                const m12$m23_m22$m13 = m12 * m23 - m22 * m13;
                const m12$m24_m22$m14 = m12 * m24 - m22 * m14;
                const m12$m33_m32$m13 = m12 * m33 - m32 * m13;
                const m12$m34_m32$m14 = m12 * m34 - m32 * m14;
                const m12$m43_m42$m13 = m12 * m43 - m42 * m13;
                const m12$m44_m42$m14 = m12 * m44 - m42 * m14;

                const m13$m24_m23$m14 = m13 * m24 - m23 * m14;
                const m13$m34_m33$m14 = m13 * m34 - m33 * m14;
                const m13$m44_m43$m14 = m13 * m44 - m43 * m14;

                const m22$m33_m32$m23 = m22 * m33 - m32 * m23;
                const m22$m34_m32$m24 = m22 * m34 - m32 * m24;
                const m22$m43_m42$m23 = m22 * m43 - m42 * m23;
                const m22$m44_m42$m24 = m22 * m44 - m42 * m24;

                const m23$m34_m33$m24 = m23 * m34 - m33 * m24;
                const m23$m44_m43$m24 = m23 * m44 - m43 * m24;

                const m32$m43_m42$m33 = m32 * m43 - m42 * m33;
                const m32$m44_m42$m34 = m32 * m44 - m42 * m34;

                const m33$m44_m43$m34 = m33 * m44 - m43 * m34;


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
        }

        /**
         * Rotates the display object so that it faces a specified position.
         */
        public pointAt(pos: Vector3D, at?: Vector3D, up?: Vector3D) {

            console.log('pointAt not impletement')
            //            if (at == null)
            //                at = new Vector3D(0, -1, 0);
            //            if (up == null)
            //                up = new Vector3D(0, 0, -1);
            //
            //            var zAxis: Vector3D = at.subtract(pos);
            //            zAxis.normalize();
            //
            //            var xAxis: Vector3D = zAxis.crossProduct(up);
            //            var yAxis: Vector3D = zAxis.crossProduct(xAxis);
            //
            //            this.rawData = new Float32Array([
            //                xAxis.x, xAxis.y, xAxis.z, 0,
            //                yAxis.x, yAxis.y, yAxis.z, 0,
            //                zAxis.x, zAxis.y, zAxis.z, 0,
            //                pos.x, pos.y, pos.z, 1
            //            ]);

        }




        public recompose(components: Vector3D[], orientationStyle = Orientation3D.EULER_ANGLES) {
            if (components.length < 3) {
                return;
            }
            const [c0, c1, c2] = components;
            const { x: scale_0_1_2, y: scale_4_5_6, z: scale_8_9_10 } = c2;
            if (scale_0_1_2 == 0 || scale_4_5_6 == 0 || scale_8_9_10 == 0) return;
            this.identity();
            // const scale = [];
            // scale[0] = scale[1] = scale[2] = scale_0_1_2;// scale0 scale1 scale2
            // scale[4] = scale[5] = scale[6] = scale_4_5_6;// scale4 scale5 scale6
            // scale[8] = scale[9] = scale[10] = scale_8_9_10;//scale8 scale9 scale10

            const rawData = this.rawData;

            const { x: c0x, y: c0y, z: c0z } = c0;
            const { x: c1x, y: c1y, z: c1z, w: c1w } = c1;

            const { cos, sin } = Math;

            switch (orientationStyle) {
                case Orientation3D.EULER_ANGLES:
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
                        if (orientationStyle == Orientation3D.AXIS_ANGLE) {
                            const w_2 = w / 2;
                            const sinW_2 = sin(w_2);
                            x *= sinW_2;
                            y *= sinW_2;
                            z *= sinW_2;
                            w = cos(w_2);
                        };
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
            };
        }


        /**
         * Sets the transformation matrix's translation, rotation, and scale settings.
         */
        public recompose2(components: Vector3D[], orientationStyle = Orientation3D.EULER_ANGLES) {
            if (components.length < 3) return false

            //TODO: only support euler angle for now
            const [pos_tmp, euler_tmp, scale_tmp] = components;
            this.identity();
            this.appendScale(scale_tmp.x, scale_tmp.y, scale_tmp.z);

            this.append(this.getRotateMatrix(Vector3D.X_AXIS, euler_tmp.x));
            this.append(this.getRotateMatrix(Vector3D.Y_AXIS, euler_tmp.y));
            this.append(this.getRotateMatrix(Vector3D.Z_AXIS, euler_tmp.z));

            const rawData = this.rawData;
            rawData[12] = pos_tmp.x;
            rawData[13] = pos_tmp.y;
            rawData[14] = pos_tmp.z;
            rawData[15] = 1;

            return true;
        }

        /**
         * Uses the transformation matrix to transform a Vector3D object from one space coordinate to another.
         */
        public transformVector(v: Point3DW) {
            /*
                      [ x
            this  *     y
                        z
                        1 ]
            */
            const { x, y, z } = v;
            const rawData = this.rawData;
            return new Vector3D(
                x * rawData[0] + y * rawData[1] + z * rawData[2] + rawData[3],
                x * rawData[4] + y * rawData[5] + z * rawData[6] + rawData[7],
                x * rawData[8] + y * rawData[9] + z * rawData[10] + rawData[11],
                1 //v.x * this.rawData[12] + v.y * this.rawData[13] + v.z * this.rawData[14] + this.rawData[15]
            );
        }

        /**
         * Uses the transformation matrix without its translation elements to transform a Vector3D object from one space coordinate to another.
         */
        public deltaTransformVector(v: Point3DW) {
            /*
                       [ x
             this  *     y
                         z
                         0 ]
             */
            const { x, y, z } = v;
            const rawData = this.rawData;
            return new Vector3D(
                x * rawData[0] + y * rawData[1] + z * rawData[2],
                x * rawData[4] + y * rawData[5] + z * rawData[6],
                x * rawData[8] + y * rawData[9] + z * rawData[10],
                0 //v.x * this.rawData[12] + v.y * this.rawData[13] + v.z * this.rawData[14]
            );
        }

        /**
         * Uses the transformation matrix to transform a Vector of Numbers from one coordinate space to another.
         */
        public transformVectors(vin: number[], vout: number[]): void {
            let i = 0;
            let v = new Vector3D();
            let v2 = new Vector3D();
            while (i + 3 <= vin.length) {
                v.x = vin[i];
                v.y = vin[i + 1];
                v.z = vin[i + 2];
                v2 = this.transformVector(v);  //todo: simplify operation
                vout[i] = v2.x;
                vout[i + 1] = v2.y;
                vout[i + 2] = v2.z;
                i += 3;
            }
        }


        /**
         * Converts the current Matrix3D object to a matrix where the rows and columns are swapped.
         */
        public transpose() {
            const rawData = this.rawData;
            const [
                , a12, a13, a14,
                a21, a22, a23, a24,
                a31, a32, a33, a34,
                a41, a42, a43
            ] = rawData as any;


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

        }

        public toString() {

            let str = "[Matrix3D]\n";
            const rawData = this.rawData;
            for (let i: number = 0; i < rawData.length; i++) {
                str += rawData[i] + "  , ";
                if (((i + 1) % 4) == 0) {
                    str += "\n"
                }
            }

            return str;
        }

        private getRotateMatrix(axis: Vector3D, radians: number) {
            let { x, y, z } = axis;

            //var radians: number = Math.PI / 180 * degrees;
            const c = Math.cos(radians);
            const s = Math.sin(radians);

            //get rotation matrix
            let rMatrix: number[];

            if (x != 0 && y == 0 && z == 0) { //rotate about x axis ,from y to z
                rMatrix = [
                    1, 0, 0, 0,
                    0, c, -s, 0,
                    0, s, c, 0,
                    0, 0, 0, 1
                ];

            } else if (y != 0 && x == 0 && z == 0) { // rotate about y ,from z to x
                rMatrix = [
                    c, 0, s, 0,
                    0, 1, 0, 0,
                    -s, 0, c, 0,
                    0, 0, 0, 1
                ];

            } else if (z != 0 && x == 0 && y == 0) { // rotate about z axis ,from x to y
                rMatrix = [
                    c, -s, 0, 0,
                    s, c, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1,

                ];

            } else {

                //make sure axis is a unit vector
                const lsq = axis.lengthSquared;
                if (Math.abs(lsq - 1) > 0.0001) {
                    const f = 1 / Math.sqrt(lsq);
                    x *= f;
                    y *= f;
                    z *= f;
                }

                const t = 1 - c;

                rMatrix = [
                    x * x * t + c, x * y * t - z * s, x * z * t + y * s, 0,
                    x * y * t + z * s, y * y * t + c, y * z * t - x * s, 0,
                    x * z * t - y * s, y * z * t + x * s, z * z * t + c, 0,
                    0, 0, 0, 1
                ];

            }
            return new Matrix3D(rMatrix);
        }


    }



    export class Matrix{
        public rawData:Float32Array;

        constructor(a:number= 1,b:number = 0,c:number = 0,d:number = 1,tx:number =0,ty:number = 0){
            this.rawData = new Float32Array(
                [
                    a,b,tx,
                    c,d,ty,
                    0,0,1
                ]
            )
        }
        

        public clone():Matrix
        {
            const rawData = this.rawData;
            return new Matrix(
                rawData[0],rawData[1],rawData[2],
                rawData[3],rawData[4],rawData[5]
            )
        }


        public copyFrom(m:Matrix):void{
            this.rawData = m.rawData;
        }

        public identity():void{
            this.rawData = new Float32Array([
                1, 0, 0, 
                0, 1, 0, 
                0, 0, 1]);
        }

        public rotate(degrees: number):void{
            let radians:number = degrees * DEG_2_RAD;
            const rawData = this.rawData;
            //X’ = cos(50)*X + sin(50)*Y + tx;
            //Y’ = -sin(50)*X + cos(50)*Y + ty;
            let rm = new Matrix(Math.cos(radians),-Math.sin(radians),0,Math.sin(radians),Math.cos(radians),0);
            this.concat(rm);
        }

        public scale(a:number,b:number):void{
            const rawData = this.rawData;
            rawData[0] *= a;
            rawData[4] *= b;
        }

        public concat(m:Matrix):void{
            //m*m
            const rawData = this.rawData;
            const [
                m111, m112, m113, 
                m121, m122, m123, 
                m131, m132, m133,
            ] = rawData as any;//目前typescript还没支持  TypedArray destructure，不过目前已经标准化，后面 typescript 应该会支持

            const [
                m211, m212, m213,
                m221, m222, m223,
                m231, m232, m233
            ] = m.rawData as any;


            rawData[0] = m111 * m211 + m112 * m221 + m113 * m231;
            rawData[1] = m111 * m212 + m112 * m222 + m113 * m232;
            rawData[2] = m111 * m213 + m112 * m223 + m113 * m233;

            rawData[3] = m121 * m211 + m122 * m221 + m123 * m231;
            rawData[4] = m121 * m212 + m122 * m222 + m123 * m232;
            rawData[5] = m121 * m213 + m122 * m223 + m123 * m233;

            rawData[6] = m131 * m211 + m132 * m221 + m133 * m231;
            rawData[7] = m131 * m212 + m132 * m222 + m133 * m232;
            rawData[8] = m131 * m213 + m132 * m223 + m133 * m233;
  
        }

        public invert():void{
            
        }

        public setTo(a:number,b:number,c:number,d:number,tx:number,ty:number):void{
            const rawData = this.rawData;
            rawData[0] = a; rawData[1] = b; rawData[2] = tx;
            rawData[3] = c; rawData[4] = d; rawData[5] = ty;
        }

        public translate(tx:number,ty:number):void{
            const rawData = this.rawData;
            rawData[2] += tx;
            rawData[5] += ty;
        }

  

    }

}

