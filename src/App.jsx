import { useState } from "react"
import HomeScreen   from "./screens/HomeScreen"
import EditorScreen from "./screens/EditorScreen"

import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [attoId, setAttoId]           = useState(null)

  function handleOpenAtto(id) {
    setAttoId(id)
    setCurrentView('editor')
  }

  function handleRename(newId) {
    setAttoId(newId)
  }

  function handleBack() {
    setAttoId(null)
    setCurrentView('home')
  }

  return (
    <SpeedInsights /> && 
    <Analytics /> && 
    currentView === 'home'
    ? <HomeScreen onOpen={handleOpenAtto} />
    : <EditorScreen attoId={attoId} onBack={handleBack} onRename={handleRename} />
  )
}

export default App