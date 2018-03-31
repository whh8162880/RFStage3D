///<reference path="Matrix3D.ts"/>
module rf {
    export class Quaternion {
        public x: number;
        public y: number;
        public z: number;
        public w: number;

        constructor(x?: number, y?: number, z?: number, w = 1) {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w;
        }


        public static lerp(qa: Point3DW, qb: Point3DW, percent: number): Quaternion {
            const { x: qax, y: qay, z: qaz, w: qaw } = qa;
            const { x: qbx, y: qby, z: qbz, w: qbw } = qb;
            // shortest direction
            if (qax * qbx + qay * qby + qaz * qbz + qaw * qbw < 0) {
                return new Quaternion(
                    qax + percent * (-qbx - qax),
                    qay + percent * (-qby - qay),
                    qaz + percent * (-qbz - qaz),
                    qaw + percent * (-qbw - qbw)
                );
            }
            return new Quaternion(
                qax + percent * (qbx - qax),
                qay + percent * (qby - qay),
                qaz + percent * (qbz - qaz),
                qaw + percent * (qbw - qbw)
            );


        }

        public fromMatrix3D(m: Matrix3D) {
            const [
                m11, m12, m13, ,
                m21, m22, m23, ,
                m31, m32, m33,
            ] = m.rawData as any;


            const tr = m11 + m22 + m33;
            let tmp: number;
            if (tr > 0) {
                tmp = 1 / (2 * Math.sqrt(tr + 1));

                this.x = (m23 - m32) * tmp;
                this.y = (m31 - m13) * tmp;
                this.z = (m12 - m21) * tmp;
                this.w = 0.25 / tmp;

            } else {
                if ((m11 > m22) && (m11 > m33)) {
                    tmp = 1 / (2 * Math.sqrt(1 + m11 - m22 + m33));

                    this.x = (m21 + m12) * tmp;
                    this.y = (m13 + m31) * tmp;
                    this.z = (m32 - m23) * tmp;
                    this.w = 0.25 / tmp;


                } else if ((m22 > m11) && (m22 > m33)) {
                    tmp = 1 / (Math.sqrt(1 + m22 - m11 - m33));
                    this.x = 0.25 / tmp;
                    this.y = (m32 + m23) * tmp;
                    this.z = (m13 - m31) * tmp;
                    this.w = (m21 + m12) * tmp;

                } else if ((m33 > m11) && (m33 > m22)) {
                    tmp = 1 / (Math.sqrt(1 + m33 - m11 - m22));
                    this.x = (m32 + m23) * tmp;
                    this.y = 0.25 / tmp;
                    this.z = (m21 - m12) * tmp;
                    this.w = (m13 + m31) * tmp;

                }

            }
            return this;
        }

        public toMatrix3D(target?: Matrix3D) {
            const { x, y, z, w } = this;
            const x2 = x + x,
                y2 = y + y,
                z2 = z + z,

                xx = x * x2,
                xy = x * y2,
                xz = x * z2,
                yy = y * y2,
                yz = y * z2,
                zz = z * z2,
                wx = w * x2,
                wy = w * y2,
                wz = w * z2;


            if (!target) {
                target = new Matrix3D();
            }
            const rawData = target.rawData;
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
        }


        /**
         * @param axis   must be a normalized vector
         * @param angleInRadians
         */
        public fromAxisAngle(axis: Point3DW, angleInRadians: number) {
            const angle = angleInRadians * 0.5;
            const sin_a = Math.sin(angle);
            const cos_a = Math.cos(angle);

            this.x = axis.x * sin_a;
            this.y = axis.y * sin_a;
            this.z = axis.z * sin_a;
            this.w = cos_a;
        }


        public conjugate(): void {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;

        }

        public toString(): string {
            return "[Quaternion] (x:" + this.x + " ,y:" + this.y + ", z:" + this.z + ", w:" + this.w + ")";
        }

    }
}
