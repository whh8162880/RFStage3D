// module rf{
//     export class Button extends SkinBase{
//         text:TextField;

//         public mouseDown:Boolean;
		
// 		public mouseRoll:Boolean;

//         private _label:string;

//         constructor(skin:Component){
//             super(skin);
//             skin.mouseChildren = false;
//         }

//         bindComponents():void
//         {
//             const{_skin} = this;
//             if(_skin["label"] != undefined)
//             {
//                 this.text = _skin["label"];
//                 this.text.html = true;
//             }

//             this.setEnable(true);
//         }

//         private setEnable(show:Boolean):void
// 		{
//             const{_skin} = this;
// 			// _enableFlag = show;
// 			if(show){
// 				_skin.addEventListener(MouseEventX.MouseDown,this.mouseDownHandler, this);
// 				_skin.addEventListener(MouseEventX.ROLL_OVER,this.rollHandler, this);
// 				_skin.addEventListener(MouseEventX.ROLL_OUT,this.rollHandler, this);
			
// 				_skin.mouseEnabled = true;
// 			}else{
//                 _skin.removeEventListener(MouseEventX.MouseDown,this.mouseDownHandler);
// 				_skin.removeEventListener(MouseEventX.ROLL_OVER,this.rollHandler);
// 				_skin.removeEventListener(MouseEventX.ROLL_OUT,this.rollHandler);
// 				_skin.mouseEnabled = false;
// 			}
//         }
        
//         protected mouseDownHandler(event:EventX):void{
//             const{_skin} = this;
//             _skin.addEventListener(MouseEventX.MouseUp, this.mouseUpHandler, this);
//             this.mouseDown = true;
//             this.clipRefresh();
//         }

//         protected mouseUpHandler(event:EventX):void{
//             const{_skin} = this;
//             this.mouseDown = false;
//             _skin.removeEventListener(MouseEventX.MouseUp, this.mouseUpHandler);
//             this.clipRefresh();
//         }

//         protected rollHandler(event:EventX):void{
//             this.clipRefresh();
//         }

//         protected clipRefresh():void{
//             const{_skin, mouseDown} = this;
//             (_skin as Component).gotoAndStop(mouseDown ? 2 : (this._skin.mouseRoll ? 1 : 0));
//         }

//         set label(val:string)
//         {
//             const{text} = this;
//             this._label = val;
//             if(text != undefined)
//             {
//                 text.text = val;
//             }
//         }

//         get label()
//         {
//             return this._label;
//         }

//         addClick(func:Function):void
// 		{
//             const{_skin} = this;
// 			_skin.addEventListener(MouseEventX.CLICK, func, this);
// 		}
//     }
// }