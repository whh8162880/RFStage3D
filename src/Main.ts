/// <reference path="./AppBase.ts" />
/// <reference path="./com/module/rfreference.ts" />
module rf{
    // export let sp;

    // export var line;
    export class Main extends AppBase{
        constructor(){      
            super();
        }


        public init(canvas?:HTMLCanvasElement):void{
            super.init(canvas);

            if(undefined == gl){
                return;
            }

            let perfix = "../assets/"
            
            ROOT_PERFIX = perfix;

            // var matrix = new Matrix3D([-1.0938435201278621e-8,-0.968181073665619,-0.2502503693103784,0,-1.4972529544683223e-8,-0.2502503567352837,0.9681810250144678,0,-0.9999999403953552,1.4337268631142944e-8,-1.1758774204986801e-8,0,6.187005396895984e-8,1.6862283945083618,-0.09339626878499985,1]);
            // var vs = matrix.decompose();
            // matrix.invert();

            // let amfEncode = new AMF3Encode();
            // let amfDecode = new AMF3();
            // amfEncode.writeObject(1000);
            // let b = amfEncode.toUint8Array().buffer;
            // amfDecode.setArrayBuffer(b);
            // let re = amfDecode.readObject();
            
            // gl.enable(gl.DEPTH_TEST);  
            // gl.depthMask(true);
            // gl.depthFunc(gl.LEQUAL);
            // context3D.setDepthTest(true,gl.LEQUAL)

            let camera = ROOT.camera3D;
            scene.camera = camera;
            let f = camera.originFar;
            f = Math.sqrt(f*f / 3);
            camera.setPos(f,f,f);
            camera.lookat(newVector3D(0,0,0));
            new TrackballControls(camera);


            let sun = new DirectionalLight();
            // f = 1000 / Math.PI2;
            // f = Math.sqrt(f*f / 3);
            sun.setPos(200,800,200);
            let v = TEMP_VECTOR3D;
            v[0] = v[1] = v[2] = 0;
            sun.lookat(v);
            scene.sun = sun;
            
            var g:Graphics;
            
           

            // let f = Math.sin(45 * DEGREES_TO_RADIANS) * camera.originFar / 2;
            
            // let{x,y,z} = camera;
            // let cos = Math.cos(45 * DEGREES_TO_RADIANS);
            // let sin = Math.sin(45 * DEGREES_TO_RADIANS);
            // x = f * sin * cos;
            // y = f * sin * sin;
            // z = f * cos;
            // camera.setPos(f * sin * cos,f * sin * sin,f * cos);
           

            // camera.z = f
            // camera.y = f;
           

            let w = 500;
/*
            let t = 2;
            let tr = new Trident(w,t);
            scene.addChild(tr);

            sp = tr;
*/
            

            // line.rotationX = 45;
            // let line = new Line3D();
            // line.clear();
            // line.moveTo(-500,0,500,t);
            // line.lineTo(500,0,500,t);
            // line.lineTo(500,0,-500,t);
            // line.lineTo(-500,0,-500,t);
            // line.lineTo(-500,0,500,t);
            // line.end();
            // scene.addChild(line);

            let variables = vertex_mesh_variable;
            let w_e = w * 1.1
            let m = new PhongMaterial();
            m.setData(undefined);
            m.cull = WebGLConst.BACK;
            // let geo = new BoxGeometry(variables).create(w,w,w)

            let r = 40;

            m.diffTex = context3D.getTextureData("../assets/mesh/a10010m/diff.png");
            m.diff = newColor(0xAAAAAA);
            let plane = new PlaneGeometry(variables).create(w*2,w*2);
            let mesh = new Mesh(variables);
            mesh.shadowTarget = true;
            // mesh.shadowable = true;
            mesh.rotationX = -90;
            mesh.geometry = plane;
            mesh.material = m;
            // scene.addChild(mesh);


            
            let box = new SkyBoxGeometry(variables).create();
            
            mesh = new Mesh(variables);
            mesh.geometry = box;
            
            let msky = new SkyBoxMaterial();
            msky.setData(undefined);
            msky.cull = WebGLConst.NONE;
            msky.diff = newColor(0xAA0000);
            msky.diffTex = context3D.getTextureData("../assets/tex/skybox/");

            mesh.material = msky;
            scene.addChild(mesh);






            // plane = new PlaneGeometry(variables).create(w*2,w);
            // mesh = new Mesh(variables);
            // mesh.init(plane,m);
            // mesh.setPos(w+80,0,0);
            // scene.addChild(mesh);
/*
  
            let sphere = new SphereGeometry(variables).create(r,r,50);
            mesh = new Mesh(variables);
            mesh.shadowable = true;
            // mesh.shadowTarget = true;
            mesh.geometry = sphere;
            mesh.material = new PhongMaterial();
            mesh.material.setData(undefined);
            mesh.material.diff = newColor(0xAAAAAA);
            mesh.setPos(0,0,0);
            // scene.addChild(mesh);
*/

            // let torus = new TorusGeomerty(variables).create(r,r,w*.1375,w*.375);
            // mesh = new Mesh(variables);
            // mesh.init(torus,m);
            // mesh.setPos(0,70,0);
            // scene.addChild(mesh);

            let kfmurl
            // kfmurl = "../assets/mesh/f1/";
            kfmurl = perfix + "mesh/f3/";
            // kfmurl = "../assets/mesh/a10010m/";

/*
            let kfmMesh = new KFMMesh(new PhongMaterial());
            kfmMesh.setSca(100,100,100);
            kfmMesh.shadowable = true;
            // kfmMesh.shadowTarget = true;
            // kfmMesh.load("../assets/mesh/a10010m/");
            // kfmMesh.load("http://192.168.3.214/webgl/ss/mesh/a01100nan/")
            kfmMesh.load(kfmurl);
            // kfmMesh.load("../assets/mesh/f3/");
            scene.addChild(kfmMesh);
*/
            // kfmMesh = new KFMMesh(new PhongMaterial());
            // kfmMesh.setSca(100,100,100);
            // kfmMesh.shadowable = true;
            // kfmMesh.load("../assets/mesh/a10010m/");
            // kfmMesh.setPos(100,0,0);
            // scene.addChild(kfmMesh);
            // kfmMesh = new KFMMesh(new PhongMaterial());
            // kfmMesh.setSca(100,100,100);
            // kfmMesh.setPos(-200,0,0);
            // kfmMesh.load("../assets/mesh/f1/");
            // scene.addChild(kfmMesh);

            // kfmMesh = new KFMMesh(new PhongMaterial());
            // kfmMesh.setSca(100,100,100);
            // kfmMesh.setPos(200,0,0);
            // kfmMesh.load("../assets/mesh/f1/");
            // scene.addChild(kfmMesh);

            // kfmMesh = new KFMMesh(new PhongMaterial());
            // kfmMesh.setSca(100,100,100);
            // kfmMesh.setPos(0,0,300);
            // kfmMesh.rotationY = 180;
            // kfmMesh.load("../assets/mesh/f1/");
            // scene.addChild(kfmMesh);

            // mesh = kfmMesh;

            // var gui = new dat.GUI();
            // var folder = gui.addFolder("mesh");
            // // folder.add(mesh,"refreshGUI");
            // var posFolder = folder.addFolder("position");
            // posFolder.add(mesh,"y",-200,200).step(0.01);

            // var sunFolder = gui.addFolder("sun");
            // sunFolder.add(sun,"x",0,1000);
            // sunFolder.add(sun,"y",0,1000);
            // sunFolder.add(sun,"z",0,1000);
            // posFolder.add(kfmMesh,"z",-1000,1000).step(0.01);
            // var rotFolder = folder.addFolder("rotation");
            // rotFolder.add(kfmMesh,"rotationX",-360,360);
            // rotFolder.add(kfmMesh,"rotationY",-360,360);
            // rotFolder.add(kfmMesh,"rotationZ",-360,360);


            let profile = singleton(GUIProfile);
            // ROOT.addChild(profile);


            

            // sp = new Sprite();
            // sp.setPos(100,100,0);
            // tipContainer.addChild(sp);
            // g = sp.graphics;
            // g.clear();
            // g.drawRect(0,0,100,100,0xFFFFFF);
            // g.end();
/*
            let image = new Image();
            image.renderer = new BatchRenderer(image);
            image.mouseEnabled = true;
            g = image.graphics;
            g.clear;
            g.drawRect(0,0,100,100,0xFF0000);
            g.drawRect(100,0,100,100,0xFFFF00);
            g.drawRect(200,0,100,100,0x00FFFF);
            g.drawRect(300,0,100,100,0x0000FF);

            // g.drawRect(0,100,100,100,0xFFFF00);
            // g.drawRect(0,200,100,100,0x00FFFF);
            // g.drawRect(0,300,100,100,0x0000FF);

            // g.drawRect(100,100,100,100,0x00FFFF);
            // g.drawRect(100,200,100,100,0x0000FF);
            // g.drawRect(100,300,100,100,0xFFFF00);

            // g.drawRect(200,100,100,100,0xFFFF00);
            // g.drawRect(200,200,100,100,0x00FFFF);
            // g.drawRect(200,300,100,100,0x0000FF);

            // g.drawRect(300,100,100,100,0x0000FF);
            // g.drawRect(300,200,100,100,0xFFFF00);
            // g.drawRect(300,300,100,100,0x00FF00);

            g.end();
            image.setPos(100,100,0);
            // image.load(perfix + "mesh/f3/f3.png");
            ROOT.addChild(image);

            let sroll = new Scroll(image,100,100);
            sroll.vStep = 0;
            sroll.hStep = 100;


            let sp = new Sprite();
            // sp.renderer = new BatchRenderer(sp);
            sp.setPos(200,200,0);
            g = sp.graphics;
            g.clear();
            g.drawRect(0,0,100,100,0xFFFFFF);
            g.end();
            ROOT.addChild(sp);

            let drager = new Drager().bind(sp,true).setArea(100,100,stageWidth,stageHeight);
            drager.vStep = 1;
            drager.hStep = 0;
            drager.areacheck = true;

*/

            for(let i = 1;i<2;i++){
                let list = new List(ROOT.source,TestListItemRender,100,20);
                list.setPos(i * 110,100);
                list.setSize(100,10*20);
                list.scroll.vStep = 20;
                // list.displayList(new Array(100));
                // ROOT.addChild(list);
            }


            

            facade.toggleMediator(TestMediator,1);
            

            // particle_Perfix = "http://192.168.3.214/webgl/ss/particle/";
            // particle_Texture_Perfix = "http://192.168.3.214/webgl/ss/tex/particle/";
            // particle_Perfix = "assets/particle/";
            // particle_Texture_Perfix = "assets/tex/particle/";
            // let particle = new Particle();
            // particle.setSca(100,100,100);
            // particle.load("a");
            // scene.addChild(particle);


            // new AMF3Test().load("assets/test.dat");

            // let geo = new TorusGeomerty(variables).create(r,r,w*.1375,w*.375);
            // let geo = new SphereGeometry(variables).create(r,r,w*.5);
            // let geo = new BoxGeometry(variables).create(w,w,w);
            // let geo = new PlaneGeometry(variables).create(w,w);

            // let qc = 10;
            // let count = qc*qc;
            // let tx = -(qc-1)/2 * w_e;
            // let ty = -(qc-1)/2 * w_e;

            // for(let i=0;i<count;i++){
            //     let c =Math.floor(i / qc);
            //     let p = i % qc;
            //     let mesh = new Mesh(variables);
            //     mesh.init(geo,m);
            //     mesh.setPos(tx + p * w_e,ty + c * w_e,0);
            //     scene.addChild(mesh);
            // }

            
            
            // mesh.rotationX = -90;
            


            // let m  = new Matrix3D();
            // m.appendRotation(45,Vector3D.Z_AXIS);
            // m.appendTranslation(100,100,100);
            // m.invert();
            // m.invert();

           

            // let s = new Sprite();
            // s.renderer = new BatchRenderer(s);
            // g = s.graphics;
            // g.clear();
            // g.drawCube(-100,-100,-100,200,200,200,0xFFFFFF);
            // g.end();
            // s.rotationX = 45
            // ROOT.addChild(s);
            

            

            // var m:Matrix3D = new Matrix3D();
            // m.appendRotation(90,Vector3D.X_AXIS);
            // m.appendRotation(90,Vector3D.Y_AXIS);
            // m.appendRotation(90,Vector3D.Z_AXIS);
            // let c = m.toString();




            // let icon = new IconView();
            // icon.x = 0;
            // icon.y = 0;
            // icon.resetSize(100,100);
            // ROOT.addChild(icon);
            // icon.setUrl("assets/ranger.png");

            // let profile = singleton(GUIProfile);
            // ROOT.addChild(profile);

            // line = new Trident(200,4);
            // ROOT.addChild(line);

            // ROOT.camera2D.z = -1.5

            // let s = new Sprite();
            // s.renderer = new BatchRenderer(s);
            // s.x = 100;
            // g = s.graphics;
            // g.clear();
            // g.drawRect(0,0,100,100,0xFF0000)
            // g.end();
            // s.setPos(100,100,0)
            // ROOT.addChild(s);

            
           

            //p3d加载并显示

            // let span = document.getElementById("fps");

            // var t = new TextField();
            // t.init();
            // t.format.size = 30;
            // t.format.init();
            // t.y = 40;
            // ROOT.addChild(t);

            // Engine.dispatcher.addEventListener(EngineEvent.FPS_CHANGE,function (){
            //     let str = `pixelRatio:${pixelRatio} fps:${Engine.fps} code:${Engine.code.toFixed(2)}`
            //     span.innerHTML = str;
            //     t.text = str;
            // });
            


            // let bmd = componentSource.bmd.canvas;
            // let style = bmd.style;
            // style.position="fixed";
            // style.left = "500px";
            // style.top = "0px";
            // document.body.appendChild(bmd);
            // canvas.id = "component";

            // let div = document.getElementById("game");
            // div.appendChild(bmd);
            // canvas.style="position:absolutly;left:100px;top:100px";
            // 


            // let bw = 100;
            // let ba = 1;
            // let bb = 1;
            // let bitmapData = new BitmapData(bw,bw,true,0xFFFFFFFF);
            // bitmapData.fillRect(0,0,ba,bb,"rgba(255,255,255,255)")
            // context3D.createTexture("test",bitmapData);
            // document.body.appendChild(bitmapData.canvas);
            
            
            // for(let i = 0;i<1;i++){
            //     sp = new Sprite();
            //     sp.x = Math.random() * stageWidth;
            //     sp.y = Math.random() * stageHeight;
            //     sp.alpha = Math.random() * 0.3 + 0.2;
            //     g = sp.graphics;
            //     g.clear();
            //     g.drawRect(0,0,100,100,0xFFDD00);
            //     g.end();
            //     ROOT.addChild(sp);
            // }

            // g = ROOT.graphics;
            // g.clear();
            // g.drawRect(0,0,500,500,0xFF0000);
            // g.end();

            

            // Engine.removeTick(this);
            // ROOT.update(10,10);

            // this.bitmapDataTest();
            // new MaxRectsBinPackTest();
            // new WebglTest();
            // new MaxRectsTest();
            // new Dc_Texture();

            // let _image:Image = new Image();
            // _image.load("assets/ranger.png");
            // ROOT.addChild(_image);

            

            
            // t.html = true;
            // t.x = 10;
            // t.y = 10;
            // let format = t.format;
            // format.oy = 0;
            // t.w = 200;
            // t.wordWrap = true;

            // t.format = new TextFormat();
            // t.format.size = 30;
            // t.format.oy = 3;
            // t.format.italic = "italic";
            // t.format.bold = "bold";
            // t.format.gradient = [{color: 0xffff00}];
            // t.format.gradient = [{color: 0xff0000, percent: 0}, {color: 0x00ff00, percent: 1}];
            // t.format.stroke = {size: 2, color: 0x556600};
            // t.format.shadow = {color: 0xffffff, blur: 4, offsetX: 10, offsetY: 10};
            // t.format.init();

            // t.text = "<font color='#FF0000'>你好</font>啊\n这是<font size='20'>一个<font color='#00FF00'>HTMLTEXT</font></font>";
            // t.text = "你好啊\n这是一个HTMLTEXT";
            
            // ROOT.addChild(t);

            // format.size = 12;
            // format.init();

            // t.text = "FPS:60";
            // t.text = "fps:60";
            // t.text = "abc";
            // Engine.dispatcher.addEventListener(EngineEvent.FPS_CHANGE,function (){
            //     t.text =`fps:${Engine.fps}\ncode:${Engine.code.toFixed(2)}`
            // });


            // let icon = new IconView();
            // icon.x = 100;
            // icon.y = 100;
            // icon.resetSize(100,100);
            // ROOT.addChild(icon);
            // icon.setUrl("assets/ranger.png");

            // let panel = new Panelui();
            // panel.x = 300;
            // panel.y = 300;
            // ROOT.addChild(panel);
            // let panelutil = new PanelUtils();


            // 潘华专用  
            new Pan_Test();
        }


