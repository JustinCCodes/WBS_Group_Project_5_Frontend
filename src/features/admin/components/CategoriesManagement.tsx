"use client";

import { useEffect, useState, useMemo } from "react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/features/admin/data";
import type { Category } from "@/features/admin/types";
import { getErrorMessage } from "@/shared/types";
import { useAdminForm } from "@/features/admin/hooks";

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Search & filter
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Form hook
  const createForm = useAdminForm({
    initialData: { name: "" },
    onSubmit: async (data) => {
      await createCategory(data);
      setIsCreating(false);
      await fetchCategories();
    },
  });

  const updateForm = useAdminForm({
    initialData: { name: "" },
    onSubmit: async (data) => {
      if (!editingCategory) return;
      await updateCategory(
        editingCategory.id || editingCategory._id || "",
        data
      );
      setIsEditing(false);
      setEditingCategory(null);
      await fetchCategories();
    },
  });

  // Gets active form based on mode
  const activeForm = isCreating ? createForm : updateForm;

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAllCategories();
      setCategories(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to load categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteCategory = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      alert(getErrorMessage(err) || "Failed to delete category");
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    updateForm.setFormData({ name: category.name });
    setIsEditing(true);
    setIsCreating(false);
  };

  const cancelForm = () => {
    setIsCreating(false);
    setIsEditing(false);
    setEditingCategory(null);
    createForm.reset();
    updateForm.reset();
  };

  // Filter and sort categories
  const filteredCategories = useMemo(() => {
    return categories
      .filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "name") {
          return sortOrder === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        }
      });
  }, [categories, searchTerm, sortBy, sortOrder]);

  if (loading && categories.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-xl">Loading categories...</div>
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
              Manage Categories
            </span>
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchCategories()}
              disabled={loading}
              className="px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              title="Refresh categories"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <button
              className="px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              onClick={() => {
                setIsCreating(true);
                setIsEditing(false);
                createForm.reset();
              }}
              disabled={isCreating || isEditing}
            >
              + Create Category
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
              {isCreating ? "Create New Category" : "Edit Category"}
            </h2>
            <form onSubmit={activeForm.handleSubmit}>
              {activeForm.error && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4">
                  <span className="text-red-400">{activeForm.error}</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  value={activeForm.formData.name}
                  onChange={(e) =>
                    activeForm.setFormData({ name: e.target.value })
                  }
                  required
                  minLength={1}
                  disabled={activeForm.loading}
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  className="px-6 py-3 bg-zinc-800 border border-zinc-700 text-gray-300 font-semibold rounded-lg hover:bg-zinc-700 hover:text-amber-400 hover:border-amber-500/50 transition-all"
                  onClick={cancelForm}
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

        {/* Search & Sort Controls */}
        <div className="flex gap-4 mb-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "date")}
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>
          <div>
            <select
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        {/* Categories Table */}
        <div className="overflow-x-auto bg-zinc-900 border border-zinc-800 rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-400">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-400">
                  Created At
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-400">
                  Created By
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    {searchTerm
                      ? "No categories found matching your search"
                      : "No categories yet"}
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr
                    key={category.id || category._id}
                    className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-white">
                      {category.name}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {category.createdAt
                        ? new Date(category.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {category.createdBy
                        ? typeof category.createdBy === "object" &&
                          "name" in category.createdBy
                          ? category.createdBy.name
                          : typeof category.createdBy === "string"
                          ? category.createdBy
                          : "Admin"
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 bg-blue-900/20 border border-blue-800 text-blue-400 text-sm font-semibold rounded hover:bg-blue-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => startEdit(category)}
                          disabled={isCreating || isEditing}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-red-900/20 border border-red-800 text-red-400 text-sm font-semibold rounded hover:bg-red-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() =>
                            handleDeleteCategory(
                              category.id || category._id || "",
                              category.name
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
          Showing {filteredCategories.length} of {categories.length} categories
        </div>
      </div>
    </div>
  );
}
