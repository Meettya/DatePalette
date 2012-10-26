###
This mixin add oll form of date to string (or integer) formation
###

instanceProperties =

  ###
  Caption getter
  ###
  getCaption: (format) ->
    @getDateAsPlainObj format

  getNowCaption: (format) ->
    @getDateAsPlainObj format, @_time_point_.getNow()

  ###
  Year getter
  ###
  getYear: (format='year') ->
    @getDateAsPlainObj format

  getNowYear: (format='year') ->
    @getDateAsPlainObj format, @_time_point_.getNow()

  ###
  Month getter
  ###
  getMonth: (format='month') ->
    @getDateAsPlainObj format

  getNowMonth: (format='month') ->
    @getDateAsPlainObj format, @_time_point_.getNow()

  ###
  Day getter
  ###
  getDay: (format='date') ->
    @getDateAsPlainObj format

  getNowDay: (format='date') ->
    @getDateAsPlainObj format, @_time_point_.getNow()

module.exports = instanceProperties