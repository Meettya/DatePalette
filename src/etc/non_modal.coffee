###
  This is non-modal widget
###
module.exports =

  # its visual widget components, was be builded in this order
  components : [
    'Caption'
    'Epoch'
    'Years'
    'Months'
    'Days'
    ]

  # widget configuration and target properties
  # this settings was used to construct and insert widget into page
  widget : 
    style  : 'non-modal'
    target :
      fill_on_init  : yes
      format        : 'DD MMMM YYYY'

  layout :
    style : 'bootstrap' # this is clear style for layout - just div without styles

  caption :
    format : 'DD MMMM YYYY, dddd'

  years :
    range : [ 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2030 ]
    leaf :
      format  : 'YYYY'
      format_collapsed : 'YYYY'
      is_collapsible: yes # set to 'no' if you need static behavior - element will be ignore colapsation
      is_collapsed: yes
      row_length : 22 # maximum of chars in one row
    epoch : 
      row_length : 26 # maximum of chars in one row
      expand_on_call_by : 'Years' # its mean if 'years' element clicked - epoch appear too
      is_collapsible: yes
      is_collapsed: yes
      collaps_style: 'hide' # if element collapsed - hide it, not render anithing
      may_collaps_other: no # it is mean its not collaps other on click
      format  : 'YYYY'

  months : 
    format     : 'MMMM'
    is_collapsible: yes
    is_collapsed: yes
    row_length : 26 # maximum of chars in one row

  days : 
    format     : 'DD'
    is_collapsible: yes
    row_length : 16 # maximum of chars in one row

  global :
    locale  : 'ru'
    debug   : false

  # IMPORTANT!!! it must be as string
  bounds : 
    low   : '1950-02-15'
    high  : '2019-12-30'

  # IMPORTANT!!! limiter don`t check direct user input by default
  # i.e. user MAY input ANY data by hands, for some reasons
  limiter : 
    check_direct_input  : yes # use this knob to check direct input

