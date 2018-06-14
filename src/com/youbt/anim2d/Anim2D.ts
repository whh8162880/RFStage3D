module rf{

    export interface ANIData{
        p:string //平台
        i:string //使用的图片名称
        r:number //角度
        sx:number //scaleX
        sy:number //scaleY
        l:number //loop 第几帧开始循环播放 -1播放一遍
        f:number //fps 2帧之间间隔时间为 1000 / f
        m:number //最大帧
        fs:{[key:string]:IBitmapSourceVO}//IBitmapSourceVO[] //帧列表
        matrix2d:IMatrix;
    }

    export class Anim2dSource extends BitmapSource{
        config:ANIData;
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

            let config = resItem.data as ANIData;
            this.config = config;

            let names:string[] = config.i.split(".");
            let folder:string = names[0];
            //配置加载完成 加载图片
            url = ROOT_PERFIX + `ani/${folder}/` + config.i;
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

            let frames = this.config.fs;
            area.frames = frames;
            this.width = bmd.width;
            this.height = bmd.height;

            this.status = LoadStates.COMPLETE;
            
            this.simpleDispatch(EventT.COMPLETE);
        }
    }

    /**
     * ani动画 
     * ps：有图片和配置两部分组成，根据配置给定的帧信息按照时间间隔播放
     * 为了更好的查找ani 目前使用的目录是以名称作为文件夹包了一层
     */
    export class Ani extends Sprite implements ITickable{
        constructor(){
            super();
            this.renderer = new BatchRenderer(this);
            this.source = undefined;
        }

        _url:string;
        readly:boolean = false;
        res:ResItem;
        
        fps:number;
        currentFrame:number = 0;
        totalFrame:number = 0;
        loop:number=-1;


        load(url:string):void{
            if(this._url == url){
                return;
            }
            if (url.indexOf("://") == -1) {
                url = ROOT_PERFIX + `ani/${url}/${url}`;
            }
            
            if(url.lastIndexOf(ExtensionDefine.ANI) == -1) {
                url += ExtensionDefine.ANI;
            }

            this._url = url;

            this.readly = false;

            let source = recyclable(Anim2dSource);//new Anim2dSource();
            source.name = url;
            source.on(EventT.COMPLETE,this.onImageComplete,this);
            loadRes(url,source.loadConfigComplete,source,ResType.amf);
        }

        onImageComplete(e:EventX):void
        {
            if(e.type !=  EventT.COMPLETE)
            {
                return;
            }

            this.readly = true;

            //加载全部完成进行初始化
            let source = e.currentTarget as Anim2dSource;
            source.off(e.type,this.onImageComplete);

            this.source = source;

            this.currentFrame = -1;
            this.nextTime = 0;

            let {config:anidata} = source;

            // if(matrix2d instanceof ArrayBuffer){
            //     ele.matrix2d = matrix2d = new Float32Array(matrix2d);
            // }

            this.fps = 1000 / anidata.f;
            this.loop = anidata.l;
            this.totalFrame = anidata.m;
            this.nextTime = engineNow + this.fps;

            this.playNext();
            Engine.addTick(this);

            this.simpleDispatch(EventT.COMPLETE);
        }

        nextTime:number;
        update(now: number, interval: number): void{
            let {fps, nextTime} = this;
            if(now >= nextTime){
                this.playNext();
                this.nextTime = now + fps;
            }
        }

        playNext():void{
            this.currentFrame++;
            const{loop, totalFrame} = this;
            let source = this.source as Anim2dSource;
			if(this.currentFrame >= totalFrame){
				if(loop == -1)
				{ 
                    Engine.removeTick(this);
                    this.remove();
                    // this.simpleDispatch();
					// simpleDispatch(PLAY_END);
					return;
				}else{
					this.currentFrame = loop;
				}
            }
            
            let vo:IBitmapSourceVO = source.getSourceVO(this.currentFrame.toString(), 0);
			if(vo == undefined)
			{
				return;
			}
            
            let g = this.graphics;
            g.clear();
            g.drawBitmap(0,0,vo);
            g.end();
        }


        render(camera: Camera, now: number, interval: number):void{
            let{source}=this;
            if(!source){
                return;
            }
            super.render(camera,now,interval)
        }


    }

}