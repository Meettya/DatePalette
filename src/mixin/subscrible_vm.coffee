###
This is Subscrible View Model mixin
all what need to make subscriber vm
###

instanceProperties =

  ###
  Internal setter for update object state
  ###
  _setupFullDate : ->
    @_full_date_ = @_time_point_.getDate()

  ###
  TimePoint change watcher
  Этот метод вешается на событие о изменении данных в TimePoint 
  и, фактически, он и занимается изменением состояния объекта
  ###
  _timePointWatcher : (chanel, who, tick) ->
    @_setupFullDate()
    @notifyMySubscribers who
    null

  ###
  Это охранная собака для подписчика.
  Суть в том, что может возникнуть какая-нить ошибка
  мы отлавливаем ее, разбираемся что случилось и если проблема здесь -
  что-что с этим делаем и отправляем уведомление
  если нет - перебрасываем исключение дальше
  ###
  _subscribeWatchdog : (error, options = {}) ->
    # we are must work only on our errors and dont touch starngers
    [ who_init, err_tick ] = options.data?[..]
    
    # re-throw error if we are dont handle it
    unless who_init is @_who_i_am_ 
      throw Error error

    # just undo changes if somthing go wrong and warn subscribers
    @_time_point_.undoDateChanges @_who_i_am_, err_tick
    @warnMySubscribers @_who_i_am_, error

    null

  ###
  Subscriber to TimePoint changes
  ###
  _subscribeToChanges : ->
    @_observer_.subscribeGuarded @_in_bus_name, @_timePointWatcher, @_subscribeWatchdog, this



module.exports = instanceProperties