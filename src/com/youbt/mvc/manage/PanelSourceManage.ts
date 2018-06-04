// ///<reference path="../PanelSource.ts" />
// module rf{

//     export interface IDisplayFrameElement{
// 		type:number;
// 		name:string;
// 		rect:any;
// 		x:number;
// 		y:number;
// 		matrix2d:IMatrix;
// 		libraryItemName:string;
// 	}

// 	export interface IDisplayTextElement extends IDisplayFrameElement
// 	{
// 		fontRenderingMode:String;
// 		width:number;
// 		height:number;
// 		selectable:boolean;
// 		text:string;
// 		filter:any[];
// 		format:object;
// 		input:boolean;
// 		multiline:boolean;
// 		color:number;
// 	}

// 	export interface IDisplaySymbol extends IDisplayFrameElement{
// 		className:String;
// 		displayClip:number;
// 		displayFrames:{[key:number]:IDisplayFrameElement[]}
// 	}

//     export interface IExportPanelSource{
//         txtwidth:number;
//         txtheight:number;
//         image:string;
//         symbols:IDisplaySymbol[]
//         frames:IBitmapSourceVO[]
//     }


//     export class PanelSourceManage{
//         protected all_res:{[key:string]:PanelSource};

//         constructor()
//         {
//             this.all_res = {};
//         }

//         load(url:string):PanelSource
//         {
//             let{all_res}=this;

//             let source = all_res[url];

//             if(!source){
//                 all_res[url] = source = new PanelSource();
//                 source.name = url;
//             }

//             if(source.status == LoadStates.WAIT){
//                 source.status = LoadStates.LOADING;
//                 loadRes(url,source.loadComplete,source,ResType.amf);
//             }

//             return source;
//         }


//         /**
// 		 * 存储对象
// 		 */
// 		private _localmap:object = {};
		
		
// 		/**
// 		 * 删除资源 
// 		 * @param name
// 		 * @param vo
// 		 * 
// 		 */		
// 		removeDefinition(name:string):void
// 		{
//             let {_localmap} = this;
// 			if(_localmap[name]){
// 				_localmap[name] = null;
// 				delete _localmap[name];
// 			}
// 		}
		
// 		/**
// 		 * 保存资源
// 		 * @param resoucename
// 		 * @param content
// 		 *
// 		 */
// 		set(name:string, vo:IDisplaySymbol):void
// 		{
//             let {_localmap} = this;
// 			if(_localmap[name]){
// 				throw new Error("重复" + name);
// 			}
// 			_localmap[name] = vo;
// 		}
		
		
// 		/**
// 		 * 从指定的应用程序域获取一个公共定义。
// 		 * @param resoucename
// 		 * @param content
// 		 *
// 		 */
// 		getDefinition(name:string):IDisplaySymbol
// 		{
//             let {_localmap} = this;
// 			return _localmap[name];
// 		}
		
// 		// getSprite3D(name:String):Sprite3D
// 		// {
// 		//     var symbol:DisplaySymbol = _localmap[name];
// 		// 	if(!symbol)
// 		// 	{
// 		// 	    return null;
// 		// 	}
// 		// 	return symbol.create();
// 		// }
//     }
//     export let sourceManger:PanelSourceManage = singleton(PanelSourceManage);

//     export class AsyncResource extends MiniDispatcher{
//         setting:object;
//         source:PanelSource;
//         status:LoadStates;

//         private d_setting:object;

//         constructor(){
//             super();
//             this.status = LoadStates.WAIT;
//         }

//         load(url:string):void
//         {
//             this.status = LoadStates.LOADING;
//             loadRes(url, this.p3dloadComplete, this, ResType.text);
//         }

//         p3dloadComplete(e:EventX):void{
//             if(e.type !=  EventT.COMPLETE)
//             {
//                 this.status = LoadStates.FAILED;
//                 return;
//             }
//             let res:ResItem = e.data;
//             let o = JSON.parse(res.data);
//             this.resourceComplete(o);
//          }
 
//          resourceComplete(o:object):void{
//              //生成对应的模块 一次只有一个对象    
//              //创建bitmapsource
//              this.d_setting = o;
 
//              //加载对应的图片资源
//              let url = "../assets/"+ o['image'] +'.png';
//              loadRes(url,this.onImageComplete,this,ResType.image);
//          }

//          onImageComplete(e:EventX):void{
//             if(e.type !=  EventT.COMPLETE)
//             {
//                 this.status = LoadStates.FAILED;
//                 return;
//             }

//             this.status = LoadStates.COMPLETE;

//             const{d_setting} = this;

//             let res:ResItem = e.data;
//             let image:HTMLImageElement = res.data;

//             let bw:number = d_setting['txtwidth'] + image.width;//(d_setting['txtwidth'] >= image.width) ? d_setting['txtwidth'] : image.width;
//             let bh:number = d_setting['txtheight'] + image.height;

//             let bmd:BitmapData = new BitmapData(bw, bh, true);
//             bmd.draw(image);

//             this.source = new PanelSource();
//             this.source.create(d_setting['image'], bmd, true);

//             let vo:IBitmapSourceVO = this.source.setSourceVO("panelimg",image.width,image.height,1);
//             // this.source.bmd.context.drawImage(image,vo.x,vo.y);

//             let objkeys:string[] = Object.keys(d_setting['frames']);
//             let areavo:BitmapSourceArea = this.source.areas[1];
//             let bitvo:IBitmapSourceVO;
//             let frameObj:object;
//             for(let key of objkeys){
//                 frameObj = d_setting['frames'][key];
//                 bitvo = areavo.createFrameArea(key, {x:frameObj['ox'], y:frameObj['oy'], w:frameObj['width'], h:frameObj['height'], ix:frameObj['ix'], iy:frameObj['iy']});
//                 refreshUV(bitvo,this.source.width, this.source.height);
//             }
//             this.source.isReady = true;
//             this.setting = d_setting["symbols"];

//             objkeys = Object.keys(this.setting);

//             for(let key of objkeys)
//             {
//                 sourceManger.set(key, this.setting[key])
//             }

//             this.simpleDispatch(EventT.COMPLETE);
//         }
//     }
// }