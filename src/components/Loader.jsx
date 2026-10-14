function Loader({ message = "Loading products..." }) {
	return (
		<div className="loading-state" role="status">
			<div className="spinner-border text-primary" aria-hidden="true"></div>
			<p>{message}</p>
		</div>
	);
}

export default Loader;
