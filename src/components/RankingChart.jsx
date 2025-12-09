import { useState, useRef, memo, useCallback } from 'react';

// 개별 랭킹 아이템 컴포넌트 (메모이제이션)
const RankingItem = memo(function RankingItem({ 
  chain, 
  rank, 
  isSelected, 
  isDisabled,
  maxScore,
  onClick 
}) {
  const textColor = isSelected ? 'text-text-primary' : 'text-text-tertiary';
  const barColor = isSelected ? 'bg-white' : 'bg-text-tertiary';

  return (
    <div
      className={`w-[400px] h-[36px] flex items-start cursor-pointer hover:opacity-80 ${isDisabled ? 'opacity-50' : ''}`}
      onClick={onClick}
    >
      {/* Rank Number */}
      <span className={`text-base font-normal ${textColor} w-[18px] leading-[18px] pt-[9px] text-right`}>
        {rank}
      </span>

      {/* Chain Info */}
      <div className="w-[365px] ml-[17px]">
        {/* Name and Score Row */}
        <div className="flex justify-between items-center h-[18px] gap-[10px]">
          <span className={`text-base font-normal ${textColor} leading-[18px] truncate`}>
            {chain.name}
          </span>
          <span className={`text-base font-normal ${textColor} leading-[18px] shrink-0 min-w-[40px] h-[18px] text-right`}>
            {chain.score.toFixed(2)}
          </span>
        </div>

        {/* Score Bar */}
        <div className="relative h-[18px] w-[365px]">
          {/* Background Bar */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-[4px] bg-border-card rounded-full" />
          {/* Score Bar */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 h-[4px] left-0 ${barColor} rounded-full transition-[width] duration-150`}
            style={{ width: `${(chain.score / maxScore) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
});

// 드롭다운 아이템 컴포넌트 (메모이제이션)
const DropdownItem = memo(function DropdownItem({ chain, onClick }) {
  return (
    <div
      className="w-full h-[50px] flex items-center px-[20px] gap-[10px] border-b border-border-card cursor-pointer hover:bg-border-card transition-colors"
      onClick={onClick}
    >
      {/* Chain Logo */}
      <div className="w-[30px] h-[30px] rounded-full bg-border-card flex items-center justify-center overflow-hidden shrink-0">
        <img 
          src={chain.logo} 
          alt={chain.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <span className="text-xs font-bold text-text-primary hidden items-center justify-center w-full h-full">
          {chain.name.charAt(0)}
        </span>
      </div>
      {/* Chain Name */}
      <span className="text-base font-bold text-text-primary">
        {chain.name}
      </span>
    </div>
  );
});

function RankingChart({ rankedChains, selectedChainIds, onSelectChain, onRemoveChain }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const leaderboardRef = useRef(null);

  // 드롭다운에서 체인 선택 핸들러
  const handleDropdownSelect = useCallback((chain) => {
    if (selectedChainIds.length < 4 && !selectedChainIds.includes(chain.id)) {
      onSelectChain(chain.id);
    }
    setIsDropdownOpen(false);
    setSearchQuery('');

    // 선택된 체인의 랭킹 위치로 스크롤
    const chainIndex = rankedChains.findIndex(c => c.id === chain.id);
    if (chainIndex !== -1 && leaderboardRef.current) {
      const itemHeight = 53;
      leaderboardRef.current.scrollTo({
        top: chainIndex * itemHeight,
        behavior: 'smooth'
      });
    }
  }, [rankedChains, selectedChainIds, onSelectChain]);

  // 체인 선택/해제 핸들러
  const handleChainClick = useCallback((chainId) => {
    if (selectedChainIds.includes(chainId)) {
      onRemoveChain(chainId);
    } else if (selectedChainIds.length < 4) {
      onSelectChain(chainId);
    }
  }, [selectedChainIds, onSelectChain, onRemoveChain]);

  // 드롭박스용 검색 필터링
  const filteredChains = rankedChains.filter(chain =>
    chain.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 최대 점수 (바 너비 계산용)
  const maxScore = 100;

  return (
    <div>
      {/* Title */}
      <h2 className="text-base font-bold text-text-secondary mb-[15px] leading-[23px] flex items-start">
        RANKING
      </h2>

      {/* Search Bar with Dropdown */}
      <div className="relative mb-[25px] w-[400px]">
        <div className="relative h-[50px]">
          <input
            type="text"
            placeholder="Select a chain"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            className="w-full h-full bg-bg-dark border border-border-card rounded-[10px] pl-[15px] pr-[50px] text-base text-text-primary placeholder:text-text-tertiary outline-none focus:border-text-tertiary"
          />
          {/* Dropdown Arrow Button */}
          <button 
            type="button"
            className="absolute right-0 top-0 h-full w-[50px] flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <svg 
              width="12" 
              height="8" 
              viewBox="0 0 12 8" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            >
              <path 
                d="M1 1.5L6 6.5L11 1.5" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Dropdown List */}
        {isDropdownOpen && (
          <div className="absolute top-[55px] left-0 w-[400px] max-h-[350px] bg-bg-dark border border-border-card rounded-[10px] overflow-y-auto scrollbar-thin z-50">
            {filteredChains.length > 0 ? (
              filteredChains.map((chain) => (
                <DropdownItem
                  key={chain.id}
                  chain={chain}
                  onClick={() => handleDropdownSelect(chain)}
                />
              ))
            ) : (
              <div className="h-[50px] flex items-center justify-center text-text-tertiary">
                No chains found
              </div>
            )}
          </div>
        )}

        {/* Click outside to close */}
        {isDropdownOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </div>

      {/* Leaderboard - 스크롤 가능 영역 */}
      <div ref={leaderboardRef} className="h-[440px] overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="space-y-[17px]">
          {rankedChains.map((chain, index) => (
            <RankingItem
              key={chain.id}
              chain={chain}
              rank={index + 1}
              isSelected={selectedChainIds.includes(chain.id)}
              isDisabled={selectedChainIds.length >= 4 && !selectedChainIds.includes(chain.id)}
              maxScore={maxScore}
              onClick={() => handleChainClick(chain.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(RankingChart);
