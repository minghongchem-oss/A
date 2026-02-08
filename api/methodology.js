export default function handler(req, res) {
  res.status(200).json({
    mission: 'Expose political media mechanics without editorialized AI summaries.',
    notes: [
      'Left/Center/Right cohorts are user configurable and stored in localStorage.',
      'Virality gap is a rank-difference proxy, not proof of truth.',
      'Fact-check links are references only; users should inspect evidence directly.',
    ],
    sources: ['https://newsapi.org', 'https://gnews.io', 'https://api.rss2json.com'],
  });
}
