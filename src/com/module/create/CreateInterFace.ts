module rf{
	// %code_start%
	export interface IMODULE_CREATE_BTN_CREATE{

	}
	export interface IMODULE_CREATE_BTN_RANDOM{

	}
	export interface IMODULE_CREATE_DELE_INFO_SYMBOL1{

	}
	export interface IMODULE_CREATE_DELE_INFO_NAMEBG{

	}
	export interface IMODULE_CREATE_DELE_INFO_TXT_COOL{

	}
	export interface IMODULE_CREATE_DELE_INFO_TXT_ADDMSG{

	}
	export interface IMODULE_CREATE_DELE_INFO_TXT_WARNING{

	}
	export interface IMODULE_CREATE_DELE_INFO_BTN_RANDOM{

	}
	export interface IMODULE_CREATE_DELE_INFO_BTN_CREATE{

	}
	export interface IMODULE_CREATE_DELE_INFO_TXT_NAME{

	}
	export interface IMODULE_CREATE_DELE_INFO{
		txt_name?:Label & IMODULE_CREATE_DELE_INFO_TXT_NAME;
		btn_create?:Button & IMODULE_CREATE_DELE_INFO_BTN_CREATE;
		btn_random?:Button & IMODULE_CREATE_DELE_INFO_BTN_RANDOM;
		txt_warning?:Label & IMODULE_CREATE_DELE_INFO_TXT_WARNING;
		txt_addmsg?:Label & IMODULE_CREATE_DELE_INFO_TXT_ADDMSG;
		txt_cool?:Label & IMODULE_CREATE_DELE_INFO_TXT_COOL;
		namebg?:Component & IMODULE_CREATE_DELE_INFO_NAMEBG;
		symbol1?:Component & IMODULE_CREATE_DELE_INFO_SYMBOL1;

	}
	export interface IMODULE_CREATE_TXT_NAME{

	}
	export interface IMODULE_CREATE_BAR_SCROLL_BTN_DOWN{

	}
	export interface IMODULE_CREATE_BAR_SCROLL_BTN_UP{

	}
	export interface IMODULE_CREATE_BAR_SCROLL_BTN_THUMB{

	}
	export interface IMODULE_CREATE_BAR_SCROLL_TRACK{

	}
	export interface IMODULE_CREATE_BAR_SCROLL{
		track?:Component & IMODULE_CREATE_BAR_SCROLL_TRACK;
		btn_thumb?:Button & IMODULE_CREATE_BAR_SCROLL_BTN_THUMB;
		btn_up?:Button & IMODULE_CREATE_BAR_SCROLL_BTN_UP;
		btn_down?:Button & IMODULE_CREATE_BAR_SCROLL_BTN_DOWN;

	}
	export interface IMODULE_CREATE_TXT_COOL{

	}
	export interface IMODULE_CREATE_TXT_WARNING{

	}
	export interface IMODULE_CREATE_SYMBOL0{

	}
	export interface IMODULE_CREATE_NAMEBG{

	}
	export interface IMODULE_CREATE_TXT_ADDMSG{

	}
	export interface IMODULE_CREATE{
		txt_addmsg?:Label & IMODULE_CREATE_TXT_ADDMSG;
		namebg?:Component & IMODULE_CREATE_NAMEBG;
		symbol0?:Component & IMODULE_CREATE_SYMBOL0;
		txt_warning?:Label & IMODULE_CREATE_TXT_WARNING;
		txt_cool?:Label & IMODULE_CREATE_TXT_COOL;
		bar_scroll?:Component & IMODULE_CREATE_BAR_SCROLL;
		txt_name?:Label & IMODULE_CREATE_TXT_NAME;
		dele_info?:Component & IMODULE_CREATE_DELE_INFO;
		btn_random?:Button & IMODULE_CREATE_BTN_RANDOM;
		btn_create?:Button & IMODULE_CREATE_BTN_CREATE;

	}	
// %code_end%
}