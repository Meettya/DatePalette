###
Test suite for node AND browser in one file
So, we are need some data from global
Its so wrong, but its OK for test
###
lib_path = GLOBAL?.lib_path || ''

Bounds = require "#{lib_path}model/bounds"

describe 'Bounds:', ->

  bounds_obj = null

  bounds_value = 
    low   : '1950-02-15'
    high  : '2017-06-28'

  beforeEach ->
    bounds_obj = new Bounds bounds_value.low, bounds_value.high

  describe 'new()', ->

    it 'should return Bounds object', ->
      bounds_obj.should.be.an.instanceof Bounds

  describe '#transformToBoundsFor()', ->

    it 'should round to years if called with "years"', ->
      inited_bounds = bounds_obj.transformToBoundsFor 'years'
      low_year = inited_bounds.getLower().format 'YYYY-MM-DD'
      low_year.should.be.equal '1950-01-01'

    it 'should round to years-mounth if called with "months"', ->
      inited_bounds = bounds_obj.transformToBoundsFor 'months'
      low_year = inited_bounds.getLower().format 'YYYY-MM-DD'
      low_year.should.not.to.be.equal '1950-01-01'
      low_year.should.be.equal '1950-02-01'

    it 'should round to years-mounth-day if called with "days"', ->
      inited_bounds = bounds_obj.transformToBoundsFor 'days'
      low_year = inited_bounds.getLower().format 'YYYY-MM-DD'
      low_year.should.not.to.be.equal '1950-01-01'
      low_year.should.not.to.be.equal '1950-02-01'
      low_year.should.be.equal '1950-02-15'

  describe '#isContains()', ->

    it 'should return |true| if checked data into ranges', ->
      inited_bounds = bounds_obj.transformToBoundsFor 'days'
      inited_bounds.isContains('2000-02-10').should.be.true

    it 'should return |true| if checked data is range bound(low)', ->
      inited_bounds = bounds_obj.transformToBoundsFor 'days'
      inited_bounds.isContains('1950-02-15').should.be.true

    it 'should return |true| if checked data is range bound(high)', ->
      inited_bounds = bounds_obj.transformToBoundsFor 'days'
      inited_bounds.isContains('2017-06-28').should.be.true

    it 'should return |false| if checked data is out range bound(low)', ->
      inited_bounds = bounds_obj.transformToBoundsFor 'days'
      inited_bounds.isContains('1950-02-14').should.be.false

    it 'should return |false| if checked data is out range bound(high)', ->
      inited_bounds = bounds_obj.transformToBoundsFor 'days'
      inited_bounds.isContains('2017-06-29').should.be.false

    it 'should return |true| if checked data *as moment object* into ranges', ->
      inited_bounds = bounds_obj.transformToBoundsFor 'days'
      inited_bounds.isContains( inited_bounds.getLower() ).should.be.true

  describe '#dateComparison()', ->

    it 'should return  0 if checked date in bounds', ->
      inited_bounds = bounds_obj.transformToBoundsFor 'days'
      inited_bounds.dateComparison('2000-02-10').should.be.equal 0

    it 'should return -1 if checked date lower than bounds', ->
      inited_bounds = bounds_obj.transformToBoundsFor 'days'
      inited_bounds.dateComparison('1950-02-14').should.be.equal -1

    it 'should return  1 if checked date higher than bounds', ->
      inited_bounds = bounds_obj.transformToBoundsFor 'days'
      inited_bounds.dateComparison('2017-06-29').should.be.equal 1

    it 'should return  0 if checked date *as moment object* in bounds', ->
      inited_bounds = bounds_obj.transformToBoundsFor 'days'
      inited_bounds.dateComparison( inited_bounds.getLower() ).should.be.equal 0
