module rf{

    export interface ANIData{
        p:string //平台
        i:string //使用的图片名称
        r:number //角度
        sx:number //scaleX
        sy:number //scaleY
        l:number //loop 第几帧开始循环播放 -1播放一遍
        f:number //fps 2帧之间间隔时间为 1000 / f
        fs:IUVFrame[] //帧列表
    }

    export class Ani extends Sprite{

    }

}