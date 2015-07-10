'use strict';

module.exports = function (grunt) {
    
    grunt.registerTask('project2','Project 2\'s grunt tasks', function(target) {
        var cb = this.async();
        grunt.util.spawn({
            grunt: true,
            args: [target],
            opts: {
                cwd: './Project2/'
            }
        }, function(error, result, code) {
            console.log(result.stdout);
            cb();
        });
    });


};