"use client";

import { create } from "zustand";

/**
 * UI Store
 * Gère l'état global de l'interface utilisateur
 */
interface UIState {
  // Sidebar state
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  
  // Modal states
  activeModal: string | null;
  modalData: Record<string, unknown> | null;
  
  // Loading states
  globalLoading: boolean;
  loadingMessage: string | null;
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  openModal: (modalId: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  
  setGlobalLoading: (loading: boolean, message?: string) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  // Initial state
  sidebarOpen: true,
  sidebarCollapsed: false,
  activeModal: null,
  modalData: null,
  globalLoading: false,
  loadingMessage: null,

  // Sidebar actions
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  // Modal actions
  openModal: (modalId, data) => set({ activeModal: modalId, modalData: data || null }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  // Loading actions
  setGlobalLoading: (loading, message) => 
    set({ globalLoading: loading, loadingMessage: message || null }),
}));

// Selector hooks for performance optimization
export const useSidebarOpen = () => useUIStore((state) => state.sidebarOpen);
export const useSidebarCollapsed = () => useUIStore((state) => state.sidebarCollapsed);
export const useActiveModal = () => useUIStore((state) => state.activeModal);
export const useModalData = () => useUIStore((state) => state.modalData);
export const useGlobalLoading = () => useUIStore((state) => state.globalLoading);
