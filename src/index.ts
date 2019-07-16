import { FeatureSet, SourceNodeInfo, InputNode, SourceNode } from 'broccoli-node-api';
import { ConstructorOptions, MapSeriesIterator } from './interfaces';
import * as path from 'path';

const BROCCOLI_FEATURES = Object.freeze({
  persistentOutputFlag: true,
  sourceDirectories: true,
});

class Directory implements SourceNode {
  private _directoryPath: string;
  private _watched: boolean;
  private _name: string;
  private _annotation?: string;
  private _instantiationStack: string;
  __broccoliFeatures__: FeatureSet;

  constructor(directoryPath: string, watched: boolean | string, options: ConstructorOptions = {}) {
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

  read(readTree: MapSeriesIterator<InputNode>) {
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
  constructor(directoryPath: string, options?: ConstructorOptions) {
    super(directoryPath, true, options);
  }
}

class UnwatchedDir extends Directory {
  constructor(directoryPath: string, options?: ConstructorOptions) {
    super(directoryPath, false, options);
  }
}

export = { Directory, WatchedDir, UnwatchedDir };
