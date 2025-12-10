/**
 * Data validation script
 */
const data = require('../src/data/chainScores.json');

const AXIS_METRICS = {
  activity: ['proposalRate', 'proposalCount', 'ibcOut'],
  volatility: ['priceVolatility', 'marketCap', 'transactionVolume', 'activeAddress'],
  persistence: ['stakingRatio', 'liveTime', 'nc']
};

const allMetrics = [...AXIS_METRICS.activity, ...AXIS_METRICS.volatility, ...AXIS_METRICS.persistence];

console.log('=== DATA VALIDATION REPORT ===\n');

// Chain-level issues
console.log('--- CHAIN-LEVEL ISSUES ---\n');

const chainIssues = [];

Object.keys(data).forEach(chainId => {
  const chain = data[chainId];
  const issues = [];
  
  // Check data point count
  const dayCount = chain.dailyScores?.length || 0;
  if (dayCount < 180) {
    issues.push(`Only ${dayCount} days (expected 180)`);
  }
  
  // Count null/missing values per metric
  const metricNulls = {};
  allMetrics.forEach(m => metricNulls[m] = 0);
  
  chain.dailyScores?.forEach(day => {
    allMetrics.forEach(metric => {
      if (day.metrics[metric] === null || day.metrics[metric] === undefined) {
        metricNulls[metric]++;
      }
    });
  });
  
  // Find metrics with nulls
  const nullMetrics = Object.entries(metricNulls)
    .filter(([m, count]) => count > 0)
    .map(([m, count]) => `${m}(${count})`);
  
  if (nullMetrics.length > 0) {
    issues.push(`Missing: ${nullMetrics.join(', ')}`);
  }
  
  if (issues.length > 0) {
    chainIssues.push({ chainId, issues, dayCount });
  }
});

if (chainIssues.length === 0) {
  console.log('All chains have complete data!\n');
} else {
  chainIssues.forEach(({ chainId, issues, dayCount }) => {
    console.log(`${chainId.toUpperCase()} (${dayCount} days):`);
    issues.forEach(i => console.log(`  - ${i}`));
    console.log('');
  });
}

// Overall metric stats
console.log('--- METRIC-LEVEL SUMMARY ---\n');

const totalNulls = {};
allMetrics.forEach(m => totalNulls[m] = 0);

let totalDays = 0;
Object.keys(data).forEach(chainId => {
  const chain = data[chainId];
  totalDays += chain.dailyScores?.length || 0;
  chain.dailyScores?.forEach(day => {
    allMetrics.forEach(metric => {
      if (day.metrics[metric] === null || day.metrics[metric] === undefined) {
        totalNulls[metric]++;
      }
    });
  });
});

console.log(`Total data points: ${totalDays}\n`);

console.log('By Axis:');
console.log('\n[Activity]');
AXIS_METRICS.activity.forEach(m => {
  const pct = ((totalNulls[m] / totalDays) * 100).toFixed(1);
  const status = totalNulls[m] === 0 ? 'OK' : `${totalNulls[m]} missing (${pct}%)`;
  console.log(`  ${m}: ${status}`);
});

console.log('\n[Volatility]');
AXIS_METRICS.volatility.forEach(m => {
  const pct = ((totalNulls[m] / totalDays) * 100).toFixed(1);
  const status = totalNulls[m] === 0 ? 'OK' : `${totalNulls[m]} missing (${pct}%)`;
  console.log(`  ${m}: ${status}`);
});

console.log('\n[Sustainability]');
AXIS_METRICS.persistence.forEach(m => {
  const pct = ((totalNulls[m] / totalDays) * 100).toFixed(1);
  const status = totalNulls[m] === 0 ? 'OK' : `${totalNulls[m]} missing (${pct}%)`;
  console.log(`  ${m}: ${status}`);
});

// Score range check
console.log('\n--- SCORE RANGE CHECK ---\n');

let invalidScores = 0;
let minScore = Infinity;
let maxScore = -Infinity;

Object.keys(data).forEach(chainId => {
  const chain = data[chainId];
  chain.dailyScores?.forEach(day => {
    if (day.score < 0 || day.score > 100) {
      invalidScores++;
    }
    if (day.score < minScore) minScore = day.score;
    if (day.score > maxScore) maxScore = day.score;
  });
});

console.log(`Score range: ${minScore.toFixed(2)} - ${maxScore.toFixed(2)}`);
console.log(`Invalid scores (outside 0-100): ${invalidScores}`);

console.log('\n=== VALIDATION COMPLETE ===');

