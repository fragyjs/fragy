const moment = require('moment');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const { getListInfo } = require('../utils/list');

let tagInfoList = {};
let outputDir;

module.exports = {
  name: 'tag',
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
      if (!fragyConfig.tag.output) {
        logger.error('You have not specified category info output path.');
        return false;
      }

      outputDir = path.resolve(userDataRoot, fragyConfig.tag.output);
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
        const { tag, tags } = article.meta;
        const listInfo = getListInfo(article, {
          abstractWords: fragyConfig.articleList.abstractWords,
        });
        const actualTag = tags || tag;
        if (Array.isArray(actualTag)) {
          // multi tags
          actualTag.forEach((tag) => {
            if (!tagInfoList[tag]) {
              tagInfoList[tag] = [];
            }
            tagInfoList[tag].push(listInfo);
          });
        } else if (actualTag) {
          // single tag
          if (!tagInfoList[tag]) {
            tagInfoList[tag] = [];
          }
          tagInfoList[tag].push(listInfo);
        }
      });
      bus.on('read-completed', async () => {
        const checkPathRes = checkPath();
        if (!checkPathRes) {
          return reject(new Error('Path checking failed.'));
        }
        const splitPage = fragyConfig.tag.splitPage;
        const tagManifest = {};
        if (!splitPage) {
          // remove existed category files
          if (fs.existsSync(outputDir)) {
            await fsp.rm(outputDir, { recursive: true, force: true });
          }
          if (!fs.existsSync(outputDir)) {
            await fsp.mkdir(outputDir);
          }
        }
        await Promise.all(
          Object.keys(tagInfoList).map(async (tagName) => {
            if (splitPage) {
              const metaDir = path.resolve(outputDir, tagName);
              if (fs.existsSync(metaDir)) {
                await fsp.rm(metaDir, { recursive: true, force: true });
              }
              await fsp.mkdir(metaDir, { recursive: true });
              // generate slices
              const pageSize = fragyConfig.category.pageSize || 10;
              const infoList = tagInfoList[tagName].sort((a, b) => {
                const createTimeA = moment(a.date, 'YYYY-MM-DD HH:mm:ss');
                const createTimeB = moment(b.date, 'YYYY-MM-DD HH:mm:ss');
                return createTimeB.valueOf() - createTimeA.valueOf();
              });
              const slices = [];
              for (let i = 0; i < pageSize; i++) {
                slices.push(infoList.slice(i * pageSize, (i + 1) * pageSize));
                logger.debug('Tag meta info generated:', `${tagName} - P${i + 1}`);
                if ((i + 1) * pageSize > infoList.length) {
                  break;
                }
              }
              await Promise.all(
                slices
                  .filter((slice) => !!slice.length)
                  .map((slice, idx) => {
                    const slicePath = path.resolve(metaDir, `./page-${idx + 1}.json`);
                    logger.debug('Writting tag meta file:', slicePath);
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
              // one tag one meta file
              const outputPath = path.resolve(outputDir, `${tagName}.json`);
              if (fs.existsSync(outputPath)) {
                await fsp.rm(outputPath, { force: true });
              }
              const infoList = tagInfoList[tagName];
              await fsp.writeFile(outputPath, JSON.stringify(infoList), { encoding: 'utf-8' });
              logger.debug(`Tag list meta file [${outputPath}] has been written to the disk.`);
            }
            // push manifest info
            tagManifest[tagName] = {
              total: tagInfoList[tagName].length,
            };
            if (fragyConfig.category.manifestDetails) {
              Object.assign(tagManifest[tagName], {
                details: tagInfoList[tagName].map((listInfo) => {
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
        const manifestPath = path.resolve(userDataRoot, './manifest/tag.json');
        const manifestDir = path.dirname(manifestPath);
        // wait for all previous tasks completed
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
            await fsp.writeFile(manifestPath, JSON.stringify(tagManifest), {
              encoding: 'utf-8',
            });
          } catch (err) {
            logger.error('Failed to write tag manifest.', err);
            reject(err);
          }
          logger.debug('Tag manifest generated.');
          resolve();
        });
      });
    });
  },
};
