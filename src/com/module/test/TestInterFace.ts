module rf{
	// %code_start%
	export interface IMODULE_TEST_SYMBOL0_BTN_DECARRAW{

	}
	export interface IMODULE_TEST_SYMBOL0_TRACK{

	}
	export interface IMODULE_TEST_SYMBOL0_BTN_ADDARRAW{

	}
	export interface IMODULE_TEST_SYMBOL0_BTN_THUMB{

	}
	export interface IMODULE_TEST_SYMBOL0{
		btn_thumb?:Button & IMODULE_TEST_SYMBOL0_BTN_THUMB;
		btn_addarraw?:Button & IMODULE_TEST_SYMBOL0_BTN_ADDARRAW;
		track?:Component & IMODULE_TEST_SYMBOL0_TRACK;
		btn_decarraw?:Button & IMODULE_TEST_SYMBOL0_BTN_DECARRAW;

	}
	export interface IMODULE_TEST_SYMBOL1_BTN_THUMB{

	}
	export interface IMODULE_TEST_SYMBOL1_BTN_ADDARRAW{

	}
	export interface IMODULE_TEST_SYMBOL1_TRACK{

	}
	export interface IMODULE_TEST_SYMBOL1_BTN_DECARRAW{

	}
	export interface IMODULE_TEST_SYMBOL1{
		btn_decarraw?:Button & IMODULE_TEST_SYMBOL1_BTN_DECARRAW;
		track?:Component & IMODULE_TEST_SYMBOL1_TRACK;
		btn_addarraw?:Button & IMODULE_TEST_SYMBOL1_BTN_ADDARRAW;
		btn_thumb?:Button & IMODULE_TEST_SYMBOL1_BTN_THUMB;

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
		symbol1?:Component & IMODULE_TEST_SYMBOL1;
		symbol0?:Component & IMODULE_TEST_SYMBOL0;

	}	
// %code_end%
}