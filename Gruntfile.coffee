'use strict'

module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    coffee:
      compile:
        files:
          'dist/jquery.translate.js': 'src/jquery.translate.coffee'
          'spec/test.spec.js': 'spec/test.spec.coffee'
    coffeelint:
      app:
        [ 'src/*.coffee' ]
    uglify:
      options:
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> */\n'
      build:
        files: 'dist/jquery.translate.min.js': 'dist/jquery.translate.js'
    compress:
      main:
        options:
          mode: 'gzip'
        files: [ {
          src: [ 'dist/jquery.translate.min.js' ]
          dest: 'dist/jquery.translate.js.gz'
        }]
    jasmine:
      specs:
        src: 'dist/jquery.translate.js'
        options:
          specs: 'spec/*spec.js'
          vendor: [
            "bower_components/jquery/dist/jquery.min.js"
            "bower_components/js-cookie/src/js.cookie.js"
            "bower_components/js-url/url.min.js"
            "bower_components/jquery.language/dist/jquery.language.js"
            "bower_components/jasmine-jquery/lib/jasmine-jquery.js"
          ]
    watch:
      options: livereload: true
      files: '{src,spec}/*.coffee'
      tasks: 'default'

  # Loading dependencies
  for key of grunt.file.readJSON('package.json').devDependencies
    if key != 'grunt' and key.indexOf('grunt') == 0
      grunt.loadNpmTasks key

  grunt.registerTask 'default', [
    'coffeelint'
    'coffee'
    'jasmine'
    'uglify'
    'compress'
  ]

  grunt.registerTask 'test', [
    'coffee'
    'jasmine'
  ]
