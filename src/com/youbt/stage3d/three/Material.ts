module rf{
    export class Material {
        triangleFaceToCull: string = Context3DTriangleFace.NONE;
        sourceFactor: number;
        destinationFactor: number;
        depthMask: boolean = false;
        passCompareMode: number;
    }



    export class PhongMaterial extends Material{
        //贴图
        diff:number = 0xFFFFFF;
        diffTex:string;

        //自发光
        emissive:number = 0x000000;
        emissiveTex:string;

        //高光
        specular:number = 0x000000;
        specularTex:string;

        //

        
        createProgram(){

        }

        




    }
}