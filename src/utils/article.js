import YAML from 'yaml';

const yamlExtractor = /^-{3}(\r?\n)+([\S\s]+?)\r?\n-{3}(\r?\n)+(.*)$/s;

const parseArticle = (article) => {
  const matches = yamlExtractor.exec(article);
  let meta = null;
  if (matches.length < 4) {
    throw new Error('[Fragy] Match content failed.');
  }
  if (matches && matches.length) {
    meta = YAML.parse(matches[2].trim());
  }
  const content = matches[4].trim();
  let abstract;
  if (content.includes('<!-- more -->')) {
    abstract = content.split('<!-- more -->')[0];
  } else {
    abstract = content.slice(0, 200);
  }
  return {
    meta,
    abstract,
    content: matches[4].trim(),
  };
};

export { parseArticle };
