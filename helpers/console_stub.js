
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
