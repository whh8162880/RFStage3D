///<reference path="./DisplayObjectContainer.ts" />
///<reference path="../camera/Camera.ts" />
module rf {
    export interface I3DRender extends IRecyclable {
        render?(camera: Camera, now: number, interval: number,target?:Sprite): void
    }
    export class Sprite extends DisplayObjectContainer implements I3DRender {
        source:BitmapSource;
        variables:{ [key: string]: IVariable };
        /**
         * 1.Sprite本身有render方法可以渲染
         * 2.考虑到可能会有一些需求 渲染器可以写在别的类或者方法中  所以加入renderer概念
         */
        renderer: I3DRender;
        batcherAvailable: boolean = true;
        $graphics: Graphics = undefined;
        $batchGeometry: BatchGeometry = undefined;
        $vcIndex: number = -1;
        $vcox: number = 0;
        $vcoy: number = 0;
        $vcos: number = 1;
        constructor(source:BitmapSource = undefined,variables:{ [key: string]: IVariable } = undefined) {
            super();
            this.hitArea = new HitArea();
            this.source = source ? source : componentSource;
            this.variables = variables ? variables : vertex_ui_variable;
            this.mouseChildren = true;
            this.mouseEnabled = true;
        }

        get graphics(): Graphics {
            if (undefined == this.$graphics) {
                this.$graphics = new Graphics(this,vertex_ui_variable);
            }
            return this.$graphics;
        }

        setChange(value: number,p:number = 0,c:boolean = false): void {
            if(undefined != this.renderer){
                this.states |= (value | p);
            }else{
                super.setChange(value,p,c);
            }
        }

        render(camera: Camera, now: number, interval: number): void {
            if (undefined != this.renderer) {
                if(this.states & DChange.t_all){ //如果本层或者下层有transform alpha 改编 那就进入updateTransform吧
                    this.updateTransform();
                }
                this.renderer.render(camera, now, interval);
            }
        }

        addToStage() {
            if (this.$graphics && this.$graphics.numVertices) {
                this.setChange(DChange.vertex);
            }
            super.addToStage();
        }

        cleanAll(){
            if(this.childrens.length){
                this.removeAllChild();
            }
            let g = this.$graphics
            if(g && g.numVertices > 0){
                g.clear();
                g.end();
            }
        }

        public updateHitArea():void{
            let hitArea = this.hitArea;
            hitArea.clean();
            for(let child of this.childrens){
                if(child.states & DChange.ac){
                    child.updateHitArea();
                }
                hitArea.combine(child.hitArea,child._x,child._y);
            }

            if(this.$graphics){
                hitArea.combine(this.$graphics.hitArea,0,0);
            }
            
            this.states &= ~DChange.ac;
        }

        getObjectByPoint(dx: number, dy: number,scale:number): DisplayObject {
            if(this.mouseEnabled == false && this.mouseChildren == false){
                return undefined
            }

            if(this.states & DChange.ac){
                this.updateHitArea()
            }

            dx -= this._x;
            dy -= this._y;
            scale *= this._scaleX;
            
            if(this.hitArea.checkIn(dx,dy,scale) == true){
                if(this.mouseChildren){
                    let children = this.childrens;
                    let len = children.length;
                    for(let i = len - 1;i>=0;i--){
                        let child = children[i];
                        let d = child.getObjectByPoint(dx,dy,scale);
                        if(undefined != d){
                            return d;
                        }
                    }
                }
                if(this.mouseEnabled){
                    let g = this.$graphics;
                    if(undefined != g){
                        if( g.hitArea.checkIn(dx,dy,scale) == true ){
                            return this;
                        }
                    }
                }
            }


            return undefined;
        }
    }

    export class Image extends Sprite{
        _url:string;
        constructor(){
            super();
        }
        load(url:string):void
        {
            if(this._url == url)
            {   
                return;
            }
            //clear
            if (url)
			{
				this._url = url;
                loadRes(url,this.onImageComplete,this,ResType.image);
			}
        }

