import Dexie from 'dexie';

const db = new Dexie('fragy-purity');

db.version(1).stores({
  cache: 'key, value',
});

export const getFromCache = async (key) => {
  const cached = await db.cache.get(key);
  try {
    return JSON.parse(cached?.value || JSON.stringify(null)) || null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const setToCache = (key, value) => {
  return db.cache.put({
    key,
    value: JSON.stringify(value),
  });
};
