
import { 
  Role, UserStatus, CampusStatus, BuildingStatus, RoomStatus, 
  BuildingType, RoomType, User, Campus, Building, Room 
} from './types';

// In-memory data store
let MOCK_USERS: User[] = [
  { id: '1', full_name: 'System Admin', username: 'admin', email: 'admin@udata.edu', status: UserStatus.ACTIVE, role: Role.ADMIN },
  { id: '2', full_name: 'Data Manager', username: 'manager', email: 'manager@udata.edu', status: UserStatus.ACTIVE, role: Role.DATA_MANAGER },
  { id: '3', full_name: 'Staff Viewer', username: 'viewer', email: 'viewer@udata.edu', status: UserStatus.ACTIVE, role: Role.VIEWER },
];

let MOCK_CAMPUSES: Campus[] = [
  { id: 'c1', code: 'MAIN', name: 'Main Campus', address: '123 University Ave', status: CampusStatus.ACTIVE },
  { id: 'c2', code: 'WEST', name: 'West Side Campus', address: '456 College Blvd', status: CampusStatus.ACTIVE },
];

let MOCK_BUILDINGS: Building[] = [
  { id: 'b1', campus_id: 'c1', prefix: 'B', building_no: '101', floors: 4, type: BuildingType.LAB, status: BuildingStatus.ACTIVE },
  { id: 'b2', campus_id: 'c1', prefix: 'B', building_no: '202', floors: 3, type: BuildingType.ACADEMIC, status: BuildingStatus.ACTIVE },
];

let MOCK_ROOMS: Room[] = [
  { id: 'r1', building_id: 'b1', prefix: 'R', room_no: '101-A', capacity: 50, floor: 1, type: RoomType.LECTURE_HALL, status: RoomStatus.AVAILABLE },
  { id: 'r2', building_id: 'b1', prefix: 'R', room_no: '205', capacity: 20, floor: 2, type: RoomType.LAB, status: RoomStatus.OCCUPIED },
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  auth: {
    login: async (username: string): Promise<{ user: User; token: string }> => {
      await sleep(800);
      const user = MOCK_USERS.find(u => u.username === username);
      if (!user) throw new Error("Invalid credentials");
      return { user, token: `fake-jwt-token-for-${user.id}` };
    },
    getMe: async (token: string): Promise<User> => {
      await sleep(200);
      const userId = token.split('-').pop();
      const user = MOCK_USERS.find(u => u.id === userId);
      if (!user) throw new Error("Unauthorized");
      return user;
    }
  },
  users: {
    list: async (): Promise<User[]> => {
      await sleep(500);
      return MOCK_USERS;
    },
    create: async (data: Omit<User, 'id'> & { password?: string }): Promise<User> => {
      await sleep(800);
      const newUser = { 
        id: Math.random().toString(36).substr(2, 9),
        full_name: data.full_name,
        username: data.username,
        email: data.email,
        status: data.status,
        role: data.role
      };
      MOCK_USERS = [...MOCK_USERS, newUser];
      return newUser;
    },
    update: async (id: string, data: Partial<User>): Promise<User> => {
      await sleep(500);
      const index = MOCK_USERS.findIndex(u => u.id === id);
      if (index === -1) throw new Error("User not found");
      const updatedUser = { ...MOCK_USERS[index], ...data };
      MOCK_USERS[index] = updatedUser;
      return updatedUser;
    },
    delete: async (id: string): Promise<void> => {
      await sleep(500);
      MOCK_USERS = MOCK_USERS.filter(u => u.id !== id);
    }
  },
  campuses: {
    list: async (): Promise<Campus[]> => {
      await sleep(500);
      return MOCK_CAMPUSES;
    },
    create: async (data: Omit<Campus, 'id'>): Promise<Campus> => {
      await sleep(500);
      const newCampus = { ...data, id: Math.random().toString(36).substr(2, 9) };
      MOCK_CAMPUSES = [...MOCK_CAMPUSES, newCampus];
      return newCampus;
    },
    update: async (id: string, data: Partial<Campus>): Promise<Campus> => {
      await sleep(500);
      const index = MOCK_CAMPUSES.findIndex(c => c.id === id);
      if (index === -1) throw new Error("Campus not found");
      const updatedCampus = { ...MOCK_CAMPUSES[index], ...data };
      MOCK_CAMPUSES[index] = updatedCampus;
      return updatedCampus;
    },
    delete: async (id: string): Promise<void> => {
      await sleep(500);
      MOCK_CAMPUSES = MOCK_CAMPUSES.filter(c => c.id !== id);
    }
  },
  buildings: {
    listByCampus: async (campusId: string): Promise<Building[]> => {
      await sleep(500);
      return MOCK_BUILDINGS.filter(b => b.campus_id === campusId);
    },
    create: async (data: Omit<Building, 'id'>): Promise<Building> => {
      await sleep(500);
      if (data.prefix !== 'B') throw new Error("Building prefix must be 'B'");
      const newBuilding = { ...data, id: Math.random().toString(36).substr(2, 9) };
      MOCK_BUILDINGS = [...MOCK_BUILDINGS, newBuilding];
      return newBuilding;
    },
    update: async (id: string, data: Partial<Building>): Promise<Building> => {
      await sleep(500);
      const index = MOCK_BUILDINGS.findIndex(b => b.id === id);
      if (index === -1) throw new Error("Building not found");
      const updatedBuilding = { ...MOCK_BUILDINGS[index], ...data };
      MOCK_BUILDINGS[index] = updatedBuilding;
      return updatedBuilding;
    },
    delete: async (id: string): Promise<void> => {
      await sleep(500);
      MOCK_BUILDINGS = MOCK_BUILDINGS.filter(b => b.id !== id);
    }
  },
  rooms: {
    listByBuilding: async (buildingId: string): Promise<Room[]> => {
      await sleep(500);
      return MOCK_ROOMS.filter(r => r.building_id === buildingId);
    },
    create: async (data: Omit<Room, 'id'>): Promise<Room> => {
      await sleep(500);
      if (data.prefix !== 'R') throw new Error("Room prefix must be 'R'");
      const newRoom = { ...data, id: Math.random().toString(36).substr(2, 9) };
      MOCK_ROOMS = [...MOCK_ROOMS, newRoom];
      return newRoom;
    },
    update: async (id: string, data: Partial<Room>): Promise<Room> => {
      await sleep(500);
      const index = MOCK_ROOMS.findIndex(r => r.id === id);
      if (index === -1) throw new Error("Room not found");
      const updatedRoom = { ...MOCK_ROOMS[index], ...data };
      MOCK_ROOMS[index] = updatedRoom;
      return updatedRoom;
    },
    delete: async (id: string): Promise<void> => {
      await sleep(500);
      MOCK_ROOMS = MOCK_ROOMS.filter(r => r.id !== id);
    }
  }
};
