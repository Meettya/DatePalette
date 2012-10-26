###
Test suite for node AND browser in one file
So, we are need some data from global
Its so wrong, but its OK for test
###

lib_path = GLOBAL?.lib_path || ''

# yes, I need both - its f*un hard to mock it, I don`t
Observer = require 'dendrite'
TimePoint = require "#{lib_path}model/timepoint"

Month = require "#{lib_path}viewmodel/month"

describe 'Month: *tested in integration manner*', ->

  test_object = options = observer = time_point = null

  beforeEach ->

    observer = new Observer # verbose : 'silent'
    time_point = new TimePoint(observer).setDate 'null', "09-05-2012", "MM-DD-YYYY"

    test_object = new Month time_point, options

  describe '#new()', ->

    it 'should return object', ->
      test_object.should.be.an.instanceof Month

  describe '#getMonth()', ->

    it 'should return month', ->
      test_object.getMonth().should.be.equal time_point.getDate().month()

    it 'should return month name if format presented', ->
      format_string = 'MMMM'
      test_object.getMonth(format_string).should.be.equal time_point.getDate().format format_string

  describe '#getNowMonth()', ->

    it 'should return current, ie now() month', ->
      test_object.getNowMonth().should.be.equal new Date().getMonth()

  describe '#getDaysInMonth()', ->

    it 'should return numbers of days in month of self-object on void call', ->
      test_object.getDaysInMonth().should.be.equal time_point.getDate().daysInMonth()

    it 'should return number of days in sended month as arg', ->
      test_object.getDaysInMonth('March').should.be.equal 31

  describe '#setMonth()', ->

    # this asset may be checked only in async mode
    it 'should set valid date as number', (done) ->
      checker_fn = (args...) ->
        # console.log args
        # @.getEraStart().should.to.be.equal 2000
        @.getMonth().should.to.be.equal 2
        done()

      my_observer = test_object.getObserverObject() # just get observer from VM
      my_observer.subscribe test_object.getNotificationBusName(), checker_fn, test_object
      test_object.getMonth().should.not.to.be.equal 2
      test_object.setMonth 2

    it 'should throw error on invalid month number',  ->
      ( -> test_object.setMonth 22 ).should.to.throw /\|MONTH\| - month is invalid/
 
    # this asset may be checked only in async mode
    it 'should set valid date as stringed number "2"', (done) ->
      checker_fn = (args...) ->
        # console.log args
        # @.getEraStart().should.to.be.equal 2000
        @.getMonth().should.to.be.equal 2
        done()

      my_observer = test_object.getObserverObject() # just get observer from VM
      my_observer.subscribe test_object.getNotificationBusName(), checker_fn, test_object
      test_object.getMonth().should.not.to.be.equal 2
      test_object.setMonth '2'

     # this asset may be checked only in async mode
    it 'should set valid date as string month name (May)', (done) ->
      checker_fn = (args...) ->
        # console.log args
        # @.getEraStart().should.to.be.equal 2000
        @.getMonth().should.to.be.equal 4
        done()

      my_observer = test_object.getObserverObject() # just get observer from VM
      my_observer.subscribe test_object.getNotificationBusName(), checker_fn, test_object
      test_object.getMonth().should.not.to.be.equal 4
      test_object.setMonth 'May'     
 
     # this asset may be checked only in async mode
    it 'should set valid date as short string month name (Feb)', (done) ->
      checker_fn = (args...) ->
        # console.log args
        # @.getEraStart().should.to.be.equal 2000
        @.getMonth().should.to.be.equal 1
        done()

      my_observer = test_object.getObserverObject() # just get observer from VM
      my_observer.subscribe test_object.getNotificationBusName(), checker_fn, test_object
      test_object.getMonth().should.not.to.be.equal 1
      test_object.setMonth 'Feb' 

    it 'should throw error on date as string month name (MayDayThai)',  ->
      # hmmm... moment.js think its like ordinary 'May' an return 4
      # added some my own checks to prevent invalid parsing
      ( -> test_object.setMonth 'MayDayThai' ).should.to.throw /\|MONTH\| - month is invalid/   

  describe '#getMonthName()', ->

    it 'should return month name by number', ->
      test_object.getMonthName(1, 'MMMM').should.be.equal 'February'

    it 'should return formatted month number ("02" for February)', ->
      test_object.getMonthName(1, 'MM').should.be.equal '02'

    it 'should throw error if called unproperly (void format)',  ->
      ( -> test_object.getMonthName 1 ).should.to.throw /\|Month.getMonthName\| MUST be called with month AND format/   

  describe '#getAllMonths()', ->

    it 'should return all months with numbers and names', ->
      test_object.getAllMonths('MMMM')[9].should.be.eql number: 9, name: 'October'



