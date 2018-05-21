/// <reference path="../stage3d/display/Component.ts" />
module rf{
    export interface IListOption {
        itemWidth?: number;     //item 宽度
        itemHeight?: number;
        vertical?:boolean;
        columnCount?: number;
        clazz?:{new ():Component};

        // type?: ScrollDirection;
        // con?: egret.Sprite;
        // noScroller?: boolean;
    }


    export class List extends Component{

        data:{}[];
        option : IListOption;
        selectedIndex:number = -1;

        constructor(option?:IListOption,source?:BitmapSource){
            super(source);
            this.option = option;
        }
        
        init(Clazz:{new ():Component},itemWidth:number,itemheight:number,vertical:boolean = true,columnCount:number = -1){
            this.option = {itemWidth:itemWidth,itemHeight:itemheight,vertical:vertical,columnCount:columnCount,clazz:Clazz} as IListOption;
            return this;
        }

        displayList(data?:{}[]) {
            this.selectedIndex = -1;
        }
    }
}