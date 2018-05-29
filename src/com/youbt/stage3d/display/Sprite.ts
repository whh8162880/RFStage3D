///<reference path="./DisplayObjectContainer.ts" />
///<reference path="../camera/Camera.ts" />
///<reference path="./Filter.ts" />
module rf {

    export abstract class RenderBase extends DisplayObjectContainer implements I3DRender {
        nativeRender:boolean = false;
        variables:{ [key: string]: IVariable };
        material:Material;
        tm:ITimeMixer;
        scrollRect:Size;
        // triangleFaceToCull: string = Context3DTriangleFace.NONE;
        // sourceFactor: number;
        // destinationFactor: number;
        // depthMask: boolean = false;
        // passCompareMode: number;
        public render(camera: Camera, now: number, interval: number): void { 
            let i = 0;
            let childrens = this.childrens;
            let len = childrens.length;
            for(i = 0;i<len;i++){
                let child = childrens[i];
                child.render(camera,now,interval);
            }
        }
        constructor(variables?:{ [key: string]: IVariable }) {
            super();
            this.tm = defaultTimeMixer;
            this.variables = variables;
        }

        addToStage():void{
            super.addToStage();
            this.setChange(DChange.vertex);
        }
    }
    

    export class Sprite extends RenderBase {
        source:BitmapSource;
       
        /**
         * 1.Sprite本身有render方法可以渲染
         * 2.考虑到可能会有一些需求 渲染器可以写在别的类或者方法中  所以加入renderer概念
         */
        renderer: I3DRender;
        $graphics: Graphics = undefined;
        $batchGeometry: BatchGeometry = undefined;
        $vcIndex: number = -1;
        $vcox: number = 0;
        $vcoy: number = 0;
        $vcos: number = 1;
        constructor(source?:BitmapSource,variables?:{ [key: string]: IVariable }) {
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
                this.status |= (value | p);
            }else{
                super.setChange(value,p,c);
            }
        }

        render(camera: Camera, now: number, interval: number): void {
            if (undefined != this.renderer) {
                if(this.status & DChange.t_all){ //如果本层或者下层有transform alpha 改编 那就进入updateTransform吧
                    this.updateTransform();
                }
                this.renderer.render(camera, now, interval);
            }
        }

