/// <reference path="./game/module/rfreference.ts" />
module rf{
    export class UIMain extends AppBase{
        init(canvas?:HTMLCanvasElement){

            super.init(canvas);
            if(undefined == gl){
                return;
            }
            let perfix = "../assets/"
            ROOT_PERFIX = perfix;

            var base = document.createElement("base");
			var head = document.getElementsByTagName("head")[0];
			base.href = perfix;
            head.appendChild(base);
            

            let map = new Map();
            map.addbg1("m/1/bg_0.png",1);
            ROOT.addChild(map);

            

        }


        resizeCanvas(width:number,height:number){

            let pw = 640;
            let ph = 1136;

            let w = width;
            let h = height;

            let p = pw / ph;

            if(w < h){
                h = w / p;
            }else{
                w = h * p;
            }

            stageWidth = pw * pixelRatio;
            stageHeight = ph * pixelRatio;

            if(!ROOT){
                return;
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
            let w = stageWidth / pixelRatio;
            let h = stageHeight / pixelRatio;

            canvas.style.width = w+"px";
            canvas.style.height = h+"px";
            canvas.style.left = ((window.innerWidth - w) >> 1) + "px";
            canvas.style.top = ((window.innerHeight - h) >> 1) + "px";
        }
    }
}