/// <reference path="../stage3d/display/Component.ts" />
module rf{
    export interface IListOption {
        itemWidth?: number;     //item 宽度
        itemHeight?: number;
        gap?:number;
        vertical?:boolean;
        columnCount?: number;
        clazz?:{new ():Component};
    }

    export interface IListRuntime{
        selectedIndex:number;
        first:ListItem & Recyclable<Component>;
        last:ListItem & Recyclable<Component>;
        displayCount:number;
        start:number;
        end:number;
    }

    export interface ListItem extends LinkItem{
        data?:{};
        index?:number;
    }

    export class List extends Component{

        datas:{}[];
        option : IListOption;
        runtime : IListRuntime;
        scroll:Scroll;
        constructor(source:BitmapSource,Clazz:{new ():Component},itemWidth:number,itemHeight:number,gap:number = 0,vertical:boolean = true,columnCount:number = 1){
            super(source);
            this.option = {
                itemWidth:itemWidth + gap,
                itemHeight:itemHeight + gap,
                vertical:vertical,
                columnCount:columnCount,
                clazz:Clazz,
                gap:gap
            } as IListOption;

            this.runtime = {
                selectedIndex:-1,
                displayCount:-1,
            } as IListRuntime;
        }

        displayList(data?:{}[]) {
            this.datas = data;

            let{option,scroll,runtime}=this;
            runtime.selectedIndex = -1;
            this.refreshList();

            
            let{columnCount,itemWidth,itemHeight,vertical,gap}=option;
            let len = data.length;

            if(vertical){
                this.h = Math.ceil((len * itemHeight) / columnCount) - gap;
                this.w = columnCount * itemWidth - gap;
            }else{
                this.w = Math.ceil((len * itemWidth) / columnCount) - gap;
                this.h = columnCount * itemHeight - gap;
            }
            
            this.simpleDispatch(EventT.RESIZE);
        }

        clear(){
            let{runtime}=this;
            let{first}=runtime;
            while(first){
                let f = first.__next as ListItem & Recyclable<Component>;
                this.removeItem(first);
                first = f;
            }
            runtime.first = runtime.last = undefined;
        }


        setSize(width:number, height:number)
        {
            super.setSize(width,height);
            let{option,scroll,runtime}=this;
            let{gap,vertical,columnCount}=option;
            let count = 1;
            if(vertical){
                let{itemHeight}=option;
                count = Math.ceil(height / itemHeight) + 1;
            }else{
                let{itemWidth}=option;
                count = Math.ceil(width / itemWidth) + 1;
            }
            runtime.displayCount = count;
            if(!scroll){
                this.renderer = new BatchRenderer(this);
                this.scroll = scroll = new Scroll(this,width,height);
                if(vertical){
                    scroll.hStep = 0;
                }else{
                    scroll.vStep = 0;
                }
                scroll.on(EventT.SCROLL,this.refreshList,this);
            }else{
                scroll.setArea(width,height,this.w,this.h);
            }
            
        }


        refreshList(event?:EventX){
            let{datas,runtime}=this;
            let{displayCount,first,last}=runtime;
            let start:number,end:number,datalen:number;
            datalen = datas.length;
            if(displayCount == -1){
                start = 0;
                end = datalen;
            }else{
                let{option,scrollRect} = this;
                let{vertical,itemWidth,itemHeight} = option;
                if(vertical){
                    start = Math.clamp(Math.floor(-scrollRect.y / itemHeight) ,0,Math.max(0,datalen - displayCount));
                }else{
                    let{x}=scrollRect;
                    start = Math.clamp(Math.floor(-scrollRect.x / itemWidth) ,0,Math.max(0,datalen - displayCount));
                }
                end = Math.min(start + displayCount,datalen);
            }


            if(runtime.start == start && runtime.end == end){
                return;
            }


            runtime.start = start;
            runtime.end = end;



            if(first && (first.index > end || last.index < start)){
                this.clear();
            }else{
                while(first){
                    if(first.index >= start) break;

                    let f = first.__next as ListItem & Recyclable<Component>;
                    this.removeItem(first);
                    first = f;
                }
                runtime.first = first;

                while(last){
                    if(last.index < end) break;

                    let l = last.__pre as ListItem & Recyclable<Component>;
                    this.removeItem(last);
                    last = l;
                }
                runtime.last = last;
            }

            if(first){
                for(let i = first.index - 1; i >= start;i--){
                    let ins = this.addItem(i,datas[i]);
                    first.__pre = ins;
                    ins.__next = first;
                    first = ins;
                }

                for(let i = last.index + 1;i < end;i++){
                    let ins = this.addItem(i,datas[i]);
                    last.__next = ins;
                    ins.__pre = last;
                    last = ins;
                }
            }else{
                for(let i = start;i < end;i++){
                    let ins = this.addItem(i,datas[i]);
                    if(!last){
                        first = last = ins;
                    }else{
                        last.__next = ins;
                        ins.__pre = last;
                        last = ins;
                    }
                }
            }

            runtime.first = first;
            runtime.last = last;
        }


        addItem(index:number,data:{}){
            let{clazz,itemWidth,itemHeight,columnCount,gap,vertical}=this.option;
            let ins = recyclable(clazz) as ListItem & Recyclable<Component>;
            ins.index = index;
            ins.source = this.source;
            if(vertical){
                ins.setPos((index % columnCount) * itemWidth,Math.floor(index / columnCount) * itemHeight);
            }else{
                ins.setPos(Math.floor(index / columnCount) * itemWidth,(index % columnCount) * itemHeight);
            }
            ins.on(MouseEventX.MouseUp,this.itemClickHandler,this);
            ins.data = data;
            this.addChild(ins);
            console.log(`create:${index}`);
            return ins;
        }


        removeItem(item:ListItem & Recyclable<Component>){
            console.log(`remove:${item.index}`);
            item.remove();
            item.recycle();
            item.__next = item.__pre = item.data = undefined;
            item.index = -1;
            item.off(MouseEventX.MouseUp,this.itemClickHandler);
        }

        
        itemClickHandler(event:EventX):void{
            // this.removeItem(event.currentTarget as ListItem & Recyclable<Component>);
            // let item = event.currentTarget as Component;
            // item.remove();
        }

    }

    export class TestListItemRender extends Component{
        t:TextField;
        constructor(source?:BitmapSource){
            super(source);
            let g = this.graphics;
            g.clear();
            g.drawRect(0,0,100,20,Math.floor(Math.random()*0xFFFFFF));
            g.end();
            // this.t = new TextField()
            // this.addChild(this.t);
        }

        // doData(){
        //     this.t.text = (this as ListItem).index+"";
        // }


    }
}