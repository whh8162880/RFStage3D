module rf{


    export interface IUVMap{
        sp:number;
        w:number;
        h:number
    }

    export class Map extends Sprite{
        bg0:Image;
        bg1:Image;
        bg2:Image;

        addbg1(url:string,sp:number){
            let bg0 = new Image();
            bg0.load(url);
            this.addChild(bg0);
        }

    }

}