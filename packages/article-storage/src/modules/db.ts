import Dexie from 'dexie';

const DB_VERSION = 1;

export const createDbInstance = (name: string) => {
  const db = new Dexie(name);

  db.version(DB_VERSION).stores({
    articles: 'key, content, update_time',
  });

  return db;
};
