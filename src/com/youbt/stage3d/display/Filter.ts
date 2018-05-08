module rf{
    export const enum FilterConst{
        POS = 600,
        SCA,
        ROTATION,
        ALPHA
    }

    export interface IFilterBase{
        type:number;
        key:string;
        target:Sprite;
        tweener:ITweener;
        enabled:boolean;
    }

    export function newFilterBase(target:RenderBase,type:number):IFilterBase{
        return {type:type,target:target} as IFilterBase;
    }
}