###
Test suite for node AND browser in one file
So, we are need some data from global
Its so wrong, but its OK for test
###
lib_path = GLOBAL?.lib_path || ''

Stack = require "#{lib_path}lib/stack"

describe 'Stack:', ->

  stack = null

  beforeEach ->
    stack = new Stack()

  describe 'new()', ->

    it 'should return Stack object', ->
      stack.should.be.an.instanceof Stack

    it 'should work with args', ->
      my_stack = new Stack 1,2,3
      my_stack.pop().should.be.equal 3

  describe '#push()', ->

    it 'should push item', ->
      stack.push 22
      stack.pop().should.be.equal 22

  describe '#pop()', ->

    it 'should extract last item and return it', ->
      stack.push 22
      stack.push 33
      stack.pop().should.be.equal 33

    it 'should return undef on empty stack', ->
      expect(stack.pop()).to.be.undefined

  describe '#see()', ->

    it 'should return last item without extraction', ->
      stack.push 22
      stack.see().should.be.equal stack.see()

    it 'should return undef on empty stack', ->
      expect(stack.see()).to.be.undefined

  describe '#clear()', ->

    it 'should wipe out data', ->
      stack.push 22
      stack.clear()
      stack.isEmpty().should.be.true

  describe '#fill()', ->

    it 'should fill stack with elements', ->
      stack.push 22
      stack.fill 33,44,55
      for el in [55,44,33,22]
        stack.pop().should.be.equal el

  describe '#isEmpty()', ->

    it 'should return true if empty', ->
      stack.isEmpty().should.be.true

    it 'should return false if have element(s)', ->
      stack.push 22
      stack.isEmpty().should.be.false
