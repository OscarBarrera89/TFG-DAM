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
      setUser: (userData) => {
        // Guardar en localStorage para persistencia entre sesiones
        if (userData.token) {
          localStorage.setItem('auth_token', userData.token);
        }
        set({ user: userData });
      },

      /**
       * Limpia los datos del usuario.
       */
      clearUser: () => {
        localStorage.removeItem('auth_token');
        set({ user: { role: "None" } });
      },

      /**
       * Verifica si hay sesión iniciada.
       */
      isLoggedIn: () => {
        const role = get().user?.role;
        const token = localStorage.getItem('auth_token');
        return role && role !== "None" && token;
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

      /**
       * Obtiene el token de autenticación.
       */
      getToken: () => localStorage.getItem('auth_token'),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useUserStore;
