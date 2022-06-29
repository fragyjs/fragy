import axios from 'axios';

const FAILED_FETCH_MESSAGE = 'Failed to fetch article content.';

/**
 * 获取文章数据
 * @param feedURL 文章数据基础地址
 * @param fileName 文章文件名
 * @returns 文章数据
 */
export const fetchArticle = async (feedURL: string, fileName: string) => {
  let res;
  try {
    res = await axios.get(`${feedURL}/${encodeURIComponent(fileName)}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(FAILED_FETCH_MESSAGE, err);
    throw err;
  }
  if (res.status !== 200 || !res.data) {
    console.error(FAILED_FETCH_MESSAGE, res);
    return;
  }
  return res.data;
};

const getFeedUrl = (feedUrl: string, page?: number) => {
  return page ? `${feedUrl}/page-${page}.json` : feedUrl;
};

/**
 * 获取文章列表数据
 * @param feedUrl 文章列表数据基础地址
 * @param page 页数
 */
export const fetchArticleList = async (feedUrl: string, page?: number) => {
  let res;
  try {
    res = await axios.get(getFeedUrl(feedUrl, page));
  } catch (err) {
    if (!(err as Error).message?.includes('status code 404')) {
      console.error('Failed to pre-fetch article list info.', err);
    }
    // eslint-disable-next-line no-console
    throw err;
  }
  const articles: Record<number, unknown> | unknown[] = page ? {} : [];
  if (page) {
    articles[page] = res.data.listData;
  } else {
    (articles as unknown[]).push(...(res.data.listData || []));
  }
  return articles;
};
