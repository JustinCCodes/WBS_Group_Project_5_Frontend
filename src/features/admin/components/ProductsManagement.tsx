"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { getAllCategories } from "@/features/admin/data";
import type { Category, Product } from "@/features/admin/types";
import { getErrorMessage } from "@/shared/types";
import { useAdminForm } from "@/features/admin/hooks";
import api from "@/shared/lib/api";

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Search & filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "date">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const createForm = useAdminForm({
    initialData: {
      name: "",
      description: "",
      price: 0,
      categoryId: "",
      imageUrl: "",
    },
    onSubmit: async (data) => {
      await api.post("/products", data);
      setIsCreating(false);
      await fetchProducts();
    },
  });

  const updateForm = useAdminForm({
    initialData: {
      name: "",
      description: "",
      price: 0,
      categoryId: "",
      imageUrl: "",
    },
    onSubmit: async (data) => {
      if (!editingProduct) return;
      await api.put(
        `/products/${editingProduct.id || editingProduct._id}`,
        data
      );
      setIsEditing(false);
      setEditingProduct(null);
      await fetchProducts();
    },
  });

  const activeForm = isCreating ? createForm : updateForm;

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products?limit=1000");
      setProducts(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to load products");
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchCategories()]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();

    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const handleDeleteProduct = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);
      await fetchProducts();
    } catch (err) {
      alert(getErrorMessage(err) || "Failed to delete product");
    }
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    updateForm.setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId:
        typeof product.categoryId === "object"
          ? product.categoryId.id || product.categoryId._id || ""
          : product.categoryId,
      imageUrl: "",
    });
    setIsEditing(true);
    setIsCreating(false);
  };

  const resetForm = () => {
    setIsCreating(false);
    setIsEditing(false);
    setEditingProduct(null);
    createForm.reset();
    updateForm.reset();
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase());

        const categoryId =
          typeof product.categoryId === "object"
            ? product.categoryId.id || product.categoryId._id
            : product.categoryId;
        const matchesCategory =
          !filterCategory || categoryId === filterCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return sortOrder === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (sortBy === "price") {
          return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
        } else {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        }
      });
  }, [products, searchTerm, filterCategory, sortBy, sortOrder]);

  if (loading && products.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xl">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setIsCreating(true);
            setIsEditing(false);
            setEditingProduct(null);
            createForm.reset();
          }}
          disabled={isCreating || isEditing}
        >
          + Create Product
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Create/Edit Form */}
      {(isCreating || isEditing) && (
        <div className="card bg-base-200 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title">
              {isCreating ? "Create New Product" : "Edit Product"}
            </h2>
            <form onSubmit={activeForm.handleSubmit}>
              {activeForm.error && (
                <div className="alert alert-error mb-4">
                  <span>{activeForm.error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Product Name *</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={activeForm.formData.name}
                    onChange={(e) =>
                      activeForm.setFormData({
                        ...activeForm.formData,
                        name: e.target.value,
                      })
                    }
                    required
                    disabled={activeForm.loading}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Price *</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="input input-bordered"
                    value={activeForm.formData.price}
                    onChange={(e) =>
                      activeForm.setFormData({
                        ...activeForm.formData,
                        price: parseFloat(e.target.value),
                      })
                    }
                    required
                    disabled={activeForm.loading}
                  />
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Description *</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    value={activeForm.formData.description}
                    onChange={(e) =>
                      activeForm.setFormData({
                        ...activeForm.formData,
                        description: e.target.value,
                      })
                    }
                    required
                    disabled={activeForm.loading}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Category *</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={activeForm.formData.categoryId}
                    onChange={(e) =>
                      activeForm.setFormData({
                        ...activeForm.formData,
                        categoryId: e.target.value,
                      })
                    }
                    required
                    disabled={activeForm.loading}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id || cat._id} value={cat.id || cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Image URL (Optional)</span>
                  </label>
                  <input
                    type="url"
                    className="input input-bordered"
                    value={activeForm.formData.imageUrl}
                    onChange={(e) =>
                      activeForm.setFormData({
                        ...activeForm.formData,
                        imageUrl: e.target.value,
                      })
                    }
                    placeholder="https://example.com/image.jpg"
                    disabled={activeForm.loading}
                  />
                  <label className="label">
                    <span className="label-text-alt">
                      Cloudinary integration coming soon
                    </span>
                  </label>
                </div>
              </div>

              <div className="card-actions justify-end mt-4">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={resetForm}
                  disabled={activeForm.loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={activeForm.loading}
                >
                  {activeForm.loading
                    ? "Saving..."
                    : isCreating
                    ? "Create"
                    : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <div className="form-control flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search products..."
            className="input input-bordered"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="form-control min-w-[150px]">
          <select
            className="select select-bordered"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id || cat._id} value={cat.id || cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <select
            className="select select-bordered"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "name" | "price" | "date")
            }
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="date">Sort by Date</option>
          </select>
        </div>
        <div className="form-control">
          <select
            className="select select-bordered"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Created At</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">
                  {searchTerm || filterCategory
                    ? "No products found matching your filters"
                    : "No products yet"}
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id || product._id}>
                  <td className="font-semibold">{product.name}</td>
                  <td className="max-w-xs truncate">{product.description}</td>
                  <td className="font-semibold">${product.price.toFixed(2)}</td>
                  <td>
                    <span className="badge badge-outline">
                      {typeof product.categoryId === "object"
                        ? product.categoryId.name
                        : "Unknown"}
                    </span>
                  </td>
                  <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                  <td>
                    {product.createdBy
                      ? typeof product.createdBy === "object" &&
                        "name" in product.createdBy
                        ? product.createdBy.name
                        : "Admin"
                      : "N/A"}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => startEdit(product)}
                        disabled={isCreating || isEditing}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() =>
                          handleDeleteProduct(
                            product.id || product._id || "",
                            product.name
                          )
                        }
                        disabled={isCreating || isEditing}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
}
