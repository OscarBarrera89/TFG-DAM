export const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/';
export const appTitle = import.meta.env.VITE_APP_TITLE || 'TopBurgers';

export const getAuthHeaders = async () => {
    // Obtener el token CSRF
    await fetch(`${apiUrl}sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
    });

    const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN"))
        ?.split("=")[1];

    const authToken = localStorage.getItem('auth_token');

    return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-XSRF-TOKEN": decodeURIComponent(csrfToken),
        "Authorization": `Bearer ${authToken}`,
    };
};