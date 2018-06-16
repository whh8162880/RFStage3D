module rf{
    export interface ICodeExecBase{
        type:string;
    }

    export interface ICodeCalc extends ICodeExecBase{
        value:(string | ICodeCalc)[];
    }

    export interface ICodeProperty extends ICodeExecBase{
        property:string[];
    }

    export interface ICodeLimit extends ICodeExecBase{
        value_left:number | string | ICodeExecBase;
        bijiao:string;
        value:number | ICodeExecBase;
    }

    export interface ICodeFunction extends ICodeExecBase{
        name:string;
        propertys:any[];
    }

    export interface ICodeModule extends ICodeExecBase{
        list:any[];
        limit:any;
    }

    export interface ICodeCalcString extends ICodeExecBase{
        desc:string;
        propertys:any[];
    }


    export const enum CodeType{
        JSCalcString = "JSCalcString",
        JSModule = "JSModule",
        JSFunction = "JSFunction",
        calc = "calc",
        JSProperty = "JSProperty"
    }

    export var codeParsers:{[key:string]:IFunction} = {};


    export function codeIntParser(leftval:number, operator:string , rightval:number){
        if(operator == ":"){
            rightval = Math.abs(rightval);
        }
        return eval(leftval + operator + rightval);
    }



    export function codeParserLimit(self:any,property: string | ICodeLimit[],params?:any){
        let len = property.length;
        let result = false;
        while(len--){
            let{value_left,value,bijiao}=property[len] as ICodeLimit;
            value_left = codeDoProperty(self,value_left,params);
            value = codeDoProperty(self,value,params);
            let b = codeIntParser(value_left as number,bijiao,value as number) as boolean;

            if(len <= 0){
                return result || b;
            }

            len--;
            switch(property[len]){
                case "&&":
                    if(!b){
                        return false;
                    }
            }

            result = result || b;
        }

        return result;
    }



    export function codeDoProperty(self:object,property:string | number | ICodeExecBase,params?:object){
        if(!params){
            params = self;
        }

        if(property.hasOwnProperty("type") == false){
            let p = property as string;
            if(p == "self"){
                return self;
            }
            if(params.hasOwnProperty(p)){
                return params[p]
            }
            return property;
        }


        let p = property as ICodeExecBase;
        let type = p.type;

        if(type == CodeType.JSCalcString){
            let p = property as ICodeCalcString;
            let result:number[] = [];
            p.propertys.forEach(element => {
                let rev = codeDoProperty(self,element,params);
                result.push(rev);
            });
            return p.desc.substitute(result);
        }


        // if(type == CodeType.JSModule){
        //     let p = property as ICodeModule;
        //     let{limit,list}=p;
        //     if(limit){
        //         if(codeParserLimit(self,limit,params) == false){
        //             return null;
        //         }
        //     }
        //     if(!list){
                
        //     }
        // }

        if(type == CodeType.JSFunction){
            let{name,propertys} = property as ICodeFunction;
            let f = codeParsers[name];
            let func:Function;
            let thisobj:object;
            if(!f){
                if(self.hasOwnProperty(name)){
                    func = self[name];
                    thisobj = self;
                }
            }else{
                func = f.func;
                thisobj = f.thisobj;
            }

            if(func){
                let o = {};
                for(let key in propertys){
                    o[key] = codeDoProperty(self,propertys[key],params);
                }
                o["params"] = params;
                return func.call(thisobj,o);
            }
            return undefined;
        }


        if(type == CodeType.calc){
            let{value}=property as ICodeCalc
            let len = value.length - 1;
            let v = codeDoProperty(self,value[len],params) as number;
            while(len > 0){
                let calctype = value[len - 1] as string;
                let dv = codeDoProperty(self,value[len-2],params) as number;
                len -= 2;
                v = eval(v+calctype+dv);
            }
            return v;
        }

        if(type == CodeType.JSProperty){
            let{property:temp} = property as ICodeProperty;
            let o = params;
            temp.forEach(element => {
                if(o.hasOwnProperty(element)){
                    o = o[element];
                }else{
                    return undefined;
                }
            });
            return o;
        }
        

        return property;

    }
}