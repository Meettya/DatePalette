###
Test suite for node AND browser in one file
So, we are need some data from global
Its so wrong, but its OK for test
###

lib_path = GLOBAL?.lib_path || ''

# yes, I need both - its f*un hard to mock it, I don`t
Observer = require 'dendrite'
TimePoint = require "#{lib_path}model/timepoint"

Caption = require "#{lib_path}viewmodel/caption"

describe 'Caption: *tested in integration manner*', ->

  test_object = options = observer = time_point = null
  date_str    = "09-05-2012"
  format_str  = "MM-DD-YYYY"

  beforeEach ->

    observer = new Observer # verbose : 'silent'
    time_point = new TimePoint(observer).setDate 'null', date_str, format_str

    test_object = new Caption time_point, options

  describe '#new()', ->

    it 'should return object', ->
      test_object.should.be.an.instanceof Caption

  describe '#getCaption()', ->

    it 'should return date as string in selected format', ->
      test_object.getCaption(format_str).should.be.equal date_str

    it 'should throw error if format absent',  ->
      ( -> test_object.getCaption() ).should.to.throw /\|Caption\.get\*\AsString| MUST be called with format/
