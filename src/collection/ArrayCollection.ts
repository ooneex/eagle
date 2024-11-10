import { ReadonlyArrayCollection } from "@/collection/ReadonlyArrayCollection.ts";
import { IArrayCollection } from "@/collection/types.ts";

export class ArrayCollection<V = unknown> extends ReadonlyArrayCollection<V>
  implements IArrayCollection<V> {
  public add(value: V): this {
    this.data.add(value);

    return this;
  }

  public delete(value: V): this {
    this.data.delete(value);

    return this;
  }

  public clear(): this {
    this.data.clear();

    return this;
  }
}
