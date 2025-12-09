// 가중치 기반 점수 계산 유틸리티

// 축별 지표 매핑
export const AXIS_METRICS = {
  activity: ['proposalRate', 'proposalCount', 'ibcOut'],
  volatility: ['priceVolatility', 'marketCap', 'transactionVolume', 'activeAddress'],
  persistence: ['stakingRatio', 'liveTime', 'nc']
};

/**
 * 축별 평균 점수 계산
 * @param {Object} metrics - 체인의 10개 지표 점수
 * @returns {Object} - 각 축의 평균 점수
 */
export function calculateAxisScores(metrics) {
  const axisScores = {};
  
  for (const [axis, metricNames] of Object.entries(AXIS_METRICS)) {
    const values = metricNames
      .map(name => metrics[name])
      .filter(v => v != null && !isNaN(v));
    
    axisScores[axis] = values.length > 0
      ? values.reduce((sum, v) => sum + v, 0) / values.length
      : 0;
  }
  
  return axisScores;
}

/**
 * 가중치를 적용한 최종 점수 계산
 * @param {Object} metrics - 체인의 10개 지표 점수
 * @param {Object} weights - 가중치 { activity: 30, volatility: 40, persistence: 30 }
 * @returns {number} - 가중치 적용된 최종 점수 (0-100)
 */
export function calculateWeightedScore(metrics, weights) {
  const axisScores = calculateAxisScores(metrics);
  
  const weightedScore = (
    (axisScores.activity * weights.activity) +
    (axisScores.volatility * weights.volatility) +
    (axisScores.persistence * weights.persistence)
  ) / 100;
  
  return Math.round(weightedScore * 100) / 100;
}

/**
 * 모든 체인의 점수를 가중치 적용하여 계산하고 정렬
 * @param {Array} chains - 체인 데이터 배열
 * @param {Object} weights - 가중치
 * @returns {Array} - 점수순으로 정렬된 체인 배열 (score 필드 포함)
 */
export function calculateAllScores(chains, weights) {
  return chains
    .map(chain => ({
      ...chain,
      score: calculateWeightedScore(chain.metrics, weights),
      axisScores: calculateAxisScores(chain.metrics)
    }))
    .sort((a, b) => b.score - a.score);
}

export default { calculateWeightedScore, calculateAllScores, calculateAxisScores, AXIS_METRICS };

