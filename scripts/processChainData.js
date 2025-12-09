/**
 * 체인 데이터 처리 스크립트
 * CSV 파일들을 파싱하여 10개 지표의 일별 데이터를 추출하고
 * 정규화하여 최종 안정성 점수를 계산합니다.
 * 
 * 실행: node scripts/processChainData.js
 */

const fs = require('fs');
const path = require('path');

// 체인 목록 (37개)
const CHAINS = [
  { id: 'cosmos', folder: 'Cosmos' },
  { id: 'babylon', folder: 'Babylon' },
  { id: 'osmosis', folder: 'Osmosis' },
  { id: 'secret', folder: 'Secret' },
  { id: 'agoric', folder: 'Agoric' },
  { id: 'akash', folder: 'Akash' },
  { id: 'althea', folder: 'Althea', issues: ['marketCap_null'] },
  { id: 'archway', folder: 'Archway' },
  { id: 'atomone', folder: 'AtomOne' },
  { id: 'axelar', folder: 'Axelar', issues: ['tokenSupply_zero'] },
  { id: 'band', folder: 'Band' },
  { id: 'celestia', folder: 'Celestia' },
  { id: 'chihuahua', folder: 'Chihuahua' },
  { id: 'coreum', folder: 'Coreum' },
  { id: 'cronos', folder: 'Cronos POS' },
  { id: 'dydx', folder: 'DYDX' },
  { id: 'asi', folder: 'ASI Alliance', issues: ['tokenSupply_zero'] },
  { id: 'gravity', folder: 'Gravity Bridge' },
  { id: 'humans', folder: 'Humans.ai' },
  { id: 'injective', folder: 'Injective' },
  { id: 'kava', folder: 'Kava' },
  { id: 'mantra', folder: 'Mantra' },
  { id: 'medibloc', folder: 'MediBloc' },
  { id: 'milkyway', folder: 'MilkyWay', issues: ['recent_5days_null'] },
  { id: 'neutron', folder: 'Neutron' },
  { id: 'nillion', folder: 'Nillion' },
  { id: 'persistence', folder: 'Persistence' },
  { id: 'provenance', folder: 'Provenance' },
  { id: 'regen', folder: 'Regen' },
  { id: 'saga', folder: 'Saga' },
  { id: 'sei', folder: 'Sei' },
  { id: 'shentu', folder: 'Shentu' },
  { id: 'stargaze', folder: 'Stargaze' },
  { id: 'stride', folder: 'Stride' },
  { id: 'terra', folder: 'Terra' },
  { id: 'xion', folder: 'Xion' },
  { id: 'xpla', folder: 'XPLA' },
];

// 체인 출시일
const CHAIN_LAUNCH_DATES = {
  cosmos: new Date('2019-03-13'),
  osmosis: new Date('2021-06-19'),
  secret: new Date('2020-02-13'),
  agoric: new Date('2022-05-28'),
  akash: new Date('2020-09-25'),
  althea: new Date('2024-04-24'),
  archway: new Date('2023-06-14'),
  atomone: new Date('2024-02-27'),
  axelar: new Date('2022-02-07'),
  babylon: new Date('2024-04-09'),
  band: new Date('2020-06-10'),
  celestia: new Date('2023-10-31'),
  chihuahua: new Date('2022-01-04'),
  coreum: new Date('2023-03-25'),
  cronos: new Date('2021-03-25'),
  dydx: new Date('2023-10-26'),
  asi: new Date('2021-03-31'),
  gravity: new Date('2021-12-14'),
  humans: new Date('2023-01-18'),
  injective: new Date('2021-11-17'),
  kava: new Date('2019-11-14'),
  mantra: new Date('2024-10-23'),
  medibloc: new Date('2021-05-12'),
  milkyway: new Date('2024-06-01'),
  neutron: new Date('2023-05-10'),
  nillion: new Date('2024-03-20'),
  persistence: new Date('2021-03-30'),
  provenance: new Date('2021-03-26'),
  regen: new Date('2021-04-15'),
  saga: new Date('2024-04-09'),
  sei: new Date('2023-08-15'),
  shentu: new Date('2019-10-24'),
  stargaze: new Date('2021-10-29'),
  stride: new Date('2022-09-05'),
  terra: new Date('2022-05-28'),
  xion: new Date('2024-03-07'),
  xpla: new Date('2022-04-25'),
};

const DATA_DIR = path.join(__dirname, '..', 'public', 'data');
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data');

