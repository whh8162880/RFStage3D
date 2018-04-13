module rf{
    export class Material {
        triangleFaceToCull: string = Context3DTriangleFace.NONE;
        sourceFactor: number;
        destinationFactor: number;
        depthMask: boolean = false;
        passCompareMode: number;
    }



    export class ColorMaterial extends Material{

        color:number;
        
        createProgram(){

        }

        




    }
}