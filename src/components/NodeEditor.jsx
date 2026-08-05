import { useState, useEffect } from 'react'

function NodeEditor({ node, nodes, onUpdate }) {
  const [localNode, setLocalNode] = useState(node)

  useEffect(() => {
    setLocalNode(node)
  }, [node])

  if (!localNode) return (
    <div className="bg-body-tertiary rounded p-3 text-muted">
      Seleziona un nodo per modificarlo
    </div>
  )

  function handleAddChoice() {
    const updated = { ...localNode, choices: [...localNode.choices, { text: 'Nuova scelta', targetId: null }] }
    setLocalNode(updated)
    onUpdate(updated)
  }

  function handleEditChoiceText(index, value) {
    const newChoices = localNode.choices.map((c, i) => i === index ? { ...c, text: value } : c)
    const updated = { ...localNode, choices: newChoices }
    setLocalNode(updated)
    onUpdate(updated)
  }

  function handleEditChoiceTarget(index, targetId) {
    const newChoices = localNode.choices.map((c, i) => i === index ? { ...c, targetId: Number(targetId) } : c)
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
    <div className="bg-body-tertiary rounded p-3 d-flex flex-column gap-3">
      <h5 className="mb-0">Modifica nodo</h5>

      <div>
        <label className="form-label">Personaggio</label>
        <input
          type="text"
          className="form-control"
          value={localNode.char}
          onChange={(e) => {
            const updated = { ...localNode, char: e.target.value }
            setLocalNode(updated)
            onUpdate(updated)
          }}
        />
      </div>

      <div>
        <label className="form-label">Testo</label>
        <textarea
          className="form-control"
          rows={3}
          value={localNode.text}
          onChange={(e) => {
            const updated = { ...localNode, text: e.target.value }
            setLocalNode(updated)
            onUpdate(updated)
          }}
        />
      </div>

      <div>
        <label className="form-label">Scelte</label>
        <div className="d-flex flex-column gap-2">
          {localNode.choices.map((choice, index) => (
            <div key={index} className="d-flex gap-2 align-items-center">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Testo scelta"
                value={choice.text}
                onChange={(e) => handleEditChoiceText(index, e.target.value)}
              />
              <select
                className="form-select form-select-sm"
                value={choice.targetId || ''}
                onChange={(e) => handleEditChoiceTarget(index, e.target.value)}
              >
                <option value="">→ nodo</option>
                {nodes.filter(n => n.id !== localNode.id).map(n => (
                  <option key={n.id} value={n.id}>
                    {n.char}: {n.text.slice(0, 20)}…
                  </option>
                ))}
              </select>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => handleDeleteChoice(index)}
              >✕</button>
            </div>
          ))}
        </div>
        <button className="btn btn-outline-secondary btn-sm mt-2" onClick={handleAddChoice}>
          + Aggiungi scelta
        </button>
      </div>
    </div>
  )
}

export default NodeEditor