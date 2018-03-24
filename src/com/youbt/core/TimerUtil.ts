module rf {
    const _timeobj: { [index: number]: GTimer2 } = {};

    function tick(timer: GTimer2) {
        timer.map.forEach((args, callback) => {
            callback.apply(undefined, args);
        })
    }

    function getInterval(time: number) {
        return Math.ceil(time / 30) * 30;
    }


    /**
     * GTimer
     */
    class GTimer2 {
        public tid: number;
        public map: Dictionary<Function, any[]>;

        constructor() {
            this.map = new Dictionary<Function, any[]>();
        }
    }



    export class TimerUtil {

        /**
         * 
         * 注册回调
         * @static
         * @param {number} time 回调的间隔时间，间隔时间会处理成30的倍数，向上取整，如 设置1ms，实际间隔为30ms，32ms，实际间隔会使用60ms
         * @param {Function} callback 回调函数，没有加this指针是因为做移除回调的操作会比较繁琐，如果函数中需要使用this，请通过箭头表达式()=>{}，或者将this放arg中传入
         * @param {any} args
         */
        public static addCallback(time: number, callback: Function, ...args) {
            time = getInterval(time);
            var timer = _timeobj[time];
            if (!timer) {
                timer = new GTimer2();
                timer.tid = setInterval(tick, time, timer);
                _timeobj[time] = timer;
            }
            timer.map.set(callback, args);
        }

        /**
         * 移除回调
         */
        public static removeCallback(time: number, callback: Function) {
            time = getInterval(time);
            var timer = _timeobj[time];
            if (timer) {
                var map = timer.map;
                map.delete(callback);
                if (!map.size) {
                    clearInterval(timer.tid);
                    delete _timeobj[time];
                }
            }
        }
    }
}