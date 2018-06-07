module rf{
    export class UIMain extends AppBase{

        init(canvas?:HTMLCanvasElement){
            super.init(canvas);
            if(undefined == gl){
                return;
            }
            let perfix = "../assets/"
            ROOT_PERFIX = perfix;
            
            facade.toggleMediator(TestMediator);
        }
    }
}