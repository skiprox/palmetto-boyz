module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	//Project configuration.
	grunt.initConfig({
		browserify: {
      dev: {
        options: {
          debug: true
        },
        files:{
          'public/app.built.js' : 'public/app.js'
        }
      }
    },
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'public/css/screen.css': 'public/scss/screen.scss'
        }
      }
    },
		watch: {
      js: {
        files: ['public/app.js', 'public/modules/*.js'],
        tasks: ['browserify:dev']
      },
      css: {
        files: ['public/scss/*.scss'],
        tasks: ['sass']
      }
    }
	});

	//Task(s).
	grunt.registerTask('default', ['browserify', 'sass']);

}