module rf{

    export let line_variable:{ [key: string]: IVariable } = {
        "posX":{size:3,offset:0},
        "posY":{size:3,offset:3},
        "len":{size:1,offset:6},
        "color":{size:4,offset:7},
        "data32PerVertex":{size:11,offset:0}
    }

    export class Line3DPoint{
        x:number = 0;
        y:number = 0;
        z:number = 0;
        r:number = 1;
        g:number = 1;
        b:number = 1;
        a:number = 1;
        t:number = 1;

        clear(){
            this.x = this.y = this.z = 0;
            this.r = this.g = this.b = this.a = this.t = 1;
        }

        clone():Line3DPoint{
            let vo = new Line3DPoint();
            vo.x = this.x;
            vo.y = this.y;
            vo.z = this.z;
            vo.r = this.r;
            vo.g = this.g;
            vo.b = this.b;
            vo.a = this.a;
            vo.t = this.t;
            return vo;
        }
    }

    /**
     * 直线 不管放大 缩小 都不变
     */
    export class Line3D extends RenderBase{
        
        constructor(){
            super(line_variable);
            this.data32PerVertex = line_variable["data32PerVertex"].size;
            this.nativeRender = true;
            this.worldTransform = newMatrix3D();
        }
        private origin:Recyclable<Line3DPoint>;
        private tempVertex:Recyclable<Temp_Float32Byte>;
        points:Line3DPoint[] = [];
        vertexBuffer:VertexBuffer3D;
        program:Program3D;
        worldTransform:IMatrix3D;
        data32PerVertex:number;
        numVertices:number;
        triangles:number;
        quad:number;
        clear(){
            let tempVertex = this.tempVertex
            if(undefined == tempVertex){
                this.tempVertex = tempVertex = recyclable(Temp_Float32Byte);
            }

            tempVertex.data32PerVertex = this.data32PerVertex;
            tempVertex.numVertices = 0;

            let origin = this.origin;
            if(undefined == origin){
                this.origin = origin = recyclable(Line3DPoint);
            }

            this.points.length = 0;

            this.vertexBuffer = null;
        }

        moveTo(x:number,y:number,z:number,thickness:number = 1,color:number = 0xFFFFFF,alpha:number = 1):void{
            const{origin,points} = this;
            if(points.length){
                this.build();
            }

            origin.x = x;
            origin.y = y;
            origin.z = z;
            
            origin.t = thickness;
            toRGB(color,origin);
            origin.a = alpha;

            points.push(origin.clone());
        }

        lineTo(x:number,y:number,z:number,thickness:number = 1,color:number = 0xFFFFFF,alpha:number = 1):void{
            const{origin:vo,points} = this;
            vo.x = x;
            vo.y = y;
            vo.z = z;
            vo.a = alpha;
            vo.t = thickness;
            toRGB(color,vo);
            points.push(vo.clone());
        }

        private build(){
            const{points,tempVertex} = this;
            let j = 0;
            let m = points.length -1;
            for (j = 0; j < m ; j++)
			{
                let p1 = points[j];
                let p2 = points[j+1];
                tempVertex.set([p1.x,p1.y,p1.z,p2.x,p2.y,p2.z,-p1.t * 0.5,p1.r,p1.g,p1.b,p1.a]);
                tempVertex.set([p2.x,p2.y,p2.z,p1.x,p1.y,p1.z,p2.t * 0.5,p2.r,p2.g,p2.b,p2.a]);
                tempVertex.set([p2.x,p2.y,p2.z,p1.x,p1.y,p1.z,-p2.t * 0.5,p2.r,p2.g,p2.b,p2.a]);
                tempVertex.set([p1.x,p1.y,p1.z,p2.x,p2.y,p2.z,p1.t * 0.5,p1.r,p1.g,p1.b,p1.a]);
                tempVertex.numVertices += 4;
            }
            points.length = 0;
        }

        end():void{
            const{origin,data32PerVertex,points,tempVertex,variables} = this;
            if(points.length){
                this.build();
            }
            let arr = tempVertex.toArray()
            let info = new VertexInfo(arr,data32PerVertex,variables);
            let v = this.vertexBuffer = context3D.createVertexBuffer(info);
            this.triangles = v.numVertices / 2;
            this.quad = this.triangles / 2;

            tempVertex.recycle();
            origin.recycle();

            this.tempVertex = this.origin = undefined;

        }

        updateTransform(): void {
            super.updateTransform();
        }

        render(camera: Camera, now: number, interval: number):void{


            let c = context3D;
            // c.setDepthTest(true,gl.LEQUAL);
            const{vertexBuffer:v,worldTransform:m,quad,triangles}=this;

            if(undefined == v){
                return;
            }

            let p = this.program;

            if(undefined == p){
                p = c.programs["Line3D"];
                if(undefined == p){
                    p = this.createProgram();
                }
                this.program = p
            }

            scene.material.uploadContextSetting();

            c.setProgram(p);

            m.set(this.sceneTransform);
            m.m3_append(camera.invSceneTransform);
            c.setProgramConstantsFromMatrix(VC.mv,m);
            c.setProgramConstantsFromMatrix(VC.p,camera.len);
            v.uploadContext(p);

            let i = c.getIndexByQuad(quad);

            c.drawTriangles(i,triangles)
        }


        


        protected createProgram():Program3D{

            let vertexCode = `
                attribute vec3 posX;
                attribute vec3 posY;
                attribute float len;
                attribute vec4 color;

                uniform mat4 mv;
                uniform mat4 p;
                varying vec4 vColor;

                void main(void){
                    vec4 pos = mv * vec4(posX,1.0); 
                    vec4 t = pos - mv * vec4(posY,1.0);
                    vec3 v = cross(t.xyz,vec3(0,0,1));
                    v = normalize(v);
                    float t2 = pos.z * p[2].w;
                    if(t2 <= 0.0){
                       v.xyz *= len;
                    }else{
                        v.xyz *= len * t2;
                    }
                    pos.xy += v.xy;
                    pos = p * pos;
                    gl_Position = pos;
                    vColor = color;
                    // t2 = pos.z;
                    // pos = vec4(t2,t2,t2,1.0);
                    // vColor.xyzw = pos;
                }
            `

            let fragmentCode = ` 
                precision mediump float;
                varying vec4 vColor;
                void main(void){
                    gl_FragColor = vColor;
                }
            `

            return context3D.createProgram(vertexCode,fragmentCode,"Line3D");
        }
    }

    export class Trident extends Line3D{
        constructor(len:number = 200,think:number = 2){
            super();
            
            var line;
            if(len*0.1 > 60){
                line = len - 60;
            }else{
                line = len * 0.9
            }

            this.clear();
            let color = 0xFF0000;
            this.moveTo(0,0,0,think,color);
            this.lineTo(line,0,0,think,color);
            this.moveTo(line,0,0,think*5,color);
            this.lineTo(len,0,0,0,color);

            color = 0x00FF00;
            this.moveTo(0,0,0,think,color);
            this.lineTo(0,line,0,think,color);
            this.moveTo(0,line,0,think*5,color);
            this.lineTo(0,len,0,0,color);

            color = 0x0000FF;
            this.moveTo(0,0,0,think,color);
            this.lineTo(0,0,line,think,color);
            this.moveTo(0,0,line,think*5,color);
            this.lineTo(0,0,len,0,color);

            this.end();

        }
    }

}