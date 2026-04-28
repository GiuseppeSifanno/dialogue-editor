import NodeConnector from "./NodeConnector";

function NodeList({ nodes, selectedId, onSelect, onAdd, onDelete }) {
  return (
    <div style={{ minWidth: '220px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Nodi</h2>
        <button onClick={onAdd}>+ aggiungi</button>
      </div>

      {nodes.map(node => (
        <div
          key={node.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px',
            marginBottom: '6px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            cursor: 'pointer',
            background: node.id === selectedId ? '#EEEDFE' : 'white',
          }}
        >
          <div onClick={() => onSelect(node.id)} style={{ flex: 1 }}>
            <strong>{node.char}</strong>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              {node.text.length > 30 ? node.text.slice(0, 30) + '…' : node.text}
            </p>
            {
              node.choices.length > 0 && (
                node.choices.map((c, i) => (
                  <p key={i} style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                    {c}
                  </p>
                ))
              )
            }
          </div>
          <button
            onClick={() => onDelete(node.id)}
            style={{ marginLeft: '8px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

export default NodeList