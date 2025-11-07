import { ReactNode } from "react";

// API Error Response Type
export interface ApiErrorResponse {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

// Error Boundary Props and State Interfaces
export interface Props {
  children: ReactNode;
}

// Error Boundary State Interface
export interface State {
  hasError: boolean;
  error: Error | null;
}

export type ModalType =
  | "privacy"
  | "terms"
  | "cookies"
  | "faq"
  | "shipping"
  | "warranty"
  | "returns"
  | "contact"
  | null;

export interface ModalContextType {
  modalType: ModalType;
  isModalOpen: boolean;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
}
