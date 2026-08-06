function NodeList({
  dialoghi, personaggi, selectedId,
  onSelect, onAdd, onDelete,
  onAddPersonaggio, onUpdatePersonaggio, onDeletePersonaggio
}) {

  function getNome(personaggioId) {
    return personaggi.find(p => p.id === personaggioId)?.nome || '?'
  }

  return (
    <div className="bg-body-tertiary rounded p-3 d-flex flex-column gap-3">

      {/* Dialoghi */}
      <div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0 fw-bold">Dialoghi</h6>
          <button className="btn btn-primary btn-sm" onClick={onAdd}>
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
                <div className="flex-grow-1" onClick={() => onSelect(dialogo.id)}>
                  <div className="text-muted small mb-1">{dialogo.id}</div>
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
                    <div className="d-flex flex-wrap gap-1 mt-1">
                      {dialogo.scelte.map((s, i) => (
                        <span key={i} className="badge bg-secondary">{s.testo.slice(0, 20)}</span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  className="btn btn-outline-danger btn-sm ms-2"
                  onClick={() => onDelete(dialogo.id)}
                >✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="my-1" />

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
                onClick={() => onDeletePersonaggio(p.id)}
              >✕</button>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default NodeList