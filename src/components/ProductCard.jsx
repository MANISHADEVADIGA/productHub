function ProductCard({ product, onView, onEdit, onDelete }) {
	const stock = Number(product.stock);

	const stockLabel =
		stock === 0 ? "Out of Stock"
		: stock <= 5 ? "Low Stock"
		: "In Stock";

	const stockClass =
		stock === 0 ? "stock-out"
		: stock <= 5 ? "stock-low"
		: "stock-good";

	return (
		<article className="product-card">
			<div className="product-image-wrapper">
				<img
					src={product.image || "https://placehold.co/600x400?text=SmartShelf"}
					alt={product.name}
					className="product-image"
					onError={(event) => {
						event.currentTarget.onerror = null;
						event.currentTarget.src =
							"https://placehold.co/600x400?text=SmartShelf";
					}}
				/>

				<span
					className={`product-status ${
						product.status === "Active" ? "status-active" : "status-inactive"
					}`}>
					{product.status}
				</span>
			</div>

			<div className="product-card-body">
				<div className="d-flex justify-content-between align-items-start gap-2">
					<span className="category-label">{product.category}</span>
					<span className={`stock-badge ${stockClass}`}>{stockLabel}</span>
				</div>

				<h5 className="product-name">{product.name}</h5>

				<p className="product-description">
					{product.description || "No description available."}
				</p>

				<div className="product-details">
					<div>
						<small>Price</small>
						<strong>₹{Number(product.price).toLocaleString("en-IN")}</strong>
					</div>

					<div className="text-end">
						<small>Available stock</small>
						<strong>{stock} units</strong>
					</div>
				</div>

				<div className="product-actions">
					<button
						type="button"
						className="btn btn-outline-primary"
						onClick={() => onView(product)}>
						<i className="fa-solid fa-eye me-1"></i>
						View
					</button>

					<button
						type="button"
						className="btn btn-outline-secondary"
						onClick={() => onEdit(product)}>
						<i className="fa-solid fa-pen me-1"></i>
						Edit
					</button>

					<button
						type="button"
						className="btn btn-outline-danger"
						onClick={() => onDelete(product)}
						aria-label={`Delete ${product.name}`}>
						<i className="fa-solid fa-trash"></i>
					</button>
				</div>
			</div>
		</article>
	);
}

export default ProductCard;
