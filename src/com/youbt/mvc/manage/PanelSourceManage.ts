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

        /**
		 * 存储对象
		 */
		private _localmap:object = {};
		
		
		/**
		 * 删除资源 
		 * @param name
		 * @param vo
		 * 
		 */		
		removeDefinition(name:string):void
		{
            let {_localmap} = this;
			if(_localmap[name]){
				_localmap[name] = null;
				delete _localmap[name];
			}
		}
		
		/**
		 * 保存资源
		 * @param resoucename
		 * @param content
		 *
		 */
		set(name:string, vo:IDisplaySymbol):void
		{
            let {_localmap} = this;
			if(_localmap[name]){
				throw new Error("重复" + name);
			}
			_localmap[name] = vo;
		}
		
		
		/**
		 * 从指定的应用程序域获取一个公共定义。
		 * @param resoucename
		 * @param content
		 *
		 */
		getDefinition(name:string):IDisplaySymbol
		{
            let {_localmap} = this;
			return _localmap[name];
		}
		
		// getSprite3D(name:String):Sprite3D
		// {
		//     var symbol:DisplaySymbol = _localmap[name];
		// 	if(!symbol)
		// 	{
		// 	    return null;
		// 	}
		// 	return symbol.create();
		// }
    }
    export let sourceManger:PanelSourceManage = singleton(PanelSourceManage);

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

            this.status = status;

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

            let objkeys:string[] = Object.keys(d_setting['frames']);
            let areavo:BitmapSourceArea = this.source.areas[1];
            let bitvo:BitmapSourceVO;
            let frameObj:object;
            for(let key of objkeys){
                frameObj = d_setting['frames'][key];
                bitvo = areavo.createFrameArea(key, {x:frameObj['ox'], y:frameObj['oy'], w:frameObj['width'], h:frameObj['height'], ix:frameObj['ix'], iy:frameObj['iy']});
                bitvo.refreshUV(this.source.width, this.source.height);
            }
            this.source.isReady = true;
            this.setting = d_setting["symbols"];

            objkeys = Object.keys(this.setting);

            for(let key of objkeys)
            {
                sourceManger.set(key, this.setting[key])
            }

            this.simpleDispatch(EventT.COMPLETE);
        }
    }
}