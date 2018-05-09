///<reference path="../com/youbt/mvc/manage/PanelSourceManage.ts" />
module rf{
    export class PanelUtils{
        skin:Component;
        setting:object;
        btn_random:IButton = null;
        btn_create:IButton = null;
        dele_info:IInfoDele = null;

        bg:IconView;

        source:AsyncResource;

        constructor(){
            this.source = sourceManger.load("../assets/create.p3d", "create");
            this.source.addEventListener(EventT.COMPLETE, this.asyncsourceComplete, this)
        }

        private asyncsourceComplete(e:EventX):void
        {
            const{source} = this;
            
            let clsname:string = "ui.asyncpanel.create";
            let cs:IDisplaySymbol = source.setting[clsname];

            this.skin = new Component(source.source);

            // uiparser.parser(this, cs);
            this.skin.setSymbol(cs);

            this.skin.renderer = new BatchRenderer(this.skin);
            popContainer.addChild(this.skin);

            this.bindComponents();
        }

        protected bindComponents():void
        {
            const{skin} = this;
            this.bg = new IconView(skin.source);
            skin.addChildAt(this.bg, 0);
            this.bg.setUrl('assets/createbg.jpg');

            this.btn_random = skin["btn_random"];
            this.btn_random.addClick(this.randomHandler);

            this.dele_info = skin["dele_info"];

            if(this.dele_info.btn_create != undefined)
            {
                this.dele_info.btn_create.addClick(this.createHandler);
            }else{
                alert("1112");
            }
        }

        protected randomHandler(e:EventX):void
        {
            alert("随机按钮点击");
        }

        protected createHandler(e:EventX):void
        {
            alert("dele_info 创建点击");
        }
    }

    export interface IInfoDele{
        txt_name:TextField;
        txt_warning:TextField;
        txt_cool:TextField;
        txt_addmsg:TextField;
        btn_random:IButton;
        btn_create:IButton;
    }
}