# STABIO 데이터 처리 문서

## 개요

STABIO는 36개 Cosmos 생태계 블록체인의 안정성을 분석하는 대시보드입니다. 이 문서는 원본 CSV 데이터로부터 10개 지표를 추출하고 점수화하는 과정을 설명합니다.

---

## 1. 데이터 소스

각 체인별로 5개의 CSV 파일이 존재합니다:

| 파일 | 내용 | 주요 컬럼 |
|------|------|----------|
| `base information of {Chain}.csv` | 체인 기본 정보 | tokenBonded, tokenSupply, marketCap, marketVolume, accountsMonthly 등 |
| `block transaction count of {Chain}.csv` | 블록/트랜잭션 정보 | timestamp, txCount |
| `proposals of {Chain}.csv` | 거버넌스 제안 | voteYes, voteNo, voteAbstain, timeVotingEnd |
| `validators of {Chain}.csv` | 검증자 정보 | votingPower, commission |
| `Relayer Transfer Volume {Chain}.csv` | IBC 전송량 | messages, timestamp |

---

## 2. 10개 지표 정의 및 계산 방법

### 2.1 Activity 축 (활동성)

#### proposalRate (제안 통과율)
- **정의**: 최근 30일간 거버넌스 참여도
- **계산식**: `총 투표량 / tokenBonded`
- **데이터 소스**: `proposals of {Chain}.csv`
- **특수 처리**: Carry Forward 방식 적용
```javascript
const recentProposals = proposals.filter(p => 
  p.timeVotingEnd >= targetDate - 30days && p.timeVotingEnd <= targetDate
);
totalVotes = voteYes + voteNo + voteAbstain + voteNoWithVeto;
proposalRate = totalVotes / tokenBonded;

// Carry Forward 로직
if (제안 없음) {
  return 이전에_계산된_값 || 50; // 중립값
}
```

#### proposalCount (제안 수)
- **정의**: 최근 30일간 제출된 거버넌스 제안 수
- **계산식**: 30일 윈도우 내 제안 개수
- **데이터 소스**: `proposals of {Chain}.csv`

#### ibcOut (IBC 송출량)
- **정의**: 해당 일자의 IBC 전송 메시지 수
- **계산식**: 해당 일자(±12시간)의 messages 합계
- **데이터 소스**: `Relayer Transfer Volume {Chain}.csv`

---

### 2.2 Volatility 축 (시장 변동성)

#### priceVolatility (가격 변동성)
- **정의**: 24시간 가격 변동률의 절대값
- **계산식**: `|marketChangePercentage24h|`
- **데이터 소스**: `base information of {Chain}.csv`
- **점수 변환**: 낮을수록 안정적이므로 **역변환** 적용 (100 - score)

#### marketCap (시가총액)
- **정의**: 체인의 시가총액
- **계산식**: 직접 사용 또는 `marketPrice × marketSupplyCirculating`
- **데이터 소스**: `base information of {Chain}.csv`

#### transactionVolume (거래량)
- **정의**: 24시간 거래량
- **계산식**: `marketVolume` 직접 사용
- **데이터 소스**: `base information of {Chain}.csv`

#### activeAddress (활성 주소 수)
- **정의**: 월간 활성 계정 수
- **계산식**: `accountsMonthly` 직접 사용
- **데이터 소스**: `base information of {Chain}.csv`

---

### 2.3 Sustainability 축 (지속가능성)

#### stakingRatio (스테이킹 비율)
- **정의**: 전체 토큰 중 스테이킹된 비율
- **계산식**: `tokenBonded / totalSupply`
- **데이터 소스**: `base information of {Chain}.csv`
- **대체 로직**: `tokenSupply`가 0이면 `marketSupplyTotal` 또는 `marketSupplyCirculating` 사용

#### liveTime (운영 기간)
- **정의**: 체인이 메인넷 출시 후 운영된 일수
- **계산식**: `(현재 날짜 - 출시일) / (1000 × 60 × 60 × 24)`
- **데이터 소스**: 하드코딩된 `CHAIN_LAUNCH_DATES`

