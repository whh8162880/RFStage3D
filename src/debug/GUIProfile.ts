/// <reference path="../com/youbt/stage3d/Stage3D.ts" />
module rf{
    export class GUIProfile extends Sprite{
        timeTex:TextField;
		fpsTxt:TextField;
		dcTxt:TextField;
		repolyTxt:TextField;
		bufferTex:TextField;
        tweenTex:TextField;
        constructor(){
            super();
            this.bindComponents();
        }

        private bindComponents():void{
            this.timeTex = this.createText();
            this.fpsTxt = this.createText();
            this.bufferTex = this.createText();
            this.dcTxt = this.createText();
            ROOT.addEventListener(EngineEvent.FPS_CHANGE,this.fpsChangeHandler,this);
        }

        private createText():TextField{
            let text = new TextField();
            text.init();
            text.y = this.h;
            this.h += text.format.size;
            this.addChild(text);
            return text;
        }

        fpsChangeHandler(event:EventX):void{
            let con = context3D;
            this.timeTex.text = `time:${getFormatTime(engineNow,"HH:mm:ss",false)}`;
            this.fpsTxt.text = `F:${Engine.fps} C:${Engine.code.toFixed(2)}`;
            this.bufferTex.text = con.toString();
            this.dcTxt.text = `tri:${con.triangles} dc:${con.dc}`
        }
    }
}