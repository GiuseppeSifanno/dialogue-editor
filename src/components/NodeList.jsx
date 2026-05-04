import NodeConnector from "./NodeConnector";

function NodeList({ nodes, selectedId, onSelect, onAdd, onDelete }) {
  return (
    <div className="d-flex flex-column">
      <div className="d-flex justify-content-end align-items-center mb-3">
        <button 
          type="button" 
          className="btn btn-primary" 
          data-bs-toggle="button" 
          aria-pressed="false" 
          onClick={onAdd}
        >
          aggiungi
        </button>
      </div>

      {nodes.map(node => (
        <div
          key={node.id}
          className="d-flex p-2 rounded card w-auto h-auto"
          style={{
            cursor: 'pointer',
            border: '1px solid #ccc',
            borderRadius: '6px',
            justifyContent: 'space-between',
            background: node.id === selectedId ? '#EEEDFE' : 'white',
          }}
        >
          <div className="justify-content-end d-flex">
              <button
              type="button" 
              className="btn btn-danger"
              aria-pressed="false" 
              data-bs-toggle="button"
              cursor="pointer" 
              value="delete"
              onClick={() => onDelete(node.id)}
            >
              ✕
            </button>
          </div>
          

          <div 
            onClick={() => onSelect(node.id)} style={{ flex: 1 }}
            style={{ padding: '8px', border: 'none', background: 'transparent' }}  
          >
            <strong>{node.char}</strong>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              {node.text.length > 30 ? node.text.slice(0, 30) + '…' : node.text}
            </p>
            {
              node.choices.length > 0 && (
                node.choices.map((c, i) => (
                  <p key={i} style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                    {c.text}
                  </p>
                ))
              )
            }
          </div>
        </div>
      ))}
    </div>
  )
}

export default NodeList