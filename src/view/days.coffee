###
This View module itself for Days selector (1,2,3,4) - this like
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

module.exports = class Days extends MixinSupported

  @include GridableV

  constructor: (@_view_model_, @_month_vm_, bounds_obj, @_config_ = {})  ->
    # subscribe to changes
    observer = @_view_model_.getObserverObject()
    bus_name = @_view_model_.getNotificationBusName()
    observer.subscribe bus_name, @_updateData, this

    @_formatter_      = @_makeFormatter @_config_.format

    @_bounds_ = bounds_obj.transformToBoundsFor 'days'

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
    days_in_month = @_month_vm_.getDaysInMonth()
    days_sequence = @_buildSequence 1, days_in_month, @_formatter_
    compiled_ranges = @_compileSplittedRange days_sequence, @_config_.row_length

    template 
      range     : @_intervalAmplifier compiled_ranges, @_formatter_
      selected  : @_view_model_.getDay()

  ###
  Formatter for days
  ###
  _makeFormatter : (format) ->
    switch format.toUpperCase()
      when "D"  then (day) -> "#{day}"
      when "DD" then (day) -> "0#{day}".slice -2

  ###
  This method for fast check - is month in this year is in bounds or not
  ###
  _inBoundsChecker : (day_as_integer) ->
    day_as_string = "0#{day_as_integer}".slice -2
    test_date = "#{@_view_model_.getYear()}-#{@_view_model_.getMonth('MM')}-#{day_as_string}"
    @_bounds_.isContains test_date

  ###
  Update Morph data, data re-render automatically
  ###
  _updateData : ->
    # all black magic here
    # console.log 'day re-render'
    @_morph_.html @_renderContent()

  ###
  This is our 'onclick' event, its simply
  ###
  _handler: (event) =>
    clicked_element = $(event.target).closest('li')
    # ignore disabled click 
    return null if clicked_element.hasClass 'ui-state-disabled'

    try
      @_view_model_.setDay clicked_element.data('datepalette')
    catch err
      $('<div></div>')
        .html("#{err}")
        .dialog 
          title: 'Error message'

    null
    