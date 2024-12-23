export class RequestCache {
  private static cache = new Map<string, Promise<any>>();
  private static pending = new Set<string>();

  static async dedupe<T>(key: string, request: () => Promise<T>): Promise<T> {
    if (this.pending.has(key)) {
      return this.cache.get(key)!;
    }

    this.pending.add(key);
    const promise = request();
    this.cache.set(key, promise);

    try {
      const result = await promise;
      return result;
    } finally {
      this.pending.delete(key);
      this.cache.delete(key);
    }
  }

  static clear() {
    this.cache.clear();
    this.pending.clear();
  }
}