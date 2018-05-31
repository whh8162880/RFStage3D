module rf{
    export interface IDisplayFrameElement{
		type:number;
		name:string;
		rect:any;
		x:number;
		y:number;
        matrix2d:IMatrix;
		libraryItemName:string;
	}

	export interface IDisplayTextElement extends IDisplayFrameElement
	{
		fontRenderingMode:String;
		width:number;
		height:number;
		selectable:boolean;
		text:string;
		filter:any[];
		format:object;
		input:boolean;
		multiline:boolean;
		color:number;
	}

	export interface IDisplaySymbol extends IDisplayFrameElement{
		className:String;
		displayClip:number;
		displayFrames:{[key:number]:IDisplayFrameElement[]}
	}

    export interface IExportPanelSource{
        txtwidth:number;
        txtheight:number;
        image:string;
        symbols:IDisplaySymbol[]
        frames:{[key:string]:IBitmapSourceVO}
    }

    export class PanelSource extends BitmapSource{
        config:IExportPanelSource;
        constructor(){
            super();
            this.status = LoadStates.WAIT;
        }

        loadConfigComplete(event:EventX){
            if(event.type != EventT.COMPLETE){
                this.status = LoadStates.FAILED;
                return;
            }
            let resItem = event.data as ResItem;
            let url = resItem.url;
            if(url != this.name) return;

            let config = resItem.data as IExportPanelSource;
            this.config = config;

            //配置加载完成 加载图片
            url = ROOT_PERFIX + "p3d/" + config.image + ExtensionDefine.PNG;
            loadRes(url,this.loadImageComplete,this,ResType.image);
        }

        loadImageComplete(event:EventX){
            if(event.type != EventT.COMPLETE){
                this.status = LoadStates.FAILED;
                return;
            }

            let data = event.data as ResItem;
            let bmd = this.bmd = BitmapData.fromImageElement(data.data);

            let area = this.setArea(BitmapSource.DEFAULT,0,0,bmd.width,bmd.height);
            let{frames} = this.config;
            area.frames = frames;

            this.width = bmd.width;
            this.height = bmd.height;

            let vo = frames["emptyTextarea"];
            if(vo){
                this.setArea(BitmapSource.PACK,vo.x,vo.y,vo.w,vo.h);
            }

            this.status = LoadStates.COMPLETE;
            
            this.simpleDispatch(EventT.COMPLETE)

        }
    }


    export function panelSourceLoad(url:string):PanelSource
    {

        if (url.indexOf("://") == -1) {
            url = ROOT_PERFIX + `p3d/${url}`;
        }
        
        if(url.lastIndexOf(ExtensionDefine.P3D) == -1) {
            url += ExtensionDefine.P3D;
        }

        let source = bitmapSources[url] as PanelSource;

        if(!source){
            bitmapSources[url] = source = new PanelSource();
            source.name = url;
        }

        return source;
    }

    // export class PanelSourceManage{
    //     protected all_res:{[key:string]:PanelSource};

    //     constructor()
    //     {
    //         this.all_res = {};
    //     }

    //     load(url:string):PanelSource
    //     {

    //         if (url.indexOf("://") == -1) {
    //             url = ROOT_PERFIX + `p3d/${url}`;
    //         }
           
    //         if(url.lastIndexOf(ExtensionDefine.P3D) == -1) {
    //             url += ExtensionDefine.P3D;
    //         }

    //         let{all_res}=this;

    //         let source = all_res[url];

    //         if(!source){
    //             all_res[url] = source = new PanelSource();
    //             source.name = url;
    //         }

    //         if(source.status == LoadStates.WAIT){
    //             source.status = LoadStates.LOADING;
    //             loadRes(url,source.loadConfigComplete,source,ResType.amf);
    //         }

    //         return source;
    //     }
    // }
    // export let sourceManger = singleton(PanelSourceManage);
}