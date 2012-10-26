###
This is Product itself - 
here we are take layout with pre-filled components and add it to page
###

unless @Metamorph
  throw Error "sorry, resolve Methamorph dependency first!"

$ = jQuery # Reference jQuery

# for node and browser
lib_path = if GLOBAL? then '../' else ''


module.exports = class Inline
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
    $ '<div>'


  ###
  This method inject all result to page, or target element
  ###
  inject : (layout) ->
    @_wrapper_.append(layout).appendTo @_target_

    # mark target as already haves DatePalette
    $(@_target_).addClass 'hasDatePalette'
    false

  ###
  Return formatted data as string
  ###
  # FIXME! create multi-format getter with options
  getResult : (format = @_config_.target.format) ->
    @_caption_vm_.getCaption format

    