///<reference path="../Stage3D.ts" />
module rf{
    export class Light extends Camera{
        color:number = 0xFFFFFF;
        intensity:number = 1.0;
        lookVector:IVector3D = newVector3D(0,0,0);

        public updateSceneTransform(sceneTransform?:IMatrix3D):void{
            if( this.status | DChange.trasnform){
                let{transform,lookVector,sceneTransform,len}=this;
                this.lookat(lookVector);
                this.updateTransform();
                this.sceneTransform.m3_invert(transform);
                this.worldTranform.m3_append(len,false,sceneTransform);
                // this.states &= ~DChange.trasnform;
            }
            this.status = 0;
        }
    }

    export class DirectionalLight extends Light{

    }
}