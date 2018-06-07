module rf{
	export class InfoDele extends TEventInteresterDele{
	
        $skin:InfoDele & IMODULE_CREATE_DELE_INFO;
        
        constructor(skin: Component) {
            super(skin);
        }

		protected bindEventInterests(): void {

        }
        
        bindComponents():void{
             this.$skin = this._skin as InfoDele & IMODULE_CREATE_DELE_INFO;
        }

        awaken(): void {
        
        }
    }
}