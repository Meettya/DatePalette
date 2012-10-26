###
This is ConfigBuilder class - to work with configuration

что должен уметь этот класс - 
  загрузить конфигурацию (с обработкой ошибок если такого файла нет)
  скомпоновать загруженое и переданное дополнительно в один конфиг

вполне возможно, что метод тоже статический, объект нам тут вроде не нужен
дальше все работают только с данными, они сами себе объект
###

# for node and browser
lib_path = if GLOBAL? then '../' else ''

Configurator = require "#{lib_path}lib/configurator"

class ConfigBuilder 

  ###
  This is config builder
  load data from other file, path reseted to project root (for node and browser)
  ###
  @build : (user_settings={}, default_settings_file_path) ->
    # at first try to download default settings
    default_config = @::_configLoader default_settings_file_path
    Configurator.compile default_config, user_settings

  ###
  This internal method for config loading
  ###
  _configLoader : (default_settings_file_path) ->

    unless default_settings_file_path?
      throw Error "call without filepath forbidden, aborted"

    fullpath = "#{lib_path}#{default_settings_file_path}"
    try
      require fullpath
    catch err
      throw Error """
                  requiring fail on loading file with error
                  filepath  = |#{fullpath}|
                  error     = |#{err}|
                  """

module.exports = ConfigBuilder