export interface ConstructorOptions {
  /**
   * A name for this node. Defaults to "Directory".
   */
  name?: string;

  /**
   * A human-readable description for this node.
   */
  annotation?: string;
}

export type MapSeriesIterator<T> = (item: T, index?: number, array?: T[]) => Promise<T> | T;
