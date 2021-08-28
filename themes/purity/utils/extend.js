/* eslint-disable no-console */
const { setItem, getItem } = window.localStorage;
window.localStorage.setItem = (key, value) => {
  setItem.call(window.localStorage, key, JSON.stringify(value));
};
window.localStorage.getItem = (key) => {
  const stored = getItem.call(window.localStorage, key);
  try {
    const parsed = JSON.parse(stored);
    return parsed;
  } catch (err) {
    console.error('Cannot parse item in storage.');
    console.error(err);
    return null;
  }
};
