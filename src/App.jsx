import { useState } from "react"
import HomeScreen   from "./screens/HomeScreen"
import EditorScreen from "./screens/EditorScreen"

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [attoId, setAttoId]           = useState(null)

  function handleOpenAtto(id) {
    setAttoId(id)
    setCurrentView('editor')
  }

  function handleBack() {
    setAttoId(null)
    setCurrentView('home')
  }

  return currentView === 'home'
    ? <HomeScreen onOpen={handleOpenAtto} />
    : <EditorScreen attoId={attoId} onBack={handleBack} />
}

export default App