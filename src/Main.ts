/// <reference path="./com/youbt/rfreference.ts" />
module rf{
    export let sp;
    export class Main extends AppBase{
        constructor(){      
            super();
        }

        


        public init(canvas?:HTMLCanvasElement):void{
            super.init(canvas);

            if(undefined == gl){
                return;
            }

            var g:Graphics;
            

            let icon = new IconView();
            icon.x = 0;
            icon.y = 0;
            icon.resetSize(100,100);
            ROOT.addChild(icon);
            icon.setUrl("assets/ranger.png");

            let profile = singleton(GUIProfile);
            ROOT.addChild(profile);


            let line = new Line3D();
            line.clear();
            line.moveTo(0,0,0,1);
            line.lineTo(500,0,0,1);
            line.end();
            line.setPos(100,100,0)
            ROOT.addChild(line);

            // ROOT.camera2D.z = -1.5

            // let s = new Sprite();
            // g = s.graphics;
            // g.clear();
            // g.drawRect(0,0,100,1,0xFF0000)
            // g.end();
            // s.setPos(100,100,0)
            // ROOT.addChild(s);

            
           

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


           
        }

        public linktest():void{
            let vo = recyclable(Link);
            vo.add(1);
            vo.add(2);
            vo.add(3);
            console.log(vo.toString());
            vo.remove(2);
            console.log(vo.toString());
            vo.pop();
            console.log(vo.toString());
            vo.add(4);
            vo.addByWeight(5,3);
            vo.addByWeight(6,4);
            console.log(vo.toString());
            vo.recycle();
        }

        public engineTest():void{
            // Engine.addTick(this);
        }

        public callLaterTest():void{
            function sayHello(msg:string,age:number):void{
                console.log(msg+","+age);
            }
            function sayHello2():void{
                console.log("hello2");
            }
            // TimerUtil.add(sayHello,2000,"hello",12);
            // TimerUtil.add(sayHello2,1000);
            // TimerUtil.remove(sayHello2);
            TimerUtil.time500.add(sayHello2);
        }


        public netTest(): void {

            {
                let http = recyclable(HttpRequest);
                http.responseType = HttpResponseType.TEXT;
                http.addEventListener(EventT.PROGRESS, (e: EventX) => {
                    console.log("PROGRESS " + e.data);
                }, this);
                http.addEventListener(EventT.COMPLETE, (e: EventX) => {
                    console.log("COMPLETE " + http.response);
                    http.recycle();
                }, this);
                http.addEventListener(EventT.IO_ERROR, (e: EventX) => {
                    console.log("IO_ERROR " + e.data);
                    http.recycle();
                }, this);
                http.open("http://shushanh5.com/web/config/zhcn/trunk/gonggao.js", HttpMethod.GET);
                http.send();
            }

            {
                let http = recyclable(HttpRequest);
                http.responseType = HttpResponseType.ARRAY_BUFFER;
                http.addEventListener(EventT.PROGRESS, (e: EventX) => {
                    console.log("PROGRESS " + e.data);
                }, this);
                http.addEventListener(EventT.COMPLETE, (e: EventX) => {
                    let bytes = new ByteArray(http.response);
                    console.log("COMPLETE " + bytes.length + " " + bytes.readInt());
                    http.recycle();
                }, this);
                http.addEventListener(EventT.IO_ERROR, (e: EventX) => {
                    console.log("IO_ERROR " + e.data);
                    http.recycle();
                }, this);
                http.open("http://shushanh5.com/web/data/zhcn/n/w/BW001/d.json", HttpMethod.GET);
                http.send();
            }

            {
                let loader = recyclable(ImageLoader);
                loader.crossOrigin = "anonymous";
                loader.addEventListener(EventT.COMPLETE, (e: EventX) => {
                    console.log("Image COMPLETE " + loader.data);
                    loader.recycle();
                }, this);
                loader.addEventListener(EventT.IO_ERROR, (e: EventX) => {
                    console.log("Image IO_ERROR " + e.data);
                    loader.recycle();
                }, this);
                loader.load("http://shushanh5.com/web/data/zhcn/n/a/B001/i3.png");
            }

            {
                let socket = new Socket();
                socket.addEventListener(EventT.OPEN, (e: EventX) => {
                    console.log("socket open!");
                }, this);
                socket.addEventListener(EventT.MESSAGE, (e: EventX) => {
                    console.log("服务器返回的数据: " + socket.input.bytesAvailable);
                    console.log("具体的数据: " + socket.input.readUTFBytes(socket.input.bytesAvailable));
                }, this);
                socket.addEventListener(EventT.CLOSE, (e: EventX) => {
                    console.log("socket close");
                }, this);
                socket.addEventListener(EventT.ERROR, (e: EventX) => {
                    console.log("socket error! " + e.data);
                }, this);
                socket.connect("121.40.165.18", 8088);

                setTimeout(() => {
                    console.log("发送：ss");
                    socket.send("ss");

                    setTimeout(() => {
                        console.log("发送：你好!");
                        socket.output.writeUTFBytes("你好!");
                        socket.flush();

                        console.log("发送：hello!");
                        socket.send("hello!");
                    }, 1000);

                }, 1000);
            }

        }

