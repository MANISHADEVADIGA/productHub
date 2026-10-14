import { useEffect, useMemo, useState } from "react";

import Navbar from "./components/Navbar";
import DashboardStats from "./components/DashboardStats";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import ConfirmDelete from "./components/ConfirmDelete";
import Loader from "./components/Loader";

import {
	getProducts,
	createProduct,
	updateProduct,
	deleteProduct,
} from "./services/api";

import useDebounce from "./hooks/useDebounce";

function App() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const [error, setError] = useState("");
	const [notice, setNotice] = useState("");

	const [search, setSearch] = useState("");
	const [category, setCategory] = useState("All");
	const [stockStatus, setStockStatus] = useState("All");

	const [modal, setModal] = useState("");
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);

	const debouncedSearch = useDebounce(search, 350);

	useEffect(() => {
		loadProducts();
	}, []);

	async function loadProducts() {
		try {
			setLoading(true);
			setError("");

			const data = await getProducts();

			setProducts(Array.isArray(data) ? data : []);
		} catch (err) {
			console.error("Error loading products:", err);
			setError(
				"Could not load products. Check whether JSON Server is running.",
			);
		} finally {
			setLoading(false);
		}
	}

	const categories = useMemo(() => {
		const uniqueCategories = [
			...new Set(products.map((product) => product.category).filter(Boolean)),
		];

		return ["All", ...uniqueCategories];
	}, [products]);

	const filteredProducts = useMemo(() => {
		return products.filter((product) => {
			const searchText = debouncedSearch.trim().toLowerCase();

			const matchesSearch =
				(product.name || "").toLowerCase().includes(searchText) ||
				(product.category || "").toLowerCase().includes(searchText) ||
				(product.description || "").toLowerCase().includes(searchText);

			const matchesCategory =
				category === "All" || product.category === category;

			const stock = Number(product.stock) || 0;

			let matchesStock = true;

			if (stockStatus === "In Stock") {
				matchesStock = stock > 5;
			} else if (stockStatus === "Low Stock") {
				matchesStock = stock > 0 && stock <= 5;
			} else if (stockStatus === "Out of Stock") {
				matchesStock = stock === 0;
			}

			return matchesSearch && matchesCategory && matchesStock;
		});
	}, [products, debouncedSearch, category, stockStatus]);

	function openAdd() {
		setSelectedProduct(null);
		setModal("add");
		setError("");
	}

	function openEdit(product) {
		setSelectedProduct(product);
		setModal("edit");
		setError("");
	}

	function openView(product) {
		setSelectedProduct(product);
		setModal("view");
		setError("");
	}

	function closeModal() {
		if (saving) return;

		setModal("");
		setSelectedProduct(null);
	}

	async function handleSave(formData) {
		try {
			setSaving(true);
			setError("");
			setNotice("");

			if (modal === "edit" && selectedProduct) {
				const updatedProduct = await updateProduct(
					selectedProduct.id,
					formData,
				);

				setProducts((previousProducts) =>
					previousProducts.map((product) =>
						product.id === selectedProduct.id ?
							{ ...product, ...updatedProduct }
						:	product,
					),
				);

				setNotice("Product updated successfully.");
			} else {
				const newProduct = await createProduct(formData);

				setProducts((previousProducts) => [...previousProducts, newProduct]);

				setNotice("Product added successfully.");
			}

			setModal("");
			setSelectedProduct(null);
		} catch (err) {
			console.error("Error saving product:", err);
			setError("Could not save the product. Please try again.");
		} finally {
			setSaving(false);
		}
	}

	async function handleDelete() {
		if (!deleteTarget || deleting) return;

		try {
			setDeleting(true);
			setError("");
			setNotice("");

			await deleteProduct(deleteTarget.id);

			setProducts((previousProducts) =>
				previousProducts.filter((product) => product.id !== deleteTarget.id),
			);

			setDeleteTarget(null);
			setNotice("Product deleted successfully.");
		} catch (err) {
			console.error("Error deleting product:", err);
			setError("Could not delete the product. Please try again.");
		} finally {
			setDeleting(false);
		}
	}

	function resetFilters() {
		setSearch("");
		setCategory("All");
		setStockStatus("All");
	}

	return (
		<div className="app">
			<Navbar onAddProduct={openAdd} />

			<main className="container py-4">
				<div className="page-heading d-flex justify-content-between align-items-center gap-3 mb-4">
					<div>
						<h1>Inventory Dashboard</h1>
						<p className="text-secondary mb-0">
							Manage and track your products.
						</p>
					</div>

					<button type="button" className="btn btn-primary" onClick={openAdd}>
						+ Add Product
					</button>
				</div>

				{notice && (
					<div className="alert alert-success" role="status">
						{notice}

						<button
							type="button"
							className="btn-close float-end"
							aria-label="Close"
							onClick={() => setNotice("")}
						/>
					</div>
				)}

				{error && (
					<div className="alert alert-danger" role="alert">
						{error}

						<button
							type="button"
							className="btn-close float-end"
							aria-label="Close"
							onClick={() => setError("")}
						/>
					</div>
				)}

				{!loading && <DashboardStats products={products} />}

				<section className="mt-4">
					<SearchBar search={search} setSearch={setSearch} />

					<FilterBar
						categories={categories}
						category={category}
						setCategory={setCategory}
						stockStatus={stockStatus}
						setStockStatus={setStockStatus}
						onReset={resetFilters}
					/>
				</section>

				{loading ?
					<Loader />
				:	<ProductList
						products={filteredProducts}
						onView={openView}
						onEdit={openEdit}
						onDelete={setDeleteTarget}
					/>
				}

				{!loading && (
					<p className="text-secondary mt-3">
						Showing {filteredProducts.length} of {products.length} products
					</p>
				)}
			</main>

			{(modal === "add" || modal === "edit" || modal === "view") && (
				<div
					className="modal-backdrop-custom"
					onMouseDown={(e) => {
						if (e.target === e.currentTarget) {
							closeModal();
						}
					}}>
					<div
						className="product-modal"
						role="dialog"
						aria-modal="true"
						aria-labelledby="product-modal-title">
						<div className="d-flex justify-content-between align-items-center mb-3">
							<h2 id="product-modal-title" className="h4 mb-0">
								{modal === "add" ?
									"Add Product"
								: modal === "edit" ?
									"Edit Product"
								:	"Product Details"}
							</h2>

							<button
								type="button"
								className="btn-close"
								aria-label="Close"
								onClick={closeModal}
								disabled={saving}
							/>
						</div>

						{modal === "view" ?
							<div>
								{selectedProduct?.image && (
									<img
										src={selectedProduct.image}
										alt={selectedProduct.name || "Product"}
										className="img-fluid rounded mb-3"
										style={{ maxHeight: "220px" }}
									/>
								)}

								<p>
									<strong>Name:</strong> {selectedProduct?.name || "N/A"}
								</p>

								<p>
									<strong>Category:</strong>{" "}
									{selectedProduct?.category || "N/A"}
								</p>

								<p>
									<strong>Price:</strong> ₹{selectedProduct?.price ?? 0}
								</p>

								<p>
									<strong>Stock:</strong> {selectedProduct?.stock ?? 0}
								</p>

								<p>
									<strong>Status:</strong> {selectedProduct?.status || "N/A"}
								</p>

								<p>
									<strong>Description:</strong>{" "}
									{selectedProduct?.description || "No description available."}
								</p>

								<div className="d-flex justify-content-end gap-2">
									<button
										type="button"
										className="btn btn-secondary"
										onClick={closeModal}>
										Close
									</button>

									<button
										type="button"
										className="btn btn-primary"
										onClick={() => openEdit(selectedProduct)}>
										Edit Product
									</button>
								</div>
							</div>
						:	<ProductForm
								key={
									modal === "edit" ?
										`edit-${selectedProduct?.id}`
									:	"add-product"
								}
								product={modal === "edit" ? selectedProduct : null}
								onSave={handleSave}
								onCancel={closeModal}
								saving={saving}
							/>
						}
					</div>
				</div>
			)}

			{deleteTarget && (
				<ConfirmDelete
					product={deleteTarget}
					deleting={deleting}
					onConfirm={handleDelete}
					onCancel={() => {
						if (!deleting) {
							setDeleteTarget(null);
						}
					}}
				/>
			)}
		</div>
	);
}

export default App;
