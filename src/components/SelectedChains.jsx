function SelectedChains({ selectedChains, onRemoveChain }) {
  return (
    <div>
      {/* Title */}
      <h2 className="text-base font-bold text-text-secondary mb-[15px] leading-[23px] flex items-start">
        SELECTED CHAINS
      </h2>

      {/* Chains Grid - 2x2 */}
      <div className="w-[400px] h-[130px]">
        <div className="grid grid-cols-2 gap-[10px]">
          {selectedChains.map((chain) => (
            <div
              key={chain.id}
              className="relative w-[195px] h-[60px] border border-border-card rounded-[10px] cursor-pointer hover:bg-border-card transition-colors group"
              onClick={() => onRemoveChain(chain.id)}
            >
              {/* Default Content - 로고 + 이름 */}
              <div className="absolute inset-0 flex items-center px-[15px] gap-[10px] group-hover:opacity-0 transition-opacity">
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
                <span className="text-base font-bold text-text-primary truncate">
                  {chain.name}
                </span>
              </div>

              {/* Hover Content - X 아이콘 */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-text-tertiary"
                >
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          ))}

          {/* Empty slots - 비선택 상태 (hover 효과 없음) */}
          {Array.from({ length: 4 - selectedChains.length }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="w-[195px] h-[60px] border border-border-card rounded-[10px] flex items-center px-[15px] gap-[10px]"
            >
              {/* 느낌표 원형 아이콘 */}
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 20 20" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-text-tertiary shrink-0"
              >
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                <line x1="10" y1="5" x2="10" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="10" cy="14" r="1" fill="currentColor"/>
              </svg>
              {/* 텍스트 */}
              <span className="text-text-tertiary text-base font-normal">
                No Selected Chain
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SelectedChains;

