"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// var _ = require("lodash");
var fs = require("fs");
var path = require("path");
var grunt = require("grunt");
// var utils = require("./utils");

var referenceMatch = /\/\/\/ <reference path=\"(.*?)\"/g;

// const fs = require("fs");
// const build = require("extend/build");
// build.build("tsconfig.json","debug.html","./bin-debug")
// console.log("u can write js here");

function removeComments(content){
// 以下的两种方式都可以 // sodino.com
    var reg1 = /\/\/.*/g;
    var r=content.replace(reg1, '');
    var reg2 = /\/\*[\s\S]*?\*\/[^\*]/g;
    r = r.replace(reg2, '');
    // var reg = /(\/\/.*)|(\/\*[\s\S]*?\*\/)/g;
    return r;
}

function formatAssets(assets){
    var r = [];
    var i
    var file
    for (file of assets) {
        i = file.indexOf("/**/*");
        if(i != -1){
            r.push([path.resolve(file.slice(0,i+1)).replace(/\\/g,"/").toLowerCase(),1]);
        }else{
            if((i = file.lastIndexOf("*")) == file.length-1){
                r.push([path.resolve(file.slice(0,i)).replace(/\\/g,"/").toLowerCase(),2]);
            }else{
                r.push([(file).replace(/\\/g,"/").toLowerCase(),3]);
            }
        }
    }


    return r;
}


function checkAvailable(target,assets){
    var file;
    target = target.toLocaleLowerCase();
    for(file of assets){
        var i = target.indexOf(file[0]);
        if(i == -1){
            continue;
        }

        if(file[1] == 1){
            return true;
        }
        var path = target.slice(i+1);
        if(path.lastIndexOf("/") == -1){
            return true;
        }
    }
    return false;
}

function getCompileFiles(path,rootDir,include,exclude){
    var files = [];
    var simpleRoot = rootDir.replace("./","");
    rootDir = path.resolve(rootDir);
    exclude = formatAssets(exclude);
    grunt.file.recurse(rootDir,function (abspath,rootdir,subdir,filename){
        var b = checkAvailable(abspath,exclude);
        if(b == false){
            if(undefined == subdir){
                subdir = "";
            }else{
                subdir += "/";
            }
            files.push(simpleRoot+subdir+filename);
        }
        // console.log(subdir,filename);
    })

    // for(var path of files){
    //     console.log(path);
    // }

    return files;
}

function buildHtml(config) { 
    // var template = path.resolve(template);
    var tspath = path.resolve(config);
    // console.log(removeComments(grunt.file.read(tspath)));
    var ts = JSON.parse(removeComments(grunt.file.read(tspath)));
    // var ts = grunt.file.readJSON(tspath)
    // console.log(ts);
    var outDir
    var files
    if(ts.compilerOptions.module == "commonjs"){
        outDir= ts.compilerOptions.outDir;
        files = getCompileFiles(path,ts.compilerOptions.rootDir,ts.include,ts.exclude);
    }else{
        // outDir = ts.compilerOptions.outFile;
        // files = [outDir];
        // outDir = outDir.slice(0,outDir.lastIndexOf("/"));
        return;
    }

    

    var templete = path.resolve(ts.templete);
    outDir = path.resolve(outDir);

    // console.log(templete,outDir);
    updateDebugFile(files,templete,outDir)
}


function updateDebugFile(files, template,outDir) {
    var orders = getReference(files);
    var templete = grunt.file.read(template);
    var contents = "";
    orders.forEach(function (filename) {
        filename = filename.replace(".ts", ".js");
        filename = filename.replace("src/", "");
        contents += "        <script src='" + filename + "'></script>\r\n";
    });
    templete = templete.replace("<%script%/>", contents);
    grunt.file.write(outDir + "/index.html", templete);
}


function getFileNativePath(f,t){

    var bf = f;
    var bt = t;

    if(f.lastIndexOf(".") != -1){
        f = f.slice(0,f.lastIndexOf("/"));   
    }

    t = t.replace(/\\/g,"/");

    var i;
    while(true){
        i = t.indexOf("../");
        if(i != -1){
            f = f.slice(0,f.lastIndexOf("/"));
            t = t.replace("../","");
        }else{
            break;
        }
    }
    
    t = t.replace(/\.\//g,"");

    return f + "/" + t;
}


function getReference(files) {
    referenceMatch = /reference path=\"(.*?)\"/;
    var fileobj = {};
    var reference = [];
    for (var i = 0; i < files.length; i++) {
        var relativepath = files[i]
        var filepath = path.resolve(relativepath);
        var content = grunt.file.read(filepath);
        var arr = fileobj[relativepath] = [];
        while (true) {
            var match = referenceMatch.exec(content);
            if (match) {
                content = content.replace(match[0], "");
                filepath = getFileNativePath(relativepath,match[1]);
                arr.push(filepath);
            }else{
                break;
            }
        }
    }

    var key;

    var processes = [];
    function process(arr) {
        for (var i = 0; i < arr.length; i++) {
            var key = arr[i];
            if (processes.indexOf(key) == -1) {
                processes.push(key);
                if (reference.indexOf(key) == -1) {
                    if (undefined != fileobj[key]) {
                        process(fileobj[key]);
                    }
                    reference.push(key);
                }
            }
        }
    }

    process(files);

    return reference;
};




function processIndividualTemplate(template) {
    if (template) {
        return grunt.template.process(template, {});
    }
    return template;
}

exports.buildHtml = buildHtml;



function deleteCodeComments(code) {
    
}