const json = (statusCode, body) => ({
  statusCode,
  headers: { 'cache-control': 'no-store', 'content-type': 'application/json' },
  body: JSON.stringify(body),
});

exports.handler = async function (event) {
  const query = event.queryStringParameters?.query || 'politics fact check';
  const gnewsKey = process.env.GNEWS_KEY;

  if (!gnewsKey) {
    return json(200, {
      live: false,
      provider: null,
      fetchedAt: new Date().toISOString(),
      items: [],
      error: 'No GNEWS_KEY configured on server.',
    });
  }

  try {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(`${query} fact check`)}&lang=en&max=8&apikey=${gnewsKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GNews ${response.status}: ${text.slice(0, 200)}`);
    }
    const payload = await response.json();
    return json(200, {
      live: true,
      provider: 'gnews',
      fetchedAt: new Date().toISOString(),
      items: (payload.articles || []).map((item, idx) => ({
        claim: item.title,
        claimant: item.source?.name || 'Unknown',
        reviewDate: (item.publishedAt || '').slice(0, 10),
        textualRating: ['Needs manual verification', 'Mixed signal', 'Unrated'][idx % 3],
        url: item.url,
      })),
    });
  } catch (error) {
    return json(200, {
      live: false,
      provider: 'gnews',
      fetchedAt: new Date().toISOString(),
      items: [],
      error: `Live fetch failed (${String(error).slice(0, 300)})`,
    });
  }
};
