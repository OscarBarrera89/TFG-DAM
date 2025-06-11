import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set, get) => ({
      user: { role: "None" }, // Estado inicial

      /**
       * Establece los datos del usuario.
       * @param {Object} userData - Datos del usuario.
       */
      setUser: (userData) => set({ user: userData }),

      /**
       * Limpia los datos del usuario.
       */
      clearUser: () => set({ user: { role: "None" } }),

      /**
       * Verifica si hay sesión iniciada.
       */
      isLoggedIn: () => {
        const role = get().user?.role;
        return role && role !== "None";
      },

      /**
       * Verifica si el usuario es administrador.
       */
      isAdmin: () => get().user?.role === "admin",

      /**
       * Verifica si el usuario es cliente.
       */
      isCliente: () => get().user?.role === "cliente",

      /**
       * Verifica si el usuario es camarero.
       */
      isCamarero: () => get().user?.role === "camarero",
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useUserStore;
