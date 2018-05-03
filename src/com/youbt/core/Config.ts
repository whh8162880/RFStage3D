/// <reference path="./Extend.ts" />
module rf{
    export let gl:WebGLRenderingContext;
    export var stageWidth:number = 0;
    export var stageHeight:number = 0;
    export var isWindowResized:boolean = false;
    export var max_vc:number = 100;
    export let c_white:string = `rgba(255,255,255,255)`;
    export let pixelRatio:number = 2;


    export enum ExtensionDefine{
        JPG = ".jpg",
        PNG = ".png",
        KM = ".km",
        DAT = ".dat",
        P3D = ".p3d",
        PARTICLE = ".pa"
    }
    
    export function isPowerOfTwo(n: number): boolean {
        return (n !== 0) && ((n & (n - 1)) === 0);
    }
}
