import { create } from 'zustand';

export const useUserMenuStore = create((set) => ({
  open: false,
  setOpen: (value) => set({ open: value }),
}));