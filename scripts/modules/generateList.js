/* eslint-disable no-console */
/* eslint-disable require-atomic-updates */
/* eslint-disable no-param-reassign */
const path = require('path');
const esm = require('esm');
const fs = require('fs');
const fsp = require('fs/promises');
const moment = require('moment');

const esmRequire = esm(module);

const __root = path.resolve(__dirname, '../../');
const __public = path.resolve(__root, './public');

const { formatConfig } = esmRequire(path.resolve(__root, './src/utils/config.js'));
const { parseArticle } = esmRequire(path.resolve(__root, './src/utils/article'));
const fragyConfig = formatConfig(esmRequire(path.resolve(__root, './fragy.config.js')).default);

const postsDirPath = path.resolve(__public, `.${fragyConfig.articles.base}`);
const listPath = path.resolve(__public, `.${fragyConfig.articleList.infoPath}`);
const listDirPath = path.dirname(listPath);

const moreTester = /<!-{2}\s?more\s?-{2}>/;

if (!fs.existsSync(postsDirPath)) {
  throw new Error('Cannot locate the posts folder.');
}

if (!fs.existsSync(listDirPath)) {
  fs.mkdirSync(listDirPath, { recursive: true });
}

const collectArticles = async () => {
  const filenames = await fsp.readdir(postsDirPath);
  return filenames.filter((filename) => filename.endsWith('.md'));
};

const generateList = async ({ filenames }) => {
  const articles = [];
  await Promise.all(
    filenames.map((filename) => {
      return new Promise((resolve) => {
        const articlePath = path.resolve(postsDirPath, filename);
        console.debug(`Collecting aritcle: ${articlePath}`);
        fsp.readFile(articlePath).then((content) => {
          const articleInfo = parseArticle(content);
          Object.assign(articleInfo, {
            path: articlePath,
            filename,
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
  return articles.map((article) => {
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
  });
};

const execute = async () => {
  const filenames = await collectArticles();
  const list = await generateList({ filenames });
  await fsp.writeFile(listPath, JSON.stringify(list), { encoding: 'utf-8' });
  console.log('Aritcles list has been generated.');
};

module.exports = execute;
