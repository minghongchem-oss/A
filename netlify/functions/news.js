const { writeStatus } = require('./_statusStore');

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'cache-control': 'no-store', 'content-type': 'application/json' },
  body: JSON.stringify(body),
});

const rssFeeds = {
  Left: [
    'http://rss.cnn.com/rss/cnn_allpolitics.rss',
    'https://www.msnbc.com/feeds/latest',
  ],
  Center: [
    'https://www.reuters.com/world/us/politics/rss',
    'https://feeds.bbci.co.uk/news/politics/rss.xml',
  ],
  Right: [
    'https://www.foxnews.com/politics/feed',
    'https://www.dailywire.com/feeds/rss.xml',
  ],
};

const toArticle = (item, sourceFallback) => ({
  title: item.title,
  url: item.link,
  source: item.author || sourceFallback || 'Unknown',
  publishedAt: item.pubDate,
});

const fetchNewsApi = async (topic, key) => {
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&language=en&pageSize=50&sortBy=publishedAt&apiKey=${key}&t=${Date.now()}`;
  const response = await fetch(url, { headers: { 'cache-control': 'no-cache' } });
  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`NewsAPI ${response.status}: ${payload.slice(0, 200)}`);
  }
  const payload = await response.json();
  return (payload.articles || []).map((a) => ({
    title: a.title,
    url: a.url,
    source: a.source?.name || 'Unknown',
    publishedAt: a.publishedAt,
  }));
};

const fetchRss = async (rssKey) => {
  const collected = [];
  for (const [side, feeds] of Object.entries(rssFeeds)) {
    for (const feed of feeds) {
      const endpoint = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}&api_key=${rssKey}&count=12&t=${Date.now()}`;
      const response = await fetch(endpoint, { headers: { 'cache-control': 'no-cache' } });
      if (!response.ok) {
        const body = await response.text();
        throw new Error(`RSS2JSON ${response.status}: ${body.slice(0, 200)}`);
      }
      const payload = await response.json();
      (payload.items || []).slice(0, 6).forEach((item) => {
        collected.push({ ...toArticle(item, payload.feed?.title), sideHint: side });
      });
    }
  }
  return collected;
};

const fetchGnews = async (topic, gnewsKey) => {
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(topic)}&lang=en&max=25&apikey=${gnewsKey}&t=${Date.now()}`;
  const response = await fetch(url, { headers: { 'cache-control': 'no-cache' } });
  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`GNews ${response.status}: ${payload.slice(0, 200)}`);
  }
  const payload = await response.json();
  return (payload.articles || []).map((a) => ({
    title: a.title,
    url: a.url,
    source: a.source?.name || 'Unknown',
    publishedAt: a.publishedAt,
  }));
};

exports.handler = async function (event) {
  const topic = event.queryStringParameters?.topic || 'politics';
  const newsKey = process.env.NEWSAPI_KEY;
  const rssKey = process.env.RSS2JSON_KEY;
  const gnewsKey = process.env.GNEWS_KEY;

  const reasons = [];

  if (newsKey) {
    try {
      const articles = await fetchNewsApi(topic, newsKey);
      const status = writeStatus('newsapi', 'NewsAPI success');
      return json(200, { live: true, provider: 'newsapi', fallbackReason: null, ...status, fetchedAt: new Date().toISOString(), articles });
    } catch (error) {
      reasons.push(String(error));
    }
  } else {
    reasons.push('NewsAPI key missing');
  }

  if (rssKey) {
    try {
      const articles = await fetchRss(rssKey);
      const reason = reasons[0]?.includes('426') ? 'NewsAPI 426 → using RSS2JSON' : 'NewsAPI unavailable → using RSS2JSON';
      const status = writeStatus('rss2json', reason);
      return json(200, { live: true, provider: 'rss2json', fallbackReason: reason, ...status, fetchedAt: new Date().toISOString(), articles });
    } catch (error) {
      reasons.push(String(error));
    }
  } else {
    reasons.push('RSS2JSON key missing');
  }

  if (gnewsKey) {
    try {
      const articles = await fetchGnews(topic, gnewsKey);
      const reason = reasons.some((r) => r.includes('426')) ? 'NewsAPI 426 → RSS2JSON unavailable → using GNews' : 'Primary providers unavailable → using GNews';
      const status = writeStatus('gnews', reason);
      return json(200, { live: true, provider: 'gnews', fallbackReason: reason, ...status, fetchedAt: new Date().toISOString(), articles });
    } catch (error) {
      reasons.push(String(error));
    }
  } else {
    reasons.push('GNews key missing');
  }

  const reason = reasons.join(' | ');
  const status = writeStatus('mock', reason || 'No live providers available.');
  return json(200, {
    live: false,
    provider: 'mock',
    fallbackReason: reason,
    ...status,
    fetchedAt: new Date().toISOString(),
    articles: [],
    error: `Live fetch failed (${reason}). Using mock data.`,
  });
};
