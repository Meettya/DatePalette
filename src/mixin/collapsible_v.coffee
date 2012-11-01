###
This is Collapsible mixin, addon to observerable
###

instanceProperties =

  ###
  Method to collapse all other subscribers
  ###
  _collapseOthers: ->
    @broadcastCollapse @_who_i_am_
    @_expandSelf()

  ###
  Method to expand self element
  ###
  _expandSelf: ->
    if @_isCollapsed()
      @_setCollapsedOff()
      @_updateData()
    null 

  ###
  Method to collapse element
  ###
  _collapseElement : (bus_name, who_init) ->
    unless @_isCollapsed() or @_who_i_am_ is who_init
      @_setCollapsedOn()
      @_updateData()
    null

  ###
  Just getter to collapse property
  ###
  _isCollapsed: ->
    !!@_element_collapsed_

  ###
  And its just setter
  ###
  _setCollapsedOn: ->
    @_element_collapsed_ = true

  ###
  And its just setter
  ###
  _setCollapsedOff: ->
    @_element_collapsed_ = false

  ###
  This is Collapsible subscriber
  its need on_event_cb becose some elements have it (cb) different 
  ###
  subscribeToCollapsibleEvent: (on_event_cb) ->
    collapse_bus_name = @getCollapsibleBusName()
    @_observer_.subscribe collapse_bus_name, on_event_cb, this
    null

  ###
  This method say Collapsible bus name
  ###
  getCollapsibleBusName : ->
    'COLLAPSE'

  ###
  Broadcast collapse - say all subscribers to collapse himself
  ###
  broadcastCollapse : (offender, args...) ->
    @_observerPublisher @getCollapsibleBusName(), offender, args

  _observerPublisher : (topics, offender, args) ->
    # here @_observer_ method called in @_observer_ context - its important to understand
    @_observer_.publishAsync.apply @_observer_, [topics, offender].concat args
    null

module.exports = instanceProperties