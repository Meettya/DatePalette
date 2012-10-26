###
This View module for years grid
###

unless @Metamorph
  throw Error "sorry, resolve Methamorph dependency first!"

$ = jQuery # Reference jQuery

# for node and browser
lib_path = if GLOBAL? then '../' else ''

MixinSupported  = require "#{lib_path}lib/mixin_supported"
# our mixins
GridableV       = require "#{lib_path}mixin/gridable_v"

# and template
template         = require "#{lib_path}template/leaf"

module.exports = class Years extends MixinSupported

  @include GridableV

  constructor: (@_year_vm_, bounds_obj, @_config_ = {})  ->
    # subscribe to changes
    observer = @_year_vm_.getObserverObject()
    bus_name = @_year_vm_.getNotificationBusName()
    observer.subscribe bus_name, @_updateData, this

    @_formatter_      = @_makeFormatter @_config_.format

    @_bounds_ = bounds_obj.transformToBoundsFor 'years'
    # our magic weapon
    @_morph_ = Metamorph @_renderContent()


  ###
  To create root UL node and append to it Methamorph object
  ###
  createView : ->
    $('<div>')
      .on("click", "li", @_handler)
      .append @_morph_.outerHTML()

  ###
  Thats all, only one public method, sorry :)
  ###

  ###
  Create content for Morph object
  ###
  _renderContent : ->
    [era_begin, era_end] = @_year_vm_.getEraRanges()
    years_sequence = @_buildSequence era_begin, era_end-1, @_formatter_
    compiled_ranges = @_compileSplittedRange years_sequence, @_config_.row_length

    template 
      range     : @_intervalAmplifier compiled_ranges, @_formatter_
      selected  : @_year_vm_.getYear()


  ###
  This method for fast check - is month in this year is in bounds or not
  ###
  _inBoundsChecker : (year_as_integer) ->
    @_bounds_.isContains year_as_integer


  ###
  Formatter for years
  ###
  _makeFormatter : (format) ->
    switch format.toUpperCase()
      when "YY"  then (year) -> "#{year}".slice -2
      when "YYYY" then (year) -> "#{year}"

  ###
  Update Morph data, data re-render automatically
  ###
  _updateData : ->
    # all black magic here
    # console.log 'year re-render'
    @_morph_.html @_renderContent()

  ###
  This is our 'onclick' event, its simply
  ###
  _handler: (event) =>
    clicked_element = $(event.target).closest('li')
    # ignore disabled click 
    return null if clicked_element.hasClass 'ui-state-disabled'

    try
      @_year_vm_.setYear clicked_element.data('datepalette')
    catch err
      $('<div></div>')
        .html("#{err}")
        .dialog 
          title: 'Error message'

    null
