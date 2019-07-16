import fs = require('fs');
import path = require('path');
import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
import source = require('../src/index');
import multidep = require('multidep');

const multidepRequire = multidep('test/multidep.json');
const Builder16Point9 = multidepRequire('broccoli', '0.16.9').Builder;
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('integration test', () => {
  let sourcePaths: string[];

  beforeEach(() => {
    sourcePaths = [];
  });

  function willReadStringTree(s: string) {
    sourcePaths.push(s);
  }

  describe('.read-based builder', () => {
    it('WatchedDir watches the source directory', () => {
      let builder = new Builder16Point9(new source.WatchedDir('test/fixtures'));

      return builder
        .build(willReadStringTree)
        .then(results => {
          expect(sourcePaths).to.deep.equal([path.resolve('test/fixtures')]);
          expect(fs.existsSync(results.directory + '/foo.txt')).to.be.ok;
        })
        .finally(() => builder.cleanup());
    });

    it('UnwatchedDir does not watch the source directory', () => {
      let builder = new Builder16Point9(new source.UnwatchedDir('test/fixtures'));

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
