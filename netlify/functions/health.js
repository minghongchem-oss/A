const { readStatus } = require('./_statusStore');

const buildStatus = () => {
  const providers = {
    newsapi: Boolean(process.env.NEWSAPI_KEY),
    rss2json: Boolean(process.env.RSS2JSON_KEY),
    gnews: Boolean(process.env.GNEWS_KEY),
  };
  const live = providers.newsapi || providers.rss2json || providers.gnews;
  const persisted = readStatus();

  return {
    live,
    providers,
    preferredProvider: providers.rss2json ? 'rss2json' : providers.gnews ? 'gnews' : providers.newsapi ? 'newsapi' : 'mock',
    lastProvider: persisted.lastProvider,
    lastReason: persisted.lastReason,
    lastFetch: persisted.lastUpdated,
    message: live
      ? 'Live providers configured on server. NewsAPI may be restricted; RSS2JSON is preferred.'
      : 'No server provider keys configured. App will use mock data.',
  };
};

exports.handler = async function () {
  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-store',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ ok: true, ...buildStatus() }),
  };
};
