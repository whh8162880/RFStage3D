module rf{

    export enum Keybord{
        A = 65,
        // [静态] 与 A 键的键控代码值 (65) 关联的常数。 Keyboard 
        ALTERNATE  = 18,
        // [静态] 与 Alternate (Option) 键的键控代码值 (18) 关联的常数。 Keyboard 
        AUDIO  = 0x01000017,
        // [静态] 与选择音频模式的按钮的键控代码值关联的常数。 Keyboard 
        B  = 66,
        // [静态] 与 B 键的键控代码值 (66) 关联的常数。 Keyboard 
        BACK  = 0x01000016,
        // [静态] 与返回应用程序中前一页面的按钮的键控代码值关联的常数。 Keyboard 
        BACKQUOTE  = 192,
        // [静态] 与 ` 键的键控代码值 (192) 关联的常数。 Keyboard 
        BACKSLASH  = 220,
        // [静态] 与 \ 键的键控代码值 (220) 关联的常数。 Keyboard 
        BACKSPACE  = 8,
        // [静态] 与 Backspace 的键控代码值 (8) 关联的常数。 Keyboard 
        BLUE  = 0x01000003,
        // [静态] 与蓝色功能键,按钮的键控代码值关联的常数。 Keyboard 
        C  = 67,
        // [静态] 与 C 键的键控代码值 (67) 关联的常数。 Keyboard 
        CAPS_LOCK  = 20,
        // [静态] 与 Caps Lock 的键控代码值 (20) 关联的常数。 Keyboard 
        CHANNEL_DOWN  = 0x01000005,
        // [静态] 与频道递减按钮的键控代码值关联的常数。 Keyboard 
        CHANNEL_UP  = 0x01000004,
        // [静态] 包含所有定义的键名称常量的数组。 Keyboard 
        COMMA  = 188,
        // [静态] 与 F15 的键控代码值 (188) 关联的常数。 Keyboard 
        COMMAND  = 15,
        // [静态] 与 Mac 命令键 (15) 关联的常数。 Keyboard 
        CONTROL  = 17,
        // [静态] 与 Ctrl 的键控代码值 (17) 关联的常数。 Keyboard 
        D  = 68,
        // [静态] 与 D 键的键控代码值 (68) 关联的常数。 Keyboard 
        DELETE  = 46,
        // [静态] 与 Delete 的键控代码值 (46) 关联的常数。 Keyboard 
        DOWN  = 40,
        // [静态] 与向下箭头键的键控代码值 (40) 关联的常数。 Keyboard 
        DVR  = 0x01000019,
        // [静态] 与使用 DVR 应用程序模式的按钮的键控代码值关联的常数。 Keyboard 
        E  = 69,
        // [静态] 与 E 键的键控代码值 (69) 关联的常数。 Keyboard 
        END  = 35,
        // [静态] 与 End 的键控代码值 (35) 关联的常数。 Keyboard 
        ENTER  = 13,
        // [静态] 与 Enter 的键控代码值 (13) 关联的常数。 Keyboard 
        EQUAL  = 187,
        // [静态] 与 = 键的键控代码值 (187) 关联的常数。 Keyboard 
        ESCAPE  = 27,
        // [静态] 与 Esc 的键控代码值 (27) 关联的常数。 Keyboard 
        EXIT  = 0x01000015,
        // [静态] 与退出当前应用程序模式的按钮的键控代码值关联的常数。 Keyboard 
        F  = 70,
        // [静态] 与 F 的键控代码值 (70) 关联的常数。 Keyboard 
        F1  = 112,
        // [静态] 与 F1 的键控代码值 (112) 关联的常数。 Keyboard 
        F10  = 121,
        // [静态] 与 F10 的键控代码值 (121) 关联的常数。 Keyboard 
        F11  = 122,
        // [静态] 与 F11 的键控代码值 (122) 关联的常数。 Keyboard 
        F12  = 123,
        // [静态] 与 F12 的键控代码值 (123) 关联的常数。 Keyboard 
        F13  = 124,
        // [静态] 与 F13 的键控代码值 (124) 关联的常数。 Keyboard 
        F14  = 125,
        // [静态] 与 F14 的键控代码值 (125) 关联的常数。 Keyboard 
        F15  = 126,
        // [静态] 与 F15 的键控代码值 (126) 关联的常数。 Keyboard 
        F2  = 113,
        // [静态] 与 F2 的键控代码值 (113) 关联的常数。 Keyboard 
        F3  = 114,
        // [静态] 与 F3 的键控代码值 (114) 关联的常数。 Keyboard 
        F4  = 115,
        // [静态] 与 F4 的键控代码值 (115) 关联的常数。 Keyboard 
        F5  = 116,
        // [静态] 与 F5 的键控代码值 (116) 关联的常数。 Keyboard 
        F6  = 117,
        // [静态] 与 F6 的键控代码值 (117) 关联的常数。 Keyboard 
        F7  = 118,
        // [静态] 与 F7 的键控代码值 (118) 关联的常数。 Keyboard 
        F8  = 119,
        // [静态] 与 F8 的键控代码值 (119) 关联的常数。 Keyboard 
        F9  = 120,
        // [静态] 与 F9 的键控代码值 (120) 关联的常数。 Keyboard 
        FAST_FORWARD  = 0x0100000A,
        // [静态] 与使用快进传输模式的按钮的键控代码值关联的常数。 Keyboard 
        G  = 71,
        // [静态] 与 G 键的键控代码值 (71) 关联的常数。 Keyboard 
        GREEN  = 0x01000001,
        // [静态] 与绿色功能键按钮的键控代码值关联的常数。 Keyboard 
        GUIDE  = 0x01000014,
        // [静态] 与使用电视节目指南的按钮的键控代码值关联的常数。 Keyboard 
        H  = 72,
        // [静态] 与 H 键的键控代码值 (72) 关联的常数。 Keyboard 
        HELP  = 0x0100001D,
        // [静态] 与使用帮助应用程序或上下文相关帮助的按钮的键控代码值关联的常数。 Keyboard 
        HOME  = 36,
        // [静态] 与 Home 的键控代码值 (36) 关联的常数。 Keyboard 
        I  = 73,
        // [静态] 与 I 键的键控代码值 (73) 关联的常数。 Keyboard 
        INFO  = 0x01000013,
        // [静态] 与信息按钮的键控代码值关联的常数。 Keyboard 
        INPUT  = 0x0100001B,
        // [静态] 与循环输入按钮的键控代码值关联的常数。 Keyboard 
        INSERT  = 45,
        // [静态] 与 Insert 的键控代码值 (45) 关联的常数。 Keyboard 
        J  = 74,
        // [静态] 与 J 键的键控代码值 (74) 关联的常数。 Keyboard 
        K  = 75,
        // [静态] 与 K 键的键控代码值 (75) 关联的常数。 Keyboard 
        L  = 76,
        // [静态] 与 L 键的键控代码值 (76) 关联的常数。 Keyboard 
        LAST  = 0x01000011,
        // [静态] 与观看上一频道或显示已观看频道的按钮的键控代码值关联的常数。 Keyboard 
        LEFT  = 37,
        // [静态] 与向左箭头键的键控代码值 (37) 关联的常数。 Keyboard 
        LEFTBRACKET  = 219,
        // [静态] 与 [ 键的键控代码值 (219) 关联的常数。 Keyboard 
        LIVE  = 0x01000010,
        // [静态] 与返回实时播放（位于广播下）的按钮的键控代码值关联的常数。 Keyboard 
        M  = 77,
        // [静态] 与 M 键的键控代码值 (77) 关联的常数。 Keyboard 
        MASTER_SHELL  = 0x0100001E,
        // [静态] 与使用“主 Shell”的按钮（例如 TiVo 或其他供应商按钮）的键控代码值关联的常数。 Keyboard 
        MENU  = 0x01000012,
        // [静态] 与使用菜单的按钮的键控代码值关联的常数。 Keyboard 
        MINUS  = 189,
        // [静态] 与 - 键的键控代码值 (189) 关联的常数。 Keyboard 
        N  = 78,
        // [静态] 与 N 键的键控代码值 (78) 关联的常数。 Keyboard 
        NEXT  = 0x0100000E,
        // [静态] 与跳到下一曲目或章节的按钮的键控代码值关联的常数。 Keyboard 
        NUMBER_0  = 48,
        // [静态] 与 0 的键控代码值 (48) 关联的常数。 Keyboard 
        NUMBER_1  = 49,
        // [静态] 与 1 的键控代码值 (49) 关联的常数。 Keyboard 
        NUMBER_2  = 50,
        // [静态] 与 2 的键控代码值 (50) 关联的常数。 Keyboard 
        NUMBER_3  = 51,
        // [静态] 与 3 的键控代码值 (51) 关联的常数。 Keyboard 
        NUMBER_4  = 52,
        // [静态] 与 4 的键控代码值 (52) 关联的常数。 Keyboard 
        NUMBER_5  = 53,
        // [静态] 与 5 的键控代码值 (53) 关联的常数。 Keyboard 
        NUMBER_6  = 54,
        // [静态] 与 6 的键控代码值 (54) 关联的常数。 Keyboard 
        NUMBER_7  = 55,
        // [静态] 与 7 的键控代码值 (55) 关联的常数。 Keyboard 
        NUMBER_8  = 56,
        // [静态] 与 8 的键控代码值 (56) 关联的常数。 Keyboard 
        NUMBER_9  = 57,
        // [静态] 与 9 的键控代码值 (57) 关联的常数。 Keyboard 
        NUMPAD  = 21,
        // [静态] 与数字键盘的伪键控代码 (21) 关联的常数。 Keyboard 
        NUMPAD_0  = 96,
        // [静态] 与数字键盘上的数字 0 的键控代码值 (96) 关联的常数。 Keyboard 
        NUMPAD_1  = 97,
        // [静态] 与数字键盘上的数字 1 的键控代码值 (97) 关联的常数。 Keyboard 
        NUMPAD_2  = 98,
        // [静态] 与数字键盘上的数字 2 的键控代码值 (98) 关联的常数。 Keyboard 
        NUMPAD_3  = 99,
        // [静态] 与数字键盘上的数字 3 的键控代码值 (99) 关联的常数。 Keyboard 
        NUMPAD_4  = 100,
        // [静态] 与数字键盘上的数字 4 的键控代码值 (100) 关联的常数。 Keyboard 
        NUMPAD_5  = 101,
        // [静态] 与数字键盘上的数字 5 的键控代码值 (101) 关联的常数。 Keyboard 
        NUMPAD_6  = 102,
        // [静态] 与数字键盘上的数字 6 的键控代码值 (102) 关联的常数。 Keyboard 
        NUMPAD_7  = 103,
        // [静态] 与数字键盘上的数字 7 的键控代码值 (103) 关联的常数。 Keyboard 
        NUMPAD_8  = 104,
        // [静态] 与数字键盘上的数字 8 的键控代码值 (104) 关联的常数。 Keyboard 
        NUMPAD_9  = 105,
        // [静态] 与数字键盘上的数字 9 的键控代码值 (105) 关联的常数。 Keyboard 
        NUMPAD_ADD  = 107,
        // [静态] 与数字键盘上的加号 (+) 的键控代码值 (107) 关联的常数。 Keyboard 
        NUMPAD_DECIMAL  = 110,
        // [静态] 与数字键盘上的小数点 (.) 的键控代码值 (110) 关联的常数。 Keyboard 
        NUMPAD_DIVIDE  = 111,
        // [静态] 与数字键盘上的除号 (/) 的键控代码值 (111) 关联的常数。 Keyboard 
        NUMPAD_ENTER  = 108,
        // [静态] 与数字键盘上的 Enter 的键控代码值 (108) 关联的常数。 Keyboard 
        NUMPAD_MULTIPLY  = 106,
        // [静态] 与数字键盘上的乘号 (*) 的键控代码值 (106) 关联的常数。 Keyboard 
        NUMPAD_SUBTRACT  = 109,
        // [静态] 与数字键盘上的减号 (-) 的键控代码值 (109) 关联的常数。 Keyboard 
        O  = 79,
        // [静态] 与 O 键的键控代码值 (79) 关联的常数。 Keyboard 
        P  = 80,
        // [静态] 与 P 键的键控代码值 (80) 关联的常数。 Keyboard 
        PAGE_DOWN  = 34,
        // [静态] 与 Page Down 的键控代码值 (34) 关联的常数。 Keyboard 
        PAGE_UP  = 33,
        // [静态] 与 Page Up 的键控代码值 (33) 关联的常数。 Keyboard 
        PAUSE  = 0x01000008,
        // [静态] 与暂停传输模式的按钮的键控代码值关联的常数。 Keyboard 
        PERIOD  = 190,
        // [静态] 与 . 键的键控代码值 (190) 关联的常数。 Keyboard 
        PLAY  = 0x01000007,
        // [静态] 与使用播放传输模式的按钮的键控代码值关联的常数。 Keyboard 
        PREVIOUS  = 0x0100000F,
        // [静态] 与跳到上一曲目或章节的按钮的键控代码值关联的常数。 Keyboard 
        Q  = 81,
        // [静态] 与 Q 键的键控代码值 (81) 关联的常数。 Keyboard 
        QUOTE  = 222,
        // [静态] 与 ' 键的键控代码值 (222) 关联的常数。 Keyboard 
        R  = 82,
        // [静态] 与 R 键的键控代码值 (82) 关联的常数。 Keyboard 
        RECORD  = 0x01000006,
        // [静态] 与录制或使用录制传输模式的按钮的键控代码值关联的常数。 Keyboard 
        RED  = 0x01000000,
        // [静态] 红色功能键按钮。 Keyboard 
        REWIND  = 0x0100000B,
        // [静态] 与使用后退传输模式的按钮的键控代码值关联的常数。 Keyboard 
        RIGHT  = 39,
        // [静态] 与向右箭头键的键控代码值 (39) 关联的常数。 Keyboard 
        RIGHTBRACKET  = 221,
        // [静态] 与 ] 键的键控代码值 (221) 关联的常数。 Keyboard 
        S  = 83,
        // [静态] 与 S 键的键控代码值 (83) 关联的常数。 Keyboard 
        SEARCH  = 0x0100001F,
        // [静态] 与搜索按钮的键控代码值关联的常数。 Keyboard 
        SEMICOLON  = 186,
        // [静态] 与 ; 键的键控代码值 (186) 关联的常数。 Keyboard 
        SETUP  = 0x0100001C,
        // [静态] 与使用安装应用程序或菜单的按钮的键控代码值关联的常数。 Keyboard 
        SHIFT  = 16,
        // [静态] 与 Shift 的键控代码值 (16) 关联的常数。 Keyboard 
        SKIP_BACKWARD  = 0x0100000D,
        // [静态] 与使用快速后跳（通常 7-10 秒）的按钮的键控代码值关联的常数。 Keyboard 
        SKIP_FORWARD  = 0x0100000C,
        // [静态] 与使用快速前跳（通常 30 秒）的按钮的键控代码值关联的常数。 Keyboard 
        SLASH  = 191,
        // [静态] 与 / 键的键控代码值 (191) 关联的常数。 Keyboard 
        SPACE  = 32,
        // [静态] 与空格键的键控代码值 (32) 关联的常数。 Keyboard 
        STOP  = 0x01000009,
        // [静态] 与停止传输模式的按钮的键控代码值关联的常数。 Keyboard 
        SUBTITLE  = 0x01000018,
        // [静态] 与切换字幕的按钮的键控代码值关联的常数。 Keyboard 
        T  = 84,
        // [静态] 与 T 键的键控代码值 (84) 关联的常数。 Keyboard 
        TAB  = 9,
        // [静态] 与 Tab 的键控代码值 (9) 关联的常数。 Keyboard 
        U  = 85,
        // [静态] 与 U 键的键控代码值 (85) 关联的常数。 Keyboard 
        UP  = 38,
        // [静态] 与向上箭头键的键控代码值 (38) 关联的常数。 Keyboard 
        V  = 86,
        // [静态] 与 V 键的键控代码值 (86) 关联的常数。 Keyboard 
        VOD  = 0x0100001A,
        // [静态] 与使用视频点播的按钮的键控代码值关联的常数。 Keyboard 
        W  = 87,
        // [静态] 与 W 键的键控代码值 (87) 关联的常数。 Keyboard 
        X  = 88,
        // [静态] 与 X 键的键控代码值 (88) 关联的常数。 Keyboard 
        Y  = 89,
        // [静态] 与 Y 键的键控代码值 (89) 关联的常数。 Keyboard 
        YELLOW  = 0x01000002,
        // [静态] 与黄色功能键按钮的键控代码值关联的常数。 Keyboard 
        Z  = 90 
        
    }

    export class KeyManagerV2 extends MiniDispatcher{
        static enabled:Boolean = true;
        
        keylist:number[] = [];
        keylimit:number[] = [];

        /**
		 *用于独占按键响应，如果为true，则即使该管理器没有响应 按键回调，也不会在mainKey管理器中响应
		 */		
        isClosed:boolean = false;
        
        /**
		 * 系统默认的快捷键管理器，如果按键没有任何地方响应 那么将会响应mainKey.
		 */
        // mainKey:KeyManagerV2;
        static _defaultMainKey:KeyManagerV2;
		
		/**
		 * 当前系统响应的快捷键.
		 */
        static currentKey:KeyManagerV2;
        
        constructor(target?:DisplayObject){
            super();

            if(target){
                target.addEventListener(MouseEventX.MouseDown, this.mouseDownHandler,this);
            }
            this.keyDict = {};
        }

        mouseDownHandler(e:MouseEventX):void{
            KeyManagerV2.currentKey = this;
        }

        static resetDefaultMainKey(value?:KeyManagerV2):void{
            KeyManagerV2._defaultMainKey = value == null?  mainKey:value;
            this.setFocus(KeyManagerV2._defaultMainKey);
            
        }

        static setFocus(focus?:KeyManagerV2):void{

            if(KeyManagerV2.currentKey && KeyManagerV2.currentKey.isClosed){
                return;
            }

            if(!focus){
                focus = KeyManagerV2._defaultMainKey;
            }

            KeyManagerV2.currentKey = focus;
        }
        
        awaken():void
		{
			KeyManagerV2.currentKey=this;
		}
		
		sleep():void
		{
			KeyManagerV2.setFocus(KeyManagerV2._defaultMainKey);
		}


        init():void{



            let $this = this;
            function m(e){
                $this.onKeyHandle(e);
            };

            let canvas = ROOT.canvas;
            window.onkeydown = m;
            window.onkeyup = m;


            this.keylimit = [Keybord.SHIFT,Keybord.CONTROL,Keybord.ALTERNATE];
            this.keylist = [];
        }

        onKeyHandle(e:KeyboardEvent):void{
            e.stopImmediatePropagation();

            let keyList = this.keylist;
            let i;
            let code = e.keyCode;
            if(!this.check()){
                i = keyList.indexOf(code);
                if(i != -1){
                    keyList.splice(i,1);
                }
                return;
            }

            if(this.keylimit.indexOf(code) != -1) return;
            if (e.type == "keydown")
			{
				if (keyList.indexOf(code) != -1)
				{
					return;
				}
				keyList.push(code);
			}else{
				i=keyList.indexOf(code);
				if (i != -1)
				{
					keyList.splice(i, 1);
				}
            }
            
            let type:number=(e.type == "keydown") ? 0 : 1;
            let shiftKey,ctrlKey,altKey;
            shiftKey = e.shiftKey?1:0;
            ctrlKey = e.ctrlKey?1:0;
            altKey = e.altKey?1:0;

			var keyvalue:number= type << 12 | shiftKey<< 11 | ctrlKey << 10 | altKey << 9 | e.keyCode;
			if ((!KeyManagerV2.currentKey || !KeyManagerV2.currentKey.doKey(e, keyvalue)) && mainKey)
			{
				mainKey.doKey(e, keyvalue);
			}

        }

        /**
         * 执行快捷键
         * @param e 
         * @param keyvalue 
         */
        keyDict:{[key:string]:Function} = {};
        keyObj:{[key:string]:any} = {};
        currentKeyCode:number;
        doKey(e:KeyboardEvent,keyvalue:number):boolean{
			let f:Function= this.keyDict[keyvalue];
			this.currentKeyCode=keyvalue & 0xFF;
			if (f != null)
			{
				if(f.length==1){
                    f.call(this.keyObj[keyvalue],e);
				}else{
					f.call(this.keyObj[keyvalue]);
				}
				return true;
			}
			return this.isClosed;
        }

        check():boolean{
            if(!KeyManagerV2.enabled){
                return false; 
            }
            //check input
            return true;
        }

        regKeyDown(key:number, func:Function, thisobj:any,shift:boolean=false, ctrl:boolean=false, alt:boolean=false):void
		{
            let shiftKey,ctrlKey,altKey;
            shiftKey = shift?1:0;
            ctrlKey = ctrl?1:0;
            altKey = alt?1:0
            this.keyDict[shiftKey << 11 | ctrlKey << 10 | altKey << 9 | key]=func;
            this.keyObj[shiftKey << 11 | ctrlKey << 10 | altKey << 9 | key] =thisobj;
        }
        
        removeKeyDown(key:number, func:Function, shift:boolean=false, ctrl:boolean=false, alt:boolean=false):void
		{
            let shiftKey,ctrlKey,altKey;
            shiftKey = shift?1:0;
            ctrlKey = ctrl?1:0;
            altKey = alt?1:0
			let d:number=shiftKey << 11 | ctrlKey << 10 | altKey << 9 | key;
			if(this.keyDict[d] == func){
				this.keyDict[d]=null;
                delete this.keyDict[d];
                
                this.keyObj[d] = null;
                delete this.keyObj[d];
            }
		}


    }

    export let mainKey = new KeyManagerV2();
}
