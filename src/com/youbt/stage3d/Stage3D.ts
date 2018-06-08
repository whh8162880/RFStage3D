///<reference path="./display/Sprite.ts" />
///<reference path="./Context3D.ts" />
///<reference path="./three/Light.ts" />
module rf {
    export var ROOT_PERFIX:string;

    export class SceneObject extends RenderBase {
        scene: Scene;
        shadowable: boolean;
        shadowTarget:boolean;
        shadowMatrix:IMatrix3D;
        geometry: GeometryBase;
        invSceneTransform: IMatrix3D;

        minBoundingBox:OBB = new OBB();
        boundingSphere:Sphere = new Sphere();
        distance:number = Number.MAX_VALUE;
        
        addChild(child: DisplayObject) {
            super.addChild(child);
            if (child instanceof SceneObject) {
                child.scene = this.scene;
                scene.childChange = true;
            }
        }

        get available(){
            return undefined != this.geometry;
        }


        addChildAt(child: DisplayObject, index: number) {
            super.addChildAt(child, index);
            if (child instanceof SceneObject) {
                child.scene = this.scene;
                scene.childChange = true;
            }
        }

        removeChild(child: DisplayObject) {
            if (undefined == child) {
                return;
            }
            super.removeChild(child);
            if (child instanceof SceneObject) {
                child.scene = undefined;
                scene.childChange = true;
            }
        }


        removeAllChild() {
            const { childrens } = this;
            let len = childrens.length;
            for (let i = 0; i < len; i++) {
                let child = childrens[i];
                child.stage = undefined;
                child.parent = undefined;
                if (child instanceof SceneObject) {
                    child.scene = undefined;
                }
                child.removeFromStage();
            }
            this.childrens.length = 0;
        }


        removeFromStage() {
            const { childrens } = this;
            let len = childrens.length;
            for (let i = 0; i < len; i++) {
                let child = childrens[i];
                child.stage = undefined
                if (child instanceof SceneObject) {
                    child.scene = undefined;
                }
                child.removeFromStage();
            }
        }


        addToStage() {
            const { childrens, scene, stage } = this;
            let len = childrens.length;
            for (let i = 0; i < len; i++) {
                let child = childrens[i];
                child.stage = stage;
                if (child instanceof SceneObject) {
                    child.scene = scene;
                }
                child.addToStage();
            }
        }

        renderShadow(sun:Light,p:Program3D,c:Context3D,worldTranform:IMatrix3D,now: number, interval: number){
            let{geometry,sceneTransform}=this;
            geometry.vertex.uploadContext(p);
            worldTranform.m3_append(sun.worldTranform,false,sceneTransform);
            c.setProgramConstantsFromMatrix(VC.mvp,worldTranform);
        }


        static sphere = new Sphere();
        static ray = new Ray()

        raycast( raycaster:Raycaster, intersects?:IIntersectInfo[]):IIntersectInfo[]{
            let {geometry} = this;

            if(!geometry)return intersects;

            if(this.minBoundingBox == undefined || this.minBoundingBox.change)
            {
                let obb = this.minBoundingBox = OBB.updateOBBByGeometry(geometry, this.minBoundingBox);
                geometry.centerPoint.set([ (obb.minx+obb.maxx)*0.5, (obb.miny+obb.maxy)*0.5, (obb.minz+obb.maxz)*0.5, 1 ] );
            }
            
            if(this.boundingSphere == undefined || this.boundingSphere.change)
            {
                this.boundingSphere = geometry.calculateBoundingSphere(geometry.centerPoint, this.boundingSphere);
            }
            
            let{sphere} = SceneObject;
            //首先检测球
            sphere.copyFrom( this.boundingSphere );
			sphere.applyMatrix4( this.sceneTransform, sphere );

            if ( raycaster.ray.intersectsSphere( sphere ) == false ) {
                return intersects;
            }
            let{ray} = SceneObject;
            ray.copyFrom( raycaster.ray ).applyMatrix4( this.invSceneTransform );

            let intersectPoint = ray.intersectBox( this.minBoundingBox);
            if ( intersectPoint == null) {
                // console.log('2222222222')
                return intersects;
            }

            this.sceneTransform.m3_transformVector(intersectPoint,intersectPoint);

            rf.TEMP_VECTOR3D.set(raycaster.ray.origin);
            rf.TEMP_VECTOR3D.v3_sub(intersectPoint, rf.TEMP_VECTOR3D);

			let distance = rf.TEMP_VECTOR3D.v3_length;

			if ( distance < raycaster.near || distance > raycaster.far ) {
                // console.log('333333333333333')
                return intersects;
            }
            
            intersects = intersects || [];
            intersects.push({"obj":this, "distance": distance, "point":intersectPoint });

            return intersects;
        }
    }

