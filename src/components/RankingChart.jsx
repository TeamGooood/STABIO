import { useState, useRef } from 'react';
import { chainData } from '../data/chainData';

function RankingChart({ selectedChainIds, onSelectChain, onRemoveChain }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 열림 상태
  const leaderboardRef = useRef(null); // 랭킹 차트 스크롤 컨테이너 ref

  // 드롭다운에서 체인 선택 핸들러
  const handleDropdownSelect = (chain) => {
    if (selectedChainIds.length < 4 && !selectedChainIds.includes(chain.id)) {
      onSelectChain(chain.id);
    }
    setIsDropdownOpen(false);
    setSearchQuery('');

    // 선택된 체인의 랭킹 위치로 스크롤
    const sortedChains = [...chainData].sort((a, b) => b.score - a.score);
    const chainIndex = sortedChains.findIndex(c => c.id === chain.id);
    if (chainIndex !== -1 && leaderboardRef.current) {
      const itemHeight = 53; // 아이템 높이 36px + 간격 17px
      leaderboardRef.current.scrollTo({
        top: chainIndex * itemHeight,
        behavior: 'smooth'
      });
    }
  };

  // 체인 선택/해제 핸들러
  const handleChainClick = (chainId) => {
    if (selectedChainIds.includes(chainId)) {
      onRemoveChain(chainId);
    } else if (selectedChainIds.length < 4) {
      onSelectChain(chainId);
    }
  };

  // 드롭박스용 검색 필터링
  const filteredChains = chainData.filter(chain =>
    chain.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 랭킹 차트용 - 전체 데이터 정렬 (필터링 없음)
  const sortedChains = [...chainData].sort((a, b) => b.score - a.score);

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
                <div
                  key={chain.id}
                  className="w-full h-[50px] flex items-center px-[20px] gap-[10px] border-b border-border-card cursor-pointer hover:bg-border-card transition-colors"
                  onClick={() => handleDropdownSelect(chain)}
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
          {sortedChains.map((chain, index) => {
            const rank = index + 1;
            const isSelected = selectedChainIds.includes(chain.id);
            
            // 색상 결정: 선택된 항목만 흰색, 나머지는 회색
            const textColor = isSelected ? 'text-text-primary' : 'text-text-tertiary';
            const barColor = isSelected ? 'bg-white' : 'bg-text-tertiary';

            return (
              <div
                key={chain.id}
                className={`w-[400px] h-[36px] flex items-start cursor-pointer hover:opacity-80 ${selectedChainIds.length >= 4 && !isSelected ? 'opacity-50' : ''}`}
                onClick={() => handleChainClick(chain.id)}
              >
                {/* Rank Number - 9px 너비, 상단에서 9px 오프셋 */}
                <span className={`text-base font-normal ${textColor} w-[9px] leading-[18px] pt-[9px]`}>
                  {rank}
                </span>

                {/* Chain Info - 24px 간격 후 너비 */}
                <div className="w-[375px] ml-[15px]">
                  {/* Name and Score Row - 높이 18px */}
                  <div className="flex justify-between items-center h-[18px] gap-[10px]">
                    <span className={`text-base font-normal ${textColor} leading-[18px] truncate`}>
                      {chain.name}
                    </span>
                    <span className={`text-base font-normal ${textColor} leading-[18px] shrink-0 min-w-[18px] h-[18px] text-right`}>
                      {chain.score}
                    </span>
                  </div>

                  {/* Score Bar - 높이 18px, 바는 중간에 위치 */}
                  <div className="relative h-[18px] w-[375px]">
                    {/* Background Bar */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-full h-[4px] bg-border-card rounded-full" />
                    {/* Score Bar */}
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 h-[4px] left-0 ${barColor} rounded-full`}
                      style={{ width: `${(chain.score / maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RankingChart;

