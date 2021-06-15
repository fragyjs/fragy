/* eslint-disable no-await-in-loop */
const path = require('path');
const fs = require('fs');
const generateList = require('./modules/generateList.js');
const logger = require('./utils/logger');
const esmRequire = require('esm')(module);

const fragyConfig = esmRequire('../fragy.config').default;
const generatorPath = path.resolve(
  __dirname,
  `../node_modules/${fragyConfig.theme.package}/generator.js`,
);
const themeGenerator = fs.existsSync(generatorPath) ? require(generatorPath) : null;

const queue = [generateList];

const initThemeGenerators = async () => {
  if (themeGenerator && Array.isArray(themeGenerator)) {
    queue.unshift(...themeGenerator);
  } else if (typeof themeGenerator === 'function') {
    const generators = await Promise.resolve(
      themeGenerator.call({
        logger,
      }),
    );
    if (generators && Array.isArray(generators)) {
      queue.unshift(...generators);
    } else {
      logger.error(`Cannot get generators from theme [${fragyConfig.theme.package}].`);
    }
  }
};

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
  // init
  await initThemeGenerators();
  // execution
  logger.debug('Starting generate the site...');
  for (const item of queue) {
    if (typeof item === 'object' && Array.isArray(item)) {
      await executeParallel(item);
    } else if (typeof item === 'function') {
      await item();
    }
  }
};

execute();
