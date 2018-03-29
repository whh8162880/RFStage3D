// namespace rf {
//     export interface DisplayObject {
//         scale: number;

//         addTo(con: egret.DisplayObjectContainer);
//     }
//     Matrix.prototype.$updateScaleAndRotation = function (scaleX, scaleY, skewX, skewY) {
//         if ((skewX == 0 || skewX == PI2) && (skewY == 0 || skewY == PI2)) {
//             this.a = scaleX;
//             this.b = this.c = 0;
//             this.d = scaleY;
//             return;
//         }
//         skewX = skewX / DEG_TO_RAD;
//         skewY = skewY / DEG_TO_RAD;
//         let u = egret.NumberUtils.cos(skewX);
//         let v = egret.NumberUtils.sin(skewX);
//         if (scaleY < 0) scaleY = -scaleY;
//         if (skewX == skewY) {
//             this.a = u * scaleX;
//             this.b = v * scaleX;
//         }
//         else {
//             this.a = egret.NumberUtils.cos(skewY) * scaleX;
//             this.b = egret.NumberUtils.sin(skewY) * scaleX;
//         }
//         this.c = -v * scaleY;
//         this.d = u * scaleY;
//     };

//     let dpt = DisplayObject.prototype;
//     Object.defineProperty(dpt, "scale", getDescriptor({
//         set(value: number) {
//             let s = this._scale || 1;
//             value = value || 1;
//             if (value != s) {
//                 this._scale = value;
//                 this.scaleX = this.scaleY = value;
//             }
//         },
//         get() {
//             return this._scale || 1;
//         }
//     }));

//     dpt.addTo = function (this: egret.DisplayObject, con: egret.DisplayObjectContainer) {
//         con.addChild(this);
//     }

//     export interface TextField {
//         /**
//          * 设置有Tween的文本
//          * 
//          * @param {number} value 
//          * @param {number} [duration=200] 
//          * @param {junyou.IEaseFunction} [ease] 默认为线性
//          * @memberof TextField
//          */
//         tweenValue(value: number, duration?: number, ease?: junyou.IEaseFunction);

//         /**
//          * 文本渐变
//          */
//         setGradients(value: (string | number)[][]);
//         /**
//          * 设置文本阴影
//          */
//         setShadow(value: TextShadow);
//     }

//     let tp = TextField.prototype;
//     tp.setGradients = function (value: ColorStop[]) {
//         this.textNode.gradients = value;
//     }
//     tp.setShadow = function (value: TextShadow) {
//         this.textNode.shadow = value;
//     }

//     export interface TextShadow extends Array<string | number> {
//         /**
//          * Blur
//          */
//         0: number;
//         /**
//          * 颜色
//          */
//         1?: string;
//         /**
//          * x 偏移
//          */
//         2?: number;
//         /**
//          * y 偏移
//          */
//         3?: number;
//     }

//     export interface ColorStop extends Array<string | number> {
//         /**
//          * A number between 0 and 1. An INDEX_SIZE_ERR is raised, if the number is not in that range.
//          */
//         0: number;
//         /**
//          * A CSS <color>. A SYNTAX_ERR is raised, if the value can not be parsed as a CSS <color> value.
//          */
//         1: string;
//     }

//     interface TextExtend {
//         /**
//          * 文本渐变
//          */
//         gradients?: ColorStop[];

//         shadow?: TextShadow;
//     }
//     export interface ITextStyle extends TextExtend { }
//     export module sys {
//         export interface TextFormat extends TextExtend { }

//         export interface TextNode extends TextExtend { }
//     }


//     export namespace sys {
//         export interface Path2D {
//             fillRule?: CanvasFillRule;
//         }
//     }


//     export interface Graphics {
//         endFill(fillRule?: CanvasFillRule);
//     }
//     if (DEBUG) {//正式版直接修改了白鹭的底层文件，免得每次通知大家复制文件
//         const BLACK_COLOR = "#000000";
//         const CAPS_STYLES = { none: 'butt', square: 'square', round: 'round' };

