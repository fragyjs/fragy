const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const camelCase = require('camelcase');
const prependFile = require('prepend-file');
const Logger = require('../utils/logger');
const { userDataRoot } = require('../utils/path');

const logger = new Logger('custom-component');

const customComponentsRoot = path.resolve(userDataRoot, './components');
const targetPath = path.resolve(customComponentsRoot, './fragy.entry.js');

const collectComponentFiles = async (base = '') => {
  const folderPath = path.resolve(customComponentsRoot, base);
  if (!fs.existsSync(folderPath)) {
    return [];
  }
  const fileNames = await fsp.readdir(folderPath);
  let collectRes = [];
  await Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = path.resolve(folderPath, fileName);
      const relativePath = base ? `./${base}/${fileName}` : fileName;
      try {
        const statRes = await fsp.stat(filePath);
        if (statRes.isDirectory()) {
          await collectComponentFiles(relativePath);
        } else if (fileName.endsWith('.vue')) {
          return collectRes.push({
            relativePath: `./${relativePath}`,
            fileName,
            compName: camelCase(fileName.replace('.vue', '')),
          });
        }
      } catch (err) {
        logger.error('Failed to collect component.', fileName);
      }
    }),
  );
  return collectRes;
};

const getIndexCode = (collected) => {
  const baseTemplate = `// DO NOT DELETE THIS FILE, auto generated by Fragy.
{import}

export {
{export}
};
  `.trim();
  const importCode = collected
    .map((item) => {
      return `import ${item.compName} from '${item.relativePath}';`;
    })
    .join('\n');
  const exportCode = collected
    .map((item) => {
      return `  ${item.compName},`;
    })
    .join('\n');
  return baseTemplate.replace('{import}', importCode).replace('{export}', exportCode);
};

const generateIndex = async () => {
  const customIndexPath = path.resolve(customComponentsRoot, './index.js');
  try {
    if (fs.existsSync(targetPath)) {
      await fsp.rm(targetPath, { force: true });
    }
  } catch (err) {
    logger.error('Failed to remove the existed entry file.', err);
    return;
  }
  try {
    if (fs.existsSync(customIndexPath)) {
      // just do a copy
      await fsp.cp(customIndexPath, targetPath);
      await prependFile(targetPath, '// DO NOT DELETE THIS FILE, auto generated by Fragy.\n\n');
    } else {
      // collect custom component and generate index
      const collected = await collectComponentFiles();
      const code = getIndexCode(collected);
      await fsp.writeFile(targetPath, code, { encoding: 'utf-8' });
    }
  } catch (err) {
    logger.error('Failed to generate the index file of custom components.', err);
  }
};

module.exports = {
  name: 'customComponent',
  action: () => generateIndex(),
};