module rf{
	// %code_start%
	export interface IMODULE_TEST_BTN_ENTER_TXT_LABEL{

	}
	export interface IMODULE_TEST_BTN_ENTER{
		txt_label?:Label & IMODULE_TEST_BTN_ENTER_TXT_LABEL;

	}
	export interface IMODULE_TEST_SYMBOL1{

	}
	export interface IMODULE_TEST{
		symbol1?:Component & IMODULE_TEST_SYMBOL1;
		btn_enter?:Button & IMODULE_TEST_BTN_ENTER;

	}	
// %code_end%
}