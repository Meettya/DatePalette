###
This is Caption viewmodel class - response on print data as text

что должен делать этот класс - 
  отдавать установленную дату в любом формате
  отдавать текущую дату в любом формате


доп. условия и упрощения -
  пока это пассивный класс, установка даты из него невозможна

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


class Caption extends MixinSupported

  @include Observable
  @include SubscribleVM
  @include FlattingableVM
  @include FormattableVM

  constructor: (@_time_point_, @_config_ = {}) ->
    
    @_observer_         = @_time_point_.getObserverObject()
    @_in_bus_name       = @_time_point_.getNotificationBusName() # incomming call
    
    @_who_i_am_         = 'CAPTION'
    @_out_bus_name_     = "#{@_who_i_am_}.DATE_CHANGED"
    @_error_bus_name_   = "#{@_who_i_am_}.ERROR"

    @_full_date_        = null # its full date as timepoint

    # some init activity
    @_setupFullDate()
    @_subscribeToChanges()    

module.exports = Caption