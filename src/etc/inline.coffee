###
  This is default ('inline') settings
###
module.exports =

  # its wisual widget components, was be builded in this order
  components : [
    'Months'
    'Years'
    ]

  # widget configeration and target properties
  # this setings was used to constract and insert widget into page
  widget : 
    style  : 'inline'
    target :
      fill_on_init  : yes
      format        : 'YYYY-MM-DD'

  layout :
    style : 'ui' # this is stylers for UI-like layout

  years :
    range : [ 2011, 2021 ]
    leaf :
      format     : 'YYYY'
      row_length : 22 # maximum of chars in one row
    epoch : 
      row_length : 26 # maximum of chars in one row
      format  : 'YYYY'


  months : 
    format     : 'MM'
    row_length : 14 # maximum of chars in one row

  global :
    locale  : 'ru'
    debug   : false

  # IMPORTANT!!! its mus be a string or all go wrong
  bounds : 
    low  : new Date().toString()
    high : '2019-04-01'

  # IMPORTANT!!! limiter don`t check direct user input by default
  # i.e. user MAY input ANY data by hands, for some reasons
  limiter : 
    scale  : 'months' # 'days', 'months', 'years' - this settings will be used to round date to selected scale
