###
This is non-modal form for Product, try to use it as base
###

unless @Metamorph
  throw Error "sorry, resolve Methamorph dependency first!"

$ = jQuery # Reference jQuery

# for node and browser
lib_path = if GLOBAL? then '../' else ''


module.exports = class Modal
  constructor: (@_wibget_obj_, @_caption_vm_, @_config_ = {})  ->

    # get all data from widget object - they too many
    @_uuid_                 = @_wibget_obj_.getUUID()
    @_target_               = @_wibget_obj_.getTarget()
    @_user_data_changed_cb_ = @_wibget_obj_.getUserDataChangedCb()

    # subscribe to changes
    observer = @_caption_vm_.getObserverObject()
    bus_name = @_caption_vm_.getNotificationBusName()

    # pre-fill data to element
    if @_config_.target.fill_on_init
      @_user_data_changed_cb_.call @

    observer.subscribe bus_name, @_user_data_changed_cb_, this

    # now build wrapper for all widget
    @_wrapper_ = @_createWrapper @_uuid_


  ###
  Wrapper for modal view
  ###
  _createWrapper : (uuid) ->
    $ '<div>', id : "datapicker-#{uuid}", class : 'datepicker dropdown-menu'


  ###
  This method inject all result to page, or target element
  ###
  inject : (layout) ->
    @_wrapper_.append(layout).appendTo 'body'

    ###
    FIXME!
    many strange things happened with target, later sand it out
    for now its ok, but you are owe, remember!!!
    ### 

    #Add onclick listener
    $(@_target_).on 'click', @_showWrapper

    # mark target as already haves DatePalette
    $(@_target_).addClass 'hasDatePalette'
    
    # set handler to hide datapicker
    @_setOutsideClickHandler()

    false

  ###
  Return formatted data as string
  ###
  # FIXME! create multi-format getter with options
  getResult : ->
    @_caption_vm_.getCaption @_config_.target.format

  ###
  This method setup hider for datapicker if user click somewhere outside it
  ###
  _setOutsideClickHandler : ->
    # Clicked outside the datepicker, hide it
    # yap, we are interact with DOM
    $(document).on 'mousedown', (evnt) =>
      unless $(evnt.target).closest('.datepicker').length
        @_wrapper_.hide()
    null

  ###
  This is our 'show' event handler
  ###
  _showWrapper: (evnt) =>

    @_wrapper_.toggle()

    @_placeWrapper()
    


    false

  ###
  This is wrapper GPS :)
  ###
  _placeWrapper: =>

    filter_function = ->
      $(this).css('z-index') isnt 'auto'

    height = $(@_target_).outerHeight()

    zIndex = parseInt @_wrapper_.parents().filter(filter_function).first().css('z-index')
    zIndex += 10

    offset = $(@_target_).offset()

    @_wrapper_.css
      top:    offset.top + height
      left:   offset.left
      
      #zIndex: zIndex
    
    