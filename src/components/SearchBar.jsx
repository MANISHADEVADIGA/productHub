function SearchBar({ value, onChange, onClear }) {
	return (
		<div className="search-wrapper">
			<i className="fa-solid fa-magnifying-glass search-icon"></i>

			<input
				type="search"
				className="form-control search-input"
				placeholder="Search products by name, category or description..."
				value={value}
				onChange={(event) => onChange(event.target.value)}
				aria-label="Search products"
			/>

			{value && (
				<button
					type="button"
					className="search-clear"
					onClick={onClear}
					aria-label="Clear search">
					<i className="fa-solid fa-xmark"></i>
				</button>
			)}
		</div>
	);
}

export default SearchBar;
