module rf{
    export var skill_Perfix: string;


    export interface ISkillEffectCreateEvent extends ISkillBaseEvent{
        res:string;
    }
    export function skill_MeshCreate(line:ISkillLineData,event:ISkillEffectCreateEvent){
        let mesh = line.runtime[event.key];
    }

    export class Skill extends SceneObject{
        
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

        data:ISkillData;

        play(data:ISkillData){
            
        }

        update(now: number, interval: number): void{

        }
    }
}