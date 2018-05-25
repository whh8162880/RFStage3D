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

    export interface ListItem extends LinkItem{
        data?:{};
        index?:number;
    }

    export class List extends Component{

        datas:{}[];
        option : IListOption;
        selectedIndex:number = -1;
        first:ListItem & Recyclable<Component>;
        last:ListItem & Recyclable<Component>;
        displayCount:number = -1;
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
        }

        displayList(data?:{}[]) {
            this.selectedIndex = -1;
            this.datas = data;
            this.refreshList();
            

            let{option,scroll}=this;
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
            let{first}=this;
            while(first){
                let f = first.__next as ListItem & Recyclable<Component>;
                this.removeItem(first);
                first = f;
            }
            this.first = this.last = undefined;
        }


        setSize(width:number, height:number)
        {
            super.setSize(width,height);
            let{option,scroll}=this;
            let{gap,vertical,columnCount}=option;
            let count = 1;
            if(vertical){
                let{itemHeight}=option;
                count = Math.ceil(height / itemHeight) + 1;
            }else{
                let{itemWidth}=option;
                count = Math.ceil(width / itemWidth) + 1;
            }
            this.displayCount = count;
            if(!scroll){
                this.renderer = new BatchRenderer(this);
                this.scroll = scroll = new Scroll(this,width,height);
                if(vertical){
                    scroll.hStep = 0;
                }else{
                    scroll.vStep = 0;
                }
            }else{
                scroll.setArea(width,height,this.w,this.h);
            }
            
        }


        refreshList(){
            let{datas,displayCount,first,last}=this;
            let start:number,len:number,datalen:number;
            datalen = datas.length;
            if(displayCount == -1){
                start = 0;
                len = datalen;
            }else{
                let{option,scrollRect} = this;
                let{vertical,itemWidth,itemHeight} = option;
                if(vertical){
                    start = Math.clamp(Math.floor(scrollRect.y / itemHeight) - 1,0,datalen - displayCount);
                }else{
                    let{x}=scrollRect;
                    start = Math.clamp(Math.floor(scrollRect.x / itemWidth) - 1,0,datalen - displayCount);
                }
                len = start + displayCount;
            }

            if(first && (first.index > len || last.index < start)){
                this.clear();
            }else{
                while(first){
                    let f = first.__next as ListItem & Recyclable<Component>;
                    if(first.index < start){
                        this.removeItem(first);
                    }
                    first = f;
                }
                this.first = first;

                while(last){
                    let l = last.__pre as ListItem & Recyclable<Component>;
                    if(last.index > len){
                        this.removeItem(last);
                    }
                    last = l;
                }
                this.last = last;
            }


            for(let i = start;i < len;i++){
                if(first && first.__next){
                    first = first.__next as ListItem & Recyclable<Component>;
                }else{
                    let ins = this.addItem(i,datas[i]);
                    if(!last){
                        this.first = this.last = last = ins;
                    }else{
                        last.__next = ins;
                        this.last = ins;
                    }
                }
            }
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
            return ins;
        }


        removeItem(item:ListItem & Recyclable<Component>){
            item.remove();
            item.recycle();
            item.__next = item.__pre = item.data = undefined;
            item.index = -1;
            item.off(MouseEventX.MouseUp,this.itemClickHandler);
        }

        
        itemClickHandler(event:EventX):void{

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
            this.t = new TextField()
            this.addChild(this.t);
        }

        doData(){
            this.t.text = (this as ListItem).index+"";
        }


    }
}