        onTest():void{

        }

        // public linktest():void{
        //     let vo = recyclable(Link);
        //     vo.add(1);
        //     vo.add(2);
        //     vo.add(3);
        //     console.log(vo.toString());
        //     vo.remove(2);
        //     console.log(vo.toString());
        //     vo.pop();
        //     console.log(vo.toString());
        //     vo.add(4);
        //     vo.addByWeight(5,3);
        //     vo.addByWeight(6,4);
        //     console.log(vo.toString());
        //     vo.recycle();
        // }

        // public engineTest():void{
        //     // Engine.addTick(this);
        // }

        // public callLaterTest():void{
        //     function sayHello(msg:string,age:number):void{
        //         console.log(msg+","+age);
        //     }
        //     function sayHello2():void{
        //         console.log("hello2");
        //     }
        //     // TimerUtil.add(sayHello,2000,"hello",12);
        //     // TimerUtil.add(sayHello2,1000);
        //     // TimerUtil.remove(sayHello2);
        //     TimerUtil.time500.add(sayHello2);
        // }


        // public netTest(): void {

        //     {
        //         let http = recyclable(HttpRequest);
        //         http.responseType = HttpResponseType.TEXT;
        //         http.addEventListener(EventT.PROGRESS, (e: EventX) => {
        //             console.log("PROGRESS " + e.data);
        //         }, this);
        //         http.addEventListener(EventT.COMPLETE, (e: EventX) => {
        //             console.log("COMPLETE " + http.response);
        //             http.recycle();
        //         }, this);
        //         http.addEventListener(EventT.IO_ERROR, (e: EventX) => {
        //             console.log("IO_ERROR " + e.data);
        //             http.recycle();
        //         }, this);
        //         http.open("http://shushanh5.com/web/config/zhcn/trunk/gonggao.js", HttpMethod.GET);
        //         http.send();
        //     }

