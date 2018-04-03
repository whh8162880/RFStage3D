declare let RELEASE;
declare let DEBUG;
RELEASE = false;
DEBUG = true;
module rf {

    export var ClientCheck = {
    	/**
    	 * 是否做客户端检查
    	 */
		isClientCheck: true
	}

    /**
     * 错误前缀
     */
    export var errorPrefix: string = "";

    export interface ThrowError {
        (msg: string, err?: Error, alert?: boolean): void;
        MaxCount?: number;
        errorMsg?: string[];
    }

    if (RELEASE) {
        /**
         * 内存中存储的错误数据信息
         * 
         */
        var errorMsg = [] as string[];
        /**
         * 在内存中存储报错数据
         * @param msg
         * @param atWho
         *
         */
        function pushMsg(msg: string): string {
            if (errorMsg.length > ThrowError.MaxCount) {
                errorMsg.shift();
            }
            var msg = getMsg(msg);
            errorMsg.push(msg);
            return msg;
        }
    }
    export declare var Log: { (...msg): void }
    if (DEBUG) {
        Log = function () {
            let msg = "%c";
            for (let i = 0; i < arguments.length; i++) {
                msg += arguments[i];
            }
            console.log(msg, "color:red");
        }
    }

    /**
    * 在内存中存储报错数据
    * @param msg
    * @private
    */
    function getMsg(msg: string): string {
        return new Date()["format"]("[yyyy-MM-dd HH:mm:ss]", true) + "[info:]" + msg;
    }

    /**
	 * 抛错
	 * @param {string | Error}  msg 描述
	 **/
    export const ThrowError: ThrowError = function (msg: string, err?: Error, alert?: boolean) {
        if (DEBUG && alert) {
            window.alert(msg);
        }
        msg = errorPrefix + msg;
        msg += `%c`;
        if (err) {
            msg += `\nError:\n[name]:${err.name},[message]:${err.message}`;
        } else {
            err = new Error();
        }
        msg += `\n[stack]:\n${err.stack}`;
        if (DEBUG) {
            msg = getMsg(msg);
        } else if (RELEASE) {
            msg = pushMsg(msg);
        }
        console.log(msg, "color:red");
    }

    if (RELEASE) {
        ThrowError.MaxCount = 50;
        ThrowError.errorMsg = errorMsg;
    }
}