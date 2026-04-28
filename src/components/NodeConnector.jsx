function NodeConnector({ connectId, nodeId }) {
  return (
    <input type="text" placeholder="Collega dialogo" onInput={(e) => connectId(e.target.value, nodeId)}/>
  )
}

export default NodeConnector