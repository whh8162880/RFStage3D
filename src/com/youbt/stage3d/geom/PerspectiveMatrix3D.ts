module rf {
    export class PerspectiveMatrix3D extends Float32Array {

        public lookAtLH(eye: Point3DW, at: Point3DW, up: Point3DW): void {
            //http://msdn.microsoft.com/en-us/library/windows/desktop/bb281710(v=vs.85).aspx

            //zaxis = normal(at - eye)
            const sqrt = Math.sqrt;
            const { x: eyex, y: eyey, z: eyez } = eye;
            const { x: upx, y: upy, z: upz } = up;

            let zX = at.x - eyex;
            let zY = at.y - eyey;
            let zZ = at.z - eyez;
            let len = 1 / sqrt(zX * zX + zY * zY + zZ * zZ);
            zX *= len;
            zY *= len;
            zZ *= len;

            //xaxis = normal(cross(up,zaxis))
            let xX = upy * zZ - upz * zY;
            let xY = upz * zX - upx * zZ;
            let xZ = upx * zY - upy * zX;
            len = 1 / sqrt(xX * xX + xY * xY + xZ * xZ);
            xX *= len;
            xY *= len;
            xZ *= len;
            //yaxis = cross(zaxis,xaxis)
            const yX = zY * xZ - zZ * xY;
            const yY = zZ * xX - zX * xZ;
            const yZ = zX * xY - zY * xX;

            this.set([
                xX, xY, xZ, -(xX * eyex + xY * eyey + xZ * eyez),
                yX, yY, yZ, -(yX * eyex + yY * eyey + yZ * eyez),
                zX, zY, zZ, -(zX * eyex + zY * eyey + zZ * eyez),
                0.0, 0.0, 0.0, 1.0
            ]);

        }

        public lookAtRH(eye: Point3DW, at: Point3DW, up: Point3DW): void {
            //http://msdn.microsoft.com/en-us/library/windows/desktop/bb281711(v=vs.85).aspx
            //http://blog.csdn.net/popy007/article/details/5120158
            const sqrt = Math.sqrt;
            const { x: eyex, y: eyey, z: eyez } = eye;
            const { x: upx, y: upy, z: upz } = up;
            //zaxis = normal(eye - at)
            let zX = eyex - at.x;
            let zY = eyey - at.y;
            let zZ = eyez - at.z;

            let len = 1 / sqrt(zX * zX + zY * zY + zZ * zZ);
            zX *= len;
            zY *= len;
            zZ *= len;

            // xaxis = normal(cross(up,zaxis))
            let xX = upy * zZ - upz * zY;
            let xY = upz * zX - upx * zZ;
            let xZ = upx * zY - upy * zX;

            len = 1 / sqrt(xX * xX + xY * xY + xZ * xZ);
            xX *= len;
            xY *= len;
            xZ *= len;

            //yaxis = cross(zaxis,xaxis)
            const yX = zY * xZ - zZ * xY;
            const yY = zZ * xX - zX * xZ;
            const yZ = zX * xY - zY * xX;

            this.set([
                xX, xY, xZ, -(xX * eyex + xY * eyey + xZ * eyez),
                yX, yY, yZ, -(yX * eyex + yY * eyey + yZ * eyez),
                zX, zY, zZ, -(zX * eyex + zY * eyey + zZ * eyez),
                0.0, 0.0, 0.0, 1.0
            ]);

        }

        public perspectiveOffCenterLH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): void {
            this.set([
                2.0 * zNear / (right - left), 0.0, (left + right) / (left - right), 0.0,
                0.0, 2.0 * zNear / (top - bottom), (bottom + top) / (bottom - top), 0.0,
                0.0, 0.0, (zFar + zNear) / (zFar - zNear), 2.0 * zFar * zNear / (zNear - zFar),
                0.0, 0.0, 1.0, 0.0
            ]);
        }

        public perspectiveLH(width: number, height: number, zNear: number, zFar: number): void {
            this.set([
                2.0 * zNear / width, 0.0, 0.0, 0.0,
                0.0, 2.0 * zNear / height, 0.0, 0.0,
                0.0, 0.0, (zFar + zNear) / (zFar - zNear), 2.0 * zFar * zNear / (zNear - zFar),
                0.0, 0.0, 1.0, 0.0
            ]);
        }

        public perspectiveFieldOfViewLH(fieldOfViewY: number, aspectRatio: number, zNear: number, zFar: number): void {
            let yScale: number = 1.0 / Math.tan(fieldOfViewY / 2.0);
            let xScale: number = yScale / aspectRatio;
            this.set([
                xScale, 0.0, 0.0, 0.0,
                0.0, yScale, 0.0, 0.0,
                0.0, 0.0, (zFar + zNear) / (zFar - zNear), 1.0,
                0.0, 0.0, 2.0 * zFar * zNear / (zNear - zFar), 0.0
            ]);

        }

        public orthoOffCenterLH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): void {
            this.set([
                2.0 / (right - left), 0.0, 0.0, (left + right) / (left - right),
                0.0, 2.0 / (top - bottom), 0.0, (bottom + top) / (bottom - top),
                0.0, 0.0, 2 / (zFar - zNear), (zNear + zFar) / (zNear - zFar),
                0.0, 0.0, 0.0, 1.0
            ]);
        }
        public orthoLH(width: number, height: number, zNear: number, zFar: number): void {
            this.set([
                2.0 / width, 0.0, 0.0, 0.0,
                0.0, 2.0 / height, 0.0, 0.0,
                0.0, 0.0, 2 / (zFar - zNear), (zNear + zFar) / (zNear - zFar),
                0.0, 0.0, 0.0, 1.0
            ]);
        }



        //pass test
        public perspectiveOffCenterRH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): void {
            this.set([
                2.0 * zNear / (right - left), 0.0, (right + left) / (right - left), 0.0,
                0.0, 2.0 * zNear / (top - bottom), (top + bottom) / (top - bottom), 0.0,
                0.0, 0.0, (zNear + zFar) / (zNear - zFar), 2.0 * zNear * zFar / (zNear - zFar),
                0.0, 0.0, -1.0, 0.0
            ]);
        }
        //pass test
        public perspectiveRH(width: number, height: number, zNear: number, zFar: number): void {
            this.set([
                2.0 * zNear / width, 0.0, 0.0, 0.0,
                0.0, 2.0 * zNear / height, 0.0, 0.0,
                0.0, 0.0, (zNear + zFar) / (zNear - zFar), 2.0 * zNear * zFar / (zNear - zFar),
                0.0, 0.0, -1.0, 0.0
            ]);
        }

        //pass test
        public perspectiveFieldOfViewRH(fieldOfViewY: number, aspectRatio: number, zNear: number, zFar: number): void {
            const yScale = 1.0 / Math.tan(fieldOfViewY / 2.0);
            const xScale = yScale / aspectRatio;
            this.set([
                xScale, 0.0, 0.0, 0.0,
                0.0, yScale, 0.0, 0.0,
                0.0, 0.0, (zFar + zNear) / (zNear - zFar), 2.0 * zNear * zFar / (zNear - zFar),
                0.0, 0.0, -1.0, 0.0
            ]);
        }

        public orthoOffCenterRH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): void {
            this.set([
                2.0 / (right - left), 0.0, 0.0, (left + right) / (left - right),
                0.0, 2.0 / (top - bottom), 0.0, (bottom + top) / (bottom - top),
                0.0, 0.0, -2.0 / (zFar - zNear), (zNear + zFar) / (zNear - zFar),
                0.0, 0.0, 0.0, 1.0
            ]);
        }

        public orthoRH(width: number, height: number, zNear: number, zFar: number): void {
            this.set([
                2.0 / width, 0.0, 0.0, 0.0,
                0.0, 2.0 / height, 0.0, 0.0,
                0.0, 0.0, -2.0 / (zFar - zNear), (zNear + zFar) / (zNear - zFar),
                0.0, 0.0, 0.0, 1.0
            ]);
        }



    }
}
