///<reference path="../Stage3D.ts" />
module rf{
    export class Light extends DisplayObject{
        color:number = 0xFFFFFF;
        intensity:number = 1.0;
    }

    export class DirectionalLight extends Light{

    }
}