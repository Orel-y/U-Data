import api from "./axios";
import axios from "axios"; // used only for login
import { User, Campus, Building, Room } from "../types";
import { TOKEN_KEY } from "./axios";

const API_BASE = "http://localhost:8080";

export const apiService = {
  auth: {
    login: async (username: string, password: string) => {
      const res = await axios.post(
        `${API_BASE}/auth/login`,
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );
      return res.data;
    },

    getMe: () => api.get<User>("/auth/me").then(res => res.data),
  },

  users: {
    list: () => api.get<User[]>("/auth/users").then(res => res.data),
    create: (data: Partial<User>) => api.post<User>("/auth/register", data).then(res => res.data),
    update: (id: string, data: Partial<User>) => api.put<User>(`/auth/user/${id}`, data).then(res => res.data),
    delete: (id: string) => api.delete(`/users/${id}`).then(res => res.data),
  },

  campuses: {
    list: () => api.get<Campus[]>("/campuses").then(res => res.data),
    create: (data: Partial<Campus>) => api.post<Campus>("/campuses", data).then(res => res.data),
    update: (id: string, data: Partial<Campus>) => api.put<Campus>(`/campuses/${id}`, data).then(res => res.data),
    delete: (id: string) => api.delete(`/campuses/${id}`).then(res => res.data),
  },

  buildings: {
    listByCampus: (campusId: string) => api.get<Building[]>(`buildings/campus/${campusId}`).then(res => res.data),
    create: (data: Partial<Building>) => api.post<Building>("/buildings", data).then(res => res.data),
    update: (id: string, data: Partial<Building>) => api.put<Building>(`/buildings/${id}`, data).then(res => res.data),
    delete: (id: string) => api.delete(`/buildings/${id}`).then(res => res.data),
  },

  rooms: {
    listByBuilding: (buildingId: string) => api.get<Room[]>(`/rooms/building/${buildingId}`).then(res => res.data),
    create: (data: Partial<Room>) => api.post<Room>("/rooms", data).then(res => res.data),
    update: (id: string, data: Partial<Room>) => api.put<Room>(`/rooms/${id}`, data).then(res => res.data),
    delete: (id: string) => api.delete(`/rooms/${id}`).then(res => res.data),
  },
};
