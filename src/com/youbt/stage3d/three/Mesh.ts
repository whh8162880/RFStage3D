///<reference path="../Stage3D.ts" />
module rf {
    export class Mesh extends SceneObject {
        scene: Scene;
        geometry: GeometryBase;
        invSceneTransform: Matrix3D;
        skAnim:SkeletonAnimation;
        constructor(variables?: { [key: string]: IVariable }) {
            super(variables ? variables : vertex_mesh_variable);
            this.invSceneTransform = new Matrix3D();
            this.nativeRender = true;
        }


        updateSceneTransform(): void {
            super.updateSceneTransform();
            let { invSceneTransform, sceneTransform } = this;
            invSceneTransform.copyFrom(sceneTransform);
            invSceneTransform.invert();


        }


        init(geometry: GeometryBase, material: Material) {
            this.geometry = geometry;
            this.material = material;
        }

        render(camera: Camera, now: number, interval: number): void {
            const { geometry, material, skAnim } = this;
            if (undefined != geometry && undefined != material) {
                let b = material.uploadContext(camera, this, now, interval);
                if (true == b) {
                    const{program}=material;
                    if (undefined != skAnim) {
                        skAnim.uploadContext(camera,this,program,now,interval);
                    }
                    geometry.uploadContext(camera, this, program, now, interval);
                    context3D.drawTriangles(geometry.index, geometry.numTriangles)
                }
            }
            super.render(camera, now, interval);
        }
    }


    export class KFMMesh extends Mesh {

        id: string;


        constructor(material?: Material, variables?: { [key: string]: IVariable }) {
            super(variables);
            this.material = material;
        }

        load(url: string) {
            this.id = url;
            url += "mesh.km";
            loadRes(url, this.loadCompelte, this, ResType.bin);
        }

        loadCompelte(e: EventX) {
            let item: ResItem = e.data;
            let amf = singleton(AMF3);
            let byte = item.data;
            var inflate = new Zlib.Inflate(new Uint8Array(byte));
            var plain = inflate.decompress();
            amf.setArrayBuffer(plain.buffer);
            // amf.setArrayBuffer(byte);
            let o = amf.readObject();
            this.setKFM(o);
        }

        setKFM(kfm) {
            let mesh = kfm.mesh ? kfm.mesh : kfm;
            let c = context3D;
            let vertex = new Float32Array(mesh["vertex"]);
            let geometry = new GeometryBase(this.variables);
            geometry.numVertices = mesh["numVertices"];
            geometry.numTriangles = mesh["numTriangles"];
            geometry.data32PerVertex = mesh["data32PerVertex"];
            let info: VertexInfo = new VertexInfo(vertex, geometry.data32PerVertex, this.variables);
            geometry.vertex = c.createVertexBuffer(info);


            if (mesh.matrix) {
                let m = new Matrix3D(mesh.matrix);
                m.appendScale(100, 100, 100);
                this.setTransform(m.rawData);
            }

            let index = mesh["index"];
            if (index) {
                geometry.index = c.createIndexBuffer(new Uint16Array(index));
            }


            this.geometry = geometry;
            this.material.triangleFaceToCull = Context3DTriangleFace.NONE;
            // this.material["diffTex"] = this.id + kfm["diff"];
            this.material["diffTex"] = this.id + "diff.png";
            //=========================
            //skeleton
            //=========================
            let skeleton = new Skeleton(kfm.skeleton);
            //===========================
            //  Animation
            //===========================
            let animationData = kfm.anims["Take 001"];
            skeleton.initAnimationData(animationData);
            // let animation = skeleton.createSkeletionAnimation();
            this.skAnim = skeleton.createAnimation();
            this.skAnim.play(animationData,engineNow);

            
        }
    }



    export interface IBone {
        inv: Float32Array;
        matrix: Float32Array;
        sceneTransform: Float32Array;
        name: string;
        index: number;
        parent: IBone;
        children: IBone[];
    }

