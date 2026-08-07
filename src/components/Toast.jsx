function Toast({ show, message, onClose, variant }) {
	if (!show) return null;

	return (
		<div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
			<div className={`toast show align-items-center text-bg-${variant || 'success'} border-0`}>
				<div className="d-flex">
					<div className="toast-body fw-bold">{message}</div>
					<button
						type="button"
						className="btn-close btn-close-white me-2 m-auto"
						onClick={onClose}
					/>
				</div>
			</div>
		</div>
	);
}

export default Toast