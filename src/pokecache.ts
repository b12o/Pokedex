type CacheEntry<T> = {
  createdAt: number;
  val: T;
};

export class Cache {
  private cache = new Map<string, CacheEntry<any>>();
  private reapIntervalId: NodeJS.Timeout | undefined;
  private interval: number = -1;

  constructor(interval: number) {
    this.interval = interval;
    this.startReapLoop(this.interval);
  }

  add<T>(key: string, val: T) {
    this.cache.set(key, {
      createdAt: Date.now(),
      val,
    });
  }

  get<T>(key: string): T | undefined {
    return this.cache.get(key)?.val;
  }

  private startReapLoop(interval: number): void {
    // it's important that this is an arrow function in order to use lexical 'this'
    this.reapIntervalId = setInterval(() => this.reap(), interval);
  }

  stopReapLoop(): void {
    clearInterval(this.reapIntervalId);
  }

  reap(): void {
    if (this.cache.size === 0) {
      return;
    }

    for (const key of this.cache.keys()) {
      // obviously it exists since we are iterating over the keys, hence the "!"
      if (this.cache.get(key)!.createdAt < Date.now() - this.interval) {
        this.cache.delete(key);
      }
    }
  }
}
