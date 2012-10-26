###
This is main class TimePoint - it own date value(as Moment object), work with Observer etc.

###

# resolve require from [window] or by require() 
_       = @_      ? require 'underscore'
Moment  = @moment ? require 'moment'

# for node and browser
lib_path = if GLOBAL? then '../' else ''
Stack = require "#{lib_path}lib/stack"
MixinSupported = require "#{lib_path}lib/mixin_supported"

Observable = require "#{lib_path}mixin/observable"

class TimePoint extends MixinSupported

  @include Observable

  constructor: (@_observer_, @_config_ = {}) ->
    @_time_point_       = @buildNewMoment() # init with now()
    @_tick_             = 0   # internal sequence to stamp time_point
    @_undo_stack_       = new Stack()

    who_i_am            = 'TIMEPOINT'
    @_out_bus_name_     = "#{who_i_am}.DATE_CHANGED"
    @_error_bus_name_   = "#{who_i_am}.ERROR"

    @_lang_             = @_config_.lang or 'en'


  ###
  Interface method to setup new date
  ###
  setDate : (who, args...) ->
    new_moment = @buildNewMoment.apply null, args # it may die with invalid date
    @_saveMoment()
    @_time_point_ = new_moment
    @notifyMySubscribers who, @_tick_
    this

  ###
  Return now() in any type
  ###
  getNow : (type) ->
    @_convertObject @buildNewMoment(), type

  ###
  Return object date in any type
  ###
  getDate : (type) ->
    @_convertObject @_time_point_, type

  ###
  Return cloned or converted object
  ###
  _convertObject : (time_obj, type = 'moment') ->
    switch type.toLowerCase()
      when 'js'      then time_obj.toDate()  #original JS Data object
      when 'epox_ms' then time_obj.valueOf() #Unix Epox MS of date.
      when 'moment'  
        new_time_obj = time_obj.clone()   #clone copy of Moment object to allow any Moment operations in view
        # setup lang
        new_time_obj.lang @_lang_
        new_time_obj

      else
        throw Error "|TimePoint.get*| don't now |#{type}| type"

  ###
  This method undo changes by setting time point to previews value
  Why you need correct @tick? So, if changes public in async mode 
  - you know, any shit may happened. For example - two widgets want to undo changes.
  Second one may be late.
  ###
  undoDateChanges : (who, tick) ->
    if @_undo_stack_.isEmpty()
      throw Error "undoDateChanges aborted, undo stack is empty"

    unless tick
      throw Error "undoDateChanges aborted, void tick argument is forbidden"
    unless tick is @_tick_
      throw Error "undoDateChanges aborted, tick mismatch"

    @setDate who, @buildNewMoment @_undo_stack_.pop()

  ###
  Internal method to create new Moment object
  ###
  buildNewMoment : (args...) ->
    # FIXME: looks ugly, but I don't know how to use Moment constructor itself
    # so, for now it is worked in this way
    new_moment = Moment::constructor.apply null, args

    unless new_moment.isValid()
      throw Error "creation aborted, invalid data |#{args}|"
    new_moment

  ###
  Internal method for change stamping
  ###
  _setNextTick : ->
    @_tick_ = @_tick_ + 1

  ###
  Internal method to incapsulate save logic
  Date saved as Unix Epox to reduce memory using
  ###
  _saveMoment : ->
    @_undo_stack_.push @getDate 'epox_ms'
    @_setNextTick()
    null

module.exports = TimePoint