    export class Scene extends SceneObject {
        sun: DirectionalLight;
        childChange: boolean;
        camera: Camera;
        constructor(variables?: { [key: string]: IVariable }) {
            super(variables);
            this.scene = this;
            this.hitArea = new HitArea();
            this.hitArea.allWays = true;
        }

        public render(camera: Camera, now: number, interval: number): void {
            let { camera: _camera ,childrens } = this;
            // const { depthMask, passCompareMode, srcFactor, dstFactor, cull } = this.material;
            let c = context3D;
            let g = gl;

            if (undefined == _camera) {
                _camera = camera;
            }

            if (_camera.status) {
                _camera.updateSceneTransform();
            }

            if(childrens.length){
                this.material.uploadContextSetting();
                super.render(_camera, now, interval);
            }
        }
    }

    export class AllActiveSprite extends Sprite {
        constructor(source?: BitmapSource, variables?: { [key: string]: IVariable }) {
            super(source, variables);
            this.hitArea.allWays = true;
            this.mouseEnabled = false;
        }
    }

    export let scene: Scene;
    export let popContainer = new AllActiveSprite();
    export let tipContainer = new AllActiveSprite();
    export class Stage3D extends AllActiveSprite implements IResizeable {

        static names: string[] = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
        canvas: HTMLCanvasElement;
        cameraUI: Camera
        camera2D: Camera;
        camera3D: Camera;
        cameraPerspective:Camera;
        camera: Camera;
        renderLink: Link;
        shadow:ShadowEffect;
        debugImage:DebugImage;
        constructor() {
            super();
            this.camera2D = new Camera();
            this.camera3D = new Camera();
            this.cameraUI = new Camera();
            this.cameraPerspective = new Camera(100000);            
            this.renderer = new BatchRenderer(this);
            this.shadow = new ShadowEffect(1024,1024);
            this.renderLink = new Link();
            this.camera = this.cameraUI;
            this.stage = this;
            this.debugImage = new DebugImage();
        }

        requestContext3D(canvas: HTMLCanvasElement): boolean {
            this.canvas = canvas;
            for (var name of Stage3D.names) {
                try {
                    gl = <WebGLRenderingContext>this.canvas.getContext(name);
                } catch (e) {

                }
                if (gl) {
                    break;
                }
            }

            if (undefined == gl) {
                context3D = null;
                this.simpleDispatch(EventT.ERROR, "webgl is not available");
                return false;
            }

            context3D = singleton(Context3D);


            Capabilities.init();
            MouseInstance.init(Capabilities.isMobile);

            mainKey.init();
            KeyManagerV2.resetDefaultMainKey();

            canvas.addEventListener('webglcontextlost', this.webglContextLostHandler);
            canvas.addEventListener("webglcontextrestored", this.webglContextRestoredHandler);
            this.simpleDispatch(EventT.CONTEXT3D_CREATE, gl);
            return true;
        }

        private webglContextLostHandler(e): void {
            alert("Lost:" + e);
        }

        private webglContextRestoredHandler(e): void {
            alert("RestoredHandler:" + e);
        }


        //在这里驱动渲染
        update(now: number, interval: number): void {
            if (this.status & DChange.ct) {
                this.updateTransform();
            }
            let{renderLink} = this;
            if (scene.childChange) {
                renderLink.clean();
                this.filterRenderList(scene,renderLink);
                scene.childChange = false;
            }
            let c = context3D;
            c.dc = 0;
            c.triangles = 0;

            c.clear(0, 0, 0, 1);
            if(renderLink.length){
                this.shadow.render(renderLink,scene.sun,now,interval);
            }
            this.render(this.camera, now, interval);
            // this.shadow.render(renderLink,scene.sun,now,interval);
            // let m = TEMP_MATRIX;
            // m.m3_identity();
            // this.debugImage.render(this.shadow.rtt,m);
        }

