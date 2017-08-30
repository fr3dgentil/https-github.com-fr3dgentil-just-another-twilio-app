module.exports = function(grunt) {

  grunt.initConfig({

    watch: {
      src: {
        files: ['src/*'],
        tasks: ['browserify'],
        options: {},
      },
      livereload: {
        files: ['public/*'],
        options: {
          livereload: true,
        }
      }
    },

    browserify: {
      src: {
        files: [{
          src: ['src/*.js'],
          dest: 'public/script.js'
        }]
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['watch']);
}
