///<reference path="../Stage3D.ts" />
module rf {

    export var skeletonMeshObj:{[key:string]:ISkeletonMeshData} = {};


    export class Mesh extends SceneObject {
        scene: Scene;
        skAnim: SkeletonAnimation;
        constructor(variables?: { [key: string]: IVariable }) {
            super(variables ? variables : vertex_mesh_variable);
            this.invSceneTransform = newMatrix3D();
            this.nativeRender = true;
        }

        updateSceneTransform(): void {
            super.updateSceneTransform();
            let { invSceneTransform, sceneTransform } = this;
            invSceneTransform.m3_invert(sceneTransform);
        }


        renderShadow(sun:Light,p:Program3D,c:Context3D,worldTranform:IMatrix3D,now: number, interval: number){
            let{geometry,sceneTransform,skAnim}=this;
            geometry.vertex.uploadContext(p);
            worldTranform.m3_append(sun.worldTranform,false,sceneTransform);
            c.setProgramConstantsFromMatrix(VC.mvp,worldTranform);
            if (undefined != skAnim) {
                skAnim.uploadContext(sun, this, p, now, interval);
            }
        }
        

        render(camera: Camera, now: number, interval: number): void {
            const { geometry, material, skAnim } = this;
            if (undefined != geometry && undefined != material) {
                let b = material.uploadContext(camera, this, now, interval);
                if (true == b) {
                    const { program } = material;
                    if (undefined != skAnim) {
                        skAnim.uploadContext(camera, this, program, now, interval);
                    }
                    geometry.uploadContext(camera, this, program, now, interval);

                    let{shadowTarget,shadowMatrix}=this;

                    let c = context3D;
                    if(shadowTarget){
                        c.setProgramConstantsFromMatrix(VC.sunmvp,shadowMatrix);
                    }

                    c.drawTriangles(geometry.index, geometry.numTriangles)
                }
            }
            
            super.render(camera, now, interval);
        }


        onRecycle(){
            let{skAnim}=this;
            if(skAnim){
                this.skAnim = null;
            }
            super.onRecycle();
        }
    }


    export class KFMMesh extends Mesh {
        id: string;
        kfm : ISkeletonMeshData;
        defaultAnim:string;
        currentAnim:string;
        constructor(material?: Material, variables?: { [key: string]: IVariable }) {
            super(variables);
            this.material = material;
            this.defaultAnim = "stand";
            // this.shadowable = true;
        }

        load(url: string) {
            this.id = url;
            let kfm = skeletonMeshObj[url];
            if(!kfm){
                url += "mesh.km";
                loadRes(url, this.loadCompelte, this, ResType.bin);
            }
        }

        loadCompelte(e: EventX) {

            if(e.type == EventT.COMPLETE){
                let{url,data:byte}= e.data;
                let{id}=this;
                if(url.indexOf(id) != -1){
                    let o = amf_readObject(byte);
                    if(o.skeleton){
                        o.skeleton = new Skeleton(o.skeleton);
                    }
                    skeletonMeshObj[id] = o;
                    this.setKFM(o);
                    return;
                }
            }
        }

        setKFM(kfm: ISkeletonMeshData) {
            let { mesh, skeleton, material: materialData,anims } = kfm;
            let { material, geometry ,defaultAnim} = this;
            let c = context3D;

            this.kfm = kfm;

            if (!geometry) {
                this.geometry = geometry = new GeometryBase(this.variables);
            }
            geometry.setData(mesh);

            if (!material) {
                this.material = material = new PhongMaterial();
            }
            material.setData(materialData);

            material.diffTex.url = this.id + material.diffTex.url;

            if(skeleton){
                //===========================
                //  Animation
                //===========================
                this.skAnim = skeleton.createAnimation();
                skeleton.addEventListener(EventT.COMPLETE,this.animationLoadCompleteHandler,this);
                this.playAnim(defaultAnim);
            }
            // let action = "Take 001";
            // let action = "stand";
            // let animationData = kfm.anims[action];
            // skeleton.initAnimationData(animationData);
            // this.skAnim.play(animationData, engineNow);
        }

        

        playAnim(name:string,refresh:boolean = false){
            let{skAnim,tm} = this;
            if(!skAnim){
                return;
            }

            if (name.lastIndexOf(ExtensionDefine.KF) == -1) {
                name += ExtensionDefine.KF;
            }
            if(this.currentAnim == name && !refresh){
                return;
            }
            this.currentAnim = name;
            let { skeleton } = skAnim;
            let anim = skeleton.animations[name];
            if(!anim){
                //没有加载动作
                loadRes(this.id + name,skeleton.loadAnimationComplete,skeleton,ResType.bin);
            }else{
                this.skAnim.play(anim,tm.now);
            }
        }

        animationLoadCompleteHandler(e:EventX){
            let anim:ISkeletonAnimationData = e.data;
            if(anim.name == this.currentAnim){
                this.playAnim(this.currentAnim,true);
            }
        }

