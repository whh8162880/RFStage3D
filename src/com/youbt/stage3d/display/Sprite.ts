///<reference path="./DisplayObjectContainer.ts" />
///<reference path="../camera/Camera.ts" />
module rf{
    export interface I3DRender extends IRecyclable{
        render?(camera:Camera,now:number,interval:number):void
    }
    export class HitArea{
        left:number = 0;
        right:number = 0;
        top:number = 0;
        bottom:number = 0;
        front:number = 0;
        back:number = 0;

        public updateArea(x:number,y:number,z:number):boolean{
            let b:boolean = false;
            if(this.left < x){
                this.left = x;
                b = true;
            }else if(this.right > x){
                this.right = x;
                b = true;
            }

            if(this.top < y){
                this.top = y;
                b = true;
            }else if(this.top > y){
                this.top = y;
                b = true;
            }

            if(this.front < z){
                this.front = z;
                b = true;
            }else if(this.back > z){
                this.back = z;
                b = true;
            }
            
            return b;
        }


        public checkIn(x:number,y:number,scale:number = 1):boolean{
            if(x < this.left * scale && x > this.right * scale && y < this.top * scale && y > this.bottom * scale){
                return false;
            }
            return true;
        }




        public toString():string{
            return `HitArea left:${this.left} right:${this.right} top:${this.top} bottom:${this.bottom} front:${this.front} back:${this.back}`
        }
    }

    export class Sprite extends DisplayObjectContainer implements I3DRender{
        hitArea:HitArea;
        batcher:Batcher;
        batcherAvailable:boolean = true;
        $graphics:Graphics = undefined;
        $batchGeometry:BatchGeometry;
        $vcIndex:number = -1;
        $vcox:number = 0;
        $vcoy:number = 0;
        $vcos:number = 1;
        constructor(){
            super();
            this.hitArea = new HitArea();
            // let g = this.graphics;
            // g.drawRect(0,0,100,100,0xFF0000);
        }
        
        get graphics():Graphics{
            if(undefined == this.$graphics){
                this.$graphics = new Graphics(this);
            }
            return this.$graphics;
        }

        batchChange(value:number):void{
            if(undefined != this.batcher){
                this._change |= value;
                this.childrenChange();
            }else{
                if(this.parent){
                    this.parent.batchChange(value);
                }
            }
        }


        public render(camera:Camera,now:number,interval:number):void{
            if(undefined != this.batcher){
                this.batcher.render(camera,now,interval);
            }
        }

        addToStage(){
            if(this.$graphics && this.$graphics.numVertices){
                this.batchChange(DChange.vertex);
            }
        }
    }



    export class Graphics{
        target:Sprite;
        byte:Float32Byte;
        numVertices:number = 0;

        $batchOffset:number = 0;
        constructor(target:Sprite){
            this.target = target;
            this.byte = new Float32Byte(new Float32Array(0));
            this.numVertices = 0;
        }

        private addPoint(position:number,x:number,y:number,z:number,u:number,v:number,index:number,r:number,g:number,b:number,a:number):void{
            this.numVertices++;
            this.byte.addUIPoint(position,x,y,z,0,0,0,r,g,b,a);
            this.target.hitArea.updateArea(x,y,z);
        }

        clear():void{
            this.numVertices = 0;
        }

        end():void{
            this.target.batchChange(DChange.vertex)
        }

        public drawRect(x:number, y:number,width:number, height:number,color:number,alpha:number = 1,z:number = 0):void{
            let red = ((color & 0x00ff0000) >>> 16)/0xFF;
            let green = ((color & 0x0000ff00) >>> 8)/0xFF;
            let blue = (color & 0x000000ff)/0xFF;
            let r = x + width;
            let b = y + height;
            let p = this.byte.array.length;
            this.byte.length = p+40;
            this.addPoint(p   ,x,y,z,0,0,0,red,green,blue,alpha);
            this.addPoint(p+10,r,y,z,0,0,0,red,green,blue,alpha);
            this.addPoint(p+20,r,b,z,0,0,0,red,green,blue,alpha);
            this.addPoint(p+30,x,b,z,0,0,0,red,green,blue,alpha);
        }
    }


    export abstract class RenderBase implements I3DRender{
        triangleFaceToCull:string = Context3DTriangleFace.NONE;
        sourceFactor:number;
        destinationFactor:number;
        depthMask:boolean = false;
        passCompareMode:number;
        public render(camera:Camera,now:number,interval:number):void{}
        constructor(){
            if(undefined != gl){
                this.sourceFactor = gl.SRC_ALPHA;
                this.destinationFactor = gl.ONE_MINUS_CONSTANT_ALPHA;
                this.passCompareMode = gl.ALWAYS;
            }
        }
    }

    export class Batcher extends RenderBase implements I3DRender{
        target:Sprite;
        renders:Link;
        geo:BatchGeometry = undefined;
        program:Program3D;
        worldTransform:Matrix3D;
        constructor(target:Sprite){
            super();
            this.target = target;
            this.renders = new Link();
            this.worldTransform = new Matrix3D();
        }

