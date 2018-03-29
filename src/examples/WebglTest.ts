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
            // this.render();
            this.loadImage();
        }

        public render():void{
            context3D.configureBackBuffer(stageWidth,stageHeight,0);
            context3D.clear(0,0,0,1);

            let vertexCode:string = `attribute vec3 pos;void main(void){gl_Position = vec4(pos,1.0);}`
            let fragmentCode:string = "void main(void){gl_FragColor=vec4(1.0,0.8,1.0,1.0);}";
            let vertices = new Float32Array([-1.0,1.0,0.0,  1.0,1.0,0.0,    -1.0,-1.0,0.0]);
            let indexs = new Uint16Array([0,1,2]);
            let v = context3D.createVertexBuffer(vertices,3);
            v.regVariable(VA.pos,0,3);
            
            let i = context3D.createIndexBuffer(indexs);
            let p = context3D.createProgram(vertexCode,fragmentCode);
            context3D.setProgram(p);
            v.uploadContext(p);
            context3D.drawTriangles(i);
        }



        public loadImage():void{
            loadRes("assets/ranger.png",this.renderImage,this,ResType.image);
        }

        protected renderImage(event:EventX):void{
            if(event.type != EventX.COMPLETE){
                return;
            }
            let res:ResItem = event.data;
            var image:HTMLImageElement = res.data;
            // var bitmapdata:BitmapData = new BitmapData(image.width,image.height,true);
            // bitmapdata.draw(image);

            context3D.configureBackBuffer(stageWidth,stageHeight,0);
            context3D.clear(0,0,0,1);

            let vertexCode:string = 
            `
                attribute vec3 pos;
                attribute vec2 uv;
                uniform mat4 mvp;
                varying vec2 v_TexCoord;
                void main(void){
                    vec4 temp = vec4(pos,1.0);
                    gl_Position = mvp * temp;
                    v_TexCoord = uv;
                }
            `
            let fragmentCode:string = `
                precision mediump float;
                uniform sampler2D diff;
                varying vec2 v_TexCoord;
                void main(void){
                    gl_FragColor = texture2D(diff, v_TexCoord);
                }
            `;
            ROOT.camera2D.updateSceneTransform();
            let vertices = new Float32Array(
                [
                    0,0,0.0,0.0,
                    512,0,1.0,0.0,
                    512,512,1.0,1.0,
                    0,512,0.0,1.0
                ]
            );
            let indexs = new Uint16Array([0,1,3,1,2,3]);
            let v = context3D.createVertexBuffer(vertices,4);
            v.regVariable(VA.pos,0,2);
            v.regVariable(VA.uv,2,2);
            let i = context3D.createIndexBuffer(indexs);
            let p = context3D.createProgram(vertexCode,fragmentCode);
            context3D.setProgram(p);
            let matrix = new Matrix3D();
            matrix.appendTranslation(200,100,0);
            matrix.append(ROOT.camera2D.worldTranform);
            context3D.setProgramConstantsFromMatrix(VC.mvp,matrix)
            let texture = context3D.createTexture(image.width,image.height,gl.RGBA,false);
            texture.pixels = image;//bitmapdata.canvas;
            texture.uploadContext(p,0,FS.diff);
            v.uploadContext(p);
            context3D.drawTriangles(i);
        }


        public resize(width:number,height:number):void{
           
        }


    }
}