///<reference path="../display/DisplayObject.ts" />
module rf{
    export class Camera extends DisplayObject{
        len:IMatrix3D;
        far :number;
        originFar:number;
        worldTranform:IMatrix3D;
        invSceneTransform: IMatrix3D;

        isPerspectiveCamera:boolean = false;
        isOrthographicCamera:boolean = false;
        constructor(far:number = 10000){
            super();
            this.far = far;
            this.originFar = far / Math.PI2;
            this.len = newMatrix3D();
            this.worldTranform = newMatrix3D();
            this.invSceneTransform=  newMatrix3D();
            
        }

        public updateSceneTransform(sceneTransform?:IMatrix3D):void{
            if( this.status | DChange.trasnform){
                this.updateTransform();
                this.sceneTransform.m3_invert(this.transform);
                this.worldTranform.m3_append(this.len,false,this.sceneTransform);
                // this.states &= ~DChange.trasnform;
            }
            this.status = 0;
        }

        // public updateSceneTransform(sceneTransform?:IMatrix3D):void{
        //     let{status,transform,invSceneTransform,worldTranform,len}=this;
        //     if( this.status | DChange.trasnform){
        //         this.updateTransform();
        //         if(sceneTransform){
        //             this.sceneTransform.m3_append(sceneTransform,false,transform);
        //         }else{
        //             this.sceneTransform.set(transform);
        //         }
        //         invSceneTransform.m3_invert(this.sceneTransform);
        //         worldTranform.m3_append(len,false,invSceneTransform);
        //         // this.states &= ~DChange.trasnform;
        //     }
        //     this.status = 0;
        // }
    }

    export function CameraUIResize(width: number, height: number,len:IMatrix3D,far:number,originFar,camera?:Camera){
        if(camera){
            camera.w = width;
            camera.h = height;
            camera.status |= DChange.trasnform;
            camera.isOrthographicCamera = true;
            camera.isPerspectiveCamera = false;
        }
        

        len[0] = 2/width;
        len[1] = 0;
        len[2] = 0;
        len[3] = 0;

        len[4] = 0;
        len[5] = -2/height;
        len[6] = 0;
        len[7] = 0;

        len[8] = 0;
        len[9] = 0;
        len[10] = 1/far;
        len[11] = 0;

        len[12] = -1;
        len[13] = 1;
        len[14] = 0;
        len[15] = 1;

        
    }


    export function CameraOrthResize(width: number, height: number,len:IMatrix3D,far:number,originFar,camera?:Camera){
        if(camera){
            camera.w = width;
            camera.h = height;
            camera.status |= DChange.trasnform;
            camera.isOrthographicCamera = true;
            camera.isPerspectiveCamera = false;
        }
       

        len[0] = 2/width;
        len[1] = 0;
        len[2] = 0;
        len[3] = 0;

        len[4] = 0;
        len[5] = 2/height;
        len[6] = 0;
        len[7] = 0;

        len[8] = 0;
        len[9] = 0;
        len[10] = 1/far;
        len[11] = 0;

        len[12] = 0;
        len[13] = 0;
        len[14] = -1/far*Math.PI*100;
        // len[14] = -1/far;
        len[15] = 1;

       
    }

    //  Perspective Projection Matrix
    export function Camera3DResize(width: number, height: number,len:IMatrix3D,far:number,originFar,camera?:Camera): void{
        if(camera){
            camera.w = width;
            camera.h = height;
            camera.status |= DChange.trasnform;
            camera.isPerspectiveCamera = true;
            camera.isOrthographicCamera = false;
        }
        

        // let zNear = 0.1;
        // let zFar = far;

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
        // let yScale: number = 1.0 / Math.tan(45 / 2.0);
        // let xScale: number = yScale / width * height;
        // rawData[0] = xScale;        rawData[1] = 0;                   rawData[2] = 0;                                       rawData[3] = 0;
        // rawData[4] = 0;             rawData[5] = yScale;              rawData[6] = 0;                                       rawData[7] = 0;
        // rawData[8] = 0;             rawData[9] = 0;                   rawData[10] = (zFar + zNear) / (zFar - zNear);        rawData[11] = 1.0;
        // rawData[12] = 0;            rawData[13] = 0;                  rawData[14] = 2.0 * zFar * zNear / (zNear - zFar);    rawData[15] = 0;


        len[0] = 2/width;      len[1] = 0;             len[2] = 0;                  len[3] = 0;
        len[4] = 0;            len[5] = 2/height;      len[6] = 0;                  len[7] = 0;
        len[8] = 0;            len[9] = 0;             len[10] = 1/far;        len[11] = 1/originFar;
        len[12] = 0;           len[13] = 0;            len[14] = -1/far*Math.PI*100;       len[15] = 0;
    }
}