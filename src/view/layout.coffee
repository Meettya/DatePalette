###
This View for widget layout
###

$ = jQuery # Reference jQuery

# for node and browser
lib_path = if GLOBAL? then '../' else ''
template = require "#{lib_path}template/layout"

module.exports = class Layout

  # just create view and return free DOM node
  @createView:(uuid) -> 

    element = template { mainDivId: uuid }
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