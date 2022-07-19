const moment = require('moment');
const path = require('path');
const fsp = require('fs/promises');
const fs = require('fs');
const { getListInfo } = require('../utils/list');

let categoryInfoList = {
  __default: [],
};
let outputDir;

module.exports = {
  name: 'category',
  register(context) {
    const { bus, fragyConfig, logger, paths } = context;
    const { userDataRoot } = paths;

    const checkPath = () => {
      if (!fragyConfig.articles.path) {
        logger.error('The articles storage folder was not set in the configuration.');
        return false;
      }
      const articlesDir = path.resolve(userDataRoot, fragyConfig.articles.path);
      if (!fs.existsSync(articlesDir)) {
        logger.error('Cannot locate the posts folder.');
        return false;
      }
      if (!fragyConfig.category.output) {
        logger.error('You have not specified category info output path.');
        return false;
      }

      outputDir = path.resolve(userDataRoot, fragyConfig.category.output);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      return true;
    };

    return new Promise((resolve, reject) => {
      bus.on('article', (article) => {
        if (article.meta.private) {
          return;
        }
        const { category, categories } = article.meta;
        const listInfo = getListInfo(article, {
          abstractWords: fragyConfig.articleList.abstractWords,
        });
        const actualCategory = categories || category;
        if (Array.isArray(actualCategory)) {
          actualCategory.forEach((category) => {
            if (!categoryInfoList[category]) {
              categoryInfoList[category] = [];
            }
            categoryInfoList[category].push(listInfo);
          });
        } else if (typeof actualCategory === 'string') {
          if (!categoryInfoList[actualCategory]) {
            categoryInfoList[actualCategory] = [];
          }
          categoryInfoList[actualCategory].push(listInfo);
        } else {
          logger.warn(`Cannot parse the category for [${article.fileName}], assigned to default`);
          categoryInfoList.__default.push(listInfo);
        }
      });
      bus.on('read-completed', async () => {
        logger.debug('Checking categories meta path...');
        const checkPathRes = checkPath();
        if (!checkPathRes) {
          return reject(new Error('Path checking failed.'));
        }
        const splitPage = fragyConfig.category.splitPage;
        const categoryManifest = {};
        if (!splitPage) {
          // remove existed category files
          if (fs.existsSync(outputDir)) {
            await fsp.rm(outputDir, { recursive: true, force: true });
            await fsp.mkdir(outputDir);
          }
        }
        // generate list meta files
        await Promise.all(
          Object.keys(categoryInfoList).map(async (categoryName) => {
            if (splitPage) {
              // info list should be splitted into slices
              const metaDir = path.resolve(outputDir, categoryName);
              if (fs.existsSync(metaDir)) {
                await fsp.rm(metaDir, { recursive: true, force: true });
              }
              if (!fs.existsSync(metaDir)) {
                await fsp.mkdir(metaDir, { recursive: true });
              }
              // generate slices
              const pageSize = fragyConfig.category.pageSize || 10;
              const infoList = categoryInfoList[categoryName].sort((a, b) => {
                const createTimeA = moment(a.date, 'YYYY-MM-DD HH:mm:ss');
                const createTimeB = moment(b.date, 'YYYY-MM-DD HH:mm:ss');
                return createTimeB.valueOf() - createTimeA.valueOf();
              });
              const slices = [];
              for (let i = 0; i < pageSize; i++) {
                slices.push(infoList.slice(i * pageSize, (i + 1) * pageSize));
                logger.debug('Category meta info generated:', `${categoryName} - P${i + 1}`);
                if ((i + 1) * pageSize > infoList.length) {
                  break;
                }
              }
              await Promise.all(
                slices
                  .filter((slice) => !!slice.length)
                  .map((slice, idx) => {
                    const slicePath = path.resolve(metaDir, `./page-${idx + 1}.json`);
                    logger.debug('Writting category meta file:', slicePath);
                    return fsp.writeFile(
                      slicePath,
                      JSON.stringify({
                        total: infoList.length,
                        listData: slice,
                      }),
                      { encoding: 'utf-8' },
                    );
                  }),
              );
            } else {
              // one category one meta file
              const outputPath = path.resolve(outputDir, `${categoryName}.json`);
              if (fs.existsSync(outputPath)) {
                await fsp.rm(outputPath, { force: true });
              }
              const infoList = categoryInfoList[categoryName];
              await fsp.writeFile(outputPath, JSON.stringify(infoList), { encoding: 'utf-8' });
              logger.debug(`Category list meta file [${outputPath}] has been written to the disk.`);
            }
            // push manifest info
            categoryManifest[categoryName] = {
              total: categoryInfoList[categoryName].length,
            };
            if (fragyConfig.category.manifestDetails) {
              Object.assign(categoryManifest[categoryName], {
                details: categoryInfoList[categoryName].map((listInfo) => {
                  const { title, fileName, date } = listInfo;
                  return {
                    title,
                    fileName,
                    date,
                  };
                }),
              });
            }
          }),
        );
        // generate manifest
        const manifestPath = path.resolve(userDataRoot, './manifest/category.json');
        const manifestDir = path.dirname(manifestPath);
        process.nextTick(async () => {
          if (!fs.existsSync(manifestDir)) {
            await fsp.mkdir(manifestDir, { recursive: true });
          }
          // remove the existed one
          if (fs.existsSync(manifestPath)) {
            await fsp.rm(manifestPath, { force: true });
          }
          try {
            // write manifest
            await fsp.writeFile(manifestPath, JSON.stringify(categoryManifest), {
              encoding: 'utf-8',
            });
          } catch (err) {
            logger.error('Failed to write category manifest.', err);
            reject(err);
          }
          logger.debug('Category manifest generated.');
          resolve();
        });
      });
    });
  },
};
