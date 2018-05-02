module rf{
    export class BitmapSourceVO implements IFrame{
        name:string = undefined;
        used:number = 0;
        time:number = 0;
        source:BitmapSource = undefined;
        x:number = 0;
        y:number = 0;
        ix:number = 0;
        iy:number = 0;
        w:number = 0;
        h:number = 0;
        rw:number = 0;
        rh:number = 0;
        ul:number = 0;
        ur:number = 0;
        vt:number = 0
        vb:number = 0;

        refreshUV(mw:number,mh:number):void{
            const { x, y, w, h } = this;
            this.ul = x / mw;
            this.ur = (x + w)/mw;
            this.vt = y / mh;
            this.vb = (y + h) / mh;
        }

        // dispose():void{
        //     this.x = this.y = this.w = this.h = this.ix = this.iy = this.rw = this.rh = 0;
        //     this.name = undefined;
        //     this.used = this.time = 0;
        // }
    }
    export class BitmapSourceArea{
        name:number = 0;
        source:BitmapSource = undefined;
        frames:{[key:string]:BitmapSourceVO} = {};
        init(){}

        getArea(name:string,x:number,y:number,w:number,h:number):BitmapSourceVO{
            let vo = new BitmapSourceVO();
            vo.name = name;
            vo.x = x;
            vo.y = y;
            vo.w = vo.rw = w;
            vo.h = vo.rh = h;
            vo.source = this.source;
            this.frames[name] = vo;
            return vo;
        }

        createFrameArea(name:string,frame:IFrame):BitmapSourceVO{
            const{x,y,w,h,ix,iy} = frame;
            let vo = this.getArea(name,ix - x,iy - y,w,h);
            if(undefined != vo){
                vo.ix = ix;
                vo.iy = iy;
            }
            return vo
        }

        getEmptyArea(name:string,sw:number,sh:number):BitmapSourceVO{
            return undefined
        }

        getUnusedArea(name:string,sw:number,sh:number):BitmapSourceVO{
            let frames = this.frames;
            let vo;
            for(let name in frames){
                vo = frames[name];
                if(undefined == vo) continue;
                if(0 >= vo.used && sw < vo.rw && sh < vo.rh){
                    frames[vo.name] = undefined;
                    vo.name = name;
                    vo.w = sw;
                    vo.h = sh;
                    frames[name] = vo;
                    break;
                }
            }
            return vo;
        }
    }

    export class MixBitmapSourceArea extends BitmapSourceArea{
        l:number;
        r:number;
        t:number;
        b:number;

        maxRect:MaxRectsBinPack;

        init(){
            this.maxRect = new MaxRectsBinPack(this.r - this.l,this.b-this.t);
        }

        getEmptyArea(name:string,sw:number,sh:number):BitmapSourceVO{
            let rect = this.maxRect.insert(sw,sh);
            let vo;
            if(rect.w != 0){
                vo = this.getArea(name,rect.x+this.l,rect.y+this.t,sw,sh);
            }else{
                vo = this.getUnusedArea(name,sw,sh);
            }
            return vo;
        }

    }




    export class BitmapSource extends MiniDispatcher{
        static DEFAULT = 0;
        static PACK = 1;
        constructor(){
            super();
        }
        name:string = undefined;
        textureData:ITextureData;
        width:number = 0;
        height:number = 0;
        originU:number = 0;
        originV:number = 0;
        areas:{[name:number]:BitmapSourceArea} = undefined;
        bmd:BitmapData;
        create(name:string,bmd:BitmapData,pack:boolean = false):BitmapSource{
            this.name = name;
            this.areas = {};
            this.bmd = bmd;
            this.width = bmd.width;
            this.height = bmd.height;
            if(pack == false){
                this.setArea(0,0,0,this.width,this.height);
            }else{
                this.areas[0] = this.setArea(1,0,0,this.width,this.height);
            }
            bitmapSources[name] = this;
            return this;
        }


        setArea(name:number,x:number,y:number,w:number,h:number):BitmapSourceArea{
            let area = this.areas[name];
            if(undefined == area){
                if(1 == name){
                    let mix = new MixBitmapSourceArea()
                    mix.l = x;
                    mix.t = y;
                    mix.r = x + w;
                    mix.b = y + h;
                    area = mix;
                }else{
                    area = new BitmapSourceArea();
                }
            }else{
                ThrowError("area exist")
                return area;
            }
            area.source = this;
            area.name = name;
            area.init();
            this.areas[name] = area;
            return area;
        }

        setSourceVO(name:string,w:number,h:number,area:number=1):BitmapSourceVO{
            let barea = this.areas[area];
            if(undefined == barea){
                return undefined;
            }
            let vo = barea.getEmptyArea(name,w,h);
            vo.refreshUV(this.width,this.height);
            return vo;
        }

        getSourceVO(name:string,area:number=0):BitmapSourceVO{
            let barea = this.areas[area];
            if(undefined == barea){
                return undefined;
            }
            return barea.frames[name];
        }

        drawimg(img:HTMLImageElement,x:number,y:number,w?:number,h?:number):void
        {//可能需要其他的处理
            const {bmd, name,textureData} = this;
            if(w == undefined && h == undefined)
            {
                bmd.context.drawImage(img,x,y);
            }else{
                bmd.context.drawImage(img,x,y, w, h);
            }

            let texture = context3D.textureObj[textureData.key];
            if(undefined != texture){
                texture.readly = false;
            }
        }
    }


    export let bitmapSources:{[key:string]:BitmapSource} = {};
    export let componentSource:BitmapSource;
}
