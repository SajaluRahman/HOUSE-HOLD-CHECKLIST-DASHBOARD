"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { baseUrl } from "@/api/const";

export type AdminType = {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

type AdminState = {
  admin: AdminType | null;
  isAuth: boolean;
  loading: boolean;
  error: string | null;
  admins: AdminType[];
  totalAdmins: number;
  currentPage: number;
  totalPages: number;
};

type AdminActions = {
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  initAuth: () => void; // New: Auto-check on app start
  fetchAdmins: (page?: number, limit?: number, search?: string) => Promise<void>;
  addAdmin: (data: { name: string; email: string; password: string; image?: string }) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
  fetchDashboardStatus: () => Promise<any>;
  clearError: () => void;
};

export const useAdminStore = create<AdminState & AdminActions>()(
  persist(
    (set, get) => {
      // Helper: Get auth headers
      const getAuthHeaders = () => {
        const token = localStorage.getItem("adminToken");
        return {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        };
      };

      // Helper: Handle API errors
      const handleApiError = (err: Response | any, action: string) => {
        if (err.status === 401) {
          get().logout(); // Auto-logout on unauthorized
          return;
        }
        const message = err.message || err.data?.message || "Something went wrong";
        toast.error(`${action} failed: ${message}`);
        set({ error: message });
      };

      return {
        admin: null,
        isAuth: false,
        loading: false,
        error: null,
        admins: [],
        totalAdmins: 0,
        currentPage: 1,
        totalPages: 0,

        clearError: () => set({ error: null }),

        // ================= INIT AUTH =================
        initAuth: () => {
          get().checkAuth(); // Call this in your app root (e.g., _app.tsx)
        },

        // ================= LOGIN =================
        login: async (credentials) => {
          console.log("⚡ LOGIN ATTEMPT STARTED", credentials);
          set({ loading: true, error: null });

          try {
            const res = await fetch(`${baseUrl}/admin/admin-login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include", // Keep for cookies if needed
              body: JSON.stringify(credentials),
            });

            const data = await res.json();
            console.log("📥 Login response:", data);

            if (!res.ok) {
              handleApiError(data, "Login");
              set({ loading: false });
              return false;
            }

            // FIXED: Store JWT from response (assume backend sends it)
            if (data.token) {
              localStorage.setItem("adminToken", data.token);
            }

            set({
              isAuth: true,
              admin: data.admin || null,
              error: null,
              loading: false,
            });

            toast.success("Login successful");
            return true;
          } catch (err: any) {
            console.error("🔥 LOGIN NETWORK ERROR:", err);
            handleApiError(err, "Login");
            set({ loading: false });
            return false;
          }
        },

        // ================= CHECK AUTH =================
        checkAuth: async () => {
          const token = localStorage.getItem("adminToken");
          if (!token) {
            set({ isAuth: false, admin: null });
            return false;
          }

          try {
            const res = await fetch(`${baseUrl}/dashboard-status`, { // FIXED: Typo "dashbord" → "dashboard"
              method: "GET",
              headers: getAuthHeaders(),
            });

            const data = await res.json();

            if (!res.ok) {
              localStorage.removeItem("adminToken");
              set({ isAuth: false, admin: null });
              handleApiError(data, "Auth check");
              return false;
            }

            set({ isAuth: true, admin: data.admin || null });
            return true;
          } catch (err: any) {
            console.error("🔥 CHECK AUTH ERROR:", err);
            localStorage.removeItem("adminToken");
            set({ isAuth: false, admin: null });
            return false;
          }
        },

        // ================= LOGOUT =================
        logout: async () => {
          set({ loading: true });
          try {
            localStorage.removeItem("adminToken");
            set({ isAuth: false, admin: null, admins: [] });
            toast.success("Logged out successfully");
          } catch (err) {
            console.error("🔥 LOGOUT ERROR:", err);
            toast.error("Logout failed");
          } finally {
            set({ loading: false });
          }
        },

        // ================= FETCH ADMINS =================
        fetchAdmins: async (page = 1, limit = 10, search = "") => {
          set({ loading: true, error: null });
          const token = localStorage.getItem("adminToken");
          if (!token) {
            set({ isAuth: false });
            return;
          }

          try {
            let url = `${baseUrl}/getalladmins?page=${page}&limit=${limit}`;
            if (search) url += `&search=${encodeURIComponent(search)}`;

            const res = await fetch(url, {
              headers: getAuthHeaders(),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
              throw new Error(data.message || "Failed to fetch admins");
            }

            set({
              admins: data.admins,
              totalAdmins: data.total,
              currentPage: data.currentPage,
              totalPages: data.totalPages,
            });
          } catch (err: any) {
            handleApiError(err, "Fetch admins");
          } finally {
            set({ loading: false });
          }
        },

        // ================= ADD ADMIN =================
        addAdmin: async (data) => {
          set({ loading: true, error: null });
          const token = localStorage.getItem("adminToken");
          if (!token) {
            set({ isAuth: false });
            return false;
          }

          // Optional: Client-side validation
          if (!data.email.includes("@")) {
            toast.error("Invalid email format");
            set({ loading: false });
            return false;
          }

          try {
            const res = await fetch(`${baseUrl}/addAdmin`, {
              method: "POST",
              headers: getAuthHeaders(),
              body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok || !result.success) {
              handleApiError(result, "Add admin");
              return false;
            }

            toast.success("Admin added successfully");
            get().fetchAdmins(); // Refresh list
            return true;
          } catch (err: any) {
            handleApiError(err, "Add admin");
            return false;
          } finally {
            set({ loading: false });
          }
        },

        // ================= DASHBOARD =================
        fetchDashboardStatus: async () => {
          const token = localStorage.getItem("adminToken");
          if (!token) {
            set({ isAuth: false });
            return null;
          }

          try {
            const res = await fetch(`${baseUrl}/dashboard-status`, { // FIXED: Typo
              headers: getAuthHeaders(),
            });

            if (!res.ok) throw new Error("Unauthorized");

            return await res.json();
          } catch (err: any) {
            handleApiError(err, "Dashboard fetch");
            return null;
          }
        },

        // ================= FORGOT & RESET =================
        forgotPassword: async (email) => {
          set({ loading: true, error: null });
          try {
            const res = await fetch(`${baseUrl}/forgot-password`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) {
              handleApiError(data, "Forgot password");
              return false;
            }
            toast.success("Reset link sent to email");
            return true;
          } catch (err: any) {
            handleApiError(err, "Forgot password");
            return false;
          } finally {
            set({ loading: false });
          }
        },

        resetPassword: async (token, password) => {
          set({ loading: true, error: null });
          try {
            const res = await fetch(`${baseUrl}/reset-password/${token}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (!res.ok) {
              handleApiError(data, "Reset password");
              return false;
            }
            toast.success("Password reset successful");
            return true;
          } catch (err: any) {
            handleApiError(err, "Reset password");
            return false;
          } finally {
            set({ loading: false });
          }
        },
      };
    },
    {
      name: "admin-auth-storage",
      partialize: (state) => ({ isAuth: state.isAuth, admin: state.admin ? { ...state.admin, password: undefined } : null }), // Optional: Persist basic admin info
    }
  )
);