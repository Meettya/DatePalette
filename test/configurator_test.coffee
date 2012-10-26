###
Test suite for node AND browser in one file
So, we are need some data from global
Its so wrong, but its OK for test
###
lib_path = GLOBAL?.lib_path || ''

Configurator = require "#{lib_path}lib/configurator"

describe 'Configurator:', ->

  config = test_obj = null

  simple_default = 
    global : 
      debug : false
      turbo : on

    local :
      code : [0, 4, 6, 22]
      name : 'Manhattan project'

    status : 'classified'

  simple_addon = 
    "global.debug"  : true
    "global.turbo"  : off
    "status"        : 'public'

  simple_result =
    global : 
      debug : true
      turbo : off

    local :
      code : [0, 4, 6, 22]
      name : 'Manhattan project'

    status : 'public'

  repited_default = 
    format :
      first : 
        format :
          last :
            format : 'tt'

  repited_addon = "format.first.format.last.format" : 'YES'

  repited_resilt = 
    format :
      first : 
        format :
          last :
            format : 'YES'

  arrayed_default = 
    format : [0,2,4,6]
    answer : 42

  arrayed_addon = "format.1" : -12

  arrayed_result = 
    format : [0,-12,4,6]
    answer : 42

  describe 'compile()', ->

    it 'should keep args object untouched', ->
      clone_obj = simple_default
      config = Configurator.compile simple_default, simple_addon
      simple_default.should.be.eql clone_obj

    it 'should properly compile HASHES-only addon', ->
      config = Configurator.compile simple_default, simple_addon
      config.should.be.eql simple_result

    it 'should properly compile repited name keys', ->
      config = Configurator.compile repited_default, repited_addon
      config.should.be.eql repited_resilt

    it 'should properly compile Arrayed addon', ->
      config = Configurator.compile arrayed_default, arrayed_addon
      config.should.be.eql arrayed_result

    it 'should properly compile HASH keys with digit in name', ->
      config = Configurator.compile {}, "test.1-test" : 22
      config['test'].should.be.a 'object'
