"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllCategories } from "@/features/admin/data";
import type { Category } from "@/features/admin/types";
import { getErrorMessage } from "@/shared/types";
import { useAdminForm } from "@/features/admin/hooks";
import api from "@/shared/lib/api";

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
      await api.post("/categories", data);
      setIsCreating(false);
      await fetchCategories();
    },
  });

  const updateForm = useAdminForm({
    initialData: { name: "" },
    onSubmit: async (data) => {
      if (!editingCategory) return;
      await api.put(
        `/categories/${editingCategory.id || editingCategory._id}`,
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

    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchCategories();
      }
    }, 30000);

    return () => clearInterval(interval);
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
      await api.delete(`/categories/${id}`);
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
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xl">Loading categories...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
        <button
          className="btn btn-primary"
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
              {isCreating ? "Create New Category" : "Edit Category"}
            </h2>
            <form onSubmit={activeForm.handleSubmit}>
              {activeForm.error && (
                <div className="alert alert-error mb-4">
                  <span>{activeForm.error}</span>
                </div>
              )}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={activeForm.formData.name}
                  onChange={(e) =>
                    activeForm.setFormData({ name: e.target.value })
                  }
                  required
                  minLength={1}
                  disabled={activeForm.loading}
                />
              </div>
              <div className="card-actions justify-end mt-4">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={cancelForm}
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

      {/* Search & Sort Controls */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <div className="form-control flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search categories..."
            className="input input-bordered"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="form-control">
          <select
            className="select select-bordered"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "name" | "date")}
          >
            <option value="name">Sort by Name</option>
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

      {/* Categories Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Created At</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">
                  {searchTerm
                    ? "No categories found matching your search"
                    : "No categories yet"}
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => (
                <tr key={category.id || category._id}>
                  <td className="font-semibold">{category.name}</td>
                  <td>
                    {category.createdAt
                      ? new Date(category.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {category.createdBy
                      ? typeof category.createdBy === "object" &&
                        "name" in category.createdBy
                        ? category.createdBy.name
                        : typeof category.createdBy === "string"
                        ? category.createdBy
                        : "Admin"
                      : "N/A"}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => startEdit(category)}
                        disabled={isCreating || isEditing}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-error"
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

      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredCategories.length} of {categories.length} categories
      </div>
    </div>
  );
}
