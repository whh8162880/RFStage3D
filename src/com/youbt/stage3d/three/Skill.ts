module rf{
    export var skill_Perfix: string;
    export class Skill extends SceneObject{
        constructor(){
            super();
        }
        
        load(url: string) {
            if (url.lastIndexOf(ExtensionDefine.SKILL) == -1) {
                url += ExtensionDefine.SKILL;
            }
            if (url.indexOf("://") == -1) {
                url = skill_Perfix + url;
            }
            loadRes(url, this.loadCompelte, this, ResType.bin);
        }

        loadCompelte(e: EventX) {
            let item: ResItem = e.data;
            let byte = item.data;
            this.play(amf_readObject(byte));
        }


        play(data:ISkillData){

        }

        update(now: number, interval: number): void{

        }
    }
}