"use client";

import { useEffect, useState, useMemo } from "react";
import {
  getAllUsers,
  deleteUser,
  updateUser,
  banUser,
  unbanUser,
  searchUsers,
} from "@/features/admin/data";
import type { User } from "@/features/admin/types";
import { getErrorMessage } from "@/shared/types";

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
  }, []);

  const handleSearch = async () => {
    if (!searchTerm) {
      fetchUsers();
      return;
    }

    try {
      setLoading(true);
      const data = await searchUsers(searchTerm);
      setUsers(data.data || []);
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

      await banUser(banModal.user.id || banModal.user._id || "", payload);
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
      await unbanUser(userId);
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
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-xl">Loading users...</div>
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
              Manage Users
            </span>
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => fetchUsers()}
              disabled={loading}
              className="px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              title="Refresh users"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 shadow-xl">
              <div className="text-sm text-gray-400 mb-1">Total Users</div>
              <div className="text-2xl font-bold text-amber-400">
                {users.length}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4">
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {/* Search & Filter Controls */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                className="px-6 py-2 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all"
                onClick={handleSearch}
              >
                Search
              </button>
              {searchTerm && (
                <button
                  className="px-6 py-2 bg-zinc-800 border border-zinc-700 text-gray-300 font-semibold rounded-lg hover:bg-zinc-700 hover:text-amber-400 hover:border-amber-500/50 transition-all"
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
          <div className="min-w-[120px]">
            <select
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="min-w-[120px]">
            <select
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
            </select>
          </div>
          <div>
            <select
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
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
          <div>
            <select
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto bg-zinc-900 border border-zinc-800 rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  Joined
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {searchTerm || filterRole || filterStatus
                      ? "No users found matching your filters"
                      : "No users yet"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id || user._id}
                    className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-white">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{user.email}</td>
                    <td className="px-4 py-3">
                      <select
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                          user.role === "admin"
                            ? "bg-amber-900/20 border border-amber-800 text-amber-400"
                            : "bg-zinc-800 border border-zinc-700 text-gray-400"
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
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            user.status === "active"
                              ? "bg-green-900/20 border border-green-800 text-green-400"
                              : "bg-red-900/20 border border-red-800 text-red-400"
                          }`}
                        >
                          {user.status}
                        </span>
                        {user.status === "banned" && user.bannedReason && (
                          <span
                            className="text-xs text-gray-500"
                            title={user.bannedReason}
                          >
                            {user.bannedReason.substring(0, 20)}
                            {user.bannedReason.length > 20 ? "..." : ""}
                          </span>
                        )}
                        {user.status === "banned" && user.bannedUntil && (
                          <span className="text-xs text-gray-500">
                            Until:{" "}
                            {new Date(user.bannedUntil).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 flex-wrap">
                        {user.status === "active" ? (
                          <button
                            className="px-4 py-2 bg-yellow-900/20 border border-yellow-800 text-yellow-400 text-sm rounded-lg hover:bg-yellow-900/40 transition-all"
                            onClick={() => openBanModal(user)}
                          >
                            Ban
                          </button>
                        ) : (
                          <button
                            className="px-4 py-2 bg-green-900/20 border border-green-800 text-green-400 text-sm rounded-lg hover:bg-green-900/40 transition-all"
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
                          className="px-4 py-2 bg-red-900/20 border border-red-800 text-red-400 text-sm rounded-lg hover:bg-red-900/40 transition-all"
                          onClick={() =>
                            handleDeleteUser(
                              user.id || user._id || "",
                              user.name
                            )
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

        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredUsers.length} of {users.length} users
        </div>

        {/* Ban User Modal */}
        {banModal.show && banModal.user && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-md mx-4 w-full">
              <h3 className="font-bold text-xl mb-6 text-amber-400">
                Ban User: {banModal.user.name}
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ban Reason *
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all h-24"
                  placeholder="Enter reason for banning this user..."
                  value={banModal.reason}
                  onChange={(e) =>
                    setBanModal({ ...banModal, reason: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ban Until (Optional)
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  value={banModal.until}
                  onChange={(e) =>
                    setBanModal({ ...banModal, until: e.target.value })
                  }
                />
                <p className="text-sm text-gray-500 mt-2">
                  Leave empty for permanent ban
                </p>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  className="px-6 py-3 bg-zinc-800 border border-zinc-700 text-gray-300 font-semibold rounded-lg hover:bg-zinc-700 hover:text-amber-400 hover:border-amber-500/50 transition-all"
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
                  className="px-6 py-3 bg-yellow-900/20 border border-yellow-800 text-yellow-400 font-semibold rounded-lg hover:bg-yellow-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
}
