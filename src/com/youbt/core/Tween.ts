module rf {
    //===========================================================================================
    // Tweener
    //===========================================================================================

    export type EaseFunction = (t: number, b: number, c: number, d: number, ...args) => number;

    export type TweenUpdateFunction = (tweener: ITweener) => void;

    export interface ITweenerItem {
        k: string;   //property
        s: number;   //startValue
        e: number;   //endValue
        d: number;   //d = e - s;
        n?: number;
    }

    export interface ITweener {
        caster: { [key: string]: number };
        st: number;
        duration: number;
        l: number;
        tm: ITimeMixer;
        data: ITweenerItem[];
        ease: EaseFunction;
        update: TweenUpdateFunction;
        complete: TweenUpdateFunction;
        thisObj: any;
        completed:boolean;
    }

    export function defaultEasingFunction(t: number, b: number, c: number, d: number): number {
        return c * t / d + b;
    }

    export var tweenLink: Link = new Link();

    export function createTweener(eo: { [key: string]: number }, duration: number, tm: ITimeMixer, target?: any, ease?: EaseFunction, so?: { [key: string]: number }) {
        let tweener = { data: [], caster: target, tm: tm, st: tm.now, ease: ease ? ease : defaultEasingFunction, duration: duration } as ITweener;
        let { data } = tweener;
        let l = 0, e = 0, d = 0, s = 0;
        for (let k in eo) {
            if (target) {
                s = target[k];
                if (undefined != s) {
                    s = (so && undefined != so[k]) ? so[k] : s;
                }else{
                    s = 0;
                }
            } else {
                s = (so && undefined != so[k]) ? so[k] : 0;
            }
            e = eo[k];
            data[l++] = { k: k, s: s, e: e, d: e - s, n: 0 }
        }
        tweener.l = l;
        return tweener;
    }


    export function tweenTo(eo: { [key: string]: number }, duration: number, tm: ITimeMixer, target?: any, ease?: EaseFunction, so?: { [key: string]: number }) {
        let tweener = createTweener(eo, duration, tm, target, ease, so);
        if (tweener.l > 0) {
            tweenLink.add(tweener);
        }
        return tweener;
    }

    export function tweenUpdate() {
        for (let vo = tweenLink.getFrist(); vo; vo = vo.next) {
            if (vo.close == false) {
                let tweener = vo.data as ITweener;
                const { caster, l, data, ease, tm, st, duration, update, thisObj } = tweener;
                let now = tm.now - st;
                if (now >= duration) {
                    tweenEnd(tweener);
                } else {
                    for (let i = 0; i < l; i++) {
                        let item = data[i];
                        const { k, s, d } = item;//data[i];
                        item.n = ease(now, s, d, duration);
                        if (caster) {
                            caster[k] = item.n;
                        }
                    }
                    if (undefined != update) {
                        update.call(thisObj, tweener);
                    }
                }

            }
        }
    }

    export function tweenEnd(tweener: ITweener) {
        if(tweener.completed) return;
        const { caster, l, data, update,complete, thisObj} = tweener as ITweener;
        for (let i = 0; i < l; i++) {
            let item = data[i];
            const { k, e } = item;
            item.n = e;
            if (caster) {
                caster[k] = e;
            }
        }

        if(undefined != update){
            update.call(thisObj, tweener);
        }

        if (undefined != complete) {
            complete.call(thisObj, tweener);
        }
        tweenLink.remove(tweener);
        tweener.completed = true;
    }

    export function tweenStop(tweener: ITweener) {
        if(tweener.completed) return;
        tweenLink.remove(tweener);
        tweener.completed = true;
    }

}