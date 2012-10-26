###
  This module for configurator.

  что оно делает - 
    компилирует конфиг из переданных данных и возвращает его, работает как статический метод
    ООП нам тут не нужно
###

# this is our main things - extender, as дшke in jQuery but standalone
extend  = require "whet.extend"

module.exports = class Configurator

  ###
  This is main compiller
  a first place - default, will be re-writen, at second - new settings as string
  static method
  ###
  @compile : (default_settings, new_settings) ->
    # we need realy deep copy
    extend true, {}, default_settings, @::_stringToObjectResolver new_settings

  ###
  Internal method for resolvin new_settings to object
  ! CAVEAT if path in new_settings is number - its will be converted to array
  ! AND ANOTHER - dont rewrite properties in different string - we are remember only first
  ###
  _stringToObjectResolver: (object_as_string) ->
    splitter = "." # <-- if you dislike dot-splitter notation - use this knob
    
    result = {}
    for own settings_name, value of object_as_string
      setting_path = "#{settings_name}".split splitter
      @_deepBuilder result, setting_path, value
      null

    result
  
  ###
  This method build our object
  worked on side-effect, but I dont know how to safe build object in other way
  ###
  _deepBuilder : (result, chain, value) ->
    
    # select type or value of next object
    # important - value is closure data
    next_level_lookup = (arg) ->
      unless arg then value else if /^\d+$/.test arg then [] else {}

    # reduce function args number
    internal_loop = (int_result, int_chain) ->
      while step = int_chain.shift()
        # do not rewrite if value already exists
        int_result[step] ?= next_level_lookup int_chain?[0]
        # recursion is our friend ;)
        internal_loop int_result[step], int_chain
      null

    # all ready, just start it
    internal_loop result, chain
    null