        onRecycle(){
            let{skAnim} = this;
            if(skAnim){
                skAnim.skeleton.removeEventListener(EventT.COMPLETE,this.animationLoadCompleteHandler);
            }
            this.defaultAnim = undefined;
            this.currentAnim = undefined;
            this.id = undefined;
            this.kfm = undefined;
            super.onRecycle();
        }

        // refreshGUI(gui:dat.GUI){
        //     alert(gui);
        // }
    }

    export class Skeleton extends MiniDispatcher {
        rootBone: IBone;
        // bonePose: IBonePose;
        defaultMatrices: Float32Array;
        vertex: VertexBuffer3D;
        boneCount: number;
        animations: { [key: string]: ISkeletonAnimationData } = {};

        constructor(config: ISkeletonData) {
            super();

            let { boneCount, defaultMatrices } = this;

            this.boneCount = boneCount = config.boneCount;
            let buffer = new ArrayBuffer(16 * 4 * boneCount);
            this.defaultMatrices = defaultMatrices = new Float32Array(buffer);

            function init(bone: IBone) {
                let { inv, matrix, parent, children, name, index } = bone;
                if (undefined != inv) {
                    bone.inv = inv = new Float32Array(inv);
                }
                bone.matrix = matrix = new Float32Array(matrix);
                let sceneTransform = new Float32Array(matrix);
                if (parent) {
                    sceneTransform.m3_append(parent.sceneTransform);
                    // matrix3d_multiply(sceneTransform, parent.sceneTransform, sceneTransform);
                }

                if (index > -1) {
                    let matrice = new Float32Array(buffer, index * 16 * 4, 16);
                    matrice.m3_append(sceneTransform, false, inv);
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

        initAnimationData(anim: ISkeletonAnimationData) {
            anim.skeleton = this;
            anim.matrices = [];
            let frames = anim.frames;
            for (let key in frames) {
                frames[key] = new Float32Array(frames[key]);
            }
            this.animations[anim.name] = anim;
        }


        createAnimation() {
            let anim = recyclable(SkeletonAnimation);
            anim.skeleton = this;
            return anim;
        }


        getMatricesData(anim: ISkeletonAnimationData, frame: number) {
            let result = anim.matrices[frame];
            if (undefined != result) {
                return result;
            }

            let { boneCount, rootBone } = this;
            let { frames } = anim;


            let map: { [key: string]: IBone } = {};

            let buffer = new ArrayBuffer(16 * 4 * boneCount);
            result = new Float32Array(buffer);
            anim.matrices[frame] = result;


            function update(bone: IBone) {
                let { inv, matrix, sceneTransform, parent, children, name, index } = bone;
                let frameData = frames[bone.name];

                if (frameData) {
                    matrix.set(frameData.slice(frame * 16, (frame + 1) * 16));
                }

                if (parent) {
                    sceneTransform.m3_append(parent.sceneTransform, false, matrix)
                    // matrix3d_multiply(matrix, parent.sceneTransform, sceneTransform);
                    // multiplyMatrices(parent.sceneTransform,matrix,sceneTransform);

                } else {
                    sceneTransform.set(matrix);
                }

                if (index > -1) {
                    let matrice = new Float32Array(buffer, index * 16 * 4, 16);
                    // matrix3d_multiply(inv, sceneTransform, matrice);
                    matrice.m3_append(sceneTransform, false, inv);
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

        loadAnimationComplete(e:EventX):void{
            if(e.type == EventT.COMPLETE){
                let item: ResItem = e.data;
                let byte = item.data;
                let o = amf_readObject(byte);
                this.initAnimationData(o);
                this.simpleDispatch(e.type,o);
            }
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

    export class SkeletonAnimation {
        skeleton: Skeleton;
        pose: { [key: string]: Float32Array } = {};
        starttime: number;
        nextTime: number;
        animationData: ISkeletonAnimationData;
        currentFrame: number = 0;
        play(animationData: ISkeletonAnimationData, now: number) {
            this.animationData = animationData;
            this.nextTime = now + animationData.eDuration * 1000;
        }

        uploadContext(camera: Camera, mesh: Mesh, program: Program3D, now: number, interval: number) {
            let { animationData, skeleton, starttime, currentFrame, nextTime } = this;
            let {tm} = mesh;
            skeleton.vertex.uploadContext(program);
            let matrixes: Float32Array;
            if (undefined == animationData) {
                matrixes = skeleton.defaultMatrices;
            } else {
                if (currentFrame >= animationData.totalFrame) {
                    currentFrame = 0;
                }

                if (tm.now > nextTime) {
                    this.nextTime = nextTime + animationData.eDuration * 1000;
                    this.currentFrame = currentFrame + 1;
                }
                matrixes = skeleton.getMatricesData(animationData, currentFrame);
            }
            context3D.setProgramConstantsFromMatrix(VC.vc_bones, matrixes);
        }

    }
}