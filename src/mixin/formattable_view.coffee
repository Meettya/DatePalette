###
This mixin add fast formatter, used by Views
###

instanceProperties =

  getFormatter:(formatter_type, format) ->
    switch formatter_type.toUpperCase()
      # USE UPPERCASED NAMES !!!!
      when "YEARS"  then @_createYearsFormatter format
      when "DAYS"   then @_createDaysFormatter format

      else 
        throw Error "|#{@_who_i_am_}.getFormatter| dont know formatter_type #{formatter_type}"

  ###
  Formatter for years
  ###
  _createYearsFormatter: (format) ->
    switch format.toUpperCase()
      when "YY"  then (year) -> "#{year}".slice -2
      when "YYYY" then (year) -> "#{year}"

  ###
  Formatter for days
  ###
  _createDaysFormatter : (format) ->
    switch format.toUpperCase()
      when "D"  then (day) -> "#{day}"
      when "DD" then (day) -> "0#{day}".slice -2

module.exports = instanceProperties