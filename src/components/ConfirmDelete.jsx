function ConfirmDelete({ product, onConfirm, onCancel, deleting }) {
	if (!product) {
		return null;
	}

	return (
		<div
			className="modal-backdrop-custom"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget && !deleting) {
					onCancel();
				}
			}}>
			<div
				className="confirm-dialog"
				role="dialog"
				aria-modal="true"
				aria-labelledby="deleteTitle">
				<div className="delete-icon">
					<i className="fa-solid fa-trash"></i>
				</div>

				<h4 id="deleteTitle">Delete product?</h4>

				<p>
					Are you sure you want to delete <strong>{product.name}</strong>? This
					action cannot be undone.
				</p>

				<div className="form-actions">
					<button
						type="button"
						className="btn btn-light"
						onClick={onCancel}
						disabled={deleting}>
						Cancel
					</button>

					<button
						type="button"
						className="btn btn-danger"
						onClick={onConfirm}
						disabled={deleting}>
						{deleting ? "Deleting..." : "Yes, delete"}
					</button>
				</div>
			</div>
		</div>
	);
}

export default ConfirmDelete;
