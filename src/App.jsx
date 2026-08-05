import { useState } from "react"
import NodeList   from "./components/NodeList"
import NodeEditor from "./components/NodeEditor"
import Preview    from "./components/Preview"
import Nodes from "./model/nodes"

const savedNodes = localStorage.getItem("dialogueNodes")
const initialNodes = savedNodes ? JSON.parse(savedNodes) : [
  { id: 1, char: "Eroe", text: "Ciao, ho bisogno di aiuto.", choices: [
    { text: "Compro qualcosa", targetId: 2 },
    { text: "Niente grazie",   targetId: 3 },
  ]},
  { id: 2, char: "Mercante", text: "Cosa posso fare per te?", choices: [] },
  { id: 3, char: "Guardia",  text: "Alt! Documenti.",         choices: [] },
]

function App() {
  const [nodes, setNodes]           = useState(initialNodes)
  const [selectedId, setSelectedId] = useState(initialNodes[0]?.id || null)
  const [nextId, setNextId]         = useState(4)

  const selectedNode = nodes.find(n => n.id === selectedId)

  function handleUpdate(updatedNode) {
    setNodes(prev => prev.map(n => n.id === updatedNode.id ? updatedNode : n))
  }

  function handleAdd() {
    const newNode = { id: nextId, char: "Personaggio", text: "Nuovo dialogo", choices: [] }
    setNodes(prev => [...prev, newNode])
    setSelectedId(nextId)
    setNextId(nextId + 1)
  }

  function handleDelete() {
    const remaining = nodes.filter(n => n.id !== selectedId)
    setNodes(remaining)
    setSelectedId(remaining[0]?.id || null)
  }

  function handleSave() {
    localStorage.setItem("dialogueNodes", JSON.stringify(nodes))
    alert("Salvato!")
  }

  function handleExport() {
    const json = JSON.stringify(nodes, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href     = url
    a.download = "dialogo.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const parsed = JSON.parse(event.target.result)
      setNodes(parsed)
      setSelectedId(parsed[0]?.id || null)
    }
    reader.readAsText(file)
  }

  return (
    <div className="bg-dark min-vh-100 d-flex flex-column p-3 gap-3">

      {/* Navbar */}
      <nav className="navbar navbar-expand-sm bg-body-tertiary rounded px-3">
        <span className="navbar-brand fw-bold p-0" style={{fontSize: "25px"}}>Dialog Editor</span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
          <div className="d-flex gap-2 mt-2 mt-sm-0">
            <button className="btn btn-outline-secondary btn-sm" onClick={handleSave}>
              Salva
            </button>
            <label className="btn btn-outline-secondary btn-sm mb-0">
              Importa
              <input type="file" accept=".json" onChange={handleImport} className="d-none" />
            </label>
            <button className="btn btn-outline-success btn-sm" onClick={handleExport}>
              Esporta
            </button>
          </div>
        </div>
      </nav>

      {/* Layout principale */}
      <div id="layout-principale" className="d-flex justify-content-between flex-column flex-lg-row gap-3 flex-grow-1">

        {/* Colonna sinistra: lista + editor */}
        <div id="layout-list-editor" className="d-flex justify-content-evenly flex-column gap-3" 
					style={{ minWidth: '320px', maxWidth: '420px'}}>
          <NodeList
            nodes={nodes}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onAdd={handleAdd}
            onDelete={handleDelete}
          />
          <NodeEditor
            key={selectedId}
            node={selectedNode}
            nodes={nodes}
            onUpdate={handleUpdate}
          />
        </div>

        {/* Colonna destra: anteprima */}
        <div className="flex-grow-1">
          <Preview nodes={nodes} />
        </div>

      </div>
    </div>
  )
}

export default App