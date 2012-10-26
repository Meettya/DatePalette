###
Test suite for node AND browser in one file
So, we are need some data from global
Its so wrong, but its OK for test
###

# TODO its work now only in Node, may be later I`l fix it somehow.
sinon = require 'sinon'

lib_path = GLOBAL?.lib_path || ''

TimePoint = require "#{lib_path}model/timepoint"

describe 'TimePoint:', ->

  timepoint = options = Observer = null


  beforeEach ->

    Observer = 
      publish : ->
      publishAsync : ->

    options = Observer

    timepoint = new TimePoint options

  describe '#new()', ->

    it 'should return object', ->
      timepoint.should.be.an.instanceof TimePoint

  describe '#setDate()', ->

    it 'should setup valid Date', ->
      timepoint.setDate 'unknown', "12-25-1995", "MM-DD-YYYY"

    it 'should call #Observer.publishAsync() every time', ->
      mock = sinon.mock Observer
      mock.expects('publishAsync').twice().returns(true)

      timepoint.setDate 'unknown', "12-25-1995", "MM-DD-YYYY"
      timepoint.setDate 'unknown', "01-12-2007", "MM-DD-YYYY"
      mock.verify().should.be.true

    it 'should rise exception on invalid data', ->
      ( -> timepoint.setDate 'unknown', "foo" ).should.to.throw /creation aborted, invalid data/

  describe '#getDate()', ->

    it 'should return Moment object in void call #getDate()', ->
      moment = timepoint.getDate()
      moment.should.to.be.respondTo 'daysInMonth'

    it 'should return native Javascript Date in #getDate("js")', ->
      date = new Date( 1912, 11, 10 )
      timepoint = new TimePoint(options).setDate 'unknown', date
      timepoint.getDate('js').should.be.equal date

    it 'should return Unix Epox MilliSeconds of date in #getDate("epox_ms")', ->
      date = new Date( 1912, 11, 10 )
      timepoint = new TimePoint(options).setDate 'unknown', date
      timepoint.getDate('epox_ms').should.be.equal date.valueOf()

  describe '#getNow()', ->

    it 'should return current, ie now() value', ->
      date = new Date( 1912, 11, 10 )
      timepoint = new TimePoint(options).setDate 'unknown', date
      timepoint.getNow('js').toString().should.be.equal new Date().toString()

  describe '#undoDateChanges()', ->

    it 'should restore previews Date', ->
      date = new Date( 1912, 11, 10 )
      timepoint.setDate 'unknown', date
      timepoint.setDate 'unknown', "01-12-2007", "MM-DD-YYYY"
      timepoint.undoDateChanges 'unknown', timepoint._tick_
      timepoint.getDate('js').should.be.eql date

    it 'should throw error on empty undo stack', ->
      ( -> timepoint.undoDateChanges 'unknown', timepoint._tick_ ).should.to.throw /^undoDateChanges aborted, undo stack is empty/

    it 'should throw error on tick mismatch', ->
      timepoint.setDate 'unknown', "01-12-2007", "MM-DD-YYYY"
      ( -> timepoint.undoDateChanges 'unknown', timepoint._tick_ + 1 ).should.to.throw /^undoDateChanges aborted, tick mismatch/

    it 'should throw error on void tick', ->
      timepoint.setDate 'unknown', "01-12-2007", "MM-DD-YYYY"
      ( -> timepoint.undoDateChanges() ).should.to.throw /^undoDateChanges aborted, void tick argument is forbidden/