    export interface ISkeletonAnimationData {
        skeleton: Skeleton;
        matrices:Float32Array[];
        duration:number;
        eDuration:number;
        totalFrame:number;
        name:string;
        frames:{[key:string]:Float32Array};
    }

    // export interface ISkeletonAnimation {
        
    // }

    // export interface IBonePose {
    //     bone: IBone;
    //     index: number;
    //     status: number;
    //     inv: Float32Array;
    //     transform: Float32Array;
    //     sceneTransform: Float32Array;
    //     matriceTransfrom: Float32Array;
    //     parent: IBonePose;
    //     children: IBonePose[];
    // }


    export interface ISkeletonConfig {
        data32PerVertex: number;
        numVertices: number;
        vertex: ArrayBuffer;
        root: IBone;
        boneCount:number;
    }

    export function multiplyMatrices(a, b, te) {

        var ae = a;
        var be = b;

        var a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
        var a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
        var a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
        var a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

        var b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
        var b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
        var b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
        var b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];

        te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

        te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

        te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

        te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    }

    export class Skeleton {
        rootBone: IBone;
        // bonePose: IBonePose;
        defaultMatrices: Float32Array;
        vertex: VertexBuffer3D;
        boneCount: number;
        animations: { [key: string]:ISkeletonAnimationData } = {};
        
        constructor(config: ISkeletonConfig) {

            let { boneCount ,defaultMatrices } = this;

            this.boneCount = boneCount = config.boneCount;
            let buffer = new ArrayBuffer(16 * 4 * boneCount);
            this.defaultMatrices = defaultMatrices = new Float32Array(buffer);

            function init(bone: IBone) {
                let { inv, matrix, parent, children, name ,index} = bone;
                if (undefined != inv) {
                    bone.inv = inv = new Float32Array(inv);
                }
                bone.matrix = matrix = new Float32Array(matrix);
                let sceneTransform = new Float32Array(matrix);
                if (parent) {
                    matrix3d_multiply(sceneTransform, parent.sceneTransform, sceneTransform);
                    if(index > -1){
                        let matrice = new Float32Array(buffer, index * 16 * 4, 16);
                        multiplyMatrices(sceneTransform,inv,matrice);
                    }
                }
                bone.sceneTransform = sceneTransform;

                children.forEach(b => {
                    init(b);
                });
            }

            init(config.root);

            this.rootBone = config.root;

            this.vertex = context3D.createVertexBuffer(new VertexInfo(new Float32Array(config.vertex), config.data32PerVertex, vertex_skeleton_variable));
        }

        initAnimationData(anim:ISkeletonAnimationData){
            anim.skeleton = this;
            anim.matrices = [];
            let frames = anim.frames;
            for(let key in frames){
                frames[key] = new Float32Array(frames[key]);
            }
            this.animations[anim.name] = anim;
        }


        createAnimation(){
            let anim = recyclable(SkeletonAnimation);
            anim.skeleton = this;
            return anim;
        }


        getMatricesData(anim:ISkeletonAnimationData,frame:number){
            let result = anim.matrices[frame];
            if(undefined != result){
                return result;
            }

            let{boneCount,rootBone}=this;
            let{frames}=anim;


            let map:{[key:string]:IBone} = {};

            let buffer = new ArrayBuffer(16 * 4 * boneCount);
            result = new Float32Array(buffer);
            anim.matrices[frame] = result;


            function update(bone:IBone){
                let { inv, matrix,sceneTransform, parent, children, name ,index} = bone;
                let frameData = frames[bone.name];

                if(frameData){
                    matrix.set(frameData.slice(frame*16,(frame+1)*16));
                }

                if (parent) {
                    matrix3d_multiply(matrix, parent.sceneTransform, sceneTransform);
                    // multiplyMatrices(parent.sceneTransform,matrix,sceneTransform);
                    if(index > -1){
                        let matrice = new Float32Array(buffer, index * 16 * 4, 16);
                        matrix3d_multiply(inv, sceneTransform, matrice);
                        // multiplyMatrices(sceneTransform,inv,matrice);
                    }
                }else{
                    sceneTransform.set(matrix);
                }

                map[bone.name] = bone;

                children.forEach(element => {
                    update(element);
                });
            }

            update(rootBone);

            
            return result;
        }

        // createSkeletionAnimation() {

        //     let { rootBone, boneCount } = this;

        //     let skeletonAni = {} as ISkeletonAnimation;
        //     let buffer = new ArrayBuffer(16 * 4 * boneCount)
        //     skeletonAni.boneMatrices = new Float32Array(buffer);

        //     function createBoneAnimation(bone: IBone, parent?: IBonePose) {
        //         let { matrix, sceneTransform, index, inv } = bone;
        //         let m = skeletonAni.boneMatrices;
        //         let ani: IBonePose = {} as IBonePose;
        //         ani.bone = bone;
        //         ani.transform = new Float32Array(matrix);
        //         ani.sceneTransform = new Float32Array(sceneTransform);
        //         ani.index = index;
        //         ani.inv = inv;
        //         if (index > -1) {
        //             if (index == 0) {
        //                 index = 0;
        //             }
        //             ani.matriceTransfrom = new Float32Array(buffer, index * 16 * 4, 16);
        //             multiplyMatrices(sceneTransform,inv,ani.matriceTransfrom);
        //             // matrix3d_multiply(sceneTransform, inv, ani.matriceTransfrom);
        //         }
        //         ani.parent = parent;
        //         ani.status = 0;

        //         ani.children = [];
        //         bone.children.forEach(b => {
        //             ani.children.push(createBoneAnimation(b, ani));
        //         });
        //         return ani;
        //     }

        //     this.bonePose = createBoneAnimation(rootBone);

        //     skeletonAni.skeleton = this;

        //     return skeletonAni;
        // }

        // updateSkeletonAnimation(anim: ISkeletonAnimation) {

        //     let { rootBone, boneMatrices } = anim;


        //     function updateBoneMatrices(bone: IBonePose) {

        //         const { index, sceneTransform, status, children, matriceTransfrom } = bone;

        //         let change = false;
        //         if (status & DChange.trasnform) {
        //             const { transform, parent } = bone;
        //             if (parent) {
        //                 matrix3d_multiply(transform, parent.sceneTransform, sceneTransform);
        //             } else {
        //                 sceneTransform.set(transform);
        //             }
        //             change = true;
        //             bone.status &= ~DChange.trasnform;
        //             if (index > -1) {
        //                 // multiplyMatrices(sceneTransform,bone.inv,matriceTransfrom);
        //                 matrix3d_multiply(sceneTransform, bone.inv, matriceTransfrom);
        //             }
        //         }
        //         children.forEach(b => {
        //             if (change) b.status |= DChange.trasnform;
        //             updateBoneMatrices(b);
        //         });
        //     }

        //     updateBoneMatrices(rootBone);
        // }
    }

    export class SkeletonAnimation{
        skeleton: Skeleton;
        pose:{[key:string]:Float32Array} = {};
        starttime:number;
        nextTime:number;
        animationData:ISkeletonAnimationData;

        currentFrame:number = 0;

        play(animationData:ISkeletonAnimationData,now:number){
            this.animationData = animationData;
            this.nextTime = now + animationData.eDuration * 1000;
        }

        uploadContext(camera: Camera, mesh: Mesh, program: Program3D, now: number, interval: number) {
            let{animationData,skeleton,starttime,currentFrame,nextTime}=this;
            skeleton.vertex.uploadContext(program);
            let matrixes:Float32Array;
            if(undefined == animationData){
                matrixes = skeleton.defaultMatrices;
            }else{
                if(currentFrame >= animationData.totalFrame){
                    currentFrame = 0;
                }
    
                if(now > nextTime){
                    this.nextTime = nextTime  + animationData.eDuration * 1000;
                    this.currentFrame = currentFrame+1;
                }
                matrixes = skeleton.getMatricesData(animationData,currentFrame);
            }
            context3D.setProgramConstantsFromMatrix(VC.vc_bones,matrixes);
        }

    }
}