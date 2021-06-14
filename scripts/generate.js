/* eslint-disable no-await-in-loop */
const generateList = require('./modules/generateList.js');

const queue = [generateList];

const executeParallel = async (generators) => {
  await Promise.all(
    generators.map((fn) => {
      return Promise.resolve(
        (async () => {
          await fn();
        })(),
      );
    }),
  );
};

const execute = async () => {
  for (const item of queue) {
    if (typeof item === 'object' && Array.isArray(item)) {
      await executeParallel(item);
    } else if (typeof item === 'function') {
      await item();
    }
  }
};

execute();