        onImageComplete(e:EventX):void
        {
            if(e.type !=  EventT.COMPLETE)
            {
                return;
            }
            let res:ResItem = e.data;
            let image:HTMLImageElement = res.data;
            let source = this.source;
            let vo = source.setSourceVO(this._url,image.width,image.height,1);
            source.bmd.context.drawImage(image,vo.x,vo.y);

            let g = this.graphics;
            g.clear();
            g.drawBitmap(0,0,vo)
            g.end();
        }
    }


    export class IconView extends Image
    {

        drawW:number;
        drawH:number;

        img:HTMLImageElement;

        isReady:boolean = false;
        constructor(){
            super();
        }

        setUrl(url:string):void{
            if(url == null)
            {
                let g = this.graphics;
                g.clear();
                g.end();
                return;
            }
            this.isReady = false;
            this.load(url);
        }

        resetSize(_width:number,_height:number):void{   
            this.drawW = _width;
            this.drawH = _height;
            if(this.isReady && this.img)
            {
                this._draw(this.img);
            }
        }

        onImageComplete(e:EventX):void{
            if(e.type !=  EventT.COMPLETE)
            {
                this.drawFault();
                return;
            }

            let res:ResItem = e.data;
            this.img = res.data;


            this._draw(this.img);
            this.simpleDispatch(EventT.COMPLETE);

            this.isReady = true;
        }


        
        _draw(img:HTMLImageElement):void{
            if(!this._url)
            {
                return;
            }

            // var matrix = new Matrix();
            // matrix.identity();
            
            let dw = this.drawW;
            let dh = this.drawH;

            // if(dw && dh)
            // {
            //    if(dw != img.width || dh != img.height)
            //    {
            //     //    matrix.scale(dw / img.width,dh / img.height);

            //    }
            // }else{
            //     dw = img.width;
            //     dh = img.height;
            // }
            if(!dw || !dh)
            {
                dw = img.width;
                dh = img.height;
            }

            let source = this.source;
            let vo = source.setSourceVO(this._url,img.width,img.width,1);
            // source.bmd.context.drawImage(img,vo.x,vo.y);
            source.bmd.context.drawImage(img,vo.x,vo.y,dw,dh);

            let g = this.graphics;
            g.clear();
            g.drawBitmap(0,0,vo);
            // g.drawBitmap(0,0,vo,0xFFFFFF,matrix.rawData);
            g.end();

        }

        drawFault():void{
            let g = this.graphics;
            g.clear();
            g.end();
            this.img = null;
            this.simpleDispatch(EventT.ERROR);
        }
    }

    export class Graphics {
        target: Sprite;
        byte: Float32Byte;
        hitArea:HitArea;
        numVertices: number = 0;
        $batchOffset: number = 0;
        private preNumVertices:number = 0;
        constructor(target: Sprite,variables: { [key: string]: { size: number, offset: number } }) {
            this.target = target;
            // this.byte = new Float32Byte(new Float32Array(0));
            this.numVertices = 0;
            this.hitArea = new HitArea();
        }

        clear(): void {
            this.preNumVertices = this.numVertices;
            this.numVertices = 0;
            this.byte = undefined;
            this.hitArea.clean();
        }

        end(): void {
            let target = this.target;
            let change = 0;

            if(this.numVertices > 0){
                let float = createGeometry(empty_float32_object,target.variables,this.numVertices);
                this.byte = new Float32Byte(float);
                if(target.$batchGeometry && this.preNumVertices == this.numVertices){
                    target.$batchGeometry.update(this.$batchOffset,this.byte);
                }else{
                    change |= DChange.vertex;
                }
                if(target.hitArea.combine(this.hitArea,0,0)){
                    change |= DChange.area;
                }
            }else{
                change |= (DChange.vertex | DChange.area);
            }

            if(change > 0){
                target.setChange(change);
            }
        }
        

        addPoint(pos:number[],noraml:number[],uv:number[],color:number[]):void{
            let variables = this.target.variables;
            let numVertices = this.numVertices;


            function set(variable:IVariable,array:Float32Array,data:number[]):void{
                if(undefined == data || undefined == variable){
                    return;
                }
                let size = variable.size;
                let offset = numVertices * size;
                for(let i = 0;i<size;i++){
                    array[offset + i] = data[i];
                }
            }

            set(variables[VA.pos],empty_float32_pos,pos);
            set(variables[VA.normal],empty_float32_normal,noraml);
            set(variables[VA.uv],empty_float32_uv,uv);
            set(variables[VA.color],empty_float32_color,color);

            this.hitArea.updateArea(pos[0],pos[1],pos[2]);



            this.numVertices++
        }

