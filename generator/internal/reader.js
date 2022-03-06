const path = require('path');
const esm = require('esm');
const fs = require('fs');
const fsp = require('fs/promises');
const bus = require('../utils/bus');
const Logger = require('../utils/logger');
const { fragyConfig } = require('../utils/config');
const { userDataRoot, frameworkRoot } = require('../utils/path');

const esmRequire = esm(module);

const logger = new Logger('reader');

if (!fs.existsSync(userDataRoot)) {
  fs.mkdirSync(userDataRoot, { recursive: true });
}

const { parseArticle } = esmRequire(path.resolve(frameworkRoot, './src/utils/article'));
let articlesDir;
let outputPath;
let outputDir;

const checkPath = () => {
  if (!fragyConfig.articles.path) {
    logger.error('The articles storage folder was not set in the configuration.');
    return false;
  }
  articlesDir = path.resolve(userDataRoot, fragyConfig.articles.path);
  if (!fragyConfig.articleList.output) {
    logger.error('You have not specified list info output.');
    return false;
  }
  outputPath = path.resolve(userDataRoot, fragyConfig.articleList.output);
  outputDir = path.dirname(outputPath);
  if (!fs.existsSync(articlesDir)) {
    logger.error('Cannot locate the posts folder.');
    return false;
  }
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  return true;
};

const readArticle = (articleRelativePath) => {
  const articlePath = path.resolve(articlesDir, articleRelativePath);
  return fsp
    .readFile(articlePath)
    .then((content) => {
      const articleInfo = parseArticle(content);
      Object.assign(articleInfo, {
        path: articlePath,
        filename: path.basename(articlePath),
      });
      bus.emit('article', articleInfo);
    })
    .catch((err) => {
      logger.error('Read article failed.', err);
    });
};

const collectArticles = async (base = null) => {
  const pathCheckRes = checkPath();
  if (!pathCheckRes) {
    throw new Error('Article and output path check failed, cannot generate meta files.');
  }
  const currentDir = base ? path.resolve(articlesDir, base) : articlesDir;
  const filenames = await fsp.readdir(currentDir);
  return await Promise.all(
    filenames.map(async (filename) => {
      const filePath = path.resolve(currentDir, filename);
      const relativePath = base ? `${base}/${filename}` : filename;
      await new Promise((resolve, reject) => {
        try {
          fsp.stat(filePath).then(async (stat) => {
            if (stat.isDirectory()) {
              logger.debug(`Detected folder: ${filePath}`);
              await collectArticles(relativePath);
            } else if (filename.endsWith('.md')) {
              logger.debug(`Collecting article: ${filePath}`);
              readArticle(relativePath);
            }
            resolve();
          });
        } catch (err) {
          logger.error(`Cannot get stat info of file ${filePath}`);
          reject(err);
        }
      });
    }),
  );
};

module.exports = {
  name: 'read',
  action: () => collectArticles(),
};
