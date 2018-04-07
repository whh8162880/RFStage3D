\\\\192.168.1.47/share/H5/H5安装/

    安装vscode  VSCodeSetup-x64-1.21.0.exe
    安装git Git-2.16.2-64-bit.exe
    安装node node-v8.10.0-x64.msi
    安装nginx nginx.rar [这个只需要解压就可以]



#帮助文档[俞佳妮完成 2018/3/23]

    \\\\192.168.1.47/share/H5/GIT 在VSCODE的基本操作.docx
    \\\\192.168.1.47/share/H5/Git操作.docx

#workspace规范 -> 创建文件夹 D:/workspace_ts/  然后在这个文件夹下面 【右键选择 Git Bash Here】 然后输入【git clone http://192.168.1.53:1234/MelonGroup/RFStage3D.git】(如果你的项目文件夹不在这里 那就去学下nginx怎么配置路径吧)

#node安装完毕再看下面!node安装完毕再看下面!node安装完毕再看下面!

#vscode插件

    cnpm    --淘宝npm源 提升插件下载速度  --npm i cnpm -g (提示npm不是命令？ node装了吗？node装了吗？node装了吗？ 装了还不行？重启vscode,重启电脑,重装系统再来一遍)
    Eclipse Keymap --快捷键改为和FlashBuilder一样


#如果未安装grunt 只需要执行 "cnpm install -g grunt-cli" 一下就可以。其他一切一切不用设置，不用设置，不用设置！！


#额外：grunt工具帮助文档[http://www.gruntjs.net/][窦孝诚完成 2018/3/23]
    \\\\192.168.1.47/share/H5/ts打包为xxx.min.js.docx

    
#启动项目

    step1:输入grunt (提示grunt不是命令？ grunt装了吗？grunt装了吗？grunt装了吗？)
    step2:打开chrome 输入http://127.0.0.1/ts/RFStage3D/bin-debug/ (【提示无法打开页面？ 眉头一皱,nginx启动了吗】 【提示404? workspace规范看了吗？本文档第15行附近】)

#调试

    在chrome中 按F12 会出现 Developer Tools 选择 Source 在左边Network下断电 [后续文档再补充]


#技巧
    查找类可以通过【ctrl+t】来搜索。(不理解？没关系,以后你会很理解的[淡定]。)

#2018/3/24

[ClassUtils.ts  对象创建器][通过测试]

    对象池 常用对象用 let obj:Recyclable<Class> = recyclable(Class) 创建 回收用 obj.recycle();
    
    单例对象用 let obj:Class = singleton(Class)创建

[Link.ts    代替array的高性能双链表(性能未测试)][性能未测试]
```typescript
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
```       
#2018/3/25

[Engine.ts  心跳脉动][通过测试]
```typescript
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
```
[MiniDispathcer.ts  事件分发][通过测试]
```typescript
    addEventListener(type,hander,thisObj[注意:js在执行function是在一个大环境下执行 并不能获得方法所在对象this],priority)
    removeEventListener(type,handler)
```
初始化了stage3d 基础对象

#2018/3/26
    
[ByteArray.ts   ][]

[BitmapData.ts  ][]

添加了tween组件[未测试]
    
    
#2018/3/27

[NET.ts 窦孝诚完成 ][]


#2018/3/28

[RES.ts 窦孝诚完成][]

[Stage3D.ts][]

[Buffer3D.ts][]

[Context3D.ts][]

#2018/3/29

    完善 Stage3D.ts Buffer3D.ts Context3D.ts
    完善 RES.ts [窦孝诚完成]
    图片装箱测试 [窦孝诚完成]

[Texture.ts][] 第一版 还不够完善

#2018/3/30

[Geometry.ts][VertexInfo]

[Sprite3D.ts][Graphics BatchRenderer BatchGeometry] 模型合并已经初步完成 详见BatchRenderer

[Geom.ts][Float32Byte] 

[Camera.ts][Camera2D]

[Capabilities.ts 窦孝诚完成][]


#2018/3/31


#2018/4/7
    
    手机内存占用越高，性能就越差。
    