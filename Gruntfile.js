'use strict';

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);
    
    var appConfig = {
        app: require('./bower.json').appPath || 'app',
        dist: 'dist'
    };
    
    grunt.initConfig({
        projects: grunt.file.readJSON('./config/projects.json')
        
    })
    
    grunt.loadTasks('tasks');
    grunt.registerTask('default', ['run-grunt'])
};