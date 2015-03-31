module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        dof: {
            js: ['src/dof.js']
        },

        gui: {
            js: [
                    'src/gui/js/dfc/main.js',
                    'src/gui/js/dfc/objects.js',
                    'src/gui/js/dfc/aperture.js',
                    'src/gui/js/dfc/sensor.js',
                ],
            scss: ['src/gui/scss/app.scss'],
        },

        foundation: {
            js: [
                    'src/gui/js/foundation/foundation.js',
                    'src/gui/js/foundation/foundation.*.js'
                ],
            scss: ['src/gui/scss/foundation.scss'],
        },

        vendor: {
            js: [
                    'src/gui/js/vendor/jquery.js',
                    'src/gui/js/vendor/fastclick.js',
                    'src/gui/js/vendor/handlebars-v1.2.0.js',
                    'src/gui/js/vendor/highcharts.js',
                    'src/gui/js/vendor/ga.js',
                ],
        },

        // Supported options: http://jshint.com/docs/
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                browser: true,
                unused: 'vars',
            },
            files: [
                '<%= dof.js %>',
                'src/gui/js/dfc/*.js',
            ],
        },

        // https://github.com/sindresorhus/grunt-sass
        sass: {
            options: {
                outputStyle: 'nested',
            },

            dist: {
                files: {
                    'dist/gui/css/app.css': '<%= gui.scss %>'
                },
            },

            build: {
                options: {
                    sourceMap: true,
                },
                files: {
                    'dist/gui/css/app.css': '<%= gui.scss %>'
                },
            },
        },

        uglify: {
            options: {
                preserveComments: 'some',
                mangle: false,
            },

            build: {
                options: {
                    sourceMap: true,
                },
                files: {
                    'dist/dof.js': ['<%= dof.js %>'],
                },
            },

            dist: {
                files: {
                    'dist/dof.js': ['<%= dof.js %>'],
                },
            },

            buildGUI: {
                options: {
                    sourceMap: true,
                },
                files: {
                    'dist/gui/js/_build.js': ['<%= gui.js %>'],
                },
            },

            distGUI: {
                files: {
                    'dist/gui/js/_build.js': ['<%= gui.js %>'],
                },
            },
        },

        concat: {
            // Prepend pre-minified vendor scripts
            distJS: {
                src: [
                        '<%= vendor.js %>',
                        'dist/gui/js/_build.js',
                    ],
                dest: 'dist/gui/js/app.js',
            },

            buildJS: {
                options: {
                    footer: '<script src="//localhost:35729/livereload.js"></script>',
                },
                src: [
                        '<%= vendor.js %>',
                        'dist/gui/js/_build.js',
                    ],
                dest: 'dist/gui/js/app.js',
            },
        },

        copy: {
            html: {
                expand: true,
                cwd: 'src/',
                src: ['gui/**/*.html'],
                dest: 'dist/',
                filter: 'isFile'
            },
            scripts: {
                expand: true,
                cwd: 'src/',
                src: ['gui/js/vendor/modernizr.js'],
                dest: 'dist/',
                filter: 'isFile'
            },
            // images: {
            //     expand: true,
            //     cwd: 'src/',
            //     src: [
            //             'cui/images/**.*',
            //             'project/images/**.*',
            //             'components/*/images/**.*'
            //         ],
            //     dest: 'dist/images',
            //     filter: 'isFile',
            //     flatten: true
            // }
        },

        watch: {
            styles: {
                files: ['src/scss/**/*.scss'],
                tasks: ['sass:build'],
                options: {
                    livereload: true
                },
            },
            js: {
                files: [
                    '<%= gui.js %>',
                    '<%= dof.js %>',
                ],
                tasks: ['uglify:build'],
                options: {
                    livereload: true
                },
            },
            html: {
                files: ['src/**/*.html'],
                tasks: ['copy:html'],
                options: {
                    livereload: true
                },
            },
        },

        clean: {
            dist: [
                'js/_build.js',
                '**/*.map',
                '.sass-cache',
            ],
        },
    });

    // Load all Grunt tasks
    require('load-grunt-tasks')(grunt);

    ////////////
    // Module //
    ////////////

    // Distribution
    grunt.registerTask('default', ['uglify:dist', 'concat:distJS', 'clean']);
    grunt.registerTask('dist', ['default']);

    // Development
    grunt.registerTask('build', ['uglify:build', 'concat:buildJS', 'watch']);

    /////////
    // GUI //
    /////////

    // Distribution
    grunt.registerTask('dist-gui', ['sass:dist', 'uglify:dist', 'uglify:distGUI', 'copy', 'clean']);

    // Development
    grunt.registerTask('build-gui', ['sass:build', 'uglify:build', 'uglify:buildGUI', 'concat:buildJS', 'copy', 'watch']);
};
