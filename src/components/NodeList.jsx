import { end, start } from "@popperjs/core";
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

			<div className="gap-3 d-flex justify-align-content-between flex-md-wrap">
				{nodes.map((node) => (
					<div
						key={node.id}
						className="d-flex p-2 rounded card h-auto"
						style={{
							cursor: "pointer",
							border: "1px solid #ccc",
							borderRadius: "6px",
							justifyContent: "space-between",
							background: node.id === selectedId ? "#EEEDFE" : "white",
							width: "350px",
							minWidth: "250px",
						}}
					>
						<div className="justify-content-end position-relative">
							<button
								type="button"
								className="btn btn-danger position-absolute end-0"
								aria-pressed="false"
								data-bs-toggle="button"
								cursor="pointer"
								value="delete"
								onClick={() => onDelete(node.id)}
								style={{
									padding: "3px 10px 3px 10px",
								}}
							>
								✕
							</button>
						</div>

						<div
							onClick={() => onSelect(node.id)}
							style={{
								flex: 1,
								padding: "8px",
								border: "none",
								background: "transparent",
							}}
						>
							<h3 className="pt-4 text-start">{node.char}</h3>
							<h2 style={{ margin: 0, fontSize: "20px", color: "#666" }}>
								{node.text.length > 30
									? node.text.slice(0, 30) + "…"
									: node.text}
							</h2>
							<div className="container-fluid ms-3">
								<ul className="list-group">
									{node.choices.length > 0 &&
										node.choices.map((c, i) => (
											<li
												key={i}
												className="list-gruop-item border border-2 rounded-end-2 border-black mt-3 p-1"
												style={{
													margin: 0,
													fontSize: "12px",
													color: "#2e2e2e",
													textAlign: start,
												}}
											>
												{c.text}
											</li>
										))}
								</ul>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default NodeList;
