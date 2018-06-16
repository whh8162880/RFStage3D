module rf{
	// %code_start%
	export interface IMODULE_TEST_BAR_BAR_BTN_UP{

	}
	export interface IMODULE_TEST_BAR_BAR_TRACK{

	}
	export interface IMODULE_TEST_BAR_BAR_BTN_THUMB{

	}
	export interface IMODULE_TEST_BAR_BAR_BTN_DOWN{

	}
	export interface IMODULE_TEST_BAR_BAR{
		btn_down?:Button & IMODULE_TEST_BAR_BAR_BTN_DOWN;
		btn_thumb?:Button & IMODULE_TEST_BAR_BAR_BTN_THUMB;
		track?:Component & IMODULE_TEST_BAR_BAR_TRACK;
		btn_up?:Button & IMODULE_TEST_BAR_BAR_BTN_UP;

	}
	export interface IMODULE_TEST_AREA_BTN_ENTER_TXT_LABEL{

	}
	export interface IMODULE_TEST_AREA_BTN_ENTER{
		txt_label?:Label & IMODULE_TEST_AREA_BTN_ENTER_TXT_LABEL;

	}
	export interface IMODULE_TEST_AREA_CK_CHECKBOX_TXT_LABEL{

	}
	export interface IMODULE_TEST_AREA_CK_CHECKBOX{
		txt_label?:Label & IMODULE_TEST_AREA_CK_CHECKBOX_TXT_LABEL;

	}
	export interface IMODULE_TEST_AREA_RD_RADIOBUTTON_TXT_LABEL{

	}
	export interface IMODULE_TEST_AREA_RD_RADIOBUTTON{
		txt_label?:Label & IMODULE_TEST_AREA_RD_RADIOBUTTON_TXT_LABEL;

	}
	export interface IMODULE_TEST_AREA{
		rd_radiobutton?:RadioButton & IMODULE_TEST_AREA_RD_RADIOBUTTON;
		ck_checkbox?:CheckBox & IMODULE_TEST_AREA_CK_CHECKBOX;
		btn_enter?:Button & IMODULE_TEST_AREA_BTN_ENTER;

	}
	export interface IMODULE_TEST{
		area?:Component & IMODULE_TEST_AREA;
		bar_bar?:ScrollBar & IMODULE_TEST_BAR_BAR;

	}	
// %code_end%
}