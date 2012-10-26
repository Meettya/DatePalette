
/*
In case we forget to take out console statements.
IE becomes very unhappy when we forget. Let's not make IE unhappy
*/

(function() {
  var methods, name, _i, _len;

  if (!this.console) {
    this.console = {};
    methods = ["log", "error", "info", "debug", "warn", "trace", "dir", "dirxml", "group", "groupEnd", "time", "timeEnd", "assert", "profile", "profileEnd"];
    for (_i = 0, _len = methods.length; _i < _len; _i++) {
      name = methods[_i];
      this.console[name] = function() {};
    }
  }

}).call(this);

(function(/*! Stitch !*/) {
  if (!this.require) {
    var modules = {}, cache = {}, require = function(name, root) {
      var path = expand(root, name), module = cache[path], fn;
      if (module) {
        return module.exports;
      } else if (fn = modules[path] || modules[path = expand(path, './index')]) {
        module = {id: path, exports: {}};
        try {
          cache[path] = module;
          fn(module.exports, function(name) {
            return require(name, dirname(path));
          }, module);
          return module.exports;
        } catch (err) {
          delete cache[path];
          throw err;
        }
      } else {
        throw 'module \'' + name + '\' not found';
      }
    }, expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    }, dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };
    this.require = function(name) {
      return require(name, '');
    }
    this.require.define = function(bundle) {
      for (var key in bundle)
        modules[key] = bundle[key];
    };
  }
  return this.require.define;
}).call(this)({"controller/limiter": function(exports, require, module) {
/*
This is Limiter controller - not model nor viewmodel.

It will be check TomePoint date (subscrube to changes) is in bounds
and set low or hight if value owerflow it.

Кстати, стоит попробовать оставить возможность выставить значение больше 
граничного, если ввод был руками, там кажется можно спросить кто изменил данные.
*/


(function() {
  var Limiter, lib_path,
    __slice = [].slice;

  lib_path = typeof GLOBAL !== "undefined" && GLOBAL !== null ? '../' : '';

  module.exports = Limiter = (function() {

    function Limiter(_time_point_, bounds_obj, _config_) {
      var bus_name, limiter_scale, observer;
      this._time_point_ = _time_point_;
      this._config_ = _config_ != null ? _config_ : {};
      observer = this._time_point_.getObserverObject();
      bus_name = this._time_point_.getNotificationBusName();
      observer.subscribe(bus_name, this._checkData, this);
      limiter_scale = this._config_.scale || 'days';
      this._who_i_am_ = 'LIMITER';
      this._bounds_ = bounds_obj.transformToBoundsFor(limiter_scale);
    }

    /*
      This is date checker
    */


    Limiter.prototype._checkData = function() {
      var args, comparition_vector, who_initor;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      who_initor = args[1];
      if (who_initor === this._who_i_am_) {
        return null;
      }
      comparition_vector = this._bounds_.dateComparison(this._time_point_.getDate());
      if (comparition_vector === 1) {
        this._time_point_.setDate(this._who_i_am_, this._bounds_.getHihger());
      } else if (comparition_vector === -1) {
        this._time_point_.setDate(this._who_i_am_, this._bounds_.getLower());
      }
      return null;
    };

    return Limiter;

  })();

}).call(this);
}, "datepalette": function(exports, require, module) {
/*
  This is DatePalette widget.
  How it may works - we are:
    1. init object (model)
    2. create DOM elemet (view)
    3. append events to 'target' element
*/


(function() {
  'use strict';

  var $, ConfigBuilder, DatePalette, Widget, lib_path;

  $ = jQuery;

  lib_path = typeof GLOBAL !== "undefined" && GLOBAL !== null ? '../' : '';

  Widget = require("" + lib_path + "model/widget");

  ConfigBuilder = require("" + lib_path + "model/config_builder");

  DatePalette = {
    init: function(target, data_changed_cb, user_settings, default_settings_name) {
      var config, full_default_settings_path, layout, widget;
      if (user_settings == null) {
        user_settings = {};
      }
      if (default_settings_name == null) {
        default_settings_name = 'default';
      }
      this._checkDataChangedCbIsFunction(data_changed_cb);
      full_default_settings_path = "etc/" + default_settings_name;
      config = ConfigBuilder.build(user_settings, full_default_settings_path);
      widget = new Widget(target, data_changed_cb, config);
      layout = widget.assembleWidget();
      widget.setupLimiter();
      return widget.showProduct(layout);
    },
    _checkDataChangedCbIsFunction: function(data_changed_cb) {
      if (typeof data_changed_cb !== 'function') {
        throw Error("|DatePalette.init| can`t be initializated, not a function\n|data_changed_cb| = |" + data_changed_cb + "|");
      }
    }
  };

  module.exports = DatePalette;

}).call(this);
}, "etc/default": function(exports, require, module) {
/*
  This is default ('base') settings
*/


(function() {

  module.exports = {
    components: ['Caption', 'Epoch', 'Years', 'Months', 'Days'],
    widget: {
      style: 'modal',
      target: {
        fill_on_init: true,
        format: 'DD MMMM YYYY'
      }
    },
    caption: {
      format: 'DD MMMM YYYY, dddd'
    },
    years: {
      range: [1910, 1940, 1960, 1980, 2000, 2020, 2040],
      leaf: {
        format: 'YY',
        row_length: 22
      }
    },
    months: {
      format: 'MMMM',
      row_length: 26
    },
    days: {
      format: 'DD',
      row_length: 18
    },
    global: {
      locale: 'ru',
      debug: false
    },
    bounds: {
      low: '1950-02-15',
      high: '2017-06-28'
    },
    limiter: {
      check_direct_input: true
    }
  };

}).call(this);
}, "etc/inline": function(exports, require, module) {
/*
  This is default ('inline') settings
*/


(function() {

  module.exports = {
    components: ['Months', 'Years'],
    widget: {
      style: 'inline',
      target: {
        fill_on_init: true,
        format: 'YYYY-MM-DD'
      }
    },
    years: {
      range: [2011, 2021],
      leaf: {
        format: 'YYYY',
        row_length: 22
      }
    },
    months: {
      format: 'MM',
      row_length: 14
    },
    global: {
      locale: 'ru',
      debug: false
    },
    bounds: {
      low: new Date().toString(),
      high: '2019-04-01'
    },
    limiter: {
      scale: 'months'
    }
  };

}).call(this);
}, "lib/configurator": function(exports, require, module) {
/*
  This module for configurator.

  что оно делает - 
    компилирует конфиг из переданных данных и возвращает его, работает как статический метод
    ООП нам тут не нужно
*/


(function() {
  var Configurator, extend,
    __hasProp = {}.hasOwnProperty;

  extend = require("whet.extend");

  module.exports = Configurator = (function() {

    function Configurator() {}

    /*
      This is main compiller
      a first place - default, will be re-writen, at second - new settings as string
      static method
    */


    Configurator.compile = function(default_settings, new_settings) {
      return extend(true, {}, default_settings, this.prototype._stringToObjectResolver(new_settings));
    };

    /*
      Internal method for resolvin new_settings to object
      ! CAVEAT if path in new_settings is number - its will be converted to array
      ! AND ANOTHER - dont rewrite properties in different string - we are remember only first
    */


    Configurator.prototype._stringToObjectResolver = function(object_as_string) {
      var result, setting_path, settings_name, splitter, value;
      splitter = ".";
      result = {};
      for (settings_name in object_as_string) {
        if (!__hasProp.call(object_as_string, settings_name)) continue;
        value = object_as_string[settings_name];
        setting_path = ("" + settings_name).split(splitter);
        this._deepBuilder(result, setting_path, value);
        null;
      }
      return result;
    };

    /*
      This method build our object
      worked on side-effect, but I dont know how to safe build object in other way
    */


    Configurator.prototype._deepBuilder = function(result, chain, value) {
      var internal_loop, next_level_lookup;
      next_level_lookup = function(arg) {
        if (!arg) {
          return value;
        } else if (/^\d+$/.test(arg)) {
          return [];
        } else {
          return {};
        }
      };
      internal_loop = function(int_result, int_chain) {
        var step, _ref;
        while (step = int_chain.shift()) {
          if ((_ref = int_result[step]) == null) {
            int_result[step] = next_level_lookup(int_chain != null ? int_chain[0] : void 0);
          }
          internal_loop(int_result[step], int_chain);
        }
        return null;
      };
      internal_loop(result, chain);
      return null;
    };

    return Configurator;

  })();

}).call(this);
}, "lib/mixin_supported": function(exports, require, module) {
/*
This is MixinSupported class
*/


(function() {
  var MixinSupported, moduleKeywords,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  moduleKeywords = ['extended', 'included'];

  MixinSupported = (function() {

    function MixinSupported() {}

    MixinSupported.extend = function(obj) {
      var key, value, _ref;
      for (key in obj) {
        value = obj[key];
        if (__indexOf.call(moduleKeywords, key) < 0) {
          this[key] = value;
        }
      }
      if ((_ref = obj.extended) != null) {
        _ref.apply(this);
      }
      return this;
    };

    MixinSupported.include = function(obj) {
      var key, value, _ref;
      for (key in obj) {
        value = obj[key];
        if (__indexOf.call(moduleKeywords, key) < 0) {
          this.prototype[key] = value;
        }
      }
      if ((_ref = obj.included) != null) {
        _ref.apply(this);
      }
      return this;
    };

    return MixinSupported;

  })();

  module.exports = MixinSupported;

}).call(this);
}, "lib/stack": function(exports, require, module) {
/*
This is Stack storage
Semi-classical implementations  - clear, push, pop, see, isEmpty + fill (speed up pushing)
Need to control access and have nice named functions
*/


(function() {
  var Stack,
    __slice = [].slice;

  Stack = (function() {

    function Stack() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this._stack_ = args;
    }

    Stack.prototype.clear = function() {
      return this._stack_ = [];
    };

    Stack.prototype.fill = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this._stack_ = this._stack_.concat(args);
    };

    Stack.prototype.push = function(item) {
      return this._stack_.push(item);
    };

    Stack.prototype.pop = function() {
      return this._stack_.pop();
    };

    Stack.prototype.see = function() {
      return this._stack_[this._stack_.length - 1];
    };

    Stack.prototype.isEmpty = function() {
      return !this._stack_.length;
    };

    return Stack;

  })();

  module.exports = Stack;

}).call(this);
}, "mixin/flattingable_vm": function(exports, require, module) {
/*
This mixin add generic flatting command
*/


(function() {
  var instanceProperties;

  instanceProperties = {
    /*
      Object date stringificator
    */

    getDateAsPlainObj: function(format, time_obj) {
      if (time_obj == null) {
        time_obj = this._full_date_;
      }
      return this._flattingDateObject(time_obj, format);
    },
    /*
      Return formatted object
      May use any moment format string, dont check it
    */

    _flattingDateObject: function(time_obj, format) {
      if (!format) {
        throw Error("|" + this._who_i_am_ + ".get*AsString| MUST be called with format");
      }
      switch (format.toUpperCase()) {
        case 'DATE':
          return time_obj.date();
        case 'MONTH':
          return time_obj.month();
        case 'YEAR':
          return time_obj.year();
        default:
          return time_obj.format(format);
      }
    }
  };

  module.exports = instanceProperties;

}).call(this);
}, "mixin/formattable_vm": function(exports, require, module) {
/*
This mixin add oll form of date to string (or integer) formation
*/


(function() {
  var instanceProperties;

  instanceProperties = {
    /*
      Caption getter
    */

    getCaption: function(format) {
      return this.getDateAsPlainObj(format);
    },
    getNowCaption: function(format) {
      return this.getDateAsPlainObj(format, this._time_point_.getNow());
    },
    /*
      Year getter
    */

    getYear: function(format) {
      if (format == null) {
        format = 'year';
      }
      return this.getDateAsPlainObj(format);
    },
    getNowYear: function(format) {
      if (format == null) {
        format = 'year';
      }
      return this.getDateAsPlainObj(format, this._time_point_.getNow());
    },
    /*
      Month getter
    */

    getMonth: function(format) {
      if (format == null) {
        format = 'month';
      }
      return this.getDateAsPlainObj(format);
    },
    getNowMonth: function(format) {
      if (format == null) {
        format = 'month';
      }
      return this.getDateAsPlainObj(format, this._time_point_.getNow());
    },
    /*
      Day getter
    */

    getDay: function(format) {
      if (format == null) {
        format = 'date';
      }
      return this.getDateAsPlainObj(format);
    },
    getNowDay: function(format) {
      if (format == null) {
        format = 'date';
      }
      return this.getDateAsPlainObj(format, this._time_point_.getNow());
    }
  };

  module.exports = instanceProperties;

}).call(this);
}, "mixin/gridable_v": function(exports, require, module) {
/*
This mixin may get flat array of objects and split it
on some part, limiting reason - chars number in 'name' properties
*/


(function() {
  var instanceProperties;

  instanceProperties = {
    /*
      This method get array of objects {number: x, name: 'xx')},
      and return array of arrays 
      [
        [{number: 0, name: 'xx'}, {number: 1, name: 'xx'}, {number: 2, name: 'xx'}],
        [{number: 3, name: 'xxxx'},{number: 4, name: 'xxx'},{number: 5, name: 'xx'}]
      ]
      to fit it in string
    */

    _compileSplittedRange: function(range, max_char_in_row) {
      var accumalator, char_counter, compiled_ranges, date_obj, name_length, _i, _len;
      char_counter = 0;
      accumalator = [];
      compiled_ranges = [];
      for (_i = 0, _len = range.length; _i < _len; _i++) {
        date_obj = range[_i];
        name_length = date_obj.name.length;
        date_obj.in_bounds = this._inBoundsChecker(date_obj.number);
        if ((char_counter + name_length) >= max_char_in_row) {
          compiled_ranges.push(accumalator);
          accumalator = [date_obj];
          char_counter = name_length;
        } else {
          accumalator.push(date_obj);
          char_counter += name_length;
        }
      }
      if (accumalator.length) {
        compiled_ranges.push(accumalator);
      }
      return compiled_ranges;
    },
    /*
      Sequence builder
    */

    _buildSequence: function(begin, end, formater) {
      var element, _i, _results;
      _results = [];
      for (element = _i = begin; begin <= end ? _i <= end : _i >= end; element = begin <= end ? ++_i : --_i) {
        _results.push({
          number: element,
          name: formater(element)
        });
      }
      return _results;
    },
    /*
      Interval amplifier - extend last container to have some elements as first
    */

    _intervalAmplifier: function(ranges, formatter) {
      var addon, diff, first_line, last_idx, last_line, step, _ref;
      last_idx = ranges.length - 1;
      _ref = [ranges[0], ranges[last_idx]], first_line = _ref[0], last_line = _ref[1];
      diff = first_line.length - last_line.length;
      if (diff) {
        addon = (function() {
          var _i, _results;
          _results = [];
          for (step = _i = 0; 0 <= diff ? _i < diff : _i > diff; step = 0 <= diff ? ++_i : --_i) {
            _results.push({
              number: null,
              name: formatter('00')
            });
          }
          return _results;
        })();
        ranges.splice(last_idx, 1, last_line.concat(addon));
      }
      return ranges;
    }
  };

  module.exports = instanceProperties;

}).call(this);
}, "mixin/observable": function(exports, require, module) {
/*
This is Observable mixin
*/


(function() {
  var instanceProperties,
    __slice = [].slice;

  instanceProperties = {
    /*
      This method say  Notification bus name
    */

    getNotificationBusName: function() {
      return this._out_bus_name_;
    },
    /*
      This method return bus name for errors
    */

    getErrorBusName: function() {
      return this._error_bus_name_;
    },
    /*
      This is broadcast alert messages topic
    */

    getBroadcastErrorBusName: function() {
      return 'ERROR';
    },
    /*
      This method may used to share one observer to any TimePint client
      instead of holding Observer object somewhere also we have original observer here
    */

    getObserverObject: function() {
      return this._observer_;
    },
    /*
      This method is part of 'Observerble' mixin
      Use to notify all subscribers
    */

    notifyMySubscribers: function() {
      var args, offender;
      offender = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return this._observerPublisher(this._out_bus_name_, offender, args);
    },
    /*
      Error bus to warn subscribers if somthing go wrong
      May be usefull for internal alert wedget
    */

    warnMySubscribers: function() {
      var args, offender;
      offender = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return this._observerPublisher(this._error_bus_name_, offender, args);
    },
    /*
      Broadcast alert - warn any subscriber on Broadcast Error bus
    */

    broadcastAlert: function() {
      var args, offender;
      offender = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return this._observerPublisher(this.getBroadcastErrorBusName(), offender, args);
    },
    _observerPublisher: function(topics, offender, args) {
      this._observer_.publishAsync.apply(this._observer_, [topics, offender].concat(args));
      return null;
    }
  };

  module.exports = instanceProperties;

}).call(this);
}, "mixin/overflowproof": function(exports, require, module) {
/*
This is Observable mixin
*/


(function() {
  var instanceProperties;

  instanceProperties = {
    /*
      Here we are check to overflow and correct it to last available date in correct month
    */

    _overflowCorrector: function(time_point, month) {
      if (time_point.month() !== month) {
        time_point.month(month);
        time_point.date(time_point.daysInMonth());
      }
      return time_point;
    }
  };

  module.exports = instanceProperties;

}).call(this);
}, "mixin/subscrible_vm": function(exports, require, module) {
/*
This is Subscrible View Model mixin
all what need to make subscriber vm
*/


(function() {
  var instanceProperties;

  instanceProperties = {
    /*
      Internal setter for update object state
    */

    _setupFullDate: function() {
      return this._full_date_ = this._time_point_.getDate();
    },
    /*
      TimePoint change watcher
      Этот метод вешается на событие о изменении данных в TimePoint 
      и, фактически, он и занимается изменением состояния объекта
    */

    _timePointWatcher: function(chanel, who, tick) {
      this._setupFullDate();
      this.notifyMySubscribers(who);
      return null;
    },
    /*
      Это охранная собака для подписчика.
      Суть в том, что может возникнуть какая-нить ошибка
      мы отлавливаем ее, разбираемся что случилось и если проблема здесь -
      что-что с этим делаем и отправляем уведомление
      если нет - перебрасываем исключение дальше
    */

    _subscribeWatchdog: function(error, options) {
      var err_tick, who_init, _ref, _ref1;
      if (options == null) {
        options = {};
      }
      _ref1 = (_ref = options.data) != null ? _ref.slice(0) : void 0, who_init = _ref1[0], err_tick = _ref1[1];
      if (who_init !== this._who_i_am_) {
        throw Error(error);
      }
      this._time_point_.undoDateChanges(this._who_i_am_, err_tick);
      this.warnMySubscribers(this._who_i_am_, error);
      return null;
    },
    /*
      Subscriber to TimePoint changes
    */

    _subscribeToChanges: function() {
      return this._observer_.subscribeGuarded(this._in_bus_name, this._timePointWatcher, this._subscribeWatchdog, this);
    }
  };

  module.exports = instanceProperties;

}).call(this);
}, "model/bounds": function(exports, require, module) {
/*
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
*/


(function() {
  var Bounds, lib_path, moment, _, _ref, _ref1;

  _ = (_ref = this._) != null ? _ref : require('underscore');

  moment = (_ref1 = this.moment) != null ? _ref1 : require('moment');

  lib_path = typeof GLOBAL !== "undefined" && GLOBAL !== null ? '../' : '';

  Bounds = (function() {

    function Bounds(low, high) {
      this._low_moment_ = moment(low);
      this._high_moment_ = moment(high);
      this._low_unix_ = null;
      this._high_unix_ = null;
      this._type_ = null;
      this._default_format_ = null;
    }

    Bounds.prototype.transformToBoundsFor = function(type) {
      var _ref2;
      _ref2 = (function() {
        switch (type.toUpperCase()) {
          case "YEARS":
            return ["year", "YYYY"];
          case "MONTHS":
            return ["month", "YYYY-MM"];
          case "DAYS":
            return ["day", "YYYY-MM-DD"];
          default:
            throw Error("|Bounds.transformToBoundsFor| dont know type " + type);
        }
      })(), this._type_ = _ref2[0], this._default_format_ = _ref2[1];
      this._low_unix_ = this._roundBoundAndMakeUnix(this._low_moment_);
      this._high_unix_ = this._roundBoundAndMakeUnix(this._high_moment_);
      return this;
    };

    /*
      This method work as perl 'cmp' finction
      return 
        -1 if date lower than low_bound
        0  if date in bounds
        1  if date higher than high_bound
    */


    Bounds.prototype.dateComparison = function(date, format) {
      var test_momemt_unix;
      if (format == null) {
        format = this._default_format_;
      }
      test_momemt_unix = this._makeTrimmedUnix(date, format);
      if (this._low_unix_ > test_momemt_unix) {
        return -1;
      }
      if (test_momemt_unix > this._high_unix_) {
        return 1;
      }
      return 0;
    };

    /*
      Fast checker by unix comparitions
    */


    Bounds.prototype.isContains = function(date, format) {
      var test_momemt_unix;
      if (format == null) {
        format = this._default_format_;
      }
      test_momemt_unix = this._makeTrimmedUnix(date, format);
      return (this._high_unix_ >= test_momemt_unix && test_momemt_unix >= this._low_unix_);
    };

    /*
      Moment maker for incoming test data
      date me be moment object
    */


    Bounds.prototype._makeTrimmedUnix = function(date, format) {
      var local_moment;
      local_moment = moment.isMoment(date) ? date : this._makeMomentByFormat(date, format);
      return this._roundBoundAndMakeUnix(local_moment);
    };

    /*
      This method round accuracy of bounds to needed and
      create unix date
    */


    Bounds.prototype._roundBoundAndMakeUnix = function(moment_date) {
      return moment_date.startOf(this._type_).unix();
    };

    /*
      Make true moment object by stringed date, may be with formatter
    */


    Bounds.prototype._makeMomentByFormat = function(date, format) {
      return moment("" + date, format);
    };

    /*
      This is gettes margins
    */


    Bounds.prototype.getLower = function() {
      return this._low_moment_.clone();
    };

    Bounds.prototype.getHihger = function() {
      return this._high_moment_.clone();
    };

    return Bounds;

  })();

  module.exports = Bounds;

}).call(this);
}, "model/config_builder": function(exports, require, module) {
/*
This is ConfigBuilder class - to work with configuration

что должен уметь этот класс - 
  загрузить конфигурацию (с обработкой ошибок если такого файла нет)
  скомпоновать загруженое и переданное дополнительно в один конфиг

вполне возможно, что метод тоже статический, объект нам тут вроде не нужен
дальше все работают только с данными, они сами себе объект
*/


(function() {
  var ConfigBuilder, Configurator, lib_path;

  lib_path = typeof GLOBAL !== "undefined" && GLOBAL !== null ? '../' : '';

  Configurator = require("" + lib_path + "lib/configurator");

  ConfigBuilder = (function() {

    function ConfigBuilder() {}

    /*
      This is config builder
      load data from other file, path reseted to project root (for node and browser)
    */


    ConfigBuilder.build = function(user_settings, default_settings_file_path) {
      var default_config;
      if (user_settings == null) {
        user_settings = {};
      }
      default_config = this.prototype._configLoader(default_settings_file_path);
      return Configurator.compile(default_config, user_settings);
    };

    /*
      This internal method for config loading
    */


    ConfigBuilder.prototype._configLoader = function(default_settings_file_path) {
      var fullpath;
      if (default_settings_file_path == null) {
        throw Error("call without filepath forbidden, aborted");
      }
      fullpath = "" + lib_path + default_settings_file_path;
      try {
        return require(fullpath);
      } catch (err) {
        throw Error("requiring fail on loading file with error\nfilepath  = |" + fullpath + "|\nerror     = |" + err + "|");
      }
    };

    return ConfigBuilder;

  })();

  module.exports = ConfigBuilder;

}).call(this);
}, "model/registry": function(exports, require, module) {
/*
This is Registry - its resolve all view model dependencies

что должен делать этот класс
  создать обсервер, таймпоинт и все элементы въюмодели
  отдавать элементы вюъмодели по запросу 

(подумать - копии или одну и ту же, но логичнее всего одну и ту же)
*/


(function() {
  var Bounds, Caption, Day, Month, Observer, Registry, TimePoint, Year, lib_path, _, _ref;

  _ = (_ref = this._) != null ? _ref : require('underscore');

  lib_path = typeof GLOBAL !== "undefined" && GLOBAL !== null ? '../' : '';

  Observer = require('dendrite');

  TimePoint = require("" + lib_path + "model/timepoint");

  Bounds = require("" + lib_path + "model/bounds");

  Year = require("" + lib_path + "viewmodel/year");

  Month = require("" + lib_path + "viewmodel/month");

  Day = require("" + lib_path + "viewmodel/day");

  Caption = require("" + lib_path + "viewmodel/caption");

  Registry = (function() {

    function Registry(_config_) {
      this._config_ = _config_ != null ? _config_ : {};
      this._observer_ = new Observer();
      this._time_point_ = new TimePoint(this._observer_, {
        lang: this._config_.locale
      });
    }

    /*
      Create Bounds for correct visual rendering
      ! Important - YES, new object on EVERY request, 
      because later it will be mutated to specific bound
    */


    Registry.prototype.getBounds = function(options) {
      return new Bounds(options.low, options.high);
    };

    /*
      This method create and return Year View Model Element
    */


    Registry.prototype.getYearVM = function(options) {
      return new Year(this._time_point_, options);
    };

    /*
      This method create and return Year View Model Element
    */


    Registry.prototype.getMonthVM = function(options) {
      return new Month(this._time_point_, options);
    };

    /*
      This method create and return Year View Model Element
    */


    Registry.prototype.getDayVM = function(options) {
      return new Day(this._time_point_, options);
    };

    /*
      This method create and return Year View Model Element
    */


    Registry.prototype.getCaptionVM = function(options) {
      return new Caption(this._time_point_, options);
    };

    /*
      Getters for main object, may be only for develop
    */


    Registry.prototype.getObserver = function() {
      return this._observer_;
    };

    /*
      For direct changes in TimePoint object
    */


    Registry.prototype.getTimePoint = function() {
      return this._time_point_;
    };

    return Registry;

  })();

  module.exports = Registry;

}).call(this);
}, "model/timepoint": function(exports, require, module) {
/*
This is main class TimePoint - it own date value(as Moment object), work with Observer etc.
*/


(function() {
  var MixinSupported, Moment, Observable, Stack, TimePoint, lib_path, _, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  _ = (_ref = this._) != null ? _ref : require('underscore');

  Moment = (_ref1 = this.moment) != null ? _ref1 : require('moment');

  lib_path = typeof GLOBAL !== "undefined" && GLOBAL !== null ? '../' : '';

  Stack = require("" + lib_path + "lib/stack");

  MixinSupported = require("" + lib_path + "lib/mixin_supported");

  Observable = require("" + lib_path + "mixin/observable");

  TimePoint = (function(_super) {

    __extends(TimePoint, _super);

    TimePoint.include(Observable);

    function TimePoint(_observer_, _config_) {
      var who_i_am;
      this._observer_ = _observer_;
      this._config_ = _config_ != null ? _config_ : {};
      this._time_point_ = this.buildNewMoment();
      this._tick_ = 0;
      this._undo_stack_ = new Stack();
      who_i_am = 'TIMEPOINT';
      this._out_bus_name_ = "" + who_i_am + ".DATE_CHANGED";
      this._error_bus_name_ = "" + who_i_am + ".ERROR";
      this._lang_ = this._config_.lang || 'en';
    }

    /*
      Interface method to setup new date
    */


    TimePoint.prototype.setDate = function() {
      var args, new_moment, who;
      who = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      new_moment = this.buildNewMoment.apply(null, args);
      this._saveMoment();
      this._time_point_ = new_moment;
      this.notifyMySubscribers(who, this._tick_);
      return this;
    };

    /*
      Return now() in any type
    */


    TimePoint.prototype.getNow = function(type) {
      return this._convertObject(this.buildNewMoment(), type);
    };

    /*
      Return object date in any type
    */


    TimePoint.prototype.getDate = function(type) {
      return this._convertObject(this._time_point_, type);
    };

    /*
      Return cloned or converted object
    */


    TimePoint.prototype._convertObject = function(time_obj, type) {
      var new_time_obj;
      if (type == null) {
        type = 'moment';
      }
      switch (type.toLowerCase()) {
        case 'js':
          return time_obj.toDate();
        case 'epox_ms':
          return time_obj.valueOf();
        case 'moment':
          new_time_obj = time_obj.clone();
          new_time_obj.lang(this._lang_);
          return new_time_obj;
        default:
          throw Error("|TimePoint.get*| don't now |" + type + "| type");
      }
    };

    /*
      This method undo changes by setting time point to previews value
      Why you need correct @tick? So, if changes public in async mode 
      - you know, any shit may happened. For example - two widgets want to undo changes.
      Second one may be late.
    */


    TimePoint.prototype.undoDateChanges = function(who, tick) {
      if (this._undo_stack_.isEmpty()) {
        throw Error("undoDateChanges aborted, undo stack is empty");
      }
      if (!tick) {
        throw Error("undoDateChanges aborted, void tick argument is forbidden");
      }
      if (tick !== this._tick_) {
        throw Error("undoDateChanges aborted, tick mismatch");
      }
      return this.setDate(who, this.buildNewMoment(this._undo_stack_.pop()));
    };

    /*
      Internal method to create new Moment object
    */


    TimePoint.prototype.buildNewMoment = function() {
      var args, new_moment;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      new_moment = Moment.prototype.constructor.apply(null, args);
      if (!new_moment.isValid()) {
        throw Error("creation aborted, invalid data |" + args + "|");
      }
      return new_moment;
    };

    /*
      Internal method for change stamping
    */


    TimePoint.prototype._setNextTick = function() {
      return this._tick_ = this._tick_ + 1;
    };

    /*
      Internal method to incapsulate save logic
      Date saved as Unix Epox to reduce memory using
    */


    TimePoint.prototype._saveMoment = function() {
      this._undo_stack_.push(this.getDate('epox_ms'));
      this._setNextTick();
      return null;
    };

    return TimePoint;

  })(MixinSupported);

  module.exports = TimePoint;

}).call(this);
}, "model/widget": function(exports, require, module) {
/*
This is Widget model - main container, builder, and so on

что должен делать этот класс - 
  создавать виджет определенной конфигурации
  по частям создавать различные элементы виджета

что НЕ должен делать этот класс
  взаимодействовать с какими-либо визуальными элементами
*/


(function() {
  var Caption, Days, Epoch, Inline, Layout, Limiter, Modal, Months, Registry, Wiget, Years, lib_path, _, _ref;

  _ = (_ref = this._) != null ? _ref : require('underscore');

  lib_path = typeof GLOBAL !== "undefined" && GLOBAL !== null ? '../' : '';

  Registry = require("" + lib_path + "model/registry");

  Limiter = require("" + lib_path + "controller/limiter");

  Layout = require("" + lib_path + "view/layout");

  Epoch = require("" + lib_path + "view/epoch");

  Years = require("" + lib_path + "view/years");

  Months = require("" + lib_path + "view/months");

  Days = require("" + lib_path + "view/days");

  Caption = require("" + lib_path + "view/caption");

  Modal = require("" + lib_path + "view/modal");

  Inline = require("" + lib_path + "view/inline");

  Wiget = (function() {

    function Wiget(_target_, _user_data_changed_cb_, _config_) {
      this._target_ = _target_;
      this._user_data_changed_cb_ = _user_data_changed_cb_;
      this._config_ = _config_ != null ? _config_ : {};
      this._uuid_ = _.uniqueId('DPalette_');
      this._registry_ = new Registry(this._config_.global);
      this._time_point_ = this._registry_.getTimePoint();
      this._year_vm_ = this._registry_.getYearVM(this._config_.years);
      this._month_vm_ = this._registry_.getMonthVM();
      this._day_vm_ = this._registry_.getDayVM();
      this._caption_vm_ = this._registry_.getCaptionVM();
    }

    /*
      Limiter constructor
    */


    Wiget.prototype.setupLimiter = function() {
      return this._createLimiter();
    };

    /*
      Just limiter constructor itself
    */


    Wiget.prototype._createLimiter = function() {
      return new Limiter(this._time_point_, this.getBounds(), this._config_.limiter);
    };

    /*
      Method to create ALL product (actualy widget, but to mane 'widget' here)
      Dont know what I must return from this method, may be null
    */


    Wiget.prototype.showProduct = function(layout) {
      var whole_widget, widget_style;
      widget_style = this._config_.widget.style;
      whole_widget = (function() {
        switch (widget_style.toUpperCase()) {
          case "MODAL":
            return this._createProductAsModal();
          case "INLINE":
            return this._createProductAsInline();
          default:
            throw Error("|Product| - can`t create presentation style - unknown \n|widget_style| = |" + widget_style + "|");
        }
      }).call(this);
      whole_widget.inject(layout);
      return null;
    };

    /*
      Modal style view
    */


    Wiget.prototype._createProductAsModal = function() {
      var product;
      return product = new Modal(this, this._caption_vm_, this._config_.widget);
    };

    /*
      Inline style view
    */


    Wiget.prototype._createProductAsInline = function() {
      var product;
      return product = new Inline(this, this._caption_vm_, this._config_.widget);
    };

    /*
      Method to create layout
    */


    Wiget.prototype.createLayout = function() {
      return Layout.createView(this._uuid_);
    };

    /*
      This method share target for this widget
    */


    Wiget.prototype.getUserDataChangedCb = function() {
      return this._user_data_changed_cb_;
    };

    /*
      This method share target for this widget
    */


    Wiget.prototype.getTarget = function() {
      return this._target_;
    };

    /*
      This method share UUID for this widget
    */


    Wiget.prototype.getUUID = function() {
      return this._uuid_;
    };

    /*
      This method create element with view data
    */


    Wiget.prototype.createElement = function(element_name) {
      switch (element_name.toUpperCase()) {
        case "EPOCH":
          return this._createEpoch();
        case "YEARS":
          return this._createYears();
        case "MONTHS":
          return this._createMonths();
        case "DAYS":
          return this._createDays();
        case "CAPTION":
          return this._createCaption();
        default:
          throw Error("|Widget.createElement| dont know element " + element_name);
      }
    };

    /*
      May be usefully, mey be not - I`m think about it later
    */


    Wiget.prototype.getObserver = function() {
      return this._registry_.getObserver();
    };

    /*
      It our Bounds to correct render all views
    */


    Wiget.prototype.getBounds = function() {
      return this._registry_.getBounds(this._config_.bounds);
    };

    /*
      This is widget builder
      It get componets list from config, prepare it an append it to layout,
      then return DOM part as result
      This method DO NOT interract with target, DOM or any other things
    */


    Wiget.prototype.assembleWidget = function() {
      var assemble_plan, layout, part, _i, _len;
      layout = this.createLayout();
      assemble_plan = this._config_.components;
      for (_i = 0, _len = assemble_plan.length; _i < _len; _i++) {
        part = assemble_plan[_i];
        $(layout).append(this.createElement(part));
        null;
      }
      return layout;
    };

    Wiget.prototype._createEpoch = function() {
      var element;
      element = new Epoch(this._year_vm_, this.getBounds());
      return element.createView();
    };

    Wiget.prototype._createYears = function() {
      var element;
      element = new Years(this._year_vm_, this.getBounds(), this._config_.years.leaf);
      return element.createView();
    };

    Wiget.prototype._createMonths = function() {
      var element;
      element = new Months(this._month_vm_, this.getBounds(), this._config_.months);
      return element.createView();
    };

    Wiget.prototype._createDays = function() {
      var element;
      element = new Days(this._day_vm_, this._month_vm_, this.getBounds(), this._config_.days);
      return element.createView();
    };

    Wiget.prototype._createCaption = function() {
      var element;
      element = new Caption(this._caption_vm_, this.getBounds(), this._config_.caption);
      return element.createView();
    };

    return Wiget;

  })();

  module.exports = Wiget;

}).call(this);
}, "template/caption": function(exports, require, module) {module.exports = function(__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
    
      __out.push('<div class="ui-datepalette-header ui-widget-header ui-helper-clearfix ui-corner-all">\n  ');
    
      __out.push(__sanitize(this.caption));
    
      __out.push('\n</div>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}}, "template/epoch": function(exports, require, module) {module.exports = function(__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      var elem, li_class, _i, _len, _ref;
    
      __out.push('<ul class="ui-datepalette-root ui-datepalette-margin">\n  ');
    
      _ref = this.ranges;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        __out.push('\n    ');
        li_class = "ui-state-default ui-corner-all";
        __out.push('\n    ');
        if (!elem.in_bounds) {
          li_class += " ui-state-disabled";
        }
        __out.push('\n    ');
        if (elem.number === this.selected) {
          li_class += " ui-state-highlight";
        }
        __out.push('\n    <li class="');
        __out.push(__sanitize(li_class));
        __out.push('" data-datepalette="');
        __out.push(__sanitize(elem.number));
        __out.push('">');
        __out.push(__sanitize(elem.name));
        __out.push('</li>\n  ');
      }
    
      __out.push('\n</ul>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}}, "template/layout": function(exports, require, module) {module.exports = function(__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
    
      __out.push('<div id="');
    
      __out.push(__sanitize(this.mainDivId));
    
      __out.push('" class="ui-datepalette ui-widget ui-widget-content ui-helper-clearfix ui-corner-all">\n\n</div>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}}, "template/leaf": function(exports, require, module) {module.exports = function(__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      var elem, li_class, row, _i, _j, _len, _len1, _ref;
    
      __out.push('<div class="ui-datepalette-margin">\n\n');
    
      _ref = this.range;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        __out.push('\n\n  <ul class="ui-datepalette-leaf">\n  \n  ');
        for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
          elem = row[_j];
          __out.push('\n\n    ');
          li_class = "ui-state-default";
          __out.push('\n    ');
          if (!elem.in_bounds) {
            li_class += " ui-state-disabled";
          }
          __out.push('\n    ');
          if (elem.number === this.selected) {
            li_class += " ui-state-active";
          }
          __out.push('\n    ');
          if (elem.number === null) {
            li_class += " ui-datepalette-leaf-hide";
          }
          __out.push('\n    \n    <li class="');
          __out.push(__sanitize(li_class));
          __out.push('" data-datepalette="');
          __out.push(__sanitize(elem.number));
          __out.push('">');
          __out.push(__sanitize(elem.name));
          __out.push('</li>\n  \n  ');
        }
        __out.push('\n\n  </ul>\n\n');
      }
    
      __out.push('\n\n</div>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}}, "view/caption": function(exports, require, module) {
/*
This View module itself for epoch selector ([1930][1960][1980]) - this like
*/


(function() {
  var $, Caption, lib_path, template;

  if (!this.Metamorph) {
    throw Error("sorry, resolve Methamorph dependency first!");
  }

  $ = jQuery;

  lib_path = typeof GLOBAL !== "undefined" && GLOBAL !== null ? '../' : '';

  template = require("" + lib_path + "template/caption");

  module.exports = Caption = (function() {

    function Caption(_caption_vm_, _bounds_, _config_) {
      var bus_name, observer;
      this._caption_vm_ = _caption_vm_;
      this._bounds_ = _bounds_;
      this._config_ = _config_ != null ? _config_ : {};
      observer = this._caption_vm_.getObserverObject();
      bus_name = this._caption_vm_.getNotificationBusName();
      observer.subscribe(bus_name, this._updateData, this);
      this._morph_ = Metamorph(this._renderContent());
    }

    /*
      To create root UL node and append to it Methamorph object
    */


    Caption.prototype.createView = function() {
      return $('<div>').append(this._morph_.outerHTML());
    };

    /*
      Thats all, only one public method, sorry :)
    */


    /*
      Create content for Morph object
    */


    Caption.prototype._renderContent = function() {
      return template({
        caption: this._caption_vm_.getCaption(this._config_.format)
      });
    };

    /*
      Update Morph data, data re-render automatically
    */


    Caption.prototype._updateData = function() {
      return this._morph_.html(this._renderContent());
    };

    return Caption;

  })();

}).call(this);
}, "view/days": function(exports, require, module) {
/*
This View module itself for Days selector (1,2,3,4) - this like
*/


(function() {
  var $, Days, GridableV, MixinSupported, lib_path, template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (!this.Metamorph) {
    throw Error("sorry, resolve Methamorph dependency first!");
  }

  $ = jQuery;

  lib_path = typeof GLOBAL !== "undefined" && GLOBAL !== null ? '../' : '';

  MixinSupported = require("" + lib_path + "lib/mixin_supported");

  GridableV = require("" + lib_path + "mixin/gridable_v");

  template = require("" + lib_path + "template/leaf");

  module.exports = Days = (function(_super) {

    __extends(Days, _super);

    Days.include(GridableV);

    function Days(_view_model_, _month_vm_, bounds_obj, _config_) {
      var bus_name, observer;
      this._view_model_ = _view_model_;
      this._month_vm_ = _month_vm_;
      this._config_ = _config_ != null ? _config_ : {};
      this._handler = __bind(this._handler, this);

      observer = this._view_model_.getObserverObject();
      bus_name = this._view_model_.getNotificationBusName();
      observer.subscribe(bus_name, this._updateData, this);
      this._formatter_ = this._makeFormatter(this._config_.format);
      this._bounds_ = bounds_obj.transformToBoundsFor('days');
      this._morph_ = Metamorph(this._renderContent());
    }

    /*
      To create root UL node and append to it Methamorph object
    */


    Days.prototype.createView = function() {
      return $('<div>').on("click", "li", this._handler).append(this._morph_.outerHTML());
    };

    /*
      Thats all, only one public method, sorry :)
    */


    /*
      Create content for Morph object
    */


    Days.prototype._renderContent = function() {
      var compiled_ranges, days_in_month, days_sequence;
      days_in_month = this._month_vm_.getDaysInMonth();
      days_sequence = this._buildSequence(1, days_in_month, this._formatter_);
      compiled_ranges = this._compileSplittedRange(days_sequence, this._config_.row_length);
      return template({
        range: this._intervalAmplifier(compiled_ranges, this._formatter_),
        selected: this._view_model_.getDay()
      });
    };

    /*
      Formatter for days
    */


    Days.prototype._makeFormatter = function(format) {
      switch (format.toUpperCase()) {
        case "D":
          return function(day) {
            return "" + day;
          };
        case "DD":
          return function(day) {
            return ("0" + day).slice(-2);
          };
      }
    };

    /*
      This method for fast check - is month in this year is in bounds or not
    */


    Days.prototype._inBoundsChecker = function(day_as_integer) {
      var day_as_string, test_date;
      day_as_string = ("0" + day_as_integer).slice(-2);
      test_date = "" + (this._view_model_.getYear()) + "-" + (this._view_model_.getMonth('MM')) + "-" + day_as_string;
      return this._bounds_.isContains(test_date);
    };

    /*
      Update Morph data, data re-render automatically
    */


    Days.prototype._updateData = function() {
      return this._morph_.html(this._renderContent());
    };

    /*
      This is our 'onclick' event, its simply
    */


    Days.prototype._handler = function(event) {
      var clicked_element;
      clicked_element = $(event.target).closest('li');
      if (clicked_element.hasClass('ui-state-disabled')) {
        return null;
      }
      try {
        this._view_model_.setDay(clicked_element.data('datepalette'));
      } catch (err) {
        $('<div></div>').html("" + err).dialog({
          title: 'Error message'
        });
      }
      return null;
    };

    return Days;

  })(MixinSupported);

}).call(this);
}, "view/epoch": function(exports, require, module) {
/*
This View module itself for epoch selector ([1930][1960][1980]) - this like
*/


(function() {
  var $, Bounds, Epoch, lib_path, template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  if (!this.Metamorph) {
    throw Error("sorry, resolve Methamorph dependency first!");
  }

  $ = jQuery;

  lib_path = typeof GLOBAL !== "undefined" && GLOBAL !== null ? '../' : '';

  /*
  В общем зачем нам это нужно здесь
  нам нужно найти первый элемент эпохального выбора и сделать его активеым
  фактически нам нужно будет делать риверсивный поиск,
  создавая новый диапазон (из опорных годов эпох) 
  и проверяя, не входит ли в него год начала границы
  Звучит жутковато, но в общем-то ничего страшного :)
  наверное :)
  */


  Bounds = require("" + lib_path + "model/bounds");

  template = require("" + lib_path + "template/epoch");

  module.exports = Epoch = (function() {

    function Epoch(_year_vm_, bounds_obj, _config_) {
      var bus_name, observer;
      this._year_vm_ = _year_vm_;
      this._config_ = _config_ != null ? _config_ : {};
      this._handler = __bind(this._handler, this);

      observer = this._year_vm_.getObserverObject();
      bus_name = this._year_vm_.getNotificationBusName();
      observer.subscribe(bus_name, this._updateData, this);
      this._bounds_ = bounds_obj.transformToBoundsFor('years');
      this._morph_ = Metamorph(this._renderContent());
    }

    /*
      To create root UL node and append to it Methamorph object
    */


    Epoch.prototype.createView = function() {
      return $('<div>').on("click", "li", this._handler).append(this._morph_.outerHTML());
    };

    /*
      Thats all, only one public method, sorry :)
    */


    /*
      Create content for Morph object
    */


    Epoch.prototype._renderContent = function() {
      return template({
        ranges: this._rangeConcentrator(this._year_vm_.getAvaibleEraPoints()),
        selected: this._year_vm_.getEraStart()
      });
    };

    /*
      Specific range builder
    */


    Epoch.prototype._rangeConcentrator = function(range) {
      var element, idx, _i, _len, _results;
      _results = [];
      for (idx = _i = 0, _len = range.length; _i < _len; idx = ++_i) {
        element = range[idx];
        if (range[idx + 1]) {
          _results.push({
            number: element,
            name: element,
            in_bounds: this._complexInBoundsChecker(element, range[idx + 1])
          });
        }
      }
      return _results;
    };

    Epoch.prototype._complexInBoundsChecker = function(current_element, next_element) {
      return this._inBoundsChecker(current_element) || this._reverseInBounceChecker("" + current_element + "-01-01", "" + next_element + "-01-01");
    };

    /*
      This method for fast check - is month in this year is in bounds or not
    */


    Epoch.prototype._inBoundsChecker = function(year_as_integer) {
      return this._bounds_.isContains(year_as_integer);
    };

    /*
      Reverse in bounce checker
    */


    Epoch.prototype._reverseInBounceChecker = function(start, end) {
      var test_bounds;
      test_bounds = new Bounds(start, end).transformToBoundsFor('years');
      return test_bounds.isContains(this._bounds_.getLower().format('YYYY'));
    };

    /*
      Update Morph data, data re-render automatically
    */


    Epoch.prototype._updateData = function() {
      return this._morph_.html(this._renderContent());
    };

    /*
      This is our 'onclick' event, its simply
    */


    Epoch.prototype._handler = function(event) {
      var clicked_element;
      clicked_element = $(event.target).closest('li');
      if (clicked_element.hasClass('ui-state-disabled')) {
        return null;
      }
      try {
        this._year_vm_.setEra(clicked_element.data('datepalette'));
      } catch (err) {
        $('<div></div>').html("" + err).dialog({
          title: 'Error message'
        });
      }
      return null;
    };

    return Epoch;

  })();

}).call(this);
}, "view/inline": function(exports, require, module) {
/*
This is Product itself - 
here we are take layout with pre-filled components and add it to page
*/


(function() {
  var $, Inline, lib_path;

  if (!this.Metamorph) {
    throw Error("sorry, resolve Methamorph dependency first!");
  }

  $ = jQuery;

  lib_path = typeof GLOBAL !== "undefined" && GLOBAL !== null ? '../' : '';

  module.exports = Inline = (function() {

    function Inline(_wibget_obj_, _caption_vm_, _config_) {
      var bus_name, observer;
      this._wibget_obj_ = _wibget_obj_;
      this._caption_vm_ = _caption_vm_;
      this._config_ = _config_ != null ? _config_ : {};
      this._uuid_ = this._wibget_obj_.getUUID();
      this._target_ = this._wibget_obj_.getTarget();
      this._user_data_changed_cb_ = this._wibget_obj_.getUserDataChangedCb();
      observer = this._caption_vm_.getObserverObject();
      bus_name = this._caption_vm_.getNotificationBusName();
      if (this._config_.target.fill_on_init) {
        this._user_data_changed_cb_.call(this);
      }
      observer.subscribe(bus_name, this._user_data_changed_cb_, this);
      this._wrapper_ = this._createWrapper(this._uuid_);
    }

    /*
      Wrapper for modal view
    */


    Inline.prototype._createWrapper = function(uuid) {
      return $('<div>');
    };

    /*
      This method inject all result to page, or target element
    */


    Inline.prototype.inject = function(layout) {
      this._wrapper_.append(layout).appendTo(this._target_);
      $(this._target_).addClass('hasDatePalette');
      return false;
    };

    /*
      Return formatted data as string
    */


    Inline.prototype.getResult = function(format) {
      if (format == null) {
        format = this._config_.target.format;
      }
      return this._caption_vm_.getCaption(format);
    };

    return Inline;

  })();

}).call(this);
}, "view/layout": function(exports, require, module) {
/*
This View for widget layout
*/


(function() {
  var $, Layout, lib_path, template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = jQuery;

  lib_path = typeof GLOBAL !== "undefined" && GLOBAL !== null ? '../' : '';

  template = require("" + lib_path + "template/layout");

  module.exports = Layout = (function() {

    function Layout() {
      this._handler = __bind(this._handler, this);

    }

    Layout.createView = function(uuid) {
      var element;
      element = template({
        mainDivId: uuid
      });
      return $(element).on("hover", "li", this.prototype._handler);
    };

    /*
      handler for hover
    */


    Layout.prototype._handler = function(event) {
      var target;
      target = $(event.target);
      switch (event.type) {
        case 'mouseenter':
          if (!target.hasClass("ui-state-disabled")) {
            return target.addClass("ui-state-hover");
          }
          break;
        case 'mouseleave':
          return target.removeClass("ui-state-hover");
      }
    };

    return Layout;

  })();

}).call(this);
}, "view/modal": function(exports, require, module) {
/*
This is Product itself - 
here we are take layout with pre-filled components and add it to page
*/


(function() {
  var $, Modal, lib_path;

  if (!this.Metamorph) {
    throw Error("sorry, resolve Methamorph dependency first!");
  }

  $ = jQuery;

  lib_path = typeof GLOBAL !== "undefined" && GLOBAL !== null ? '../' : '';

  module.exports = Modal = (function() {

    function Modal(_wibget_obj_, _caption_vm_, _config_) {
      var bus_name, observer;
      this._wibget_obj_ = _wibget_obj_;
      this._caption_vm_ = _caption_vm_;
      this._config_ = _config_ != null ? _config_ : {};
      this._uuid_ = this._wibget_obj_.getUUID();
      this._target_ = this._wibget_obj_.getTarget();
      this._user_data_changed_cb_ = this._wibget_obj_.getUserDataChangedCb();
      observer = this._caption_vm_.getObserverObject();
      bus_name = this._caption_vm_.getNotificationBusName();
      if (this._config_.target.fill_on_init) {
        this._user_data_changed_cb_.call(this);
      }
      observer.subscribe(bus_name, this._user_data_changed_cb_, this);
      this._wrapper_ = this._createWrapper(this._uuid_);
    }

    /*
      Wrapper for modal view
    */


    Modal.prototype._createWrapper = function(uuid) {
      return $('<div>', {
        id: "reveal-" + uuid,
        "class": 'reveal-modal'
      });
    };

    /*
      This method inject all result to page, or target element
    */


    Modal.prototype.inject = function(layout) {
      var _this = this;
      this._wrapper_.append(layout).appendTo('body');
      $(this._target_).on('click', function() {
        _this._wrapper_.reveal();
        return false;
      });
      $(this._target_).addClass('hasDatePalette');
      return false;
    };

    /*
      Return formatted data as string
    */


    Modal.prototype.getResult = function() {
      return this._caption_vm_.getCaption(this._config_.target.format);
    };

    return Modal;

  })();

}).call(this);
}, "view/months": function(exports, require, module) {
/*
This View module itself for months selector ([Jan][Feb][Mar]) - this like
*/


(function() {
  var $, GridableV, MixinSupported, Months, lib_path, template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (!this.Metamorph) {
    throw Error("sorry, resolve Methamorph dependency first!");
  }

  $ = jQuery;

  lib_path = typeof GLOBAL !== "undefined" && GLOBAL !== null ? '../' : '';

  MixinSupported = require("" + lib_path + "lib/mixin_supported");

  GridableV = require("" + lib_path + "mixin/gridable_v");

  template = require("" + lib_path + "template/leaf");

  module.exports = Months = (function(_super) {

    __extends(Months, _super);

    Months.include(GridableV);

    function Months(_view_model_, bounds_obj, _config_) {
      var bus_name, observer;
      this._view_model_ = _view_model_;
      this._config_ = _config_ != null ? _config_ : {};
      this._handler = __bind(this._handler, this);

      observer = this._view_model_.getObserverObject();
      bus_name = this._view_model_.getNotificationBusName();
      observer.subscribe(bus_name, this._updateData, this);
      this._bounds_ = bounds_obj.transformToBoundsFor('months');
      this._all_months_names_ = this._view_model_.getAllMonths(this._config_.format);
      this._morph_ = Metamorph(this._renderContent());
    }

    /*
      To create root UL node and append to it Methamorph object
    */


    Months.prototype.createView = function() {
      return $('<div>').on("click", "li", this._handler).append(this._morph_.outerHTML());
    };

    /*
      Thats all, only one public method, sorry :)
    */


    /*
      Create content for Morph object
    */


    Months.prototype._renderContent = function() {
      return template({
        range: this._compileSplittedRange(this._all_months_names_.slice(0), this._config_.row_length),
        selected: this._view_model_.getMonth()
      });
    };

    /*
      This method for fast check - is month in this year is in bounds or not
    */


    Months.prototype._inBoundsChecker = function(month_as_integer) {
      var month_as_string, test_date;
      month_as_string = ("0" + (month_as_integer + 1)).slice(-2);
      test_date = "" + (this._view_model_.getYear()) + "-" + month_as_string;
      return this._bounds_.isContains(test_date);
    };

    /*
      Update Morph data, data re-render automatically
    */


    Months.prototype._updateData = function() {
      return this._morph_.html(this._renderContent());
    };

    /*
      This is our 'onclick' event, its simply
    */


    Months.prototype._handler = function(event) {
      var clicked_element;
      clicked_element = $(event.target).closest('li');
      if (clicked_element.hasClass('ui-state-disabled')) {
        return null;
      }
      try {
        this._view_model_.setMonth(clicked_element.data('datepalette'));
      } catch (err) {
        $('<div></div>').html("" + err).dialog({
          title: 'Error message'
        });
      }
      return null;
    };

    return Months;

  })(MixinSupported);

}).call(this);
}, "view/years": function(exports, require, module) {
/*
This View module for years grid
*/


(function() {
  var $, GridableV, MixinSupported, Years, lib_path, template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (!this.Metamorph) {
    throw Error("sorry, resolve Methamorph dependency first!");
  }

  $ = jQuery;

  lib_path = typeof GLOBAL !== "undefined" && GLOBAL !== null ? '../' : '';

  MixinSupported = require("" + lib_path + "lib/mixin_supported");

  GridableV = require("" + lib_path + "mixin/gridable_v");

  template = require("" + lib_path + "template/leaf");

  module.exports = Years = (function(_super) {

    __extends(Years, _super);

    Years.include(GridableV);

    function Years(_year_vm_, bounds_obj, _config_) {
      var bus_name, observer;
      this._year_vm_ = _year_vm_;
      this._config_ = _config_ != null ? _config_ : {};
      this._handler = __bind(this._handler, this);

      observer = this._year_vm_.getObserverObject();
      bus_name = this._year_vm_.getNotificationBusName();
      observer.subscribe(bus_name, this._updateData, this);
      this._formatter_ = this._makeFormatter(this._config_.format);
      this._bounds_ = bounds_obj.transformToBoundsFor('years');
      this._morph_ = Metamorph(this._renderContent());
    }

    /*
      To create root UL node and append to it Methamorph object
    */


    Years.prototype.createView = function() {
      return $('<div>').on("click", "li", this._handler).append(this._morph_.outerHTML());
    };

    /*
      Thats all, only one public method, sorry :)
    */


    /*
      Create content for Morph object
    */


    Years.prototype._renderContent = function() {
      var compiled_ranges, era_begin, era_end, years_sequence, _ref;
      _ref = this._year_vm_.getEraRanges(), era_begin = _ref[0], era_end = _ref[1];
      years_sequence = this._buildSequence(era_begin, era_end - 1, this._formatter_);
      compiled_ranges = this._compileSplittedRange(years_sequence, this._config_.row_length);
      return template({
        range: this._intervalAmplifier(compiled_ranges, this._formatter_),
        selected: this._year_vm_.getYear()
      });
    };

    /*
      This method for fast check - is month in this year is in bounds or not
    */


    Years.prototype._inBoundsChecker = function(year_as_integer) {
      return this._bounds_.isContains(year_as_integer);
    };

    /*
      Formatter for years
    */


    Years.prototype._makeFormatter = function(format) {
      switch (format.toUpperCase()) {
        case "YY":
          return function(year) {
            return ("" + year).slice(-2);
          };
        case "YYYY":
          return function(year) {
            return "" + year;
          };
      }
    };

    /*
      Update Morph data, data re-render automatically
    */


    Years.prototype._updateData = function() {
      return this._morph_.html(this._renderContent());
    };

    /*
      This is our 'onclick' event, its simply
    */


    Years.prototype._handler = function(event) {
      var clicked_element;
      clicked_element = $(event.target).closest('li');
      if (clicked_element.hasClass('ui-state-disabled')) {
        return null;
      }
      try {
        this._year_vm_.setYear(clicked_element.data('datepalette'));
      } catch (err) {
        $('<div></div>').html("" + err).dialog({
          title: 'Error message'
        });
      }
      return null;
    };

    return Years;

  })(MixinSupported);

}).call(this);
}, "viewmodel/caption": function(exports, require, module) {
/*
This is Caption viewmodel class - response on print data as text

что должен делать этот класс - 
  отдавать установленную дату в любом формате
  отдавать текущую дату в любом формате


доп. условия и упрощения -
  пока это пассивный класс, установка даты из него невозможна
*/


(function() {
  var Caption, FlattingableVM, FormattableVM, MixinSupported, Observable, SubscribleVM, lib_path, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = (_ref = this._) != null ? _ref : require('underscore');

  lib_path = typeof GLOBAL !== "undefined" && GLOBAL !== null ? '../' : '';

  MixinSupported = require("" + lib_path + "lib/mixin_supported");

  Observable = require("" + lib_path + "mixin/observable");

  SubscribleVM = require("" + lib_path + "mixin/subscrible_vm");

  FlattingableVM = require("" + lib_path + "mixin/flattingable_vm");

  FormattableVM = require("" + lib_path + "mixin/formattable_vm");

  Caption = (function(_super) {

    __extends(Caption, _super);

    Caption.include(Observable);

    Caption.include(SubscribleVM);

    Caption.include(FlattingableVM);

    Caption.include(FormattableVM);

    function Caption(_time_point_, _config_) {
      this._time_point_ = _time_point_;
      this._config_ = _config_ != null ? _config_ : {};
      this._observer_ = this._time_point_.getObserverObject();
      this._in_bus_name = this._time_point_.getNotificationBusName();
      this._who_i_am_ = 'CAPTION';
      this._out_bus_name_ = "" + this._who_i_am_ + ".DATE_CHANGED";
      this._error_bus_name_ = "" + this._who_i_am_ + ".ERROR";
      this._full_date_ = null;
      this._setupFullDate();
      this._subscribeToChanges();
    }

    return Caption;

  })(MixinSupported);

  module.exports = Caption;

}).call(this);
}, "viewmodel/day": function(exports, require, module) {
/*
This is Day viewmodel class - response on day

что должен делать этот класс - 
  отдавать текущую дату
  установливать новую дату
  ограничивать выход за пределы списка(позднее)
  отдавать кол-во дней в текущем месяце 
  (да, может показаться, что этот функционал должен быть в месяце, но это позднее - подумаем)

доп. условия и упрощения -
*/


(function() {
  var Day, FlattingableVM, FormattableVM, MixinSupported, Observable, SubscribleVM, lib_path, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = (_ref = this._) != null ? _ref : require('underscore');

  lib_path = typeof GLOBAL !== "undefined" && GLOBAL !== null ? '../' : '';

  MixinSupported = require("" + lib_path + "lib/mixin_supported");

  Observable = require("" + lib_path + "mixin/observable");

  SubscribleVM = require("" + lib_path + "mixin/subscrible_vm");

  FlattingableVM = require("" + lib_path + "mixin/flattingable_vm");

  FormattableVM = require("" + lib_path + "mixin/formattable_vm");

  Day = (function(_super) {

    __extends(Day, _super);

    Day.include(Observable);

    Day.include(SubscribleVM);

    Day.include(FlattingableVM);

    Day.include(FormattableVM);

    function Day(_time_point_, _config_) {
      this._time_point_ = _time_point_;
      this._config_ = _config_ != null ? _config_ : {};
      this._observer_ = this._time_point_.getObserverObject();
      this._in_bus_name = this._time_point_.getNotificationBusName();
      this._who_i_am_ = 'DAY';
      this._out_bus_name_ = "" + this._who_i_am_ + ".DATE_CHANGED";
      this._error_bus_name_ = "" + this._who_i_am_ + ".ERROR";
      this._full_date_ = null;
      this._setupFullDate();
      this._subscribeToChanges();
    }

    /*
      Day setter, actually its just call TimePoint with new day and wait
    */


    Day.prototype.setDay = function(new_day) {
      if (_.isString(new_day)) {
        new_day = this._stringToNumberDayConverter(new_day);
      }
      if (new_day === this.getDay()) {
        return this;
      }
      this._setDayToTimePoint(new_day);
      return this;
    };

    /*
      Converter for any string represemtation
    */


    Day.prototype._stringToNumberDayConverter = function(day_as_string) {
      var parsed_int;
      if ((parsed_int = parseInt(day_as_string, 10))) {
        return parsed_int;
      } else {
        throw this._errorInvalidDay(day_as_string);
      }
    };

    /*
      This method just call TimePoint and go forward
    */


    Day.prototype._setDayToTimePoint = function(new_day) {
      var new_time_point;
      new_time_point = this._changeDayInTimePoint(new_day);
      this._time_point_.setDate(this._who_i_am_, new_time_point);
      return null;
    };

    /*
      Its date changer
      this operation is safe, getDate() return clone and NOT interract with real time poin value
    */


    Day.prototype._changeDayInTimePoint = function(day) {
      return this._time_point_.getDate().date(day);
    };

    /*
      One error text for some cases
    */


    Day.prototype._errorInvalidDay = function(day) {
      return Error("|" + this._who_i_am_ + "| - day is invalid |" + day + "|");
    };

    return Day;

  })(MixinSupported);

  module.exports = Day;

}).call(this);
}, "viewmodel/month": function(exports, require, module) {
/*
This is Month viewmodel class - response on month

что должен делать этот класс - 
  отдавать текущий месяц (как номер или как строку)
  устанавливать новый месяц
  ограничивать выход за пределы списка (позднее)
*/


(function() {
  var FlattingableVM, FormattableVM, MixinSupported, Month, Observable, Overflowproof, SubscribleVM, lib_path, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = (_ref = this._) != null ? _ref : require('underscore');

  lib_path = typeof GLOBAL !== "undefined" && GLOBAL !== null ? '../' : '';

  MixinSupported = require("" + lib_path + "lib/mixin_supported");

  Overflowproof = require("" + lib_path + "mixin/overflowproof");

  Observable = require("" + lib_path + "mixin/observable");

  SubscribleVM = require("" + lib_path + "mixin/subscrible_vm");

  FlattingableVM = require("" + lib_path + "mixin/flattingable_vm");

  FormattableVM = require("" + lib_path + "mixin/formattable_vm");

  Month = (function(_super) {

    __extends(Month, _super);

    Month.include(Overflowproof);

    Month.include(Observable);

    Month.include(SubscribleVM);

    Month.include(FlattingableVM);

    Month.include(FormattableVM);

    function Month(_time_point_, _config_) {
      this._time_point_ = _time_point_;
      this._config_ = _config_ != null ? _config_ : {};
      this._observer_ = this._time_point_.getObserverObject();
      this._in_bus_name = this._time_point_.getNotificationBusName();
      this._who_i_am_ = 'MONTH';
      this._out_bus_name_ = "" + this._who_i_am_ + ".DATE_CHANGED";
      this._error_bus_name_ = "" + this._who_i_am_ + ".ERROR";
      this._month_idx_ = {
        first: 0,
        last: 11
      };
      /*
          При работе с месяцем в общем-то не обязательно работать с годом
          но придется, если мы хотим иметь возможность использовать границы
          не только на периоде год, но и учитывая месяца
          возможно стоит использовтаь объект года, не наследусь, конечно же, от него
          возможно мы и без него обойдемся
          не-нет, стоп, это может быть будет делать вью, а тут нам нужно только месяц отдать
      */

      this._full_date_ = null;
      this._setupFullDate();
      this._subscribeToChanges();
    }

    /*
      This method return number of days in month
      if called void - work with self month
        or try to work with month from arg
    */


    Month.prototype.getDaysInMonth = function(new_month) {
      var new_time_point;
      if (!new_month) {
        return this._full_date_.daysInMonth();
      }
      if (_.isString(new_month)) {
        new_month = this._stringToNumberMonthConverter(new_month);
      }
      new_time_point = this._changeMonthInTimePoint(new_month);
      return new_time_point.daysInMonth();
    };

    /*
      This method create month name from month number
    */


    Month.prototype.getMonthName = function(month, format) {
      if (!((month != null) && format)) {
        throw Error("|Month.getMonthName| MUST be called with month AND format but got\nmonth   = |" + month + "|\nformat  = |" + format + "|");
      }
      return this.getDateAsPlainObj(format, this._changeMonthInTimePoint(month));
    };

    /*
      This method will return array of object with all months in selected format
    */


    Month.prototype.getAllMonths = function(format) {
      var month_pos, _i, _ref1, _ref2, _results;
      if (!format) {
        throw Error("|Month.getAllMonths| MUST be called with format but got\nformat  = |" + format + "|");
      }
      _results = [];
      for (month_pos = _i = _ref1 = this._month_idx_.first, _ref2 = this._month_idx_.last; _ref1 <= _ref2 ? _i <= _ref2 : _i >= _ref2; month_pos = _ref1 <= _ref2 ? ++_i : --_i) {
        _results.push({
          number: month_pos,
          name: this.getMonthName(month_pos, format)
        });
      }
      return _results;
    };

    /*
      Year setter, actually its just call TimePoint with new month and wait
    */


    Month.prototype.setMonth = function(new_month) {
      if (_.isString(new_month)) {
        new_month = this._stringToNumberMonthConverter(new_month);
      }
      if (new_month === this.getMonth()) {
        return this;
      }
      this._setMonthToTimePoint(new_month);
      return this;
    };

    /*
      This method just call TimePoint and go forward
    */


    Month.prototype._setMonthToTimePoint = function(new_month) {
      var new_time_point;
      new_time_point = this._changeMonthInTimePoint(new_month);
      this._time_point_.setDate(this._who_i_am_, new_time_point);
      return null;
    };

    /*
      Its month changer
      this operation is safe, getDate() return clone and NOT interract with real time poin value
    */


    Month.prototype._changeMonthInTimePoint = function(month) {
      if (!this._isMonthNumberValid(month)) {
        throw this._errorInvalidMonth(month);
      }
      return this._overflowCorrector(this._time_point_.getDate().month(month), month);
    };

    /*
      Simply month nomber checker
    */


    Month.prototype._isMonthNumberValid = function(tested_month) {
      return (this._month_idx_.last >= tested_month && tested_month >= this._month_idx_.first);
    };

    /*
      Converter for string month setting
    */


    Month.prototype._nameToNumberMonthConverter = function(month_as_string) {
      var new_moment, re;
      new_moment = this._time_point_.buildNewMoment(month_as_string, "MMMM");
      if (!new_moment.isValid()) {
        throw this._errorInvalidMonth(month_as_string);
      }
      re = new RegExp("\\|" + month_as_string + "\\|", "i");
      if (!re.test(new_moment.format("|MMM|MMMM|"))) {
        throw this._errorInvalidMonth(month_as_string);
      }
      return new_moment.month();
    };

    /*
      Converter for any string represemtation
    */


    Month.prototype._stringToNumberMonthConverter = function(month_as_string) {
      var parsed_int;
      if ((parsed_int = parseInt(month_as_string, 10))) {
        return parsed_int;
      } else {
        return this._nameToNumberMonthConverter(month_as_string);
      }
    };

    /*
      One error text for some cases
    */


    Month.prototype._errorInvalidMonth = function(month) {
      return Error("|" + this._who_i_am_ + "| - month is invalid |" + month + "|");
    };

    return Month;

  })(MixinSupported);

  module.exports = Month;

}).call(this);
}, "viewmodel/year": function(exports, require, module) {
/*
This is Year viewmodel class - response on years AND years periods ([1930][1960][1980])

что должен делать этот класс - 
  отдавать список годов
  отдавать текущий год, из списка
  ограничивать выход за пределы списка
  устанавливать новый год
*/


(function() {
  var FlattingableVM, FormattableVM, MixinSupported, Observable, Overflowproof, SubscribleVM, Year, lib_path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  lib_path = typeof GLOBAL !== "undefined" && GLOBAL !== null ? '../' : '';

  MixinSupported = require("" + lib_path + "lib/mixin_supported");

  Overflowproof = require("" + lib_path + "mixin/overflowproof");

  Observable = require("" + lib_path + "mixin/observable");

  SubscribleVM = require("" + lib_path + "mixin/subscrible_vm");

  FlattingableVM = require("" + lib_path + "mixin/flattingable_vm");

  FormattableVM = require("" + lib_path + "mixin/formattable_vm");

  Year = (function(_super) {

    __extends(Year, _super);

    Year.include(Overflowproof);

    Year.include(Observable);

    Year.include(SubscribleVM);

    Year.include(FlattingableVM);

    Year.include(FormattableVM);

    function Year(_time_point_, _config_) {
      this._time_point_ = _time_point_;
      this._config_ = _config_ != null ? _config_ : {};
      this._observer_ = this._time_point_.getObserverObject();
      this._in_bus_name = this._time_point_.getNotificationBusName();
      this._who_i_am_ = 'YEAR';
      this._out_bus_name_ = "" + this._who_i_am_ + ".DATE_CHANGED";
      this._error_bus_name_ = "" + this._who_i_am_ + ".ERROR";
      this._years_range_ = this._config_.range;
      this._full_date_ = null;
      this._setupFullDate();
      this._subscribeToChanges();
    }

    /*
      Year setter, actually its just call TimePoint with new year and wait
    */


    Year.prototype.setYear = function(new_year) {
      if (new_year === this.getYear()) {
        return this;
      }
      this._setYearToTimePoint(new_year);
      return this;
    };

    /*
      Era setter, make smooth changes in year 
      ie if we are have ranges [1960, 1980, 2000, 2020]
      and have year 2012 and era 2000 
      and change era to 1980 we are get 1992 year
      1980 + (2012 - 2000) = 1992
    */


    Year.prototype.setEra = function(new_era) {
      var current_era, new_era_ranges, new_year, plausible_era_ranges, plausible_year;
      current_era = this.getEraStart();
      if (new_era === current_era) {
        return this;
      }
      plausible_year = new_era + this.getYear() - current_era;
      plausible_era_ranges = this._buildEraRange(plausible_year);
      new_year = new_era === plausible_era_ranges[0] ? plausible_year : (new_era_ranges = this._buildEraRange(new_era), new_era_ranges[1] - 1);
      return this.setYear(new_year);
    };

    /*
      This method show years range for view, eith all elements
    */


    Year.prototype.getAvaibleEraPoints = function() {
      return this._years_range_.slice(0);
    };

    /*
      Era getter
    */


    Year.prototype.getEraStart = function() {
      return this.getEraRanges()[0];
    };

    /*
      Era ranges (start year - end year)
    */


    Year.prototype.getEraRanges = function() {
      return this._buildEraRange(this.getYear());
    };

    /*
      This method just call TimePoint and go forward
    */


    Year.prototype._setYearToTimePoint = function(new_year) {
      var new_time_point;
      new_time_point = this._changeYearInTimePoint(new_year);
      this._buildEraRange(new_time_point.year());
      this._time_point_.setDate(this._who_i_am_, new_time_point);
      return null;
    };

    /*
      Internal method to find out where TimePoint date in era list
    */


    Year.prototype._buildEraRange = function(year) {
      var era_range;
      if (!(era_range = this._findYearPlaceInYearsRange(year, this._years_range_))) {
        throw Error("|" + this._who_i_am_ + "| - year out of ranges |" + year + "|");
      }
      return era_range;
    };

    Year.prototype._changeYearInTimePoint = function(year) {
      var month, time_obj;
      time_obj = this._time_point_.getDate();
      month = time_obj.month();
      return this._overflowCorrector(time_obj.year(year), month);
    };

    /*
      Find year place in year list
    */


    Year.prototype._findYearPlaceInYearsRange = function(year, year_list) {
      var last, prev, years_list_copy;
      years_list_copy = year_list.slice(0);
      while ((last = years_list_copy.pop()) && (prev = years_list_copy[years_list_copy.length - 1])) {
        if ((last > year && year >= prev)) {
          return [prev, last];
        }
      }
    };

    return Year;

  })(MixinSupported);

  module.exports = Year;

}).call(this);
}, "dendrite": function(exports, require, module) {(function() {
  var Dendrite, _, _ref,
    __slice = [].slice;

  _ = (_ref = this._) != null ? _ref : require('underscore');

  /*
  **dendrite** - An extended Observer pattern implementation, worked at any JavaScript environment.
  
  @version v0.5.5
  @author Dmitrii Karpich  
  @copyright Dmitrii Karpich (c) 2012 under MIT Licence  
  **GitHub repository** [dendrite](https://github.com/Meettya/dendrite)
  
  Thanks to [Joe Zim](http://www.joezimjs.com) for original [Publish/Subscribe plugin](http://www.joezimjs.com/projects/publish-subscribe-jquery-plugin/) for jQuery
  */


  module.exports = Dendrite = (function() {
    var DEBUG, ERROR, SILENT, WARNING;

    DEBUG = 3;

    WARNING = 2;

    ERROR = 1;

    SILENT = 0;

    /*
      Construct a new Dendrite.
      
      @example
        dendrite_obj = new Dendrite verbose : 'warning'
      
      @overload constructor()
        Construct new Dendrite with default options
      
      @overload constructor(options)
        Constrict new Dendrite with settings
        @param [Object] options
        @option options [String] verbose verbose level, may be [ 'debug' | 'warning' | 'error' | 'silent' ]
    */


    function Dendrite(options) {
      if (options == null) {
        options = {};
      }
      this._subscriptions_ = {};
      this._publishing_counter_ = 0;
      this._unsubscribe_queue_ = [];
      this._tasks_counter_ = 0;
      this._tasks_dictionary_ = {};
      this._observer_verbose_level_ = this._parseVerboseLevel(options != null ? options.verbose : void 0);
    }

    /*
      Subscribe to topic(s).
      
      @note The 'callback' function receives 'topic' [String] as first argument and 'data' [Any] as any data that the publisher sent
      
      @example
        handler = dendrite_obj.subscribe 'foo', (topic, data...) -> console.log data, topic
      
      @overload subscribe(topics, callback)
        Subscribe to topic(s) without context
        @param topics [String] 1 or more topic names, separated by a space, to subscribe to
        @param callback [Function] function to be called when the given topic(s) is published to
        @return [Object]
      
      @overload subscribe(topics, callback, context)
        Subscribe to topic(s) with context
        @param topics [String] 1 or more topic names, separated by a space, to subscribe to
        @param callback [Function] function to be called when the given topic(s) is published to
        @param context [Object] an object to call the function on
        @return [Object]
      
      @return [Object] handler { topics: topics, callback: callback, watchdog: undefined, context: context } or throw exception on invalid arguments
    */


    Dendrite.prototype.subscribe = function(topics, callback, context) {
      if (context == null) {
        context = {};
      }
      return this.subscribeGuarded(topics, callback, void 0, context);
    };

    /*
      Subscribe to topic(s) with 'watchdog' function to handle errors here, in subscriber.
      
      @note The 'callback' function receives 'topic' [String] as first argument and 'data' [Any] as any data that the publisher sent
      
      @note The 'watchdog' function receives two arguments: 'err' [Error] and 'options' [Object] as all 'callback' properties
      
      @example
        context_object = 
          name : 'Context Object'
          callback : (topic, data) -> throw Error "Die at #{topic}"
          watchdog : (err, options) -> 
            console.log "Error in | #{@name} |"
            console.log "Error string: | #{err} |"
            console.log "Error detail", options
            null  
        
        handler = dendrite_obj.subscribeGuarded 'foo', context_object.callback, context_object.watchdog, context_object
      
      @overload subscribeGuarded(topics, callback, watchdog)
        Subscribe with 'watchdog' without context
        @param topics [String] 1 or more topic names, separated by a space, to subscribe to
        @param callback [Function] function to be called when the given topic(s) is published to
        @param watchdog [Function] function to be called when callback under publishing topic rise exception
        @return [Object]
      
      @overload subscribeGuarded(topics, callback, watchdog, context)
        Subscribe with 'watchdog' with context
        @param topics [String] 1 or more topic names, separated by a space, to subscribe to
        @param callback [Function] function to be called when the given topic(s) is published to
        @param watchdog [Function] function to be called when callback under publishing topic rise exception
        @param context [Object] an object to call the function on
        @return [Object]
      
      @see #subscribe
      @return [Object] handler { topics: topics, callback: callback, watchdog: watchdog, context: context } or throw exception on invalid arguments
    */


    Dendrite.prototype.subscribeGuarded = function(topics, callback, watchdog, context) {
      var task_number, topic, _base, _i, _len, _ref1;
      if (context == null) {
        context = {};
      }
      if (!(_.isString(topics) || _.isFunction(callback) || (!(watchdog != null) || _.isFunction(watchdog)))) {
        throw this._subscribeErrorMessage(topics, callback, watchdog, context);
      }
      task_number = this._getNextTaskNumber();
      this._tasks_dictionary_[task_number] = [callback, context, watchdog];
      _ref1 = this._topicsToArraySplitter(topics);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        topic = _ref1[_i];
        (_base = this._subscriptions_)[topic] || (_base[topic] = []);
        this._subscriptions_[topic].push(task_number);
      }
      return {
        topics: topics,
        callback: callback,
        watchdog: watchdog,
        context: context
      };
    };

    /*
      Unsubscribe from topic(s) or remove all subscribers from topic(s).
      
      @note Unsubscriptions may be placed to queue if Dendrite do some publish tasks  
        and restarted to unsubscribe when all publish tasks is done.
      
      @example
        # unsubscribe 'obj' from topics 'foo bar'
        dendrite_obj.unsubscribe 'foo bar', callback_reference, obj
        # remove all subscribers from topics 'bar baz'
        dendrite_obj.unsubscribe 'bar baz'
      
      @overload unsubscribe(topics)
        Remove **all** subscriptions from topic(s) 
        @param topics [String] 1 or more topic names, separated by a space, to unsubscribe from
        @return [Object]
      
      @overload unsubscribe(topics, callback)
        Remove subscriptions for callback from topic(s) if no context used in the #subscribe() call
        @param topics [String] 1 or more topic names, separated by a space, to unsubscribe from
        @param callback [Function] function to be removed from the topics subscription list
        @return [Object]
      
      @overload unsubscribe(topics, callback, context)
        Remove subscriptions for callback and given context object from topic(s) 
        @param topics [String] 1 or more topic names, separated by a space, to unsubscribe from
        @param callback [Function] function to be removed from the topics subscription list
        @param context [Object] object that was used as the context in the #subscribe() call
        @return [Object]
      
      @overload unsubscribe(handler)
        Remove subscriptions with *handler* object. May be usefully if subscription created with anonymous 'callback' 
        @param [Object] handler subscription handler, returned by #subscribeX() method
        @option handler [String] topics 1 or more topic names, separated by a space, to unsubscribe from
        @option handler [Function] callback function to be removed from the topics subscription list
        @option handler [Object] context object that was used as the context in the #subscribe() call
        @return [Object]
      
      @return [Object]  *this* for chaining
    */


    Dendrite.prototype.unsubscribe = function(topics, callback, context) {
      var idx, task, task_number, topic, _i, _j, _len, _len1, _ref1, _ref2, _ref3;
      if (topics.topics) {
        _ref1 = this._handlerParser(topics, callback, context), topics = _ref1[0], callback = _ref1[1], context = _ref1[2];
      }
      context || (context = {});
      if (!_.isString(topics)) {
        throw this._unsubscribeErrorMessage(topics, callback, context);
      }
      if (this._isPublishing()) {
        this._unsubscribe_queue_.push([topics, callback, context]);
        return this;
      }
      /*
          IMPORTANT! Yes, we are remove subscriptions ONLY, 
          and keep tasks_dictionary untouched because its not necessary.
          Dictionary compacted, calculations of links to dictionary from subscriptions
          may be nightmare - its like pointers in C, exceptionally funny in async mode. 
          So, who get f*ck about this? Not me!!!
      */

      _ref2 = this._topicsToArraySplitter(topics);
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        topic = _ref2[_i];
        if (_.isFunction(callback)) {
          _ref3 = this._subscriptions_[topic];
          for (idx = _j = 0, _len1 = _ref3.length; _j < _len1; idx = ++_j) {
            task_number = _ref3[idx];
            if (task = this._tasks_dictionary_[task_number]) {
              if (_.isEqual([task[0], task[1]], [callback, context])) {
                this._subscriptions_[topic].splice(idx, 1);
              }
            }
          }
        } else {
          delete this._subscriptions_[topic];
        }
      }
      return this;
    };

    /*
      Synchronously publish any data to topic(s).
      
      @example
        dendrite_obj.publish 'foo bar', 'This is some data'
      
      @overload publish(topics)
        Do publish to topics without any data
        @param topics [String] 1 or more topic names, separated by a space, to publish to
        @return [Object]
      
      @overload publish(topics, data...)
        Do publish with some data to topics
        @param topics [String] 1 or more topic names, separated by a space, to publish to
        @param data [Any] any kind of data(s) you wish to give to the subscribers
        @return [Object]
      
      @return [Object] *this* for chaining
    */


    Dendrite.prototype.publish = function() {
      var data, topics;
      topics = arguments[0], data = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      this._publisher('sync', topics, data);
      return this;
    };

    /*
      Alias for {#publish}
      @return [Object] *this* for chaining
    */


    Dendrite.prototype.publishSync = function() {
      var data, topics;
      topics = arguments[0], data = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      this._publisher('sync', topics, data);
      return this;
    };

    /*
      Asynchronously publish any data to topic(s).
      
      @note Used exactly as {#publish}, but this method puts task to queue and will returns immediately 
      
      @example
        dendrite_obj.publishAsync 'foo bar', 'This is some data'
      
      See {#publish} for all info
      @return [Object] *this* for chaining
    */


    Dendrite.prototype.publishAsync = function() {
      var data, topics;
      topics = arguments[0], data = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      this._publisher('async', topics, data);
      return this;
    };

    /*
      !!!! Internal methods from now !!!!
    */


    /*
      Self-incapsulate @_publishing_counter_ properties to internal methods
      @private
      @return [Boolean] true if Dendrite is publishing, false is idle
    */


    Dendrite.prototype._isPublishing = function() {
      return !!this._publishing_counter_;
    };

    /*
      Self-incapsulate @_publishing_counter_ properties to internal methods
      @private
    */


    Dendrite.prototype._publishingInc = function() {
      this._publishing_counter_ += 1;
      return null;
    };

    /*
      Self-incapsulate @_publishing_counter_ properties to internal methods
      @private
    */


    Dendrite.prototype._publishingDec = function() {
      if (!this._isPublishing) {
        throw Error("Error on decrement publishing counter\n  @_publishing_counter_ is |" + this._publishing_counter_ + "|");
      }
      this._publishing_counter_ -= 1;
      return null;
    };

    /*
      Self-incapsulated task auto-incremented counter
      @private
      @return [Integer] unique task number
    */


    Dendrite.prototype._getNextTaskNumber = function() {
      return this._tasks_counter_ += 1;
    };

    /*
      Verbose level args parser
      @private
      @param level [String] verbose level name
      @return [Integer] verbose level
    */


    Dendrite.prototype._parseVerboseLevel = function(level) {
      if (level == null) {
        return ERROR;
      }
      if (!_.isString(level)) {
        throw this._parseVerboseLevelError(level);
      }
      switch (level.toUpperCase()) {
        case "DEBUG":
          return DEBUG;
        case "SILENT":
          return SILENT;
        case "ERROR":
          return ERROR;
        case "WARNING":
          return WARNING;
        default:
          throw Error("unknown verbose level |" + level + "|");
      }
    };

    /*
      Internal method for different events types definitions
      @private
      @param type [String] engine type name
      @return [Array<publish, unsubscribe>] engine or throw exception on invalid arguments
    */


    Dendrite.prototype._publisherEngine = function(type) {
      var engine_dictionary, selected_engine, self;
      self = this;
      engine_dictionary = {
        sync: {
          publish: self._publishFiring,
          unsubscribe: self._unsubscribeResume
        },
        async: {
          publish: function(topic, task, data) {
            return setTimeout((function() {
              return self._publishFiring(topic, task, data);
            }), 0);
          },
          unsubscribe: function() {
            return setTimeout((function() {
              return self._unsubscribeResume();
            }), 0);
          }
        }
      };
      selected_engine = engine_dictionary[type];
      if (selected_engine == null) {
        throw TypeError("Error undefined publisher engine type |" + type + "|");
      }
      return [selected_engine.publish, selected_engine.unsubscribe];
    };

    /*
      Publisher itself
      @private
      @param type [String] engine type name
      @param topics [String] topic names
      @param data [Array] any kind of data(s)
    */


    Dendrite.prototype._publisher = function(type, topics, data) {
      var task_number, topic, _i, _j, _len, _len1, _publish, _ref1, _ref2, _ref3, _unsubscribe;
      if (!_.isString(topics)) {
        throw this._publishErrorMessage(topics, data);
      }
      _ref1 = this._publisherEngine(type), _publish = _ref1[0], _unsubscribe = _ref1[1];
      _ref2 = this._topicsToArraySplitter(topics, false);
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        topic = _ref2[_i];
        if (this._subscriptions_[topic]) {
          _ref3 = this._subscriptions_[topic];
          for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
            task_number = _ref3[_j];
            this._publishingInc();
            _publish.call(this, topic, this._tasks_dictionary_[task_number], data);
          }
        }
      }
      _unsubscribe.call(this);
      return null;
    };

    /*
      Internal method for splitting topics string to array.
      @note May skip duplicate (it used for un/subscription )
      @private
      @param topics [String] topic names
      @param skip_duplicate [Boolean] *optional* is it needed to skip duplicate?
      @return [Array<topics>] individual topics
    */


    Dendrite.prototype._topicsToArraySplitter = function(topics, skip_duplicate) {
      var topic, used_topics, _i, _len, _ref1, _results;
      if (skip_duplicate == null) {
        skip_duplicate = true;
      }
      used_topics = {};
      _ref1 = topics.split(' ');
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        topic = _ref1[_i];
        if (!(topic !== '')) {
          continue;
        }
        if (skip_duplicate && used_topics[topic]) {
          continue;
        }
        used_topics[topic] = true;
        _results.push(topic);
      }
      return _results;
    };

    /*
      Internal method for handler parser
      @private
      @param handler [Object] handler
      @param callback [Function] *optional*
      @param context [Object] *optional*
      @return [Array<topics, callback, context>] parsed handler
    */


    Dendrite.prototype._handlerParser = function(handler, callback, context) {
      var topics;
      callback || (callback = handler.callback);
      context || (context = handler.context);
      topics = handler.topics;
      return [topics, callback, context];
    };

    /*
      Internal method for unsubscribe continue
      @private
    */


    Dendrite.prototype._unsubscribeResume = function() {
      var task, _base;
      if (!this._unsubscribe_queue_.length) {
        return;
      }
      if (this._isPublishing()) {
        if (this._observer_verbose_level_ >= DEBUG) {
          if (typeof console !== "undefined" && console !== null) {
            console.log('still publishing');
          }
        }
        return;
      }
      while (task = typeof (_base = this._unsubscribe_queue_).shift === "function" ? _base.shift() : void 0) {
        if (this._observer_verbose_level_ >= DEBUG) {
          if (typeof console !== "undefined" && console !== null) {
            console.log("retry unsubscribe " + task);
          }
        }
        this.unsubscribe.apply(this, task);
      }
      return null;
    };

    /*
      Internal method for publish firing
      @private
    */


    Dendrite.prototype._publishFiring = function(topic, task, data) {
      var _ref1;
      try {
        task[0].apply(task[1], [topic].concat(data));
      } catch (err) {
        if ((_ref1 = task[2]) != null) {
          _ref1.call(task[1], err, {
            topic: topic,
            callback: task[0],
            object: task[1],
            data: data
          });
        }
        if (this._observer_verbose_level_ >= ERROR) {
          if (typeof console !== "undefined" && console !== null) {
            console.error("Error on call callback we got exception:\n  topic     = |" + topic + "|\n  callback  = |" + task[0] + "|\n  watchdog  = |" + task[2] + "|\n  object    = |" + task[1] + "|\n  data      = |" + (data != null ? data.join(', ') : void 0) + "|\n  error     = |" + err + "|");
          }
        }
      } finally {
        this._publishingDec();
      }
      return null;
    };

    /*
      Internal method for publish error message constructor
      @private
      @return [Object] Error
    */


    Dendrite.prototype._publishErrorMessage = function(topics, data) {
      return new TypeError("Error on call |publish| used non-string topics:\n  topics  = |" + topics + "|\n  data    = |" + (data != null ? data.join(', ') : void 0) + "|");
    };

    /*
      Internal method for unsubscribe error message constructor
      @private
      @return [Object] Error
    */


    Dendrite.prototype._unsubscribeErrorMessage = function(topics, callback, context) {
      return new TypeError("Error on call |unsubscribe| used non-string topics:\n  topics    = |" + topics + "|\n  callback  = |" + callback + "|\n  context   = |" + context + "|");
    };

    /*  
    Internal method for subscribe error message constructor
    @private
    @return [Object] Error
    */


    Dendrite.prototype._subscribeErrorMessage = function(topics, callback, watchdog, context) {
      return new TypeError("Error! on call |subscribe| used non-string topics OR/AND callback isn`t function OR/AND watchdog defined but isn`t function:\n  topics    = |" + topics + "|\n  callback  = |" + callback + "|\n  watchdog  = |" + watchdog + "|\n  context   = |" + context + "|");
    };

    /*
      Internal method for error message from verbose level parser
      @private
      @return [Object] Error
    */


    Dendrite.prototype._parseVerboseLevelError = function(level) {
      return new TypeError("Error on parsing verbose level - not a String |" + level + "|");
    };

    return Dendrite;

  })();

}).call(this);
}, "whet.extend": function(exports, require, module) {
/*
 * whet.extend v0.9.7
 * Standalone port of jQuery.extend that actually works on node.js
 * https://github.com/Meettya/whet.extend
 *
 * Copyright 2012, Dmitrii Karpich
 * Released under the MIT License
*/


(function() {
  var extend, _findValue, _isClass, _isOwnProp, _isPlainObj, _isPrimitiveType, _isTypeOf, _prepareClone,
    __slice = [].slice;

  module.exports = extend = function() {
    var args, copy, deep, name, options, target, _i, _len, _ref;
    deep = arguments[0], target = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    if (!_isClass(deep, 'Boolean')) {
      args.unshift(target);
      _ref = [deep || {}, false], target = _ref[0], deep = _ref[1];
    }
    if (_isPrimitiveType(target)) {
      target = {};
    }
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      options = args[_i];
      if (options != null) {
        for (name in options) {
          copy = options[name];
          if ((copy != null) && target[name] !== copy) {
            target[name] = _findValue(deep, copy, target[name]);
          }
        }
      }
    }
    return target;
  };

  /*
  Internal methods from now
  */


  _isClass = function(obj, str) {
    return ("[object " + str + "]") === Object.prototype.toString.call(obj);
  };

  _isOwnProp = function(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };

  _isTypeOf = function(obj, str) {
    return str === typeof obj;
  };

  _isPlainObj = function(obj) {
    var key;
    if (!obj) {
      return false;
    }
    if (obj.nodeType || obj.setInterval || !_isClass(obj, 'Object')) {
      return false;
    }
    if (obj.constructor && !_isOwnProp(obj, 'constructor') && !_isOwnProp(obj.constructor.prototype, 'isPrototypeOf')) {
      return false;
    }
    for (key in obj) {
      key;

    }
    return key === void 0 || _isOwnProp(obj, key);
  };

  _isPrimitiveType = function(obj) {
    return !(_isTypeOf(obj, 'object') || _isTypeOf(obj, 'function'));
  };

  _prepareClone = function(copy, src) {
    if (_isClass(copy, 'Array')) {
      if (_isClass(src, 'Array')) {
        return src;
      } else {
        return [];
      }
    } else {
      if (_isPlainObj(src)) {
        return src;
      } else {
        return {};
      }
    }
  };

  _findValue = function(deep, copy, src) {
    var clone;
    if (deep && (_isClass(copy, 'Array') || _isPlainObj(copy))) {
      clone = _prepareClone(copy, src);
      return extend(deep, clone, copy);
    } else {
      return copy;
    }
  };

}).call(this);
}});
