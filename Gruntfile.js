module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                preserveComments: 'some',
                banner: '/*! @description <%= pkg.description %>\n' +
                    ' * @version <%= pkg.version %>\n' +
                    ' * @date <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                    ' * @copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
                    ' * <%= pkg.homepage %>\n' +
                    ' */\n'
            },
            build: {
                src: '<%= pkg.name %>.js',
                dest: '<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: ['consolelog.js', 'consolelog.detailprint.js']
        },
        watch: {
            options: {
                livereload: true,
                interrupt: true
            },
            scripts: {
                files: ['consolelog.js', 'consolelog.detailprint.js', 'demo/demo.js'],
                tasks: ['jshint'],
                options: {
                    spawn: false,
                }
            },
            styles: {
                files: ['**/*.less'],
                tasks: ['less', 'csslint'],
                options: {
                    spawn: false,
                }
            }
        }
    });

    // Default task (JS only)
    grunt.registerTask('default', ['jshint', 'uglify']);

    // Development
    grunt.registerTask('dev', ['default', 'watch']);
};
