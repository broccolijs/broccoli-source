'use strict';

const fs = require('fs');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const source = require('../');
const multidepRequire = require('multidep')('test/multidep.json');

const Builder_0_16 = multidepRequire('broccoli', '0.16.9').Builder;
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('integration test', () => {
  let sourcePaths;

  beforeEach(() => {
    sourcePaths = [];
  });

  function willReadStringTree(s) {
    sourcePaths.push(s);
  }

  describe('.read-based builder', () => {
    it('WatchedDir watches the source directory', () => {
      let builder = new Builder_0_16(new source.WatchedDir('test/fixtures'));

      return builder
        .build(willReadStringTree)
        .then(results => {
          expect(sourcePaths).to.deep.equal(['test/fixtures']);
          expect(fs.existsSync(results.directory + '/foo.txt')).to.be.ok;
        })
        .finally(() => builder.cleanup());
    });

    it('UnwatchedDir does not watch the source directory', () => {
      let builder = new Builder_0_16(new source.UnwatchedDir('test/fixtures'));

      return builder
        .build(willReadStringTree)
        .then(results => {
          expect(sourcePaths).to.deep.equal([]);
          expect(fs.existsSync(results.directory + '/foo.txt')).to.be.ok;
        })
        .finally(() => builder.cleanup());
    });
  });
});
