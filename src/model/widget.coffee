###
This is Widget model - main container, builder, and so on

что должен делать этот класс - 
  создавать виджет определенной конфигурации
  по частям создавать различные элементы виджета

что НЕ должен делать этот класс
  взаимодействовать с какими-либо визуальными элементами
###

# resolve require from [window] or by require() 
_       = @_      ? require 'underscore'

# for node and browser
lib_path = if GLOBAL? then '../' else ''

# this is our main things - Registry, where stored all our ViewModels
Registry = require "#{lib_path}model/registry"

# this is our Limiter - its restrict owerflow data settings
Limiter     = require "#{lib_path}controller/limiter"

# this is our avaible views
Layout      = require "#{lib_path}view/layout"
Epoch       = require "#{lib_path}view/epoch"
Years       = require "#{lib_path}view/years"
Months      = require "#{lib_path}view/months"
Days        = require "#{lib_path}view/days"
Caption     = require "#{lib_path}view/caption"
Modal       = require "#{lib_path}view/modal"
Inline      = require "#{lib_path}view/inline"


class Wiget 

  constructor: (@_target_, @_user_data_changed_cb_, @_config_ = {}) ->

    # this is uuid - actually its main (layout) element id, we are can search it by this id
    @_uuid_ = _.uniqueId 'DPalette_'

    # this is our VM storage
    @_registry_ = new Registry @_config_.global

    @_time_point_ = @_registry_.getTimePoint()

    @_year_vm_    = @_registry_.getYearVM @_config_.years
    @_month_vm_   = @_registry_.getMonthVM()
    @_day_vm_     = @_registry_.getDayVM()
    @_caption_vm_ = @_registry_.getCaptionVM()


  ###
  Limiter constructor
  ###
  setupLimiter : ->
    @_createLimiter()


  ###
  Just limiter constructor itself
  ###
  _createLimiter : ->
    new Limiter @_time_point_, @getBounds(), @_config_.limiter



  ###
  Method to create ALL product (actualy widget, but to mane 'widget' here)
  Dont know what I must return from this method, may be null
  ###
  showProduct : (layout) ->
    # this is our widget presentation style
    widget_style = @_config_.widget.style

    whole_widget = switch widget_style.toUpperCase()
      when "MODAL"   then @_createProductAsModal()
      when "INLINE"  then @_createProductAsInline()
      
      else 
        throw Error """
                    |Product| - can`t create presentation style - unknown 
                    |widget_style| = |#{widget_style}|
                    """

    # inject all to page
    whole_widget.inject layout
    null

  ###
  Modal style view
  ###
  _createProductAsModal : () ->
    product = new Modal this, @_caption_vm_, @_config_.widget


  ###
  Inline style view
  ###
  _createProductAsInline : () ->
    product = new Inline this, @_caption_vm_, @_config_.widget


  ###
  Method to create layout
  ###
  createLayout: () ->
    Layout.createView @_uuid_
    

  ###
  This method share target for this widget
  ###
  getUserDataChangedCb : ->
    @_user_data_changed_cb_

  ###
  This method share target for this widget
  ###
  getTarget : ->
    @_target_

  ###
  This method share UUID for this widget
  ###
  getUUID : ->
    @_uuid_


  ###
  This method create element with view data
  ###
  createElement : (element_name) ->
    switch element_name.toUpperCase()
      # USE UPPERCASED NAMES !!!!
      when "EPOCH"    then @_createEpoch()
      when "YEARS"    then @_createYears()
      when "MONTHS"   then @_createMonths()
      when "DAYS"     then @_createDays()
      when "CAPTION"  then @_createCaption()

      else 
        throw Error "|Widget.createElement| dont know element #{element_name}"

  ###
  May be usefully, mey be not - I`m think about it later
  ###
  getObserver : () ->
    @_registry_.getObserver()

  ###
  It our Bounds to correct render all views
  ###
  getBounds : () ->
    @_registry_.getBounds @_config_.bounds


  ###
  This is widget builder
  It get componets list from config, prepare it an append it to layout,
  then return DOM part as result
  This method DO NOT interract with target, DOM or any other things
  ###
  assembleWidget : () ->

    # create layout for all other elements
    layout = @createLayout()

    # now assemple all together
    assemble_plan = @_config_.components
    for part in assemble_plan
      $(layout).append @createElement part
      null

    layout


  _createEpoch : ->
    element = new Epoch @_year_vm_, @getBounds()
    element.createView()

  _createYears : ->
    element = new Years @_year_vm_, @getBounds(), @_config_.years.leaf
    element.createView()

  _createMonths : ->
    element = new Months @_month_vm_, @getBounds(), @_config_.months
    element.createView() 

  _createDays : ->
    element = new Days @_day_vm_, @_month_vm_, @getBounds(), @_config_.days
    element.createView() 

  _createCaption : ->
    element = new Caption @_caption_vm_, @getBounds(), @_config_.caption
    element.createView() 


module.exports = Wiget