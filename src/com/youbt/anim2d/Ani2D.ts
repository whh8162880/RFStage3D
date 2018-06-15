module rf {

    export interface ANIData {
        p: string //平台
        i: string //使用的图片名称
        r: number //角度
        sx: number //scaleX
        sy: number //scaleY
        l: number //loop 第几帧开始循环播放 -1播放一遍
        f: number //fps 2帧之间间隔时间为 1000 / f
        m: number //最大帧
        w: number //最大的图片宽度
        h: number //最大的图片高度
        fs: { [key: string]: IBitmapSourceVO }//IBitmapSourceVO[] //帧列表
        matrix2d: IMatrix;
    }

    export class Anim2dSource extends BitmapSource {
        config: any;

        cachefs:{ [key: string]: IBitmapSourceVO };

        constructor(url: string) {
            super();
            this.name = url;
            this.status = LoadStates.WAIT;
        }

        load() {
            this.status = LoadStates.LOADING;
            loadRes(this.name, this.loadConfigComplete, this, ResType.amf);
        }

        loadConfigComplete(event: EventX) {
            if (event.type != EventT.COMPLETE) {
                this.status = LoadStates.FAILED;
                return;
            }

            let { name } = this;
            let { data, url } = event.data

            if (url != name) return;
            this.config = data;

            let { i , matrix2d } = data;

            if (matrix2d instanceof ArrayBuffer) {
                data.matrix2d = new Float32Array(matrix2d);
            }

            let perfix = name.slice(0, name.lastIndexOf("/")+1);

            this.status = LoadStates.LOADING;

            //配置加载完成 加载图片
            loadRes(perfix + i, this.loadImageComplete, this, ResType.image);
        }

        loadImageComplete(event: EventX) {
            if (event.type != EventT.COMPLETE) {
                this.status = LoadStates.FAILED;
                return;
            }

            let data = event.data as ResItem;
            let bmd = this.bmd = BitmapData.fromImageElement(data.data);
            this.width = bmd.width;
            this.height = bmd.height;

            let area = this.setArea(BitmapSource.DEFAULT, 0, 0, bmd.width, bmd.height);

            area.frames = this.config.fs;

            this.status = LoadStates.COMPLETE;

            this.simpleDispatch(EventT.COMPLETE);
        }
    }

    /**
     * ani动画 
     * ps：有图片和配置两部分组成，根据配置给定的帧信息按照时间间隔播放
     * 为了更好的查找ani 目前使用的目录是以名称作为文件夹包了一层
     */
    export class Ani extends Sprite {
        constructor(source?:BitmapSource) {
            super(source);
            this.renderer = new BatchRenderer(this);
            this.source = undefined;
        }

        url: string;
        config: ANIData

        fe: number;
        cur: number = 0;
        max: number = 0;
        nt: number;

        load(url: string): void {

            url = getFullUrl(url, ROOT_PERFIX, ExtensionDefine.ANI);
            if (this.url == url) { return; }

            this.url = url;

            let source = bitmapSources[url] as Anim2dSource;
            if (!source) {
                bitmapSources[url] = source = new Anim2dSource(url);
                source.on(EventT.COMPLETE, this.onSouceComplete, this);
                source.load();
            } else {
                if (source.status == LoadStates.COMPLETE) {
                    this.play(source.config);
                } else {
                    source.on(EventT.COMPLETE, this.onSouceComplete, this);
                    if (source.status == LoadStates.WAIT) {
                        source.load();
                    }
                }
            }
        }


        onSouceComplete(e: EventX): void {
            if (e.type != EventT.COMPLETE) {
                return;
            }

            //加载全部完成进行初始化
            let source = e.currentTarget as Anim2dSource;
            source.off(e.type, this.onSouceComplete);
            this.source = source;

            this.play(source.config);

            this.simpleDispatch(EventT.COMPLETE);
        }


        play(config: ANIData) {

            this.config = config;

            this.fe = 1000 / config.f;
            this.max = config.m;
            this.nt = engineNow + this.fe;
            this.cur = 0;
        }


        render(camera: Camera, now: number, interval: number): void {
            let { source } = this;
            if (!source) return;


            super.render(camera, now, interval);

            let{tm,nt}=this;
            if (tm.now > nt) {
                let { max, cur, config } = this;
                if (cur >= max - 1) {
                    cur = config.l;
                    if (cur == -1) {
                        this.remove();
                        return;
                    }
                } else {
                    cur++;
                }
                this.cur = cur;
                this.nt = nt + this.fe;
                let vo = source.getSourceVO(cur, 0);
                if (!vo) return;
                let g = this.graphics;
                g.clear();
                g.drawBitmap(vo.ix, vo.iy, vo, config.matrix2d);
                g.end();
            }
        }

        // setSize(width: number, height: number) {
        //     let { w, h } = this;
        //     if (w == width && h == height) {
        //         return;
        //     }

        //     let { matrix2d } = this;

        //     if (matrix2d != undefined) {
        //         let m = matrix2d.m2_decompose(TEMP_MatrixComposeData);
        //         m.scaleX = m.scaleX / w * width;
        //         m.scaleY = m.scaleY / h * height;
        //         // m.rotaiton /= rf.DEGREES_TO_RADIANS;
        //         matrix2d.m2_recompose(m);
        //     }

        //     super.setSize(width, height);
        //     let { $graphics: graphics } = this;
        //     if (graphics) {
        //         graphics.setSize(width, height);
        //     }
        // }
    }

    export class PakAnim extends Ani{
        constructor()
        {
            super();
        }
        
        load(url: string): void {

            url = getFullUrl(url, ROOT_PERFIX, "hp");
            if (this.url == url) { return; }

            this.url = url;

            let source = bitmapSources[url] as Anim2dSource;
            if (!source) {
                bitmapSources[url] = source = new Anim2dSource(url);
                source.on(EventT.COMPLETE, this.onSouceComplete, this);
                source.load();
            } else {
                if (source.status == LoadStates.COMPLETE) {
                    this.play(source.config);
                } else {
                    source.on(EventT.COMPLETE, this.onSouceComplete, this);
                    if (source.status == LoadStates.WAIT) {
                        source.load();
                    }
                }
            }
        }
    }

    /** 
     * 定制版本ani 公用一个batcher
     * 可以指定source 不知道默认是componentSource
     * 加载完成之后将frames写入到指定的source中去
    */
//    export class AniSimple extends Ani{
//         //限制最大帧
//         lm:number = 6;

//         cs:{ [key: string]: IBitmapSourceVO };

//        constructor(source?:BitmapSource){
//            super(source);
//            this.source = source ? source : componentSource;
//         //    this.renderer = null;
//        }

//        onSouceComplete(e: EventX): void {
//             if (e.type != EventT.COMPLETE) {
//                 return;
//             }

//             //加载全部完成进行初始化
//             let source = e.currentTarget as Anim2dSource;
//             source.off(e.type, this.onSouceComplete);

//             //将加载好的内容重新赋值到默认的source中算出uv 图片设置到source中
//             let {config} = source;
//             let {fs, m} = config;
//             let {lm} = this;
//             let key:string;
//             let step:number = 0;

           
//             let tmp = this.source.setSourceVO(source.name, source.width, source.height);
//             this.source.drawimg(source.bmd.canvas, tmp.x, tmp.y, source.width, source.height);
//             let cs = config.cachefs;
//             if(!cs)
//             {
//                 config.cachefs = cs = {};

//                 //根据整个图片的uv对原始vo进行重新计算
//                  //超过限制帧采取抽帧
//                 let nc:boolean = m > lm;
                
//                 if(nc)
//                 {
//                     let index:number;
//                     let vo:IBitmapSourceVO;
//                     for(step = 0; step < lm; step++)
//                     {
//                         index = m / lm * (step + 1) - 1;
//                         key = source.name + "_" + step;
//                         vo = fs[index];
//                         tmp = this.source.setSourceVO(key, vo.w, vo.h);

//                         cs[step+""] = tmp;
//                     }
//                 }else{
//                     let co:object;
//                     for(let fm of fs)
//                     {
//                         co = {};
//                         for(let msg in fm)
//                         {
//                             co[msg] = fm[msg];
//                             // uv需要重新计算 ul ur vt vb
//                             // x y
//                             // console.log(msg + "xxx" + fm[msg]);
//                             switch(msg)
//                             {
//                                 case "ul":
//                                     co[msg] = tmp[msg] + tmp[msg] * fm[msg];
//                                 break;
//                                 case "ur":
//                                     co[msg] = tmp[msg] + tmp[msg] * fm[msg];
//                                 break;
//                                 case "vt":
//                                     co[msg] = tmp[msg] + tmp[msg] * fm[msg];
//                                 break;
//                                 case "vb":
//                                     co[msg] = tmp[msg] + tmp[msg] * fm[msg];
//                                 break;
//                                 case "x":
//                                     co[msg] = tmp[msg] + tmp[msg];
//                                 break;
//                                 case "y":
//                                     co[msg] = tmp[msg] + tmp[msg];
//                                 break;
//                             }

//                             console.log(msg + ":" + co[msg]);
//                         }


//                         key = source.name + "_" + step;
//                         // tmp = this.source.setSourceVO(key, fm.w, fm.h);
//                         cs[step+""] = co;
//                         step++;
//                     }
//                 }

//                 this.cs = cs;
//             }
           
           
//             this.play(source.config);

//             this.simpleDispatch(EventT.COMPLETE);
//         }

//         play(config: ANIData) {

//             this.config = config;

//             this.fe = 1000 / config.f;
//             this.max = config.m;
//             this.nt = engineNow + this.fe;
//             this.cur = 0;
//         }

//         render(camera: Camera, now: number, interval: number): void {
//             let { source } = this;
//             if (!source) return;


//             super.render(camera, now, interval);

//             let{tm,nt}=this;
//             if (tm.now > nt) {
//                 let { max, cur, config } = this;
//                 if (cur >= max - 1) {
//                     cur = config.l;
//                     if (cur == -1) {
//                         this.remove();
//                         return;
//                     }
//                 } else {
//                     cur++;
//                 }
//                 this.cur = cur;
//                 this.nt = nt + this.fe;
//                 let key = this.url + "_" + cur;
//                 let vo = this.cs[cur];//source.getSourceVO(key, 0);
//                 if (!vo) return;
//                 let g = this.graphics;
//                 g.clear();
//                 g.drawBitmap(0, 0, vo, config.matrix2d);
//                 g.end();
//             }
//         }
//    }
}