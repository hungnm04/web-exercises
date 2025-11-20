// Configuration constants for the User Management Application
export const API_CONFIG = {
  BASE_URL: 'https://jsonplaceholder.typicode.com',
  ENDPOINTS: {
    USERS: '/users'
  },
  TIMEOUT: 5000
};

export const UI_CONFIG = {
  ITEMS_PER_PAGE: 5,
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300
};

export const VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  PHONE: {
    PATTERN: /^[\+]?[1-9][\d]{0,15}$/
  }
};

export const MESSAGES = {
  SUCCESS: {
    USER_CREATED: 'Thêm người dùng mới thành công!',
    USER_UPDATED: 'Cập nhật thông tin thành công!',
    USER_DELETED: 'Đã xóa người dùng thành công.'
  },
  ERROR: {
    LOAD_FAILED: 'Không thể tải danh sách người dùng. Vui lòng kiểm tra kết nối.',
    CREATE_FAILED: 'Lỗi khi thêm người dùng',
    UPDATE_FAILED: 'Lỗi khi cập nhật',
    DELETE_FAILED: 'Lỗi khi xóa',
    NETWORK_ERROR: 'Lỗi kết nối mạng'
  },
  CONFIRMATION: {
    DELETE_USER: 'Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác.'
  },
  PLACEHOLDERS: {
    SEARCH: 'Tìm kiếm theo tên thành viên...',
    NAME: 'VD: Nguyen Van A',
    EMAIL: 'email@example.com',
    PHONE: '0901234567',
    USERNAME: 'user123',
    STREET: '123 Le Loi',
    CITY: 'Hanoi',
    COMPANY: 'FPT Software',
    WEBSITE: 'example.com'
  }
};