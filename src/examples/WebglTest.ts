/// <reference path="../com/youbt/rfreference.ts" />
module rf{
    export class WebglTest implements IResizeable{
        constructor(){
            // var canvas:HTMLCanvasElement = document.createElement("canvas");
            // document.body.appendChild(canvas);
            // var stage3d:Stage3D = singleton(Stage3D);
            // var b:boolean = stage3d.requestContext3D(canvas);
            // if(false == b){
                // console.log("GL create fail");
                // return;
            // }
            Engine.addResize(this);
            this.render2();
            // this.loadImage();
        }

        public render2():void{
            context3D.clear(0,0,0,1);


            let vcode = `
                attribute vec3 pos;
                uniform mat4 mvp;
                void main(void){
                    vec4 p = vec4(pos,1.0);
                    gl_Position = mvp * p;
                }
            `
            let fcode = `
                precision mediump float;
                void main(void){
                    gl_FragColor = vec4(1,0,0,1);
                }
            `
            let p = context3D.createProgram(vcode,fcode);
            let v = context3D.createVertexBuffer(
                [
                    0,0,0,
                    100,0,0,
                    100,100,0,
                    0,100,0
                ],3
            )
            v.data.regVariable("pos",0,3);
            let i = context3D.getIndexByQuad(1);

            ROOT.camera2D.updateSceneTransform();


            context3D.setProgram(p);
            context3D.setProgramConstantsFromMatrix(VC.mvp,ROOT.camera2D.worldTranform)
            v.uploadContext(p);
            context3D.drawTriangles(i,2);

        }


        public render():void{
            // context3D.configureBackBuffer(stageWidth,stageHeight,0);
            context3D.clear(0,0,0,1);

            let vertexCode:string = `
                attribute vec2 pos;
                attribute float index;
                uniform vec4 color[100];
                varying vec4 vColor;
                void main(void){
                    gl_Position = vec4(pos,0.0,1.0);
                    vColor = color[int(index)];
                }
            `

            let fragmentCode:string =  `
                precision mediump float;
                varying vec4 vColor;
                void main(void){
                    gl_FragColor = vColor;
                }
                
                
                `;
            let vertices = new Float32Array(
                [
                    -1.0,1.0,0,
                    1.0,1.0,1,
                    -1.0,-1.0,2
                ]
            );
            let indexs = new Uint16Array([0,1,2]);
            let color = new Float32Array([
                1,0,0,1,
                0,1,0,1,
                0,0,1,0.5
            ])
            let v = context3D.createVertexBuffer(vertices,3);
            v.data.regVariable(VA.pos,0,2);
            v.data.regVariable("index",2,1);

            
            let i = context3D.createIndexBuffer(indexs);
            let p = context3D.createProgram(vertexCode,fragmentCode);
            context3D.setProgram(p);
            
            context3D.setProgramConstantsFromVector("color",color,4);
            v.uploadContext(p);
            context3D.drawTriangles(i,indexs.length / 3);
        }



        public loadImage():void{
            loadRes("assets/ranger.png",this.renderImage,this,ResType.image);
        }

        protected renderImage(event:EventX):void{
            if(event.type != EventT.COMPLETE){
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
                    image.width,0,1.0,0.0,
                    image.width,image.height,1.0,1.0,
                    0,image.height,0.0,1.0
                ]
            );
            let indexs = new Uint16Array([0,1,3,1,2,3]);
            let v = context3D.createVertexBuffer(vertices,4);
            v.data.regVariable(VA.pos,0,2);
            v.data.regVariable(VA.uv,2,2);
            let i = context3D.createIndexBuffer(indexs);
            let p = context3D.createProgram(vertexCode,fragmentCode);
            context3D.setProgram(p);
            let matrix = newMatrix3D();
            matrix.m3_translation(200,100,0);
            matrix.m3_append(ROOT.camera2D.worldTranform);
            context3D.setProgramConstantsFromMatrix(VC.mvp,matrix)
            let t = context3D.createTexture("test",image);
            t.pixels = image;//bitmapdata.canvas;
            t.uploadContext(p,0,FS.diff);
            v.uploadContext(p);
            context3D.drawTriangles(i,indexs.length / 3);
        }


        public resize(width:number,height:number):void{
           
        }


    }
}