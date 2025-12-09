function StabilityRawDataOverview() {
  return (
    <div className="bg-[#13151a] rounded-[20px] p-[40px]">
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
      <hr className="border-t border-[#222631]" />
    </div>
  );
}

export default StabilityRawDataOverview;
