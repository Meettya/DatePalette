###
This is Limiter controller - not model nor viewmodel.

It will be check TomePoint date (subscrube to changes) is in bounds
and set low or hight if value owerflow it.

Кстати, стоит попробовать оставить возможность выставить значение больше 
граничного, если ввод был руками, там кажется можно спросить кто изменил данные.
###

# for node and browser
lib_path = if GLOBAL? then '../' else ''


module.exports = class Limiter
  constructor: (@_time_point_, bounds_obj, @_config_ = {})  ->
    # subscribe to changes
    observer = @_time_point_.getObserverObject()
    bus_name = @_time_point_.getNotificationBusName()
    observer.subscribe bus_name, @_checkData, this

    limiter_scale = @_config_.scale || 'days'

    @_who_i_am_         = 'LIMITER'

    # its our bounds in days scale
    @_bounds_ = bounds_obj.transformToBoundsFor limiter_scale

  ###
  This is date checker
  ###
  _checkData : (args...) ->
    # TODO! add some logic for direct input module
    # its change initor name, may be use it for direct input exception
    who_initor = args[1]

    # ignore itself
    return null if who_initor is @_who_i_am_

    comparition_vector = @_bounds_.dateComparison @_time_point_.getDate()

    if comparition_vector is 1
      @_time_point_.setDate @_who_i_am_, @_bounds_.getHihger()
    else if comparition_vector is -1
      @_time_point_.setDate @_who_i_am_, @_bounds_.getLower()

    null



    

