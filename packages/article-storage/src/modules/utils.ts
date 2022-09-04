import { nanoid } from 'nanoid';

export const getDbName = () => {
  const existed = window.localStorage.getItem('fragy-db-name');
  if (existed) {
    return existed;
  }
  const dbName = `fragy-article-storage__${nanoid()}`;
  window.localStorage.setItem('fragy-db-name', dbName);
  return dbName;
};
