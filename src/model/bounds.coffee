###
This is Bounds class - to hold and work with range of data

этот класс создает объект границы (нижняя, верхняя)
! это пассивный класс, он не учавствует в кутерьме с обсервером 

что он должен делать - 
  хранить в себе границы
  уметь проверять нвходится ли дата в границах

возможно некоторые проверки можно будет ускорить,
используя не методы range а какие-то фокусы из underscore
подумаем.
пока нужна пара методов

новая гениальная идея - 
по умолчанияю конструктор создает пустышку, в которой есть только две границы, 
  но диапазона еще нет
дальше мы трансформируем безликий объект у определенному типу,
  изменяем границы и создаем диапазон, возможно что-то мутим с проверщиком
  там много веселого похоже будет :(

новенькое - избавляемся от moment-range 
  -все сравнения будем делать только на целочисленных данных из unix()

###

# resolve require from [window] or by require() 
_       = @_      ? require 'underscore'
moment  = @moment ? require 'moment'

# for node and browser
lib_path = if GLOBAL? then '../' else ''

class Bounds 

  constructor: (low, high) ->

    @_low_moment_   = moment low
    @_high_moment_  = moment high
    # this properties will be filled later
    @_low_unix_  = null
    @_high_unix_ = null
    @_type_      = null
    @_default_format_ = null


  transformToBoundsFor : (type) ->
    [ @_type_, @_default_format_ ] = 
      switch type.toUpperCase()
        # USE UPPERCASED NAMES !!!!
        when "YEARS"    then ["year", "YYYY"]
        when "MONTHS"   then ["month", "YYYY-MM"]
        when "DAYS"     then ["day", "YYYY-MM-DD"]

        else 
          throw Error "|Bounds.transformToBoundsFor| dont know type #{type}"

    @_low_unix_   = @_roundBoundAndMakeUnix @_low_moment_
    @_high_unix_  = @_roundBoundAndMakeUnix @_high_moment_
    this


  ###
  This method work as perl 'cmp' finction
  return 
    -1 if date lower than low_bound
    0  if date in bounds
    1  if date higher than high_bound
  ###
  dateComparison : (date, format = @_default_format_) ->
    test_momemt_unix = @_makeTrimmedUnix date, format

    return -1 if @_low_unix_ > test_momemt_unix
    return  1 if test_momemt_unix > @_high_unix_
    return  0

  ###
  Fast checker by unix comparitions
  ###
  isContains : (date, format = @_default_format_) ->
    test_momemt_unix = @_makeTrimmedUnix date, format
    @_high_unix_ >= test_momemt_unix >= @_low_unix_

  ###
  Moment maker for incoming test data
  date me be moment object
  ###
  _makeTrimmedUnix : (date, format) ->
    local_moment = if moment.isMoment(date) then date else @_makeMomentByFormat date, format
    @_roundBoundAndMakeUnix local_moment

  ###
  This method round accuracy of bounds to needed and
  create unix date
  ###
  _roundBoundAndMakeUnix: (moment_date) ->
    moment_date.startOf(@_type_).unix()

  ###
  Make true moment object by stringed date, may be with formatter
  ###
  _makeMomentByFormat : (date, format) ->
    moment "#{date}", format

  ###
  This is gettes margins
  ###
  getLower:->
    @_low_moment_.clone()

  getHihger: ->
    @_high_moment_.clone()

module.exports = Bounds