import { useMemo, useState } from 'react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import chainScoresData from '../data/chainScores.json';

// 차트 색상 (선택 순서대로, 최대 4개) - StabilityScoreTrend와 동일
const CHART_COLORS = ['#f6465d', '#f3ba3a', '#0ecb81', '#9852ed'];

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, data, chains }) => {
  if (!active || !data || data.length === 0) return null;

  return (
    <div className="bg-[#17191f] border border-[#222631] rounded-[20px] px-[10px] py-[20px] shadow-lg">
      {/* Chain List Header */}
      <div className="flex gap-0 mb-[10px] min-h-[18px] py-[2px]">
        <div className="w-[119px] flex-shrink-0 px-[5px]" /> {/* Empty space for indicator name column */}
        {chains.map((chain, index) => (
          <div 
            key={chain.chainId} 
            className="flex items-center justify-center px-[5px] min-w-[100px] flex-1"
          >
            <span 
              className="text-[15px] font-bold leading-[18px] whitespace-nowrap text-center block"
              style={{ color: CHART_COLORS[index % CHART_COLORS.length] }}
            >
              {chain.chainName.toUpperCase()}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <hr className="border-t border-[#222631] mb-[10px]" />

      {/* Data Rows - 모든 지표 표시 */}
      {data.map((item, idx) => (
        <div key={idx}>
          <div className="flex gap-0 min-h-[18px] items-center py-[2px]">
            {/* Indicator Name */}
            <div className="w-[119px] flex-shrink-0 px-[5px]">
              <span className="text-[15px] font-normal text-[#a1a9c0] leading-[18px] block">
                {item.indicator}
              </span>
            </div>

            {/* Chain Values */}
            {chains.map((chain) => (
              <div 
                key={chain.chainId}
                className="flex items-center justify-center px-[5px] min-w-[100px] flex-1"
              >
                <span className="text-[15px] font-normal text-white leading-[18px] whitespace-nowrap text-center block">
                  {item[chain.chainId] !== undefined 
                    ? item[chain.chainId].toFixed(2)
                    : '-'}
                </span>
              </div>
            ))}
          </div>
          
          {/* Divider between rows */}
          {idx < data.length - 1 && (
            <hr className="border-t border-[#222631] my-[10px]" />
          )}
        </div>
      ))}
    </div>
  );
};

// 커스텀 틱 컴포넌트 - 곡선 텍스트
const CurvedTick = ({ payload, x, y, cx, cy, index }) => {
  const angle = Math.atan2(y - cy, x - cx);
  const degrees = angle * (180 / Math.PI);
  
  // 원의 반지름 (라벨 위치) - 특정 라벨은 더 멀리 배치
  const labelsNeedingFartherPosition = ['Proposal Count', 'Transaction Volume', 'Live Time'];
  const baseOffset = labelsNeedingFartherPosition.includes(payload.value) ? 10 : 5;
  const radius = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) + baseOffset;
  
  // 텍스트 길이에 따라 호의 각도 계산
  const text = payload.value;
  const charAngle = 6; // 각 글자당 각도
  const totalAngle = text.length * charAngle;
  
  // 고유 ID 생성
  const pathId = `curved-text-${index}-${text.replace(/\s/g, '')}`;
  
  // 위쪽 반구 (-135 ~ -45): 아래로 볼록한 곡선
  // 아래쪽 반구 (45 ~ 135): 위로 볼록한 곡선
  // 왼쪽/오른쪽: 세로 곡선
  
  const isTop = degrees >= -135 && degrees < -45;
  const isBottom = degrees >= 45 && degrees < 135;
  const isRight = degrees >= -45 && degrees < 45;
  const isLeft = degrees >= 135 || degrees < -135;
  
  // 시작 각도 계산 (텍스트 중앙이 현재 위치가 되도록)
  const startAngleDeg = degrees - totalAngle / 2;
  const endAngleDeg = degrees + totalAngle / 2;
  
  let path;
  let textOffset = "50%";
  
  if (isTop) {
    // 위쪽: 아래로 볼록 (시계 방향)
    const startRad = (startAngleDeg * Math.PI) / 180;
    const endRad = (endAngleDeg * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);
    path = `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;
  } else if (isBottom) {
    // 아래쪽: 위로 볼록 (반시계 방향)
    const startRad = (endAngleDeg * Math.PI) / 180;
    const endRad = (startAngleDeg * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);
    path = `M ${x1} ${y1} A ${radius} ${radius} 0 0 0 ${x2} ${y2}`;
  } else if (isRight) {
    // 오른쪽: 세로로 왼쪽으로 볼록
    const vertStartAngle = degrees - totalAngle / 2;
    const vertEndAngle = degrees + totalAngle / 2;
    const startRad = (vertStartAngle * Math.PI) / 180;
    const endRad = (vertEndAngle * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);
    path = `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;
  } else {
    // 왼쪽: 세로로 오른쪽으로 볼록
    // Market Cap은 반대 방향으로 그리기
    if (text === 'Market Cap') {
      const vertStartAngle = degrees - totalAngle / 2;
      const vertEndAngle = degrees + totalAngle / 2;
      const startRad = (vertStartAngle * Math.PI) / 180;
      const endRad = (vertEndAngle * Math.PI) / 180;
      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);
      path = `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;
    } else {
      const vertStartAngle = degrees + totalAngle / 2;
      const vertEndAngle = degrees - totalAngle / 2;
      const startRad = (vertStartAngle * Math.PI) / 180;
      const endRad = (vertEndAngle * Math.PI) / 180;
      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);
      path = `M ${x1} ${y1} A ${radius} ${radius} 0 0 0 ${x2} ${y2}`;
    }
  }

  return (
    <g>
      <defs>
        <path id={pathId} d={path} fill="none" />
      </defs>
      <text fill="#a1a9c0" fontSize={11} fontFamily="Lato" fontWeight={400}>
        <textPath href={`#${pathId}`} startOffset={textOffset} textAnchor="middle">
          {text}
        </textPath>
      </text>
    </g>
  );
};

function StabilityFactorAnalysis({ selectedChains = [] }) {
  // 180일 평균 계산
  const factorData = useMemo(() => {
    if (selectedChains.length === 0) return null;

    // 각 체인의 180일 평균 계산
    const chainsData = selectedChains.map(chain => {
      const chainData = chainScoresData[chain.id];
      if (!chainData || !chainData.dailyScores) return null;

      const scores = chainData.dailyScores.slice(0, 180); // 최근 180일
      const count = scores.length;

      // 각 지표의 평균 계산
      const avgMetrics = {
        proposalRate: 0,
        ibcOut: 0,
        proposalCount: 0,
        liveTime: 0,
        nc: 0,
        priceVolatility: 0,
        activeAddress: 0,
        marketCap: 0,
        transactionVolume: 0,
        stakingRatio: 0
      };

      scores.forEach(day => {
        if (day.metrics) {
          Object.keys(avgMetrics).forEach(key => {
            avgMetrics[key] += day.metrics[key] || 0;
          });
        }
      });

      Object.keys(avgMetrics).forEach(key => {
        avgMetrics[key] = avgMetrics[key] / count;
      });

      return {
        chainId: chain.id,
        chainName: chain.name,
        metrics: avgMetrics
      };
    }).filter(Boolean);

    // 각 팩터별 레이더 차트 데이터 구성
    const activityData = [
      { indicator: 'Proposal Rate', fullMark: 100 },
      { indicator: 'IBC Out', fullMark: 100 },
      { indicator: 'Proposal Count', fullMark: 100 }
    ];

    const volatilityData = [
      { indicator: 'Price Volatility', fullMark: 100 },
      { indicator: 'Active Address', fullMark: 100 },
      { indicator: 'Transaction Volume', fullMark: 100 },
      { indicator: 'Market Cap', fullMark: 100 }
    ];

    const sustainabilityData = [
      { indicator: 'Staking Ratio', fullMark: 100 },
      { indicator: 'NC', fullMark: 100 },
      { indicator: 'Live Time', fullMark: 100 }
    ];

    // 각 체인의 값 추가
    chainsData.forEach(chain => {
      activityData[0][chain.chainId] = chain.metrics.proposalRate;
      activityData[1][chain.chainId] = chain.metrics.ibcOut;
      activityData[2][chain.chainId] = chain.metrics.proposalCount;

      volatilityData[0][chain.chainId] = chain.metrics.priceVolatility;
      volatilityData[1][chain.chainId] = chain.metrics.activeAddress;
      volatilityData[2][chain.chainId] = chain.metrics.transactionVolume;
      volatilityData[3][chain.chainId] = chain.metrics.marketCap;

      sustainabilityData[0][chain.chainId] = chain.metrics.stakingRatio;
      sustainabilityData[1][chain.chainId] = chain.metrics.nc;
      sustainabilityData[2][chain.chainId] = chain.metrics.liveTime;
    });

    return {
      chains: chainsData,
      activity: activityData,
      volatility: volatilityData,
      sustainability: sustainabilityData
    };
  }, [selectedChains]);

  // 레이더 차트 컴포넌트
  const RadarChartComponent = ({ data, title, chains }) => (
    <div className="flex-1 flex flex-col items-center overflow-visible min-w-0 relative">
      <h3 className="text-[15px] font-bold text-white leading-[18px] mb-[20px]">{title}</h3>
      <div className="radar-chart-wrapper w-full aspect-square" style={{ overflow: 'visible' }}>
        <style>{`
          .radar-chart-wrapper svg {
            overflow: visible !important;
          }
          .radar-chart-wrapper .recharts-wrapper {
            overflow: visible !important;
          }
          .radar-chart-wrapper .recharts-surface {
            overflow: visible !important;
          }
        `}</style>
        <ResponsiveContainer width="100%" height="100%">
        <RadarChart 
          data={data}
          cx="50%" 
          cy="50%"
          outerRadius="87%"
        >
          <PolarGrid 
            stroke="#2a2d3a" 
            strokeWidth={1}
            gridType="circle"
          />
          <PolarAngleAxis 
            dataKey="indicator" 
            tick={<CurvedTick />}
            tickLine={false}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]}
            tick={false}
            axisLine={false}
            stroke="transparent"
          />
          <Tooltip 
            content={<CustomTooltip data={data} chains={chains} />}
            cursor={false}
            wrapperStyle={{ zIndex: 1000 }}
          />
          {chains.map((chain, index) => (
            <Radar
              key={chain.chainId}
              name={chain.chainName}
              dataKey={chain.chainId}
              stroke={CHART_COLORS[index % CHART_COLORS.length]}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
              fillOpacity={0.15}
              strokeWidth={2}
              strokeLinejoin="round"
              dot={false}
              isAnimationActive={false}
              activeDot={false}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="bg-[#13151a] rounded-[20px] p-[40px] overflow-visible flex-[756] min-w-0">
      {/* Title */}
      <h2 className="text-[20px] font-bold text-white mb-[20px]">
        Stability Factor Analysis
      </h2>
      
      {/* Divider */}
      <hr className="border-t border-[#222631] mb-[20px]" />

      {/* Radar Charts Container */}
      {factorData && factorData.chains.length > 0 ? (
        <div className="flex gap-[10px] overflow-visible">
          <RadarChartComponent 
            data={factorData.activity}
            title="Activity"
            chains={factorData.chains}
          />
          <RadarChartComponent 
            data={factorData.volatility}
            title="Market Volatility"
            chains={factorData.chains}
          />
          <RadarChartComponent 
            data={factorData.sustainability}
            title="Sustainability"
            chains={factorData.chains}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-[250px] text-text-tertiary text-[14px]">
          Select chains to view factor analysis
        </div>
      )}
    </div>
  );
}

export default StabilityFactorAnalysis;
