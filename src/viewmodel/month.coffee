###
This is Month viewmodel class - response on month

что должен делать этот класс - 
  отдавать текущий месяц (как номер или как строку)
  устанавливать новый месяц
  ограничивать выход за пределы списка (позднее)

###

# resolve require from [window] or by require() 
_       = @_      ? require 'underscore'

# for node and browser
lib_path = if GLOBAL? then '../' else ''

MixinSupported  = require "#{lib_path}lib/mixin_supported"
# this is our mixins
Overflowproof   = require "#{lib_path}mixin/overflowproof"
Observable      = require "#{lib_path}mixin/observable"
SubscribleVM    = require "#{lib_path}mixin/subscrible_vm"
FlattingableVM  = require "#{lib_path}mixin/flattingable_vm"
FormattableVM   = require "#{lib_path}mixin/formattable_vm"

class Month extends MixinSupported

  @include Overflowproof
  @include Observable
  @include SubscribleVM
  @include FlattingableVM
  @include FormattableVM

  constructor: (@_time_point_, @_config_ = {}) ->
    
    @_observer_         = @_time_point_.getObserverObject()
    @_in_bus_name       = @_time_point_.getNotificationBusName() # incomming call
    
    @_who_i_am_         = 'MONTH'
    @_out_bus_name_     = "#{@_who_i_am_}.DATE_CHANGED"
    @_error_bus_name_   = "#{@_who_i_am_}.ERROR"

    # to reduce hardcoded vars
    @_month_idx_ = 
            first : 0
            last  : 11

    ###
    При работе с месяцем в общем-то не обязательно работать с годом
    но придется, если мы хотим иметь возможность использовать границы
    не только на периоде год, но и учитывая месяца
    возможно стоит использовтаь объект года, не наследусь, конечно же, от него
    возможно мы и без него обойдемся
    не-нет, стоп, это может быть будет делать вью, а тут нам нужно только месяц отдать
    ###
    @_full_date_        = null # its full date as timepoint, I need it to make fast number-to-string formating

    # some init activity
    @_setupFullDate()
    @_subscribeToChanges()

  ###
  This method return number of days in month
  if called void - work with self month
    or try to work with month from arg
  ###
  getDaysInMonth : (new_month) ->
    # if void call use month from self data
    unless new_month
      return @_full_date_.daysInMonth()
    # or try to work with sended month
    if _.isString new_month
      new_month = @_stringToNumberMonthConverter new_month

    new_time_point = @_changeMonthInTimePoint new_month
    new_time_point.daysInMonth()

  ###
  This method create month name from month number
  ###
  getMonthName : (month, format) ->
    # calling this method without format absolutely pointless and forbidden
    unless month? and format
      throw Error """
                  |Month.getMonthName| MUST be called with month AND format but got
                  month   = |#{month}|
                  format  = |#{format}|
                  """

    @getDateAsPlainObj format, @_changeMonthInTimePoint month

  ###
  This method will return array of object with all months in selected format
  ###
  # FIXME! ABSOLUTLY uneffective algo, memoize or rewrite it later
  getAllMonths : (format) ->

    # calling this method without format absolutely pointless and forbidden
    unless format
      throw Error """
                  |Month.getAllMonths| MUST be called with format but got
                  format  = |#{format}|
                  """

    for month_pos in [ @_month_idx_.first .. @_month_idx_.last ]
      number : month_pos                      # yes, its looks strange, but it needed to simplify later
      name   : @getMonthName month_pos, format

  ###
  Year setter, actually its just call TimePoint with new month and wait
  ###
  setMonth : (new_month) ->
    # may be it is string, like 'January', or not parset to Int
    # so try to convert it to number
    if _.isString new_month
      new_month = @_stringToNumberMonthConverter new_month

    # FIXME! actually its wrong - if year changed and new year have avaible borders 
    # - in this case wea re need desable this checking or check month AND year together
    return this if new_month is @getMonth() # do nothing if nothing changed
    @_setMonthToTimePoint new_month
    this

  ###
  This method just call TimePoint and go forward
  ###
  _setMonthToTimePoint : (new_month) ->
    new_time_point = @_changeMonthInTimePoint new_month
    @_time_point_.setDate @_who_i_am_, new_time_point
    null
  
  ###
  Its month changer
  this operation is safe, getDate() return clone and NOT interract with real time poin value
  ###
  _changeMonthInTimePoint : (month) ->
    unless @_isMonthNumberValid month
      throw @_errorInvalidMonth month
    
    @_overflowCorrector @_time_point_.getDate().month(month), month

  ###
  Simply month nomber checker
  ###
  _isMonthNumberValid : (tested_month) ->
    @_month_idx_.last >= tested_month >= @_month_idx_.first

  ###
  Converter for string month setting
  ###
  _nameToNumberMonthConverter : (month_as_string) ->
    new_moment = @_time_point_.buildNewMoment month_as_string, "MMMM"
    
    unless new_moment.isValid()
      throw @_errorInvalidMonth month_as_string

    # to check is converter correct we are compare result to argument
    re = new RegExp "\\|#{month_as_string}\\|", "i"
    unless re.test new_moment.format "|MMM|MMMM|"
      throw @_errorInvalidMonth month_as_string

    new_moment.month()

  ###
  Converter for any string represemtation
  ###
  _stringToNumberMonthConverter : (month_as_string) ->
    if ( parsed_int = parseInt month_as_string, 10 )
      parsed_int
    else
      @_nameToNumberMonthConverter month_as_string

  ###
  One error text for some cases
  ###
  _errorInvalidMonth : (month) ->
    Error "|#{@_who_i_am_}| - month is invalid |#{month}|"

module.exports = Month