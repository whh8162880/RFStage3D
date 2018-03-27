///<reference path="./display/Sprite.ts" />
///<reference path="./Context3D.ts" />
module rf{

    export var stageWidth:number = 0;
    export var stageHeight:number = 0;
    export var isWindowResized:boolean = false;
    
    
    export class Stage3D extends Sprite{

        static names: string[] = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];

        public canvas:HTMLCanvasElement;

        constructor(){
            super();
            this.initBrowserInfo();
        }


        private initBrowserInfo(){
            window.onresize = function (){
                stageWidth = window.innerWidth;
                stageHeight = window.innerHeight;
                isWindowResized = true;
                this.console.log("width:"+stageWidth+" height:"+stageHeight);
            }
            stageWidth = window.innerWidth;
            stageHeight = window.innerHeight;
            console.log("width:"+stageWidth+" height:"+stageHeight);
        }


        public requestContext3D(canvas:HTMLCanvasElement):boolean{
            this.canvas = canvas;
            for(var name of Stage3D.names){
                try {
                    GL = <WebGLRenderingContext> this.canvas.getContext(name);
                } catch (e) { 

                }
                if(GL){
                    break;
                }
            }

            if(undefined == GL){
                context3D = null;
                this.simpleDispatch(EventX.ERROR,"webgl is not available");
                return false;
            }

            context3D = singleton(Context3D);

            this.simpleDispatch(EventX.CONTEXT3D_CREATE,GL);
            return true;
        }


        //在这里驱动渲染
        public update(now:number,interval:number):void{
            //todo
        }
    }
}