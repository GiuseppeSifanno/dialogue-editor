import { useState, useEffect } from 'react'

function Preview({ 
  dialoghi = [], 
  personaggi= [], 
  dialogoIniziale 
}) {

  if (!dialogoIniziale) {
    return (
      <div className="bg-body-tertiary rounded p-3 h-100 d-flex align-items-center justify-content-center">
      <p className="text-muted mb-0">
        Nessun dialogo disponibile
      </p>
    </div>
    )
  }
  
  const startDialogo = dialoghi.find(d => d.id === dialogoIniziale) || dialoghi[0] || null
  
  const [currentDialogo, setCurrentDialogo] = useState(startDialogo)
  const [history, setHistory] = useState(
    startDialogo ? [startDialogo] : []
  )

  useEffect(() => {
    const stillExists = dialoghi.find(d => d.id === currentDialogo?.id)
    if (!stillExists) {
      setCurrentDialogo(startDialogo)
      setHistory([startDialogo])
    }
  }, [dialoghi])

  function getNome(personaggioId) {
    if (!personaggi || personaggi.length === 0) {
      return "???"
    }

    return (
      personaggi.find(p => p.id === personaggioId)?.nome ?? "Sconosciuto"
    )
  }

  function handleScelta(next) {
    const nextDialogo = dialoghi.find(d => d.id === next)
    if (nextDialogo) {
      setCurrentDialogo(nextDialogo)
      setHistory(prev => [...prev, nextDialogo])
    }
  }

  function handleRestart() {
    setCurrentDialogo(startDialogo)
    setHistory([startDialogo])
  }

  return (
    <div className="bg-body-tertiary rounded p-3 h-auto d-flex flex-column">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Anteprima</h5>
        <button 
          id='tooltip-preview'
          className="btn btn-outline-secondary btn-sm" 
          data-bs-toggle="tooltip" 
          data-bs-placement="left" 
          data-bs-title="Clicca per aggiornare la preview" 
          onClick={handleRestart}
        >
          Ricomincia
        </button>
      </div>

      {/* Storico */}
      <div className="d-flex flex-column gap-2 mb-3 flex-grow-1 overflow-auto" style={{fontSize:"large"}}>
        {history?.map((dialogo, hi) => (
          <div key={hi} className="d-flex flex-column gap-1">

            {/* Battute */}
            {dialogo && (
              dialogo.battute && ( 
                dialogo.battute.map((battuta, bi) => (
                  <div key={bi} className="card p-2 pt-0 mt-0">
                    <div className="fw-bold medium text-muted mb-1">
                      {getNome(battuta.personaggioId)}
                    </div>
                    <div className="small">{battuta.testo}</div>
                  </div>
                ))
              )
            )
          }

            {/* Scelta fatta — mostrata solo per i dialoghi passati */}
            {hi < history.length - 1 && dialogo.scelte?.length > 0 && (
              <div className="text-end">
                <span className="badge bg-primary mt-1 mb-0" style={{fontSize: "large"}}>
                  {dialogo.scelte.find(s => s.next === history[hi + 1]?.id)?.testo || ''}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Scelte attuali o continua o fine */}
      {currentDialogo?.scelte?.length > 0 ? (
        <div className="d-flex flex-column gap-2 w-25">
          {currentDialogo.scelte.map((scelta, i) => (
            <button
              key={i}
              className="btn btn-outline-primary btn-sm text-start w-auto"
              onClick={() => handleScelta(scelta.next)}
              disabled={!scelta.next}
            >
              {scelta.testo}
            </button>
          ))}
        </div>
      ) : currentDialogo?.nextId ? (
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => handleScelta(currentDialogo.nextId)}
        >
          Continua →
        </button>
      ) : (
        <div className="text-center">
          <p className="text-muted small mb-2">Fine del dialogo</p>
          <button className="btn btn-outline-secondary btn-sm" onClick={handleRestart}>
            Ricomincia
          </button>
        </div>
      )}

    </div>
  )
}

export default Preview