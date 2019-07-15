import * as path from 'path';
import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
import source = require('../src/index');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('unit tests', () => {
  describe('__broccoliGetInfo__ API', () => {
    it('normalizes relative paths', () => {
      let node = new source.Directory('some/path', 'true', {
        name: 'SomeName',
        annotation: 'some annotation',
      });

      let pluginInterface = node.__broccoliGetInfo__();

      expect(pluginInterface).to.have.property('sourceDirectory', path.resolve('some/path'));
    });

    it('passes through absolute paths', () => {
      let node = new source.Directory(path.resolve('some/path'), 'true', {
        name: 'SomeName',
        annotation: 'some annotation',
      });

      let pluginInterface = node.__broccoliGetInfo__();

      expect(pluginInterface).to.have.property('sourceDirectory', path.resolve('some/path'));
    });

    it('returns all attributes', () => {
      let node = new source.Directory('some/path', 'true', {
        name: 'SomeName',
        annotation: 'some annotation',
      });
      let pluginInterface = node.__broccoliGetInfo__();
      expect(pluginInterface).to.have.property('nodeType', 'source');
      expect(pluginInterface).to.have.property('sourceDirectory', path.resolve('some/path'));
      expect(pluginInterface).to.have.property('watched', true);
      expect(pluginInterface).to.have.property('name', 'SomeName');
      expect(pluginInterface).to.have.property('annotation', 'some annotation');
      expect(typeof pluginInterface.instantiationStack).to.equal('string');
    });

    it('has default name and annotation', () => {
      let pluginInterface = new source.WatchedDir('some/path').__broccoliGetInfo__();
      expect(pluginInterface).to.have.property('name', 'WatchedDir');
      expect(pluginInterface.annotation).to.not.exist;
    });

    it('works for WatchedDir subclass', () => {
      let pluginInterface = new source.WatchedDir('some/path').__broccoliGetInfo__();
      expect(pluginInterface).to.have.property('sourceDirectory', path.resolve('some/path'));
      expect(pluginInterface).to.have.property('watched', true);
    });

    it('works for UnwatchedDir subclass', () => {
      let pluginInterface = new source.UnwatchedDir('some/path').__broccoliGetInfo__();
      expect(pluginInterface).to.have.property('sourceDirectory', path.resolve('some/path'));
      expect(pluginInterface).to.have.property('watched', false);
    });
  });

  describe('error handling', () => {
    it('constructor throws an error when not passed a path', () => {
      expect(() => {
        // @ts-ignore
        new source.Directory(12345);
      }).to.throw(/Expected a path/);
    });

    it('__broccoliGetInfo__ throws an error when not passed enough feature flags', () => {
      let node = new source.WatchedDir('some/path');
      expect(() => {
        // Pass empty features object, rather than missing (= default) argument
        node.__broccoliGetInfo__({});
      }).to.throw(/Minimum builderFeatures required/);
    });
  });
});