        //     {
        //         let http = recyclable(HttpRequest);
        //         http.responseType = HttpResponseType.ARRAY_BUFFER;
        //         http.addEventListener(EventT.PROGRESS, (e: EventX) => {
        //             console.log("PROGRESS " + e.data);
        //         }, this);
        //         http.addEventListener(EventT.COMPLETE, (e: EventX) => {
        //             let bytes = new ByteArray(http.response);
        //             console.log("COMPLETE " + bytes.length + " " + bytes.readInt());
        //             http.recycle();
        //         }, this);
        //         http.addEventListener(EventT.IO_ERROR, (e: EventX) => {
        //             console.log("IO_ERROR " + e.data);
        //             http.recycle();
        //         }, this);
        //         http.open("http://shushanh5.com/web/data/zhcn/n/w/BW001/d.json", HttpMethod.GET);
        //         http.send();
        //     }

        //     {
        //         let loader = recyclable(ImageLoader);
        //         loader.crossOrigin = "anonymous";
        //         loader.addEventListener(EventT.COMPLETE, (e: EventX) => {
        //             console.log("Image COMPLETE " + loader.data);
        //             loader.recycle();
        //         }, this);
        //         loader.addEventListener(EventT.IO_ERROR, (e: EventX) => {
        //             console.log("Image IO_ERROR " + e.data);
        //             loader.recycle();
        //         }, this);
        //         loader.load("http://shushanh5.com/web/data/zhcn/n/a/B001/i3.png");
        //     }

