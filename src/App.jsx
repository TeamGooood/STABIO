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

  const handleSelectedChainsUpdate = useCallback((chainIds, chains) => {
    setSelectedChainIds(chainIds)
    setSelectedChains(chains)
  }, [])

  const handleWeightsChange = useCallback((newWeights) => {
    setWeights(newWeights)
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
          <div className="grid grid-cols-2 gap-[30px] max-w-[1920px]">
            {/* Top Left */}
            <div>
              <StabilityScoreTrend selectedChains={selectedChains} weights={weights} />
            </div>
            
            {/* Top Right */}
            <div>
              <StabilityRawDataOverview />
            </div>
            
            {/* Bottom Left */}
            <div>
              <StabilityFactorAnalysis />
            </div>
            
            {/* Bottom Right */}
            <div>
              <Summary />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App

