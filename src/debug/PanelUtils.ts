///<reference path="../com/youbt/mvc/manage/PanelSourceManage.ts" />
module rf{
    export class PanelUtils{
        skin:Component;
        setting:object;
        btn_random:IButton = null;
        btn_create:IButton = null;

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

            uiparser.parser(this, cs);

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

            this.btn_random.addClick(this.randomHandler);
        }

        protected randomHandler(e:EventX):void
        {
            alert("随机按钮点击");
        }
    }
}