'use strict';

module.exports = function (grunt) {
        
    grunt.registerTask('installNpm','Invokes npm install at the specified target. ex: grunt installNpm:./project1', function(target) {

        var exec = require('child_process').exec;
        var cb = this.async();
            exec('npm install', {cwd: target}, function(err, stdout, stderr) {
                console.log(stdout);
                cb();
            });

    });

    grunt.registerTask('installBower','Invokes bower install at the specified target. ex: grunt installBower:./project1', function(target) {

        var exec = require('child_process').exec;
        var cb = this.async();
            exec('bower install', {cwd: target}, function(err, stdout, stderr) {
                console.log(stdout);
                cb();
            });
    });

    grunt.registerTask('installAll','Invokes npm install and bower install at the specified target. ex: grunt installAll:./project1', function(target) {

        grunt.task.run('installNpm:'+target);
        grunt.task.run('installBower:'+target);
    });

    grunt.registerTask('preinstallAllProjects','Invokes npm install and bower install for all projects listed in projects.json. ex: grunt preinstallAllProjects', function() {
        var projectList = grunt.config('projects');
        for(var i in projectList.projects){
            grunt.task.run('installNpm:'+projectList.projects[i].location);
            grunt.task.run('installBower:'+projectList.projects[i].location);
        }

    });    
};