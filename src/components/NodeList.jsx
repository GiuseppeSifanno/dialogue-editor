function NodeList({ nodes, selectedId, onSelect, onAdd, onDelete }) {
  return (
    <div className="bg-body-tertiary rounded p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Nodi</h5>
        <button className="btn btn-primary btn-sm" onClick={onAdd}>
          + Aggiungi
        </button>
      </div>

      <div className="d-flex flex-column gap-2">
        {nodes.map(node => (
          <div
            key={node.id}
            className={`card p-2 ${node.id === selectedId ? 'border-primary' : ''}`}
            style={{ cursor: 'pointer', background: node.id === selectedId ? '#EEEDFE' : 'white' }}
          >
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1" onClick={() => onSelect(node.id)}>
                <div className="fw-bold">{node.char}</div>
                <div className="text-muted small">
                  {node.text.length > 40 ? node.text.slice(0, 40) + "…" : node.text}
                </div>
                {node.choices.length > 0 && (
                  <div className="d-flex flex-wrap gap-1 mt-1">
                    {node.choices.map((c, i) => (
                      <span key={i} className="badge bg-secondary">{c.text}</span>
                    ))}
                  </div>
                )}
              </div>
              <button
                className="btn btn-outline-danger btn-sm ms-2"
                onClick={() => onDelete(node.id)}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NodeList