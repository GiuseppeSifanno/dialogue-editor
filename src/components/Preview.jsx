import { useEffect, useState } from 'react'

function Preview({ nodes }) {
  const [currentNode, setCurrentNode] = useState(nodes[0])
  const [history, setHistory]         = useState([nodes[0]])

  useEffect(() => {
  const stillExists = nodes.find(n => n.id === currentNode?.id)
  if (!stillExists) {
    setCurrentNode(nodes[0])
    setHistory([nodes[0]])
  }}, [nodes])

  
  if (!nodes || nodes.length === 0){
    return (
      <div className="bg-body-tertiary rounded p-3 h-100 d-flex align-items-center justify-content-center">
        <p className="text-muted mb-0">Nessun dialogo</p>
      </div>
    )
  }

  function handleChoice(targetId) {
    const nextNode = nodes.find(n => n.id === targetId)
    if (nextNode) {
      setCurrentNode(nextNode)
      setHistory(prev => [...prev, nextNode])
    }
  }

  function handleRestart() {
    setCurrentNode(nodes[0])
    setHistory([nodes[0]])
  }

  return (
    <div className="bg-body-tertiary rounded p-3 h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Anteprima</h5>
        <button className="btn btn-outline-secondary btn-sm" onClick={handleRestart}>
          Ricomincia
        </button>
      </div>
      {/* Storico messaggi */}
      <div className="d-flex flex-column gap-2 mb-3 flex-grow-1 overflow-auto">
        {history.map((node, i) => (
          <div key={i} className="card p-2">
            <div className="fw-bold small text-muted">{node.char}</div>
            <div>{node.text}</div>
          </div>
        ))}
      </div>
      {/* Scelte o fine */}
      {currentNode.choices.length > 0 ? (
        <div className="d-flex flex-column gap-2">
          {currentNode.choices.map((choice, i) => (
            <button
              key={i}
              className="btn btn-outline-primary btn-sm text-start"
              onClick={() => handleChoice(choice.targetId)}
              disabled={!choice.targetId}
            >
              {choice.text}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-muted small">Fine del dialogo</p>
          <button className="btn btn-outline-secondary btn-sm" onClick={handleRestart}>
            Ricomincia
          </button>
        </div>
      )}
    </div>
  )
}

export default Preview