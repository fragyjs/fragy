const DEFAULT_CONFIG = {
  title: 'Fragy',
  subtitle: 'Another fragy site.',
  icon: '/favicon.ico',
};

const DEFAULT_FEED_CONFIG = {
  articles: {
    path: 'posts',
    feed: '/data/posts',
  },
  articleList: {
    output: 'listFeed',
    feed: '/data/listFeed',
    splitPage: true,
    pageSize: 10,
  },
};

const DEFAULT_GITHUB_CONFIG = {
  articleList: {
    splitPage: false,
    pageSize: 10,
  },
};

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

export const normalizeConfig = (userConfig) => {
  const config = Object.assign(Object.create(null), DEFAULT_CONFIG);
  if (!userConfig.github) {
    Object.assign(config, DEFAULT_FEED_CONFIG);
  } else {
    Object.assign(config, DEFAULT_GITHUB_CONFIG);
  }
  Object.assign(config, userConfig);
  if (!config.github) {
    config.articles.feed = formatFeed(config.articles.feed);
    config.articleList.feed = formatFeed(config.articleList.feed);
  }
  return config;
};
