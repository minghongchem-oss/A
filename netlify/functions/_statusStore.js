const fs = require('node:fs');
const path = require('node:path');

const STATUS_PATH = path.join('/tmp', 'rawsignal-status.json');

const readStatus = () => {
  try {
    if (!fs.existsSync(STATUS_PATH)) {
      return {
        lastProvider: 'mock',
        lastReason: 'No live fetch recorded yet.',
        lastUpdated: new Date(0).toISOString(),
      };
    }
    return JSON.parse(fs.readFileSync(STATUS_PATH, 'utf8'));
  } catch {
    return {
      lastProvider: 'mock',
      lastReason: 'Status read failed.',
      lastUpdated: new Date(0).toISOString(),
    };
  }
};

const writeStatus = (provider, reason) => {
  const payload = {
    lastProvider: provider,
    lastReason: reason,
    lastUpdated: new Date().toISOString(),
  };
  try {
    fs.writeFileSync(STATUS_PATH, JSON.stringify(payload), 'utf8');
  } catch {
    // noop
  }
  return payload;
};

module.exports = { readStatus, writeStatus };
