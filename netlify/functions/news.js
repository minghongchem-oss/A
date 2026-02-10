const json = (statusCode, body) => ({
  statusCode,
  headers: { 'cache-control': 'no-store', 'content-type': 'application/json' },
  body: JSON.stringify(body),
});

exports.handler = async function (event) {
  const topic = event.queryStringParameters?.topic || 'politics';
  const newsKey = process.env.NEWSAPI_KEY;
  const gnewsKey = process.env.GNEWS_KEY;

  if (!newsKey && !gnewsKey) {
    return json(200, {
      live: false,
      provider: null,
      fetchedAt: new Date().toISOString(),
      articles: [],
      error: 'No NEWSAPI_KEY or GNEWS_KEY configured on server.',
    });
  }

  try {
    if (newsKey) {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&language=en&pageSize=50&sortBy=publishedAt&apiKey=${newsKey}`;
      const response = await fetch(url);
      if (!response.ok) {
        const payload = await response.text();
        throw new Error(`NewsAPI ${response.status}: ${payload.slice(0, 200)}`);
      }
      const payload = await response.json();
      return json(200, {
        live: true,
        provider: 'newsapi',
        fetchedAt: new Date().toISOString(),
        articles: (payload.articles || []).map((a) => ({
          title: a.title,
          url: a.url,
          source: a.source?.name || 'Unknown',
          publishedAt: a.publishedAt,
        })),
      });
    }
  } catch (error) {
    if (!gnewsKey) {
      return json(200, {
        live: false,
        provider: 'newsapi',
        fetchedAt: new Date().toISOString(),
        articles: [],
        error: `Live fetch failed (${String(error).slice(0, 300)})`,
      });
    }
  }

  try {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(topic)}&lang=en&max=25&apikey=${gnewsKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      const payload = await response.text();
      throw new Error(`GNews ${response.status}: ${payload.slice(0, 200)}`);
    }
    const payload = await response.json();
    return json(200, {
      live: true,
      provider: 'gnews',
      fetchedAt: new Date().toISOString(),
      articles: (payload.articles || []).map((a) => ({
        title: a.title,
        url: a.url,
        source: a.source?.name || 'Unknown',
        publishedAt: a.publishedAt,
      })),
    });
  } catch (error) {
    return json(200, {
      live: false,
      provider: 'gnews',
      fetchedAt: new Date().toISOString(),
      articles: [],
      error: `Live fetch failed (${String(error).slice(0, 300)})`,
    });
  }
};
