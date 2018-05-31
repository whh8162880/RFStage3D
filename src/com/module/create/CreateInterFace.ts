module rf{
	// %code_start%
	export interface IMODULE_CREATE_BTN_RANDOM{

	}
	export interface IMODULE_CREATE_SYMBOL2{

	}
	export interface IMODULE_CREATE_TXT_WARNING{

	}
	export interface IMODULE_CREATE_TXT_NAME{

	}
	export interface IMODULE_CREATE_DELE_INFO_TXT_NAME{

	}
	export interface IMODULE_CREATE_DELE_INFO_SYMBOL3{

	}
	export interface IMODULE_CREATE_DELE_INFO_BTN_RANDOM{

	}
	export interface IMODULE_CREATE_DELE_INFO_TXT_WARNING{

	}
	export interface IMODULE_CREATE_DELE_INFO_BTN_CREATE{

	}
	export interface IMODULE_CREATE_DELE_INFO_TXT_ADDMSG{

	}
	export interface IMODULE_CREATE_DELE_INFO_TXT_COOL{

	}
	export interface IMODULE_CREATE_DELE_INFO_NAMEBG{

	}
	export interface IMODULE_CREATE_DELE_INFO{
		namebg?:Component & IMODULE_CREATE_DELE_INFO_NAMEBG;
		txt_cool?:Label & IMODULE_CREATE_DELE_INFO_TXT_COOL;
		txt_addmsg?:Label & IMODULE_CREATE_DELE_INFO_TXT_ADDMSG;
		btn_create?:Button & IMODULE_CREATE_DELE_INFO_BTN_CREATE;
		txt_warning?:Label & IMODULE_CREATE_DELE_INFO_TXT_WARNING;
		btn_random?:Button & IMODULE_CREATE_DELE_INFO_BTN_RANDOM;
		symbol3?:Component & IMODULE_CREATE_DELE_INFO_SYMBOL3;
		txt_name?:Label & IMODULE_CREATE_DELE_INFO_TXT_NAME;

	}
	export interface IMODULE_CREATE_TXT_ADDMSG{

	}
	export interface IMODULE_CREATE_BAR_SCROLL_BTN_THUMB{

	}
	export interface IMODULE_CREATE_BAR_SCROLL_TRACK{

	}
	export interface IMODULE_CREATE_BAR_SCROLL_BTN_DOWN{

	}
	export interface IMODULE_CREATE_BAR_SCROLL_BTN_UP{

	}
	export interface IMODULE_CREATE_BAR_SCROLL{
		btn_up?:Button & IMODULE_CREATE_BAR_SCROLL_BTN_UP;
		btn_down?:Button & IMODULE_CREATE_BAR_SCROLL_BTN_DOWN;
		track?:Component & IMODULE_CREATE_BAR_SCROLL_TRACK;
		btn_thumb?:Button & IMODULE_CREATE_BAR_SCROLL_BTN_THUMB;

	}
	export interface IMODULE_CREATE_BTN_CREATE{

	}
	export interface IMODULE_CREATE_NAMEBG{

	}
	export interface IMODULE_CREATE_TXT_COOL{

	}
	export interface IMODULE_CREATE{
		txt_cool?:Label & IMODULE_CREATE_TXT_COOL;
		namebg?:Component & IMODULE_CREATE_NAMEBG;
		btn_create?:Button & IMODULE_CREATE_BTN_CREATE;
		bar_scroll?:Component & IMODULE_CREATE_BAR_SCROLL;
		txt_addmsg?:Label & IMODULE_CREATE_TXT_ADDMSG;
		dele_info?:InfoDele & IMODULE_CREATE_DELE_INFO;
		txt_name?:Label & IMODULE_CREATE_TXT_NAME;
		txt_warning?:Label & IMODULE_CREATE_TXT_WARNING;
		symbol2?:Component & IMODULE_CREATE_SYMBOL2;
		btn_random?:Button & IMODULE_CREATE_BTN_RANDOM;

	}	
// %code_end%
}