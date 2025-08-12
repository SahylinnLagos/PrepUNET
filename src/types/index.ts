export interface User {
  id: string;
  idCard: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'student' | 'tutor';
  createdAt: string;
  img?: any;
  genero?: any;
  date?: any;
}

export interface Student extends User {
  role: 'student';
  career: string;
  subjectOfInterest: string;
  img?: any;
  genero?: any;
  date?: any;
}

export interface Subject {
  id: string;
  name: string;
  pricePerHour: number;
}

export interface Tutor extends User {
  role: 'tutor';
  tutorType: 'unet' | 'private';
  subjects: Subject[];
  img?: any;
  genero?: any;
  date?: any;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface Connection {
  id: string;
  studentId: string;
  tutorId: string;
  status: 'pending' | 'accepted' | 'rejected';
  reviewCode: string;
  createdAt: string;
  acceptedAt?: string;
}

export interface ChatMessage {
  id: string;
  connectionId: string;
  senderId: string;
  message: string;
  timestamp: string;
}

export interface Chat {
  connectionId: string;
  messages: ChatMessage[];
  lastMessage?: ChatMessage;
}

export interface Review {
  id: string;
  studentId: string;
  tutorId: string;
  connectionId: string;
  rating: number;
  comment: string;
  reviewCode: string;
  createdAt: string;
}

export interface Review {
  id: string;
  studentId: string;
  tutorId: string;
  connectionId: string;
  rating: number;
  comment: string;
  reviewCode: string;
  createdAt: string;
}