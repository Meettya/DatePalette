###
This View module itself for epoch selector ([1930][1960][1980]) - this like
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

template    = require "#{lib_path}template/epoch"

module.exports = class Epoch
  constructor: (@_year_vm_, bounds_obj, @_config_ = {})  ->
    # subscribe to changes
    observer = @_year_vm_.getObserverObject()
    bus_name = @_year_vm_.getNotificationBusName()
    observer.subscribe bus_name, @_updateData, this

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
    template 
      ranges    : @_rangeConcentrator @_year_vm_.getAvaibleEraPoints()
      selected  : @_year_vm_.getEraStart()


  ###
  Specific range builder
  ###
  _rangeConcentrator: (range) ->
    for element, idx in range when range[idx+1] 
      number    : element
      name      : element
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
    test_bounds.isContains @_bounds_.getLower().format 'YYYY'

  ###
  Update Morph data, data re-render automatically
  ###
  _updateData : ->
    # all black magic here
    # console.log 'epoch re-render'
    @_morph_.html @_renderContent()

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
    