        public render(camera:Camera,now:number,interval:number):void{
            if(this.target._change & DChange.vertex){
                this.cleanBatch();
                //step1 收集所有可合并对象
                this.getBatchTargets(this.target,-this.target._x,-this.target._y,1/this.target._scaleX);
                //step2 合并模型 和 vc信息
                this.toBatch();
                
                this.geo = undefined;
                this.target._change &= ~DChange.vertex;
            }

            if(undefined == this.program){
                this.createProgram();
            }

            this.worldTransform.copyFrom(this.target.sceneTransform);
            this.worldTransform.append(camera.worldTranform);


            let vo = this.renders.getFrist();
            while(vo){
                if(vo.close == false){
                    let render:I3DRender = vo.data;
                    if(render instanceof BatchGeometry){
                        this.dc(render);
                    }else{
                        render.render(camera,now,interval);
                    }
                }
                vo = vo.next;
            }
        }

        dc(geo:BatchGeometry):void{
            // context3D.setBlendFactors()
            let v:VertexBuffer3D = geo.$vertexBuffer;
            if(undefined == v){
                geo.$vertexBuffer = v = context3D.createVertexBuffer(geo.vertex,geo.vertex.data32PerVertex);
                v.data.regVariable("pos",0,3);
            }
            let i:IndexBuffer3D = context3D.getIndexByQuad(geo.quadcount);
            context3D.setProgram(this.program);
            context3D.setProgramConstantsFromMatrix(VC.mvp,this.worldTransform);
            context3D.setProgramConstantsFromVector(VC.ui,geo.vcData.array,4);
            v.uploadContext(this.program);
            context3D.drawTriangles(i);
        }
        

        createProgram():void{
            let vcode = `
                attribute vec3 pos;
                attribute vec3 uv;
                attribute vec4 color;
                uniform mat4 mvp;
                uniform vec4 ui[100];
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
                varying vec4 vColor;
                void main(void){
                    vec4 color = vColor;
                    gl_FragColor = color;
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

            this.program = context3D.createProgram(vcode,fcode);
        }

        cleanBatch():void{
            let vo  = this.renders.getFrist();
            while(vo){
                if(vo.close == false){
                    let render:Recyclable<I3DRender> = vo.data;
                    if(render instanceof BatchGeometry){
                        render.recycle();
                    }
                    vo.close = true;
                }
                vo = vo.next;
            }
            this.renders.clean();
        }

        getBatchTargets(target:Sprite,ox:number,oy:number,os:number):void{
            if(false == target._visible || 0.0 >= target.sceneAlpha){
                target.$vcIndex = -1;
                target.$batchGeometry = null;
                return;
            }

            let g = target.$graphics;
            ox = target._x + ox;
            oy = target._y + oy;
            os = target._scaleX * os;
            if(target == this.target || (null == target.batcher && true == target.batcherAvailable)){
                if(undefined == g || 0 >= g.numVertices){
                    target.$vcIndex = -1;
                    target.$batchGeometry = null;
                }else{
                    if(undefined == this.geo){
                        this.geo = recyclable(BatchGeometry);
                        this.renders.add(this.geo);
                    }
    
                    let i = this.geo.add(target,g);
                    target.$vcox = ox;
                    target.$vcoy = oy;
                    target.$vcos = os;
    
                    if(i >= max_vc){
                        this.geo = undefined;
                    }
                }
            }else{
                this.renders.add(target);
                this.geo = undefined;
            }

            for(let child of target.childrens){
                if(child instanceof Sprite){
                    this.getBatchTargets(child,ox,oy,os);
                }
            }
        }


        toBatch():void{
            let vo  = this.renders.getFrist();
            while(vo){
                if(vo.close == false){
                    let render:Recyclable<I3DRender> = vo.data;
                    if(render instanceof BatchGeometry){
                        render.build();
                    }
                }
                vo = vo.next;
            }
        }

        
    }


    class BatchGeometry implements I3DRender,IGeometry{

        static variables: { [key: string]: { size: number, offset: number } } = {
            "pos":{size:3,offset:0},
            "uv":{size:3,offset:3},
            "color":{size:4,offset:6}
        }
        vertex:VertexInfo;
        $vertexBuffer:VertexBuffer3D;
        quadcount:number;
        vcData:Float32Byte;
        vci:number = 0;
        link:Link;
        verlen:number = 0;
        constructor(){};

        add(target:Sprite,g:Graphics):number{
            if(undefined == this.link){
                this.link = new Link();
            }
            target.$vcIndex = this.vci++;
            target.$batchGeometry = this;
            g.$batchOffset = this.verlen;
            this.verlen += g.byte.length;
            this.link.add(target);
            return this.vci;
        }


        build():void{
            this.quadcount = this.link.length;
            this.vertex = new VertexInfo(this.verlen,10);
            this.vertex.variables = BatchGeometry.variables;
            this.vcData = new Float32Byte(new Float32Array(this.quadcount * 4))
            let byte = this.vertex.vertex;
            let vo  = this.link.getFrist();
            if(vo.close == false){
                let sp:Sprite = vo.data;
                let g = sp.$graphics;
                byte.set(g.$batchOffset,g.byte);
                this.vcData.addPoint4(sp.$vcIndex * 4,sp.$vcox,sp.$vcoy,sp.$vcos,sp.sceneAlpha)
            }
            vo = vo.next;
        }
        
        //x,y,z,u,v,vci,r,g,b,a;
        
        onRecycle():void{
            this.vertex = undefined;
            this.verlen = 0;
            this.link.onRecycle();
        }
    }
}