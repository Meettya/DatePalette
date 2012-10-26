###
This is Stack storage
Semi-classical implementations  - clear, push, pop, see, isEmpty + fill (speed up pushing)
Need to control access and have nice named functions
###

class Stack

  constructor: (args...)->
    @_stack_ = args # anyway its array :)

  clear : ->
    @_stack_ = []

  fill : (args...) ->
    @_stack_ = @_stack_.concat args

  push : (item) ->
    @_stack_.push item
  
  pop : ->
    @_stack_.pop()

  see : ->
    @_stack_[@_stack_.length-1]

  isEmpty : ->
    !@_stack_.length



module.exports = Stack