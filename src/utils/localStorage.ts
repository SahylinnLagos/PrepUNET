import { User, Student, Tutor } from '../types';
import { Connection, ChatMessage, Chat, Reviuw } from '../types';
import { mockStudents, mockTutors } from '../data/mockData';

const STORAGE_KEYS = {
  USERS: 'unet_users',
  CURRENT_USER: 'unet_current_user',
  CONNECTIONS: 'unet_connections',
  CHATS: 'unet_chats',
  REVIEWS: 'unet_reviews',
};

export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const allUsers = [...mockStudents, ...mockTutors];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
  }
};

export const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const updateUser = (updatedUser: User): void => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

export const getUserByEmail = (email: string): User | null => {
  const users = getUsers();
  return users.find(user => user.email === email) || null;
};

export const getStudents = (): Student[] => {
  return getUsers().filter(user => user.role === 'student') as Student[];
};

export const getTutors = (): Tutor[] => {
  return getUsers().filter(user => user.role === 'tutor') as Tutor[];
};

// Connection management
export const getConnections = (): Connection[] => {
  const connections = localStorage.getItem(STORAGE_KEYS.CONNECTIONS);
  return connections ? JSON.parse(connections) : [];
};

export const saveConnection = (connection: Connection): void => {
  const connections = getConnections();
  connections.push(connection);
  localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(connections));
};

export const updateConnection = (connectionId: string, updates: Partial<Connection>): void => {
  const connections = getConnections();
  const index = connections.findIndex(conn => conn.id === connectionId);
  if (index !== -1) {
    connections[index] = { ...connections[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(connections));
  }
};

export const getConnectionsByUser = (userId: string): Connection[] => {
  const connections = getConnections();
  return connections.filter(conn => conn.studentId === userId || conn.tutorId === userId);
};

export const getConnectionBetweenUsers = (studentId: string, tutorId: string): Connection | null => {
  const connections = getConnections();
  return connections.find(conn => conn.studentId === studentId && conn.tutorId === tutorId) || null;
};

// Chat management
export const getChats = (): Chat[] => {
  const chats = localStorage.getItem(STORAGE_KEYS.CHATS);
  return chats ? JSON.parse(chats) : [];
};

export const getChatByConnectionId = (connectionId: string): Chat | null => {
  const chats = getChats();
  return chats.find(chat => chat.connectionId === connectionId) || null;
};

export const saveChatMessage = (connectionId: string, message: ChatMessage): void => {
  const chats = getChats();
  const chatIndex = chats.findIndex(chat => chat.connectionId === connectionId);
  
  if (chatIndex !== -1) {
    chats[chatIndex].messages.push(message);
    chats[chatIndex].lastMessage = message;
  } else {
    chats.push({
      connectionId,
      messages: [message],
      lastMessage: message,
    });
  }
  
  localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
};

export const generateReviewCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Review management
export const getReviews = (): Review[] => {
  const reviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);
  return reviews ? JSON.parse(reviews) : [];
};

export const saveReview = (review: Review): void => {
  const reviews = getReviews();
  reviews.push(review);
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
};

export const getReviewsByTutor = (tutorId: string): Review[] => {
  const reviews = getReviews();
  return reviews.filter(review => review.tutorId === tutorId);
};

export const getReviewByConnection = (connectionId: string): Review | null => {
  const reviews = getReviews();
  return reviews.find(review => review.connectionId === connectionId) || null;
};

export const getTutorAverageRating = (tutorId: string): number => {
  const reviews = getReviewsByTutor(tutorId);
  if (reviews.length === 0) return 0;
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((totalRating / reviews.length) * 10) / 10;
};

// Image management
export const saveImageAsBlob = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const getImageBlob = (imageData: string): string => {
  return imageData;
};

