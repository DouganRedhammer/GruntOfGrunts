'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    var sharedLibs = []
    var appConfig = {
        app: require('./bower.json').appPath || 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        yeoman: appConfig,
    });

  
grunt.registerTask('qa', function() {
    console.log("qa task running");
});
    
grunt.registerTask('dev', function() {
    console.log("dev task running");
});

grunt.registerTask('prod', function() {
    console.log("prod task running");
});
grunt.registerTask('default', function() {
    console.log("default task running");
});
grunt.registerTask('build', function() {
    console.log("default task running");
});
};