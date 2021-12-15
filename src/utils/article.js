import YAML from 'yaml';

const yamlExtractor = /^-{3}\r?\n(.+)\r?\n-{3}\r?\n(.*)/s;

const parseArticle = (article) => {
  const matches = yamlExtractor.exec(article);
  let meta = null;
  if (matches && matches.length) {
    meta = YAML.parse(matches[1]);
  }
  const content = matches[2].trim();
  let abstract;
  if (content.includes('<!-- more -->')) {
    abstract = content.split('<!-- more -->')[0];
  } else {
    abstract = content.substr(0, 200);
  }
  return {
    meta,
    abstract,
    content: matches[2].trim(),
  };
};

export { parseArticle };
