\\\\192.168.1.47/share/H5/H5安装/

安装vscode  VSCodeSetup-x64-1.21.0.exe  
安装git Git-2.16.2-64-bit.exe

[帮助文档 俞佳妮完成 2018/3/23][]

    \\\\192.168.1.47/share/H5/GIT 在VSCODE的基本操作.docx
    
    \\\\192.168.1.47/share/H5/Git操作.docx


安装npm,node

注意配置好环境变量

[安装grunt工具 http://www.gruntjs.net/][窦孝诚完成 2018/3/23]

    \\\\192.168.1.47/share/H5/ts打包为xxx.min.js.docx
    
[][2018/3/24]

[ClassUtils.ts  对象创建器][通过测试]

    对象池 常用对象用 let obj:Recyclable<Class> = recyclable(Class) 创建 回收用 obj.recycle();
    
    单例对象用 let obj:Class = singleton(Class)创建

[Link.ts    代替array的高性能双链表(性能未测试)][性能未测试]

    添加
        add(value,args?)
        addByWeight(value,weight,args?)
    删除
        remove(value)
    循环
        let vo = link.getFrist();
        while(vo){
            let next = vo.next;
            if(false == vo.close){
                let data = vo.data;
                let args = vo.args;
               //todo you function
            }
            vo = next;
        }
       
[][2018/3/25]

[Engine.ts  心跳脉动][通过测试]

    事件发生器:Engine.dispatcher 
        EventX.ENTER_FRAME  当渲染时发起事件
        EngineEvent.VISIBILITY_CHANGE  浏览器最小化/恢复时发出事件
        EngineEvent.FPS_CHANGE  每秒发出一次事件
    属性
        Engine.now 本帧时间
        Engine.interval 上一帧到本帧时间间隔
        Engine.hidden   窗口是否最小化
        Engine.fps 之前一秒fps
        Engine.code 之前一秒code执行的事件 单位ms
        Engine.frameRate 当前目标fps
    方法
        Engine.addTick(tick:Itickable)  注册心跳
        Engine.removeTick(tick:Itickable)   移除心跳
        getTimer()  获得运行事件

[MiniDispathcer.ts  事件分发][通过测试]

    addEventListener(type,hander,thisObj[注意:js在执行function是在一个大环境下执行 并不能获得方法所在对象this],priority)
    removeEventListener(type,handler)
    
初始化了stage3d 基础对象

[][2018/3/26]
    
[ByteArray.ts   ][]

[BitmapData.ts  ][]

添加了tween组件
    
    
[][2018/3/27]

[NET.ts 窦孝诚完成 ][]