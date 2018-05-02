module rf{

    export interface IData{
        [key:string]:any;
        [key:number]:any;
    }

    export interface IMeshData extends IData{
        vertex:Float32Array;
        index:Uint16Array;
        variables:{ [key: string]: IVariable };
        numVertices:number;
        numTriangles:number;
        data32PerVertex:number;

        vertexBuffer:VertexBuffer3D;
        indexBuffer:IndexBuffer3D;
    }

    export interface IBone extends IData{
        inv: IMatrix3D;
        matrix: IMatrix3D;
        sceneTransform: Float32Array;
        name: string;
        index: number;
        parent: IBone;
        children: IBone[];
    }

    export interface ISkeletonData extends IData{
        vertex:Float32Array;
        root:IBone;
        data32PerVertex:number;
        numVertices: number;
        boneCount:number;
    }


    export interface ITextureData extends IData{
        key:string;
        url:string;
        mipmap:boolean;
        mag:string;
        mix:string;
        repeat:boolean;
    }



    export interface IMaterialData extends IData{
        depthMask:boolean;
        passCompareMode:string;
        srcFactor:string;
        dstFactor:string;
        cull:string;
        alphaTest:number; //0表示不剔除
        diffTex?:ITextureData;
    }


    export interface ISkeletonMeshData extends IData{
        mesh:IMeshData;
        skeleton:ISkeletonData;
        material:IMaterialData;
    }



    export interface ISkeletonAnimationData extends IData{
        skeleton: Skeleton;
        matrices:Float32Array[];
        duration:number;
        eDuration:number;
        totalFrame:number;
        name:string;
        frames:{[key:string]:Float32Array};
    }
}