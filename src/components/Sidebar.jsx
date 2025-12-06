import { useState } from 'react';
import WeightControl from './WeightControl';
import RankingChart from './RankingChart';
import SelectedChains from './SelectedChains';
import { chainData } from '../data/chainData';

function Sidebar() {
  const [selectedChainIds, setSelectedChainIds] = useState([]);

  // 체인 선택 핸들러
  const handleSelectChain = (chainId) => {
    if (selectedChainIds.length < 4 && !selectedChainIds.includes(chainId)) {
      setSelectedChainIds(prev => [...prev, chainId]);
    }
  };

  // 체인 제거 핸들러
  const handleRemoveChain = (chainId) => {
    setSelectedChainIds(prev => prev.filter(id => id !== chainId));
  };

  // 선택된 체인 데이터
  const selectedChains = selectedChainIds
    .map(id => chainData.find(chain => chain.id === id))
    .filter(Boolean);

  return (
    <aside className="w-[450px] min-h-[calc(100vh-60px)] bg-bg-base border-r border-border-card overflow-x-hidden">
      {/* Weight Control Section */}
      <section className="px-[10px] pt-5 mb-[20px]">
        <div className="px-[15px]">
          <WeightControl />
        </div>
      </section>

      {/* Divider Line */}
      <hr className="border-t border-border-card mx-[10px]" />

      {/* Ranking Section */}
      <section className="px-[10px] pt-4">
        <div className="px-[15px]">
          <RankingChart 
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

