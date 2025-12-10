/**
 * Comprehensive Data Validation Script
 * Checks all 37 chains × 180 days × 10 metrics
 */
const data = require('../src/data/chainScores.json');

const AXIS_METRICS = {
  activity: ['proposalRate', 'proposalCount', 'ibcOut'],
  volatility: ['priceVolatility', 'marketCap', 'transactionVolume', 'activeAddress'],
  sustainability: ['stakingRatio', 'liveTime', 'nc']
};

const allMetrics = [...AXIS_METRICS.activity, ...AXIS_METRICS.volatility, ...AXIS_METRICS.sustainability];

console.log('═══════════════════════════════════════════════════════════════');
console.log('       COMPREHENSIVE DATA VALIDATION REPORT');
console.log('       37 Chains × 180 Days × 10 Metrics');
console.log('═══════════════════════════════════════════════════════════════\n');

// Expected values
const EXPECTED_CHAINS = 37;
const EXPECTED_DAYS = 180;
const EXPECTED_METRICS = 10;
const TOTAL_EXPECTED = EXPECTED_CHAINS * EXPECTED_DAYS * EXPECTED_METRICS;

console.log(`Expected: ${EXPECTED_CHAINS} chains × ${EXPECTED_DAYS} days × ${EXPECTED_METRICS} metrics = ${TOTAL_EXPECTED.toLocaleString()} data points\n`);

// Collect all issues
const issues = [];
const chainSummary = [];

// Analyze each chain
const chainIds = Object.keys(data);
console.log(`Actual chains found: ${chainIds.length}\n`);

chainIds.forEach(chainId => {
  const chain = data[chainId];
  const chainIssues = [];
  const dayCount = chain.dailyScores?.length || 0;
  
  // Check day count
  if (dayCount !== EXPECTED_DAYS) {
    chainIssues.push({
      type: 'DAY_COUNT',
      message: `Only ${dayCount}/${EXPECTED_DAYS} days`,
      severity: dayCount < 90 ? 'HIGH' : 'MEDIUM'
    });
  }
  
  // Check for date gaps (missing days in sequence)
  if (chain.dailyScores && chain.dailyScores.length > 1) {
    const timestamps = chain.dailyScores.map(d => d.timestamp).sort((a, b) => b - a);
    const gaps = [];
    for (let i = 0; i < timestamps.length - 1; i++) {
      const diff = timestamps[i] - timestamps[i + 1];
      const dayDiff = diff / (24 * 60 * 60 * 1000);
      if (dayDiff > 1.5) { // More than 1.5 days gap
        const date1 = new Date(timestamps[i]).toISOString().split('T')[0];
        const date2 = new Date(timestamps[i + 1]).toISOString().split('T')[0];
        gaps.push(`${Math.round(dayDiff - 1)} days gap between ${date2} and ${date1}`);
      }
    }
    if (gaps.length > 0) {
      chainIssues.push({
        type: 'DATE_GAP',
        message: gaps.join('; '),
        severity: 'HIGH'
      });
    }
  }
  
  // Check each metric
  const metricStats = {};
  allMetrics.forEach(metric => {
    let nullCount = 0;
    let zeroCount = 0;
    let validCount = 0;
    
    chain.dailyScores?.forEach(day => {
      const value = day.metrics?.[metric];
      if (value === null || value === undefined) {
        nullCount++;
      } else if (value === 0) {
        zeroCount++;
      } else {
        validCount++;
      }
    });
    
    metricStats[metric] = { nullCount, zeroCount, validCount, total: dayCount };
    
    if (nullCount > 0) {
      const pct = ((nullCount / dayCount) * 100).toFixed(1);
      chainIssues.push({
        type: 'MISSING_METRIC',
        metric: metric,
        message: `${metric}: ${nullCount}/${dayCount} missing (${pct}%)`,
        severity: nullCount === dayCount ? 'HIGH' : nullCount > dayCount * 0.5 ? 'MEDIUM' : 'LOW'
      });
    }
  });
  
  // Calculate completeness score
  let totalValid = 0;
  let totalExpected = dayCount * EXPECTED_METRICS;
  allMetrics.forEach(m => {
    totalValid += metricStats[m].validCount;
  });
  const completeness = totalExpected > 0 ? ((totalValid / totalExpected) * 100).toFixed(1) : 0;
  
  chainSummary.push({
    chainId,
    dayCount,
    completeness,
    issues: chainIssues,
    metricStats
  });
});

// Sort by completeness
chainSummary.sort((a, b) => parseFloat(a.completeness) - parseFloat(b.completeness));

// Print detailed results
console.log('═══════════════════════════════════════════════════════════════');
console.log('                    CHAIN-BY-CHAIN ANALYSIS');
console.log('═══════════════════════════════════════════════════════════════\n');

// Chains with issues
const chainsWithIssues = chainSummary.filter(c => c.issues.length > 0);
const perfectChains = chainSummary.filter(c => c.issues.length === 0);

console.log(`✅ Perfect chains (100% complete): ${perfectChains.length}`);
perfectChains.forEach(c => console.log(`   - ${c.chainId}`));

console.log(`\n⚠️  Chains with issues: ${chainsWithIssues.length}\n`);

