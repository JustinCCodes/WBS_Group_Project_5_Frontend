"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ModalType, ModalContextType } from "../types/types";

// Creates context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Provider component
export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalType, setModalType] = useState<ModalType>(null);

  // Opens a modal of the specified type
  const openModal = (type: ModalType) => {
    setModalType(type);
  };

  // Closes the currently open modal
  const closeModal = () => {
    setModalType(null);
  };

  // Determines if a modal is open
  const isModalOpen = modalType !== null;

  return (
    <ModalContext.Provider
      value={{ modalType, isModalOpen, openModal, closeModal }}
    >
      {children}
    </ModalContext.Provider>
  );
}

// Custom hook to use the modal context
export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