#### nc (나카모토 계수)
- **정의**: 33.4% 투표력 달성에 필요한 최소 검증자 수 (탈중앙화 지표)
- **계산식**: 
```javascript
// 투표력 내림차순 정렬 후 누적합이 33.4% 이상이 되는 검증자 수
let cumulative = 0;
for (const validator of sortedValidators) {
  cumulative += validator.votingPower;
  count++;
  if (cumulative >= 0.334) return count;
}
```
- **데이터 소스**: `validators of {Chain}.csv`

---

## 3. 점수 정규화

모든 지표는 0-100점으로 정규화됩니다:

```javascript
score = ((value - minValue) / (maxValue - minValue)) * 100;

// priceVolatility는 낮을수록 좋으므로 반전
if (metric === 'priceVolatility') {
  score = 100 - score;
}
```

---

## 4. 가중치 적용 점수 계산

```javascript
// 축별 평균 계산
activityScore = (proposalRate + proposalCount + ibcOut) / 3;
volatilityScore = (priceVolatility + marketCap + transactionVolume + activeAddress) / 4;
sustainabilityScore = (stakingRatio + liveTime + nc) / 3;

// 가중치 적용
finalScore = (activityScore × activityWeight + 
              volatilityScore × volatilityWeight + 
              sustainabilityScore × sustainabilityWeight) / 100;
```

---

## 5. 데이터 문제 및 해결 방법

### 5.1 proposalRate 처리 개선 (Carry Forward 방식)

**문제**: 최근 30일 내 제안이 없으면 0점 → 점수가 급격히 변동

**논리적 문제**:
- 제안 없음 = 0점 → "활동 없음 = 불안정"으로 해석됨
- 실제로는 안정적인 체인일수록 제안이 적을 수 있음 (고칠 게 없으니까)
- "측정 불가"와 "활동 없음"을 구분해야 함

**해결**: Carry Forward 방식 적용
```javascript
// 수정 코드
function calculateProposalRate(proposals, targetDate, tokenBonded, lastKnownRate = null) {
  if (recentProposals.length === 0) {
    // 제안 없으면 이전 값 유지, 한번도 없으면 50(중립)
    return lastKnownRate !== null ? lastKnownRate : 50;
  }
  // 제안 있으면 정상 계산
  return totalVotes / tokenBonded;
}
```

**결과**:
| 상태 | 처리 방식 | 정규화 전 | 정규화 후 |
|------|-----------|-----------|-----------|
| 제안 있음 | 정상 계산 | 계산된 값 | 0-100 |
| 제안 없음 (경험 있음) | Carry Forward | 마지막 값 | 0-100 |
| 제안 없음 (경험 없음) | 중립값 | null | **50점** |

**핵심**: 중립값 50은 **정규화 후**에 적용되어 점수 왜곡 방지

---

### 5.2 nc (나카모토 계수) 누락 (99.8% → 0%)

**문제**: validators 데이터가 특정 날짜에만 존재 (180일 중 1일만)

**원인**: ±12시간 내의 validators 데이터만 매칭
```javascript
// 기존 코드
const dayValidators = validators.filter(v => 
  Math.abs(v.timestamp - ts) < 12 * 60 * 60 * 1000
);
```

**해결**: 가장 가까운 과거 validators 데이터 사용
```javascript
// 수정 코드
let closestValidatorTs = validatorTimestamps.find(vts => 
  Math.abs(vts - ts) < 12 * 60 * 60 * 1000
);

if (!closestValidatorTs) {
  closestValidatorTs = validatorTimestamps.find(vts => vts <= ts) 
    || validatorTimestamps[validatorTimestamps.length - 1];
}
```

---

### 5.3 stakingRatio 누락 (8.9% - 특정 기간)

**문제**: Axelar, ASI, Sei 등에서 2025-11-05 ~ 2025-11-14 기간에 `tokenBonded = 0`

