import axios from 'axios';

const FAILED_FETCH_MESSAGE = 'Failed to fetch article content.';

/**
 * Get article data
 * @param feedURL Article data feed base URL
 * @param fileName Article file name
 * @returns Raw article data
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
 * Get article list data
 * @param feedUrl Article list feed base URL
 * @param page Current list page
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
  return res.data.listData;
};
