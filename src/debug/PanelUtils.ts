module rf{
    export class PanelUtils{
        skin:Component;
        setting:object;
        btn_random:Button;
        btn_create:Button;

        bg:IconView;

        manage:PanelSourceManage;

        source:AsyncResource;

        constructor(){
            let {manage} = this;
            manage = singleton(PanelSourceManage);
            this.source = manage.load("../assets/create.p3d", "create");
            this.source.addEventListener(EventT.COMPLETE, this.asyncsourceComplete, this)
        }

        private asyncsourceComplete(e:EventX):void
        {
            const{source} = this;
            
            let clsname:string = "ui.asyncpanel.create";
            let cs:DisplaySymbol = source.setting[clsname];
            
            this.skin = new Component(source.source);
            this.skin.setSymbol(cs);
            this.skin.renderer = new BatchRenderer(this.skin);
            popContainer.addChild(this.skin);

            this.bindComponents();
        }

        protected bindComponents():void
        {
            const{skin} = this;
            this.btn_random = new Button(skin["btn_random"]);
            this.btn_create = new Button(skin['btn_create']);

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

    let sourceManger:PanelSourceManage = singleton(PanelSourceManage)
}