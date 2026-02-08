export type OutletBucket = 'Left' | 'Center' | 'Right';

export const topics = ['Election Certification 2026', 'Border Enforcement Funding 2025'];

export const coverageTimeline = [
  { date: '2026-02-01', Left: 41, Center: 29, Right: 57 },
  { date: '2026-02-02', Left: 46, Center: 33, Right: 62 },
  { date: '2026-02-03', Left: 51, Center: 31, Right: 66 },
  { date: '2026-02-04', Left: 44, Center: 28, Right: 60 },
  { date: '2026-02-05', Left: 58, Center: 36, Right: 71 },
  { date: '2026-02-06', Left: 63, Center: 40, Right: 75 },
  { date: '2026-02-07', Left: 61, Center: 39, Right: 73 },
];

export const framingTerms = [
  { term: 'insurrection', Left: 26, Center: 11, Right: 4 },
  { term: 'riot', Left: 7, Center: 10, Right: 23 },
  { term: 'protest', Left: 19, Center: 21, Right: 16 },
  { term: 'invasion', Left: 4, Center: 6, Right: 29 },
  { term: 'humanitarian', Left: 21, Center: 14, Right: 8 },
];

export const omissionRadar = [
  { topic: 'Election machine audits', Left: 11, Center: 22, Right: 71 },
  { topic: 'Voter intimidation cases', Left: 72, Center: 47, Right: 16 },
  { topic: 'Asylum court backlog', Left: 33, Center: 44, Right: 67 },
  { topic: 'State aid budgets', Left: 52, Center: 37, Right: 19 },
  { topic: 'Detention contracts', Left: 61, Center: 31, Right: 13 },
];

export const reliabilityScatter = [
  { story: 'Leaked procurement memo', reliability: 38, engagement: 79, side: 'Right' },
  { story: 'Federal court filing brief', reliability: 88, engagement: 34, side: 'Center' },
  { story: 'Poll watcher testimony thread', reliability: 45, engagement: 71, side: 'Right' },
  { story: 'Civil rights org report', reliability: 76, engagement: 58, side: 'Left' },
  { story: 'Border budget markup', reliability: 90, engagement: 41, side: 'Center' },
  { story: 'Shelter intake livestream', reliability: 42, engagement: 82, side: 'Right' },
];

export const sampleAnnotations = [
  {
    id: 'a1',
    quote: 'Officials confirmed that millions of ineligible votes were counted overnight.',
    label: 'Contested claim',
    factChecks: ['PolitiFact: False', 'Snopes: Unsupported', 'FactCheck.org: No evidence presented'],
  },
  {
    id: 'a2',
    quote: 'The policy created a complete border collapse within 24 hours.',
    label: 'Loaded framing',
    factChecks: ['PolitiFact: Exaggerated', 'Snopes: Mixture', 'FactCheck.org: Missing context'],
  },
];

export const radarCards = [
  { id: 'r1', headline: 'County election logistics hearing clips top 2.4M views before cable pickup', source: 'Public Ledger', sourceUrl: 'https://example.com/1', mainstreamHits: 2, altEngagement: 2400000, viralityGap: 96, credibility: 'Mixed reliability', factCheck: 'https://www.politifact.com/', date: '2026-02-07' },
  { id: 'r2', headline: 'Regional shelter capacity report trends on Substack politics list', source: 'Civic Dispatch', sourceUrl: 'https://example.com/2', mainstreamHits: 4, altEngagement: 1780000, viralityGap: 91, credibility: 'Mostly factual', factCheck: 'https://www.snopes.com/', date: '2026-02-07' },
  { id: 'r3', headline: 'State procurement hearing transcript goes viral in policy forums', source: 'OpenState Notes', sourceUrl: 'https://example.com/3', mainstreamHits: 3, altEngagement: 1320000, viralityGap: 89, credibility: 'Unrated source', factCheck: 'https://www.factcheck.org/', date: '2026-02-06' },
  { id: 'r4', headline: 'Election observer hotline dataset circulated by independent newsletter', source: 'Signal Civic', sourceUrl: 'https://example.com/4', mainstreamHits: 5, altEngagement: 980000, viralityGap: 84, credibility: 'Mixed reliability', factCheck: 'https://www.factcheck.org/', date: '2026-02-06' },
  { id: 'r5', headline: 'Border county staffing memo drives creator explainers overnight', source: 'Frontline Brief', sourceUrl: 'https://example.com/5', mainstreamHits: 4, altEngagement: 860000, viralityGap: 81, credibility: 'Mostly factual', factCheck: 'https://www.snopes.com/', date: '2026-02-05' },
  { id: 'r6', headline: 'Court docket tracker spreadsheet shared across grassroots groups', source: 'Policy Radar', sourceUrl: 'https://example.com/6', mainstreamHits: 7, altEngagement: 730000, viralityGap: 78, credibility: 'Unrated source', factCheck: 'https://www.politifact.com/', date: '2026-02-05' },
  { id: 'r7', headline: 'NGO audit appendix circulates with little broadcast mention', source: 'Civic Lens', sourceUrl: 'https://example.com/7', mainstreamHits: 6, altEngagement: 690000, viralityGap: 74, credibility: 'Mostly factual', factCheck: 'https://www.factcheck.org/', date: '2026-02-04' },
  { id: 'r8', headline: 'Ballot adjudication webinar excerpt clipped into viral short-form posts', source: 'Metro Independent', sourceUrl: 'https://example.com/8', mainstreamHits: 8, altEngagement: 620000, viralityGap: 70, credibility: 'Mixed reliability', factCheck: 'https://www.snopes.com/', date: '2026-02-04' },
  { id: 'r9', headline: 'Legislative aide email thread sparks undercovered process debate', source: 'Statehouse Wire', sourceUrl: 'https://example.com/9', mainstreamHits: 9, altEngagement: 570000, viralityGap: 67, credibility: 'Unrated source', factCheck: 'https://www.factcheck.org/', date: '2026-02-03' },
  { id: 'r10', headline: 'Independent border court observer diary gains traction in policy circles', source: 'Independent Docket', sourceUrl: 'https://example.com/10', mainstreamHits: 10, altEngagement: 510000, viralityGap: 64, credibility: 'Mixed reliability', factCheck: 'https://www.politifact.com/', date: '2026-02-03' },
];

export const sampleArticleText = `A late-night segment claimed that officials confirmed that millions of ineligible votes were counted overnight, but no documents were shown. The host also argued that the policy created a complete border collapse within 24 hours, while interviews only cited local delays. Critics say both narratives spread because they reinforce prior beliefs.`;
