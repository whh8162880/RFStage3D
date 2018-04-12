module rf{
    export class PanelUtils{
        ui:Symbol;
        setting:object;
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
            // let clsname = "ui.asyncpanel.create";
            // let sybs = o['symbols'];
            // let cs = sybs[clsname];

            // let bmd = new BitmapData(o['width'],o['height'],true);
            // let source = new BitmapSource().create(clsname,bmd,true);
            // let vo = source.setSourceVO("origin",1,1);
            // bmd.fillRect(vo.x,vo.y,vo.w,vo.h,"rgba(255,255,255,255)");
            // source.originU = vo.ul;
            // source.originV = vo.vt;

            //加载对应的图片资源
            let url = "../assets/"+ o['image'] +'.png';
            loadRes(url,this.onImageComplete,this,ResType.image);
        }

        onImageComplete(e:EventX):void{
            if(e.type !=  EventT.COMPLETE)
            {
                return;
            }
            let res:ResItem = e.data;
            let image:HTMLImageElement = res.data;


            let bmd = new BitmapData(image.width + 200,image.height + 200,true);
            let source = new BitmapSource().create("ui.asyncpanel.create",bmd,true);

            let vo = source.setSourceVO("panelimg",image.width,image.height,1);
            source.bmd.context.drawImage(image,vo.x,vo.y);

            let framekeys:string[] = Object.keys(this.setting['frames']);
            let areavo:BitmapSourceArea = source.areas[1];
            let bitvo:BitmapSourceVO;
            let frameObj:object;
            for(let key of framekeys){
                frameObj = this.setting['frames'][key];
                bitvo = areavo.createFrameArea(key, {x:frameObj['ox'], y:frameObj['oy'], w:frameObj['width'], h:frameObj['height'], ix:frameObj['ix'], iy:frameObj['iy']});
                bitvo.refreshUV(source.width, source.height);
            }


            let clsname = "ui.asyncpanel.create";
            let sybs = this.setting['symbols'];
            let cs = sybs[clsname];
            
            this.ui = new Symbol(source);
            this.ui.setSymbol(cs);
            this.ui.renderer = new BatchRenderer(this.ui);
            popContainer.addChild(this.ui);
            // this.ui.x = 300;
            // this.ui.y = 200;
        }
    }
}