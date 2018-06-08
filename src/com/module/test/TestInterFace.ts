module rf{
	// %code_start%
	export interface IMODULE_TEST_SYMBOL3_TRACK{

	}
	export interface IMODULE_TEST_SYMBOL3_BTN_DOWN{

	}
	export interface IMODULE_TEST_SYMBOL3_BTN_UP{

	}
	export interface IMODULE_TEST_SYMBOL3_BTN_THUMB{

	}
	export interface IMODULE_TEST_SYMBOL3{
		btn_thumb?:Button & IMODULE_TEST_SYMBOL3_BTN_THUMB;
		btn_up?:Button & IMODULE_TEST_SYMBOL3_BTN_UP;
		btn_down?:Button & IMODULE_TEST_SYMBOL3_BTN_DOWN;
		track?:Component & IMODULE_TEST_SYMBOL3_TRACK;

	}
	export interface IMODULE_TEST_SYMBOL2_BTN_DOWN{

	}
	export interface IMODULE_TEST_SYMBOL2_BTN_UP{

	}
	export interface IMODULE_TEST_SYMBOL2_BTN_THUMB{

	}
	export interface IMODULE_TEST_SYMBOL2_TRACK{

	}
	export interface IMODULE_TEST_SYMBOL2{
		track?:Component & IMODULE_TEST_SYMBOL2_TRACK;
		btn_thumb?:Button & IMODULE_TEST_SYMBOL2_BTN_THUMB;
		btn_up?:Button & IMODULE_TEST_SYMBOL2_BTN_UP;
		btn_down?:Button & IMODULE_TEST_SYMBOL2_BTN_DOWN;

	}
	export interface IMODULE_TEST_AREA_CK_CHECKBOX_TXT_LABEL{

	}
	export interface IMODULE_TEST_AREA_CK_CHECKBOX{
		txt_label?:Label & IMODULE_TEST_AREA_CK_CHECKBOX_TXT_LABEL;

	}
	export interface IMODULE_TEST_AREA_BTN_ENTER_TXT_LABEL{

	}
	export interface IMODULE_TEST_AREA_BTN_ENTER{
		txt_label?:Label & IMODULE_TEST_AREA_BTN_ENTER_TXT_LABEL;

	}
	export interface IMODULE_TEST_AREA_RD_RADIOBUTTON_TXT_LABEL{

	}
	export interface IMODULE_TEST_AREA_RD_RADIOBUTTON{
		txt_label?:Label & IMODULE_TEST_AREA_RD_RADIOBUTTON_TXT_LABEL;

	}
	export interface IMODULE_TEST_AREA{
		rd_radiobutton?:RadioButton & IMODULE_TEST_AREA_RD_RADIOBUTTON;
		btn_enter?:Button & IMODULE_TEST_AREA_BTN_ENTER;
		ck_checkbox?:CheckBox & IMODULE_TEST_AREA_CK_CHECKBOX;

	}
	export interface IMODULE_TEST{
		area?:Component & IMODULE_TEST_AREA;
		symbol2?:Component & IMODULE_TEST_SYMBOL2;
		symbol3?:Component & IMODULE_TEST_SYMBOL3;

	}	
// %code_end%
}