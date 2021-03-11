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
  private _instantiationError: Error;

  __broccoliFeatures__: FeatureSet;

  constructor(directoryPath: string, watched: boolean | string, options: ConstructorOptions = {}) {
    if (typeof directoryPath !== 'string') {
      throw new Error('Expected a path (string), got ' + directoryPath);
    }

    this._directoryPath = path.resolve(directoryPath);

    this._watched = !!watched;
    this._name = options.name || (this.constructor && this.constructor.name) || 'Directory';
    this._annotation = options.annotation;
    this.__broccoliFeatures__ = BROCCOLI_FEATURES;
    // capture an instantiation error so that we can lazily access the stack to
    // let folks know where a plugin was instantiated from if there is a build
    // error
    this._instantiationError = new Error();
  }

  __broccoliGetInfo__(
    builderFeatures: FeatureSet = { persistentOutputFlag: true, sourceDirectories: true }
  ): SourceNodeInfo {
    if (!builderFeatures.persistentOutputFlag || !builderFeatures.sourceDirectories) {
      throw new Error(
        'Minimum builderFeatures required: { persistentOutputFlag: true, sourceDirectories: true }'
      );
    }

    const { _instantiationError } = this;

    return {
      nodeType: 'source',
      sourceDirectory: this._directoryPath,
      watched: this._watched,
      get instantiationStack() {
        let errorStack = '' + _instantiationError.stack;
        return errorStack.replace(/[^\n]*\n/, '');
      },
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
  /**
   * Create a Broccoli node referring to a directory on disk.
   * The Broccoli watcher used by broccoli serve will watch the directory
   * and all subdirectories, and trigger a rebuild whenever something changes.
   *
   * @param directoryPath
   * A path to a directory, either absolute, or relative to the working directory.
   * @param options.annotation
   * A human-readable description for this node.
   * @param options.name
   * A human-readable name for this node.
   */
  constructor(directoryPath: string, options?: ConstructorOptions) {
    super(directoryPath, true, options);
  }
}

class UnwatchedDir extends Directory {
  /**
   * Create a Broccoli node referring to a directory on disk.
   * The Broccoli watcher used by broccoli serve will not watch the directory
   * or any subdirectories, and will not trigger a rebuild whenever something changes.
   *
   * @param directoryPath
   * A path to a directory, absolute or relative, to the working directory.
   * @param options.annotation
   * A human-readable description for this node.
   * @param options.name
   * A human-readable name for this node.
   */
  constructor(directoryPath: string, options?: ConstructorOptions) {
    super(directoryPath, false, options);
  }
}

export = { Directory, WatchedDir, UnwatchedDir };
