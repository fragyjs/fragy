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
      // articleList: {
      //   output: 'listFeed.json',
      //   feed: '/data/listFeed.json',
      //   splitPage: false,
      //   pageSize: 10,
      // },
      articleList: {
        output: 'listFeed',
        feed: '/data/listFeed',
        splitPage: true,
        pageSize: 10,
      },
    },
    userConfig,
  );
  config.articles.feed = formatFeed(config.articles.feed);
  config.articleList.feed = formatFeed(config.articleList.feed);
  return config;
};