        //     {
        //         let socket = new Socket();
        //         socket.addEventListener(EventT.OPEN, (e: EventX) => {
        //             console.log("socket open!");
        //         }, this);
        //         socket.addEventListener(EventT.MESSAGE, (e: EventX) => {
        //             console.log("服务器返回的数据: " + socket.input.bytesAvailable);
        //             console.log("具体的数据: " + socket.input.readUTFBytes(socket.input.bytesAvailable));
        //         }, this);
        //         socket.addEventListener(EventT.CLOSE, (e: EventX) => {
        //             console.log("socket close");
        //         }, this);
        //         socket.addEventListener(EventT.ERROR, (e: EventX) => {
        //             console.log("socket error! " + e.data);
        //         }, this);
        //         socket.connect("121.40.165.18", 8088);

        //         setTimeout(() => {
        //             console.log("发送：ss");
        //             socket.send("ss");

        //             setTimeout(() => {
        //                 console.log("发送：你好!");
        //                 socket.output.writeUTFBytes("你好!");
        //                 socket.flush();

        //                 console.log("发送：hello!");
        //                 socket.send("hello!");
        //             }, 1000);

        //         }, 1000);
        //     }

        // }

        // public bitmapDataTest():void{
        //     let b = new BitmapData(512,512,false,0);
        //     let canvas = b.canvas;
        //     document.body.appendChild(canvas);

