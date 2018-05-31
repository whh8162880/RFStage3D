module rf{
	export class InfoDele extends Component{
       	private dele:InfoDele & IMODULE_CREATE_DELE_INFO;
       	
        bindComponents():void{
        	this.dele = this as InfoDele & IMODULE_CREATE_DELE_INFO;
        }
    }
}