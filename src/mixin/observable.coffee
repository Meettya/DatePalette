###
This is Observable mixin
###

instanceProperties =

  ###
  This method say  Notification bus name
  ###
  getNotificationBusName : ->
    @_out_bus_name_

  ###
  This method return bus name for errors
  ###
  getErrorBusName : ->
    @_error_bus_name_

  ###
  This is broadcast alert messages topic
  ###
  getBroadcastErrorBusName : ->
    'ERROR'

  ###
  This method may used to share one observer to any TimePint client
  instead of holding Observer object somewhere also we have original observer here
  ###
  getObserverObject : ->
    @_observer_

  ###
  This method is part of 'Observerble' mixin
  Use to notify all subscribers
  ###
  notifyMySubscribers : (offender, args...) ->
    @_observerPublisher @_out_bus_name_, offender, args

  ###
  Error bus to warn subscribers if somthing go wrong
  May be usefull for internal alert wedget
  ###
  warnMySubscribers : (offender, args...) ->
    @_observerPublisher @_error_bus_name_, offender, args

  ###
  Broadcast alert - warn any subscriber on Broadcast Error bus
  ###
  broadcastAlert : (offender, args...) ->
    @_observerPublisher @getBroadcastErrorBusName(), offender, args

  _observerPublisher : (topics, offender, args) ->
    # here @_observer_ method called in @_observer_ context - its important to understand
    @_observer_.publishAsync.apply @_observer_, [topics, offender].concat args
    null

module.exports = instanceProperties