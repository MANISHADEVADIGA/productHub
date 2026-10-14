import { useEffect, useState } from "react";

const initialForm = {
	name: "",
	category: "Electronics",
	price: "",
	stock: "",
	status: "Active",
	description: "",
	image: "",
};

function ProductForm({ product, onSave, onCancel, saving }) {
	const [form, setForm] = useState({ ...initialForm });
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (product) {
			setForm({
				name: product.name || "",
				category: product.category || "Electronics",
				price: String(product.price ?? ""),
				stock: String(product.stock ?? ""),
				status: product.status || "Active",
				description: product.description || "",
				image: product.image || "",
			});
		} else {
			setForm({ ...initialForm });
		}

		setErrors({});
	}, [product]);

	function handleChange(e) {
		const { name, value } = e.target;

		setForm((prev) => ({
			...prev,
			[name]: value,
		}));

		setErrors((prev) => ({
			...prev,
			[name]: "",
		}));
	}

	function validateForm() {
		const newErrors = {};

		if (!form.name.trim()) {
			newErrors.name = "Product name is required.";
		}

		if (!form.category.trim()) {
			newErrors.category = "Category is required.";
		}

		if (
			form.price === "" ||
			!Number.isFinite(Number(form.price)) ||
			Number(form.price) < 0
		) {
			newErrors.price = "Enter a valid price.";
		}

		if (
			form.stock === "" ||
			!Number.isInteger(Number(form.stock)) ||
			Number(form.stock) < 0
		) {
			newErrors.stock = "Enter a valid whole stock quantity.";
		}

		if (!["Active", "Inactive"].includes(form.status)) {
			newErrors.status = "Select a valid status.";
		}

		if (form.image.trim() && !/^https?:\/\/\S+$/i.test(form.image.trim())) {
			newErrors.image =
				"Enter a valid image URL starting with http:// or https://.";
		}

		setErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	}

	function handleSubmit(e) {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		const productData = {
			name: form.name.trim(),
			category: form.category.trim(),
			price: Number(form.price),
			stock: Number(form.stock),
			status: form.status,
			description: form.description.trim(),
			image: form.image.trim(),
		};

		onSave(productData);
	}

	return (
		<form onSubmit={handleSubmit} noValidate>
			<div className="mb-3">
				<label htmlFor="product-name" className="form-label">
					Product Name
				</label>

				<input
					id="product-name"
					type="text"
					name="name"
					className={`form-control ${errors.name ? "is-invalid" : ""}`}
					placeholder="Enter product name"
					value={form.name}
					onChange={handleChange}
				/>

				{errors.name && <div className="invalid-feedback">{errors.name}</div>}
			</div>

			<div className="mb-3">
				<label htmlFor="product-category" className="form-label">
					Category
				</label>

				<input
					id="product-category"
					type="text"
					name="category"
					className={`form-control ${errors.category ? "is-invalid" : ""}`}
					placeholder="Enter category"
					value={form.category}
					onChange={handleChange}
				/>

				{errors.category && (
					<div className="invalid-feedback">{errors.category}</div>
				)}
			</div>

			<div className="row">
				<div className="col-md-6 mb-3">
					<label htmlFor="product-price" className="form-label">
						Price (₹)
					</label>

					<input
						id="product-price"
						type="number"
						name="price"
						min="0"
						step="0.01"
						className={`form-control ${errors.price ? "is-invalid" : ""}`}
						placeholder="Enter price"
						value={form.price}
						onChange={handleChange}
					/>

					{errors.price && (
						<div className="invalid-feedback">{errors.price}</div>
					)}
				</div>

				<div className="col-md-6 mb-3">
					<label htmlFor="product-stock" className="form-label">
						Stock Quantity
					</label>

					<input
						id="product-stock"
						type="number"
						name="stock"
						min="0"
						step="1"
						className={`form-control ${errors.stock ? "is-invalid" : ""}`}
						placeholder="Enter stock quantity"
						value={form.stock}
						onChange={handleChange}
					/>

					{errors.stock && (
						<div className="invalid-feedback">{errors.stock}</div>
					)}
				</div>
			</div>

			<div className="mb-3">
				<label htmlFor="product-status" className="form-label">
					Status
				</label>

				<select
					id="product-status"
					name="status"
					className={`form-select ${errors.status ? "is-invalid" : ""}`}
					value={form.status}
					onChange={handleChange}>
					<option value="Active">Active</option>
					<option value="Inactive">Inactive</option>
				</select>

				{errors.status && (
					<div className="invalid-feedback">{errors.status}</div>
				)}
			</div>

			<div className="mb-3">
				<label htmlFor="product-description" className="form-label">
					Description
				</label>

				<textarea
					id="product-description"
					name="description"
					className="form-control"
					rows="3"
					placeholder="Enter product description"
					value={form.description}
					onChange={handleChange}
				/>
			</div>

			<div className="mb-3">
				<label htmlFor="product-image" className="form-label">
					Image URL
				</label>

				<input
					id="product-image"
					type="url"
					name="image"
					className={`form-control ${errors.image ? "is-invalid" : ""}`}
					placeholder="https://example.com/image.jpg"
					value={form.image}
					onChange={handleChange}
				/>

				{errors.image && <div className="invalid-feedback">{errors.image}</div>}
			</div>

			{form.image.trim() && !errors.image && (
				<div className="mb-3">
					<p className="form-label">Image Preview</p>
					<img
						src={form.image}
						alt="Product preview"
						className="img-thumbnail"
						style={{ maxWidth: "160px", maxHeight: "120px" }}
						onError={(e) => {
							e.currentTarget.style.display = "none";
						}}
						onLoad={(e) => {
							e.currentTarget.style.display = "block";
						}}
					/>
				</div>
			)}

			<div className="d-flex justify-content-end gap-2 mt-4">
				<button
					type="button"
					className="btn btn-outline-secondary"
					onClick={onCancel}
					disabled={saving}>
					Cancel
				</button>

				<button type="submit" className="btn btn-primary" disabled={saving}>
					{saving ?
						"Saving..."
					: product ?
						"Update Product"
					:	"Add Product"}
				</button>
			</div>
		</form>
	);
}

export default ProductForm;