chainsWithIssues.forEach(chain => {
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`${chain.chainId.toUpperCase()}`);
  console.log(`Days: ${chain.dayCount}/${EXPECTED_DAYS} | Completeness: ${chain.completeness}%`);
  console.log('');
  
  // Group issues by type
  const dayIssues = chain.issues.filter(i => i.type === 'DAY_COUNT' || i.type === 'DATE_GAP');
  const metricIssues = chain.issues.filter(i => i.type === 'MISSING_METRIC');
  
  if (dayIssues.length > 0) {
    console.log('  📅 Day Issues:');
    dayIssues.forEach(i => console.log(`     [${i.severity}] ${i.message}`));
  }
  
  if (metricIssues.length > 0) {
    console.log('  📊 Missing Metrics:');
    
    // Group by axis
    const activityIssues = metricIssues.filter(i => AXIS_METRICS.activity.includes(i.metric));
    const volatilityIssues = metricIssues.filter(i => AXIS_METRICS.volatility.includes(i.metric));
    const sustainabilityIssues = metricIssues.filter(i => AXIS_METRICS.sustainability.includes(i.metric));
    
    if (activityIssues.length > 0) {
      console.log('     [Activity]');
      activityIssues.forEach(i => console.log(`       - ${i.message}`));
    }
    if (volatilityIssues.length > 0) {
      console.log('     [Volatility]');
      volatilityIssues.forEach(i => console.log(`       - ${i.message}`));
    }
    if (sustainabilityIssues.length > 0) {
      console.log('     [Sustainability]');
      sustainabilityIssues.forEach(i => console.log(`       - ${i.message}`));
    }
  }
  console.log('');
});

// Summary statistics
console.log('═══════════════════════════════════════════════════════════════');
console.log('                       OVERALL SUMMARY');
console.log('═══════════════════════════════════════════════════════════════\n');

// Calculate totals
let totalDataPoints = 0;
let totalMissing = 0;
const metricTotals = {};
allMetrics.forEach(m => metricTotals[m] = { valid: 0, missing: 0, total: 0 });

chainSummary.forEach(chain => {
  allMetrics.forEach(m => {
    const stats = chain.metricStats[m];
    metricTotals[m].valid += stats.validCount;
    metricTotals[m].missing += stats.nullCount;
    metricTotals[m].total += stats.total;
    totalDataPoints += stats.total;
    totalMissing += stats.nullCount;
  });
});

console.log('METRIC COMPLETENESS:');
console.log('');

console.log('[Activity Axis]');
AXIS_METRICS.activity.forEach(m => {
  const stats = metricTotals[m];
  const pct = ((stats.valid / stats.total) * 100).toFixed(1);
  const status = stats.missing === 0 ? '✅' : stats.missing < 100 ? '⚠️ ' : '❌';
  console.log(`  ${status} ${m.padEnd(20)} ${stats.valid}/${stats.total} (${pct}%) - ${stats.missing} missing`);
});

console.log('\n[Volatility Axis]');
AXIS_METRICS.volatility.forEach(m => {
  const stats = metricTotals[m];
  const pct = ((stats.valid / stats.total) * 100).toFixed(1);
  const status = stats.missing === 0 ? '✅' : stats.missing < 100 ? '⚠️ ' : '❌';
  console.log(`  ${status} ${m.padEnd(20)} ${stats.valid}/${stats.total} (${pct}%) - ${stats.missing} missing`);
});

console.log('\n[Sustainability Axis]');
AXIS_METRICS.sustainability.forEach(m => {
  const stats = metricTotals[m];
  const pct = ((stats.valid / stats.total) * 100).toFixed(1);
  const status = stats.missing === 0 ? '✅' : stats.missing < 100 ? '⚠️ ' : '❌';
  console.log(`  ${status} ${m.padEnd(20)} ${stats.valid}/${stats.total} (${pct}%) - ${stats.missing} missing`);
});

// Final summary
const totalValidPoints = totalDataPoints - totalMissing;
const overallCompleteness = ((totalValidPoints / totalDataPoints) * 100).toFixed(2);

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('FINAL STATISTICS:');
console.log(`  Total data points:     ${totalDataPoints.toLocaleString()}`);
console.log(`  Valid data points:     ${totalValidPoints.toLocaleString()}`);
console.log(`  Missing data points:   ${totalMissing.toLocaleString()}`);
console.log(`  Overall completeness:  ${overallCompleteness}%`);
console.log(`  Perfect chains:        ${perfectChains.length}/${chainIds.length}`);
console.log(`  Chains with issues:    ${chainsWithIssues.length}/${chainIds.length}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// List all issues by severity
console.log('═══════════════════════════════════════════════════════════════');
console.log('                    ISSUES BY SEVERITY');
console.log('═══════════════════════════════════════════════════════════════\n');

const highIssues = [];
const mediumIssues = [];
const lowIssues = [];

chainsWithIssues.forEach(chain => {
  chain.issues.forEach(issue => {
    const item = { chain: chain.chainId, ...issue };
    if (issue.severity === 'HIGH') highIssues.push(item);
    else if (issue.severity === 'MEDIUM') mediumIssues.push(item);
    else lowIssues.push(item);
  });
});

if (highIssues.length > 0) {
  console.log(`🔴 HIGH SEVERITY (${highIssues.length}):`);
  highIssues.forEach(i => console.log(`   ${i.chain}: ${i.message}`));
  console.log('');
}

if (mediumIssues.length > 0) {
  console.log(`🟡 MEDIUM SEVERITY (${mediumIssues.length}):`);
  mediumIssues.forEach(i => console.log(`   ${i.chain}: ${i.message}`));
  console.log('');
}

if (lowIssues.length > 0) {
  console.log(`🟢 LOW SEVERITY (${lowIssues.length}):`);
  lowIssues.forEach(i => console.log(`   ${i.chain}: ${i.message}`));
  console.log('');
}

console.log('═══════════════════════════════════════════════════════════════');
console.log('                    VALIDATION COMPLETE');
console.log('═══════════════════════════════════════════════════════════════');

