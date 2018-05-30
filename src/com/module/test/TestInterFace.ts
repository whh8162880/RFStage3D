module rf{
    // %code_start%
    
    export interface IModule_test_symbol1{

    }

    export interface IModule_test_btn_enter{

    }

    
    export interface IModule_test{
        x:number;
        btn_enter?:Button & IModule_test_btn_enter
        symbol1?:Component & IModule_test_symbol1
    }



	
	// %code_end%
}