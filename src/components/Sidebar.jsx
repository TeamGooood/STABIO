import WeightControl from './WeightControl';

function Sidebar() {
  return (
    <aside className="w-[450px] h-[calc(100vh-60px)] bg-bg-secondary border-r border-border-primary overflow-y-auto">
      {/* Weight Control Section */}
      <section className="px-[10px] pt-5 mb-[20px]">
        <div className="px-[15px]">
          <WeightControl />
        </div>
      </section>

      {/* Divider Line */}
      <hr className="border-t border-border-primary mx-[10px]" />

      {/* Ranking Section */}
      <section className="px-[10px] pt-5">
        <div className="px-[15px]">
          {/* 세부 컴포넌트는 나중에 추가 */}
          <h2 className="text-base font-bold text-text-secondary mb-4">
            RANKING
          </h2>
          <div className="h-[530px]">
            {/* Ranking 컴포넌트 들어갈 자리 */}
          </div>
        </div>
      </section>

      {/* Divider Line */}
      <hr className="border-t border-border-primary mx-[10px]" />

      {/* Selected Chains Section */}
      <section className="px-[10px] pt-5">
        <div className="px-[15px]">
          {/* 세부 컴포넌트는 나중에 추가 */}
          <h2 className="text-base font-bold text-text-secondary mb-4">
            SELECTED CHAINS
          </h2>
          <div className="h-[140px]">
            {/* Selected Chains 컴포넌트 들어갈 자리 */}
          </div>
        </div>
      </section>
    </aside>
  );
}

export default Sidebar;

