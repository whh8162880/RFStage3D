/// <reference path="./game/rfreference.ts" />
module rf{
    export class UIMain extends AppBase{
        init(canvas?:HTMLCanvasElement){

            super.init(canvas);
            if(undefined == gl){
                return;
            }

            Engine.frameRate = 30;

            let perfix = "../assets/"
            ROOT_PERFIX = "";

            var base = document.createElement("base");
			var head = document.getElementsByTagName("head")[0];
			base.href = perfix;
            head.appendChild(base);
            

            let map = new Map();
            map.initbg("m/1/bg_0.png","m/1/bg_1.png","m/1/bg_2.jpg");
            popContainer.addChild(map);

            let profile = singleton(GUIProfile);
            ROOT.addChild(profile);


            for(let i=0;i<5;i++){
                let p = new Pak();
                p.load("pak/zhaoyun/0.hp");
                p.setPos(150,600 + i *100);
                popContainer.addChild(p);
            }


            for(let i=0;i<5;i++){
                let p = new Pak();
                p.scaleX = -1;
                p.load("pak/gong/0.hp");
                p.setPos(500,600 + i *100);
                popContainer.addChild(p);
            }



        }


        resizeCanvas(width:number,height:number){

            let pw = 640;
            let ph = 1136;

            stageWidth = pw;
            stageHeight = ph;

            if(!ROOT){
                return;
            }

            let w = width;
            let h = height;

            let p = pw / ph;

            if(w < h){
                h = Math.round(w / p);
            }else{
                w = Math.round(h * p);
            }
           
            let canvas = ROOT.canvas;
            canvas.style.width = w+"px";
            canvas.style.height = h+"px";
            canvas.style.left = ((width - w) >> 1) + "px";
            canvas.style.top = ((height - h) >> 1) + "px";
        }


        createSource(){
            resizeStageSizeFunction = this.resizeCanvas;
            super.createSource();
        }


        initCanvas(canvas:HTMLCanvasElement){
            this.resizeCanvas(window.innerWidth,window.innerHeight)
        }
    }
}