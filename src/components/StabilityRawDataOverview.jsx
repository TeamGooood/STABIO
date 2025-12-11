import { useMemo } from 'react';
import chainScoresData from '../data/chainScores.json';

// 메트릭 정의 (피그마 디자인 순서대로)
const METRICS = [
  { key: 'proposalRate', label: 'Proposal Rate', format: (v) => `${v?.toFixed(0) || 0}%` },
  { key: 'proposalCount', label: 'Proposal Count', format: (v) => Math.round(v || 0).toLocaleString() },
  { key: 'ibcOut', label: 'IBC Out', format: (v) => Math.round(v || 0).toLocaleString() },
  { key: 'priceVolatility', label: 'Price Volatility', format: (v) => `${v?.toFixed(0) || 0}s` },
  { key: 'marketCap', label: 'Market Cap', format: (v) => Math.round(v || 0) },
  { key: 'transactionVolume', label: 'Transaction Volume', format: (v) => `${v?.toFixed(0) || 0}%` },
  { key: 'activeAddress', label: 'Active Address', format: (v) => Math.round(v || 0).toLocaleString() },
  { key: 'stakingRatio', label: 'Staking Ratio', format: (v) => `$${Math.round(v || 0).toLocaleString()}` },
  { key: 'liveTime', label: 'Live Time', format: (v) => Math.round(v || 0).toLocaleString() },
  { key: 'nc', label: 'NC', format: (v) => `${v?.toFixed(0) || 0}%` }
];

function StabilityRawDataOverview({ selectedChains = [], selectedDate = null }) {
  // 선택된 날짜의 각 체인별 메트릭 데이터
  const metricsData = useMemo(() => {
    if (!selectedDate || selectedChains.length === 0) return {};
    
    const data = {};
    selectedChains.forEach(chain => {
      const chainData = chainScoresData[chain.id];
      if (chainData && chainData.dailyScores) {
        const dayData = chainData.dailyScores.find(d => d.date === selectedDate);
        if (dayData && dayData.metrics) {
          data[chain.id] = dayData.metrics;
        }
      }
    });
    
    return data;
  }, [selectedChains, selectedDate]);

  return (
    <div className="bg-[#13151a] rounded-[20px] px-[40px] py-[30px] flex-[624] min-w-0">
      {/* Title and Toggle */}
      <div className="flex items-center justify-between mb-[20px]">
        <h2 className="text-[20px] font-bold text-white">
          Stability Raw Data Overview
        </h2>
        <div className="flex gap-[2px]">
          <button className="bg-[#2f374c] rounded-[5px] px-[10px] py-[3px] text-xs font-normal text-white">
            Day
          </button>
          <button className="rounded-[5px] px-[10px] py-[3px] text-xs font-normal text-text-secondary hover:bg-[#2f374c] transition-colors">
            Period
          </button>
        </div>
      </div>
      
      {/* Divider */}
      <hr className="border-t border-[#222631] mb-[20px]" />

      {/* Data Table */}
      {selectedChains.length === 0 ? (
        <div className="h-[426px] flex items-center justify-center text-text-tertiary">
          Select chains to view raw data
        </div>
      ) : !selectedDate ? (
        <div className="h-[426px] flex items-center justify-center text-text-tertiary">
          Select a date on the chart
        </div>
      ) : (
        <div>
          {/* Chain Headers */}
          <div className="flex mb-[5px]">
            <div className="w-[110px] xl:w-[130px] flex-shrink-0" />
            {selectedChains.map((chain) => (
              <div 
                key={chain.id} 
                className="flex-1 text-center"
              >
                <span className="text-[11px] xl:text-xs font-normal text-white truncate block">
                  {chain.name}
                </span>
              </div>
            ))}
          </div>

          {/* Metric Rows */}
          {METRICS.map((metric, idx) => (
            <div 
              key={metric.key} 
              className="flex"
              style={{ marginBottom: idx < METRICS.length - 1 ? '4px' : '0' }}
            >
              {/* Metric Label */}
              <div className="w-[110px] xl:w-[130px] flex-shrink-0 flex items-center h-[35.7px]">
                <span className="text-[11px] xl:text-xs font-normal text-text-secondary truncate">
                  {metric.label}
                </span>
              </div>

              {/* Data Cells */}
              {selectedChains.map((chain) => {
                const value = metricsData[chain.id]?.[metric.key];
                return (
                  <div 
                    key={chain.id}
                    className="flex-1 h-[35.7px] rounded-[3px] flex items-center justify-center"
                  >
                    <span className="text-[13px] xl:text-[15px] font-normal text-white">
                      {value !== undefined && value !== null ? metric.format(value) : '-'}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StabilityRawDataOverview;