//         function getFontString(node: egret.sys.TextNode, format: egret.sys.TextFormat): string {
//             let italic: boolean = format.italic == null ? node.italic : format.italic;
//             let bold: boolean = format.bold == null ? node.bold : format.bold;
//             let size: number = format.size == null ? node.size : format.size;
//             let fontFamily: string = format.fontFamily || node.fontFamily;
//             let font: string = italic ? "italic " : "normal ";
//             font += bold ? "bold " : "normal ";
//             font += size + "px " + fontFamily;
//             return font;
//         }
//         const getColorString = junyou.ColorUtil.getColorString;
//         let crpt = CanvasRenderer.prototype;
//         crpt.renderText = function (node: sys.TextNode, context: CanvasRenderingContext2D): void {
//             context.textAlign = "left";
//             context.textBaseline = "middle";
//             context.lineJoin = "round";//确保描边样式是圆角
//             let drawData = node.drawData;
//             let length = drawData.length;
//             let pos = 0;
//             while (pos < length) {
//                 let x = drawData[pos++];
//                 let y = drawData[pos++];
//                 let text = drawData[pos++];
//                 let format: sys.TextFormat = drawData[pos++];
//                 context.font = getFontString(node, format);
//                 let textColor = format.textColor == null ? node.textColor : format.textColor;
//                 let strokeColor = format.strokeColor == null ? node.strokeColor : format.strokeColor;
//                 let stroke = format.stroke == null ? node.stroke : format.stroke;
//                 let gradients = format.gradients || node.gradients;
//                 let style;
//                 if (gradients) {
//                     let hh = (format.size || node.size) >> 1;//textBaseline = "middle" 是从中间渲染，所以基于高度要上下补值
//                     style = context.createLinearGradient(x, y - hh, x, y + hh);
//                     for (let i = 0; i < gradients.length; i++) {
//                         const colorStop = gradients[i];
//                         style.addColorStop(colorStop[0], colorStop[1]);
//                     }
//                 }
//                 context.fillStyle = style || getColorString(textColor);
//                 let shadow = format.shadow || node.shadow;
//                 if (shadow) {
//                     let shadowBlur = shadow[0];
//                     if (shadowBlur) {
//                         context.shadowBlur = shadowBlur;
//                         context.shadowColor = shadow[1] || "black";
//                         context.shadowOffsetX = shadow[2] || 0;
//                         context.shadowOffsetY = shadow[3] || 0;
//                     }
//                 }
//                 context.strokeStyle = getColorString(strokeColor);
//                 if (stroke) {
//                     context.lineWidth = stroke * 2;
//                     context.strokeText(text, x, y);
//                 }
//                 context.fillText(text, x, y);
//             }
//         }
//         crpt.renderGraphics = function (node: sys.GraphicsNode, context: CanvasRenderingContext2D, forHitTest?: boolean): number {
//             let drawData = node.drawData;
//             let length = drawData.length;
//             forHitTest = !!forHitTest;
//             for (let i = 0; i < length; i++) {
//                 let path: sys.Path2D = drawData[i];
//                 let rule = path.fillRule;
//                 switch (path.type) {
//                     case sys.PathType.Fill:
//                         let fillPath = <sys.FillPath>path;
//                         context.fillStyle = forHitTest ? BLACK_COLOR : getRGBAString(fillPath.fillColor, fillPath.fillAlpha);
//                         this.renderPath(path, context);
//                         if (this.renderingMask) {
//                             context.clip(rule);
//                         }
//                         else {
//                             context.fill(rule);
//                         }
//                         break;
//                     case sys.PathType.GradientFill:
//                         let g = <sys.GradientFillPath>path;
//                         context.fillStyle = forHitTest ? BLACK_COLOR : getGradient(context, g.gradientType, g.colors, g.alphas, g.ratios, g.matrix);
//                         context.save();
//                         let m = g.matrix;
//                         this.renderPath(path, context);
//                         context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
//                         context.fill(rule);
//                         context.restore();
//                         break;
//                     case sys.PathType.Stroke:
//                         let strokeFill = <sys.StrokePath>path;
//                         let lineWidth = strokeFill.lineWidth;
//                         context.lineWidth = lineWidth;
//                         context.strokeStyle = forHitTest ? BLACK_COLOR : getRGBAString(strokeFill.lineColor, strokeFill.lineAlpha);
//                         context.lineCap = CAPS_STYLES[strokeFill.caps];
//                         context.lineJoin = strokeFill.joints;
//                         context.miterLimit = strokeFill.miterLimit;
//                         //对1像素和3像素特殊处理，向右下角偏移0.5像素，以显示清晰锐利的线条。
//                         let isSpecialCaseWidth = lineWidth === 1 || lineWidth === 3;
//                         if (isSpecialCaseWidth) {
//                             context.translate(0.5, 0.5);
//                         }
//                         this.renderPath(path, context);
//                         context.stroke();
//                         if (isSpecialCaseWidth) {
//                             context.translate(-0.5, -0.5);
//                         }
//                         break;
//                 }
//             }
//             return length == 0 ? 0 : 1;
//         }
//         /**
//         * @private
//         * 获取RGBA字符串
//         */
//         function getRGBAString(color: number, alpha: number): string {
//             let red = color >> 16;
//             let green = (color >> 8) & 0xFF;
//             let blue = color & 0xFF;
//             return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
//         }

