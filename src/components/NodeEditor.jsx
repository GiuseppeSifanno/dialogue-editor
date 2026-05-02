import { useState, useEffect } from 'react'

function NodeEditor({ node, nodes, onUpdate }) {
  const [localNode, setLocalNode] = useState(node)

  useEffect(() => {
    setLocalNode(node)
  }, [node])

  if (!localNode) return <p>Nessun nodo selezionato</p>

  function handleAddChoice() {
    const updated = {
      ...localNode,
      choices: [...localNode.choices, { text: 'Nuova scelta', targetId: null }]
    }
    setLocalNode(updated)
    onUpdate(updated)
  }

  function handleEditChoiceText(index, value) {
    const newChoices = localNode.choices.map((c, i) =>
      i === index ? { ...c, text: value } : c
    )
    const updated = { ...localNode, choices: newChoices }
    setLocalNode(updated)
    onUpdate(updated)
  }

  function handleEditChoiceTarget(index, targetId) {
    const newChoices = localNode.choices.map((c, i) =>
      i === index ? { ...c, targetId: Number(targetId) } : c
    )
    const updated = { ...localNode, choices: newChoices }
    setLocalNode(updated)
    onUpdate(updated)
  }

  function handleDeleteChoice(index) {
    const newChoices = localNode.choices.filter((_, i) => i !== index)
    const updated = { ...localNode, choices: newChoices }
    setLocalNode(updated)
    onUpdate(updated)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '300px' }}>
      <h2>Modifica nodo</h2>

      <label>Personaggio</label>
      <input
        type="text"
        value={localNode.char}
        onChange={(e) => {
          const updated = { ...localNode, char: e.target.value }
          setLocalNode(updated)
          onUpdate(updated)
        }}
      />

      <label>Testo</label>
      <textarea
        value={localNode.text}
        onChange={(e) => {
          const updated = { ...localNode, text: e.target.value }
          setLocalNode(updated)
          onUpdate(updated)
        }}
      />

      <label>Scelte</label>
      {localNode.choices.map((choice, index) => (
        <div key={index} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Testo scelta"
            value={choice.text}
            onChange={(e) => handleEditChoiceText(index, e.target.value)}
          />
          <select
            value={choice.targetId || ''}
            onChange={(e) => handleEditChoiceTarget(index, e.target.value)}
          >
            <option value="">→ nodo</option>
            {nodes
              .filter(n => n.id !== localNode.id)
              .map(n => (
                <option key={n.id} value={n.id}>
                  {n.char}: {n.text.slice(0, 20)}…
                </option>
              ))
            }
          </select>
          <button onClick={() => handleDeleteChoice(index)}>✕</button>
        </div>
      ))}

      <button onClick={handleAddChoice}>+ aggiungi scelta</button>
    </div>
  )
}

export default NodeEditor