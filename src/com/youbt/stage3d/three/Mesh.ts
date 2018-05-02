///<reference path="../Stage3D.ts" />
module rf {
    export class Mesh extends SceneObject {
        scene: Scene;
        geometry: GeometryBase;
        invSceneTransform: IMatrix3D;
        skAnim:SkeletonAnimation;
        constructor(variables?: { [key: string]: IVariable }) {
            super(variables ? variables : vertex_mesh_variable);
            this.invSceneTransform = newMatrix3D();
            this.nativeRender = true;
        }


        updateSceneTransform(): void {
            super.updateSceneTransform();
            let { invSceneTransform, sceneTransform } = this;
            invSceneTransform.set(sceneTransform);
            invSceneTransform.m3_invert();


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
            var plain;
            if(inflate instanceof Uint8Array){
                plain = inflate;
            }else{
                plain = inflate.decompress();
            }
            
            amf.setArrayBuffer(plain.buffer);
            // amf.setArrayBuffer(byte);
            let o = amf.readObject();
            this.setKFM(o);
        }

        setKFM(kfm:ISkeletonMeshData) {
            let{mesh,skeleton:skeletonData,material:materialData}=kfm;
            let{material,geometry}=this;
            let c = context3D;

            if(!geometry){
                this.geometry = geometry = new GeometryBase(this.variables);
            }
            geometry.setData(mesh);

            if(!material){
                this.material = material = new PhongMaterial();
            }
            material.setData(kfm.material);

            material.diffTex.url = this.id + material.diffTex.url;


            


            // this.material["diffTex"] = this.id + kfm["diff"];
            // this.material["diffTex"] = this.id + "diff.png";
            //=========================
            //skeleton
            //=========================
            let skeleton = new Skeleton(kfm.skeleton);
            //===========================
            //  Animation
            //===========================
            this.skAnim = skeleton.createAnimation();
            // let action = "Take 001";
            let action = "stand";
            let animationData = kfm.anims[action];
            skeleton.initAnimationData(animationData);
            this.skAnim.play(animationData,engineNow);

            
        }
    }

    export class Skeleton {
        rootBone: IBone;
        // bonePose: IBonePose;
        defaultMatrices: Float32Array;
        vertex: VertexBuffer3D;
        boneCount: number;
        animations: { [key: string]:ISkeletonAnimationData } = {};
        
        constructor(config: ISkeletonData) {

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
                    sceneTransform.m3_append(parent.sceneTransform);
                    // matrix3d_multiply(sceneTransform, parent.sceneTransform, sceneTransform);
                }

                if(index > -1){
                    let matrice = new Float32Array(buffer, index * 16 * 4, 16);
                    matrice.m3_append(sceneTransform,false,inv);
                    // matrix3d_multiply(inv,sceneTransform,matrice);
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
                    sceneTransform.m3_append(parent.sceneTransform,false,matrix)
                    // matrix3d_multiply(matrix, parent.sceneTransform, sceneTransform);
                    // multiplyMatrices(parent.sceneTransform,matrix,sceneTransform);
                    
                }else{
                    sceneTransform.set(matrix);
                }

                if(index > -1){
                    let matrice = new Float32Array(buffer, index * 16 * 4, 16);
                    // matrix3d_multiply(inv, sceneTransform, matrice);
                    matrice.m3_append(sceneTransform,false,inv);
                    // multiplyMatrices(sceneTransform,inv,matrice);
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