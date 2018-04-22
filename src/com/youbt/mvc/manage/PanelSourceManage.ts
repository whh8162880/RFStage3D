///<reference path="../PanelSource.ts" />
module rf{
    export class PanelSourceManage{
        protected all_res:object;

        constructor()
        {
            this.all_res = {};
        }

        load(url:string, uri:string):AsyncResource
        {
            let res:AsyncResource = this.getres(url, uri);
            if(res.status == 0)
            {
                res.load(url);
            }
            return res;
        }

        getres(url:string, uri:string):AsyncResource
		{
            const {all_res} = this;
			let res:AsyncResource = all_res[uri];
			if (res == undefined)
			{
				var index:number = url.lastIndexOf(".");
				if (index == -1)
                {
                    return undefined;
                }
                res = new AsyncResource();
				all_res[uri]=res;
			}
			return res;
        }
    }

    export class AsyncResource extends MiniDispatcher{
        setting:object;
        source:PanelSource;
        status:number = 0;

        private d_setting:object;

        constructor(){
            super();
        }

        load(url:string):void
        {
            loadRes(url, this.p3dloadComplete, this, ResType.text);
        }

        p3dloadComplete(e:EventX):void{
            if(e.type !=  EventT.COMPLETE)
            {
                return;
            }
            let res:ResItem = e.data;
            let o = JSON.parse(res.data);
            this.resourceComplete(o);
         }
 
         resourceComplete(o:object):void{
             //生成对应的模块 一次只有一个对象    
             //创建bitmapsource
             this.d_setting = o;
 
             //加载对应的图片资源
             let url = "../assets/"+ o['image'] +'.png';
             loadRes(url,this.onImageComplete,this,ResType.image);
         }

         onImageComplete(e:EventX):void{
            let {status} = this;
            if(e.type !=  EventT.COMPLETE)
            {
                status = 0;
                return;
            }

            status = 1;

            const{d_setting} = this;

            let res:ResItem = e.data;
            let image:HTMLImageElement = res.data;

            let bw:number = (d_setting['txtwidth'] >= image.width) ? d_setting['txtwidth'] : image.width;
            let bh:number = d_setting['txtheight'] + image.height;

            let bmd:BitmapData = new BitmapData(bw, bh, true);
            bmd.draw(image);

            this.source = new PanelSource();
            this.source.create(d_setting['image'], bmd, true);

            let vo:BitmapSourceVO = this.source.setSourceVO("panelimg",image.width,image.height,1);
            // this.source.bmd.context.drawImage(image,vo.x,vo.y);

            let framekeys:string[] = Object.keys(d_setting['frames']);
            let areavo:BitmapSourceArea = this.source.areas[1];
            let bitvo:BitmapSourceVO;
            let frameObj:object;
            for(let key of framekeys){
                frameObj = d_setting['frames'][key];
                bitvo = areavo.createFrameArea(key, {x:frameObj['ox'], y:frameObj['oy'], w:frameObj['width'], h:frameObj['height'], ix:frameObj['ix'], iy:frameObj['iy']});
                bitvo.refreshUV(this.source.width, this.source.height);
            }
            this.source.isReady = true;
            this.setting = d_setting["symbols"];

            this.simpleDispatch(EventT.COMPLETE);
        }
    }
}