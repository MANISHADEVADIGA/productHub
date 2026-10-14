function FilterBar({
	categories,
	category,
	setCategory,
	stockStatus,
	setStockStatus,
	onReset,
}) {
	return (
		<div className="filter-bar">
			<div className="filter-group">
				<label htmlFor="categoryFilter">Category</label>

				<select
					id="categoryFilter"
					className="form-select"
					value={category}
					onChange={(event) => setCategory(event.target.value)}>
					<option value="All">All categories</option>

					{categories.map((item) => (
						<option value={item} key={item}>
							{item}
						</option>
					))}
				</select>
			</div>

			<div className="filter-group">
				<label htmlFor="stockFilter">Stock status</label>

				<select
					id="stockFilter"
					className="form-select"
					value={stockStatus}
					onChange={(event) => setStockStatus(event.target.value)}>
					<option value="All">All stock</option>
					<option value="In Stock">In Stock</option>
					<option value="Low Stock">Low Stock</option>
					<option value="Out of Stock">Out of Stock</option>
				</select>
			</div>

			<button
				type="button"
				className="btn btn-light reset-button"
				onClick={onReset}>
				<i className="fa-solid fa-rotate-left me-1"></i>
				Reset
			</button>
		</div>
	);
}

export default FilterBar;
