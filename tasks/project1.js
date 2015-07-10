'use strict';

module.exports = function (grunt) {
    
    grunt.registerTask('project1','Project 1\'s grunt tasks', function(target) {
        var cb = this.async();
        grunt.util.spawn({
            grunt: true,
            args: [target],
            opts: {
                cwd: './Project1/'
            }
        }, function(error, result, code) {
            console.log(result.stdout);
            cb();
        });
    });
};