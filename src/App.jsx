import { useState } from "react";
import NodeList from "./components/NodeList";
import NodeEditor from "./components/NodeEditor";
import Preview from "./components/Preview";

const initialNodes = [
  { id: 1, char: "Eroe", text: "Ciao, ho bisogno di aiuto.", choices: [{ text: '', id: '' }] },
  { id: 2, char: "Mercante", text: "Cosa posso fare per te?", choices: [{ text: '', id: '' }] },
  { id: 3, char: "Guardia", text: "Alt! Documenti.", choices: [{ text: '', id: '' }] },
];

function App() {
  const [nodes, setNodes]           = useState(initialNodes);
  const [selectedId, setSelectedId] = useState(1);
  const [nextId, setNextId]         = useState(4);

  const selectedNode = nodes.find((n) => n.id === selectedId);

  function handleUpdate(updatedNode) {
    setNodes(prev => prev.map(n => n.id === updatedNode.id ? updatedNode : n));
    console.log('nodo aggiornato:', updatedNode)
  }

  function handleAdd() {
    const newNode = { id: nextId, char: "Nuovo personaggio", text: "Nuovo dialogo", choices: [] };
    setNodes(prev => [...prev, newNode]);
    setSelectedId(nextId);
    setNextId(nextId + 1);
  }

  function handleDelete() {
    const remaining = nodes.filter(n => n.id !== selectedId);
    setNodes(remaining);
    setSelectedId(remaining[0]?.id || null);
  }

  return (
    <div style={{ padding: "24px" }}>
      <h1>Dialogue Editor</h1>

      <div style={{ display: "flex", gap: "24px" }}>
        <NodeList
          nodes={nodes}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />
        <NodeEditor
          key={selectedId}
          node={selectedNode}
          onUpdate={handleUpdate}
        />
        <Preview nodes={nodes} />
      </div>
    </div>
  );
}

export default App;
