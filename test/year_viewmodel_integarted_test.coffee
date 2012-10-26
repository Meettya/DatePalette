###
Test suite for node AND browser in one file
So, we are need some data from global
Its so wrong, but its OK for test
###

lib_path = GLOBAL?.lib_path || ''

# yes, I need both - its f*un hard to mock it, I don`t
Observer = require 'dendrite'
TimePoint = require "#{lib_path}model/timepoint"

Year = require "#{lib_path}viewmodel/year"

describe 'Year: *tested in integration manner*', ->

  test_object = options = observer = time_point = null

  beforeEach ->

    observer = new Observer verbose : 'silent'
    time_point = new TimePoint(observer).setDate 'null', "09-05-2012", "MM-DD-YYYY"

    options = range : [ 1920, 1940, 1960, 1980, 2000, 2010, 2020 ]

    test_object = new Year time_point, options

  describe '#new()', ->

    it 'should return object', ->
      test_object.should.be.an.instanceof Year

  describe '#getNowYear()', ->

    it 'should return current, ie now() year', ->
      test_object.getNowYear().should.be.equal new Date().getFullYear()

  describe '#getYear()', ->

    it 'should return year', ->
      test_object.getYear().should.be.equal time_point.getDate().year()

  describe '#getAvaibleEraPoints()', ->

    it 'should return years range', ->
      test_data = options.range[..]
      test_object.getAvaibleEraPoints().should.be.eql test_data

  describe '#getEraStart()', ->

    it 'should return era start for year', ->
      test_object.getEraStart().should.be.equal 2010 # for [2000, 2010, 2020] sequence and 2012 year

  describe '#getEraRanges()', ->

     it 'should return era range (start year and end year) for year', ->
      test_object.getEraRanges().should.be.eql [2010, 2020] # for [2000, 2010, 2020] sequence and 2012 year   

  describe '#setYear()', ->

    # this asset may be checked only in async mode
    it 'should set valid date', (done) ->
      checker_fn = (args...) ->
        # console.log args
        @.getEraStart().should.to.be.equal 2000
        @.getYear().should.to.be.equal 2001
        done()

      my_observer = test_object.getObserverObject() # just get observer from VM
      my_observer.subscribe test_object.getNotificationBusName(), checker_fn, test_object
      test_object.getNowYear().should.not.to.be.equal 2001
      test_object.setYear 2001

    it 'should throw error if year out of ranges', ->
      ( -> test_object.setYear 2050 ).should.to.throw /\|YEAR\| - year out of ranges/   


