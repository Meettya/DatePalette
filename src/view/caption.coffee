###
This View module itself for epoch selector ([1930][1960][1980]) - this like
###

unless @Metamorph
  throw Error "sorry, resolve Methamorph dependency first!"

$ = jQuery # Reference jQuery

# for node and browser
lib_path = if GLOBAL? then '../' else ''

template          = require "#{lib_path}template/caption"

module.exports = class Caption
  constructor: (@_caption_vm_, @_bounds_, @_config_ = {})  ->
    # subscribe to changes
    observer = @_caption_vm_.getObserverObject()
    bus_name = @_caption_vm_.getNotificationBusName()
    observer.subscribe bus_name, @_updateData, this
    # our magic weapon
    @_morph_ = Metamorph @_renderContent()

  ###
  To create root UL node and append to it Methamorph object
  ###
  createView : ->
    $('<div>')
      .append @_morph_.outerHTML()

  ###
  Thats all, only one public method, sorry :)
  ###

  ###
  Create content for Morph object
  ###
  _renderContent : ->
    template 
      caption  : @_caption_vm_.getCaption @_config_.format

  ###
  Update Morph data, data re-render automatically
  ###
  _updateData : ->
    # all black magic here
    # console.log 'epoch re-render'
    @_morph_.html @_renderContent()

    