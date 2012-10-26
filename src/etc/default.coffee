###
  This is default ('base') settings
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
    style  : 'modal'
    target :
      fill_on_init  : yes
      format        : 'DD MMMM YYYY'

  caption :
    format : 'DD MMMM YYYY, dddd'

  years :
    range : [ 1910, 1940, 1960, 1980, 2000, 2020, 2040 ]
    leaf :
      format  : 'YY'
      row_length : 22 # maximum of chars in one row

  months : 
    format     : 'MMMM'
    row_length : 26 # maximum of chars in one row

  days : 
    format     : 'DD'
    row_length : 18 # maximum of chars in one row

  global :
    locale  : 'ru'
    debug   : false

  # IMPORTANT!!! it must be as string
  bounds : 
    low   : '1950-02-15'
    high  : '2017-06-28'

  # IMPORTANT!!! limiter don`t check direct user input by default
  # i.e. user MAY input ANY data by hands, for some reasons
  limiter : 
    check_direct_input  : yes # use this knob to check direct input