        resize(width: number, height: number): void {
            let { camera2D, camera3D, cameraUI,cameraPerspective} = this;
            CameraUIResize(width,height,cameraUI.len,cameraUI.far,cameraUI.originFar,cameraUI);
            CameraOrthResize(width,height,camera2D.len,camera2D.far,camera2D.originFar,camera2D);
            Camera3DResize(width,height,camera3D.len,camera3D.far,camera3D.originFar,camera3D);

            PerspectiveResize(width,height,cameraPerspective.len,cameraPerspective.far,30,cameraPerspective)
            
        }


        filterRenderList(d: SceneObject,link:Link) {
            let { childrens } = d;
            let len = childrens.length;
            for (let i = 0; i < len; i++) {
                let m = childrens[i] as SceneObject;
                if(m.available){
                    link.add(m);
                }
            }
        }
    }

    export class ShadowEffect{
        w:number;
        h:number;
        rtt:RTTexture;
        m:ShadowMaterial;
        len:IMatrix3D;
        debugImage:DebugImage;
        constructor(w:number,h:number){
            this.w = w;
            this.h = h;
            this.m = new ShadowMaterial();
            this.m.setData(undefined);
            this.len = newMatrix3D();
            this.debugImage = new DebugImage();
            Camera3DResize(w,h,this.len,10000,10000/Math.PI2);
            // CameraOrthResize(w,h,this.len,10000,10000/Math.PI2);
        }

        render(link:Link,sun:DirectionalLight,now:number,interval:number){
            let{m,rtt,len,w,h} = this;
            if(sun.status || sun.len != len){
                sun.len = len;
                sun.updateSceneTransform();
            }
           
            let c = context3D;

            if(!rtt){
                this.rtt = rtt = c.createRttTexture(c.getTextureData("ShadowMaterial"),w,h);
                rtt.cleanColor = newColor(0xFFFFFF);
                rtt.cleanColor.a = 1.0;
            }

            // c.configureBackBuffer(w,h,0);

            let g = gl;
            c.setRenderToTexture(rtt,false);

            // c.setDepthTest(false,g.ALWAYS);
            // g.frontFace(g.CW);

            let{passCompareMode,cull,program}=m;

           
            // c.setDepthTest(false,passCompareMode);
            // c.setCulling(cull);
            // c.setProgram(program);
            
            let worldTranform = rf.TEMP_MATRIX3D;
            for(let vo = link.getFrist();vo;vo = vo.next){
                if(vo.close == false){
                    let obj = vo.data as SceneObject;
                    let{shadowable,shadowTarget,geometry,shadowMatrix,sceneTransform}=obj;
                    
                    if(shadowable){
                        m.uploadContext(sun,obj,now,interval);
                        let p = m.program;
                        obj.renderShadow(sun,p,c,worldTranform,now,interval);
                        c.drawTriangles(geometry.index,geometry.numTriangles,rtt.setting);
                    }

                    if(shadowTarget){
                        if(!shadowMatrix){
                            obj.shadowMatrix = shadowMatrix = newMatrix3D();
                        }
                        shadowMatrix.m3_append(sun.worldTranform,false,sceneTransform);
                    }
                }
            }
            // let matrix = TEMP_MATRIX;
            // matrix.m3_scale(w / stageWidth,h / stageHeight,1);
            // matrix.m3_identity();
            // this.debugImage.render(undefined,matrix);
            c.setRenderToBackBuffer();
            // g.frontFace(g.CCW);
            // c.configureBackBuffer(stageWidth,stageHeight,0);
            
        }
    }

    export class PassContainer extends RenderBase {

        camera: Camera
        constructor(variables?: { [key: string]: IVariable }) {
            super(variables);
            this.hitArea = new HitArea();
            this.hitArea.allWays = true;
        }

