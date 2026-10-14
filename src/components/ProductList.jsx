import ProductCard from "./ProductCard";

function ProductList({ products, onView, onEdit, onDelete }) {
	if (products.length === 0) {
		return (
			<div className="empty-state">
				<div className="empty-icon">
					<i className="fa-solid fa-magnifying-glass"></i>
				</div>

				<h4>No products found</h4>
				<p>Try another search term or reset your filters.</p>
			</div>
		);
	}

	return (
		<div className="row g-4">
			{products.map((product) => (
				<div className="col-12 col-md-6 col-xl-4" key={product.id}>
					<ProductCard
						product={product}
						onView={onView}
						onEdit={onEdit}
						onDelete={onDelete}
					/>
				</div>
			))}
		</div>
	);
}

export default ProductList;
