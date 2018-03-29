module rf{
    class Canmera extends DisplayObject implements IResizeable{
        len:Matrix3D;
        far :number;
        worldTranform:Matrix3D;
        constructor(far:number = 10000){
            super();
            this.far = far;
            this.len = new Matrix3D();
            this.worldTranform = new Matrix3D();
        }

        resize(width: number, height: number): void{}
    }


    export class Canmera2D extends Canmera{
        
        resize(width: number, height: number): void{
            this._width = width;
            this._height = height;

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

            rawData[12] = 0;
            rawData[13] = 0;
            rawData[14] = 0;
            rawData[15] = 1;

            
        }

        public updateSceneTransform():void{
            if(true == this._change){
                this.updateTransform();
                this.sceneTransform.copyFrom(this.transform);
                this.sceneTransform.invert();
                this.worldTranform.copyFrom(this.sceneTransform);
                this.worldTranform.append(this.len);
                this._change = false;
            }
        }
    }
}