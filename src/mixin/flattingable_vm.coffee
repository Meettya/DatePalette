###
This mixin add generic flatting command
###

instanceProperties =

  ###
  Object date stringificator
  ###
  getDateAsPlainObj : (format, time_obj = @_full_date_) ->
    @_flattingDateObject time_obj, format

  ###
  Return formatted object
  May use any moment format string, dont check it
  ###
  _flattingDateObject : (time_obj, format) ->
    unless format
      throw Error "|#{@_who_i_am_}.get*AsString| MUST be called with format"

    # this logic try to return non-formatted part of date or formatted string
    switch format.toUpperCase()
      when 'DATE'   then time_obj.date()
      when 'MONTH'  then time_obj.month()
      when 'YEAR'   then time_obj.year()
      
      else
        time_obj.format format


module.exports = instanceProperties