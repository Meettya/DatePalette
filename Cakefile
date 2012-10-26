path          = require 'path'
fs            = require 'fs'
{spawn, exec} = require 'child_process'
Stitch        = require 'stitch'

require('colors').setTheme
  input:    'grey'
  verbose:  'cyan'
  prompt:   'grey'
  info:     'green'
  data:     'grey'
  help:     'cyan'
  warn:     'magenta'
  out:      'yellow'
  debug:    'blue'
  error:    'red'

root_path   = path.dirname fs.realpathSync __filename

###
Нам нужно следующее здесь
1. запустить тестовый сервер
2. собрать скомпилированную версию
3. собрать скомпилированную сжатую версию

последние 2 пункта ждут

итого пока делаем только запуск тестового сервера как обращение к стороннему скрипту

###


run_coffee = (args...) ->
  proc =         spawn 'coffee', args
  proc.stderr.on 'data', (buffer) -> console.log "#{buffer}".error
  proc.stdout.on 'data', (buffer) -> console.log  "#{buffer}".info
  proc.on        'exit', (status) ->
    process.exit(1) if status != 0


task 'run_server', 'run develop server with widget', start_server = (cb) ->
  serv_path = path.join root_path, 'start_dev_server'
  run_coffee serv_path
  cb() if typeof cb is 'function'

task 'coffee', 'compile and minify js code from coffee', make_minifyed_code = (cb) ->
  serv_path = path.join root_path, 'make_minifyed_code'
  run_coffee serv_path
  cb() if typeof cb is 'function'

task 'jade', "compile 'jade'files to '.html'", make_html = (cb) ->
  Sourcefile = []
  in_files_path = path.join root_path, 'develop_suite', 'views'
  out_files_path = path.join root_path, 'public'

  process.chdir in_files_path
  fs.readdir process.cwd(), (err,files)->
    Sourcefile = files
    #filter
    Sourcefile = Sourcefile.filter (index)->
      (/\.jade$/.test index)
    console.log Sourcefile
    #compile
    for source in Sourcefile  
      do (source) ->
        exec "jade --pretty #{source} --out #{out_files_path}", ->
          #console.log err if err
          console.log "compiled successfully...."


