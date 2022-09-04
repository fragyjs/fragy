const path = require('path');
const fs = require('fs');
const merge = require('../utils/merge');

const collectInjectFiles = (rootPath) => {
  console.log(rootPath);
  if (!fs.existsSync(rootPath) || !fs.statSync(rootPath).isDirectory()) {
    return false;
  }
  const res = {
    styles: [],
    scripts: [],
  };
  const dirInfo = fs.readdirSync(rootPath);
  dirInfo.forEach((fileName) => {
    const resolvedPath = path.resolve(rootPath, fileName);
    if (fs.statSync(resolvedPath).isDirectory()) {
      merge(res, collectInjectFiles(resolvedPath));
    } else if (resolvedPath.endsWith('.css')) {
      res.styles.push(resolvedPath);
    } else if (resolvedPath.endsWith('.js')) {
      res.scripts.push(resolvedPath);
    }
  });
  return res;
};

const generateInjectConfig = (rootPath) => {
  const collected = collectInjectFiles(rootPath);
  console.log('collected', collected);
  const res = [];
  if (Array.isArray(collected.styles) && collected.styles.length) {
    collected.styles.forEach((stylePath) => {
      res.push({
        tagName: 'style',
        innerHTML: fs.readFileSync(stylePath, { encoding: 'utf-8' }).trim(),
      });
    });
  }
  if (Array.isArray(collected.scripts) && collected.scripts.length) {
    collected.scripts.forEach((scriptPath) => {
      res.push({
        tagName: 'script',
        innerHTML: fs.readFileSync(scriptPath, { encoding: 'utf-8' }).trim(),
      });
    });
  }
  return {
    bodyTags: res,
  };
};

module.exports = {
  generateInjectConfig,
};
