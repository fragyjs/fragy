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

const queue = [];

const initThemeGenerators = async () => {
  if (!themeGenerator) {
    return;
  }
  const generators =
    typeof themeGenerator === 'function'
      ? await Promise.resolve(
          themeGenerator.call({
            logger,
          }),
        )
      : themeGenerator;
  const { before, end } = generators;
  if (Array.isArray(before)) {
    queue.unshift(...before);
  }
  if (Array.isArray(end)) {
    queue.push(...end);
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
  // check if site need to generate list feed
  if (!fragyConfig.github) {
    queue.push(generateList);
  } else {
    logger.warn("You're using Github dynamic mode, skip generate feeds.");
  }
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
