###
This View module itself for epoch selector ([1930][1960][1980]) - this like
###

###
ВАЖНО!!!
Это коллапсирующий вид для выбора десятилетия, но он отличается от всех
остальных, т.к. работает в связке с годами и имеет дополнительную логику
на эту тему. 

###

unless @Metamorph
  throw Error "sorry, resolve Methamorph dependency first!"

$ = jQuery # Reference jQuery

# for node and browser
lib_path = if GLOBAL? then '../' else ''

###
В общем зачем нам это нужно здесь
нам нужно найти первый элемент эпохального выбора и сделать его активеым
фактически нам нужно будет делать риверсивный поиск,
создавая новый диапазон (из опорных годов эпох) 
и проверяя, не входит ли в него год начала границы
Звучит жутковато, но в общем-то ничего страшного :)
наверное :)
###
Bounds      = require "#{lib_path}model/bounds"

MixinSupported  = require "#{lib_path}lib/mixin_supported"
# our mixins
GridableV       = require "#{lib_path}mixin/gridable_v"
CollapsibleV    = require "#{lib_path}mixin/collapsible_v"
FormattableV    = require "#{lib_path}mixin/formattable_view"

template    = require "#{lib_path}template/epoch"
template_collapsed  = require "#{lib_path}template/leaf_collapsed"

module.exports = class Epoch extends MixinSupported

  @include GridableV
  @include CollapsibleV
  @include FormattableV

  constructor: (@_year_vm_, bounds_obj, @_config_ = {})  ->
    # subscribe to changes
    @_observer_ = @_year_vm_.getObserverObject()
    bus_name = @_year_vm_.getNotificationBusName()
    @_observer_.subscribe bus_name, @_updateData, this

    @_who_i_am_         = 'EPOCH'

    @_element_collaps_style_ = @_config_.collaps_style or 'show'

    # realize collapsible behavior
    @_element_collapsed_ or= @_config_.is_collapsed
    
    if @_config_.is_collapsible
      @subscribeToCollapsibleEvent @_collapseElementWrapper

    @_formatter_      = @getFormatter 'years', @_config_.format

    @_bounds_ = bounds_obj.transformToBoundsFor 'years'
    # our magic weapon
    @_morph_ = Metamorph @_contentBuilder()

  ###
  To create root UL node and append to it Methamorph object
  ###
  createView : ->
    element = $('<div>')
      .on("click", "li", @_handler)
      .append @_morph_.outerHTML()

    # this view may have passive style
    if @_config_.may_collaps_other
      element.on("click", "li", => @_collapseOthers() ) # its dirty hack to remember 'this'
    else
      # but stil may expand itself
      element.on("click", "li", => @_expandSelf() )

    element


  ###
  Thats all, only one public method, sorry :)
  ###

  ###
  This view is not ordinary and must have some additional logic on collaps events
  ###
  _collapseElementWrapper: (bus_name, who_init) ->

    # this is our 'frend' view, this will be work together with that
    frend = @_config_.expand_on_call_by
    # actually in this case we are expand this view
    if who_init is frend.toUpperCase() 
      @_expandSelf()
    else
      # re-throw on other cases
      @_collapseElement bus_name, who_init

    null

  ###
  Create content for Morph object
  ###
  _renderContent : ->

    years_sequence = @_rangeConcentrator @_year_vm_.getAvaibleEraPoints(), @_formatter_
    compiled_ranges = @_compileSplittedRange years_sequence, @_config_.row_length

    template 
      range     : @_intervalAmplifier compiled_ranges, @_formatter_
      selected  : @_year_vm_.getEraStart()


  ###
  This method for rendering collapsed content
  ###
  _renderCollapsedContent : ->
    template_collapsed
      value : 
        name : @_year_vm_.getEraStart @_config_.format_collapsed or @_config_.format
        number : @_year_vm_.getEraStart()

  ###
  Specific range builder
  ###
  _rangeConcentrator: (range, formater) ->
    for element, idx in range when range[idx+1] 
      number    : element
      name      : formater element
      in_bounds : @_complexInBoundsChecker element, range[idx+1]


  _complexInBoundsChecker:(current_element, next_element) ->
    @_inBoundsChecker(current_element) or 
    # add '-01-01' to fix IE8 bug - years dont parse correctly without full form date
    @_reverseInBounceChecker "#{current_element}-01-01", "#{next_element}-01-01"

  ###
  This method for fast check - is month in this year is in bounds or not
  ###
  _inBoundsChecker : (year_as_integer) ->
    @_bounds_.isContains year_as_integer

  ###
  Reverse in bounce checker
  ###
  _reverseInBounceChecker: (start, end) ->
    test_bounds = new Bounds(start, end).transformToBoundsFor 'years'
    test_bounds.isContainsExceptHight @_bounds_.getLower().format 'YYYY'

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
      if @_element_collaps_style_.toUpperCase() is 'HIDE'
        ''
      else
        @_renderCollapsedContent()
    else
      @_renderContent()

  ###
  This is our 'onclick' event, its simply
  ###
  _handler: (event) =>
    clicked_element = $(event.target).closest('li')
    # ignore disabled click 
    return null if clicked_element.hasClass 'ui-state-disabled'

    try
      @_year_vm_.setEra clicked_element.data('datepalette')
    catch err
      $('<div></div>')
        .html("#{err}")
        .dialog 
          title: 'Error message'

    null
    