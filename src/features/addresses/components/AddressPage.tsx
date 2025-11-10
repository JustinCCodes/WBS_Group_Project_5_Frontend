"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Plus, AlertCircle } from "lucide-react";
import { AddressCard, AddressFormModal, Address } from "../index";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress as apiDeleteAddress,
  setDefaultAddress as apiSetDefaultAddress,
  AddressPayload,
} from "../data";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/shared/lib/utils";

const MAX_ADDRESSES = 3;

export function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [defaultAddressId, setDefaultAddressId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Fetches addresses
  const fetchAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { addresses, defaultAddressId } = await getAddresses();
      setAddresses(addresses);
      setDefaultAddressId(defaultAddressId);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Modal Handlers
  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (address: Address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  // API Actions
  const handleSave = async (addressData: AddressPayload) => {
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, addressData);
        toast.success("Address updated!");
      } else {
        await createAddress(addressData);
        toast.success("Address added!");
      }
      handleCloseModal();
      await fetchAddresses(); // Refetch data
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;
    try {
      await apiDeleteAddress(addressId);
      toast.success("Address deleted!");
      await fetchAddresses(); // Refetch data
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // Set Default Address
  const handleSetDefault = async (addressId: string) => {
    try {
      await apiSetDefaultAddress(addressId);
      toast.success("Default address updated!");
      setDefaultAddressId(addressId);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // Render Logic
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20 bg-zinc-900 border border-red-800 rounded-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Failed to load addresses
          </h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchAddresses}
            className="px-5 py-3 bg-amber-500 text-black font-bold rounded-lg"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (addresses.length > 0) {
      return (
        <div className="grid grid-cols-1 gap-6">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              isDefault={address.id === defaultAddressId}
              onEdit={() => handleOpenEditModal(address)}
              onDelete={() => handleDelete(address.id)}
              onSetDefault={() => handleSetDefault(address.id)}
            />
          ))}
        </div>
      );
    }

    // Empty State
    return (
      <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-lg">
        <MapPin className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          No addresses saved
        </h2>
        <p className="text-gray-400 mb-6">
          Add an address to get started with faster checkouts.
        </p>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-bold rounded-lg hover:scale-105 transition-transform mx-auto"
        >
          <Plus className="w-5 h-5" />
          Add First Address
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-black pt-24 pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Profile
          </Link>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="text-4xl font-bold bg-linear-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
              My Addresses
            </h1>
            {addresses.length < MAX_ADDRESSES && !isLoading && (
              <button
                onClick={handleOpenAddModal}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-bold rounded-lg hover:scale-105 transition-transform"
              >
                <Plus className="w-5 h-5" />
                Add New Address
              </button>
            )}
          </div>

          {/* Address List */}
          {renderContent()}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AddressFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        address={editingAddress}
      />
    </>
  );
}
