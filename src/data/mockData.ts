export type OutletBucket = 'Left' | 'Center' | 'Right';

export const topics = ['Election Integrity 2024', 'Border Policy 2025'];

export const coverageTimeline = [
  { date: '2026-01-01', Left: 44, Center: 30, Right: 68 },
  { date: '2026-01-02', Left: 58, Center: 27, Right: 71 },
  { date: '2026-01-03', Left: 63, Center: 35, Right: 76 },
  { date: '2026-01-04', Left: 52, Center: 26, Right: 61 },
  { date: '2026-01-05', Left: 70, Center: 41, Right: 82 },
  { date: '2026-01-06', Left: 74, Center: 43, Right: 88 },
];

export const framingTerms = [
  { term: 'insurrection', Left: 32, Center: 14, Right: 5 },
  { term: 'riot', Left: 8, Center: 12, Right: 30 },
  { term: 'protest', Left: 17, Center: 21, Right: 18 },
  { term: 'crisis', Left: 20, Center: 11, Right: 27 },
  { term: 'security', Left: 13, Center: 19, Right: 24 },
];

export const omissionRadar = [
  { topic: 'Ballot audits', Left: 8, Center: 20, Right: 77 },
  { topic: 'Voting rights', Left: 83, Center: 54, Right: 19 },
  { topic: 'Border labor', Left: 28, Center: 40, Right: 72 },
  { topic: 'Asylum backlog', Left: 34, Center: 43, Right: 66 },
  { topic: 'State lawsuits', Left: 69, Center: 30, Right: 18 },
];

export const reliabilityScatter = [
  { story: 'State challenge memo leak', reliability: 32, engagement: 76, side: 'Right' },
  { story: 'Court filing thread', reliability: 86, engagement: 35, side: 'Center' },
  { story: 'Ballot worker claims', reliability: 28, engagement: 88, side: 'Right' },
  { story: 'Election board whistleblower', reliability: 71, engagement: 66, side: 'Left' },
  { story: 'Immigration budget bill', reliability: 90, engagement: 44, side: 'Center' },
  { story: 'Border convoy livestream', reliability: 39, engagement: 80, side: 'Right' },
];

export const sampleAnnotations = [
  {
    id: 'a1',
    quote: 'Officials confirmed that millions of ineligible votes were counted overnight.',
    start: 55,
    end: 128,
    label: 'Contested claim',
    factChecks: ['PolitiFact: False', 'Snopes: Unproven', 'FactCheck.org: No evidence'],
  },
  {
    id: 'a2',
    quote: 'The policy created a complete border collapse within 24 hours.',
    start: 162,
    end: 227,
    label: 'Loaded framing',
    factChecks: ['PolitiFact: Exaggerated', 'Snopes: Mixture'],
  },
];

export const radarCards = [
  {
    id: 'r1',
    headline: 'County commission hearing on ballot chain-of-custody draws 2.3M X views',
    source: 'Independent Wire',
    sourceUrl: 'https://example.com/independent-wire-story',
    mainstreamHits: 3,
    altEngagement: 2_300_000,
    viralityGap: 97,
    credibility: 'Mixed reliability',
    factCheck: 'https://www.politifact.com/',
    date: '2026-01-06',
  },
  {
    id: 'r2',
    headline: 'Grassroots border shelter report trends before major outlets mention it',
    source: 'Civic Ledger',
    sourceUrl: 'https://example.com/civic-ledger-story',
    mainstreamHits: 5,
    altEngagement: 1_280_000,
    viralityGap: 88,
    credibility: 'Mostly factual',
    factCheck: 'https://www.snopes.com/',
    date: '2026-01-05',
  },
  {
    id: 'r3',
    headline: 'State-level procurement controversy gets massive subreddit traction',
    source: 'Public Forum Digest',
    sourceUrl: 'https://example.com/public-forum-story',
    mainstreamHits: 2,
    altEngagement: 910_000,
    viralityGap: 82,
    credibility: 'Unrated source',
    factCheck: 'https://www.factcheck.org/',
    date: '2026-01-04',
  },
];

export const sampleArticleText = `A late-night segment claimed that officials confirmed that millions of ineligible votes were counted overnight, but no documents were provided on-air. The host also argued that the policy created a complete border collapse within 24 hours, while interviews only cited localized delays. Critics say both narratives travel quickly because they reinforce existing audience assumptions.`;
