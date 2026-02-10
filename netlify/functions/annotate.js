const { writeStatus } = require('./_statusStore');

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'cache-control': 'no-store', 'content-type': 'application/json' },
  body: JSON.stringify(body),
});

exports.handler = async function (event) {
  const query = event.queryStringParameters?.query || 'politics fact check';
  const gnewsKey = process.env.GNEWS_KEY;

  if (!gnewsKey) {
    const status = writeStatus('mock', 'GNEWS_KEY missing');
    return json(200, {
      live: false,
      provider: 'mock',
      fallbackReason: 'GNEWS_KEY missing',
      ...status,
      fetchedAt: new Date().toISOString(),
      items: [],
      error: 'No GNEWS_KEY configured on server.',
    });
  }

  try {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(`${query} fact check`)}&lang=en&max=8&apikey=${gnewsKey}&t=${Date.now()}`;
    const response = await fetch(url, { headers: { 'cache-control': 'no-cache' } });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GNews ${response.status}: ${text.slice(0, 200)}`);
    }
    const payload = await response.json();
    const status = writeStatus('gnews', 'GNews annotate success');
    return json(200, {
      live: true,
      provider: 'gnews',
      fallbackReason: null,
      ...status,
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
    const reason = String(error).slice(0, 300);
    const status = writeStatus('mock', reason);
    return json(200, {
      live: false,
      provider: 'mock',
      fallbackReason: reason,
      ...status,
      fetchedAt: new Date().toISOString(),
      items: [],
      error: `Live fetch failed (${reason})`,
    });
  }
};
