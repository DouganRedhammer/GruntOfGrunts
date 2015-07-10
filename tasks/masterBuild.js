'use strict';

module.exports = function (grunt) {
    
    grunt.registerTask('gruntBuildTarget','Invokes grunt in the directory specified for a specified task. ex: grunt gruntBuildTarget:dev:./project1 ', function(task, location) {
        var cb = this.async();
        grunt.util.spawn({
            grunt: true,
            args: [task],
            opts: {
                cwd: location
            }
        }, function(error, result, code) {
            console.log(result.stdout);
            cb();
        });
    });

    grunt.registerTask('gruntBuildAll','Invokes grunt for all projects listed in projects.json for a specifed task. ex: gruntBuildAll:dev', function(task) {

        var projectList = grunt.config('projects');
        for(var i in projectList.projects){
            var args = {task: task, location:projectList.projects[i].location}
            grunt.task.run('gruntBuildTarget:'+args.task+':'+args.location);
            console.log(args);
        }
    });
};