//         /**
//          * @private
//          * 获取渐变填充样式对象
//          */
//         function getGradient(context: CanvasRenderingContext2D, type: string, colors: number[],
//             alphas: number[], ratios: number[], matrix: Matrix): CanvasGradient
//         function getGradient(context: CanvasRenderingContext2D, type: string, colors: number[],
//             alphas: number[], ratios: number[]): CanvasGradient {
//             let gradient: CanvasGradient;
//             if (type == GradientType.LINEAR) {
//                 gradient = context.createLinearGradient(-1, 0, 1, 0);
//             }
//             else {
//                 gradient = context.createRadialGradient(0, 0, 0, 0, 0, 1);
//             }
//             //todo colors alphas ratios数量不一致情况处理
//             let l = colors.length;
//             for (let i = 0; i < l; i++) {
//                 gradient.addColorStop(ratios[i] / 255, getRGBAString(colors[i], alphas[i]));
//             }
//             return gradient;
//         }

//         Graphics.prototype.endFill = function (fillRule?: CanvasFillRule): void {
//             let fillPath = this.fillPath;
//             if (fillPath) {
//                 fillPath.fillRule = fillRule;
//                 this.fillPath = null;
//             }
//         }
//     }
// }
// module junyou {

//     export interface SuiRawRect {
//         /**
//          * 经过dpr处理之后的缩放值
//          */
//         scale?: number;
//         /**
//          * 未经过dpr处理的原始宽度
//          */
//         rawWidth?: number;
//         /**
//          * 未经过dpr处理的原始高度
//          */
//         rawHeight?: number;
//     }

//     export interface CtrlBtn extends Button {
//         /**
//          * 面板控制按钮
//          * 
//          * @type {(1 | 0)}
//          * @memberof CtrlBtn
//          */
//         $_ctrl?: 1 | 2;
//     }
//     export interface Panel extends IModulePanel {
//         /**
//          * 关闭按钮
//          * 
//          * @type {CtrlBtn}
//          * @memberof Panel
//          */
//         closeBtn?: CtrlBtn;
//         /**
//          * 提示按钮
//          * 
//          * @type {CtrlBtn}
//          * @memberof Panel
//          */
//         helpBtn?: CtrlBtn;
//         /**
//          * 返回按钮
//          * 
//          * @type {CtrlBtn}
//          * @memberof Panel
//          */
//         backBtn?: CtrlBtn;


//         /**
//          * 
//          * 设置面板是否可关闭
//          * setter getter
//          * @type {boolean}
//          * @memberof Panel
//          */
//         closable?: boolean;

//         /**
//          * 面板是否可关闭
//          * 
//          * @type {boolean}
//          * @memberof Panel
//          */
//         _c?: boolean;

//         /**
//          * 用于布局
//          * 
//          * @type {Size}
//          * @memberof Panel
//          */
//         $layoutSize?: Size;


//         /**
//          * 用于将 `closeBtn`  `helpBtn`  `backBtn` 放到最上层
//          * 
//          * @memberof Mediator
//          */
//         resetBtns();

//         /**
//          * 这个面板是否检查DPR
//          */
//         checkDPR?: boolean;

//         /**
//          * 设置标题样式  
//          * 默认为 http://192.168.0.205:1234/h5arpg/hqg2/issues/8  标题样式
//          */
//         titleStyle: TextStyle;

//         title: string;

//         _title?: string;

//         titleTF?: egret.TextField;

//         bg?: egret.DisplayObject;

//         delePos?: egret.Rectangle;
//     }

//     function setBtn(key: string, oldParent: egret.DisplayObjectContainer, newParent: egret.DisplayObjectContainer) {
//         let disp = oldParent[key] as egret.DisplayObject;
//         if (disp instanceof egret.DisplayObject) {
//             let pos = disp.localToGlobal(0, 0);
//             newParent.globalToLocal(pos.x, pos.y, pos);
//             disp.x = pos.x;
//             disp.y = pos.y;
//             newParent.addChild(disp);
//         } else {
//             DEBUG && Log(`设置的按钮不对`)
//         }
//         newParent[key] = disp;
//     }


