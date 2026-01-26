
export type UUID = string;

export enum UserStatus {
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
  SUSPENDED = "SUSPENDED"
}

export enum CampusStatus {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED"
}

export enum BuildingStatus {
  ACTIVE = "ACTIVE",
  IN_MAINTENANCE = "IN_MAINTENANCE",
  RETIRED = "RETIRED"
}

export enum RoomStatus {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
  MAINTENANCE = "MAINTENANCE",
  RETIRED = "RETIRED"
}

export enum BuildingType {
  ACADEMIC = "ACADEMIC",
  DORM = "DORM",
  LIBRARY = "LIBRARY",
  LAB = "LAB",
  OTHER = "OTHER"
}

export enum RoomType {
  LECTURE_HALL = "LECTURE_HALL",
  LAB = "LAB",
  OFFICE = "OFFICE",
  STORAGE = "STORAGE",
  DORM = "DORM",
  OTHER = "OTHER"
}

export enum Role {
  ADMIN = "ADMIN",
  DATA_MANAGER = "DATA_MANAGER",
  VIEWER = "VIEWER"
}

export interface User {
  id: UUID;
  full_name: string;
  username: string;
  email: string;
  status: UserStatus;
  role: Role;
}

export interface Campus {
  id: UUID;
  code: string;
  name: string;
  address: string;
  status: CampusStatus;
}

export interface Building {
  id: UUID;
  campus_id: UUID;
  prefix: string;
  building_no: string;
  floors: number;
  type: BuildingType;
  status: BuildingStatus;
}

export interface Room {
  id: UUID;
  building_id: UUID;
  prefix: string;
  room_no: string;
  capacity: number;
  floor: number;
  type: RoomType;
  status: RoomStatus;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
