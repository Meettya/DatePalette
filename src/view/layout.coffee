###
This View for widget layout
###

$ = jQuery # Reference jQuery

# for node and browser
lib_path = if GLOBAL? then '../' else ''

# this ours templates
template    = require "#{lib_path}template/layout"

module.exports = class Layout

  # just create view and return free DOM node
  @createView:(uuid, config) -> 

    # FIXME! change to something more sophisticated later
    layout_style = config.style || 'ui'

    element = template mainDivId: uuid, classes : @::_buildLayoutStyle layout_style
    $(element).on "hover", "li", @::_handler
    
  ###
  handler for hover
  ###
  _handler: (event) =>
    target = $(event.target)
    switch event.type
      when 'mouseenter'
        unless target.hasClass "ui-state-disabled" 
          target.addClass "ui-state-hover" 
      when 'mouseleave'
        target.removeClass "ui-state-hover"

  ###
  Layout styler
  ###
  _buildLayoutStyle : (style) ->
    switch style
      when 'ui'
        "ui-datepalette ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"
      when 'bootstrap' then "ui-datepalette"