        // }

        // private resTest() {

        //     function onComplete(event: EventX) {
                
        //         if (event.type == EventT.COMPLETE) {
        //             console.log("加载完毕: " + event.type);

        //             let type = event.data.type;
        //             let url = event.data.url;
        //             let data = event.data.data;
        //             if (type == ResType.text) {
        //                 console.log(`文本加载成功 url: ${url} data: ${data}`);
        //             } else if (type == ResType.bin) {
        //                 console.log(`二进制加载成功 url: ${url} data: ${(data as ByteArray).bytesAvailable}`);
        //             } else if (type == ResType.image) {
        //                 console.log(`图片加载成功 url: ${url} data: ${data}`);
        //             }
        //         } else {
        //             console.log("加载失败: " + event.type + ", " + event.data.url);
        //         }

        //     }

        //     Res.instance.maxLoader = 1;

        //     Res.instance.load([
        //         // "http://shushanh5.com/web/config/zhcn/trunk/gonggao.js",
        //         "http://shushanh5.com/web/config/zhcn/trunk/errorcode.js",
        //     ], onComplete, this, ResType.text, LoadPriority.low);

        //     Res.instance.load([
        //         "http://shushanh5.com/web/data/zhcn/n/w/BW001/d.json",
        //         "http://shushanh5.com/web/data/zhcn/n/a/B001/d.json",
        //     ], onComplete, this, ResType.bin, LoadPriority.middle);