// CSV 파싱 함수
function parseCSV(content) {
  const lines = content.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',');
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row = {};
    headers.forEach((header, index) => {
      let value = values[index];
      // 숫자 변환 시도
      if (value && !isNaN(value) && value !== 'null' && value !== 'undefined') {
        row[header] = parseFloat(value);
      } else if (value === 'null' || value === 'undefined' || value === '') {
        row[header] = null;
      } else {
        row[header] = value;
      }
    });
    data.push(row);
  }
  
  return data;
}

// 파일 읽기 함수
function readCSVFile(chainFolder, filePrefix) {
  const files = fs.readdirSync(path.join(DATA_DIR, chainFolder));
  const targetFile = files.find(f => f.toLowerCase().startsWith(filePrefix.toLowerCase()));
  
  if (!targetFile) {
    console.warn(`  ⚠️ File not found: ${filePrefix} in ${chainFolder}`);
    return [];
  }
  
  const content = fs.readFileSync(path.join(DATA_DIR, chainFolder, targetFile), 'utf-8');
  return parseCSV(content);
}

// NC (나카모토 계수) 계산
function calculateNC(validators) {
  if (!validators || validators.length === 0) return null;
  
  // 투표력 기준 정렬
  const sorted = validators
    .filter(v => v.votingPower != null)
    .sort((a, b) => b.votingPower - a.votingPower);
  
  if (sorted.length === 0) return null;
  
  let cumulative = 0;
  let count = 0;
  
  for (const validator of sorted) {
    cumulative += validator.votingPower;
    count++;
    if (cumulative >= 0.334) { // 33.4%
      return count;
    }
  }
  
  return count;
}

// 일별 Proposal Rate 계산 (최근 30일 이동 윈도우)
function calculateProposalRate(proposals, targetDate, tokenBonded) {
  if (!proposals || proposals.length === 0 || !tokenBonded) return null;
  
  const windowStart = targetDate - (30 * 24 * 60 * 60 * 1000);
  
  const recentProposals = proposals.filter(p => {
    const endTime = p.timeVotingEnd;
    return endTime && endTime >= windowStart && endTime <= targetDate;
  });
  
  if (recentProposals.length === 0) return null;
  
  let totalVotes = 0;
  recentProposals.forEach(p => {
    totalVotes += (p.voteYes || 0) + (p.voteNo || 0) + (p.voteAbstain || 0) + (p.voteNoWithVeto || 0);
  });
  
  return totalVotes / tokenBonded;
}

// 일별 Proposal Count 계산 (최근 30일)
function calculateProposalCount(proposals, targetDate) {
  if (!proposals || proposals.length === 0) return 0;
  
  const windowStart = targetDate - (30 * 24 * 60 * 60 * 1000);
  
  return proposals.filter(p => {
    const submitTime = p.timeSubmit;
    return submitTime && submitTime >= windowStart && submitTime <= targetDate;
  }).length;
}

// IBC Out 계산 (해당 일자)
function calculateIBCOut(relayerData, targetDate) {
  if (!relayerData || relayerData.length === 0) return 0;
  
  // timestamp를 일자 기준으로 매칭 (±12시간)
  const dayStart = targetDate - (12 * 60 * 60 * 1000);
  const dayEnd = targetDate + (12 * 60 * 60 * 1000);
  
  let total = 0;
  relayerData.forEach(row => {
    if (row.timestamp >= dayStart && row.timestamp <= dayEnd) {
      total += row.messages || 0;
    }
  });
  
  return total;
}

