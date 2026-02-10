const { writeStatus } = require('./_statusStore');

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'cache-control': 'no-store', 'content-type': 'application/json' },
  body: JSON.stringify(body),
});

async function getXProxy() {
  try {
    const resp = await fetch('https://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=Reuters');
    if (!resp.ok) return null;
    const payload = await resp.json();
    return payload?.[0]?.followers_count || null;
  } catch {
    return null;
  }
}

exports.handler = async function () {
  const rssKey = process.env.RSS2JSON_KEY;
  const xFollowers = await getXProxy();

  if (!rssKey) {
    const status = writeStatus('mock', 'RSS2JSON_KEY missing');
    return json(200, {
      live: false,
      provider: 'mock',
      fallbackReason: 'RSS2JSON_KEY missing',
      ...status,
      fetchedAt: new Date().toISOString(),
      cards: [],
      xFollowers,
      error: 'No RSS2JSON_KEY configured on server.',
    });
  }

  try {
    const feeds = ['https://www.reuters.com/world/us/politics/rss', 'https://feeds.feedburner.com/Talking-Points-Memo'];
    const cards = [];
    for (const feed of feeds) {
      const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}&api_key=${rssKey}&t=${Date.now()}`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`RSS2JSON ${response.status}: ${text.slice(0, 200)}`);
      }
      const payload = await response.json();
      payload.items.slice(0, 4).forEach((item, idx) => {
        cards.push({
          id: `${feed}-${idx}`,
          headline: item.title,
          source: feed.includes('reuters') ? 'Reuters Politics RSS' : 'TPM RSS',
          sourceUrl: item.link,
          mainstreamHits: 2 + idx,
          altEngagement: 900000 - idx * 70000,
          viralityGap: 85 - idx * 4,
          credibility: feed.includes('reuters') ? 'High credibility (wire)' : 'Mostly factual',
          factCheck: 'https://www.factcheck.org/',
          date: (item.pubDate || '').slice(0, 10),
          xEngagement: xFollowers ? Math.round(xFollowers / (600 + idx * 60)) : undefined,
        });
      });
    }

    const status = writeStatus('rss2json', 'RSS2JSON radar success');
    return json(200, {
      live: true,
      provider: 'rss2json',
      fallbackReason: null,
      ...status,
      fetchedAt: new Date().toISOString(),
      cards,
      xFollowers,
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
      cards: [],
      xFollowers,
      error: `Live fetch failed (${reason})`,
    });
  }
};
