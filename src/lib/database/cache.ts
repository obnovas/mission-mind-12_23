import LRU from 'lru-cache';

interface CacheConfig {
  maxSize?: number;
  ttl?: number;
}

export class QueryCache {
  private static instance: QueryCache;
  private cache: LRU<string, any>;

  private constructor(config: CacheConfig = {}) {
    this.cache = new LRU({
      max: config.maxSize || 500, // Store up to 500 queries
      ttl: config.ttl || 1000 * 60 * 5, // 5 minute TTL by default
      updateAgeOnGet: true, // Reset TTL when item is accessed
    });
  }

  public static getInstance(config?: CacheConfig): QueryCache {
    if (!QueryCache.instance) {
      QueryCache.instance = new QueryCache(config);
    }
    return QueryCache.instance;
  }

  public get<T>(key: string): T | undefined {
    return this.cache.get(key) as T | undefined;
  }

  public set<T>(key: string, value: T, ttl?: number): void {
    this.cache.set(key, value, { ttl });
  }

  public delete(key: string): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  public invalidateByPrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  public async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    const value = await fetchFn();
    this.set(key, value, ttl);
    return value;
  }
}