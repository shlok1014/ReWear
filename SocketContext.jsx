import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (user) {
      // Create socket connection
      const newSocket = io('http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token')
        }
      });

      // Join user room
      newSocket.emit('join-user', user._id);

      // Join admin room if admin
      if (isAdmin()) {
        newSocket.emit('join-admin');
      }

      // Listen for notifications
      newSocket.on('notification', (notification) => {
        setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10 notifications
      });

      // Listen for item updates
      newSocket.on('item-updated', (data) => {
        console.log('Item updated:', data);
      });

      // Listen for new swap requests
      newSocket.on('swap-request', (data) => {
        setNotifications(prev => [{
          id: Date.now(),
          type: 'swap-request',
          title: 'New Swap Request',
          message: `${data.userName} wants to swap for your ${data.itemTitle}`,
          timestamp: new Date(),
          read: false
        }, ...prev.slice(0, 9)]);
      });

      // Listen for admin notifications
      if (isAdmin()) {
        newSocket.on('admin-notification', (data) => {
          setNotifications(prev => [{
            id: Date.now(),
            type: 'admin',
            title: data.title,
            message: data.message,
            timestamp: new Date(),
            read: false
          }, ...prev.slice(0, 9)]);
        });
      }

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user, isAdmin]);

  const sendNotification = (userId, notification) => {
    if (socket) {
      socket.emit('send-notification', { userId, notification });
    }
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };

  const value = {
    socket,
    notifications,
    sendNotification,
    markNotificationAsRead,
    clearNotifications,
    getUnreadCount
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 