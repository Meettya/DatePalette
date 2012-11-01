###
Это прокачанный вариант вию месяца - 
  он может сворачиваться в единственное значаение
  и разварачиваться в список месяцев

  Разворот происходит по событию.
  Думаю что будет оптимально к обсерверу прикрутить еще одну шину
  и посылать по ней 2 типа сообщений
  'all.collapse' - это бродкастовое сообщение, 
    оно кидается в общую кучу и обрабатывается всеми коллапсирующими модулями

  '#{why}.expand' - это сообщение для конкретного получателя,
    оно семафорит адресату что нужно развернуться до полного размера.
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

# and template
template            = require "#{lib_path}template/leaf"
template_collapsed  = require "#{lib_path}template/leaf_collapsed"

module.exports = class Months extends MixinSupported

  @include GridableV
  @include CollapsibleV

  constructor: (@_view_model_, bounds_obj, @_config_ = {})  ->
    # subscribe to changes
    # observer object neded to make collapsible work, remember that!
    @_observer_ = @_view_model_.getObserverObject()
    bus_name = @_view_model_.getNotificationBusName()
    @_observer_.subscribe bus_name, @_updateData, this

    @_who_i_am_         = 'MONTHS'

    # realize collapsible behavior
    @_element_collapsed_ or= @_config_.is_collapsed

    if @_config_.is_collapsible
      @subscribeToCollapsibleEvent @_collapseElement



    @_bounds_ = bounds_obj.transformToBoundsFor 'months'

    # our magic weapon
    @_morph_ = Metamorph @_contentBuilder()

  ###
  To create root UL node and append to it Methamorph object
  ###
  createView : ->
    $('<div>')
      .on("click", "li", @_handler)
      .on("click", "li", => @_collapseOthers() ) # its dirty hack to remember 'this'
      .append @_morph_.outerHTML()

  ###
  Thats all, only one public method, sorry :)
  ###

  ###
  This method return all months names
  ###
  # memoize it
  _getAllMonthsNames: ->
     @_view_model_.getAllMonths @_config_.format

  ###
  Create content for Morph object
  ###
  _renderContent : ->
    template 
      range     : @_compileSplittedRange @_getAllMonthsNames(), @_config_.row_length
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
        name : @_view_model_.getMonth @_config_.format_collapsed or @_config_.format
        number : @_view_model_.getMonth()


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
    