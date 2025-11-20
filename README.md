# User Management Dashboard

A modern user management dashboard built with React, featuring clean architecture and professional design patterns.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Toast.jsx       # Notification component
│   ├── UserModal.jsx   # User form modal
│   └── Pagination.jsx  # Pagination controls
├── hooks/              # Custom React hooks
│   ├── useUserManagement.js    # User CRUD logic
│   └── useSearchAndPagination.js # Search & pagination logic
├── services/           # API abstraction layer
│   └── userApiService.js       # User API service
├── config/             # Configuration files
│   └── constants.js    # App constants and messages
├── index.css           # Global styles 
└── App.jsx             # Main application component
```


## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hungnm04/web-exercises.git
   cd web-exercises/react-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**

## 📱 Usage

- **View Users**: Browse the user table with pagination
- **Search**: Use the search bar to filter users by name
- **Add User**: Click "Add User" to create new accounts
- **Edit User**: Click the edit icon to modify user details
- **Delete User**: Click the delete icon to remove users (with confirmation)

