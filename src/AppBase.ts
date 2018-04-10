/// <reference path="./com/youbt/rfreference.ts" />
/// <reference path="./com/youbt/stage3d/Stage3D.ts" />
module rf {
    export class AppBase implements ITickable,IResizeable{
        constructor() {
            this.createSource();
            Engine.start();
            ROOT = singleton(Stage3D);
            
        }


        init(canvas?:HTMLCanvasElement):void{
           
            if(undefined == canvas){
                canvas = document.createElement("canvas");
                document.body.appendChild(canvas);
            }
            var b:boolean = ROOT.requestContext3D(canvas);
            if(false == b){
                console.log("GL create fail");
                return;
            }

            Capabilities.init();
            
            // context3D.setDepthTest(true,gl.LEQUAL);
            context3D.setDepthTest(false,gl.ALWAYS);
            context3D.setBlendFactors(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

            Engine.addResize(this);
            Engine.addTick(this);
        }

        createSource():void{
            let bmd = new BitmapData(2048,2048,true);
            let source = new BitmapSource().create("component",bmd,true);
            let vo = source.setSourceVO("origin",1,1);
            bmd.fillRect(vo.x,vo.y,vo.w,vo.h,"rgba(255,255,255,255)");
            source.originU = vo.ul;
            source.originV = vo.vt;
            componentSource = source;

            var getPixelRatio = function(context) {
                var backingStore = context.backingStorePixelRatio ||
                    context.webkitBackingStorePixelRatio ||
                    context.mozBackingStorePixelRatio ||
                    context.msBackingStorePixelRatio ||
                    context.oBackingStorePixelRatio ||
                    context.backingStorePixelRatio || 1;
                return (window.devicePixelRatio || 1) / backingStore;
			};
            pixelRatio = getPixelRatio(bmd.context);

            // pixelRatio = 1;
        }


        public update(now: number, interval: number): void {
            //todo
            ROOT.update(now,interval);
        }

        public resize(width:number,height:number):void{
            context3D.configureBackBuffer(stageWidth,stageHeight,0);
            ROOT.resize(width,height);
        }

    }
}