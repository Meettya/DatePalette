###
This is Day viewmodel class - response on day

что должен делать этот класс - 
  отдавать текущую дату
  установливать новую дату
  ограничивать выход за пределы списка(позднее)
  отдавать кол-во дней в текущем месяце 
  (да, может показаться, что этот функционал должен быть в месяце, но это позднее - подумаем)

доп. условия и упрощения -


###

# resolve require from [window] or by require() 
_       = @_      ? require 'underscore'

# for node and browser
lib_path = if GLOBAL? then '../' else ''

MixinSupported  = require "#{lib_path}lib/mixin_supported"
# this is our mixins
Observable      = require "#{lib_path}mixin/observable"
SubscribleVM    = require "#{lib_path}mixin/subscrible_vm"
FlattingableVM  = require "#{lib_path}mixin/flattingable_vm"
FormattableVM   = require "#{lib_path}mixin/formattable_vm"


class Day extends MixinSupported

  @include Observable
  @include SubscribleVM
  @include FlattingableVM
  @include FormattableVM

  constructor: (@_time_point_, @_config_ = {}) ->
    
    @_observer_         = @_time_point_.getObserverObject()
    @_in_bus_name       = @_time_point_.getNotificationBusName() # incomming call
    
    @_who_i_am_         = 'DAY'
    @_out_bus_name_     = "#{@_who_i_am_}.DATE_CHANGED"
    @_error_bus_name_   = "#{@_who_i_am_}.ERROR"

    @_full_date_        = null # its full date as timepoint, I need it to make fast number-to-string formating

    # some init activity
    @_setupFullDate()
    @_subscribeToChanges()


  ###
  Day setter, actually its just call TimePoint with new day and wait
  ###
  setDay : (new_day) ->
    # may be it is string, like '08' - not parset to Int
    # so try to convert it to number
    if _.isString new_day
      new_day = @_stringToNumberDayConverter new_day

    # FIXME! actually its wrong - if year changed and new year have avaible borders 
    # - in this case wea re need desable this checking or check month AND year together
    return this if new_day is @getDay() # do nothing if nothing changed
    @_setDayToTimePoint new_day
    this

  ###
  Converter for any string represemtation
  ###
  _stringToNumberDayConverter : (day_as_string) ->
    if ( parsed_int = parseInt day_as_string, 10 )
      parsed_int
    else
      throw @_errorInvalidDay day_as_string

  ###
  This method just call TimePoint and go forward
  ###
  _setDayToTimePoint : (new_day) ->
    new_time_point = @_changeDayInTimePoint new_day
    @_time_point_.setDate @_who_i_am_, new_time_point
    null

  ###
  Its date changer
  this operation is safe, getDate() return clone and NOT interract with real time poin value
  ###
  _changeDayInTimePoint : (day) ->
    # FIXME! without checker, but its Ok
    @_time_point_.getDate().date day

  ###
  One error text for some cases
  ###
  _errorInvalidDay : (day) ->
    Error "|#{@_who_i_am_}| - day is invalid |#{day}|"

module.exports = Day

