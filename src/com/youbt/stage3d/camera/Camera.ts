///<reference path="../display/DisplayObject.ts" />
module rf{
    export class Camera extends DisplayObject implements IResizeable{
        len:Matrix3D;
        far :number;

        originFar:number;
        worldTranform:Matrix3D;
        constructor(far:number = 10000){
            super();
            this.far = far;
            this.originFar = far / Math.PI2;
            this.len = new Matrix3D();
            this.worldTranform = new Matrix3D();
        }

        resize(width: number, height: number): void{}

        public updateSceneTransform(sceneTransform?:Matrix3D):void{
            if( this.states | DChange.trasnform){
                this.updateTransform();
                this.sceneTransform.copyFrom(this.transform);
                this.sceneTransform.invert();
                this.worldTranform.copyFrom(this.sceneTransform);
                this.worldTranform.append(this.len);
                this.states &= ~DChange.trasnform;
            }
        }
    }

    export class CameraUI extends Camera{
        resize(width: number, height: number): void{
            this.w = width;
            this.h = height;

            let rawData = this.len.rawData;

            rawData[0] = 2/width;
            rawData[1] = 0;
            rawData[2] = 0;
            rawData[3] = 0;

            rawData[4] = 0;
            rawData[5] = -2/height;
            rawData[6] = 0;
            rawData[7] = 0;

            rawData[8] = 0;
            rawData[9] = 0;
            rawData[10] = 1/this.far;
            rawData[11] = 0;

            rawData[12] = -1;
            rawData[13] = 1;
            rawData[14] = 0;
            rawData[15] = 1;

            this.states |= DChange.trasnform;
        }
    }

    // Orthographic Projection
    export class CameraOrth extends Camera{
        
        resize(width: number, height: number): void{
            this.w = width;
            this.h = height;

            let rawData = this.len.rawData;

            rawData[0] = 2/width;
            rawData[1] = 0;
            rawData[2] = 0;
            rawData[3] = 0;

            rawData[4] = 0;
            rawData[5] = 2/height;
            rawData[6] = 0;
            rawData[7] = 0;

            rawData[8] = 0;
            rawData[9] = 0;
            rawData[10] = 1/this.far;
            rawData[11] = 0;

            rawData[12] = 0;
            rawData[13] = 0;
            rawData[14] = 0;
            rawData[15] = 1;

            this.states |= DChange.trasnform;
        }

        
    }

    //  Perspective Projection Matrix
    export class Camera3D extends Camera{
        resize(width: number, height: number): void{
            this.w = width;
            this.h = height;

            let zNear = 0.1;
            let zFar = this.far;

            // let len = new PerspectiveMatrix3D();
            // len.perspectiveFieldOfViewLH(45,width/height,0.1,10000);
            // this.len = len;
            // len.transpose();

            // xScale, 0.0, 0.0, 0.0,
            // 0.0, yScale, 0.0, 0.0,
            // 0.0, 0.0, (zFar + zNear) / (zFar - zNear), 1.0,
            // 0.0, 0.0, 2.0 * zFar * zNear / (zNear - zFar), 0.0
            
            // (zFar + zNear) / (zFar - zNear)
            // 2.0 * zFar * zNear / (zNear - zFar)

            // this.len = len;
            let rawData = this.len.rawData;

            // let yScale: number = 1.0 / Math.tan(45 / 2.0);
            // let xScale: number = yScale / width * height;
            // rawData[0] = xScale;        rawData[1] = 0;                   rawData[2] = 0;                                       rawData[3] = 0;
            // rawData[4] = 0;             rawData[5] = yScale;              rawData[6] = 0;                                       rawData[7] = 0;
            // rawData[8] = 0;             rawData[9] = 0;                   rawData[10] = (zFar + zNear) / (zFar - zNear);        rawData[11] = 1.0;
            // rawData[12] = 0;            rawData[13] = 0;                  rawData[14] = 2.0 * zFar * zNear / (zNear - zFar);    rawData[15] = 0;


            rawData[0] = 2/width;      rawData[1] = 0;             rawData[2] = 0;                  rawData[3] = 0;
            rawData[4] = 0;            rawData[5] = 2/height;      rawData[6] = 0;                  rawData[7] = 0;
            rawData[8] = 0;            rawData[9] = 0;             rawData[10] = 1/this.far;        rawData[11] = 1/this.originFar;
            rawData[12] = 0;           rawData[13] = 0;            rawData[14] = -1/this.far;       rawData[15] = 0;

            
            this.states |= DChange.trasnform;
        }
    }
}