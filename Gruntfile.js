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

        sass: {
            dist: {
                options: {
                    style: 'compressed',
                    loadPath: ['scss'],
                    compass: true,
                    sourcemap: true
                },
                files: {
                    'css/dfc.css': '<%= dfc.scss %>'
                }
            }
        },

        // compass: {
        //     dist: {
        //         options: {
        //             sassDir: 'scss',
        //             cssDir: 'css',
        //             outputStyle: 'compressed'
        //         },
        //         files: {
        //             'css/dfc.css': '<%= dfc.scss %>'
        //         }
        //     }
        // },

        uglify: {
            options: {
                sourceMap: 'js/script.map'
            },
            dist: {
                files: {
                    'js/script.js': ['js/vendor/jquery.js', 'js/vendor/fastclick.js', 'js/vendor/handlebars-v1.2.0.js', 'js/vendor/chart.min.js', '<%= dfc.js %>', 'js/vendor/ga.js']
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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    // grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('compile', ['sass', 'uglify']);
    grunt.registerTask('default', ['compile', 'watch']);
};
