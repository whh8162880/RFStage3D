﻿module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({

        // pkg: grunt.file.readJSON('package.json'),

        ts: 
        {
            // a particular target
            default:{
                tsconfig:"./tsconfig.json",
                reference:"./build/reference.ts"
            }
        },


        uglify: 
        {
            min: 
            {
              files: {'build/rfstage3d.min.js': ['build/rfstage3d.js']}
            }
        }
    });
    
    // grunt.loadNpmTasks("grunt-ts");
    // grunt.loadNpmTasks("grunt-contrib-uglify");
    // grunt.registerTask("default", ["ts","uglify:min"]);

    grunt.loadNpmTasks("grunt-ts");
    grunt.registerTask("default", ["ts"]);
};
