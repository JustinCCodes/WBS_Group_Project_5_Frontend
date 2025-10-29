"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllUsers, deleteUser, updateUser } from "@/features/admin/data";
import type { User } from "@/features/admin/types";
import { getErrorMessage } from "@/shared/types";
import api from "@/shared/lib/api";

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "email" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Ban modal state
  const [banModal, setBanModal] = useState<{
    show: boolean;
    user: User | null;
    reason: string;
    until: string;
    loading: boolean;
  }>({
    show: false,
    user: null,
    reason: "",
    until: "",
    loading: false,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers(1, 1000);
      setUsers(data.data || []);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchUsers();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    if (!searchTerm) {
      fetchUsers();
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(
        `/admin/users/search?email=${searchTerm}&id=${searchTerm}&limit=1000`
      );
      setUsers(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err) || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (
    userId: string,
    newRole: "user" | "admin"
  ) => {
    if (
      !confirm(
        `Are you sure you want to change this user's role to ${newRole}?`
      )
    ) {
      return;
    }

    try {
      await updateUser(userId, { role: newRole });
      await fetchUsers();
    } catch (err) {
      alert(getErrorMessage(err) || "Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${userName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteUser(userId);
      await fetchUsers();
    } catch (err) {
      alert(getErrorMessage(err) || "Failed to delete user");
    }
  };

  const openBanModal = (user: User) => {
    setBanModal({
      show: true,
      user,
      reason: "",
      until: "",
      loading: false,
    });
  };

  const handleBanUser = async () => {
    if (!banModal.user || !banModal.reason) {
      alert("Please provide a ban reason");
      return;
    }

    setBanModal({ ...banModal, loading: true });
    try {
      const payload: { reason: string; bannedUntil?: string } = {
        reason: banModal.reason,
      };
      if (banModal.until) {
        payload.bannedUntil = new Date(banModal.until).toISOString();
      }

      await api.put(
        `/admin/users/${banModal.user.id || banModal.user._id}/ban`,
        payload
      );
      setBanModal({
        show: false,
        user: null,
        reason: "",
        until: "",
        loading: false,
      });
      await fetchUsers();
    } catch (err) {
      alert(getErrorMessage(err) || "Failed to ban user");
    } finally {
      setBanModal({ ...banModal, loading: false });
    }
  };

  const handleUnbanUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to unban "${userName}"?`)) {
      return;
    }

    try {
      await api.put(`/admin/users/${userId}/unban`);
      await fetchUsers();
    } catch (err) {
      alert(getErrorMessage(err) || "Failed to unban user");
    }
  };

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        const matchesSearch =
          !searchTerm ||
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.id || user._id)
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesRole = !filterRole || user.role === filterRole;
        const matchesStatus = !filterStatus || user.status === filterStatus;

        return matchesSearch && matchesRole && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return sortOrder === "asc"
            ? (a.name || "").localeCompare(b.name || "")
            : (b.name || "").localeCompare(a.name || "");
        } else if (sortBy === "email") {
          return sortOrder === "asc"
            ? (a.email || "").localeCompare(b.email || "")
            : (b.email || "").localeCompare(a.email || "");
        } else {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        }
      });
  }, [users, searchTerm, filterRole, filterStatus, sortBy, sortOrder]);

  if (loading && users.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xl">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <div className="stats shadow">
          <div className="stat p-4">
            <div className="stat-title text-xs">Total Users</div>
            <div className="stat-value text-2xl">{users.length}</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <div className="form-control flex-1 min-w-[200px]">
          <div className="join">
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              className="input input-bordered join-item flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="btn join-item" onClick={handleSearch}>
              Search
            </button>
            {searchTerm && (
              <button
                className="btn join-item btn-ghost"
                onClick={() => {
                  setSearchTerm("");
                  fetchUsers();
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <div className="form-control min-w-[120px]">
          <select
            className="select select-bordered"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="form-control min-w-[120px]">
          <select
            className="select select-bordered"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </div>
        <div className="form-control">
          <select
            className="select select-bordered"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "name" | "email" | "date")
            }
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
          </select>
        </div>
        <div className="form-control">
          <select
            className="select select-bordered"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  {searchTerm || filterRole || filterStatus
                    ? "No users found matching your filters"
                    : "No users yet"}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id || user._id}>
                  <td className="font-semibold">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      className={`select select-sm ${
                        user.role === "admin"
                          ? "select-primary"
                          : "select-ghost"
                      }`}
                      value={user.role}
                      onChange={(e) =>
                        handleUpdateRole(
                          user.id || user._id || "",
                          e.target.value as "user" | "admin"
                        )
                      }
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <span
                        className={`badge ${
                          user.status === "active"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {user.status}
                      </span>
                      {user.status === "banned" && user.bannedReason && (
                        <span
                          className="text-xs opacity-70"
                          title={user.bannedReason}
                        >
                          {user.bannedReason.substring(0, 20)}
                          {user.bannedReason.length > 20 ? "..." : ""}
                        </span>
                      )}
                      {user.status === "banned" && user.bannedUntil && (
                        <span className="text-xs opacity-70">
                          Until:{" "}
                          {new Date(user.bannedUntil).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-2 flex-wrap">
                      {user.status === "active" ? (
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => openBanModal(user)}
                        >
                          Ban
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() =>
                            handleUnbanUser(
                              user.id || user._id || "",
                              user.name
                            )
                          }
                        >
                          Unban
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() =>
                          handleDeleteUser(user.id || user._id || "", user.name)
                        }
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
        Showing {filteredUsers.length} of {users.length} users
      </div>

      {/* Ban User Modal */}
      {banModal.show && banModal.user && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              Ban User: {banModal.user.name}
            </h3>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Ban Reason *</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="Enter reason for banning this user..."
                value={banModal.reason}
                onChange={(e) =>
                  setBanModal({ ...banModal, reason: e.target.value })
                }
                required
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Ban Until (Optional)</span>
              </label>
              <input
                type="datetime-local"
                className="input input-bordered"
                value={banModal.until}
                onChange={(e) =>
                  setBanModal({ ...banModal, until: e.target.value })
                }
              />
              <label className="label">
                <span className="label-text-alt">
                  Leave empty for permanent ban
                </span>
              </label>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setBanModal({
                    show: false,
                    user: null,
                    reason: "",
                    until: "",
                    loading: false,
                  });
                }}
                disabled={banModal.loading}
              >
                Cancel
              </button>
              <button
                className="btn btn-warning"
                onClick={handleBanUser}
                disabled={banModal.loading || !banModal.reason}
              >
                {banModal.loading ? "Banning..." : "Ban User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
