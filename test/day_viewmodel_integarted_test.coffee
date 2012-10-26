###
Test suite for node AND browser in one file
So, we are need some data from global
Its so wrong, but its OK for test
###

lib_path = GLOBAL?.lib_path || ''

# yes, I need both - its f*un hard to mock it, I don`t
Observer = require 'dendrite'
TimePoint = require "#{lib_path}model/timepoint"

Day = require "#{lib_path}viewmodel/day"

describe 'Day: *tested in integration manner*', ->

  test_object = options = observer = time_point = null

  beforeEach ->

    observer = new Observer # verbose : 'silent'
    time_point = new TimePoint(observer).setDate 'null', "09-05-2012", "MM-DD-YYYY"

    test_object = new Day time_point, options

  describe '#new()', ->

    it 'should return object', ->
      test_object.should.be.an.instanceof Day

  describe '#getDay()', ->

    it 'should return day', ->
      test_object.getDay().should.be.equal time_point.getDate().date()

    it 'should return formatted day if format presented', ->
      format_string = 'DD'
      test_object.getDay(format_string).should.be.equal time_point.getDate().format format_string

  describe '#getNowDay()', ->

    it 'should return current, ie now() day', ->
      test_object.getNowDay().should.be.equal new Date().getDate()

  describe '#setDay()', ->

    # this asset may be checked only in async mode
    it 'should set valid date as number', (done) ->
      checker_fn = (args...) ->
        @.getDay().should.to.be.equal 2
        done()

      my_observer = test_object.getObserverObject() # just get observer from VM
      my_observer.subscribe test_object.getNotificationBusName(), checker_fn, test_object
      test_object.getDay().should.not.to.be.equal 2
      test_object.setDay 2

    it 'should set valid date as string "02"', (done) ->
      checker_fn = (args...) ->
        @.getDay().should.to.be.equal 2
        done()

      my_observer = test_object.getObserverObject() # just get observer from VM
      my_observer.subscribe test_object.getNotificationBusName(), checker_fn, test_object
      test_object.getDay().should.not.to.be.equal 2
      test_object.setDay "02"

    it 'should throw error on invalid string',  ->
      ( -> test_object.setDay 'fake' ).should.to.throw /\|DAY\| - day is invalid/
