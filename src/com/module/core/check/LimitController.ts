module rf{
    export interface ILimit{
        data:string;
        type:string;
        value:any[];
    }

    export interface ILimitValue{
        basedata:string;
        count:any[];
        target:object;
        type:string;
        value:any[];
    }

    export interface IValue{
        basedata:string;
        bijiao:string;
        pt:string;
        type:string;
        value:number;
        value_left:string;
    }
}