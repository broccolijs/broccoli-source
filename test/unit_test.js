'use strict'

var chai = require('chai'), expect = chai.expect
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
var source = require('../')

function getInfo(node) {
  return node.__broccoliGetInfo__({ persistentOutputFlag: true, sourceDirectories: true })
}

describe('unit tests', function() {
  describe('__broccoliGetInfo__ API', function() {
    it('returns all attributes', function() {
      var dir = new source.Directory('some/path', 'true', { name: 'SomeName', annotation: 'some annotation' })
      var pluginInterface = getInfo(dir)
      expect(pluginInterface).to.have.property('nodeType', 'source')
      expect(pluginInterface).to.have.property('sourceDirectory', 'some/path')
      expect(pluginInterface).to.have.property('watched', true)
      expect(pluginInterface).to.have.property('name', 'SomeName')
      expect(pluginInterface).to.have.property('annotation', 'some annotation')
      expect(typeof pluginInterface.instantiationStack).to.equal('string')
    })

    it('has default name and annotation', function() {
      var pluginInterface = getInfo(new source.WatchedDir('some/path'))
      expect(pluginInterface).to.have.property('name', 'WatchedDir')
      expect(pluginInterface.annotation).to.not.exist
    })

    it('works for WatchedDir subclass', function() {
      var pluginInterface = getInfo(new source.WatchedDir('some/path'))
      expect(pluginInterface).to.have.property('sourceDirectory', 'some/path')
      expect(pluginInterface).to.have.property('watched', true)
    })

    it('works for UnwatchedDir subclass', function() {
      var pluginInterface = getInfo(new source.UnwatchedDir('some/path'))
      expect(pluginInterface).to.have.property('sourceDirectory', 'some/path')
      expect(pluginInterface).to.have.property('watched', false)
    })
  })

  describe('error handling', function() {
    it('throws an error when not passed a string', function() {
      expect(function() {
        new source.Directory(12345)
      }).to.throw(/Expected a path/)
    })
  })
})
