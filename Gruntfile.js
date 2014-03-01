module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: ['consolelog.js', 'consolelog.detailprint.js']
        },
        less: {
            options: {
                paths: ["demo/bootstrap"]
            },
            files: {
                "demo/demo.css": "demo/demo.less"
            }
        },
        cssmin: {
            add_banner: {
                options: {
                    banner: '/* My minified css file */'
                },
                files: {
                    'path/to/output.css': ['path/to/**/*.css']
                }
            }
        },
        csslint: {
            strict: {
                options: {
                    // import: 2
                },
                src: ['demo/**/*.css']
            }
        },
        watch: {
            scripts: {
                files: ['**/*.js'],
                tasks: ['jshint'],
                options: {
                    spawn: false,
                }
            },
            styles: {
                files: ['**/*.less'],
                tasks: ['less'],
                options: {
                    spawn: false,
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'uglify', 'less', 'csslint', 'cssmin']);
};
