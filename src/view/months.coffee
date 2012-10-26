###
This View module itself for months selector ([Jan][Feb][Mar]) - this like
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
template        = require "#{lib_path}template/leaf"

module.exports = class Months extends MixinSupported

  @include GridableV

  constructor: (@_view_model_, bounds_obj, @_config_ = {})  ->
    # subscribe to changes
    observer = @_view_model_.getObserverObject()
    bus_name = @_view_model_.getNotificationBusName()
    observer.subscribe bus_name, @_updateData, this

    @_bounds_ = bounds_obj.transformToBoundsFor 'months'
    # memoize this
    @_all_months_names_ = @_view_model_.getAllMonths @_config_.format
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
    template 
      range     : @_compileSplittedRange @_all_months_names_[..], @_config_.row_length
      selected  : @_view_model_.getMonth()

  ###
  This method for fast check - is month in this year is in bounds or not
  ###
  _inBoundsChecker : (month_as_integer) ->
    month_as_string = "0#{month_as_integer+1}".slice -2
    test_date = "#{@_view_model_.getYear()}-#{month_as_string}"
    @_bounds_.isContains test_date

  ###
  Update Morph data, data re-render automatically
  ###
  _updateData : ->
    # all black magic here
    # console.log 'month re-rendered'
    @_morph_.html @_renderContent()

  ###
  This is our 'onclick' event, its simply
  ###
  _handler: (event) =>
    clicked_element = $(event.target).closest('li')
    # ignore disabled click 
    return null if clicked_element.hasClass 'ui-state-disabled'

    try
      @_view_model_.setMonth clicked_element.data('datepalette')
    catch err
      $('<div></div>')
        .html("#{err}")
        .dialog 
          title: 'Error message'

    null
    