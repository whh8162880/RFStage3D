module rf{

    export interface IData{
        [key:string]:any;
        [key:number]:any;
    }
    /**
     * 贴图数据
     * 如果只有url 可以通过context3D.getTextureData(url)获得
     */
    export interface ITextureData extends IData{
        key:string;
        url:string;
        mipmap:boolean;
        mag:number;
        mix:number;
        repeat:number;
    }


    /**
     * 材质球数据
     */
    export interface IMaterialData extends IData{
        depthMask:boolean;
        passCompareMode:number;
        srcFactor:number;
        dstFactor:number;
        cull:number;
        alphaTest:number; //0表示不剔除
        diffTex?:ITextureData;
    }

    /**
     * 模型数据
     */
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

    /**
     * 单骨骼数据
     */
    export interface IBone extends IData{
        inv: IMatrix3D;
        matrix: IMatrix3D;
        sceneTransform: Float32Array;
        name: string;
        index: number;
        parent: IBone;
        children: IBone[];
    }

    /**
     * 全骨骼数据
     */
    export interface ISkeletonData extends IData{
        vertex:Float32Array;
        root:IBone;
        data32PerVertex:number;
        numVertices: number;
        boneCount:number;
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


    //==========================================================================================================================================
    //  PARTICLE
    //==========================================================================================================================================
    export interface IParticlePropertyData{
        delay:number;
        duration:number;
        index:number;
        startTime:number;
        total:number;
        totalTime:number;
    }

    export interface IParticleRuntimeData extends IMeshData{
        props:IParticlePropertyData[];
    }

    export interface IParticleSettingData{
        offset:number;
        speed:number;
        pos:IVector3D;
        rot:IVector3D;
    }

    export interface IParticleNodeInfo{
        name:string;
        type:number;

        key:string;

        vertexFunction:string;

        fragmentFunction:string;

    }

    export interface IParticleTimeNodeInfo extends IParticleNodeInfo{
        usesDuration:boolean;
        usesLooping:boolean;
        usesDelay:boolean;
    }


    export interface IParticleScaleNodeInfo extends IParticleNodeInfo{
        scaleType:number;
        usesCycle:boolean;
        usesPhase:boolean;
    }

    export interface IParticleSegmentColorNodeInfo extends IParticleNodeInfo{
        usesMul:boolean;
        usesAdd:boolean;
        len:number;
        mul:number;
        add:number;
        data:Float32Array;
    }

    export interface IParticleSpriteSheetAnimNodeInfo extends IParticleNodeInfo{
        usesCycle:boolean;
        usesPhase:boolean;
        totalFrames:number;
        colum:number;
        rows:number;
        data:Float32Array;
    }

    export interface IParticleData{
        material:IMaterialData;
        mesh:IMeshData;
        runtime:IParticleRuntimeData;
        setting:IParticleSettingData;
        nodes:{[key:string]:IParticleNodeInfo}
    }

    //====================================================================================
    //  Skill
    //====================================================================================
    export interface ISkillBaseEvent{
        type:number;
        key:string;
        time:number;
        next:ISkillBaseEvent;
        pre:ISkillBaseEvent;
    }
    export interface ISkillPointData{
        skillEvents:ISkillBaseEvent[];
        createEvents:ISkillBaseEvent[];
        time:number;
        index:number;
    }

    export interface ISkillLineData{
        desc:string;
        count:number;
        points:ISkillPointData[];
        runtime:{[key:string]:RenderBase};
    }

    export interface ISkillData{
        lines:ISkillLineData[];
    }
}