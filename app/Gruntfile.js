module.exports = function (grunt) {
    var DoF = ''

    // const fs = require('fs')

    // fs.readFile('./src/js/dfc/dof.js', 'utf-8', (err, data) => {
    //     if (err) {
    //         throw err
    //     }

    //     DoF = data
    // })

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // dof: {
        //     js: 'var DoF = <%= DoF %>',
        // },

        gui: {
            js: [
                'src/js/dfc/dof.js',
                'src/js/dfc/main.js',
                'src/js/dfc/lens.js',
                'src/js/dfc/aperture.js',
                'src/js/dfc/sensor.js',
            ],
            scss: ['src/scss/app.scss'],
        },

        vendor: {
            js: [
                'src/js/vendor/dof.js',
                'src/js/vendor/jquery.js',
                'src/js/vendor/fastclick.js',
                'src/js/vendor/handlebars-v1.2.0.js',
                'src/js/vendor/highcharts.js',
                'src/js/vendor/ga.js',
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
            files: ['<%= gui.js %>'],
        },

        // https://github.com/sindresorhus/grunt-sass
        sass: {
            dist: {
                files: {
                    'dist/css/app.css': '<%= gui.scss %>',
                },
            },

            build: {
                options: {
                    sourceMap: true,
                },
                files: {
                    'dist/css/app.css': '<%= gui.scss %>',
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
                    'dist/js/app.js': ['<%= gui.js %>'],
                },
            },

            dist: {
                files: {
                    'dist/js/app.js': ['<%= gui.js %>'],
                },
            },
        },

        concat: {
            // Combine pre-minified vendor scripts
            guiJS: {
                // banner: '<%= dof.js %>',
                src: ['<%= gui.js %>'],
                dest: 'dist/js/app.js',
            },
            // Combine pre-minified vendor scripts
            vendorJS: {
                src: ['<%= vendor.js %>'],
                dest: 'dist/js/vendor.js',
            },
        },

        copy: {
            html: {
                expand: true,
                cwd: 'src/',
                src: ['**/*.html'],
                dest: 'dist/',
                filter: 'isFile',
            },
            scripts: {
                expand: true,
                cwd: 'src/',
                src: ['js/vendor/modernizr.js'],
                dest: 'dist/',
                filter: 'isFile',
            },
            images: {
                expand: true,
                cwd: 'src/',
                src: ['about/images/*.png'],
                dest: 'dist/',
                filter: 'isFile',
            },
        },

        watch: {
            styles: {
                files: ['src/scss/**/*.scss'],
                tasks: ['sass:build'],
                options: {
                    livereload: true,
                },
            },
            js: {
                files: ['<%= gui.js %>'],
                tasks: ['uglify:build'],
                options: {
                    livereload: true,
                },
            },
            html: {
                files: ['src/**/*.html'],
                tasks: ['copy:html'],
                options: {
                    livereload: true,
                },
            },
        },

        clean: {
            dist: ['js/_build.js', '**/*.map', '.sass-cache'],
        },
    })

    // Load all Grunt tasks
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('load-grunt-tasks')(grunt)

    ////////////
    // Module //
    ////////////

    // Distribution
    grunt.registerTask('default', ['jshint', 'clean'])

    grunt.registerTask('dist', ['default'])

    // Development
    grunt.registerTask('build', ['jshint', 'watch'])

    /////////
    // GUI //
    /////////

    // Distribution
    grunt.registerTask('dist-gui', ['sass:dist', 'concat:guiJS', 'concat:vendorJS', 'copy', 'clean'])

    // Development
    grunt.registerTask('build-gui', ['sass:build', 'concat:guiJS', 'concat:vendorJS', 'copy', 'watch'])
}
