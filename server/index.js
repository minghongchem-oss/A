import cors from 'cors';
import express from 'express';

const app = express();
const port = process.env.PORT || 8787;

app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => {
  res.json({ ok: true, service: 'unspun-api', date: new Date().toISOString() });
});

app.get('/api/methodology', (_, res) => {
  res.json({
    mission: 'Expose political media mechanics without editorialized AI summaries.',
    notes: [
      'Left/Center/Right source cohorts are mapped from third-party bias datasets (AllSides/MBFC style).',
      'Virality gap compares alternative-platform engagement rank vs mainstream citation rank.',
      'Fact-check labels are display-only hints and must be verified through linked checkers.',
    ],
    sources: ['https://newsapi.org', 'https://www.allsides.com/media-bias', 'https://mediabiasfactcheck.com'],
  });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Unspun API listening on :${port}`);
});