        drawRect(x: number, y: number, width: number, height: number, color: number, alpha: number = 1, matrix:Float32Array = undefined,z: number = 0): void {

            const {originU,originV} = this.target.source;

            const rgba = [
                ((color & 0x00ff0000) >>> 16) / 0xFF,
                ((color & 0x0000ff00) >>> 8) / 0xFF,
                (color & 0x000000ff) / 0xFF,
                alpha
            ]


            const uv = [originU,originV,this.target.$vcIndex];

            const noraml = [0,0,1]
            
            let r = x + width;
            let b = y + height;

            let f = m2dTransform;
            let p = [0,0,0];

            let points = [x,y,r,y,r,b,x,b];
            for(let i=0;i<8;i+=2){
                p[0] = points[i];
                p[1] = points[i+1];
                p[2] = z;
                if(undefined != matrix){
                    f(matrix,p,p);
                }
                this.addPoint(p,noraml,uv,rgba);
            }



            // let position = this.byte.array.length;
            // let d = this.variables["data32PerVertex"].size;
            // let v = this.variables;
            // let f = m2dTransform;
            // let p = EMPTY_POINT2D;
            // let byte = this.byte;
            // const {originU,originV} = this.target.source;
            // this.byte.length = position + d * 4;
            // let pos = v[VA.pos];
            // let uv = v[VA.uv];
            // let vacolor = v[VA.color];
            // let normal = v[VA.normal];
            // let points = [x,y,r,y,r,b,x,b];
            // for(let i=0;i<8;i+=2){
            //     let dp = position + (i / 2) * d;
            //     p.x = points[i];
            //     p.y = points[i+1];
            //     if(undefined != matrix){
            //         f(matrix,p,p);
            //     }
            //     this.hitArea.updateArea(p.x,p.y,z);
            //     byte.wPoint3(dp+pos.offset,p.x,p.y,z)

            //     if(undefined != normal){
            //         byte.wPoint3(dp+normal.offset,0,0,1)
            //     }
                
            //     if(undefined != uv){
            //         byte.wPoint3(dp+uv.offset,originU,originV,0)
            //     }

            //     if(undefined != vacolor){
            //         byte.wPoint4(dp+vacolor.offset,red,green,blue,alpha)
            //     }
            //     this.numVertices += 1;
            // }
        }


        drawBitmap(x: number, y: number,vo:BitmapSourceVO,color:number = 0xFFFFFF,matrix:Float32Array = undefined,alpha:number = 1,z:number = 0):void{
            const{w,h,ul,ur,vt,vb}=vo;
            let r = x + w;
            let b = y + h;

            
            const rgba = [
                ((color & 0x00ff0000) >>> 16) / 0xFF,
                ((color & 0x0000ff00) >>> 8) / 0xFF,
                (color & 0x000000ff) / 0xFF,
                alpha
            ]

            const noraml = [0,0,1]

            const index = this.target.$vcIndex;

            let f = m2dTransform;
            let p = [0,0,0];

            let points = [x,y,ul,vt,r,y,ur,vt,r,b,ur,vb,x,b,ul,vb];
            for(let i=0;i<16;i+=4){
                p[0] = points[i];
                p[1] = points[i+1];
                p[2] = z;
                if(undefined != matrix){
                    f(matrix,p,p);
                }
                this.addPoint(p,noraml,[points[i+2],points[i+3],index],rgba);
            }

            // let v = this.target.variables;
            // let f = m2dTransform;
            // let d = v["data32PerVertex"].size;
            // let position = this.byte.array.length;
            // this.byte.length = position + d*4;
          
            // let p = EMPTY_POINT2D;
            // let byte = this.byte;

            // let pos = v[VA.pos];
            // let uv = v[VA.uv];
            // let vacolor = v[VA.color];
            // let normal = v[VA.normal];

            // let red = ((color & 0x00ff0000) >>> 16) / 0xFF;
            // let green = ((color & 0x0000ff00) >>> 8) / 0xFF;
            // let blue = (color & 0x000000ff) / 0xFF;

            // let points = [x,y,ul,vt,r,y,ur,vt,r,b,ur,vb,x,b,ul,vb];
            // for(let i=0;i<16;i+=4){
            //     let dp = position + (i / 4) * d;
            //     p.x = points[i];
            //     p.y = points[i+1];
            //     if(undefined != matrix){
            //         f(matrix,p,p);
            //     }
            //     this.hitArea.updateArea(p.x,p.y,z);
            //     byte.wPoint3(dp+pos.offset,p.x,p.y,z)

            //     if(undefined != normal){
            //         byte.wPoint3(dp+normal.offset,0,0,1)
            //     }
                
            //     if(undefined != uv){
            //         byte.wPoint3(dp+uv.offset,points[i+2],points[i+3],0)
            //     }

            //     if(undefined != vacolor){
            //         byte.wPoint4(dp+vacolor.offset,red,green,blue,alpha)
            //     }

            //     this.numVertices += 1;
            // }
        }
    }


