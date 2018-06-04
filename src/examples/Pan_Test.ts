module rf{
    export class Pan_Test{
        constructor(){
            // let utils = new PanelUtils();
            mainKey.regKeyDown(Keybord.A,this.onKeyDownHandle,this)
        }

        onKeyDownHandle(e:KeyboardEvent):void{
            facade.toggleMediator(TestMediator);
            facade.toggleMediator(CreateMediator);
        }
    }
}