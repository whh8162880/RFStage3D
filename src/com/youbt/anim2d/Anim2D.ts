module rf{

    export interface ANIData{
        p:string //平台
        i:string //使用的图片名称
        r:number //角度
        sx:number //scaleX
        sy:number //scaleY
        l:number //loop 第几帧开始循环播放 -1播放一遍
        f:number //fps 2帧之间间隔时间为 1000 / f
        fs:IUVFrame[] //帧列表
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

            //配置加载完成 加载图片
            url = ROOT_PERFIX + "p3d/" + config.i + ExtensionDefine.PNG;
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
            // let frames = this.config.fs;
            // area.frames = frames;
            this.width = bmd.width;
            this.height = bmd.height;

            this.status = LoadStates.COMPLETE;
            
            this.simpleDispatch(EventT.COMPLETE)

        }
    }

    export class Ani extends Sprite{
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
            let source = new Anim2dSource();
            source.on(EventT.COMPLETE,this.onImageComplete,this);
            loadRes(url,source.loadConfigComplete,source,ResType.amf);


            this.readly = false;
            if (url)
			{
				this._url = url;
                this.res = loadRes(url,this.onImageComplete,this,ResType.amf);
			}
        }

        onImageComplete(e:EventX):void
        {
            if(e.type !=  EventT.COMPLETE)
            {
                return;
            }
            let source = e.currentTarget as Anim2dSource;
            source.off(e.type,this.onImageComplete);
            this.source = source;

            this.currentFrame = 0;

            this.update();

            // let res:ResItem = e.data;
            // let image:HTMLImageElement = res.data;
            // let source = this.source;
            // let vo = source.setSourceVO(this._url,image.width,image.height,1);


            // source.drawimg(image,vo.x,vo.y);

            // let g = this.graphics;
            // g.clear();
            // g.drawBitmap(0,0,vo)
            // g.end();
        }

        nextUpdateTime:number;
        update():void{
            let now = getTimer()
            
            if(now >= nextUpdateTime){
                this.playNext();
                nextUpdateTime += this.fps;
            }
        }

        playNext():void{
            this.currentFrame++;
            const{loop, totalFrame} = this;
            let source = this.source as Anim2dSource;
			if(this.currentFrame >= totalFrame){
				if(loop == -1)
				{
					// remove();
					// simpleDispatch(PLAY_END);
					return;
				}else{
					this.currentFrame = loop;
				}
            }
            let sourceVO = source
			sourceVO = res.sources[currentFrame];
			draw();
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