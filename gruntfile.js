module.exports = function(grunt) {

	output_dir = 'htdocs/',
	source_dir = 'src/',
	temp_dir   = source_dir + 'temp/';

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-compress');
	//grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Output dirs
	js_dir      = output_dir + 'js',
	css_dir     = output_dir + 'css',

	// Source
	coffee_dir  = source_dir + 'js',
	stylus_dir  = source_dir + 'css';

	// Output files
	output_js   = output_dir + 'js/compiled.js',
	output_css  = output_dir + 'css/main.css';

	grunt.initConfig({
		stylus: {
			compile: {
				files: {
					'temp/app.css' : stylus_dir + '/main.styl'
				}
			}
		},

		coffee: {
			compile: {
				files: {
					'htdocs/js/main.js' : [coffee_dir + '/main.coffee'],
					'htdocs/js/loader.js' : [coffee_dir + '/loader.coffee'],
					'temp/hoverfold.js' : [coffee_dir + '/hoverfold.coffee']
				}
			}
		},

		concat: {
			js: {
				src: [js_dir + '/vendor/underscore-min.js', js_dir + '/vendor/backbone-min.js', js_dir + '/plugins.js', 'temp/hoverfold.js'],
				dest: 'temp/compiled.js'
			},

			css: {
				//src: [css_dir + '/normalize.css', 'temp/app.css'],
				src: 'temp/app.css',
				dest: 'temp/compiled.css'
			}
		},


		uglify: {
			compress: {
				src: 'temp/compiled.js',
				dest: output_js
			}
		},
		/*
		cssmin: {
			compress: {
				src: 'temp/app.css',
				dest: output_css
			}
		}, */

		copy: {
			css: {
				src: 'temp/compiled.css',
				dest: output_css
			},

			js: {
				src: 'temp/compiled.js',
				dest: output_js
			}
		},

		clean: {
			kill: ['temp']
		},

		watch: {
			scripts: {
				files: [coffee_dir + '/*.coffee', stylus_dir + '/*.styl'],
				tasks: ['watchit'],
				options: {
					interrupt: true
				}
			}
		}
	});

	grunt.registerTask('default', ['stylus', 'coffee', 'concat', 'copy', 'uglify', /*'cssmin',*/ 'clean']);
	grunt.registerTask('watchit', ['stylus', 'coffee', 'concat', 'copy', 'uglify', 'watch']);
};
