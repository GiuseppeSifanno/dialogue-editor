import { useEffect, useState } from "react";
import NodeList from "./components/NodeList";
import NodeEditor from "./components/NodeEditor";
import Preview from "./components/Preview";


// Prova a caricare i nodi salvati in precedenza
const savedNodes = localStorage.getItem('dialogueNodes')

// Se ci sono dati salvati, usali; altrimenti, usa i nodi di esempio
const initialNodes = savedNodes ? JSON.parse(savedNodes) : [
	{
		id: 1,
		char: "Eroe",
		text: "Ciao, ho bisogno di aiuto.",
		choices: [
			{ text: "Compro qualcosa", targetId: 2 },
			{ text: "Niente grazie", targetId: 3 },
		],
	},
	{ id: 2, char: "Mercante", text: "Cosa posso fare per te?", choices: [] },
	{ id: 3, char: "Guardia", text: "Alt! Documenti.", choices: [] },
];

function App() {
	const [nodes, setNodes] = useState(initialNodes);
	const [selectedId, setSelectedId] = useState(1);
	const [nextId, setNextId] = useState(4);

	const selectedNode = nodes.find((n) => n.id === selectedId);

  // Salva i nodi in localStorage ogni volta che cambiano
  useEffect(() => {
    localStorage.setItem('dialogueNodes', JSON.stringify(nodes));
  }, [nodes]);

	function handleUpdate(updatedNode) {
		setNodes((prev) =>
			prev.map((n) => (n.id === updatedNode.id ? updatedNode : n)),
		);
		console.log("nodo aggiornato:", updatedNode);
	}

	function handleAdd() {
		const newNode = {
			id: nextId,
			char: "Nuovo personaggio",
			text: "Nuovo dialogo",
			choices: [],
		};
		setNodes((prev) => [...prev, newNode]);
		setSelectedId(nextId);
		setNextId(nextId + 1);
	}

	function handleDelete() {
		const remaining = nodes.filter((n) => n.id !== selectedId);
		setNodes(remaining);
		setSelectedId(remaining[0]?.id || null);
	}

  function handleExport() {
		const json = JSON.stringify(nodes, null, 2);
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "dialogo.json";
		a.click();
		URL.revokeObjectURL(url);
	}

	function handleImport(e) {
		const file = e.target.files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (event) => {
			const parsed = JSON.parse(event.target.result);
			setNodes(parsed);
			setSelectedId(parsed[0]?.id || null);
		};
		reader.readAsText(file);
	}

	return (
		<div style={{ padding: "24px" }}>
			<h1>Dialogue Editor</h1>
			<button onClick={handleExport}>⬇ Esporta JSON</button>
			<label
				style={{
					cursor: "pointer",
					border: "1px solid #ccc",
					padding: "4px 10px",
					borderRadius: "6px",
				}}
			>
				Importa JSON
				<input
					type="file"
					accept=".json"
					onChange={handleImport}
					style={{ display: "none" }}
				/>
			</label>

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
					nodes={nodes}
					onUpdate={handleUpdate}
				/>
				<Preview nodes={nodes} />
			</div>
		</div>
	);
}

export default App;
