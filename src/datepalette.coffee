###
  This is DatePalette widget.
  How it may works - we are:
    1. init object (model)
    2. create DOM elemet (view)
    3. append events to 'target' element
###

$ = jQuery # Reference jQuery

# for node and browser
lib_path = if GLOBAL? then '../' else ''

Widget        = require "#{lib_path}model/widget"
ConfigBuilder = require "#{lib_path}model/config_builder"


DatePalette =

  init:(target, data_changed_cb, user_settings = {}, default_settings_name = 'default') ->
    # some checking while onboarding
    @_checkDataChangedCbIsFunction data_changed_cb

    # at first load and build config
    full_default_settings_path = "etc/#{default_settings_name}"
    config = ConfigBuilder.build user_settings, full_default_settings_path

    # create mother of beasts
    widget = new Widget target, data_changed_cb, config
    # tell widget assemble all
    layout = widget.assembleWidget()

    # setup limiter
    widget.setupLimiter()

    # and now show product
    widget.showProduct layout


  _checkDataChangedCbIsFunction : (data_changed_cb) ->
    unless typeof data_changed_cb is 'function'
      throw Error """
                  |DatePalette.init| can`t be initializated, not a function
                  |data_changed_cb| = |#{data_changed_cb}|
                  """



module.exports = DatePalette