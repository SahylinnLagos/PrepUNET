import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Connection, ChatMessage } from '../types';
import { 
  getConnections, 
  saveConnection, 
  updateConnection, 
  getConnectionsByUser,
  getConnectionBetweenUsers,
  saveChatMessage,
  getChatByConnectionId,
  generateReviewCode
} from '../utils/localStorage';
import { useAuth } from './AuthContext';

interface ConnectionContextType {
  connections: Connection[];
  userConnections: Connection[];
  sendConnectionRequest: (tutorId: string) => boolean;
  acceptConnection: (connectionId: string) => boolean;
  rejectConnection: (connectionId: string) => boolean;
  getConnectionStatus: (studentId: string, tutorId: string) => Connection | null;
  sendMessage: (connectionId: string, message: string) => void;
  getChatMessages: (connectionId: string) => ChatMessage[];
  refreshConnections: () => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const useConnections = () => {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error('useConnections must be used within a ConnectionProvider');
  }
  return context;
};

interface ConnectionProviderProps {
  children: ReactNode;
}

export const ConnectionProvider: React.FC<ConnectionProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [userConnections, setUserConnections] = useState<Connection[]>([]);

  const refreshConnections = () => {
    const allConnections = getConnections();
    setConnections(allConnections);
    
    if (user) {
      const userConns = getConnectionsByUser(user.id);
      setUserConnections(userConns);
    }
  };

  useEffect(() => {
    refreshConnections();
  }, [user]);

  const sendConnectionRequest = (tutorId: string): boolean => {
    if (!user || user.role !== 'student') return false;

    // Check if connection already exists
    const existingConnection = getConnectionBetweenUsers(user.id, tutorId);
    if (existingConnection) return false;

    const newConnection: Connection = {
      id: Date.now().toString(),
      studentId: user.id,
      tutorId,
      status: 'pending',
      reviewCode: generateReviewCode(),
      createdAt: new Date().toISOString(),
    };

    saveConnection(newConnection);
    refreshConnections();
    return true;
  };

  const acceptConnection = (connectionId: string): boolean => {
    if (!user || user.role !== 'tutor') return false;

    updateConnection(connectionId, {
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
    });
    
    refreshConnections();
    return true;
  };

  const rejectConnection = (connectionId: string): boolean => {
    if (!user || user.role !== 'tutor') return false;

    updateConnection(connectionId, {
      status: 'rejected',
    });
    
    refreshConnections();
    return true;
  };

  const getConnectionStatus = (studentId: string, tutorId: string): Connection | null => {
    return getConnectionBetweenUsers(studentId, tutorId);
  };

  const sendMessage = (connectionId: string, message: string): void => {
    if (!user) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      connectionId,
      senderId: user.id,
      message,
      timestamp: new Date().toISOString(),
    };

    saveChatMessage(connectionId, newMessage);
  };

  const getChatMessages = (connectionId: string): ChatMessage[] => {
    const chat = getChatByConnectionId(connectionId);
    return chat ? chat.messages : [];
  };

  const value: ConnectionContextType = {
    connections,
    userConnections,
    sendConnectionRequest,
    acceptConnection,
    rejectConnection,
    getConnectionStatus,
    sendMessage,
    getChatMessages,
    refreshConnections,
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};