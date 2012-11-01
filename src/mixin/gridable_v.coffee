###
This mixin may get flat array of objects and split it
on some part, limiting reason - chars number in 'name' properties
###

instanceProperties =

  ###
  This method get array of objects {number: x, name: 'xx')},
  and return array of arrays 
  [
    [{number: 0, name: 'xx'}, {number: 1, name: 'xx'}, {number: 2, name: 'xx'}],
    [{number: 3, name: 'xxxx'},{number: 4, name: 'xxx'},{number: 5, name: 'xx'}]
  ]
  to fit it in string
  ###
  _compileSplittedRange : (range, max_char_in_row) ->

    char_counter = 0
    accumalator = []
    compiled_ranges = []

    for date_obj in range
      name_length = date_obj.name.length
      # do not overwrite in_bounds if it already filled
      date_obj.in_bounds ?= @_inBoundsChecker date_obj.number
      
      if ( char_counter + name_length ) >= max_char_in_row
        compiled_ranges.push accumalator
        accumalator = [date_obj]
        char_counter = name_length
      else
        accumalator.push date_obj
        char_counter += name_length

    if accumalator.length
      compiled_ranges.push accumalator

    compiled_ranges

  ###
  Sequence builder
  ###
  _buildSequence : (begin, end, formater) ->
    for element in [begin..end]
      number : element
      name   : formater element

  ###
  Interval amplifier - extend last container to have some elements as first
  ###
  _intervalAmplifier : (ranges, formatter) ->
    last_idx = ranges.length-1
    [first_line, last_line] = [ ranges[0], ranges[last_idx] ]
    diff  = first_line.length - last_line.length

    if diff
      addon = for step in [0...diff]
          number : null
          name   : formatter '0000'
      ranges.splice last_idx, 1, last_line.concat addon

    ranges


module.exports = instanceProperties