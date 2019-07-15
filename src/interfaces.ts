export interface SourceOptions {
  name?: string;
  annotation?: string;
}

export type MapSeriersIterator<T> = (item: T, index?: number, array?: T[]) => Promise<T> | T;
