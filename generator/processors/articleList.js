const moment = require('moment');
const path = require('path');
const fsp = require('fs/promises');
const fs = require('fs');

const moreTester = /<!-{2}\s?more\s?-{2}>/;

let listInfoList = [];
let outputPath;
let outputDir;

module.exports = {
  name: 'articleList',
  register(context) {
    const { bus, fragyConfig, logger, paths } = context;
    const { userDataRoot } = paths;

    const checkPath = () => {
      if (!fragyConfig.articles.path) {
        logger.error('The articles storage folder was not set in the configuration.');
        return false;
      }
      const articlesDir = path.resolve(userDataRoot, fragyConfig.articles.path);
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

    return new Promise((resolve, reject) => {
      bus.on('article', (article) => {
        // build base info
        const listInfo = {
          filename: article.filename,
          title: article.meta.title,
          date: article.meta.date,
        };
        // generate abstract
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
        if (abstract) {
          Object.assign(listInfo, {
            abstract,
          });
        }
        logger.debug('List meta generated:', listInfo.title);
        listInfoList.push(listInfo);
      });
      bus.on('read-completed', async () => {
        logger.debug('Checking list meta path...');
        const checkPathRes = checkPath();
        if (!checkPathRes) {
          return reject(new Error('Path checking failed.'));
        }
        listInfoList = listInfoList.sort((a, b) => {
          const createTimeA = moment(a.date, 'YYYY-MM-DD HH:mm:ss');
          const createTimeB = moment(b.date, 'YYYY-MM-DD HH:mm:ss');
          return createTimeB.valueOf() - createTimeA.valueOf();
        });
        // write list meta files
        if (fragyConfig.articleList.splitPage) {
          const { pageSize } = fragyConfig.articleList;
          // remove existed files
          try {
            if (fs.existsSync(outputPath)) {
              await fsp.rm(outputPath, { recursive: true, force: true });
            }
            await fsp.mkdir(outputPath, { recursive: true });
            // generate slices
            const slices = [];
            for (let i = 0; i < pageSize; i++) {
              slices.push(listInfoList.slice(i * pageSize, (i + 1) * pageSize));
              logger.debug('List meta info generated:', `Page ${i + 1}`);
              if ((i + 1) * pageSize > listInfoList.length) {
                break;
              }
            }
            // write slices
            await Promise.all(
              slices
                .filter((slice) => !!slice.length)
                .map((slice, idx) => {
                  const slicePath = path.resolve(outputPath, `./page-${idx + 1}.json`);
                  logger.debug('Writting list meta file:', outputPath);
                  return fsp.writeFile(
                    slicePath,
                    JSON.stringify({
                      total: listInfoList.length,
                      listData: slice,
                    }),
                    { encoding: 'utf-8' },
                  );
                }),
            );
            logger.debug('All list meta slice have been written to the disk.');
          } catch (err) {
            logger.error('Failed to write list info to disk: ', err);
            return reject(err);
          }
        } else {
          // single list file
          try {
            logger.debug('Writting list meta file:', outputPath);
            await fsp.writeFile(
              outputPath,
              JSON.stringify({
                total: listInfoList.length,
                listData: listInfoList,
              }),
              { encoding: 'utf-8' },
            );
            logger.debug('List meta file has been written to the disk.');
          } catch (err) {
            logger.error('Failed to write list info to disk: ', err);
            reject(err);
          }
        }
        // write process completed
        resolve();
      });
    });
  },
};
