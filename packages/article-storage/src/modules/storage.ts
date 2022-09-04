import LRUCache from 'lru-cache';
import Dexie from 'dexie';
import { getDbName } from './utils';
import { createDbInstance } from './db';

export interface PersistArticleStorageOptions {
  name: string;
}

export interface ArticleStorageOptions {
  tempStorage: {
    enable: boolean;
    options: LRUCache.Options<string, string>;
  };
  persistStorage: {
    enable: boolean;
    options: PersistArticleStorageOptions;
  };
}

export class AritcleStorage {
  // storage level => temp > persist
  private tempStorage?: LRUCache<string, string>;
  private persistStorage?: Dexie;

  public constructor(options: ArticleStorageOptions) {
    if (options?.tempStorage?.enable) {
      this.tempStorage = new LRUCache(
        options.tempStorage?.options || {
          maxSize: 300,
          maxAge: 10 * 60 * 1000, // 10 mins ttl for default
          updateAgeOnGet: true,
        },
      );
    }
    if (options?.persistStorage?.enable) {
      this.persistStorage = createDbInstance(options?.persistStorage?.options?.name || getDbName());
    }
  }

  set(key: string, content: string) {}

  get(key: string, content: string) {}
}
