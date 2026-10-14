function DashboardStats({ products }) {
	const totalProducts = products.length;

	const inventoryValue = products.reduce(
		(total, product) => total + Number(product.price) * Number(product.stock),
		0,
	);

	const lowStock = products.filter(
		(product) => Number(product.stock) > 0 && Number(product.stock) <= 5,
	).length;

	const outOfStock = products.filter(
		(product) => Number(product.stock) === 0,
	).length;

	const stats = [
		{
			title: "Total Products",
			value: totalProducts,
			icon: "fa-box",
			color: "purple",
		},
		{
			title: "Inventory Value",
			value: `₹${inventoryValue.toLocaleString("en-IN")}`,
			icon: "fa-indian-rupee-sign",
			color: "green",
		},
		{
			title: "Low Stock",
			value: lowStock,
			icon: "fa-triangle-exclamation",
			color: "orange",
		},
		{
			title: "Out of Stock",
			value: outOfStock,
			icon: "fa-boxes-stacked",
			color: "red",
		},
	];

	return (
		<div className="row g-3 mb-4">
			{stats.map((stat) => (
				<div className="col-12 col-sm-6 col-xl-3" key={stat.title}>
					<div className="stat-card">
						<div>
							<p className="stat-title">{stat.title}</p>
							<h3 className="stat-value">{stat.value}</h3>
						</div>

						<div className={`stat-icon ${stat.color}`}>
							<i className={`fa-solid ${stat.icon}`}></i>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

export default DashboardStats;
