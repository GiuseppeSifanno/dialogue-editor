function NodeList({
  meta, orfani, dialoghi, personaggi, selectedId,
  onSelectDialogo, onAddDialogo, onDeleteDialogo, onChangeDialogoIniziale,
  onAddPersonaggio, onUpdatePersonaggio, onDeletePersonaggio, 
  openConfirm
}) {

  function getNome(personaggioId) {
    return personaggi.find(p => p.id === personaggioId)?.nome || '?'
  }

  return (
    <div className="bg-body-tertiary rounded p-3 d-flex flex-column gap-3">

      {/* Personaggi */}
      <div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0 fw-bold">Personaggi</h6>
          <button className="btn btn-secondary btn-sm" onClick={onAddPersonaggio}>
            + Aggiungi
          </button>
        </div>

        <div className="d-flex flex-column gap-2">
          {personaggi.map(p => (
            <div key={p.id} className="d-flex gap-2 align-items-center">
              <span className="badge bg-secondary">{p.id}</span>
              <input
                type="text"
                className="form-control form-control-sm"
                value={p.nome}
                onChange={(e) => onUpdatePersonaggio({ ...p, nome: e.target.value })}
              />
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => 
                  openConfirm( () => onDeletePersonaggio(p.id), "Vuoi eliminare questo personaggio?")
                }
              >✕</button>
            </div>
          ))}
        </div>
      </div>

      <hr className="my-1" />

      {/* Dialoghi */}
      <div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <h6 className="mb-0 fw-bold">Dialoghi</h6>
            { dialoghi && (
              <h6 className="small ps-1 fst-italic">Dialogo iniziale: {meta.dialogoIniziale}</h6>
            )}
            </div>
          
          <button className="btn btn-primary btn-sm" onClick={onAddDialogo} disabled={personaggi.length === 0}>
            + Aggiungi
          </button>
        </div>

        <div className="d-flex flex-column gap-2">
          {dialoghi.map(dialogo => (
            <div
              key={dialogo.id}
              className={`card p-2 ${dialogo.id === selectedId ? 'border-primary' : ''}`}
              style={{ background: dialogo.id === selectedId ? '#EEEDFE' : 'white', cursor: 'pointer' }}
            >
              
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1" onClick={() => onSelectDialogo(dialogo.id)}>
                  <div className="text-muted small mb-1 d-flex align-items-center gap-1">
                    {dialogo.id}
                    {orfani.has(dialogo.id) && (
                      <span className="badge bg-warning text-dark" title="Dialogo non raggiungibile">
                        orfano
                      </span>
                    )}
                  </div>
                  {dialogo.battute.slice(0, 2).map((b, i) => (
                    <div key={i} className="small">
                      <span className="fw-bold">{getNome(b.personaggioId)}</span>
                      {': '}
                      {b.testo.length > 30 ? b.testo.slice(0, 30) + '…' : b.testo}
                    </div>
                  ))}
                  {dialogo.battute.length > 2 && (
                    <div className="text-muted small">+{dialogo.battute.length - 2} battute</div>
                  )}
                  {dialogo.scelte.length > 0 && (
                    <div className="d-flex">
                      <div>
                        <span className="fw-bold fst-italic">Scelte: </span>
                      </div>
                      <div className="ms-2">
                        <div className="d-flex flex-wrap gap-1 mt-1">
                          {dialogo.scelte.map((s, i) => (
                            <span key={i} className="badge bg-secondary">{s.testo.slice(0, 20)}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="btn-group w-auto h-auto">
                  <button className="border-0 bg-transparent btn btn-sm" value={dialogo.id} 
                    onClick={ () => onChangeDialogoIniziale(dialogo.id)}>
                    {dialogo.id === meta.dialogoIniziale ? (
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFF55"><path d="m209-93 103-333L38-641h334l108-332 108 332h334L648-426 752-93 481-299 209-93Z"/></svg>
                    ):
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="m384-334 96-74 96 74-36-122 90-64H518l-38-124-38 124H330l90 64-36 122ZM199-69l106-346L22-617h347l111-364 111 364h347L655-415 762-69 481-283 199-69Zm281-420Z"/></svg>
                    }
                  </button>
                    
                  <button
                    className="btn btn-outline-danger btn-sm rounded"
                    onClick={() =>
                      openConfirm( () => onDeleteDialogo(dialogo.id), "Vuoi eliminare questo dialogo?")
                    }
                  >✕</button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default NodeList