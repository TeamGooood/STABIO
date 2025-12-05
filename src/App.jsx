import Header from './components/Header'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Header />

      {/* Main Content Area */}
      <div className="flex">
        <Sidebar />
        
        {/* Main Content - 추후 추가 */}
        <main className="flex-1">
          {/* 메인 컨텐츠 영역 */}
        </main>
      </div>
    </div>
  )
}

export default App