//     /**
//      * 基于业务扩展Panel
//      * 
//      * @export
//      */
//     function extendPanel() {
//         let p = Panel.prototype;
//         Panel.MODAL_ALPHA = 0.5;
//         let oriSkinDataComplete = (p as any).bindComponent;
//         (p as any).bindComponent = function (this: Panel) {
//             oriSkinDataComplete.call(this);
//             let bg = this.bg as any;
//             if (bg && bg.suiClass == MCName.Panel1) {
//                 setBtn("closeBtn", bg, this);
//                 setBtn("helpBtn", bg, this);
//                 setBtn("titleTF", bg, this);
//                 setBtn("backBtn", bg, this);
//                 this.delePos = bg.delePos;
//             }
//             let { closeBtn, titleTF } = this;
//             let cfg = $DD.GongNeng[this.moduleID as number];
//             let dpr = getDPR();
//             let needCheckScale = egret.Capabilities.isMobile || window.devicePixelRatio != 1;
//             let scale = 1;
//             let rect = this.suiRawRect;
//             let needResize = this.checkDPR;
//             if (needResize == undefined) {
//                 needResize = cfg && cfg.ptype != PanelType.Static && cfg.conType == ModuleConType.LayerID;
//             }
//             if (needResize && needCheckScale) {
//                 needCheckScale = false;
//                 let { stageWidth: width, stageHeight: height } = egret.sys.$TempStage;
//                 ({ scale } = getFixedLayout(width, height, rect.width, rect.height));
//             }

//             if (needCheckScale && this.isModal) {
//                 needCheckScale = false;
//                 scale = dpr;
//             }
//             rect.rawWidth = rect.width;
//             rect.rawHeight = rect.height;
//             if (scale != 1) {
//                 this.scale = scale;
//                 rect.width *= scale;
//                 rect.height *= scale;
//                 rect.scale = scale;
//             }
//             needResize && singleton(ResizeManager).add(this, LayoutType.MIDDLE_CENTER);

//             if (closeBtn) {
//                 this.closable = true;
//                 closeBtn.$_ctrl = 1;
//             }

//             if (titleTF) {
//                 titleTF.size = 20;
//                 let style = this.titleStyle || TextStyle.Title;
//                 bindTextStyle(titleTF, style);
//                 if (cfg) {
//                     titleTF.text = cfg.name || "";
//                 }
//             }
//         }

//         p.resetBtns = function (this: Panel) {
//             let { backBtn, helpBtn, closeBtn } = this;
//             if (backBtn) {
//                 this.addChild(backBtn);
//             }
//             if (helpBtn) {
//                 this.addChild(helpBtn);
//             }
//             if (closeBtn) {
//                 this.addChild(closeBtn);
//             }
//         }

//         let addChild = p.$doAddChild;
//         p.$doAddChild = function (this: Panel, child: egret.DisplayObject, index: number, notifyListeners?: boolean): egret.DisplayObject {
//             let result = addChild.call(this, child, index, notifyListeners);
//             if (!(child as CtrlBtn).$_ctrl) {
//                 Global.callLater(this.resetBtns, 0, this);
//             }
//             return result;
//         }

//         Object.defineProperties(p,
//             {
//                 title: {
//                     get: function (this: Panel) {
//                         return this._title;
//                     },
//                     set: function (this: Panel, value: string) {
//                         if (this._title != value) {
//                             this._title = value;
//                             let tf = this.titleTF;
//                             if (tf) {
//                                 tf.text = value;
//                             }
//                         }
//                     },
//                     configurable: true,
//                     enumerable: true
//                 },
//                 closable: {
//                     get: function (this: Panel) {
//                         return this._c;
//                     },
//                     set: function (this: Panel, value: boolean) {
//                         if (this._c != value) {
//                             this._c = value;
//                             let { closeBtn, hide } = this;
//                             if (closeBtn) {
//                                 if (value) {
//                                     closeBtn.bindTouch(hide, this);
//                                 } else {
//                                     closeBtn.looseTouch(hide, this);
//                                     //隐藏按钮
//                                     removeDisplay(closeBtn);
//                                 }
//                             }
//                         }
//                     },
//                     configurable: true,
//                     enumerable: true
//                 },
//                 $layoutSize: {
//                     get: function (this: Panel) {
//                         return this.suiRawRect;
//                     }
//                 }
//             });
//     }

//     const enum TFConst {
//         Key = "_ntext",
//         ValueKey = "_$ntext"
//     }

//     function makeTweenValue<T extends { tweenValue(value: number, duration?: number, ease?: junyou.IEaseFunction) }>(tpt: T, handlerKey: keyof T) {
//         tpt.tweenValue = function (this: egret.TextField, value: number, duration = 200, ease?: junyou.IEaseFunction) {
//             Global.getTween(this, { override: true }).to({ [TFConst.Key]: value }, duration, ease);
//         }
//         Object.defineProperty(tpt, TFConst.Key, {
//             set: function (value) {
//                 this[TFConst.ValueKey] = value;
//                 this[handlerKey] = parseInt(value) + "";
//             },
//             get: function () {
//                 return +this[TFConst.ValueKey] || 0;
//             },
//             enumerable: false,
//             configurable: true
//         })
//     }
//     /**
//      * 扩展文本框
//      * 
//      */
//     function extendTextField() {
//         makeTweenValue(egret.TextField.prototype, "text");
//     }

