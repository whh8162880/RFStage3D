/**
 * 加载一张图片，并作为贴图渲染出来
 * 1. 用底层接口loadRes（）去加载一张图片
 * 2. 获取一个 HTMLImageElement对象，这个对象里包含了加载的数据
 * 3. init()--->初始化顶点数据，glsl程序代码初始化，
 * 4. 开始渲染贴图
 *     renderByWebGl()----->运用webGl接口
 *     renderNow()----->运用当前框架实现
 * 
 * 解释文档 think/dc_texture.md
 * @author yjn
 */

 module rf{
     export class Dc_Texture{

        private vertexData:Float32Array;
        private indexData:Uint16Array;


        private vertexInfo:VertexInfo;
        private vertexCode:string;
        private fragmentCode:string;

        private _url:string = "http://shushanh5.com/web/data/zhcn/o/server/logo.png";
        private image:HTMLImageElement;
         constructor(){
            loadRes(this._url,this.onComplete,this,ResType.image,LoadPriority.low,false);
         }

         private onComplete(e:EventX)
         {
            if(e.type != EventT.COMPLETE)
            {
                return;
            }

            var res:ResItem = e.data;
            this.image = res.data;
            if(!this.image)
            {
                return;
            }

      
           //使用现在自研的引起引擎来绘制一张图片
            this.init();
            
            // this.renderNow();
            this.render3();
           //使用webgl接口来绘制一张图片
            // this.renderWebGL();
         }


         private init(){
             //定点信息
            this.vertexCode = 
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
            this.fragmentCode = `
                precision mediump float;
                uniform sampler2D diff;
                varying vec2 v_TexCoord;
                void main(void){
                    gl_FragColor = texture2D(diff, v_TexCoord);
                }
            `;

            var w = this.image.width;
            var h = this.image.height;
            this.vertexData = new Float32Array(
                [
                    0,0,0.0,0.0,
                    w,0,1.0,0.0,
                    w,h,1.0,1.0,
                    0,h,0.0,1.0
                ]
            );
            this.indexData = new Uint16Array([0,1,3,1,2,3]);


            //这个VertexInfo以后可以是一个配置数据
            let info = new VertexInfo(this.vertexData,4);
            info.regVariable(VA.pos,0,2);
            info.regVariable(VA.uv,2,2);
            this.vertexInfo = info;



         }

        //使用webgl接口来绘制一张图片
         private renderWebGL(){
             //init shader
            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

            gl.shaderSource(vertexShader,this.vertexCode);
            gl.shaderSource(fragmentShader,this.fragmentCode);
            gl.compileShader(vertexShader);
            gl.compileShader(fragmentShader);


            var program = gl.createProgram();
            gl.attachShader(program,vertexShader);
            gl.attachShader(program,fragmentShader);
            gl.linkProgram(program);
            gl.useProgram(program);

            //init vertex
            var vertexbuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER,vertexbuffer);
            gl.bufferData(gl.ARRAY_BUFFER,this.vertexData,gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER,null);

            var indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,this.indexData,gl.STATIC_DRAW);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);

            //texture
            var tex:WebGLTexture = gl.createTexture();

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D,tex);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,this.image);
            var uniformTexture:WebGLUniformLocation = gl.getUniformLocation(program, "diff");  
            gl.uniform1i(uniformTexture,0);


            //绑定并上传数据
            gl.bindBuffer(gl.ARRAY_BUFFER,vertexbuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
            gl.useProgram(program);


             //运行一个程序需要输入输出，输入是GLSL vertex shader 代码里的vec4 a_Position
            var a_Position:number = gl.getAttribLocation(program, "pos");
            var uv:number = gl.getAttribLocation(program,"uv");
            gl.enableVertexAttribArray(a_Position);//启用v3PositionIndex  
            gl.enableVertexAttribArray(uv);

            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4 * 4, 0);
            gl.vertexAttribPointer(uv,2,gl.FLOAT,false, 4 * 4, 4* 2);

            //设置mvp矩阵
            var  matrix:Float32Array = new Float32Array(
                [
                    2/stageWidth,	0,				                0,				0,
					0,		-2/stageHeight,                         0,			    0,
					0,		0,				                1,				0,
					-1.0,	1.0,			                1,		    1
                ]
            )
            var _world:WebGLUniformLocation = gl.getUniformLocation(program,"mvp");
            gl.uniformMatrix4fv(_world,false,matrix);
          
            //draw
            gl.clearColor(0,0,0,1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0);     

         }

         //使用现在自研的引起引擎来绘制一张图片
         private renderNow(){
            // context3D.configureBackBuffer(stageWidth,stageHeight,0);
            context3D.clear(1,1,1,1);

            //init shader
            var program = context3D.createProgram(this.vertexCode,this.fragmentCode);
            context3D.setProgram(program);
              //init vertex
            var vertexBuffer = context3D.createVertexBuffer(this.vertexData,4);
            var indexBuffer = context3D.createIndexBuffer(this.indexData);

            vertexBuffer.data.regVariable(VA.pos,0,2);
            vertexBuffer.data.regVariable(VA.uv,2,2);
            vertexBuffer.uploadContext(program);


            
            //贴图
            var texture = context3D.createTexture(this._url,this.image);
            texture.pixels = this.image;

            //上传贴图数据
            texture.uploadContext(program,0,FS.diff);

            //mvp
            ROOT.camera2D.updateSceneTransform();

            let matrix = newMatrix3D();
            matrix.m3_append(ROOT.camera2D.worldTranform);
            context3D.setProgramConstantsFromMatrix(VC.mvp,matrix);

            //draw
            context3D.drawTriangles(indexBuffer,this.indexData.length / 3);
         }


         private render3(){
            let camera = ROOT.camera2D;
            if(camera.states & DChange.trasnform) camera.updateSceneTransform();  //更新下摄像机
            let c = context3D;
            let v = c.createVertexBuffer(this.vertexInfo);  //创建顶点数据
            let i = c.getIndexByQuad(1);                    //创建索引数据
            let t = c.createTexture(this._url,this.image);  //创建贴图
            let p = c.createProgram(this.vertexCode,this.fragmentCode); //创建shader
            c.clear(1,1,1,1);       //清屏
            c.setProgram(p);        //激活shader
            t.uploadContext(p,0,FS.diff);   //上传贴图纹理
            v.uploadContext(p);             //上传顶点数据
            c.setProgramConstantsFromMatrix(VC.mvp,camera.worldTranform);   //上传mvp信息
            c.drawTriangles(i,2);             //绘制
         }


     }
 }