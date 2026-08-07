import { useState } from "react"
import ConfirmModal from "../components/modal/ConfirmModal"

function HomeScreen({ onOpen }) {
  const [atti, setAtti] = useState(() => {
    return JSON.parse(localStorage.getItem("atti") || "[]")
  })
  const [nuovoId, setNuovoId]           = useState("a1")
  const [errore, setErrore]             = useState("")
  const [showConfirm, setShowConfirm]   = useState(false)
  const [attoToDelete, setAttoToDelete] = useState(null)

  function handleCrea() {
    if (!/^a\d{1,2}$/.test(nuovoId)) {
      setErrore("Id non valido — usa il formato a1, a2, ... a99")
      return
    }
    if (atti.includes(nuovoId)) {
      setErrore("Esiste già un atto con questo id")
      return
    }

    // crea atto vuoto in localStorage
    const newAtto = {
      meta: { idAtto: nuovoId, dialogoIniziale: "" },
      personaggi: [],
      dialoghi: []
    }
    localStorage.setItem(`atto:${nuovoId}`, JSON.stringify(newAtto))

    // aggiorna lista
    const updated = [...atti, nuovoId]
    localStorage.setItem("atti", JSON.stringify(updated))
    setAtti(updated)
    setErrore("")
    setNuovoId("a1")
  }

  function handleDelete() {
    localStorage.removeItem(`atto:${attoToDelete}`)
    const updated = atti.filter(id => id !== attoToDelete)
    localStorage.setItem("atti", JSON.stringify(updated))
    setAtti(updated)
    setAttoToDelete(null)
    setShowConfirm(false)
  }

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result)
        if (!parsed.meta || !parsed.personaggi || !parsed.dialoghi) {
          throw new Error()
        }
        const id = parsed.meta.idAtto
        if (!id) throw new Error()

        localStorage.setItem(`atto:${id}`, JSON.stringify(parsed))
        if (!atti.includes(id)) {
          const updated = [...atti, id]
          localStorage.setItem("atti", JSON.stringify(updated))
          setAtti(updated)
        }
        onOpen(id)
      } catch {
        alert("File JSON non valido")
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="bg-dark min-vh-100 d-flex flex-column p-4 gap-4">

      {/* Header */}
      <nav className="navbar bg-body-tertiary rounded px-3">
        <span className="navbar-brand fw-bold">Dialog Editor</span>
        <label className="btn btn-outline-secondary btn-sm mb-0">
          Importa atto
          <input type="file" accept=".json" onChange={handleImport} className="d-none" />
        </label>
      </nav>

      {/* Crea nuovo atto */}
      <div className="bg-body-tertiary rounded p-3">
        <h6 className="fw-bold mb-3">Nuovo atto</h6>
        <div className="d-flex gap-2 align-items-start">
          <div>
            <input
              type="text"
              className={`form-control form-control-sm ${errore ? 'is-invalid' : ''}`}
              placeholder="es. a1"
              maxLength={3}
              value={nuovoId}
              onChange={(e) => {
                setErrore("")
                const val = e.target.value
                if (/^a\d{0,2}$/.test(val)) setNuovoId(val)
              }}
            />
            {errore && <div className="invalid-feedback">{errore}</div>}
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleCrea}>
            Crea
          </button>
        </div>
      </div>

      {/* Lista atti */}
      <div className="bg-body-tertiary rounded p-3">
        <h6 className="fw-bold mb-3">Atti salvati</h6>

        {atti.length === 0 ? (
          <p className="text-muted small mb-0">Nessun atto salvato — creane uno nuovo.</p>
        ) : (
          <div className="d-flex flex-column gap-2">
            {atti.map(id => {
              const data = JSON.parse(localStorage.getItem(`atto:${id}`) || "{}")
              const nDialoghi   = data.dialoghi?.length || 0
              const nPersonaggi = data.personaggi?.length || 0

              return (
                <div key={id} className="card p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold">{id}</div>
                      <div className="text-muted small">
                        {nDialoghi} dialoghi · {nPersonaggi} personaggi
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onOpen(id)}
                      >
                        Apri
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => { setAttoToDelete(id); setShowConfirm(true) }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <ConfirmModal
        show={showConfirm}
        title="Elimina atto"
        message={`Vuoi eliminare l'atto ${attoToDelete}? L'operazione è irreversibile.`}
        confirmText="Elimina"
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
      />

    </div>
  )
}

export default HomeScreen