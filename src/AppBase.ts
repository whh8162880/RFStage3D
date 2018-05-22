/// <reference path="./com/youbt/rfreference.ts" />
/// <reference path="./com/youbt/components/rfreference.ts" />
/// <reference path="./com/youbt/stage3d/Stage3D.ts" />
///<reference path="./com/youbt/stage3d/three/Mesh.ts" />
module rf {
    export class AppBase implements ITickable,IResizeable{

        nextGCTime:number;
        gcDelay:number = 3000;
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

            this.initContainer();

            Engine.addResize(this);
            Engine.addTick(this);

            ROOT.addEventListener(EngineEvent.FPS_CHANGE,this.gcChangeHandler,this);

            this.nextGCTime = engineNow + this.gcDelay;

            
        }

        createSource():void{
            // panels= singleton(PanelSourceManage)
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


        initContainer(){
            let g = gl;
            let container = new Scene(vertex_mesh_variable);
            let material = new Material();
            material.depthMask = true;
            material.passCompareMode = WebGLConst.LEQUAL;
            material.srcFactor = WebGLConst.SRC_ALPHA;
            material.dstFactor = WebGLConst.ONE_MINUS_SRC_ALPHA;;
            material.cull = WebGLConst.NONE;;
            container.material = material;
            container.camera = ROOT.camera3D;
            ROOT.addChild(container);
            scene = container;

            let uiContainer = new UIContainer(undefined,vertex_ui_variable);
            uiContainer.renderer = new BatchRenderer(uiContainer);
            material = new Material();
            material.depthMask = false;
            material.passCompareMode = WebGLConst.ALWAYS;
            material.srcFactor = WebGLConst.SRC_ALPHA;
            material.dstFactor = WebGLConst.ONE_MINUS_SRC_ALPHA;
            material.cull = WebGLConst.NONE;
            uiContainer.material = material;
            ROOT.addChild(uiContainer);
            popContainer.mouseEnabled = false;
            tipContainer.mouseEnabled = false;
            uiContainer.addChild(popContainer);
            uiContainer.addChild(tipContainer);
        }


        public update(now: number, interval: number): void {
            //todo
            ROOT.update(now,interval);
            tweenUpdate();
        }

        public resize(width:number,height:number):void{
            context3D.configureBackBuffer(stageWidth,stageHeight,0);
            ROOT.resize(width,height);
            
        }


        gcChangeHandler(event:EventX):void{
            let{nextGCTime,gcDelay}=this;
            let now = engineNow;
            if(now > nextGCTime){
                context3D.gc(now);
                Res.instance.gc(now);
                this.nextGCTime+=gcDelay
            }
            
        }

    }
}