import { create } from "zustand";

export const useSessionStore = create((set) => ({
  isLogging: false,
  setIsLogging: (value) => set({ isLogging: value }),
  showModal: false,
  setShowModal: (value) => set({ showModal: value }),
  isRestoring: false,
  setIsRestoring: (value) => set({ isRestoring: value }),
}));
