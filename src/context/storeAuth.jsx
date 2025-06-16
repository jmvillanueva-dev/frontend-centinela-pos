import { create } from 'zustand';

const storeAuth = create((set) => ({
    token: null,
    user: null,
    login: (token, userData) => set({ token, user: userData }),
    logout: () => set({ token: null, user: null }),

    initialize: () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (token && user) {
            set({ token, user });
        }
    }
}));

// Inicializar al cargar la app
storeAuth.getState().initialize();

export default storeAuth;