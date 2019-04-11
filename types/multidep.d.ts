interface BuilderPromise {
  directory: string;
}

type BuildCallbackFunction = (s: string) => void;
type MultidepRequireFunc = (packageName: string, version: string) => MultidepRequire;

declare class MultidepBuilder<T> {
  public constructor(node: T);
  public build(cb: BuildCallbackFunction): Promise<BuilderPromise>;
  public cleanup(): void;
}

interface MultidepRequire {
  Builder: typeof MultidepBuilder;
}

declare function multidep(specPath: string): MultidepRequireFunc;
export = multidep;
