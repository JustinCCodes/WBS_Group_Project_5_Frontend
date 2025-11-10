// Props for AddressSelectionModal component
export interface AddressSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (address: Address) => void;
  addresses: Address[];
  selectedAddressId: string | null;
}
// Props for AddressFormModal component
export interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (addressData: Omit<Address, "id">) => void;
  address: Address | null;
}

// Type for address form data
export type FormData = Omit<Address, "id">;
// Represents a users address
export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

// The response shape from the GET /api/v1/addresses endpoint
export interface GetAddressesResponse {
  addresses: Address[];
  defaultAddressId: string | null;
}

// Props for AddressCard component
export interface AddressCardProps {
  address: Address;
  isDefault: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}
