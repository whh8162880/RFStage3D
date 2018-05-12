/// <reference path="./Extend.ts" />
module rf{
    export let gl:WebGLRenderingContext;
    export var stageWidth:number = 0;
    export var stageHeight:number = 0;
    export var isWindowResized:boolean = false;
    export var max_vc:number = 100;
    export let c_white:string = `rgba(255,255,255,255)`;
    export let pixelRatio:number = 2;
    export const enum ExtensionDefine{
        JPG = ".jpg",
        PNG = ".png",
        KM = ".km",
        DAT = ".dat",
        P3D = ".p3d",
        PARTICLE = ".pa",
        SKILL = ".sk",
        KF = ".kf"
    }
    
    export function isPowerOfTwo(n: number): boolean {
        return (n !== 0) && ((n & (n - 1)) === 0);
    }


    export const enum WebGLConst{
        ONE = 1,
        /**
         * Passed to `blendFunc` or `blendFuncSeparate` to multiply a component by the source's alpha.
         */
        SRC_ALPHA = 0x0302,
        /**
         * Passed to `blendFunc` or `blendFuncSeparate` to multiply a component by one minus the source's alpha.
         */
        ONE_MINUS_SRC_ALPHA = 0x0303,
        NONE = 0,
        /**
         * Passed to `cullFace` to specify that only back faces should be drawn.
         */
        BACK = 0x0405,
        /**
         * 
         */
        CLAMP_TO_EDGE = 0x812F,
        /**
         * 
         */
        NEAREST = 0x2600,
        /**
         * Passed to `depthFunction` or `stencilFunction` to specify depth or stencil tests will always pass. i.e. Pixels will be drawn in the order they are drawn.
         */
        ALWAYS = 0x0207,
        /**
         * Passed to `depthFunction` or `stencilFunction` to specify depth or stencil tests will pass if the new depth value is less than or equal to the stored value.
         */
        LEQUAL = 0x0203
    }

    
}