//     function extendMCButton() {
//         Object.defineProperty(MCButton.prototype, "badge", {
//             get: function () {
//                 return this.mc.badge;
//             },
//             enumerable: true,
//             configurable: true
//         })
//     }

//     function extendMCProgressBar() {
//         let p = ProgressBar.prototype;
//         Object.defineProperty(p, "line", {
//             get: function () {
//                 return this._skin.line;
//             },
//             enumerable: false,
//             configurable: true
//         })

//         let oriProgress = p.progress;
//         p.progress = function (this: ProgressBar, value: number, maxValue: number) {
//             oriProgress.call(this, value, maxValue);
//             let line = this.line;
//             if (line) {
//                 let { bar, useMask } = this;
//                 if (useMask) {
//                     let rect = bar.scrollRect;
//                     line.x = bar.x + rect.width;
//                 }
//                 else {
//                     line.x = bar.x + bar.width;
//                 }
//             }
//         }
//     }
//     export interface ProgressBar {
//         line: egret.DisplayObject;
//     }

//     // export interface Scroller {
//     //     bindPage(page: PageList<any, any>);
//     // }

//     // function extendScroller() {
//     //     Scroller.prototype.bindPage = function (this: Scroller, page: PageList<any, any>, scrollbar?: ScrollBar) {
//     //         let con = page.container;
//     //         this.scrollType = page.scrollType;
//     //         this.bindObj2(con, con.suiRawRect, scrollbar);
//     //     }
//     // }

//     function extendButton() {
//         let bpt = Button.prototype;
//         let oriBindChildren = bpt.bindChildren;
//         bpt.bindChildren = function (this: Button) {
//             oriBindChildren.call(this);
//             Global.nextTick(bindBtnStyle, null, this);
//         }
//         Object.defineProperty(bpt, "_useDisableFilter", {
//             value: true,
//             configurable: true,
//             enumerable: true
//         });
//     }
//     export interface ArtText {
//         /**
//          * 设置有Tween的文本
//          * 
//          * @param {number} value 
//          * @param {number} [duration=200] 
//          * @param {junyou.IEaseFunction} [ease] 默认为线性
//          * @memberof TextField
//          */
//         tweenValue(value: number, duration?: number, ease?: junyou.IEaseFunction);
//     }

//     function extendArtText() {
//         makeTweenValue(ArtText.prototype, "value");
//     }

//     export interface Mediator {
//         /**
//          * 绑定单个按钮
//          * 
//          * @param {number} moduleID 
//          * @param {egret.DisplayObject} io 
//          * @param {Key} [eventType] 
//          * @memberof Mediator
//          */
//         bindIO(moduleID: number, io: egret.DisplayObject, eventType?: Key);

//         /**
//          * 绑定一组可交互控件
//          * 
//          * @param {any} args [moduleID1: number, io1: egret.DisplayObject,moduleID2: number, io2: egret.DisplayObject,moduleID3: number, io3: egret.DisplayObject.....moduleIDN: number, ioN: egret.DisplayObject]
//          * @memberof Mediator
//          */
//         bindIOs(...args);


//         /**
//          * 点击返回
//          * 
//          * @memberof Panel
//          */
//         goBack?();
//         /**
//          * 显示提示内容
//          * 
//          * @memberof Panel
//          */
//         showHelp?();
//         /**
//          * 通用设置数据接口
//          */
//         setData?(...args);

//         /**
//          * 设置背景
//          * 
//          * @param {Key} iconName pbg文件夹中背景的名称 如文件为 `pbg/1.jpg` 此值设置1  
//          * @param {boolean} [scale] 是否按`Image`框的大小进行缩放，默认不缩放，图片多大显示多大
//          * @memberof Mediator
//          */
//         setBG(iconName: Key, scale?: boolean);
//         /**
//          * 绑定角标和视图
//          * @param {({ 0: Key, 1: egret.DisplayObject, 2?: 1 })[]} key 
//          */
//         bindBadgeIOs(...key: ({ 0: Key, 1: egret.DisplayObject, 2?: 1 })[]);
//     }

//     export interface ModuleParam {
//         /**
//          * 上一级模块ID，用于点击 backBtn 时的处理
//          * 
//          * @type {Key}
//          * @memberof ModuleParam
//          */
//         opener?: Key;

//         /**
//          * 页签对应面板的容器
//          * 
//          * @type {egret.DisplayObjectContainer}
//          * @memberof ModuleParam
//          */
//         parent?: egret.DisplayObjectContainer;

