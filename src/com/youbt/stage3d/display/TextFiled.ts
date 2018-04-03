// module rf{
//     export class TextFormat{
//         family:string = "微软雅黑";
//         size:number = 12;
//         // "bold " : "normal "
//         bold:string = "normal";
//         // "italic " : "normal "
//         italic:string = "normal";
//         // [描边颜色color,描边大小width]
//         stroke:any = undefined;
//         //[阴影颜色shadowColor,阴影模糊shadowBlur,阴影偏移shadowOffsetX,阴影偏移shadowOffsetY]
//         shadow:any = undefined;
//         // 渐变色
//         gradient:any = undefined;

//         test(context:CanvasRenderingContext2D,text:string,out:{x:number,y:number}):void{
//             const{family,size,bold,italic}=this;
//             //设置字体
//             context.font = `${bold} ${italic} ${size}px ${family}`;
//             out.x = context.measureText(text).width;
//             out.y = size;
//         }


//         draw(context:CanvasRenderingContext2D,text:string,s:Size):void{
//             const{x,y,w}=s;
//             const{family,size,bold,italic,stroke,shadow,gradient}=this;
//             //设置字体
//             context.font = `${bold} ${italic} ${size}px ${family}`;
//             context.fillStyle = c_white //文字颜色永远用白色;
//             context.fillText(text,x,y,w);
//         }


//     }

//     class HtmlElement
// 	{
// 		/**
// 		 * 是否需要换行 
// 		 */		
// 		newline:boolean = false;
// 		str:string = undefined;
// 		start:number = 0;
// //		id:String;
// 		_color:number = 0;
// 		r:number = 1.0;
// 		g:number = 1.0;
// 		b:number = 1.0;
// 		format:TextFormat;
// 		//u
// 		underline:boolean;
// 		image:Image;
// 		imageTag:number;
// 		width:number;
// 		height:number;
		
// 		pre:HtmlElement;
// 		next:HtmlElement;
		
	
		
// 		public function HtmlElement()
// 		{
// 		}
		
// 		public function set color(value:uint):void
// 		{
// 			_color = value;
// 			r = ((value >> 16) & 0xFF) / 0xFF;
// 			g = ((value >> 8) & 0xFF) / 0xFF;
// 			b = (value & 0xFF) / 0xFF;
// 		}

// 		public function createAndCopyFormat(last:HtmlElement = null, newline:Boolean = false):HtmlElement{
// 			var ele:HtmlElement = new HtmlElement();
// 			ele.face = face;
// 			ele.size = size;
// 			ele.underline = underline;
// 			ele._color = _color;
// 			ele.r = r;
// 			ele.g = g;
// 			ele.b = b;
// //			ele.href = href;
// //			ele.target = target;
// 			ele.format = text2dDefine;
// 			ele.newline = newline;
// 			if(last){
// 				last.next = ele;
// 				ele.pre = last;
// 			}
			
// 			return ele;
// 		}
		
		
// 		public function clear():void
// 		{
// 			var next:HtmlElement = this;
// 			while(next)
// 			{
// 				if(next.image)
// 				{
// 					var images:* = Text3D.instance.images; 
// 					if(next.imageTag > -1){
// 						images[next.imageTag] = null;
// 						next.imageTag = -1;
// 					}
// 					next.image.sleep();
// 					next.image = null;
// 				}
// 				next = next.next;
// 			}
//         }
//     }


//     function doFormatHtml(value:String,source:BitmapSource,parent:HtmlElement = null,last:HtmlElement = null):HtmlElement{
//         var html:HtmlElement;
//         var o:*;
//         var str:String;
//         var len:number;
//         var i:number;
//         if(parent){
//             if(parent.str ||parent.image){
//                 last = html = parent.createAndCopyFormat(last);
//             }else{
//                 html = parent;
//             }
//         }
//         var nextnew:Boolean;
//         o = getTagStr(value);//取出html标签
//         if(o){
//             var index:number = o.index;
//             if(index != 0){
//                 str = value.slice(0,index);
//                 while((i = str.indexOf(newLineChar)) != -1){
//                     if(html.str || parent.image){
//                         last = html = parent.createAndCopyFormat(last, nextnew);
//                     }
//                     html.str = str.slice(0,i);
//                     nextnew = true;
//                     str = str.slice(i + newLineChar.length);
//                 }
                
//                 if(html.str || parent.image){
//                     last = html = parent.createAndCopyFormat(last,nextnew);
//                     if(str)
//                     {
//                         nextnew = false;
//                     }
//                 }
//                 if(nextnew)
//                 {
//                     last = html = parent.createAndCopyFormat(last, nextnew);
//                     html.str = str;
//                 }else{
//                     html.str = str;//如果是换行符nextnew属性不改变继续
//                 }
//                 if(str)
//                 {
//                     nextnew = false;
//                 }
//             }
            
//             value = value.slice(o.index + o[0].length);
            
//             if(o[1] == "image"){
//                 var image:Sprite3D = Text3D.instance.images[o[3]];
//                 if(image){
//                     if(parent.str || parent.image){
//                         last = html = parent.createAndCopyFormat(last,html.newline);
//                     }
//                     html.imageTag = o[3];
//                     html.image = image;
//                     html.width = image.width;
//                     html.height = image.height;
//                     htmlProParser(o[1],o[2],html.image);
//                 }
//             }else if(o[1] == "a"){
//                 if(parent.str || parent.image){
//                     last = html = parent.createAndCopyFormat(last,html.newline);
//                 }
//                 var text:Text3DALink;
                
//                 text = ALinkPool.pop();
//                 text.pool = ALinkPool;
//                 text.init(source,html.format);
//                 text.textColor = html._color;
//                 html.image = text;
//                 html.imageTag = -1;
//                 htmlProParser(o[1],o[2],text);
//                 text.text = o[3];
//                 html.width = text.width;
//                 html.height = text.height;
//             }else if(o[1] == "b"){
//                 last = html = parent.createAndCopyFormat(last,html.newline);
                
//                 var format:TextFormat = parent.format.copy.tf.defaultTextFormat
//                 var text2dDefine:Text2DDefine = quickCreate2DText(int(format.size),format.font, true);
//                 text2dDefine.filters =  parent.format.filters;
//                 html.format = text2dDefine;
//                 htmlProParser(o[1],o[2],html);
//                 last = doFormatHtml(o[3],source,html,last);
//             }else{
// //					if(value.length){
//                 last = html = parent.createAndCopyFormat(last, nextnew);
// //					}
//                 //复制属性
//                 htmlProParser(o[1],o[2],html);
//                 last = doFormatHtml(o[3],source,html,last);
//             }
                
//             if(value.length){
//                 last = html = parent.createAndCopyFormat(last);
//                 last = doFormatHtml(value,source,html,last);
//             }
            
//         }else{
//             str = value;
//             nextnew = false;
//             while((i = str.indexOf(newLineChar)) != -1){
//                 if(html.str || parent.image){
//                     last = html = parent.createAndCopyFormat(last,nextnew);
//                 }
//                 html.str = str.slice(0,i);
//                 nextnew = true;
//                 str = str.slice(i + newLineChar.length);
//             }
//             if(html.str || parent.image){
//                 last = html = parent.createAndCopyFormat(last,html.newline);
//             }
//             html.str = str;
//             if(nextnew)
//             {
//                 html.newline = nextnew;
//                 nextnew = false;
//             }
//         }
        
        
//         return last;
//     }
//     export class TextLine extends Sprite{

//     }
//     export class TextFiled extends Sprite{
//         html:boolean = false;
//         $text:string = "";
//         set text(value:string){

//         }
//     }
// }