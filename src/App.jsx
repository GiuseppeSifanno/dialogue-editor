import { useState } from "react"
import NodeList   from "./components/NodeList"
import NodeEditor from "./components/NodeEditor"
import Preview    from "./components/Preview"
import ConfirmModal from "./components/modal/ConfirmModal"

const savedData = localStorage.getItem("dialogueData")
const initialData = savedData ? JSON.parse(savedData) : {
  meta: { idAtto: "a1", dialogoIniziale: "d1" },
  personaggi: [
    { id: "p1", nome: "Personaggio 1" },
  ],
  dialoghi: [
    {
      id: "d1",
      battute: [{ personaggioId: "p1", testo: "Ciao, come posso aiutarti?" }],
      scelte: [],
      nextId: ""
    }
  ]
}

function App() {
  const [iconHover, setIconHover]   = useState(false)
  const [meta, setMeta]             = useState(initialData.meta)
  const [personaggi, setPersonaggi] = useState(initialData.personaggi)
  const [dialoghi, setDialoghi]     = useState(initialData.dialoghi)
  const [selectedId, setSelectedId] = useState(initialData.meta.dialogoIniziale)
  const [nextDialogoNum, setNextDialogoNum] = useState(initialData.dialoghi.length + 1)
  const [nextPersonaggioNum, setNextPersonaggioNum] = useState(initialData.personaggi.length + 1)

  const [showDeleteModal, setShowDeleteModal]   = useState(false)
  const [deleteAction, setDeleteAction]         = useState(null)
  const [deleteMessage, setDeleteMessage]       = useState('')

  const selectedDialogo = dialoghi.find(d => d.id === selectedId)

  // ── Modal ────────────────────────────────────────
  function openDeleteModal(action, message) {
    console.log("Apertura model");
    
    setDeleteAction(() => action)
    setDeleteMessage(message)
    setShowDeleteModal(true)
  }

  function handleUpdateDialogo(updated) {
    setDialoghi(prev => prev.map(d => d.id === updated.id ? updated : d))
  }

  function handleAddDialogo() {
    const newId = `d${nextDialogoNum}`
    const newDialogo = {
      id: newId,
      battute: [{ personaggioId: "?", testo: "" }],
      scelte: [],
      nextId: ""
    }
    setDialoghi(prev => [...prev, newDialogo])
    setSelectedId(newId)
    setNextDialogoNum(nextDialogoNum + 1)
  }

  function handleDeleteDialogo(id) {
    const remaining = dialoghi.filter(d => d.id !== id)
    setDialoghi(remaining)
    setSelectedId(remaining[0]?.id || null)
  }

  //TODO da rivedere 
  function handleSetDialogoIniziale(id){
    setMeta({...meta, dialogoIniziale: id})
  }

  function handleAddPersonaggio() {
    const newId = `p${nextPersonaggioNum}`
    const newPersonaggio = { id: newId, nome: `Personaggio ${nextPersonaggioNum}` }
    setPersonaggi(prev => [...prev, newPersonaggio])
    setNextPersonaggioNum(nextPersonaggioNum + 1)
  }

  function handleUpdatePersonaggio(updated) {
    setPersonaggi(prev => prev.map(p => p.id === updated.id ? updated : p))
  }

  function handleDeletePersonaggio(id) {
    setPersonaggi(prev => prev.filter(p => p.id !== id))
  }

  function handleSave() {
    const data = { meta, personaggi, dialoghi }
    localStorage.setItem("dialogueData", JSON.stringify(data))
    alert("Salvato!")
  }

  function handleExport() {
    const data = { meta, personaggi, dialoghi }
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href     = url
    a.download = `${meta.idAtto}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const parsed = JSON.parse(event.target.result)
      setMeta(parsed.meta)
      setPersonaggi(parsed.personaggi)
      setDialoghi(parsed.dialoghi)
      setSelectedId(parsed.meta.dialogoIniziale)
    }
    reader.readAsText(file)
  }

  function setInputActive(e) {
    const input = document.getElementById('idAtto')
    input.removeAttribute('readOnly')
    input.focus()
    input.setSelectionRange(1,3)

  }

  return (
    <div className="bg-dark min-vh-100 d-flex flex-column p-3 gap-3">
      {/* Navbar */}
      <nav className="navbar navbar-expand-sm bg-body-tertiary rounded px-3">
        <span className="navbar-brand fw-bold">
          Dialog Editor — Id Atto: 
          <input 
            type="text" name="meta" id="idAtto" style={{color:"red", width:"10%", backgroundColor:"lightgray", textAlign:"center"}} value={meta.idAtto}
            className="border-1 border-bottom-100 ms-2 form-control d-inline p-1" maxLength={3} min={2}
            onChange={ (e) => {
              const val = e.target.value
              if (/^a\d{0,2}$/.test(val)) {
                setMeta({ ...meta, idAtto: val })
              }}}
            readOnly
          />
          <img
            src="/edit-icon.svg"
            alt="edit"
            id="idAtto-edit"
            width={20}
            className="ms-1 align-middle"
            style={{ opacity: iconHover ? 1 : 0.5, transition: 'opacity 0.15s', cursor: 'pointer' }}
            onMouseEnter={() => setIconHover(true)}
            onMouseLeave={() => setIconHover(false)}
            onClick={() => setInputActive(true)}
          />
        </span>
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
      {/* Fine navbar */}

      <div className="d-flex flex-column flex-sm-row gap-3 flex-grow-1">

        <div className="d-flex flex-column gap-3" style={{ minWidth: '320px'}}>
          <NodeList
            meta={meta}
            dialoghi={dialoghi}
            personaggi={personaggi}
            selectedId={selectedId}
            onSelectDialogo={setSelectedId}
            onAddDialogo={handleAddDialogo}
            onDeleteDialogo={handleDeleteDialogo}
            onChangeDialogoIniziale={handleSetDialogoIniziale}
            onAddPersonaggio={handleAddPersonaggio}
            onUpdatePersonaggio={handleUpdatePersonaggio}
            onDeletePersonaggio={handleDeletePersonaggio}
            openConfirm={openDeleteModal}
          />
          <NodeEditor
            key={selectedId}
            dialogo={selectedDialogo}
            dialoghi={dialoghi}
            personaggi={personaggi}
            onUpdate={handleUpdateDialogo}
            openConfirm={openDeleteModal}
          />
        </div>

        <div className="flex-grow-1">
          <Preview
            dialoghi={dialoghi}
            personaggi={personaggi}
            dialogoIniziale={meta.dialogoIniziale}
          />
        </div>
        
        <ConfirmModal
          show={showDeleteModal}
          title="Conferma eliminazione"
          message={deleteMessage}
          confirmText="Elimina"
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            deleteAction?.()
            setShowDeleteModal(false)
          }}
        />

      </div>
    </div>
  )
}

export default App