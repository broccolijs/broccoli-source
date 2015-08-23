'use strict'

var chai = require('chai'), expect = chai.expect
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
var source = require('../')

describe('unit tests', function() {
  describe('__broccoliGetInfo__ API', function() {
    it('returns all attributes', function() {
      var node = new source.Directory('some/path', 'true', { name: 'SomeName', annotation: 'some annotation' })
      var pluginInterface = node.__broccoliGetInfo__()
      expect(pluginInterface).to.have.property('nodeType', 'source')
      expect(pluginInterface).to.have.property('sourceDirectory', 'some/path')
      expect(pluginInterface).to.have.property('watched', true)
      expect(pluginInterface).to.have.property('name', 'SomeName')
      expect(pluginInterface).to.have.property('annotation', 'some annotation')
      expect(typeof pluginInterface.instantiationStack).to.equal('string')
    })

    it('has default name and annotation', function() {
      var pluginInterface = (new source.WatchedDir('some/path')).__broccoliGetInfo__()
      expect(pluginInterface).to.have.property('name', 'WatchedDir')
      expect(pluginInterface.annotation).to.not.exist
    })

    it('works for WatchedDir subclass', function() {
      var pluginInterface = (new source.WatchedDir('some/path')).__broccoliGetInfo__()
      expect(pluginInterface).to.have.property('sourceDirectory', 'some/path')
      expect(pluginInterface).to.have.property('watched', true)
    })

    it('works for UnwatchedDir subclass', function() {
      var pluginInterface = (new source.UnwatchedDir('some/path')).__broccoliGetInfo__()
      expect(pluginInterface).to.have.property('sourceDirectory', 'some/path')
      expect(pluginInterface).to.have.property('watched', false)
    })
  })

  describe('error handling', function() {
    it('constructor throws an error when not passed a path', function() {
      expect(function() {
        new source.Directory(12345)
      }).to.throw(/Expected a path/)
    })

    it('__broccoliGetInfo__ throws an error when not passed enough feature flags', function() {
      var node = new source.WatchedDir('some/path')
      expect(function() {
        // Pass empty features object, rather than missing (= default) argument
        node.__broccoliGetInfo__({})
      }).to.throw(/Minimum builderFeatures required/)
    })
  })
})
