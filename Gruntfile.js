module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        foundation: {
            js: ['js/foundation/foundation.js', 'js/foundation/foundation.*.js'],
            scss: ['scss/foundation.scss']
        },

        dfc: {
            js: ['js/dfc/app.js', 'js/dfc/objects.js', 'js/dfc/aperture.js', 'js/dfc/sensor.js'],
            scss: ['scss/dfc.scss']
        },

        // https://github.com/sindresorhus/grunt-sass
        sass: {
            options: {
                outputStyle: 'nested',
            },

            dist: {
                files: {
                    'css/dfc.css': '<%= dfc.scss %>'
                },
            },

            build: {
                options: {
                    sourceMap: true,
                },
                files: {
                    'css/dfc.css': '<%= dfc.scss %>'
                },
            },
        },

        uglify: {
            options: {
                sourceMap: 'js/script.map'
            },
            dist: {
                files: {
                    'js/script.js': ['js/vendor/jquery.js', 'js/vendor/fastclick.js', 'js/vendor/handlebars-v1.2.0.js', 'js/vendor/highcharts.js', '<%= dfc.js %>', 'js/vendor/ga.js']
                }
            }
        },

        watch: {
            grunt: {
                files: ['Gruntfile.js']
            },
            styles: {
                files: ['scss/**/*.scss'],
                tasks: ['sass'],
                options: {
                    // <script src="//localhost:35729/livereload.js"></script>
                    livereload: true
                }
            },
            js: {
                files: ['<%= dfc.js %>'],
                tasks: ['uglify'],
                options: {
                    livereload: true
                }
            }
        },

        clean: {
            dist: [
                '**/*.map',
                '.sass-cache',
            ]
        },
    });

    // Load all Grunt tasks
    require('load-grunt-tasks')(grunt);

    // Distribution
    grunt.registerTask('default', ['sass:dist', 'uglify', 'clean']);
    grunt.registerTask('dist', ['default']);

    // Development
    grunt.registerTask('build', ['sass:build', 'uglify', 'watch']);
};
