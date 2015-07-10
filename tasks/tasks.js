'use strict';

module.exports = function (grunt) {
    
    grunt.registerTask('run-grunt', function() {
        var cb = this.async();
        grunt.util.spawn({
            grunt: true,
            args: ['build'],
            opts: {
                cwd: './Project1/'
            }
        }, function(error, result, code) {
            console.log(result.stdout);
            cb();
        });
    });
};