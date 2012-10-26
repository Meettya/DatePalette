###
This is Year viewmodel class - response on years AND years periods ([1930][1960][1980])

что должен делать этот класс - 
  отдавать список годов
  отдавать текущий год, из списка
  ограничивать выход за пределы списка
  устанавливать новый год
###

# for node and browser
lib_path = if GLOBAL? then '../' else ''

MixinSupported  = require "#{lib_path}lib/mixin_supported"
# this is our mixins
Overflowproof   = require "#{lib_path}mixin/overflowproof"
Observable      = require "#{lib_path}mixin/observable"
SubscribleVM    = require "#{lib_path}mixin/subscrible_vm"
FlattingableVM  = require "#{lib_path}mixin/flattingable_vm"
FormattableVM   = require "#{lib_path}mixin/formattable_vm"

class Year extends MixinSupported

  @include Overflowproof
  @include Observable
  @include SubscribleVM
  @include FlattingableVM
  @include FormattableVM

  constructor: (@_time_point_, @_config_ = {}) ->
    
    @_observer_         = @_time_point_.getObserverObject()
    @_in_bus_name       = @_time_point_.getNotificationBusName() # incomming call
    
    @_who_i_am_         = 'YEAR'
    @_out_bus_name_     = "#{@_who_i_am_}.DATE_CHANGED"
    @_error_bus_name_   = "#{@_who_i_am_}.ERROR"

    # this is years list - like [ 1920, 1940, 1960, 1980, 2000, 2020 ]
    @_years_range_       = @_config_.range

    @_full_date_        = null

    # some init activity
    @_setupFullDate()
    @_subscribeToChanges()


  ###
  Year setter, actually its just call TimePoint with new year and wait
  ###
  setYear : (new_year) ->
    return this if new_year is @getYear() # do nothing if nothing changed
    @_setYearToTimePoint new_year
    this

  ###
  Era setter, make smooth changes in year 
  ie if we are have ranges [1960, 1980, 2000, 2020]
  and have year 2012 and era 2000 
  and change era to 1980 we are get 1992 year
  1980 + (2012 - 2000) = 1992
  ###
  setEra : (new_era) ->

    current_era =  @getEraStart()
    return this if new_era is current_era # do nothing if nothing changed
    # at first calculate plausible new year
    plausible_year = new_era  + @getYear() - current_era
    plausible_era_ranges  = @_buildEraRange plausible_year

    # return shifted year OR last year of new_era ranges
    # if shifted year overflow our ranges
    new_year = if new_era is plausible_era_ranges[0]
      plausible_year
    else
      new_era_ranges = @_buildEraRange new_era
      new_era_ranges[1]-1

    @setYear new_year


  ###
  This method show years range for view, eith all elements
  ###
  getAvaibleEraPoints : ->
    @_years_range_[..]

  ###
  Era getter
  ###
  getEraStart : ->
    @getEraRanges()[0]


  ###
  Era ranges (start year - end year)
  ###
  getEraRanges : ->
    @_buildEraRange @getYear()

  ###
  This method just call TimePoint and go forward
  ###
  _setYearToTimePoint : (new_year) ->
    new_time_point = @_changeYearInTimePoint new_year
    # ranges checker - may throw error!!!
    @_buildEraRange new_time_point.year()
    @_time_point_.setDate @_who_i_am_, new_time_point
    null

  ###
  Internal method to find out where TimePoint date in era list
  ###
  _buildEraRange : (year) ->
    unless era_range = @_findYearPlaceInYearsRange year, @_years_range_
      throw Error "|#{@_who_i_am_}| - year out of ranges |#{year}|"
    
    era_range

  _changeYearInTimePoint : (year) ->
    time_obj = @_time_point_.getDate()
    month = time_obj.month() # get month namber BEFORE setting year
    @_overflowCorrector time_obj.year(year), month

  ###
  Find year place in year list
  ###
  _findYearPlaceInYearsRange : (year, year_list) ->
    years_list_copy = year_list[..] # we are dont want to change original array
    while (last = years_list_copy.pop() ) and ( prev = years_list_copy[years_list_copy.length-1])
      return [prev, last] if last > year >= prev
    
module.exports = Year