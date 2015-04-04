module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        dof: {
            js: ['src/dof.js']
        },

        gui: {
            js: [
                    'src/dof.js',
                    'src/gui/js/dfc/main.js',
                    'src/gui/js/dfc/lens.js',
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
                '<%= gui.js %>',
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
                    // footer: '(function(){var s=document.createElement("script");s.src="//localhost:35729/livereload.js";document.head.appendChild(s);}());',
                },
                files: {
                    'dist/gui/js/app.js': ['<%= gui.js %>'],
                },
            },

            distGUI: {
                files: {
                    'dist/gui/js/app.js': ['<%= gui.js %>'],
                },
            },
        },

        concat: {
            // Combine pre-minified vendor scripts
            vendorJS: {
                src: ['<%= vendor.js %>'],
                dest: 'dist/gui/js/vendor.js',
            },
        },

        copy: {
            html: {
                expand: true,
                cwd: 'src/',
                src: ['gui/**/*.html'],
                dest: 'dist/',
                filter: 'isFile',
            },
            scripts: {
                expand: true,
                cwd: 'src/',
                src: ['gui/js/vendor/modernizr.js'],
                dest: 'dist/',
                filter: 'isFile',
            },
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
                ],
                tasks: ['uglify:buildGUI'],
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
    grunt.registerTask('default', [
        'uglify:dist',
        'clean',
    ]);

    grunt.registerTask('dist', ['default']);

    // Development
    grunt.registerTask('build', [
        'uglify:build',
        'watch',
    ]);

    /////////
    // GUI //
    /////////

    // Distribution
    grunt.registerTask('dist-gui', [
        'sass:dist',
        'uglify:distGUI',
        'concat:vendorJS',
        'copy',
        'clean',
    ]);

    // Development
    grunt.registerTask('build-gui', [
        'sass:build',
        'uglify:buildGUI',
        'concat:vendorJS',
        'copy',
        'watch',
    ]);
};
