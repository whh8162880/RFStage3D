/// <reference path="../com/youbt/rfreference.ts" />
module rf{
    export class WebglTest implements IResizeable{
        constructor(){
            var canvas:HTMLCanvasElement = document.createElement("canvas");
            document.body.appendChild(canvas);
            var stage3d:Stage3D = singleton(Stage3D);
            var b:boolean = stage3d.requestContext3D(canvas);
            if(false == b){
                console.log("GL create fail");
                return;
            }
            Engine.addResize(this);
            this.render();
        }




        public render():void{
            context3D.configureBackBuffer(stageWidth,stageHeight,0);
            context3D.clear(0,0,0,1);

            var vertices:Float32Array = new Float32Array([-1.0,1.0,0.0,  1.0,1.0,0.0,    -1.0,-1.0,0.0]);
            var indexs:number[] = [0,1,2];
            var v:VertexBuffer3D = context3D.createVertexBuffer(3,3);
            var i:IndexBuffer3D = context3D.createIndexBuffer(3);
            var p:Program3D = context3D.createProgram();

            let vertexCode:string = "attribute vec3 pos;void main(void){gl_Position = vec4(pos,1.0);}"
            let fragmentCode:string = "void main(void){gl_FragColor=vec4(1.0,0.8,1.0,1.0);}";
            v.uploadFromVector(vertices,0,v.numVertices);
            i.uploadFromVector(indexs,0,3);
            p.upload(vertexCode,fragmentCode);
            context3D.setProgram(p);
            context3D.setVertexBufferAt("pos",v,0,Context3DVertexBufferFormat.FLOAT_3);
            context3D.drawTriangles(i);
        }


        public resize(width:number,height:number):void{
           
        }


    }
}