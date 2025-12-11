import { useState, useCallback } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import StabilityScoreTrend from './components/StabilityScoreTrend'
import StabilityFactorAnalysis from './components/StabilityFactorAnalysis'
import StabilityRawDataOverview from './components/StabilityRawDataOverview'
import Summary from './components/Summary'

function App() {
  const [selectedChainIds, setSelectedChainIds] = useState([])
  const [selectedChains, setSelectedChains] = useState([])
  
  // 가중치 상태 (App 레벨에서 관리)
  const [weights, setWeights] = useState({
    activity: 33,
    volatility: 34,
    persistence: 33
  })

  // 선택된 날짜 상태 (Raw Data Overview를 위해)
  const [selectedDate, setSelectedDate] = useState(null)

  const handleSelectedChainsUpdate = useCallback((chainIds, chains) => {
    setSelectedChainIds(chainIds)
    setSelectedChains(chains)
  }, [])

  const handleWeightsChange = useCallback((newWeights) => {
    setWeights(newWeights)
  }, [])

  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date)
  }, [])

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Header />

      {/* Main Content Area */}
      <div className="flex">
        <Sidebar 
          weights={weights}
          onWeightsChange={handleWeightsChange}
          onSelectedChainsUpdate={handleSelectedChainsUpdate} 
        />
        
        {/* Main Content - 4개 컴포넌트 Grid */}
        <main className="flex-1 p-[30px]">
          <div className="flex flex-col gap-[30px]">
            {/* Top Row */}
            <div className="flex gap-[30px]">
              <StabilityScoreTrend 
                selectedChains={selectedChains} 
                weights={weights}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
              <StabilityRawDataOverview 
                selectedChains={selectedChains}
                selectedDate={selectedDate}
              />
            </div>
            
            {/* Bottom Row */}
            <div className="flex gap-[30px]">
              <StabilityFactorAnalysis selectedChains={selectedChains} />
              <Summary />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App

