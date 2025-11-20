import { API_CONFIG } from '../config/constants.js';

/**
 * API service for user management operations
 */
class UserApiService {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.endpoints = API_CONFIG.ENDPOINTS;
  }

  /**
   * Generic fetch wrapper with error handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Fetch all users
   */
  async getUsers() {
    return this.request(this.endpoints.USERS);
  }

  /**
   * Create a new user
   */
  async createUser(userData) {
    return this.request(this.endpoints.USERS, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  /**
   * Update an existing user
   */
  async updateUser(userId, userData) {
    return this.request(`${this.endpoints.USERS}/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  /**
   * Delete a user
   */
  async deleteUser(userId) {
    return this.request(`${this.endpoints.USERS}/${userId}`, {
      method: 'DELETE'
    });
  }
}

export const userApiService = new UserApiService();