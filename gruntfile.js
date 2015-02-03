module.exports = function(grunt) {

	//Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		browserify: {
			dist: {
				files: {
					'public/app.built.js': ['public/app.js']
				}
			}
		}
	});

	//Load plugins.
	grunt.loadNpmTasks('grunt-browserify');

	//Task(s).
	grunt.registerTask('default', ['browserify']);

}