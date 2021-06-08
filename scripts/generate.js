const generateList = require('./modules/generateList.js');

const parallel = [generateList];

const execute = async () => {
  await Promise.all(
    parallel.map((fn) => {
      return Promise.resolve(
        (async () => {
          await fn();
        })(),
      );
    }),
  );
};

execute();
