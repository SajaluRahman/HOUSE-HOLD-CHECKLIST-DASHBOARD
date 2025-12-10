// stores/useStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  getRequest,
  postRequest,
  patchRequest,
  putRequest,
  deleteRequest,
} from "@/api"; // adjust path to your api file
import { all } from "axios";

// Get JWT from localStorage
const getToken = () => {
  const match = document.cookie.match(/(?:^|; )adminToken=([^;]*)/);
  return match ? match[1] : null;
};


// Helper to include token in headers
const withAuth = (options: RequestInit = {}) => {
  const token = getToken();
  return {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {}),
    },
  };
};

// Types
export type Category = {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type DailyArea = {
 
  _id: string;
  category: string | Category;
  areaName: string;
};

export type Observation = {
  _id: string;
  title: string;
  description: string;
  image?: string;
  date: string;
};

type useStore = {
  // Categories
  categories: Category[];
  loadingCategories: boolean;
  fetchCategories: () => Promise<void>;
  createCategory: (data: { name: string; description?: string }) => Promise<any>;
  updateCategory: (id: string, data: { name?: string; description?: string }) => Promise<any>;
  deleteCategory: (id: string) => Promise<any>;

  // Daily Areas
  dailyAreas: DailyArea[];
  loadingDailyAreas: boolean;
  fetchDailyAreas: () => Promise<void>;
  addDailyArea: (data: { category: string; areaName: string }) => Promise<any>;
  editDailyArea: (id: string, data: { areaName?: string; category?: string }) => Promise<any>;

  // ✅ FIXED TYPE
  updateDailyStatus: (data: {
    categoryId: string;
    areaName: string;
    date: string;
    status: "ok" | "notok";
    command?: string;
    actionTimeframe?: string;
    completed?: boolean;
    signature?: string;
    followUp?: string;
  }) => Promise<any>;

  categorySummary: any[];
  fetchCategorySummary: () => Promise<void>;

  // Observations
  observations: Observation[];
  loadingObservations: boolean;
  fetchObservations: () => Promise<void>;
  createObservation: (data: any) => Promise<any>;
  updateObservation: (id: string, data: any) => Promise<any>;
  deleteObservation: (id: string) => Promise<any>;
};

// Zustand Store
export const useStore = create<useStore>()(
  devtools((set) => ({
    // Initial state
    categories: [],
    loadingCategories: false,

    dailyAreas: [],
    loadingDailyAreas: false,

    observations: [],
    loadingObservations: false,

    categorySummary: [],

    // === CATEGORY ACTIONS ===
    fetchCategories: async () => {
      set({ loadingCategories: true });

      let page = 1;
      let allCategories: any[] = [];
      let totalPages = 1;

      do {
        const res = await getRequest(`/category/get-cound?page=${page}`, withAuth());

        if (res.error) break;

        const categories = Array.isArray(res.categories) ? res.categories : [];
        allCategories = [...allCategories, ...categories];
        console.log("sajalu" ,allCategories);


        totalPages = res.totalPages || 1;
        page++;

      } while (page <= totalPages);

      set({ categories: allCategories, loadingCategories: false });
    },

    createCategory: async (data: { name: string }) => {
      const payload = { name: data.name }; // send ONLY name (backend requirement)

      const res = await postRequest({
        url: "/category/add-category",
        data: payload,
        options: withAuth(),
      });

      if (!res.error && res.category) {
        set((state) => ({
          categories: [...state.categories, res.category],
        }));
      }

      return res;
    },

    updateCategory: async (id, data) => {
      const res = await patchRequest({ url: `/category/edit-category/${id}`, data, options: withAuth() });
      if (!res.error) {
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat._id === id ? { ...cat, ...data } : cat
          ),
        }));
      }
      return res;
    },

    deleteCategory: async (id) => {
      const res = await deleteRequest(`/category/delet/${id}`, withAuth());
      if (!res.error) {
        set((state) => ({
          categories: state.categories.filter((cat) => cat._id !== id),
        }));
      }
      return res;
    },

    // === DAILY AREAS (TASKS) ===
    fetchDailyAreas: async () => {
      set({ loadingDailyAreas: true });

      let page = 1;
      let allItems: any[] = [];
      let totalPages = 1;

      do {
        const res = await getRequest(`/task/getall?page=${page}`, withAuth());
        console.log("Fetched daily areas page", page, "response:", res);

        if (res.error) break;

        const items = Array.isArray(res.data) ? res.data : [];

        allItems = [...allItems, ...items];

        totalPages = res.totalPages || 1;
        page++;

      } while (page <= totalPages);

      // Normalize items to always include categoryId
      const normalized = allItems.map((area) => ({
        ...area,
        categoryId:
          typeof area.category === "object" ? area.category._id : area.category,
        dateStatuses: area.dateStatuses || [],
      }));

      set({ dailyAreas: normalized, loadingDailyAreas: false });
    },

    // ✅ FIXED addDailyArea (categoryId → category)
    addDailyArea: async (data: { category: string; areaName: string }) => {
      const res = await postRequest({
        url: "/task/add-area",
        data,
        options: withAuth(),
      });

      if (!res.error && res.data) {
        const category = useStore.getState().categories.find(c => c._id === data.category);

        const normalizedArea = {
          _id: res.data._id,
          areaName: res.data.areaName,
          categoryId: category?._id || data.category,
          status: res.data.status || "pending",
          createdAt: res.data.createdAt || new Date().toISOString(),
        };

        set((state) => ({
          dailyAreas: [...state.dailyAreas, normalizedArea],
        }));
      }

      return res;
    },

   

    // ✅ FULLY FIXED updateDailyStatus
// stores/useStore.ts → replace the whole updateDailyStatus with this:
updateDailyStatus: async ({
  categoryId,
  areaName,
  date="02/02/2024",
  status,
  command = "",
  actionTimeframe = "Open",
  completed = status === "ok",
  signature = "",
  followUp = "",
}) => {
  try {
    console.log("Sending to backend:", { categoryId,areaName, date, status, completed });

    const res = await postRequest({
      url: "/task/update-status",   // ← keep this for now
      data: {
        categoryId,
        areaName,
        date,
        status,
        command,
        actionTimeframe,
        completed,
        signature,
        followUp,
      },
      options: withAuth(),
    });

    // THIS WILL SHOW YOU THE TRUTH
    console.log("Backend response:", res);
//     console.log("Received actionTimeframe:", req.body.actionTimeframe);
// console.log("Allowed enums:", DailyStatusSchema.path("dateStatuses.0.actionTimeframe").enumValues);


    if (!res.error && res.data) {
      set((state) => ({
        dailyAreas: state.dailyAreas.map((area) =>
          area._id === areaId 
            ? { ...area, dateStatuses: res.data.dateStatuses || area.dateStatuses }
            : area
        ),
      }));
    }

    return res;
  } catch (err: any) {
    // THIS WILL SHOW THE REAL 404 DETAILS
    console.error("updateDailyStatus FAILED:");
    console.error("Status:", err?.response?.status);
    console.error("Data:", err?.response?.data);
    console.error("Message:", err.message);
    return { error: true, rawError: err };
  }
},
    fetchCategorySummary: async () => {
      const res = await getRequest("/task/coundsummary", withAuth());
      if (!res.error) {
        set({ categorySummary: res.data || res });
      }
    },

    // === OBSERVATIONS ===
    fetchObservations: async () => {
      set({ loadingObservations: true });
      const res = await getRequest("/observation/getall-observations", withAuth());
      if (!res.error) {
        set({ observations: res.data || res });
      }
      set({ loadingObservations: false });
    },

    createObservation: async (data) => {
      const res = await postRequest({ url: "/observation/add-observation", data, options: withAuth() });
      if (!res.error) {
        set((state) => ({
          observations: [...state.observations, res.data || res],
        }));
      }
      return res;
    },

    updateObservation: async (id, data) =>
      putRequest({ url: `/observation/edit-observations/${id}`, data, options: withAuth() }).then((res) => {
        if (!res.error) {
          set((state) => ({
            observations: state.observations.map((obs) =>
              obs._id === id ? { ...obs, ...data } : obs
            ),
          }));
        }
        return res;
      }),

    deleteObservation: async (id) => {
      const res = await deleteRequest(`/observation/delete-observations/${id}`, withAuth());
      if (!res.error) {
        set((state) => ({
          observations: state.observations.filter((obs) => obs._id !== id),
        }));
      }
      return res;
    },
  }))
);
