###
This is Registry - its resolve all view model dependencies

что должен делать этот класс
  создать обсервер, таймпоинт и все элементы въюмодели
  отдавать элементы вюъмодели по запросу 

(подумать - копии или одну и ту же, но логичнее всего одну и ту же)

###

# resolve require from [window] or by require() 
_       = @_      ? require 'underscore'

# for node and browser
lib_path = if GLOBAL? then '../' else ''

# this is our main things - Observer and other models
Observer  = require 'dendrite'
TimePoint = require "#{lib_path}model/timepoint"
Bounds    = require "#{lib_path}model/bounds"

# and this is our viewmodels
Year    = require "#{lib_path}viewmodel/year"
Month   = require "#{lib_path}viewmodel/month"
Day     = require "#{lib_path}viewmodel/day"
Caption = require "#{lib_path}viewmodel/caption"

class Registry 

  constructor: (@_config_ = {}) ->

    @_observer_   = new Observer() #verbose : 'silent'
    @_time_point_ = new TimePoint @_observer_, lang  : @_config_.locale


  ###
  Create Bounds for correct visual rendering
  ! Important - YES, new object on EVERY request, 
  because later it will be mutated to specific bound
  ###
  # FIXME: momoize this
  getBounds: (options) ->
    new Bounds options.low, options.high

  ###
  This method create and return Year View Model Element
  ###
  # FIXME: memoize this 
  getYearVM: (options) ->
    new Year @_time_point_, options

  ###
  This method create and return Year View Model Element
  ###
  # FIXME: memoize this 
  getMonthVM: (options) ->
    new Month @_time_point_, options

  ###
  This method create and return Year View Model Element
  ###
  # FIXME: memoize this 
  getDayVM: (options) ->
    new Day @_time_point_, options

  ###
  This method create and return Year View Model Element
  ###
  # FIXME: memoize this 
  getCaptionVM: (options) ->
    new Caption @_time_point_, options

  ###
  Getters for main object, may be only for develop
  ###
  getObserver : () ->
    @_observer_

  ###
  For direct changes in TimePoint object
  ###
  getTimePoint : () ->
    @_time_point_


module.exports = Registry