    export abstract class RenderBase implements I3DRender {
        triangleFaceToCull: string = Context3DTriangleFace.NONE;
        sourceFactor: number;
        destinationFactor: number;
        depthMask: boolean = false;
        passCompareMode: number;
        public render(camera: Camera, now: number, interval: number): void { }
        constructor() {
            if (undefined != gl) {
                this.sourceFactor = gl.SRC_ALPHA;
                this.destinationFactor = gl.ONE_MINUS_CONSTANT_ALPHA;
                this.passCompareMode = gl.ALWAYS;
            }
        }
    }

    


    /**
     *  自动模型合并 渲染器
     *  原理:
     *      1.Sprite graphics 可以生成 【矢量图 + 贴图】的【四边形】 模型数据 vertexData  : 点定义为 vertex_ui_variable
     *      2.带有Batch渲染器的Sprite对象 自动收集children中所有graphics 模型信息 并生成合并的VertexData。VertexData会被封装进【BatchGeometry】进行渲染
     *        模型合并触发条件
     *          【1.children graphics 信息改变】
     *          【2.children visible = false|true】
     *          【3.children alpha = 0|>0】
     *      3.考虑到Sprite对象的children对象 可能也会自带渲染器 所以会生成很多的模型信息【BatchGeometry】  所以batch的rendersLink会表现为 【BatchGeometry】-> I3DRender ->【BatchGeometry】这样的渲染顺序
     *      4.被合并的children对象的x,y,scale,alpha等信息会被batch收集成一个Float32Array数据 每4位(vec4)为一个控制单元【x,y,scale,alpha】 用于shader计算 
     *        所以children对象 x,y,scale,alpha 改变时 会重新收集数据【现在是只要chindren改变就全部无脑收集=。=】
     *      5.考虑到用户电脑 Max Vertex Uniform Vectors 数据不同【http://webglreport.com/】 所以要注意shader对象中ui[${max_vc}]  
     *      6.dc()方法渲染 shader计算详看代码。
     */
    export class BatchRenderer extends RenderBase implements I3DRender {
        target: Sprite;        
        renders: Link;
        geo: BatchGeometry = undefined;
        program: Program3D;
        worldTransform: Matrix3D;
        t:Texture
        constructor(target: Sprite) {
            super();
            this.target = target;
            this.renders = new Link();
            this.worldTransform = new Matrix3D();
        }

        public render(camera: Camera, now: number, interval: number): void {
            let target:Sprite = this.target;

            let source = target.source;
            if(undefined == source){
                return;
            }
            
            let t = context3D.textureObj[source.name];
            if(undefined == t){
                t = context3D.createTexture(source.name,source.bmd);
            }
            this.t = t;


            if (target.states & DChange.vertex) {
                this.cleanBatch();
                //step1 收集所有可合并对象
                this.getBatchTargets(target, -target._x, -target._y, 1 / target._scaleX);
                //step2 合并模型 和 vc信息
                this.toBatch();

                this.geo = undefined;
                target.states &= ~DChange.batch;
            }else if(target.states & DChange.vcdata){
                //坐标发生了变化 需要更新vcdata 逻辑想不清楚  那就全部vc刷一遍吧
                this.updateVCData(target, -target._x, -target._y, 1 / target._scaleX);
                target.states &= ~DChange.vcdata;
            }

            if (undefined == this.program) {
                this.createProgram();
            }

            this.worldTransform.copyFrom(target.sceneTransform);
            this.worldTransform.append(camera.worldTranform);


            let vo = this.renders.getFrist();
            while (vo) {
                if (vo.close == false) {
                    let render: I3DRender = vo.data;
                    if (render instanceof BatchGeometry) {
                        this.dc(render);
                    } else {
                        render.render(camera, now, interval);
                    }
                }
                vo = vo.next;
            }
        }

