import { useState, useEffect, useRef } from "react"
import NodeList     from "../components/NodeList"
import NodeEditor   from "../components/NodeEditor"
import Preview      from "../components/Preview"
import ConfirmModal from "../components/modal/ConfirmModal"
import * as bootstrap from 'bootstrap'

function EditorScreen({ attoId, onBack, onRename }) {

  const savedData   = localStorage.getItem(`atto:${attoId}`)
  const initialData = savedData ? JSON.parse(savedData) : {
    meta: { idAtto: attoId, dialogoIniziale: "" },
    personaggi: [],
    dialoghi: []
  }

  const [iconHover, setIconHover]   = useState(false)
  const [meta, setMeta]             = useState(initialData.meta)
  const [personaggi, setPersonaggi] = useState(initialData.personaggi)
  const [dialoghi, setDialoghi]     = useState(initialData.dialoghi)
  const [selectedId, setSelectedId] = useState(initialData.meta.dialogoIniziale || null)
  const [nextDialogoNum, setNextDialogoNum] = useState(
    initialData.dialoghi.length > 0
      ? Math.max(...initialData.dialoghi.map(d => parseInt(d.id.slice(1)))) + 1
      : 1
  )
  const [nextPersonaggioNum, setNextPersonaggioNum] = useState(
    initialData.personaggi.length > 0
      ? Math.max(...initialData.personaggi.map(p => parseInt(p.id.slice(1)))) + 1
      : 1
  )

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteAction, setDeleteAction]       = useState(null)
  const [deleteMessage, setDeleteMessage]     = useState('')

  const selectedDialogo = dialoghi.find(d => d.id === selectedId)
  const tooltipRef = useRef(null)

  useEffect(() => {
    const element = document.getElementById("tooltip-preview")
    if (element) {
      tooltipRef.current = new bootstrap.Tooltip(element, {
        trigger: "manual",
        placement: "top",
        animation: true
      })
    }
    return () => { tooltipRef.current?.dispose() }
  }, [])

  function showTooltip() {
    tooltipRef.current?.show()
    setTimeout(() => { tooltipRef.current?.hide() }, 1300)
  }

  function openDeleteModal(action, message) {
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
      battute: [{ personaggioId: personaggi[0]?.id || "?", testo: "" }],
      scelte: [],
      nextId: ""
    }
    setDialoghi(prev => [...prev, newDialogo])
    setSelectedId(newId)
    setNextDialogoNum(nextDialogoNum + 1)
    showTooltip()
  }

  function handleDeleteDialogo(id) {
    const remaining = dialoghi.filter(d => d.id !== id)
    setDialoghi(remaining)
    setSelectedId(remaining[0]?.id || null)
    showTooltip()
  }

  function handleSetDialogoIniziale(id) {
    setMeta({ ...meta, dialogoIniziale: id })
    showTooltip()
  }

  function handleAddPersonaggio() {
    const newId = `p${nextPersonaggioNum}`
    const newPersonaggio = { id: newId, nome: `Personaggio ${nextPersonaggioNum}` }
    setPersonaggi(prev => [...prev, newPersonaggio])
    setNextPersonaggioNum(nextPersonaggioNum + 1)
    showTooltip()
  }

  function handleUpdatePersonaggio(updated) {
    setPersonaggi(prev => prev.map(p => p.id === updated.id ? updated : p))
  }

  function handleDeletePersonaggio(id) {
    setPersonaggi(prev => prev.filter(p => p.id !== id))
    showTooltip()
  }

  function handleSave() {
    const data = { meta, personaggi, dialoghi }
    localStorage.setItem(`atto:${meta.idAtto}`, JSON.stringify(data))

    const atti = JSON.parse(localStorage.getItem("atti") || "[]")
    if (meta.idAtto !== attoId) {
      localStorage.removeItem(`atto:${attoId}`)
      const updated = atti.map(id => id === attoId ? meta.idAtto : id)
      localStorage.setItem("atti", JSON.stringify(updated))
      onRename(meta.idAtto)
    } else {
      if (!atti.includes(attoId)) {
        localStorage.setItem("atti", JSON.stringify([...atti, attoId]))
      }
    }

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
      try {
        const parsed = JSON.parse(event.target.result)
        if (!parsed.meta || !parsed.personaggi || !parsed.dialoghi) {
          throw new Error("Struttura JSON non valida")
        }
        setMeta(parsed.meta)
        setPersonaggi(parsed.personaggi)
        setDialoghi(parsed.dialoghi)
        setSelectedId(parsed.meta.dialogoIniziale)
        const maxD = Math.max(...parsed.dialoghi.map(d => parseInt(d.id.slice(1))))
        setNextDialogoNum(maxD + 1)
        const maxP = Math.max(...parsed.personaggi.map(p => parseInt(p.id.slice(1))))
        setNextPersonaggioNum(maxP + 1)
      } catch (error) {
        alert("File JSON non valido")
      }
    }
    reader.readAsText(file)
  }

  function setInputActive() {
    const input = document.getElementById('idAtto')
    input.removeAttribute('readOnly')
    input.focus()
    input.setSelectionRange(1, 3)
  }

  
  function getOrfani(){
    const raggiungibili = new Set()

    if (meta.dialogoIniziale) 
      raggiungibili.add(meta.dialogoIniziale)

    dialoghi.forEach(d => {
      d.scelte.forEach(s => {
        if (s.next) raggiungibili.add(s.next)
      })
      if (d.nextId) raggiungibili.add(d.nextId)
    })
    // un dialogo è orfano se non è raggiungibile
    return new Set(dialoghi
      .map(d => d.id)
      .filter(id => !raggiungibili.has(id))
    )
  }

  const orfani = getOrfani()

  return (
    <div className="bg-dark min-vh-100 d-flex flex-column p-3 gap-3">
      <nav className="navbar navbar-expand-sm bg-body-tertiary rounded px-3">
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={onBack}>
            ← Atti
          </button>
          <span className="navbar-brand fw-bold mb-0">
            Dialog Editor — Id Atto:
            <input
              type="text" name="meta" id="idAtto"
              style={{ color: "red", width: "10%", backgroundColor: "lightgray", textAlign: "center" }}
              className="border-1 ms-2 form-control d-inline p-1"
              maxLength={3} value={meta.idAtto} readOnly
              onChange={(e) => {
                const val = e.target.value
                if (/^a\d{0,2}$/.test(val)) setMeta({ ...meta, idAtto: val })
              }}
            />
            <img
              src="/edit-icon.svg" alt="edit" width={20}
              className="ms-1 align-middle"
              style={{ opacity: iconHover ? 1 : 0.5, transition: 'opacity 0.15s', cursor: 'pointer' }}
              onMouseEnter={() => setIconHover(true)}
              onMouseLeave={() => setIconHover(false)}
              onClick={setInputActive}
            />
          </span>
        </div>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
          <div className="d-flex gap-2 mt-2 mt-sm-0">
            <button className="btn btn-outline-secondary btn-sm" onClick={handleSave}>Salva</button>
            <label className="btn btn-outline-secondary btn-sm mb-0">
              Importa
              <input type="file" accept=".json" onChange={handleImport} className="d-none" />
            </label>
            <button className="btn btn-outline-success btn-sm" onClick={handleExport}>Esporta</button>
          </div>
        </div>
      </nav>

      <div className="d-flex flex-column flex-sm-row gap-3 flex-grow-1">
        <div className="d-flex flex-column gap-3">
          <NodeList
            meta={meta}
            orfani={orfani}
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
          onConfirm={() => { deleteAction?.(); setShowDeleteModal(false) }}
        />
      </div>
    </div>
  )
}

export default EditorScreen