        //     Res.instance.load([
        //         "http://shushanh5.com/web/data/zhcn/n/a/B001/i3.png",
        //         "http://shushanh5.com/web/data/zhcn/o/server/logo.png",
        //         "http://shushanh5.com/web/data/zhcn/m/1/mini.jpg",
        //     ], onComplete, this, ResType.image, LoadPriority.high);

        //     setTimeout(() => {
        //         console.log(Res.instance["_resMap"]);

        //         Res.instance.load([
        //             "http://shushanh5.com/web/config/zhcn/trunk/gonggao.js",
        //             "http://shushanh5.com/web/config/zhcn/trunk/gonggao.js",
        //             "http://shushanh5.com/web/config/zhcn/trunk/gonggao.js",
        //         ], onComplete, this, ResType.text, LoadPriority.low);

        //     }, 3000);

        // }


        // public arrayTest(value:number):void{
        //     var array:Uint8Array = new Uint8Array(value);
        //     var data:DataView = new DataView(array.buffer);

        //     var n:number = getTimer();
        //     var temp:Uint8Array = new Uint8Array(value);
        //     array.set(temp);
        //     console.log("array.set::"+(getTimer() - n));
            
        //     n = getTimer();
        //     for(var i:number = 0;i<value;i++){
        //         data.setUint8(i,array[i]);
        //     }
        //     console.log("DataView.set::"+(getTimer() - n));
        // }

        // public caleTest(value:number):void{
        //     var temp:number = 0;
        //     var n:number = getTimer();
        //     for(var i:number = 0;i<value;i++){
        //         temp = temp+1;
        //     }
        //     console.log("time::"+(getTimer() - n));
        // }

        // public functionTest(value:number):void{
        //     var temp:number = 0;
        //     function test():void{var a=0;a=a+1};

        //     var n:number = getTimer();
        //     for(var i:number = 0;i<value;i++){
        //         test();
        //     }
        //     console.log("time::"+(getTimer() - n));
        // }
    }
}