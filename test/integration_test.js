'use strict'

var fs = require('fs')
var chai = require('chai'), expect = chai.expect
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
var source = require('../')
var multidepPackages = require('multidep')('test/multidep.json')

var Builder_0_16 = multidepPackages['broccoli']['0.16.8']().Builder

describe('integration test', function() {
  var sourcePaths
  beforeEach(function() {
    sourcePaths = []
  })
  function willReadStringTree(s) {
    sourcePaths.push(s)
  }

  describe('.read-based builder', function() {
    it('WatchedDir watches the source directory', function() {
      var builder = new Builder_0_16(new source.WatchedDir('test/fixtures'))
      return builder.build(willReadStringTree).then(function(results) {
        expect(sourcePaths).to.deep.equal(['test/fixtures'])
        expect(fs.existsSync(results.directory + '/foo.txt')).to.be.ok
      }).finally(function() {
        return builder.cleanup()
      })
    })

    it('UnwatchedDir does not watch the source directory', function() {
      var builder = new Builder_0_16(new source.UnwatchedDir('test/fixtures'))
      return builder.build(willReadStringTree).then(function(results) {
        expect(sourcePaths).to.deep.equal([])
        expect(fs.existsSync(results.directory + '/foo.txt')).to.be.ok
      }).finally(function() {
        return builder.cleanup()
      })
    })
  })
})
