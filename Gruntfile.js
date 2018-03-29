module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({

        // pkg: grunt.file.readJSON('package.json'),

        ts: 
        {
            // a particular target
            default:{
                tsconfig:"./tsconfig.json",
                //reference:"./build/reference.ts",
                // debugjs:"./build/reference.js"
                debugjs:["debug.html","./bin-debug"]
            }
        },


        uglify: 
        {
            min: 
            {
              files: {'bin-debug/rfstage3d.min.js': ['bin-debug/rfstage3d.js']}
            }
        },

        copy:
        {
            main: {
                expand: true,
                src: 'assets/*',
                dest: 'bin-debug/',
            }
        }   
    });
    
    // grunt.loadNpmTasks("grunt-ts");
    // grunt.loadNpmTasks("grunt-contrib-uglify");
    // grunt.registerTask("default", ["ts","uglify:min"]);
    
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask("default", ["ts","copy:main"]);
};