        dc(geo: BatchGeometry): void {
            // context3D.setBlendFactors()
            let c = context3D;
            let v: VertexBuffer3D = geo.$vertexBuffer;
            if (undefined == v) {
                geo.$vertexBuffer = v = c.createVertexBuffer(geo.vertex, geo.vertex.data32PerVertex);
            }
            let i: IndexBuffer3D = c.getIndexByQuad(geo.quadcount);
            let p = this.program; 
            c.setProgram(p);
            c.setProgramConstantsFromMatrix(VC.mvp, this.worldTransform);
            c.setProgramConstantsFromVector(VC.ui, geo.vcData.array, 4);
            this.t.uploadContext(p,0,FS.diff);
            v.uploadContext(p);
            c.drawTriangles(i,geo.quadcount * 2);
        }


        createProgram(): void {
            let vcode = `
                attribute vec3 pos;
                attribute vec3 uv;
                attribute vec4 color;
                uniform mat4 mvp;
                uniform vec4 ui[${max_vc}];
                varying vec2 vUV;
                varying vec4 vColor;
                void main(void){
                    vec4 p = vec4(pos,1.0);
                    vec4 t = ui[int(uv.z)];
                    p.xy = p.xy + t.xy;
                    p.xy = p.xy * t.zz;
                    gl_Position = mvp * p;
                    vUV.xy = uv.xy;
                    p = color;
                    p.w = color.w * t.w;
                    vColor = p;
                }
            `

            let fcode = `
                precision mediump float;
                uniform sampler2D diff;
                varying vec4 vColor;
                varying vec2 vUV;
                void main(void){
                    vec4 color = texture2D(diff, vUV);
                    gl_FragColor = vColor*color;
                }
            `

            // let vcode = `
            //     attribute vec3 pos;
            //     uniform mat4 mvp;
            //     void main(void){
            //         vec4 p = vec4(pos,1.0);
            //         gl_Position = mvp * p;
            //     }
            // `

            // let fcode = `
            //     precision mediump float;
            //     void main(void){
            //         gl_FragColor = vec4(1,0,0,1);
            //     }
            // `

            this.program = context3D.createProgram(vcode, fcode);
        }

        cleanBatch(): void {
            let vo = this.renders.getFrist();
            while (vo) {
                if (vo.close == false) {
                    let render: Recyclable<I3DRender> = vo.data;
                    if (render instanceof BatchGeometry) {
                        render.recycle();
                    }
                    vo.close = true;
                }
                vo = vo.next;
            }
            this.renders.clean();
        }

