"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  getAllCategories,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
} from "@/features/admin/data";
import type { Category, Product } from "@/features/admin/types";
import { getErrorMessage } from "@/shared/types";
import { useAdminForm } from "@/features/admin/hooks";
import { AlertTriangle, Check, X } from "lucide-react";

// Stock Editor Component
function StockEditor({
  productId,
  currentStock,
  onStockUpdated,
}: {
  productId: string;
  currentStock: number;
  onStockUpdated: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [stock, setStock] = useState(currentStock);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateProductStock(productId, stock);
      setIsEditing(false);
      onStockUpdated();
    } catch (err) {
      alert(getErrorMessage(err) || "Failed to update stock");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setStock(currentStock);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          value={stock}
          onChange={(e) => setStock(parseInt(e.target.value) || 0)}
          className="w-20 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          disabled={loading}
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className="p-1 bg-green-900/20 border border-green-800 text-green-400 rounded hover:bg-green-900/40 transition-all disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={handleCancel}
          disabled={loading}
          className="p-1 bg-red-900/20 border border-red-800 text-red-400 rounded hover:bg-red-900/40 transition-all disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all hover:scale-105 ${
        currentStock === 0
          ? "bg-red-900/20 border border-red-800 text-red-400"
          : currentStock <= 5
          ? "bg-orange-900/20 border border-orange-800 text-orange-400"
          : currentStock <= 10
          ? "bg-yellow-900/20 border border-yellow-800 text-yellow-400"
          : "bg-green-900/20 border border-green-800 text-green-400"
      }`}
    >
      {currentStock === 0 ? (
        <span className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          OUT
        </span>
      ) : (
        `${currentStock} in stock`
      )}
    </button>
  );
}

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
      stock: 0,
      categoryId: "",
      imageUrl: "",
    },
    onSubmit: async (data) => {
      // Ensure stock is a number
      const productData = {
        ...data,
        stock: Number(data.stock) || 0,
        price: Number(data.price) || 0,
      };
      await createProduct(productData);
      setIsCreating(false);
      await fetchProducts();
    },
  });

  const updateForm = useAdminForm({
    initialData: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      categoryId: "",
      imageUrl: "",
    },
    onSubmit: async (data) => {
      if (!editingProduct) return;
      // Ensure stock and price are numbers
      const productData = {
        ...data,
        stock: Number(data.stock) || 0,
        price: Number(data.price) || 0,
      };
      await updateProduct(editingProduct.id || editingProduct._id || "", productData);
      setIsEditing(false);
      setEditingProduct(null);
      await fetchProducts();
    },
  });

  const activeForm = isCreating ? createForm : updateForm;

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data || []);
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
      await deleteProduct(id);
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
      stock: product.stock || 0,
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

  // Filters and sorts products
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
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-xl">Loading products...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-3xl font-bold">
            <span className="bg-linear-to-r from-amber-200 to-yellow-600 bg-clip-text text-transparent">
              Manage Products
            </span>
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchData()}
              disabled={loading}
              className="px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              title="Refresh products"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <button
              className="px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4">
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {/* Create/Edit Form */}
        {(isCreating || isEditing) && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-xl mb-6">
            <h2 className="text-xl font-bold mb-6 text-amber-400">
              {isCreating ? "Create New Product" : "Edit Product"}
            </h2>
            <form onSubmit={activeForm.handleSubmit}>
              {activeForm.error && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4">
                  <span className="text-red-400">{activeForm.error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
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

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
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

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    value={activeForm.formData.stock}
                    onChange={(e) =>
                      activeForm.setFormData({
                        ...activeForm.formData,
                        stock: e.target.value === '' ? 0 : parseInt(e.target.value, 10),
                      })
                    }
                    required
                    disabled={activeForm.loading}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Available inventory count
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all h-24"
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

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
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

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
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
                  <p className="text-sm text-gray-500 mt-2">
                    Cloudinary integration coming soon
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  className="px-6 py-3 bg-zinc-800 border border-zinc-700 text-gray-300 font-semibold rounded-lg hover:bg-zinc-700 hover:text-amber-400 hover:border-amber-500/50 transition-all"
                  onClick={resetForm}
                  disabled={activeForm.loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
        )}

        {/* Search & Filter Controls */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="min-w-[150px]">
            <select
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
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
          <div>
            <select
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
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
          <div>
            <select
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto bg-zinc-900 border border-zinc-800 rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  Created At
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  Created By
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {searchTerm || filterCategory
                      ? "No products found matching your filters"
                      : "No products yet"}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id || product._id}
                    className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-white">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate text-gray-400">
                      {product.description}
                    </td>
                    <td className="px-4 py-3 font-semibold text-amber-400">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <StockEditor
                        productId={product.id || product._id || ""}
                        currentStock={product.stock || 0}
                        onStockUpdated={fetchProducts}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs text-gray-300">
                        {typeof product.categoryId === "object"
                          ? product.categoryId.name
                          : "Unknown"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {product.createdBy
                        ? typeof product.createdBy === "object" &&
                          "name" in product.createdBy
                          ? product.createdBy.name
                          : "Admin"
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          className="px-4 py-2 bg-blue-900/20 border border-blue-800 text-blue-400 text-sm rounded-lg hover:bg-blue-900/40 transition-all"
                          onClick={() => startEdit(product)}
                          disabled={isCreating || isEditing}
                        >
                          Edit
                        </button>
                        <button
                          className="px-4 py-2 bg-red-900/20 border border-red-800 text-red-400 text-sm rounded-lg hover:bg-red-900/40 transition-all"
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

        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>
    </div>
  );
}
