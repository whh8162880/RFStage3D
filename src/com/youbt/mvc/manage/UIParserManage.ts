module rf{
    //思路：生成接口类型 接口包含有名称的内容 解析内容时对应赋值 子对象依然是这样操作
    //目前只在第一层操作是这样 子对象应该还没有实现 待实现
    export class UIParserManage{
        private _funcs:object;
        constructor(){
            //初始保存创建方法
            let funcs:object = {};
            funcs["btn"] = this.parserBtn;
            funcs["txt"] = this.parserTxt;
            funcs["ck"] = this.parserCk;
            funcs["rb"] = this.parserRb;
            funcs["dele"] = this.parserDele;

            this._funcs = funcs;

            funcs = null;
        }


        parser(m:any, setting:IDisplaySymbol):void
        {
            let keys:any[] = Object.keys(m);
            //根据setting 生成对应的组件 赋值给skin mediator
            let skin:Component = m.skin;
            // let source:BitmapSource = skin.source;
            if(setting == undefined)
            {
                return;   
            }

            let elements = setting.displayFrames[setting.displayClip];
            if(undefined == elements)
			{
				return;
            }

            this.parserElements(skin, elements);
        }

        parserElements(skin:any, arr:any[]):void
        {
            let source:BitmapSource = skin.source;
            let childsp:any;

            let {_funcs} = this;

            let names:any[];
            for(let ele of arr)
			{
                if(ele.name != undefined)
                {
                    names = ele.name.split("_");
                    if(names && names.length > 0)
                    {
                        //这是有可能有组件的 找不到就直接默认形式
                        let typename:string = names[0];
                        let func:Function = _funcs[typename];
                        if(func != undefined)
                        {
                            childsp = func(ele, source);
                            skin.addChild(childsp);
                        }else{
                            childsp = this.parserNormal(ele, source);
                            skin.addChild(childsp);
                        }
                        // if(m.hasOwnProperty(ele.name))
                        // {
                        //     m[ele.name] = childsp;
                        // }
                    }
                }else{
                    childsp = this.parserNormal(ele, source);
                    skin.addChild(childsp);
                }
			}
        }

        parserBtn(ele:IDisplayFrameElement, source:BitmapSource):Button
        {
            var btn:Button = new Button(source);
            btn.setSymbol(ele as IDisplaySymbol);
            return btn;
        }

        parserTxt(ele:IDisplayFrameElement, source:BitmapSource):TextField
        {
            let textElement = ele as IDisplayTextElement;
            let txtfield:TextField = recyclable(TextField);
            let e_format:object = textElement.format;
            let format:TextFormat = recyclable(TextFormat).init();
            format.size = e_format["size"] == undefined ? 12 : e_format["size"];
            format.align = e_format["alignment"] == undefined ? "left" : e_format["alignment"];

            txtfield.init(source, format);
            txtfield.color = textElement.color;
            txtfield.multiline = textElement.multiline;
            if(textElement.input){
                txtfield.type = TextFieldType.INPUT;
                txtfield.mouseEnabled = true;
            }else{
                txtfield.type = TextFieldType.DYNAMIC;
            }
            
            txtfield.setSize(textElement.width,textElement.height);
            txtfield.text = textElement.text;
            txtfield.x = ele.x;
            txtfield.y = ele.y;
            if(ele.name){
                txtfield.name = ele.name;
            }
            return txtfield;
        }

        parserCk(ele:IDisplayFrameElement, source:BitmapSource):any
        {
            var btn:CheckBox = new CheckBox(source);
            btn.setSymbol(ele as IDisplaySymbol);
            return btn;
        }

        parserRb(ele:IDisplayFrameElement, source:BitmapSource):any
        {
            return undefined;
        }

        parserNormal(ele:IDisplayFrameElement, source:BitmapSource):any
        {
            let sp:any;
            if(ele.rect){//目前还没写9宫
                //sp = new ScaleRectSprite3D(source);
            }else{
                sp = new Component(source);
            }
            sp.mouseEnabled = true;
            sp.x = ele.x;
            sp.y = ele.y;
            
            (sp as Component).setSymbol(ele as IDisplaySymbol);
            
            sp.name = ele.name;
            
            sp.setSize(Math.round(sp.w * ele.scaleX),Math.round(sp.h * ele.scaleY));

            return sp;
        }

        parserDele(ele:IDisplayFrameElement, source:BitmapSource):any
        {
            let sp:any;
            if(ele.rect){//目前还没写9宫
                //sp = new ScaleRectSprite3D(source);
            }else{
                sp = new Component(source);
            }
            sp.mouseEnabled = true;
            sp.x = ele.x;
            sp.y = ele.y;
            
            (sp as Component).setSymbol(ele as IDisplaySymbol);
            
            sp.name = ele.name;
            
            sp.setSize(Math.round(sp.w * ele.scaleX),Math.round(sp.h * ele.scaleY));

            return sp;
        }
    }

    export let uiparser:UIParserManage = singleton(UIParserManage);
}