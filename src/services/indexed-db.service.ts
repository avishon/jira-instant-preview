interface Stores {
  storeName: string;
  keyPath: string;
}

export class IndexedDbService {
  private db: IDBDatabase;
  private dbName: string;
  private dbVersion: number;
  private storeName: string;
  private keyPath: string;
  private storesToCreateOnInit: Stores[];

  constructor(
    dbName: string,
    dbVersion: number,
    storeName: string,
    keyPath: string,
    storesToCreateOnInit?: Stores[]
  ) {
    this.db;
    this.dbName = dbName;
    this.dbVersion = dbVersion;
    this.storeName = storeName;
    this.keyPath = keyPath;
    this.storesToCreateOnInit = storesToCreateOnInit;
  }

  public write(records: any[]): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this._openDb();
        const transaction = this.db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        records.forEach((item) => {
          const query = store.put(item);
        });
        transaction.oncomplete = () => {
          resolve();
          this.db.close();
        };
      } catch (err) {
        reject(err.target.error);
      }
    });
  }

  public read<T>(indexKeys: string[]): Promise<T[]> {
    return new Promise(async (resolve, reject) => {
      try {
        await this._openDb();
        const results: any = [];
        const transaction = this.db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        indexKeys.forEach((key) => {
          const query = store.get(key);
          query.onsuccess = () => {
            if (query.result) {
              results.push(query.result);
            }
          };
        });
        transaction.oncomplete = () => {
          resolve(results);
          this.db.close();
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  public async deleteOldItems(percentageToDelete: number) {
    await this._openDb();
    const transaction = this.db.transaction(this.storeName, 'readwrite');
    const store = transaction.objectStore(this.storeName);

    store.getAllKeys().onsuccess = (e) => {
      const allItems = (e.target as IDBRequest).result as string[];
      var deleteCounter = Math.round(allItems.length / percentageToDelete);
      for (let i = 0; i < deleteCounter; i++) {
        store.delete(allItems[i]);
      }
    };
    transaction.oncomplete = () => {
      this.db.close();
    };
  }

  public deleteDatabase() {
    indexedDB.deleteDatabase(this.dbName);
  }

  private _openDb(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onsuccess = (e) => {
        this.db = request.result;
        this.db.onversionchange = () => {
          this.db.close();
        };
        resolve();
      };
      request.onblocked = (e) => {
        reject(e);
      };
      request.onerror = (err) => {
        reject((err.target as IDBOpenDBRequest).error);
      };
      request.onupgradeneeded = (e) => {
        const thisDb = (e.target as IDBOpenDBRequest).result;
        this._createStores(thisDb);
      };
    });
  }

  private _createStores(db: IDBDatabase) {
    if (this.storesToCreateOnInit) {
      this.storesToCreateOnInit.forEach((store) => {
        if (!db.objectStoreNames.contains(store.storeName)) {
          db.createObjectStore(store.storeName, {
            keyPath: store.keyPath,
          });
        }
      });
    }
  }
}
