import { useState, useMemo, useCallback, useEffect } from 'react';
import WeightControl from './WeightControl';
import RankingChart from './RankingChart';
import SelectedChains from './SelectedChains';
import { chainData } from '../data/chainData';
import { calculateAllScores } from '../utils/calculateScore';

function Sidebar({ weights, onWeightsChange, onSelectedChainsUpdate }) {
  const [selectedChainIds, setSelectedChainIds] = useState([]);

  // 가중치 적용된 체인 데이터 계산 (메모이제이션)
  const rankedChains = useMemo(() => {
    return calculateAllScores(chainData, weights);
  }, [weights]);

  // 체인 선택 핸들러 (메모이제이션)
  const handleSelectChain = useCallback((chainId) => {
    setSelectedChainIds(prev => {
      if (prev.length < 4 && !prev.includes(chainId)) {
        return [...prev, chainId];
      }
      return prev;
    });
  }, []);

  // 체인 제거 핸들러 (메모이제이션)
  const handleRemoveChain = useCallback((chainId) => {
    setSelectedChainIds(prev => prev.filter(id => id !== chainId));
  }, []);

  // 선택된 체인 데이터 (메모이제이션)
  const selectedChains = useMemo(() => {
    return selectedChainIds
      .map(id => rankedChains.find(chain => chain.id === id))
      .filter(Boolean);
  }, [selectedChainIds, rankedChains]);

  // 선택된 체인 정보를 부모 컴포넌트로 전달
  useEffect(() => {
    if (onSelectedChainsUpdate) {
      onSelectedChainsUpdate(selectedChainIds, selectedChains);
    }
  }, [selectedChainIds, selectedChains, onSelectedChainsUpdate]);

  return (
    <aside className="w-[450px] min-h-[calc(100vh-60px)] bg-bg-base border-r border-border-card overflow-x-hidden">
      {/* Weight Control Section */}
      <section className="px-[10px] pt-5 mb-[20px]">
        <div className="px-[15px]">
          <WeightControl 
            weights={weights}
            onWeightsChange={onWeightsChange}
          />
        </div>
      </section>

      {/* Divider Line */}
      <hr className="border-t border-border-card mx-[10px]" />

      {/* Ranking Section */}
      <section className="px-[10px] pt-4">
        <div className="px-[15px]">
          <RankingChart 
            rankedChains={rankedChains}
            selectedChainIds={selectedChainIds}
            onSelectChain={handleSelectChain}
            onRemoveChain={handleRemoveChain}
          />
        </div>
      </section>

      {/* Divider Line */}
      <hr className="border-t border-border-card mx-[10px] mt-4" />

      {/* Selected Chains Section */}
      <section className="px-[10px] pt-4 pb-[25px]">
        <div className="px-[15px]">
          <SelectedChains 
            selectedChains={selectedChains}
            onRemoveChain={handleRemoveChain}
          />
        </div>
      </section>
    </aside>
  );
}

export default Sidebar;