        getBatchTargets(target: Sprite, ox: number, oy: number, os: number): void {
            if (false == target._visible || 0.0 >= target.sceneAlpha) {
                target.$vcIndex = -1;
                target.$batchGeometry = null;
                return;
            }

            let g = target.$graphics;
            ox = target._x + ox;
            oy = target._y + oy;
            os = target._scaleX * os;
            if (target == this.target || (null == target.renderer && true == target.batcherAvailable)) {
                if (undefined == g || 0 >= g.numVertices) {
                    target.$vcIndex = -1;
                    target.$batchGeometry = null;
                } else {
                    if (undefined == this.geo) {
                        this.geo = recyclable(BatchGeometry);
                        this.renders.add(this.geo);
                    }

                    let i = this.geo.add(target, g);
                    target.$vcox = ox;
                    target.$vcoy = oy;
                    target.$vcos = os;

                    if (i >= max_vc) {
                        this.geo = undefined;
                    }
                }
            } else {
                this.renders.add(target);
                this.geo = undefined;
            }

            for (let child of target.childrens) {
                if (child instanceof Sprite) {
                    this.getBatchTargets(child, ox, oy, os);
                }
            }
        }

        
        updateVCData(target: Sprite, ox: number, oy: number, os: number):void{
            if (false == target._visible || 0.0 >= target.sceneAlpha) {
                target.$vcIndex = -1;
                target.$batchGeometry = null;
                return;
            }

            let g = target.$graphics;
            ox = target._x + ox;
            oy = target._y + oy;
            os = target._scaleX * os;
            if (target == this.target || (null == target.renderer && true == target.batcherAvailable)) {
                if(undefined != target.$batchGeometry){
                    target.$vcox = ox;
                    target.$vcoy = oy;
                    target.$vcos = os;
                    target.$batchGeometry.vcData.wPoint4(sp.$vcIndex * 4 ,sp.$vcox, sp.$vcoy, sp.$vcos, sp.sceneAlpha);
                }
            } 

            for (let child of target.childrens) {
                if (child instanceof Sprite) {
                    this.updateVCData(child, ox, oy, os);
                }
            }
        }


        toBatch(): void {
            let vo = this.renders.getFrist();
            let target = this.target;
            while (vo) {
                if (vo.close == false) {
                    let render: Recyclable<I3DRender> = vo.data;
                    if (render instanceof BatchGeometry) {
                        render.build(target);
                    }
                }
                vo = vo.next;
            }
        }


    }


    export class BatchGeometry implements I3DRender, IGeometry {
        vertex: VertexInfo;
        $vertexBuffer: VertexBuffer3D;
        quadcount: number;
        vcData: Float32Byte;
        vci: number = 0;
        link: Link;
        verlen: number = 0;
        constructor() { };
        add(target: Sprite, g: Graphics): number {
            if (undefined == this.link) {
                this.link = new Link();
            }
            target.$vcIndex = this.vci++;
            target.$batchGeometry = this;
            g.$batchOffset = this.verlen;
            this.verlen += g.byte.length;
            this.link.add(target);
            return this.vci;
        }

        build(target:Sprite): void {
            let variables = target.variables
            this.vertex = new VertexInfo(this.verlen, variables["data32PerVertex"].size);
            this.vertex.variables = variables;
            this.quadcount = this.vertex.numVertices / 4;
            this.vcData = new Float32Byte(new Float32Array(this.quadcount * 4))
            let byte = this.vertex.vertex;
            let vo = this.link.getFrist();
            while(vo){
                if (vo.close == false) {
                    let sp: Sprite = vo.data;
                    let g = sp.$graphics;
                    if(sp.$vcIndex > 0){
                        g.byte.update(this.vertex.data32PerVertex,vertex_ui_variable["uv"].offset+2,sp.$vcIndex);
                    }
                    byte.set(g.$batchOffset, g.byte);
                    this.vcData.wPoint4(sp.$vcIndex * 4, sp.$vcox, sp.$vcoy, sp.$vcos, sp.sceneAlpha)
                }
                vo = vo.next;
            }
        }

        update(position:number,byte:Float32Byte):void{
            if(undefined != this.vertex){
                this.vertex.vertex.set(position,byte);
            }
            if(undefined != this.$vertexBuffer){
                this.$vertexBuffer.readly = false;
            }
        }

        updateVC(sp:Sprite):void{
            this.vcData.wPoint4(sp.$vcIndex * 4 ,sp.$vcox, sp.$vcoy, sp.$vcos, sp.sceneAlpha)
        }

        //x,y,z,u,v,vci,r,g,b,a;

        onRecycle(): void {
            this.vertex = undefined;
            this.verlen = 0;
            this.vci = 0;
            this.$vertexBuffer = null;
            this.vcData = null;
            let vo = this.link.getFrist();
            while(vo){
                if (vo.close == false) {
                    let sp: Sprite = vo.data;
                    if(sp.$batchGeometry == this){
                        sp.$batchGeometry = null;
                        sp.$vcIndex = -1;
                        sp.$vcos = 1;
                        sp.$vcox = 0;
                        sp.$vcoy = 0;
                    }
                }
                vo = vo.next;
            }

            this.link.onRecycle();
        }
    }
        
}