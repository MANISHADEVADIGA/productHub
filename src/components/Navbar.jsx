function Navbar({ onAdd }) {
	return (
		<nav className="navbar smart-navbar">
			<div className="container-fluid px-3 px-lg-5">
				<a className="navbar-brand d-flex align-items-center gap-2" href="#">
					<span className="brand-icon">
						<i className="fa-solid fa-box"></i>
					</span>

					<span>
						<strong>SmartShelf</strong>
						<small className="brand-subtitle d-block">
							Inventory workspace
						</small>
					</span>
				</a>

				<button
					type="button"
					className="btn btn-primary add-button"
					onClick={onAdd}>
					<i className="fa-solid fa-plus me-2"></i>
					Add Product
				</button>
			</div>
		</nav>
	);
}

export default Navbar;
