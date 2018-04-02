 加载并渲染一张贴图
 1. 设置画布
    context3D.configureBackBuffer(stageWidth,stageHeight,0);

    webGL具体实现：
        gl.vieport(0,0,width,heght);
        g.enable(g.DEPTH_TEST);
        g.enable(g.STENCIL_TEST);

2. 设置深度测试
    context3D.setDepthTest(false,gl.ALWAYS);

    webGL具体实现：
        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(depthMask);
        gl.depthFunc(passCompareMode);

3. 设置blend模式
    context3D.setBlendFactors(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

    webGL具体实现：
        gl.enable(gl.BLEND); //stage3d cant disable blend?www
        gl.blendFunc(sourceFactor, destinationFactor);

4. 加载一张图片
    loadRes("assets/ranger.png",this.renderImage,this,ResType.image);
    --->renderImage//加载完成后调用方法
    --->ResType.image //加载类型
    --->得到一个HTMLImageElement对象//texture数据

5. 开始渲染
5.1 清空画布
    context3D.clear(0,0,0,1);

5.2 设置glgs代码
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

5.3 设置顶点数据
    //顶点数据
    let vertices = new Float32Array(
    [
        0,0,0.0,0.0,
        image.width,0,1.0,0.0,
        image.width,image.height,1.0,1.0,
        0,image.height,0.0,1.0
    ]
    );
    //顶点索引
    let indexs = new Uint16Array([0,1，3,1,2,3]);

    //创建定点数据WebGLBuffer对象，并将数据绑定到WebGLbuffer
    let v = context3D.createVertexBuffer(vertices,4);
    //创建定点索引WebGLBuffer对象，并将数据绑定到WebGLbuffer
    let i = context3D.createIndexBuffer(indexs);
    //创建WebGLProgram对象，将glgs代码与WebGLProgram关联起来
    let p = context3D.createProgram(vertexCode,fragmentCode);
    //使用当前program
    context3D.setProgram(p);

    webGL具体实现：
        //顶点索引
        //context3D.createVertexBuffer(vertices,4)语句------>具体实现
        vertexbuffer = gl.createBuffer();
        gl.bindBuffer(g.ARRAY_BUFFER, vertexbuffer);
        gl.bufferData(g.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.bindBuffer(g.ARRAY_BUFFER, null);

        
        //context3D.createIndexBuffer(indexs)语句-------->具体实现
        indexbuffer = gl.createBuffer();
        gl.bindBuffer(g.ELEMENT_ARRAY_BUFFER, indexbuffer);
        gl.bufferData(g.ELEMENT_ARRAY_BUFFER, indexs, gl.STATIC_DRAW);
        gl.bindBuffer(g.ELEMENT_ARRAY_BUFFER, null);

        //context3D.createProgram(vertexCode,fragmentCode)语句------->具体实现
        vShader = createShader(vertexCode,gl.VERTEX_SHADER);
        fShader = createShader(fragmentCode,gl.FRAGMENT_SHADER);
        program = gl.createProgram();

        gl.attachShader(this.program, this.vShader);
        gl.attachShader(this.program, this.fShader);
        gl.linkProgram(this.program);/

5.4 设置坐标（MVP实现）
    let matrix = new Matrix3D();
    matrix.appendTranslation(200,100,0);
    matrix.append(ROOT.camera2D.worldTranform);
    context3D.setProgramConstantsFromMatrix(VC.mvp,matrix)

    webGL具体实现：
        创建一个 Matrix对象，并设置参数，
        //context3D.setProgramConstantsFromMatrix(VC.mvp,matrix)语句------->具体实现
        var index: WebGLUniformLocation = gl.getUniformLocation(program, VC.mvp);//找到glsl中mvp的位置
        gl.uniformMatrix4fv(index, false, matrix.rawData);//更新glsl中的数据
	

5.5 设置贴图
    let t = context3D.createTexture("test",image);
    t.pixels = image;//bitmapdata.canvas;
    t.uploadContext(p,0,FS.diff);

    webGL具体实现:
        texture= gl.createTexture();------>创建贴图对象
        gl.bindTexture(gl.TEXTURE_2D, texture);--->绑定贴图类型

        //设置纹理参数
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, g.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE); //UV（ST）坐标
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,data); //生成2d贴图
        gl.bindTexture(gl.TEXTURE_2D, null);

        //t.uploadContext(p,0,FS.diff)语句----->具体实现
        gl.activeTexture(gl["TEXTURE"+index]);//激活指定纹理
        gl.bindTexture(gl.TEXTURE_2D, this.texture);//绑定改纹理
        var index_tex = gl.getUniformLocation(program, FS.diff);//找到glsl中diff的位置
        gl.uniform1i(index_tex, index);//更新glsl数据

5.6 渲染最终画面
    v.data.regVariable(VA.pos,0,2);
    v.data.regVariable(VA.uv,2,2);//告诉定点的key和在顶点数据中的位置偏移以及长度
    v.uploadContext(p);//上传attribute数据，此数据在regVariable中定义了
    context3D.drawTriangles(i);//渲染
    
    webGL具体实现：
        //v.uploadContext(p)语句----->
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexbuffer);//使用当前buffer
        var loc = gl.getAttribLocation(program.program, "变量名");//找到glsl中变量的位置
        gl.vertexAttribPointer(loc, o.size, gl.FLOAT, false, this.data32PerVertex * 4, o.offset * 4);//告诉显卡要读取指定顶点
        gl.enableVertexAttribArray(loc);//开启index指定的attribute变量，使用该变量
        //context3D.drawTriangles(i);语句----->
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);//使用订点数据索引
        gl.drawElements(gl.TRIANGLES, numTriangles < 0 ? indexBuffer.numIndices : numTriangles * 3, gl.UNSIGNED_SHORT, firstIndex * 2);//根据数据画出图像


常见问题
1. canvas是禁止跨域的，如果图像来自其他域，调用toDataURL()会抛出一个错误
解决：<img>标签通过引入 crossorigin 属性能解决跨域， 即crossOrigin="Anonymous" 或 crossOrigin="*"  请注意手q环境下设置 ‘Anonymous’不支持，需要设置为 '*'，如果使用 crossorigin="anonymous"，则相当于匿名 CORS

2. 设置了”crossOrigin”的<img>标签不能拉下跨域的图片，无法触发img.onload
解决: 后台转发或nigix代理,设置Access-Control-Allow-Origin：“wx.qlogo.cn”，允许静态资源服务器图片跨域这种设置 解决获取图片跨域的问题。