        public bitmapDataTest():void{
            let b = new BitmapData(512,512,false,0);
            let canvas = b.canvas;
            document.body.appendChild(canvas);

        }

        private resTest() {

            function onComplete(event: EventX) {
                
                if (event.type == EventT.COMPLETE) {
                    console.log("加载完毕: " + event.type);

                    let type = event.data.type;
                    let url = event.data.url;
                    let data = event.data.data;
                    if (type == ResType.text) {
                        console.log(`文本加载成功 url: ${url} data: ${data}`);
                    } else if (type == ResType.bin) {
                        console.log(`二进制加载成功 url: ${url} data: ${(data as ByteArray).bytesAvailable}`);
                    } else if (type == ResType.image) {
                        console.log(`图片加载成功 url: ${url} data: ${data}`);
                    }
                } else {
                    console.log("加载失败: " + event.type + ", " + event.data.url);
                }

            }

            Res.instance.maxLoader = 1;

            Res.instance.load([
                // "http://shushanh5.com/web/config/zhcn/trunk/gonggao.js",
                "http://shushanh5.com/web/config/zhcn/trunk/errorcode.js",
            ], onComplete, this, ResType.text, LoadPriority.low);

            Res.instance.load([
                "http://shushanh5.com/web/data/zhcn/n/w/BW001/d.json",
                "http://shushanh5.com/web/data/zhcn/n/a/B001/d.json",
            ], onComplete, this, ResType.bin, LoadPriority.middle);

            Res.instance.load([
                "http://shushanh5.com/web/data/zhcn/n/a/B001/i3.png",
                "http://shushanh5.com/web/data/zhcn/o/server/logo.png",
                "http://shushanh5.com/web/data/zhcn/m/1/mini.jpg",
            ], onComplete, this, ResType.image, LoadPriority.high);

            setTimeout(() => {
                console.log(Res.instance["_resMap"]);

                Res.instance.load([
                    "http://shushanh5.com/web/config/zhcn/trunk/gonggao.js",
                    "http://shushanh5.com/web/config/zhcn/trunk/gonggao.js",
                    "http://shushanh5.com/web/config/zhcn/trunk/gonggao.js",
                ], onComplete, this, ResType.text, LoadPriority.low);

            }, 3000);

        }


        public arrayTest(value:number):void{
            var array:Uint8Array = new Uint8Array(value);
            var data:DataView = new DataView(array.buffer);

            var n:number = getTimer();
            var temp:Uint8Array = new Uint8Array(value);
            array.set(temp);
            console.log("array.set::"+(getTimer() - n));
            
            n = getTimer();
            for(var i:number = 0;i<value;i++){
                data.setUint8(i,array[i]);
            }
            console.log("DataView.set::"+(getTimer() - n));
        }

        public caleTest(value:number):void{
            var temp:number = 0;
            var n:number = getTimer();
            for(var i:number = 0;i<value;i++){
                temp = temp+1;
            }
            console.log("time::"+(getTimer() - n));
        }

        public functionTest(value:number):void{
            var temp:number = 0;
            function test():void{var a=0;a=a+1};

            var n:number = getTimer();
            for(var i:number = 0;i<value;i++){
                test();
            }
            console.log("time::"+(getTimer() - n));
        }
    }
}