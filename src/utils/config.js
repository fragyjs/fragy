const formatFeed = (feed) => {
  if (feed && !/^https?\/\//.test(feed)) {
    let formatted = feed;
    if (!formatted.startsWith('/')) {
      formatted = `/${formatted}`;
    }
    if (formatted.endsWith('/')) {
      formatted = formatted.substr(0, feed.length - 1);
    }
    return formatted;
  }
  return feed;
};

export const formatConfig = (userConfig) => {
  const config = Object.assign(
    {
      title: 'Fragy',
      subtitle: 'Another fragy site.',
      articles: {
        path: 'posts',
        feed: '/posts',
      },
      articleList: {
        output: 'articleList.json',
        feed: '/data/articleList.json',
      },
    },
    userConfig,
  );
  config.articles.feed = formatFeed(config.articles.feed);
  config.articleList.feed = formatFeed(config.articleList.feed);
  return config;
};
