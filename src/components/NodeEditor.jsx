import { useState, useEffect } from "react";

function NodeEditor({ node, onUpdate }) {
	const [localNode, setLocalNode] = useState(node);

	useEffect(() => {
		setLocalNode(node);
	}, [node]);

	if (!localNode) return <p>Nessun nodo selezionato</p>;

	function handleAddChoice() {
		const updated = {
			...localNode,
			choices: [[...localNode.choices, { text: "Nuova scelta", id: null }]],
		};
		setLocalNode(updated);
		onUpdate(updated);
	}

	function handleEditChoice(index, value) {
		const newChoices = [...node.choices];
		newChoices[index] = {
			...newChoices[index],
			[field]: value,
		};

		onUpdate({
			...node,
			choices: newChoices,
		});
		setLocalNode({
			...localNode,
			choices: newChoices,
		});
	}

	function handleDeleteChoice(index) {
		const newChoices = localNode.choices.filter((_, i) => i !== index);
		const updated = { ...localNode, choices: newChoices };
		setLocalNode(updated);
		onUpdate(updated);
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "8px",
				minWidth: "300px",
			}}
		>
			<h2>Modifica nodo</h2>

			<label>Personaggio</label>
			<input
				type="text"
				value={localNode.char}
				onChange={(e) => {
					const updated = { ...localNode, char: e.target.value };
					setLocalNode(updated);
					onUpdate(updated);
				}}
			/>

			<label>Testo</label>
			<textarea
				value={localNode.text}
				onChange={(e) => {
					const updated = { ...localNode, text: e.target.value };
					setLocalNode(updated);
					onUpdate(updated);
				}}
			/>

			<label>Scelte</label>
			{localNode.choices.map((choice, index) => (
				<div key={index} style={{ display: "flex", gap: "6px" }}>
					<input
						type="text"
						value={choice.text}
						onChange={(e) => handleEditChoice(index, e.target.value)}
					/>
					<input
						type="text"
						value={choice.id}
						onChange={(e) =>
							handleEditChoice(index, { ...choice, id: e.target.value })
						}
					/>
					<button onClick={() => handleDeleteChoice(index)}>✕</button>
				</div>
			))}

			<button onClick={handleAddChoice}>+ aggiungi scelta</button>
		</div>
	);
}

export default NodeEditor;
