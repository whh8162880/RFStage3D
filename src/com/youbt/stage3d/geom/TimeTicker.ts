module rf{
    export interface ITimeTicker{
        time:number;
        speed:number;
    }

    export function newTimeTicker():ITimeTicker{
        return {time:0,speed:1};
    }

    
    export function TTAdd(t:ITimeTicker,interval:number){
        t.time += interval * t.speed;
        return t.time;
    }
}