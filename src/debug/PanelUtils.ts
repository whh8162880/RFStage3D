module rf{
    export class PanelUtils{
        skin:Symbol;
        setting:object;
        btn_random:Button;

        constructor(){
            this.loadp3d("../assets/create.p3d");
        }

        private loadp3d(url:string):void {
            loadRes(url, this.p3dloadComplete, this, ResType.text)
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
            this.setting = o;

            //加载对应的图片资源
            let url = "../assets/"+ o['image'] +'.png';
            loadRes(url,this.onImageComplete,this,ResType.image);
        }

        onImageComplete(e:EventX):void{
            if(e.type !=  EventT.COMPLETE)
            {
                return;
            }

            const{setting} = this;

            let res:ResItem = e.data;
            let image:HTMLImageElement = res.data;

            let bw = setting['txtwidth'] + image.width;
            let bh = setting['txtheight'] + image.height;

            let bmd = new BitmapData(bw, bh, true);
            let source = new BitmapSource().create("ui.asyncpanel.create",bmd,true);

            let vo = source.setSourceVO("panelimg",image.width,image.height,1);
            source.bmd.context.drawImage(image,vo.x,vo.y);

            let framekeys:string[] = Object.keys(setting['frames']);
            let areavo:BitmapSourceArea = source.areas[1];
            let bitvo:BitmapSourceVO;
            let frameObj:object;
            for(let key of framekeys){
                frameObj = setting['frames'][key];
                bitvo = areavo.createFrameArea(key, {x:frameObj['ox'], y:frameObj['oy'], w:frameObj['width'], h:frameObj['height'], ix:frameObj['ix'], iy:frameObj['iy']});
                bitvo.refreshUV(source.width, source.height);
            }


            let clsname = "ui.asyncpanel.create";
            let sybs = setting['symbols'];
            let cs = sybs[clsname];
            
            this.skin = new Symbol(source);
            this.skin.setSymbol(cs);
            this.skin.renderer = new BatchRenderer(this.skin);
            popContainer.addChild(this.skin);

            this.bindComponents();
        }

        protected bindComponents():void
        {
            const{skin} = this;
            this.btn_random = new Button(skin["btn_create"]);
            this.btn_random.label = "sssss";
        }
    }
}