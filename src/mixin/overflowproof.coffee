###
This is Observable mixin
###

instanceProperties =

  ###
  Here we are check to overflow and correct it to last available date in correct month
  ###
  _overflowCorrector : (time_point, month) ->
    if time_point.month() isnt month
      # re-set month (day already changed)
      time_point.month month
      # set to last day of month
      time_point.date time_point.daysInMonth()

    time_point


module.exports = instanceProperties