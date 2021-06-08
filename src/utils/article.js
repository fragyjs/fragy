import YAML from 'yaml';

const yamlExtractor = /^-{3}\n(.+)\n-{3}(.*)/s;

const parseArticle = (article) => {
  const matches = yamlExtractor.exec(article);
  let meta = null;
  if (matches && matches.length) {
    meta = YAML.parse(matches[1]);
  }
  return {
    meta,
    content: matches[2].trim(),
  };
};

export { parseArticle };