// 메인 처리 함수
async function processAllChains() {
  console.log('🚀 Starting data processing for 37 chains...\n');
  
  const allChainData = {};
  const allTimestamps = new Set();
  
  // 1. 각 체인의 raw 데이터 수집
  for (const chain of CHAINS) {
    console.log(`📊 Processing ${chain.id}...`);
    
    try {
      // CSV 파일 읽기
      const baseInfo = readCSVFile(chain.folder, 'base information');
      const txCount = readCSVFile(chain.folder, 'block transaction count');
      const proposals = readCSVFile(chain.folder, 'proposals');
      const validators = readCSVFile(chain.folder, 'validators');
      const relayer = readCSVFile(chain.folder, 'Relayer Transfer Volume');
      
      // timestamp 수집
      baseInfo.forEach(row => {
        if (row.timestamp) allTimestamps.add(row.timestamp);
      });
      
      // 일별 데이터 구성
      const dailyData = {};
      
      baseInfo.forEach(row => {
        const ts = row.timestamp;
        if (!ts) return;
        
        const date = new Date(ts);
        
        // 해당 일자의 validators 데이터 찾기
        const dayValidators = validators.filter(v => {
          return v.timestamp && Math.abs(v.timestamp - ts) < 12 * 60 * 60 * 1000;
        });
        
        // 해당 일자의 txCount 찾기
        const dayTx = txCount.find(t => {
          return t.timestamp && Math.abs(t.timestamp - ts) < 12 * 60 * 60 * 1000;
        });
        
        // Live Time 계산
        const launchDate = CHAIN_LAUNCH_DATES[chain.id];
        const liveTimeDays = launchDate ? Math.floor((date - launchDate) / (1000 * 60 * 60 * 24)) : null;
        
        // Staking Ratio 계산
        let stakingRatio = null;
        const tokenBonded = row.tokenBonded;
        // tokenSupply가 0인 경우 marketSupplyTotal 사용
        let totalSupply = row.tokenSupply;
        if (!totalSupply || totalSupply === 0) {
          totalSupply = row.marketSupplyTotal || row.marketSupplyCirculating;
        }
        if (tokenBonded && totalSupply && totalSupply > 0) {
          stakingRatio = tokenBonded / totalSupply;
        }
        
        // Market Cap 처리 (Althea 같이 null인 경우)
        let marketCap = row.marketCap;
        if (!marketCap && row.marketPrice && row.marketSupplyCirculating) {
          marketCap = row.marketPrice * row.marketSupplyCirculating;
        }
        
        dailyData[ts] = {
          timestamp: ts,
          date: date.toISOString().split('T')[0],
          metrics: {
            priceVolatility: Math.abs(row.marketChangePercentage24h || 0),
            marketCap: marketCap,
            transactionVolume: row.marketVolume,
            stakingRatio: stakingRatio,
            activeAddress: row.accountsMonthly,
            liveTime: liveTimeDays,
            nc: calculateNC(dayValidators),
            proposalRate: calculateProposalRate(proposals, ts, tokenBonded),
            proposalCount: calculateProposalCount(proposals, ts),
            ibcOut: calculateIBCOut(relayer, ts),
          },
        };
      });
      
      allChainData[chain.id] = {
        id: chain.id,
        folder: chain.folder,
        issues: chain.issues || [],
        dailyData: dailyData,
        dataPoints: Object.keys(dailyData).length,
      };
      
      console.log(`  ✅ ${Object.keys(dailyData).length} days of data collected`);
      
    } catch (error) {
      console.error(`  ❌ Error processing ${chain.id}:`, error.message);
    }
  }
  
  // 2. 공통 timestamp 추출 (모든 체인에 있는 날짜만)
  const timestamps = Array.from(allTimestamps).sort((a, b) => b - a).slice(0, 180);
  console.log(`\n📅 Using ${timestamps.length} common timestamps for analysis`);
  
  // 3. 정규화 및 점수 계산
  console.log('\n📈 Normalizing metrics and calculating scores...');
  
  const metricKeys = [
    'priceVolatility', 'marketCap', 'transactionVolume', 'stakingRatio',
    'activeAddress', 'liveTime', 'nc', 'proposalRate', 'proposalCount', 'ibcOut'
  ];
  
  // 각 지표별 방향 (높을수록 좋은지 여부)
  const higherIsBetter = {
    priceVolatility: false, // 낮을수록 안정적
    marketCap: true,
    transactionVolume: true,
    stakingRatio: true,
    activeAddress: true,
    liveTime: true,
    nc: true,
    proposalRate: true,
    proposalCount: true,
    ibcOut: true,
  };
  
  // 각 timestamp별로 정규화
  const finalResults = {};
  
  timestamps.forEach(ts => {
    // 해당 timestamp의 모든 체인 데이터 수집
    const chainValues = {};
    metricKeys.forEach(metric => {
      chainValues[metric] = [];
    });
    
    CHAINS.forEach(chain => {
      const chainData = allChainData[chain.id];
      if (chainData && chainData.dailyData[ts]) {
        const metrics = chainData.dailyData[ts].metrics;
        metricKeys.forEach(metric => {
          const value = metrics[metric];
          if (value != null && !isNaN(value) && isFinite(value)) {
            chainValues[metric].push({ chainId: chain.id, value });
          }
        });
      }
    });
    
    // 각 지표 정규화 (0-100)
    const normalizedScores = {};
    
    metricKeys.forEach(metric => {
      const values = chainValues[metric];
      if (values.length === 0) return;
      
      const minVal = Math.min(...values.map(v => v.value));
      const maxVal = Math.max(...values.map(v => v.value));
      const range = maxVal - minVal;
      
      values.forEach(({ chainId, value }) => {
        if (!normalizedScores[chainId]) {
          normalizedScores[chainId] = {};
        }
        
        let score;
        if (range === 0) {
          score = 50; // 모든 값이 같으면 중간 점수
        } else {
          score = ((value - minVal) / range) * 100;
          // 낮을수록 좋은 지표는 반전
          if (!higherIsBetter[metric]) {
            score = 100 - score;
          }
        }
        
        normalizedScores[chainId][metric] = Math.round(score * 100) / 100;
      });
    });
    
    // 최종 안정성 점수 계산 (10개 지표 평균)
    Object.keys(normalizedScores).forEach(chainId => {
      const scores = normalizedScores[chainId];
      const validScores = Object.values(scores).filter(s => s != null);
      const avgScore = validScores.length > 0 
        ? validScores.reduce((a, b) => a + b, 0) / validScores.length 
        : 0;
      
      if (!finalResults[chainId]) {
        finalResults[chainId] = {
          id: chainId,
          dailyScores: [],
          metricScores: {},
        };
        metricKeys.forEach(m => {
          finalResults[chainId].metricScores[m] = [];
        });
      }
      
      finalResults[chainId].dailyScores.push({
        timestamp: ts,
        date: new Date(ts).toISOString().split('T')[0],
        score: Math.round(avgScore * 100) / 100,
        metrics: scores,
      });
      
      // 지표별 점수도 저장
      metricKeys.forEach(m => {
        if (scores[m] != null) {
          finalResults[chainId].metricScores[m].push({
            timestamp: ts,
            score: scores[m],
          });
        }
      });
    });
  });
  
  // 4. 180일 평균 계산 및 랭킹
  console.log('\n🏆 Calculating 180-day averages and rankings...');
  
  const rankings = [];
  
  Object.keys(finalResults).forEach(chainId => {
    const chainResult = finalResults[chainId];
    const scores = chainResult.dailyScores.map(d => d.score);
    const avgScore = scores.length > 0 
      ? scores.reduce((a, b) => a + b, 0) / scores.length 
      : 0;
    
    // 각 지표별 평균도 계산
    const metricAverages = {};
    metricKeys.forEach(m => {
      const metricScores = chainResult.metricScores[m].map(d => d.score);
      metricAverages[m] = metricScores.length > 0
        ? Math.round((metricScores.reduce((a, b) => a + b, 0) / metricScores.length) * 100) / 100
        : null;
    });
    
    const chain = CHAINS.find(c => c.id === chainId);
    
    rankings.push({
      id: chainId,
      name: chain ? chain.folder : chainId,
      avgScore: Math.round(avgScore * 100) / 100,
      metricAverages: metricAverages,
      dataPoints: scores.length,
    });
    
    finalResults[chainId].avgScore = Math.round(avgScore * 100) / 100;
    finalResults[chainId].metricAverages = metricAverages;
  });
  
  // 랭킹 정렬
  rankings.sort((a, b) => b.avgScore - a.avgScore);
  rankings.forEach((chain, index) => {
    chain.rank = index + 1;
    finalResults[chain.id].rank = index + 1;
  });
  
  // 5. 결과 저장
  console.log('\n💾 Saving results...');
  
  // 랭킹 데이터 저장
  const rankingOutput = {
    generatedAt: new Date().toISOString(),
    totalChains: rankings.length,
    period: '180 days',
    rankings: rankings,
  };
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'rankings.json'),
    JSON.stringify(rankingOutput, null, 2)
  );
  console.log('  ✅ rankings.json saved');
  
  // 상세 데이터 저장 (일별 점수 포함)
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'chainScores.json'),
    JSON.stringify(finalResults, null, 2)
  );
  console.log('  ✅ chainScores.json saved');
  
  // 콘솔에 랭킹 출력
  console.log('\n🏆 Final Rankings (180-day average):');
  console.log('─'.repeat(60));
  rankings.slice(0, 10).forEach(chain => {
    console.log(`  ${chain.rank}. ${chain.name.padEnd(20)} ${chain.avgScore.toFixed(2)} points`);
  });
  console.log('  ...');
  console.log(`  ${rankings.length}. ${rankings[rankings.length - 1].name.padEnd(20)} ${rankings[rankings.length - 1].avgScore.toFixed(2)} points`);
  
  console.log('\n✅ Data processing complete!');
}

// 실행
processAllChains().catch(console.error);

