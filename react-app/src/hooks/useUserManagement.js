import { useState, useEffect, useCallback } from 'react';
import { userApiService } from '../services/userApiService.js';
import { UI_CONFIG, MESSAGES } from '../config/constants.js';

/**
 * Custom hook for managing user data and operations
 */
export const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  /**
   * Show notification toast
   */
  const showNotification = useCallback((message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), UI_CONFIG.TOAST_DURATION);
  }, []);

  /**
   * Fetch all users from API
   */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userData = await userApiService.getUsers();
      setUsers(userData);
    } catch (err) {
      const errorMessage = MESSAGES.ERROR.LOAD_FAILED;
      setError(errorMessage);
      showNotification(err.message || errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  /**
   * Create a new user
   */
  const createUser = useCallback(async (userData) => {
    try {
      const newUser = await userApiService.createUser(userData);
      // Since the API is fake, generate an ID
      const userWithId = {
        ...newUser,
        id: Math.max(...users.map(u => u.id), 0) + 1
      };
      setUsers(prevUsers => [...prevUsers, userWithId]);
      showNotification(MESSAGES.SUCCESS.USER_CREATED, 'success');
      return true;
    } catch (err) {
      showNotification(`${MESSAGES.ERROR.CREATE_FAILED}: ${err.message}`, 'error');
      return false;
    }
  }, [users, showNotification]);

  /**
   * Update an existing user
   */
  const updateUser = useCallback(async (userId, userData) => {
    try {
      await userApiService.updateUser(userId, userData);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, ...userData } : user
        )
      );
      showNotification(MESSAGES.SUCCESS.USER_UPDATED, 'success');
      return true;
    } catch (err) {
      showNotification(`${MESSAGES.ERROR.UPDATE_FAILED}: ${err.message}`, 'error');
      return false;
    }
  }, [showNotification]);

  /**
   * Delete a user
   */
  const deleteUser = useCallback(async (userId) => {
    if (!window.confirm(MESSAGES.CONFIRMATION.DELETE_USER)) {
      return false;
    }

    try {
      await userApiService.deleteUser(userId);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      showNotification(MESSAGES.SUCCESS.USER_DELETED, 'success');
      return true;
    } catch (err) {
      showNotification(`${MESSAGES.ERROR.DELETE_FAILED}: ${err.message}`, 'error');
      return false;
    }
  }, [showNotification]);

  // Load users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    notification,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    showNotification
  };
};