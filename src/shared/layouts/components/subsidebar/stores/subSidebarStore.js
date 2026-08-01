import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useSubSidebar = create(
  persist(
    (set) => ({
      isSubSidebarActive: false,
      sectionOpenState: {},
      setSubSidebarActive: (active) => set({ isSubSidebarActive: active }),
      setSectionOpenState: (sectionKey, isOpen) =>
        set((state) => ({
          sectionOpenState: {
            ...state.sectionOpenState,
            [sectionKey]: isOpen,
          },
        })),
    }),
    {
      name: "subsidebar-session-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ sectionOpenState: state.sectionOpenState }),
    }
  )
);