        addToStage() {
            if (this.$graphics && this.$graphics.numVertices) {
                this.setChange(DChange.vertex);
            }

            if(this.renderer){
                if(this.parent){
                    this.parent.setChange(DChange.vertex);
                }
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

        setSize(width:number, height:number):void
        {
            super.setSize(width, height);
            let hitArea = this.hitArea;
            hitArea.clean();
            hitArea.updateArea(width, height, 0);
        }

        public updateHitArea():void{
            let locksize = this.locksize;
            if(locksize)
            {
                return;
            }
            let hitArea = this.hitArea;
            hitArea.clean();
            for(let child of this.childrens){
                if(child.status & DChange.ac){
                    child.updateHitArea();
                }
                hitArea.combine(child.hitArea,child._x,child._y);
            }

            if(this.$graphics){
                hitArea.combine(this.$graphics.hitArea,0,0);
            }

            // if(hitArea.allWays){
            //     this.w = stageWidth;
            //     this.h = stageHeight;
            // }else{
            this.w = hitArea.right - hitArea.left;
            this.h = hitArea.bottom - hitArea.top;
            // }
            this.status &= ~DChange.ac;
        }

        getObjectByPoint(dx: number, dy: number,scale:number): DisplayObject {

            let{mouseEnabled,mouseChildren} = this;

            if(mouseEnabled == false && mouseChildren == false){
                return undefined
            }
            let{status,scrollRect,hitArea}=this;

            if(this.status & DChange.ac){
                this.updateHitArea()
            }

            dx -= this._x;
            dy -= this._y;
            scale *= this._scaleX;

            let b = true;

            if(scrollRect){
                let{w,h} = scrollRect;
                b = size_checkIn(0,w,0,h,dx,dy,scale);
            }

            
            if(b && hitArea.checkIn(dx,dy,scale)){
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
                if(mouseEnabled){
                    if(hitArea.allWays){
                        return this;
                    }
                    if( hitArea.checkIn(dx,dy,scale) == true ){
                        return this;
                    }
                    // let g = this.$graphics;
                    // if(undefined != g){
                    //     if( g.hitArea.checkIn(dx,dy,scale) == true ){
                    //         return this;
                    //     }
                    // }
                }
            }


            return undefined;
        }
    }

    export class Image extends Sprite{
        _url:string;
        constructor(source?:BitmapSource){
            super(source);
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
            source.drawimg(image,vo.x,vo.y);

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
        constructor(source?:BitmapSource){
            super(source);
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
            let vo = source.setSourceVO(this._url,img.width,img.height,1);
            // source.bmd.context.drawImage(img,vo.x,vo.y);
            source.drawimg(img,vo.x,vo.y,dw,dh);

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

    export interface IGraphicsGeometry{
        offset:number;
        numVertices:number;
        base:Float32Array;
        matrix:IMatrix;
        vo:IBitmapSourceVO;
        rect:Size;
        w:number;
        h:number;
    }

    export function newGraphicsGeometry(matrix?:IMatrix){
        return {numVertices:0,matrix:matrix,offset:0} as IGraphicsGeometry;
    }

    export class Graphics {
        grometrys:IGraphicsGeometry[];
        target: Sprite;
        byte: Float32Array;
        hitArea:HitArea;
        numVertices: number = 0;
        $batchOffset: number = 0;
        private preNumVertices:number = 0;
        constructor(target: Sprite,variables: { [key: string]: { size: number, offset: number } }) {
            this.target = target;
            // this.byte = new Float32Byte(new Float32Array(0));
            this.numVertices = 0;
            this.hitArea = new HitArea();
            this.grometrys = [];
        }


        setSize(width:number, height:number){
            let{$batchOffset:batchoffset,grometrys,target}=this;

            grometrys.forEach(element => {
                let{rect,matrix,offset} = element;
                let{$batchGeometry} = target;
                if($batchGeometry){
                    $batchGeometry.update(batchoffset + offset,element.base);
                }
            });

            
        }

        clear(): void {
            this.preNumVertices = this.numVertices;
            this.numVertices = 0;
            this.byte = undefined;
            this.hitArea.clean();
            this.grometrys.length = 0;
        }

        end(): void {
            let{target,grometrys,numVertices}=this;
            let change = 0;
            

            

            


            if(numVertices > 0){

                let data32PerVertex = target.variables["data32PerVertex"].size;
                let float = new Float32Array(numVertices * data32PerVertex);
                let offset = 0;
                grometrys.forEach(geo => {
                    geo.offset = offset;
                    float.set(geo.base,offset);
                    offset += geo.base.length;
                });
                // let float = createGeometry(empty_float32_object,target.variables,this.numVertices);
                this.byte = float;
                if(target.$batchGeometry && this.preNumVertices == this.numVertices){
                    target.$batchGeometry.update(this.$batchOffset,float);
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
        

        addPoint(geometry:IGraphicsGeometry,pos:number[],noraml:number[],uv:number[],color:number[],locksize:boolean):void{
            let variables = this.target.variables;
            let numVertices = geometry.numVertices;
            function set(variable:IVariable,array:Float32Array,data:number[]):void{
                if(undefined == data || undefined == variable){
                    return;
                }
                let size = variable.size;
                let offset = numVertices * size
                if(data.length == size){
                    array.set(data,offset)
                }else{
                    array.set(data.slice(0,size),offset);
                }
                // for(let i = 0;i<size;i++){
                //     array[offset + i] = data[i];
                // }
            }

            set(variables[VA.pos],empty_float32_pos,pos);
            set(variables[VA.normal],empty_float32_normal,noraml);
            set(variables[VA.uv],empty_float32_uv,uv);
            set(variables[VA.color],empty_float32_color,color);


            if(!locksize){
                this.hitArea.updateArea(pos[0],pos[1],pos[2]);
            }
            
            // this.numVertices++
            geometry.numVertices ++;
        }

        drawRect(x: number, y: number, width: number, height: number, color: number, alpha: number = 1, matrix:IMatrix = undefined,z: number = 0) {

            let{variables,source,$vcIndex,locksize} = this.target;
            let data32PerVertex = variables["data32PerVertex"].size;
            const{originU,originV} = source;
            const rgba = [
                ((color & 0x00ff0000) >>> 16) / 0xFF,
                ((color & 0x0000ff00) >>> 8) / 0xFF,
                (color & 0x000000ff) / 0xFF,
                alpha
            ]
            const uv = [originU,originV,$vcIndex];
            const noraml = [0,0,1]

            let geometry = newGraphicsGeometry();
            this.grometrys.push(geometry);

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
                this.addPoint(geometry,p,noraml,uv,rgba,locksize);
            }

            geometry.base = createGeometry(empty_float32_object,variables,geometry.numVertices);
            this.numVertices += geometry.numVertices;
            return geometry;
        }

        drawScale9Bitmap(x: number, y: number,vo:IBitmapSourceVO,rect:Size,matrix?:IMatrix,color:number = 0xFFFFFF,alpha:number = 1,z:number = 0,geometry?:IGraphicsGeometry){
            const noraml = [0,0,1];
            const rgba = [
                ((color & 0x00ff0000) >>> 16) / 0xFF,
                ((color & 0x0000ff00) >>> 8) / 0xFF,
                (color & 0x000000ff) / 0xFF,
                alpha
            ]
            let{variables,$vcIndex:index,locksize} = this.target;

            let sx = 1, sy = 1;
            if(matrix){

                let{
                    0:m0,1:m1,2:m2,
                    3:m3,4:m4
                }=matrix as any;

                sx = Math.sqrt(m0*m0 + m1*m1);
                sy = Math.sqrt(m3*m3 + m4*m4);
                
                TEMP_MATRIX2D.set(matrix);
                matrix = TEMP_MATRIX2D;

                matrix[0] = m0 / sx;
                matrix[1] = m1 / sx;

                matrix[3] = m3 / sy;
                matrix[4] = m4 / sy;
            }

            let{w,h,ul,ur,vt,vb}=vo;
            let{x:rx,y:ry,w:rw,h:rh}=rect;
            let rr = w - rw - rx ,rb = h - rh - ry;
            let uw = ur - ul,vh = vb - vt;
            let x2 = x + rx,y2 = y + ry;
            let u2 = (rx / w) * uw + ul,u3 = ((rx+rw) / w) * uw + ul;
            let v2 = (ry / h) * vh + vt,v3 = ((ry+rh) / h) * vh + vt;
            // x3 = x2 + rw,,y3 = y2 + rh;
            w = Math.round(w * sx);
            h = Math.round(h * sy);

            let x3 = w - rr,y3 = h - rb;
            let r = x + w,b = y + h;

            if(!geometry){
                geometry = newGraphicsGeometry(matrix || newMatrix());
                this.grometrys.push(geometry);
            }else{
                this.numVertices -= geometry.numVertices;
                geometry.numVertices = 0;
            }

            geometry.w = w;
            geometry.h = h;

            let points = [
                x,y,ul,vt,      x2,y,u2,vt,     x2,y2,u2,v2,    x,y2,ul,v2,  
                x2,y,u2,vt,     x3,y,u3,vt,     x3,y2,u3,v2,    x2,y2,u2,v2,
                x3,y,u3,vt,     r,y,ur,vt,      r,y2,ur,v2,     x3,y2,u3,v2,

                x,y2,ul,v2,     x2,y2,u2,v2,    x2,y3,u2,v3,    x,y3,ul,v3,
                x2,y2,u2,v2,    x3,y2,u3,v2,    x3,y3,u3,v3,    x2,y3,u2,v3,
                x3,y2,u3,v2,    r,y2,ur,v2,     r,y3,ur,v3,     x3,y3,u3,v3,


                x,y3,ul,v3,     x2,y3,u2,v3,    x2,b,u2,vb,     x,b,ul,vb,
                x2,y3,u2,v3,    x3,y3,u3,v3,    x3,b,u3,vb,     x2,b,u2,vb,
                x3,y3,u3,v3,    r,y3,ur,v3,     r,b,ur,vb,      x3,b,u3,vb
            ];


            let f = m2dTransform;
            let p = [0,0,0];
            for(let i=0;i<points.length;i+=4){
                p[0] = points[i];
                p[1] = points[i+1];
                p[2] = z;
                if(undefined != matrix){
                    f(matrix,p,p);
                }
                this.addPoint(geometry,p,noraml,[points[i+2],points[i+3],index],rgba,locksize);
            }

            geometry.vo = vo;
            geometry.rect = rect;
            geometry.base = createGeometry(empty_float32_object,variables,geometry.numVertices);
            this.numVertices += geometry.numVertices;
            return geometry;

        }

        drawBitmap(x: number, y: number,vo:IBitmapSourceVO,matrix?:IMatrix,color:number = 0xFFFFFF,alpha:number = 1,z:number = 0){
            const{w,h,ul,ur,vt,vb}=vo;
            let r = x + w;
            let b = y + h;
            
            const rgba = [
                ((color & 0x00ff0000) >>> 16) / 0xFF,
                ((color & 0x0000ff00) >>> 8) / 0xFF,
                (color & 0x000000ff) / 0xFF,
                alpha
            ]

            const noraml = [0,0,1];

            let{variables,$vcIndex:index,locksize} = this.target;

            let geometry = newGraphicsGeometry();
            this.grometrys.push(geometry);

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
                this.addPoint(geometry,p,noraml,[points[i+2],points[i+3],index],rgba,locksize);
            }
            geometry.vo = vo;
            geometry.base = createGeometry(empty_float32_object,variables,geometry.numVertices);
            this.numVertices += geometry.numVertices;
            return geometry;
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
    export class BatchRenderer implements I3DRender {
        target: Sprite;        
        renders: Link;
        geo: BatchGeometry = undefined;
        program: Program3D;
        t:Texture
        constructor(target: Sprite) {
            this.target = target;
            this.renders = new Link();
        }

        public render(camera: Camera, now: number, interval: number): void {
            let target:Sprite = this.target;
            let c = context3D;
            const{source,sceneTransform,status,_x,_y,_scaleX} = this.target;
            if(undefined == source){
                return;
            }
            let{textureData}=source;
            if(!textureData) {
                source.textureData = textureData = c.getTextureData(source.name);
            }
            
            let t = context3D.textureObj[textureData.key];
            if(undefined == t){
                t = context3D.createTexture(textureData,source.bmd);
            }
            this.t = t;


            if (status & DChange.vertex) {
                this.cleanBatch();
                //step1 收集所有可合并对象
                this.getBatchTargets(target, -_x, -_y, 1 / _scaleX);
                //step2 合并模型 和 vc信息
                this.toBatch();

                this.geo = undefined;
                target.status &= ~DChange.batch;
            }else if(status & DChange.vcdata){
                //坐标发生了变化 需要更新vcdata 逻辑想不清楚  那就全部vc刷一遍吧
                this.updateVCData(target, -_x, -_y, 1 / _scaleX);
                target.status &= ~DChange.vcdata;
            }

            if (undefined == this.program) {
                this.createProgram();
            }

            let vo = this.renders.getFrist();
            while (vo) {
                if (vo.close == false) {
                    let render: I3DRender = vo.data;
                    if (render instanceof BatchGeometry) {
                        this.dc(camera,render);
                    } else {
                        render.render(camera, now, interval);
                    }
                }
                vo = vo.next;
            }
        }

        dc(camera:Camera,geo: BatchGeometry): void {
            // context3D.setBlendFactors()
            let c = context3D;
            let v: VertexBuffer3D = geo.$vertexBuffer;
            if (undefined == v) {
                geo.$vertexBuffer = v = c.createVertexBuffer(geo.vertex, geo.vertex.data32PerVertex);
            }
            let g = gl;
            let{scrollRect,sceneTransform}=this.target;
            let worldTransform = TEMP_MATRIX3D;
            if(scrollRect){
                let{x,y,w,h}=scrollRect;
                c.setScissor(sceneTransform[12],sceneTransform[13],w,h);
                worldTransform.m3_translation(x,y,0,true,sceneTransform);
                worldTransform.m3_append(camera.worldTranform);
            }else{
                worldTransform.m3_append(camera.worldTranform,false,sceneTransform);
            }
            
            let i: IndexBuffer3D = c.getIndexByQuad(geo.quadcount);
            let p = this.program; 
            c.setProgram(p);
            c.setProgramConstantsFromMatrix(VC.mvp, worldTransform);
            c.setProgramConstantsFromVector(VC.ui, geo.vcData, 4);
            this.t.uploadContext(p,0,FS.diff);
            v.uploadContext(p);
            c.drawTriangles(i,geo.quadcount * 2);
        }


        createProgram(): void {

            let chunk = singleton(Shader);

            let keys = {};

            keys[chunk.att_uv_ui.key] = chunk.att_uv_ui;
            keys[chunk.uni_v_mvp.key] = chunk.uni_v_mvp;
            let vcode = chunk.createVertex(undefined,keys)


            // let vcode = `
            //     attribute vec3 pos;
            //     attribute vec3 uv;
            //     attribute vec4 color;
            //     uniform mat4 mvp;
            //     uniform vec4 ui[${max_vc}];
            //     varying vec2 vUV;
            //     varying vec4 vColor;
            //     void main(void){
            //         vec4 p = vec4(pos,1.0);
            //         vec4 t = ui[int(uv.z)];
            //         p.xy = p.xy + t.xy;
            //         p.xy = p.xy * t.zz;
            //         gl_Position = mvp * p;
            //         vUV.xy = uv.xy;
            //         p = color;
            //         p.w = color.w * t.w;
            //         vColor = p;
            //     }
            // `

            keys = {};
            keys[chunk.uni_f_diff.key] = chunk.uni_f_diff;
            keys[chunk.att_uv_ui.key] = chunk.att_uv_ui;
            let fcode = chunk.createFragment(undefined,keys);

            // let fcode = `
            //     precision mediump float;
            //     uniform sampler2D diff;
            //     varying vec4 vColor;
            //     varying vec2 vUV;
            //     void main(void){
            //         vec4 color = texture2D(diff, vUV);
            //         gl_FragColor = vColor*color;
            //     }
            // `

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

        getBatchTargets(render: RenderBase, ox: number, oy: number, os: number): void {
            let target:Sprite;
            if(render instanceof Sprite){
                target = render;
            }else{
                this.renders.add(render);
                this.geo = undefined;
                return;
            }

            if (false == target._visible || 0.0 >= target.sceneAlpha) {
                target.$vcIndex = -1;
                target.$batchGeometry = null;
                return;
            }

            let g = target.$graphics;
            ox = target._x + ox;
            oy = target._y + oy;
            os = target._scaleX * os;
            if (target == this.target || (null == target.renderer && false == target.nativeRender)) {
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
                return;
            }

            for (let child of target.childrens) {
                if (child instanceof Sprite) {
                    this.getBatchTargets(child, ox, oy, os);
                }else if(child instanceof RenderBase){
                    this.renders.add(child);
                    this.geo = undefined;
                }
            }
        }

        
        updateVCData(render: RenderBase, ox: number, oy: number, os: number):void{
            let target:Sprite;
            if(render instanceof Sprite){
                target = render;
            }else{
                return;
            }
            

            if (false == target._visible || 0.0 >= target.sceneAlpha) {
                target.$vcIndex = -1;
                target.$batchGeometry = null;
                return;
            }

            let g = target.$graphics;
            ox = target._x + ox;
            oy = target._y + oy;
            os = target._scaleX * os;
            if (target == this.target || (null == target.renderer && false == target.nativeRender)) {
                if(undefined != target.$batchGeometry){
                    target.$vcox = ox;
                    target.$vcoy = oy;
                    target.$vcos = os;
                    target.$batchGeometry.vcData.wPoint4(target.$vcIndex * 4 ,ox, oy, os, target.sceneAlpha);
                }
            }else{
                return;
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


    export class BatchGeometry implements I3DRender {
        vertex: VertexInfo;
        $vertexBuffer: VertexBuffer3D;
        quadcount: number;
        vcData: Float32Array;
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
            this.vcData = new Float32Array(this.quadcount * 4)
            let{data32PerVertex,vertex:byte}=this.vertex;
            let offset = vertex_ui_variable["uv"].offset+2
            let vo = this.link.getFrist();
            while(vo){
                if (vo.close == false) {
                    let sp: Sprite = vo.data;
                    let{$vcIndex}=sp;
                    let g = sp.$graphics;
                    if($vcIndex >= 0){
                        g.byte.update(data32PerVertex,offset,$vcIndex)
                    }
                    byte.set(g.byte,g.$batchOffset);
                    this.vcData.wPoint4($vcIndex * 4, sp.$vcox, sp.$vcoy, sp.$vcos, sp.sceneAlpha)
                }
                vo = vo.next;
            }
        }

        update(position:number,byte:Float32Array):void{
            if(undefined != this.vertex){
                this.vertex.vertex.set(byte,position);
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