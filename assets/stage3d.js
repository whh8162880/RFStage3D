var root;
var engine;
function init(){
    root = rf.ROOT;
    engine = rf.Engine;
    rf.ROOT.on("debug",function (e){
        debugModel(e.data);
    })
}


function debugModel(type){
    var div = $("#debugContainer");
    if(type){
        div.show();
        engine.dispatcher.on("FPS_CHANGE",oneSecond)
    }else{
        div.hide();
    }
}


function oneSecond(e){

}


function selectd(value){
    var v = $("#nav_title")
    // [0];
    // v.innerText = value;
    v.html(value);
    switch (value) {
        case "States":
            
            break;

        case "Object":
            
            break;

        case "Texture":
            
            break;

        case "Program":
            
            break;

        case "Mesh":
            
            break;
    }
}