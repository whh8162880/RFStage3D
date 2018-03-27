/// <reference path="./com/youbt/rfreference.ts" />
module rf{
    export class Main extends AppBase{
        constructor(){      
            super();
        }


        public init():void{
            // this.bitmapDataTest();
            // new MaxRectsBinPackTest();
            new WebglTest();
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

        public update(now:number,interval:number):void{
         //   document.title = now+","+interval;
            // console.log(now+","+interval);
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
                http.addEventListener(EventX.PROGRESS, (e: EventX) => {
                    console.log("PROGRESS " + e.data);
                }, this);
                http.addEventListener(EventX.COMPLETE, (e: EventX) => {
                    console.log("COMPLETE " + http.response);
                    http.recycle();
                }, this);
                http.addEventListener(EventX.IO_ERROR, (e: EventX) => {
                    console.log("IO_ERROR " + e.data);
                    http.recycle();
                }, this);
                http.open("http://shushanh5.com/web/config/zhcn/trunk/gonggao.js", HttpMethod.GET);
                http.send();
            }

            {
                let http = recyclable(HttpRequest);
                http.responseType = HttpResponseType.ARRAY_BUFFER;
                http.addEventListener(EventX.PROGRESS, (e: EventX) => {
                    console.log("PROGRESS " + e.data);
                }, this);
                http.addEventListener(EventX.COMPLETE, (e: EventX) => {
                    let bytes = new ByteArray(http.response);
                    console.log("COMPLETE " + bytes.length + " " + bytes.readInt());
                    http.recycle();
                }, this);
                http.addEventListener(EventX.IO_ERROR, (e: EventX) => {
                    console.log("IO_ERROR " + e.data);
                    http.recycle();
                }, this);
                http.open("http://shushanh5.com/web/data/zhcn/n/w/BW001/d.json", HttpMethod.GET);
                http.send();
            }

            {
                let loader = recyclable(ImageLoader);
                loader.crossOrigin = "anonymous";
                loader.addEventListener(EventX.COMPLETE, (e: EventX) => {
                    console.log("Image COMPLETE " + loader.data);
                    loader.recycle();
                }, this);
                loader.addEventListener(EventX.IO_ERROR, (e: EventX) => {
                    console.log("Image IO_ERROR " + e.data);
                    loader.recycle();
                }, this);
                loader.load("http://shushanh5.com/web/data/zhcn/n/a/B001/i3.png");
            }

            {
                let socket = new Socket();
                socket.addEventListener(EventX.OPEN, (e: EventX) => {
                    console.log("socket open!");
                }, this);
                socket.addEventListener(EventX.MESSAGE, (e: EventX) => {
                    console.log("服务器返回的数据: " + socket.input.bytesAvailable);
                    console.log("具体的数据: " + socket.input.readUTFBytes(socket.input.bytesAvailable));
                }, this);
                socket.addEventListener(EventX.CLOSE, (e: EventX) => {
                    console.log("socket close");
                }, this);
                socket.addEventListener(EventX.ERROR, (e: EventX) => {
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


let m =new rf.Main();
