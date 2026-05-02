import { useState } from 'react'

function Preview({ nodes }) {
  const startNode = nodes[0]
  const [currentNode, setCurrentNode] = useState(startNode)
  const [history, setHistory]         = useState([startNode])

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
    <div style={{ minWidth: '300px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Anteprima</h2>
        <button onClick={handleRestart}>Ricomincia</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
        {history.map((node, i) => (
          <div key={i} style={{ padding: '8px', background: '#f5f5f5', borderRadius: '6px' }}>
            <strong style={{ fontSize: '12px' }}>{node.char}</strong>
            <p style={{ margin: 0 }}>{node.text}</p>
          </div>
        ))}
      </div>

      {currentNode.choices.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {currentNode.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => handleChoice(choice.targetId)}
              disabled={!choice.targetId}
            >
              {choice.text}
            </button>
          ))}
        </div>
      ) : (
        <div>
          <p style={{ color: '#999', fontSize: '13px' }}>Fine del dialogo</p>
          <button onClick={handleRestart}>Ricomincia</button>
        </div>
      )}
    </div>
  )
}

export default Preview