        public render(camera: Camera, now: number, interval: number): void {
            let { camera: _camera } = this;
            // const { depthMask, passCompareMode, srcFactor, dstFactor, cull } = this.material;
            let c = context3D;
            let g = gl;

            if (undefined == _camera) {
                _camera = camera;
            }

            if (_camera.status) {
                _camera.updateSceneTransform();
            }

            this.material.uploadContextSetting();

            // let{setting}=c;
            // setting.cull = cull;
            // setting.depth = depthMask;
            // setting.depthMode = passCompareMode;
            // setting.src = srcFactor;
            // setting.dst = dstFactor;

            super.render(_camera, now, interval);
        }
    }

    export class UIContainer extends AllActiveSprite {
        public render(camera: Camera, now: number, interval: number): void {
            const { cameraUI } = ROOT;
            let c = context3D;
            let g = gl;

            if (cameraUI.status) {
                cameraUI.updateSceneTransform();
            }
            this.material.uploadContextSetting();

            super.render(cameraUI, now, interval);
        }
    }


    export class DebugImage{

        p:Program3D;
        v:VertexBuffer3D;
        et:Texture;
        render(t:Texture,m:IMatrix3D): void { 
            let{et,p,v}=this;
            let c = context3D;

            if(undefined == t){
                if(!et){
                    this.et = et = c.createTexture(c.getTextureData("../assets/tex/a.png",false,gl.NEAREST,gl.NEAREST,gl.REPEAT))
                }
                let{readly,status}=et;
                if(false == readly){
                    if(LoadStates.COMPLETE != status){
                        if(LoadStates.WAIT == status){
                            et.load(et.data.url);
                        }
                    }else{
                        readly = true;
                    }
                }
                if(!readly){
                    return;
                }
                t = et;
            }
            

            if(!p){
                
                let vertexCode = `
                    precision mediump float;
                    attribute vec3 ${VA.pos};
                    attribute vec2 ${VA.uv};

                    uniform mat4 ${VC.mvp};

                    varying vec2 vUV;

                    void main(void){
                        gl_Position = ${VC.mvp} * vec4(${VA.pos},1.0);
                        vUV = ${VA.uv};
                    }
                `

                let fragmentCode;

                if(et){
                    fragmentCode = `
                    precision mediump float;
                    varying vec2 vUV;
                    uniform sampler2D ${FS.diff};

                    void main(void){
                        // gl_FragColor = texture2D(${FS.diff}, vUV);
                        vec4 c = texture2D(${FS.diff}, vUV);
                        // vec4 c = vec4(vUV,0.0,1.0);
                        gl_FragColor = c;
// 
                        // gl_FragColor = vec4(1.0);
                    }
                    `
                }else{
                    fragmentCode = `
                    precision mediump float;
                    varying vec2 vUV;
                    uniform sampler2D ${FS.diff};

                    void main(void){
                        gl_FragColor = texture2D(${FS.diff}, vUV);
                        // gl_FragColor = vec4(vUV,0.0,1.0);
                    }
                `
                }

                
                this.p = p = c.createProgram(vertexCode,fragmentCode);
            }

            if(!v){
                let variables = vertex_mesh_variable;
                let data32PerVertex = variables.data32PerVertex.size;
                let info = new VertexInfo(new Float32Array([
                    -1,1,0,0,0,1,0,0,
                    1,1,0,0,0,1,1,0,
                    1,-1,0,0,0,1,1,1,
                    -1,-1,0,0,0,1,0,1
                ]),data32PerVertex,variables)
                this.v = v = c.createVertexBuffer(info);
            }
            let g = gl;

            c.setProgram(p);
            // c.setCulling(g.NONE);
            // c.setBlendFactors(g.SRC_ALPHA,g.ONE_MINUS_DST_ALPHA);
            // c.setDepthTest(true,g.LEQUAL);
            c.setProgramConstantsFromMatrix(VC.mvp,m);
            v.uploadContext(p);
            t.uploadContext(p,0,FS.diff);
            c.drawTriangles(c.getIndexByQuad(1),2);
        }




    }

   
    export function getChildrenCount(d:DisplayObjectContainer){
        let count = 0;
        d.childrens.forEach(child => {
            count ++;
            if(child instanceof DisplayObjectContainer){
                count += this.getChildrenCount(child);
            }
        });
        return count;
    }

}