//         /**
//          * 坐标
//          */
//         pos?: Point;
//     }

//     const enum MMConst {
//         /**
//          * 父级模块
//          */
//         ParentModule = "$_pm"
//     }

//     function exntedMediator() {
//         let mpt = Mediator.prototype;
//         mpt.bindIO = function (this: Mediator, moduleID: number, io: egret.DisplayObject, eventType: string = EgretEvent.TOUCH_TAP) {
//             facade.mm.bindButton(moduleID, io, eventType);
//             io[MMConst.ParentModule] = this.name;
//         }
//         mpt.bindIOs = function () {
//             for (let i = 0; i < arguments.length; i += 2) {
//                 this.bindIO(arguments[i], arguments[i + 1]);
//             }
//         }
//         let vc: { (): void } = (mpt as any).viewComplete;
//         (mpt as any).viewComplete = function (this: Mediator) {
//             vc.call(this);
//             let { backBtn, helpBtn } = (this.$view as Panel);
//             if (backBtn) {//返回按钮
//                 backBtn.bindTouch(this.goBack, this);
//                 backBtn.$_ctrl = 1;
//             }
//             if (helpBtn) {
//                 let cfg = $DD.GongNeng[this.name as number];
//                 helpBtn.bindTouch(this.showHelp, this);
//                 //检查是否应该显示帮助按钮
//                 if (helpBtn.$_ctrl != 2 && cfg) {
//                     helpBtn.$_ctrl = 1;
//                     helpBtn.visible = !!cfg.des;
//                 }
//             }
//         }

//         mpt.showHelp = function (this: Panel) {
//             showHelp(this.name);
//         }
//         mpt.goBack = function (this: Mediator) {
//             let mid = this.name;
//             toggle(mid, ToggleState.HIDE);
//             let opener = this.$view.opener;
//             if (opener) {
//                 toggle(opener, ToggleState.SHOW);
//             }
//         }
//         mpt.setBG = function (uri: string, scale?: boolean) {
//             let img = this.$view.bgImg as Image;
//             if (img) {
//                 if (!scale) {//默认不缩放
//                     img.width = img.height = NaN;
//                 }
//                 img.source = ResPrefix.PBG + uri + Ext.JPG
//             }
//         }
//         mpt.bindBadgeIOs = function (this: Mediator) {
//             let keys = arguments;
//             const bindDisplay = Badge.bindDisplay;
//             for (let i = 0; i < keys.length; i++) {
//                 const [key, btn, bindIO] = keys[i];
//                 if (bindIO) {
//                     this.bindIO(key, btn);
//                 }
//                 bindDisplay(btn, key);
//             }
//         }
//     }

//     function exntedModuleManager() {
//         ModuleManager.prototype.ioHandler = function (this: ModuleManager, event: egret.Event) {
//             let btn = event.currentTarget;
//             let opener = btn[MMConst.ParentModule];
//             let id = this._ioBind.get(btn);
//             this.toggle(id, ToggleState.AUTO, true, { opener });
//         }
//     }

//     /**
//      * 
//      * 启动时可进行扩展的项目
//      * @export
//      */
//     export function extend() {
//         extendPanel();
//         extendTextField();
//         extendArtText();
//         exntedMediator();
//         exntedModuleManager();
//         // extendScroller();
//         extendMCButton();
//         extendMCProgressBar();
//         extendButton();
//     }

//     export interface Service {
//         /**
//          * 角色初始化完成
//          * 
//          * @memberof Service
//          */
//         onRoleInit?: { () };
//         /**
//          * 用于注册前端命令拦截函数
//          * [cmd,handler,cmd1,handler1,cmd2,handler2,....cmdN,handlerN]
//          * @protected
//          * @param {any} args 
//          */
//         regClient(...args);

//         /**
//          * 将命令切换至前端处理
//          * [cmd,cmd1,cmd2,....cmdN]
//          * @protected
//          * @param {any} args 
//          */
//         switch2C(...args);
//         /**
//          * 将命令切换至后端处理
//          * [cmd,cmd1,cmd2,....cmdN]
//          * @protected
//          * @param {any} args 
//          */
//         switch2S(...args);

//         /**
//          * 检查消息中的code码
//          * @param {{ code?: Code }} msg 消息
//          * @param {{ (state: number): boolean }} [clientStateHandler] state处理函数
//          */
//         checkCode(msg: { code?: Code }, clientStateHandler?: { (state: number): boolean }): boolean | void;

