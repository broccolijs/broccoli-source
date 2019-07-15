import { FeatureSet, SourceNodeInfo, InputNode } from 'broccoli-node-api';
import { SourceOptions, MapSeriersIterator } from './interfaces';
import * as path from 'path';

const BROCCOLI_FEATURES = Object.freeze({
  persistentOutputFlag: true,
  sourceDirectories: true,
});

class Directory {
  _directoryPath: string;
  _watched: boolean;
  _name: string;
  _annotation?: string;
  _instantiationStack: string;
  __broccoliFeatures__: FeatureSet;

  constructor(directoryPath: string, watched: boolean | string, options: SourceOptions = {}) {
    if (typeof directoryPath !== 'string') {
      throw new Error('Expected a path (string), got ' + directoryPath);
    }

    this._directoryPath = path.resolve(directoryPath);

    this._watched = !!watched;
    this._name = options.name || (this.constructor && this.constructor.name) || 'Directory';
    this._annotation = options.annotation;

    // Remember current call stack (minus "Error" line)
    let errorStack = '' + new Error().stack;
    this._instantiationStack = errorStack.replace(/[^\n]*\n/, '');
    this.__broccoliFeatures__ = BROCCOLI_FEATURES;
  }

  __broccoliGetInfo__(
    builderFeatures: FeatureSet = { persistentOutputFlag: true, sourceDirectories: true }
  ): SourceNodeInfo {
    if (!builderFeatures.persistentOutputFlag || !builderFeatures.sourceDirectories) {
      throw new Error(
        'Minimum builderFeatures required: { persistentOutputFlag: true, sourceDirectories: true }'
      );
    }

    return {
      nodeType: 'source',
      sourceDirectory: this._directoryPath,
      watched: this._watched,
      instantiationStack: this._instantiationStack,
      name: this._name,
      annotation: this._annotation,
    };
  }

  read(readTree: MapSeriersIterator<InputNode>) {
    // Go through same interface as real Broccoli builder, so we don't have
    // separate code paths

    let pluginInterface = this.__broccoliGetInfo__();

    if (pluginInterface.watched) {
      return readTree(pluginInterface.sourceDirectory);
    } else {
      return pluginInterface.sourceDirectory;
    }
  }

  cleanup() {}
}

class WatchedDir extends Directory {
  constructor(directoryPath: string, options?: SourceOptions) {
    super(directoryPath, true, options);
  }
}

class UnwatchedDir extends Directory {
  constructor(directoryPath: string, options?: SourceOptions) {
    super(directoryPath, false, options);
  }
}

export = { Directory, WatchedDir, UnwatchedDir };
