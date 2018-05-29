///<reference path="../com/youbt/mvc/MVC.ts" />
module rf{
    export class PanelUtils{
        constructor(){
            mainKey.regKeyDown(Keybord.A,this.onKeyDownHandle,this)
        }
    
        onKeyDownHandle(e:KeyboardEvent):void{
            facade.toggleMediator(CreateMeidator);
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

    export class CreateMeidator extends Mediator{
        static NAME:string = "CreateMeidator";
        $panel:CreatePanel;
        constructor(){
            super(CreateMeidator.NAME);
            this.setPanel(new CreatePanel());
        }
        mediatorReadyHandle():void{
            super.mediatorReadyHandle();
        }

        awaken():void{
            console.log("CreateMeidator awaken")
        }

    }

    export class CreatePanel extends Panel{
        constructor(){
            super("create","ui.asyncpanel.create");
        }

        btn_random:Button = null;
        btn_create:Button = null;
        dele_info:IInfoDele = null;
        bar_scroll:ScrollBar = null;

        bg:IconView;

        bindComponents():void{
            this.centerFlag = true;
            this.resizeable = true;
            this.setSize(1400, 750);

            this.bg = new IconView(this.source);
            this.addChildAt(this.bg, 0);
            this.bg.setUrl(ROOT_PERFIX + 'createbg.jpg');
            this.bg.setSize(1400, 750);

            // let scroll:ScrollBar = new ScrollBar(this.scrollbar);
            this.bar_scroll.init(this.bg, 500, 400, ScrollType.V_SCROLL);
            // this.btn_random = skin["btn_random"];
            this.btn_random.addClick(this.randomHandler, this);

            if(this.dele_info.btn_create != undefined)
            {
                this.dele_info.btn_create.addClick(this.createHandler, this);
            }
        }

        protected createHandler(e:EventX):void
        {
            alert("dele_info 创建点击");
        }

        protected randomHandler(e:EventX):void
        {
            alert("随机按钮点击");
        }
        
        key:KeyManagerV2
        awaken():void{
            this.key = new KeyManagerV2(this);
            this.key.regKeyDown(Keybord.B,this.onKeyHandle,this);
            this.key.awaken();
        }

        onKeyHandle(e:KeyboardEvent):void{
            console.log("key_down_"+e.keyCode);
        }

        sleep():void{
            this.key.sleep();

            console.log("key_sleep");
        }

    }

    export class CreateModel extends BaseModel{
        constructor(){
            super("CreateModel");
        }
    }
}