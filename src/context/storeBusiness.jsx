import { create } from "zustand";

const storeBusiness = create((set) => ({
  businesses: [],
  loading: false,
  error: null,

  setBusinesses: (businesses) =>
    set({ businesses, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  addBusiness: (newBusiness) =>
    set((state) => ({
      businesses: [...state.businesses, newBusiness],
    })),
  updateBusiness: (updatedBusiness) =>
    set((state) => ({
      businesses: state.businesses.map((b) =>
        b._id === updatedBusiness._id ? updatedBusiness : b
      ),
    })),

}));

export default storeBusiness;
