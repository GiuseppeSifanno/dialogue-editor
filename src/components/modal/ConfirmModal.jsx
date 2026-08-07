function ConfirmModal({
	show,
	title,
	message,
	confirmText,
	cancelText = "Annulla",
	onConfirm,
	onClose,
}) {
	if (!show) return null;

	return (
		<div>
			<div className="modal fade show d-block" tabIndex="-1">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">{title}</h5>
							<button type="button" className="btn-close" onClick={onClose} />
						</div>
						<div className="modal-body">
							<p className="mb-0">{message}</p>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-secondary"
								onClick={onClose}
							>
								{cancelText}
							</button>

							<button
								type="button"
								className="btn btn-danger"
								onClick={onConfirm}
							>
								{confirmText}
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="modal-backdrop fade show"></div>
		</div>
	);
}

export default ConfirmModal;
