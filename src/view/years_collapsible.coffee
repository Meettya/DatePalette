###
Its collapsible year

Реализация как и у коллапсирующего месяца, во всяком случае пока.

Не возможно проверить работу коллапсации, 
  когда у тебя есть всего одна бойцовская рыбка :)
###

unless @Metamorph
  throw Error "sorry, resolve Methamorph dependency first!"

$ = jQuery # Reference jQuery

# for node and browser
lib_path = if GLOBAL? then '../' else ''

MixinSupported  = require "#{lib_path}lib/mixin_supported"
# our mixins
GridableV       = require "#{lib_path}mixin/gridable_v"
CollapsibleV    = require "#{lib_path}mixin/collapsible_v"
FormattableV    = require "#{lib_path}mixin/formattable_view"

# and template
template         = require "#{lib_path}template/leaf"
template_collapsed  = require "#{lib_path}template/leaf_collapsed"

module.exports = class Years extends MixinSupported

  @include GridableV
  @include CollapsibleV
  @include FormattableV

  constructor: (@_year_vm_, bounds_obj, @_config_ = {})  ->
    # subscribe to changes
    @_observer_ = @_year_vm_.getObserverObject()
    bus_name = @_year_vm_.getNotificationBusName()
    @_observer_.subscribe bus_name, @_updateData, this

    @_who_i_am_         = 'YEARS'

    # realize collapsible behavior
    @_element_collapsed_ or= @_config_.is_collapsed

    if @_config_.is_collapsible
      @subscribeToCollapsibleEvent @_collapseElement

    @_formatter_      = @getFormatter 'years', @_config_.format

    @_bounds_ = bounds_obj.transformToBoundsFor 'years'
    # our magic weapon
    @_morph_ = Metamorph @_contentBuilder()


  ###
  To create root UL node and append to it Methamorph object
  ###
  createView : ->
    $('<div>')
      .on("click", "li", @_handler)
      .on("click", "li", => @_collapseOthers()) # its dirty hack to remember 'this'
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
  Update Morph data, data re-render automatically
  ###
  _updateData : ->
    # all black magic here
    # console.log 'month re-rendered'
    @_morph_.html @_contentBuilder()

  ###
  Content builder selector
  ###
  _contentBuilder : ->
    if @_isCollapsed()
      @_renderCollapsedContent()
    else
      @_renderContent()

  ###
  This method for rendering collapsed content
  ###
  _renderCollapsedContent : ->
    template_collapsed
      value : 
        name : @_year_vm_.getYear @_config_.format_collapsed or @_config_.format
        number : @_year_vm_.getYear()

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