//     }
//     const clientCmds = [];
//     const clientHandlers: { [cmd: number]: { (data?: any) } } = {};
//     function extendService() {
//         let spt = Service.prototype;
//         let r = spt.onRegister;
//         spt.onRegister = function (this: Service) {
//             r.call(this);
//             if (this.onRoleInit) {
//                 once(EventConst.RoleInit, this.onRoleInit, this);
//             }
//         }
//         spt.checkCode = checkCode;
//         spt.regClient = function (this: Service) {
//             let args = arguments;
//             for (let i = 0; i < args.length; i += 2) {
//                 let cmd = args[i];
//                 let handler = args[i + 1] as Function;
//                 if (handler) {
//                     clientHandlers[cmd] = handler.bind(this);
//                 }
//             }
//         }

//         spt.switch2C = function (this: Service) {
//             let args = arguments;
//             for (let i = 0; i < args.length; i++) {
//                 let cmd = args[i];
//                 clientCmds.pushOnce(cmd);
//             }
//             checkSend();
//         }
//         spt.switch2S = function (this: Service) {
//             let args = arguments;
//             for (let i = 0; i < args.length; i++) {
//                 let cmd = args[i];
//                 clientCmds.remove(cmd);
//             }
//             checkSend();
//         }
//         let wpt = WSNetService.prototype;
//         //@ts-ignore
//         let oldsend = wpt._send;
//         function send(cmd: number, data?: any, msgType?: string | number) {
//             let ws = this._ws;
//             if (ws.readyState != WebSocket.OPEN) {
//                 if (RequestLimit.check("rec", Time.ONE_SECOND)) {
//                     CoreFunction.showClientTips(`网络不稳定，请稍后再试`)
//                 }
//                 return;
//             }
//             oldsend.call(this, cmd, data, msgType);
//         }
//         function checkSend() {
//             //@ts-ignore
//             wpt._send = clientCmds.length ? newSend : send;
//         }
//         function newSend(this: WSNetService, cmd: number, data?: any, msgType?: string | number) {
//             if (clientCmds.indexOf(cmd) == -1) {
//                 send.call(this, cmd, data, msgType);
//             } else {
//                 let handler = clientHandlers[cmd];
//                 if (handler) {
//                     handler(data);
//                 }
//             }
//         }

//     }
//     function checkCode(msg: { code?: Code }, clientStateHandler?: { (state: number): boolean }) {
//         if (!msg) return;
//         let code = msg.code;
//         if (typeof code !== "object") return true;
//         if (code) {
//             let state = code.state;
//             if (state) {
//                 if (clientStateHandler) {
//                     return clientStateHandler(state);
//                 }
//             } else {
//                 if (!code.code) {
//                     return DEBUG && Log("code 为空，请检查");
//                 }
//                 CoreFunction.showServerTips(code.code, code.param);
//                 return;
//             }

//         }
//         return true;
//     }



//     export interface RelateTablesOption {
//         /**
//          * 主表里放子表的列表名称
//          * 
//          * @type {string}
//          * @memberof RelateTablesOption
//          */
//         listKey: string;
//         /**
//          *  子表和主表关联的键值
//          * 
//          * @type {string}
//          * @memberof RelateTablesOption
//          */
//         idKey: string;
//         /**
//          * 需要存放子数据的对象的数据类型
//          * Array | Object | ArraySet
//          * 
//          * @type {string}
//          * @memberof RelateTablesOption
//          */
//         type?: CfgDataType;
//     }
//     export interface DataUtilsType {
//         /**
//          * 
//          * 
//          * @export
//          * @param {*} parentTable 主表
//          * @param {any[]} childTable 子表
//          * @param {string} childKey 子表的键值
//          * @param {ParseOption} [option] 功能拓展
//          * @returns 
//          */
//         relateTables(parentTable: any, childTable: any[], childKey: string, option?: RelateTablesOption)
//     }

//     DataUtils.relateTables = function (parentTable: any, childTable: any[], childKey: string, option?: RelateTablesOption) {
//         let type: CfgDataType, listKey: string, idKey: string;
//         if (option) {
//             ({ type, listKey="list", idKey="id" } = option)
//         }
//         for (let i = 0; i < childTable.length; i++) {
//             let formObj = childTable[i];
//             let toObj: any;
//             let keyValue = formObj[childKey];
//             if (parentTable instanceof ArraySet) {
//                 toObj = parentTable.get(keyValue);
//             }
//             else if (parentTable instanceof Object) {
//                 toObj = parentTable[keyValue];
//             }
//             else {
//                 DEBUG && ThrowError("parentTable 为不支持的数据类型。请选择ArraySet或者Object");
//                 return;
//             }
//             if (!toObj) continue;
//             let list = toObj[listKey];
//             if (idKey == "") {
//                 type = CfgDataType.Array;
//             } else if (type == undefined) {
//                 type = CfgDataType.Dictionary;
//             }
//             switch (type) {
//                 case CfgDataType.Auto:
//                 case CfgDataType.Array:
//                     if (!list) {
//                         toObj[listKey] = list = [];
//                     }
//                     list.push(formObj);
//                     break;
//                 case CfgDataType.ArraySet:
//                     if (!list) {
//                         toObj[listKey] = list = new ArraySet();
//                     }
//                     list.set(idKey, formObj);
//                     break;
//                 case CfgDataType.Dictionary:
//                     if (!list) {
//                         toObj[listKey] = list = {};
//                     }
//                     list[idKey] = formObj;
//                     break;
//             }
//         }
//     }

