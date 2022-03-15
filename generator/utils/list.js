const moreTester = /<!-{2}\s?more\s?-{2}>/;

const getListInfo = (parsedArticle, opts) => {
  const article = parsedArticle;
  const { abstractWords } = opts;
  // build base info
  const listInfo = {
    fileName: article.fileName,
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
  return listInfo;
};

module.exports = {
  getListInfo,
};
