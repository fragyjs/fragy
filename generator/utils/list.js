const moreTester = /<!-{2}\s?more\s?-{2}>/;

const cache = {};

const getTags = (meta) => {
  if (Array.isArray(meta.tags)) {
    return meta.tags;
  } else if (Array.isArray(meta.tag)) {
    return meta.tag;
  } else if (typeof meta.tag === 'string') {
    return [meta.tag];
  }
  return null;
};
const getCategories = (meta) => {
  if (Array.isArray(meta.categories)) {
    return meta.categories;
  } else if (Array.isArray(meta.category)) {
    return meta.category;
  } else if (typeof meta.category === 'string') {
    return [meta.category];
  }
  return null;
};

const getListInfo = (parsedArticle, opts) => {
  const cached = cache[parsedArticle.path];
  if (cached) {
    return cached;
  }
  const article = parsedArticle;
  const { abstractWords } = opts;
  // build base info
  const listInfo = {
    fileName: article.fileName,
    title: article.meta.title,
    date: article.meta.date,
    categories: getCategories(article.meta) || [],
    tags: getTags(article.meta) || [],
  };
  // generate abstract
  let abstract = '';
  const matches = moreTester.exec(article.content);
  if (matches && matches.length) {
    const moreFlag = matches[0];
    const moreFlagIdx = article.content.indexOf(moreFlag);
    abstract = article.content.substr(0, moreFlagIdx).trim();
  } else if (article.content.length > (abstractWords || 200)) {
    abstract = `${article.content.substr(0, 200)}...`;
  } else {
    abstract = article.content;
  }
  if (abstract) {
    Object.assign(listInfo, {
      abstract,
    });
  }
  cache[parsedArticle.path] = listInfo;
  return listInfo;
};

module.exports = {
  getListInfo,
};
