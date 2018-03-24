/// <reference path="./com/youbt/core/Link.ts" />
/// <reference path="./com/youbt/core/Engine.ts" />
module rf{
    export class Main implements ITickable{
        constructor(){      
            Engine.start();
            this.callLaterTest();
        }

        public linktest():void{
            let vo = recyclable(Link);
            vo.add(1);
            vo.add(2);
            vo.add(3);
            console.log(vo.toString());
            vo.remove(2);
            console.log(vo.toString());
            vo.pop();
            console.log(vo.toString());
            vo.add(4);
            vo.addByWeight(5,3);
            vo.addByWeight(6,4);
            console.log(vo.toString());
            vo.recycle();
        }

        public engineTest():void{
            // Engine.addTick(this);
            
        }

        public update(now:number,interval:number):void{
         //   document.title = now+","+interval;
            // console.log(now+","+interval);
        }


        public callLaterTest():void{
            function sayHello(msg:string,age:number):void{
                console.log(msg+","+age);
            }
            function sayHello2():void{
                console.log("hello2");
            }
            // TimerUtil.add(sayHello,2000,"hello",12);
            // TimerUtil.add(sayHello2,1000);
            // TimerUtil.remove(sayHello2);
            TimerUtil.time500.add(sayHello2);
        }

    }
}


let m =new rf.Main();
