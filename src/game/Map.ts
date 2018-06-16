module rf{


    export class ScrollMapBg extends Image{
        iw:number;
        speed:number;
        vo:IBitmapSourceVO;
        perx:number;
        constructor(speed:number,source?:BitmapSource,variables?:{ [key: string]: IVariable }){
            super(source,variables);
            this.speed = speed;
            this.perx = 0;
        }

        draw(vo:IBitmapSourceVO){
            this.vo = vo;
            this.iw = vo.w;

            this.updatePos(this.perx,true)
        }

        updatePos(x:number,refresh?:boolean){
            let{perx,iw,vo,speed,graphics} = this;

            if(x - perx >= iw){
                perx += iw;
                refresh = true;
            }

            if(refresh){
                graphics.clear();
                graphics.drawBitmap(perx,0,vo)
                graphics.drawBitmap(perx + iw,0,vo)
                graphics.end();
            }
        }

        

    }

    export class Map extends Sprite{
        bg0:ScrollMapBg;
        bg1:ScrollMapBg;
        bg2:ScrollMapBg;

        constructor(source?:BitmapSource,variables?:{ [key: string]: IVariable }){
            super(source,variables);

            this.bg0 = new ScrollMapBg(0.2);
            this.bg1 = new ScrollMapBg(0.5);
            this.bg2 = new ScrollMapBg(1);

            this.addChild(this.bg2);
            this.addChild(this.bg1);
            this.addChild(this.bg0);

        }

        initbg(url0:string,url1:string,url2:string){
            let{bg0,bg1,bg2}=this;
            bg0.load(url0);
            bg1.load(url1);
            bg2.load(url2);
        }

    }

}