/// <reference path="./ClassUtils.ts" />
module rf {
    export class LinkVO implements IRecyclable {

        close:boolean = true;
        data: any;
        args: any;
        thisObj:any;

        next: Recyclable<LinkVO> ;
        pre: Recyclable<LinkVO> ;

        weight: number = 0;

        time:number = 0;

        onRecycle() {
            this.data = undefined;
            this.args = undefined;
            this.thisObj = undefined;
            this.next = undefined;
            this.pre = undefined;
            this.weight = 0;
            this.close = true;
        }

        onSpawn(){
            this.close = false;
        }
    }

    export class Link {

        private last: Recyclable<LinkVO> = undefined;
        private first: Recyclable<LinkVO> = undefined;

        public id: any = undefined;
        public length: number = 0;
        public warningMax: number = 200;
        public checkSameData: boolean = true;

        public getFrist(): Recyclable<LinkVO> {
            if (undefined == this.first) return undefined;
            let vo: Recyclable<LinkVO> = this.first;
            while (vo) {
                if (false == vo.close) {
                    return vo;
                }
                vo = vo.next;
            }
            return undefined;
        }

        public getLast(): Recyclable<LinkVO> {
            if (undefined == this.last) return undefined;
            let vo: Recyclable<LinkVO> = this.last;
            while (vo) {
                if (false == vo.close) {
                    return vo;
                }
                vo = vo.pre
            }
            return undefined;
        }


        public getValueLink(value: any,thisObj:object): Recyclable<LinkVO> {
            let vo: Recyclable<LinkVO> = this.getFrist();
            if (undefined == vo) return undefined;
            while (vo) {
                if (false == vo.close) {
                    if (value == vo.data && thisObj == vo.thisObj) {
                        return vo;
                    }
                }
                vo = vo.next;
            }
            return undefined;
        }


        public add(value: any, thisObj?:object, args?: any): Recyclable<LinkVO> {
            if (!value) return undefined;
            var vo: Recyclable<LinkVO>
            if (this.checkSameData) {
                vo = this.getValueLink(value,thisObj);
                if (vo && vo.close == false) return vo;
            }


            vo = recyclable(LinkVO);
            vo.data = value;
            vo.args = args;
            vo.thisObj = thisObj;
            this.length++;

            if (undefined == this.first) {
                this.first = this.last = vo;
            } else {
                vo.pre = this.last;
                this.last.next = vo;
                this.last = vo
            }


            return vo;
        }


        public addByWeight(value: any, weight: number, thisObj?:object, args?: any): Recyclable<LinkVO> {
            if (!value) return undefined;
            var vo: Recyclable<LinkVO>

            if (this.checkSameData) {
                vo = this.getValueLink(value,thisObj);
                if (vo && vo.close == false) {
                    if (weight == vo.weight) {
                        return vo;
                    }
                    vo.close = true;
                }
            }

            vo = recyclable(LinkVO);
            vo.weight = weight;
            vo.data = value;
            vo.args = args;
            this.length++;

            if (undefined == this.first) {
                this.first = this.last = vo;
            } else {
                let tempvo = this.getFrist();
                if (undefined == tempvo) {
                    vo.pre = this.last;
                    this.last.next = vo;
                    this.last = vo;
                } else {
                    while (tempvo) {
                        if (false == tempvo.close) {
                            if (tempvo.weight < weight) {
                                vo.next = tempvo;
                                vo.pre = tempvo.pre;
                                if (undefined != tempvo.pre) {
                                    tempvo.pre.next = vo;
                                }
                                tempvo.pre = vo;
                                if (tempvo == this.first) {
                                    this.first = vo;
                                }
                                break;
                            }
                        }
                        tempvo = tempvo.next;
                    }

                    if(undefined == tempvo){
                        vo.pre = this.last;
                        this.last.next = vo;
                        this.last = vo;
                    }
                }
            }
            return vo;
        }


        public remove(value: any,thisObj?:any): void {
            let vo: Recyclable<LinkVO> = this.getValueLink(value,thisObj);
            if (!vo) return;
            this.removeLink(vo);
        }

        public removeLink(vo: Recyclable<LinkVO>): void {
            this.length--;
            vo.close = true;
            vo.data = null;
            TimerUtil.add(this.clean, 1000);
        }

        public clean(): void {
            let vo = this.first;
            var next;
            this.length = 0;
            while (vo) {
                next = vo.next;
                if (true == vo.close) {
                    if (vo == this.first) {
                        this.first = vo.next;
                        if(undefined != this.first){
                            this.first.pre = undefined;
                        }
                    } else {
                        vo.pre.next = vo.next;
                    }

                    if (vo == this.last) {
                        this.last = vo.pre;
                        if(undefined != this.last){
                            this.last.next = undefined;
                        }
                    } else {
                        vo.next.pre = vo.pre;
                    }
                    vo.recycle();
                } else {
                    this.length++;
                }
                vo = next;
            }
        }


        public pop(): any {
            let vo = this.getLast();
            if (vo) {
                let data = vo.data;
                this.removeLink(vo);
                return data;
            }
            return undefined;
        }

        public shift(): any {
            let vo = this.getFrist();
            if (vo) {
                let data = vo.data;
                this.removeLink(vo);
                return data;
            }
            return undefined;
        }

        public exec(f: Function): void {
            if (undefined == f) return;
            let vo = this.getFrist();
            while (vo) {
                let next = vo.next;
                if (false == vo.close) {
                    f(vo.data);
                }
                vo = vo.next;
            }
        }


        public onRecycle(): void {
            let vo = this.first;
            var next;
            while (vo) {
                next = vo.next;
                vo.recycle();
                vo = next;
            }
            this.first = this.last = undefined;
            this.length = 0;
            this.checkSameData = true;
        }

        public toString(): string {
            let vo = this.getFrist();
            let s: string = "list:";
            while (vo) {
                let next = vo.next;
                if (false == vo.close) {
                    s += vo.data + ","
                }
                vo = vo.next;
            }
            return s;
        }
    }

    export interface LinkItem extends IRecyclable{
        __next?:LinkItem;
        __pre?:LinkItem;
    }

    // export class TLink<T>{
    //     private last: TLinkItem<T>;
    //     private first: TLinkItem<T>;

    //     add(item:{}){
    //         let b = item as TLinkItem<typeof item>;
    //         if(b.__next || b.__pre){
    //             return b;
    //         }
    //         let{last,first}=this;

    //         if(first){

    //         }

    //         if(!this.last )
    //     }

    //     remove(item:{}){
    //         let b = item as TLinkItem<typeof item>;

    //         b.__next = b.__pre = undefined;
    //     }
    // }
}