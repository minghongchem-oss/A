const buildStatus = () => {
  const providers = {
    newsapi: Boolean(process.env.NEWSAPI_KEY),
    gnews: Boolean(process.env.GNEWS_KEY),
    rss2json: Boolean(process.env.RSS2JSON_KEY),
  };
  const live = providers.newsapi || providers.gnews || providers.rss2json;

  return {
    live,
    providers,
    lastFetch: new Date().toISOString(),
    message: live
      ? 'Live providers configured on server.'
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
