/* eslint-disable no-console */
/* eslint-disable require-atomic-updates */
/* eslint-disable no-param-reassign */
const path = require('path');
const esm = require('esm');
const fs = require('fs');
const fsp = require('fs/promises');
const moment = require('moment');
const logger = require('../utils/logger');

const esmRequire = esm(module);

const __root = path.resolve(__dirname, '../../');
const __data = path.resolve(__root, './.fragy');

if (!fs.existsSync(__data)) {
  fs.mkdirSync(__data, { recursive: true });
}

const { formatConfig } = esmRequire(path.resolve(__root, './src/utils/config.js'));
const { parseArticle } = esmRequire(path.resolve(__root, './src/utils/article'));
const fragyConfig = formatConfig(esmRequire(path.resolve(__root, './fragy.config.js')).default);

let articlesDir;
let outputPath;
let outputDir;

const moreTester = /<!-{2}\s?more\s?-{2}>/;

const checkPath = () => {
  if (!fragyConfig.articles.path) {
    logger.error('The articles storage folder was not set in the configuration.');
    return false;
  }
  articlesDir = path.resolve(__data, fragyConfig.articles.path);
  if (!fragyConfig.articleList.output) {
    logger.error('You have not specified list info output.');
    return false;
  }
  outputPath = path.resolve(__data, fragyConfig.articleList.output);
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

const collectArticles = async (base = null) => {
  const currentDir = base ? path.resolve(articlesDir, base) : articlesDir;
  const filenames = await fsp.readdir(currentDir);
  const res = [];
  await Promise.all(
    filenames.map((filename) => {
      const filePath = path.resolve(currentDir, filename);
      const relativePath = base ? `${base}/${filename}` : filename;
      return new Promise((resolve) => {
        try {
          fsp.stat(filePath).then(async (stat) => {
            if (stat.isDirectory()) {
              logger.debug(`Detected folder: ${filePath}`);
              res.push(...(await collectArticles(relativePath)));
            } else if (filename.endsWith('.md')) {
              logger.debug(`Collecting article: ${filePath}`);
              res.push(relativePath);
            }
            resolve();
          });
        } catch (err) {
          logger.error(`Cannot get stat info of file ${filePath}`);
          resolve(null);
        }
      });
    }),
  );
  return res;
};

const generateList = async ({ files }) => {
  const articles = [];
  await Promise.all(
    files.map((filename) => {
      return new Promise((resolve) => {
        const articlePath = path.resolve(articlesDir, filename);
        logger.debug(`Resolving aritcle: ${filename}`);
        fsp.readFile(articlePath).then((content) => {
          const articleInfo = parseArticle(content);
          Object.assign(articleInfo, {
            path: articlePath,
            filename: path.basename(articlePath),
          });
          articles.push(articleInfo);
          resolve();
        });
      });
    }),
  );
  // fill meta info
  await Promise.all(
    articles.map((article) => {
      return Promise.resolve(
        (async () => {
          if (!article.meta) {
            article.meta = {};
          }
          if (!article.meta.title) {
            article.meta.title = article.filename.replace('.md', '');
          }
          if (!article.meta.date) {
            const fileStat = await fsp.stat(article.path);
            article.meta.date = moment(fileStat.birthtimeMs).format('YYYY-MM-DD HH:mm:ss');
          }
        })(),
      );
    }),
  );
  // generate list info
  return articles
    .map((article) => {
      const listInfo = {
        filename: article.filename,
        title: article.meta.title,
        date: article.meta.date,
      };
      let abstract = '';
      const matches = moreTester.exec(article.content);
      if (matches && matches.length) {
        const moreFlag = matches[0];
        const moreFlagIdx = article.content.indexOf(moreFlag);
        abstract = article.content.substr(0, moreFlagIdx).trim();
      } else if (article.content.length > (fragyConfig.articleList.abstractWords || 200)) {
        abstract = `${article.content.substr(0, 200)}...`;
      } else {
        abstract = article.content;
      }
      Object.assign(listInfo, {
        abstract,
      });
      return listInfo;
    })
    .sort((a, b) => {
      const createTimeA = moment(a.date, 'YYYY-MM-DD HH:mm:ss');
      const createTimeB = moment(b.date, 'YYYY-MM-DD HH:mm:ss');
      return createTimeB.valueOf() - createTimeA.valueOf();
    });
};

const execute = async () => {
  const pathCheckRes = checkPath();
  if (!pathCheckRes) {
    logger.warn('Path check failed, skip generating article list info.');
    return;
  }
  const files = await collectArticles();
  const list = await generateList({ files });
  if (fragyConfig.articleList.splitPage) {
    const { pageSize } = fragyConfig.articleList;
    if (fs.existsSync(outputPath)) {
      await fsp.rmdir(outputPath, { recursive: true });
    }
    await fsp.mkdir(outputPath, { recursive: true });
    const slices = [];
    for (let i = 0; i < pageSize; i++) {
      slices.push(list.slice(i * pageSize, (i + 1) * pageSize));
      if ((i + 1) * pageSize > list.length) {
        break;
      }
    }
    await Promise.all(
      slices
        .filter((slice) => !!slice.length)
        .map((slice, idx) => {
          const slicePath = path.resolve(outputPath, `./page-${idx + 1}.json`);
          return fsp.writeFile(
            slicePath,
            JSON.stringify({
              total: list.length,
              listData: slice,
            }),
            { encoding: 'utf-8' },
          );
        }),
    );
  } else {
    try {
      await fsp.writeFile(
        outputPath,
        JSON.stringify({
          total: list.length,
          listData: list,
        }),
        { encoding: 'utf-8' },
      );
    } catch (err) {
      logger.error('Failed to write list info to disk: ', err);
    }
  }
  logger.info('Aritcles list has been generated.');
};

module.exports = execute;
