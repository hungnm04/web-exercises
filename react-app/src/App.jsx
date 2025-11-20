import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Loader2, User, Mail, Phone, Briefcase, AlertCircle } from 'lucide-react';
import { useUserManagement } from './hooks/useUserManagement';
import { useSearchAndPagination } from './hooks/useSearchAndPagination';
import Toast from './components/Toast';
import UserModal from './components/UserModal';
import Pagination from './components/Pagination';
import { UI_CONFIG } from './config/constants';

/**
 * Main App Component
 */
export default function App() {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom hooks for business logic
  const {
    users,
    loading,
    error,
    notification,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    showNotification
  } = useUserManagement();

  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    goToPage,
    currentItems,
    totalPages
  } = useSearchAndPagination(users);

  // Modal handlers
  const openCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // Form submission handlers
  const handleCreateUser = async (formData) => {
    setIsSubmitting(true);
    // Transform form data to API format
    const apiData = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      website: formData.website,
      address: {
        street: formData.street,
        city: formData.city,
        geo: { lat: '0', lng: '0' }
      },
      company: {
        name: formData.companyName
      }
    };
    const success = await createUser(apiData);
    setIsSubmitting(false);
    if (success) closeModal();
  };

  const handleUpdateUser = async (formData) => {
    if (!editingUser) return;
    setIsSubmitting(true);
    // Transform form data to API format
    const apiData = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      website: formData.website,
      address: {
        ...editingUser.address,
        street: formData.street,
        city: formData.city
      },
      company: {
        ...editingUser.company,
        name: formData.companyName
      }
    };
    const success = await updateUser(editingUser.id, apiData);
    setIsSubmitting(false);
    if (success) closeModal();
  };

  const handleDeleteUser = async (userId) => {
    await deleteUser(userId);
  };

  return (
    <div className="app-container">
      <div className="app-wrapper">

        {/* HEADER */}
        <div className="page-header">
          <div className="page-header-content">
            <div>
              <h1 className="page-title">
                <User className="w-8 h-8" /> User Management
              </h1>
              <p className="page-subtitle">Manage user accounts and permissions</p>
            </div>
            <button onClick={openCreateModal} className="primary-button">
              <Plus className="w-5 h-5" /> Add User
            </button>
          </div>
        </div>

        {/* TOOLBAR (Search) */}
        <div className="toolbar">
          <div className="search-input-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search users by name..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* MAIN CONTENT */}
        {loading ? (
          <div className="loading-container">
            <Loader2 className="loading-spinner" />
            <p className="font-medium">Loading users...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <AlertCircle className="error-icon" />
            <p className="text-lg font-medium">{error}</p>
            <button onClick={fetchUsers} className="retry-button">
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* USER TABLE */}
            <div className="data-table">
              <div className="table-container">
                <table className="table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-header-cell w-20">ID</th>
                      <th className="table-header-cell">User</th>
                      <th className="table-header-cell">Contact</th>
                      <th className="table-header-cell hidden md:table-cell">Company</th>
                      <th className="table-header-cell text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {currentItems.length > 0 ? (
                      currentItems.map((user) => (
                        <tr key={user.id} className="table-row">
                          <td className="table-cell user-id">#{user.id}</td>

                          <td className="table-cell">
                            <div className="flex items-center">
                              <div className="user-avatar">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <div className="user-name">{user.name}</div>
                                <div className="user-username">@{user.username || 'user'}</div>
                              </div>
                            </div>
                          </td>

                          <td className="table-cell text-sm">
                            <div className="contact-info">
                              <div className="contact-item">
                                <Mail className="contact-icon" /> {user.email}
                              </div>
                              <div className="contact-item">
                                <Phone className="contact-icon" /> {user.phone}
                              </div>
                            </div>
                          </td>

                          <td className="table-cell text-sm text-gray-600 hidden md:table-cell">
                            <div className="company-info">
                              <Briefcase className="company-icon" />
                              {user.company?.name || <span className="italic text-gray-400">N/A</span>}
                            </div>
                          </td>

                          <td className="table-cell text-right">
                            <div className="action-buttons">
                              <button onClick={() => openEditModal(user)}
                                className="edit-button" title="Edit user">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteUser(user.id)}
                                className="delete-button" title="Delete user">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="empty-state">
                          <div className="empty-state-content">
                            <Search className="empty-state-icon" />
                            <span>No users found matching your search.</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </>
        )}

        {/* MODAL COMPONENT */}
        <UserModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          initialData={editingUser}
          isSubmitting={isSubmitting}
        />

        {/* TOAST NOTIFICATION */}
        {notification && (
          <Toast
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </div>
  );
}