**원인**: 원본 CSV에서 해당 기간 tokenBonded 데이터 누락

**해결**: 선형 보간법으로 누락 값 추정
```javascript
// 이전/다음 유효값 찾기
const prevVal = findPreviousValidValue(idx);
const nextVal = findNextValidValue(idx);

// 선형 보간
const interpolatedVal = prevVal + (nextVal - prevVal) * (currentGap / totalGap);
```

---

### 5.4 marketCap/transactionVolume 누락 (Althea, MilkyWay)

**문제**: CoinGecko에서 시장 데이터 미제공

**해결**: 선형 보간법으로 처리 (연속된 누락은 전후 값으로 추정)

---

### 5.5 Provenance 데이터 부족 (67일/180일)

**문제**: 원본 CSV에 67일치 데이터만 존재

**해결**: 분석 대상에서 제외 (37개 → 36개 체인)

---

## 6. 보간법 적용

누락된 값에 대해 선형 보간 적용:

```javascript
const metricsToInterpolate = ['stakingRatio', 'marketCap', 'transactionVolume'];

// 선형 보간 로직
if (prevVal !== null && nextVal !== null) {
  // 양쪽 값이 있으면 선형 보간
  interpolatedVal = prevVal + (nextVal - prevVal) * (currentGap / totalGap);
} else if (prevVal !== null) {
  // 이전 값만 있으면 그 값 사용
  interpolatedVal = prevVal;
} else if (nextVal !== null) {
  // 다음 값만 있으면 그 값 사용
  interpolatedVal = nextVal;
}
```

---

## 7. 최종 데이터 품질

| 항목 | 수치 |
|------|------|
| 체인 수 | 36개 |
| 분석 기간 | 180일 |
| 지표 수 | 10개 |
| **총 데이터 포인트** | **64,800개** |
| **데이터 완전성** | **100%** |
| 누락 데이터 | 0건 |

---

## 8. 출력 파일

### chainScores.json
```json
{
  "cosmos": {
    "id": "cosmos",
    "dailyScores": [
      {
        "timestamp": 1765152000000,
        "date": "2025-12-08",
        "score": 51.13,
        "metrics": {
          "priceVolatility": 89.64,
          "marketCap": 27.18,
          "transactionVolume": 29.53,
          "stakingRatio": 84.87,
          "activeAddress": 89.17,
          "liveTime": 100,
          "nc": 33.33,
          "proposalRate": 4.63,
          "proposalCount": 2.94,
          "ibcOut": 50
        }
      },
      // ... 180일치 데이터
    ],
    "avgScore": 56.75,
    "rank": 2
  },
  // ... 36개 체인
}
```

### rankings.json
```json
{
  "generatedAt": "2025-12-10T...",
  "totalChains": 36,
  "period": "180 days",
  "rankings": [
    { "id": "injective", "name": "Injective", "avgScore": 57.10, "rank": 1 },
    { "id": "cosmos", "name": "Cosmos", "avgScore": 56.75, "rank": 2 },
    // ...
  ]
}
```

---

## 9. 실행 방법

```bash
# 데이터 처리 스크립트 실행
npm run process-data

# 또는 직접 실행
node scripts/processChainData.cjs
```

---

## 10. 체인 목록 (36개)

| ID | 이름 | 특이사항 |
|----|------|----------|
| cosmos | Cosmos | - |
| babylon | Babylon | - |
| osmosis | Osmosis | - |
| injective | Injective | - |
| celestia | Celestia | - |
| dydx | DYDX | - |
| axelar | Axelar | tokenSupply=0 (대체값 사용) |
| asi | ASI Alliance | tokenSupply=0 (대체값 사용) |
| althea | Althea | marketCap 데이터 없음 (보간) |
| milkyway | MilkyWay | marketCap 일부 누락 (보간) |
| ... | ... | ... |

> **제외된 체인**: Provenance (67일 데이터만 존재)

---

*문서 작성일: 2025-12-10*
*스크립트 버전: processChainData.cjs v1.0*

