const path = require('path');
const fs = require('fs');
const reader = require('./internal/reader');
const bus = require('./utils/bus');
const Logger = require('./utils/logger');
const paths = require('./utils/path');
const { fragyConfig, themeConfig } = require('./utils/config');

const logger = new Logger('core');

const runs = [reader];
const processors = [];

const getThemeGenerator = () => {
  const generatorPath = path.resolve(
    __dirname,
    `../node_modules/${fragyConfig.theme.package}/generator.js`,
  );
  const themeGenerator = fs.existsSync(generatorPath) ? require(generatorPath) : null;
  themeGenerator?.runs && runs.push(...themeGenerator.runs);
  themeGenerator?.processors.forEach((processor) => {
    const { name, register } = processor;
    try {
      processors.push(
        register({
          bus,
          fragyConfig,
          themeConfig,
          logger: new Logger(name),
          paths: Object.freeze(paths),
        }),
      );
    } catch (err) {
      logger.error(`Failed to register theme processor [${name}].`, err);
      return;
    }
    logger.debug(`Theme processor [${name}] has registered.`);
  });
};

const collectProcessors = () => {
  const processorDir = path.resolve(__dirname, './processors');
  if (!fs.existsSync(processorDir)) {
    return;
  }
  const dirInfo = fs.readdirSync(processorDir);
  dirInfo.forEach((fileName) => {
    const actualPath = path.resolve(processorDir, fileName);
    const processor = require(actualPath);
    const { name, register } = processor;
    if (typeof register !== 'function') {
      logger.warn(`Internal rocessor [${name || fileName}] doesn't have a proper register method.`);
      return;
    }
    try {
      processors.push(
        register({
          bus,
          fragyConfig,
          themeConfig,
          logger: new Logger(name),
          paths: Object.freeze(paths),
        }),
      );
    } catch (err) {
      logger.error(`Failed to register internal processor [${name}].`, err);
      return;
    }
    logger.debug(`Internal processor [${name}] has registered.`);
  });
};

const executePipeline = async () => {
  collectProcessors();
  getThemeGenerator();
  const pipeline = [
    ...runs.map((run) => {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        const context = {
          bus,
        };
        try {
          logger.info(`Start running processor [${run.name}]`);
          bus.emit(`${run.name}-start`);
          const actions = Array.isArray(run.action)
            ? run.action.map((action) => action(context))
            : [run.action.call(null, context)];
          await Promise.all(actions);
          bus.emit(`${run.name}-completed`);
          logger.info(`Processor [${run.name}] completed`);
        } catch (err) {
          reject(err);
        }
        resolve();
      });
    }),
    ...processors,
  ];
  try {
    await Promise.all(pipeline);
    logger.info('Generate pipeline completed.');
  } catch (err) {
    logger.error('Uncaught error.', err);
  }
};

executePipeline();
