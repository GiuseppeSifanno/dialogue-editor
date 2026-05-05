import { useEffect, useState } from "react";
import NodeList from "./components/NodeList";
import NodeEditor from "./components/NodeEditor";
import Preview from "./components/Preview";

// Prova a caricare i nodi salvati in precedenza
const savedNodes = localStorage.getItem("dialogueNodes");

// Se ci sono dati salvati, usali; altrimenti, usa i nodi di esempio
const initialNodes = savedNodes
	? JSON.parse(savedNodes)
	: [
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

	// Salva i nodi in localStorage
	function save(nodes) {
		localStorage.setItem("dialogueNodes", JSON.stringify(nodes));
	}

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
		<div className="bg-dark text-white container-fluid min-vh-100 d-flex flex-column">
			<nav className="navbar navbar-expand-sm bg-body-tertiary mb-4 rounded mt-3">
				<div className="container-fluid">
					<div className="w-50">
						<p className="h2 mb-0 text-black">Dialog Editor</p>
					</div>

					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarSupportedContent"
						aria-controls="navbarSupportedContent"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon"></span>
					</button>
					<div
						className="collapse navbar-collapse d-flex align-items-center justify-content-end w-auto"
						id="navbarSupportedContent"
					>
						<ul className="navbar-nav column-gap-3">
							<li className="nav-item">
								<button
									className="btn btn-light btn-outline-success"
									onClick={save}
								>
									Salva
								</button>
							</li>

							<li className="nav-item position">
								<button className="btn btn-outline-success position-relative overflow-hidden">
									Importa
									<input
										type="file"
										accept=".json"
										onChange={handleImport}
										style={{ display: "none" }}
									/>
								</button>
							</li>

							<li className="nav-item">
								<i className="bi bi-upload"></i>
								<button
									className="btn btn-light btn-outline-success"
									onClick={handleExport}
								>
									Esporta
								</button>
							</li>
						</ul>
					</div>
				</div>
			</nav>

			<div className="container-fluid bg-secondary rounded p-3 d-flex flex-row gap-5">
				<div className="container-fluid d-flex flex-column flex-grow-1 gap-3">
					<NodeList
						nodes={nodes}
						selectedId={selectedId}
						onSelect={setSelectedId}
						onAdd={handleAdd}
						onDelete={handleDelete}
					/>
					<div>
						<NodeEditor
							key={selectedId}
							node={selectedNode}
							nodes={nodes}
							onUpdate={handleUpdate}
						/>
					</div>
					
				</div>

				<div className="d-flex flex-column">
					<Preview nodes={nodes} />
				</div>
			</div>
		</div>
	);
}

export default App;