//     export interface UnitController<T extends Unit> {
//         /**
//          * 根据Filter查找一个单位
//          * 
//          * @param {{ (unit: junyou.$GUnit, ...args): boolean }} filter 
//          * @param {UnitDomainType} [domain] 
//          * @param {any} args 
//          * @returns {junyou.$GUnit} 
//          * @memberof UnitController
//          */
//         find(filter: { (unit: $GUnit, ...args): boolean }, domain?: UnitDomainType, ...args): $GUnit;
//     }

//     function extendUnitController() {
//         let pt = UnitController.prototype;
//         pt.find = function (this: UnitController<$GUnit>, filter: { (unit: $GUnit, ...args): boolean }, domain?: UnitDomainType, ...args) {
//             const dict = this.get(~~domain);
//             if (dict) {
//                 for (let guid in dict) {
//                     let u = dict[guid];
//                     if (filter(u, ...args)) {
//                         return u;
//                     }
//                 }
//             }
//         }
//         let rg = pt.registerUnit;
//         pt.registerUnit = function () {
//             rg.apply(this, arguments);
//             let unit = arguments[0] as $GUnit;
//             dispatch(EventConst.UnitEnterAOI, unit.guid);
//         }
//         let rm = pt.removeUnit;
//         pt.removeUnit = function (guid) {
//             let unit = rm.apply(this, arguments);
//             dispatch(EventConst.UnitLeaveAOI, guid);
//             if (unit && unit.state != UnitState.Disposed) {
//                 unit.recycle && unit.recycle();
//             }
//             return unit;
//         }
//     }

//     function extendDateUtils() {
//         DateUtils.regCDFormat(CountDownFormat.H_M_S2, { h: "{0}:", m: "{0}:", s: "{0}", hh: true, mm: true, ss: true })
//     }

//     /**
//      * 加载并处理完配置之后扩展
//      * 
//      * @export
//      */
//     export function extend2() {
//         extendDateUtils();
//         extendService();
//         extendUnitController();

//     }

//     const enum PBDict {
//         DebugCmd_C = 32767,
//         DebugCmd_S = 32766,
//     }

//     if (DEBUG) {
//         //注册GM指令
//         PBUtils.regStruct(PBDict.DebugCmd_C, { 1: ["args", PBFieldType.Repeated, PBType.String] });
//         PBUtils.regStruct(PBDict.DebugCmd_S, { 1: ["code", PBFieldType.Optional, PBType.Message, PBDictKey.Code] })
//         let ns: NetService;
//         let sendGM: any = function (text: string) {
//             text = text + "";
//             if (!text) {
//                 return;
//             }
//             let args = text.split(/\s+/);
//             if (!ns) {
//                 ns = NetService.get();
//                 ns.regReceiveMSGRef(PBDict.DebugCmd_S, PBDict.DebugCmd_S)
//                 ns.register(PBDict.DebugCmd_S, data => {
//                     checkCode(data.data);
//                 })
//             }
//             ns.send(PBDict.DebugCmd_C, { args }, PBDict.DebugCmd_C);
//         }
//         if ($gm) {
//             if (typeof Object["assign"] != undefined) {
//                 Object["assign"](sendGM, $gm);
//             } else {
//                 sendGM.__proto__ = $gm;
//             }
//         }
//         $gm = sendGM;
//     }

//     //注册字符解析
//     // `伤害加成：{%wanfenbi%0}`.substitute(3000)输出为：`伤害加成：30%`
//     String.regSubHandler("wanfenbi", getPercent);

//     export interface FilterUtilsType {
//         /**
//          * 共享的
//          * 
//          * @type {egret.Filter[]}
//          * @memberof FilterUtilsType
//          */
//         glow: egret.Filter[];
//     }

//     FilterUtils.glow = [new egret.GlowFilter(0xfff000, 1, 15, 15, 3)];
// }

// const enum CountDownFormat {
//     /**
//      * { h: "{0}:", m: "{0}:", s: "{0}" }
//      */
//     H_M_S2 = 5,
// }
