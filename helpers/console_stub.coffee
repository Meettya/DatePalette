###
In case we forget to take out console statements.
IE becomes very unhappy when we forget. Let's not make IE unhappy
###
unless @console # yes! global variable
	@console = {}
	methods = ["log", "error", "info", "debug", "warn", "trace", "dir", "dirxml", "group", "groupEnd", "time", "timeEnd", "assert", "profile", "profileEnd"]
	( @console[name] = -> ) for name in methods
