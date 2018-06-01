module rf{
	export class InfoDele extends TEventInteresterDele{
	
        $skin:Component & IMODULE_CREATE_DELE_INFO;
        
        constructor(skin: Component) {
            super(skin);
        }

		protected bindEventInterests(): void {

        }
        
        bindComponents():void{
             this.$skin = this._skin as Component & IMODULE_CREATE_DELE_INFO;

             this.$skin.txt_addmsg.label = "++6969";
        }

        awaken(): void {
        
        }
    }
}