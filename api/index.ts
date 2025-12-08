// @/api/index.ts  ← THIS IS THE WINNING VERSION

import axios from "axios";
import { baseUrl } from "./const";

const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,        // ← This sends the httpOnly cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// COMPLETELY REMOVE THE INTERCEPTOR — IT'S CAUSING THE PROBLEM
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("adminToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// --- API HELPERS (clean & working) ---
export const getRequest = async (url: string) => {
  try {
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (err: any) {
    return { error: true, message: err.response?.data?.message || err.message };
  }
};

export const postRequest = async ({ url, data }: { url: string; data?: any }) => {
  try {
    const res = await axiosInstance.post(url, data);
    return res.data;
  } catch (err: any) {
    console.error("postRequest error:", err.response?.data || err.message);
    return { error: true, message: err.response?.data?.message || err.message };
  }
};

export const patchRequest = async ({ url, data }: { url: string; data?: any }) => {
  try {
    return (await axiosInstance.patch(url, data)).data;
  } catch (err: any) {
    return { error: true, message: err.response?.data?.message || err.message };
  }
};

export const putRequest = async ({ url, data }: { url: string; data?: any }) => {
  try {
    return (await axiosInstance.put(url, data)).data;
  } catch (err: any) {
    return { error: true, message: err.response?.data?.message || err.message };
  }
};

export const deleteRequest = async (url: string) => {
  try {
    return (await axiosInstance.delete(url)).data;
  } catch (err: any) {
    return { error: true, message: err.response?.data?.message || err.message };
  }
};

export { baseUrl };