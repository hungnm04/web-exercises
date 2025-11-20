import React, { useState, useEffect } from 'react';
import { Plus, Edit2, X, Loader2, User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';

const UserModal = ({ isOpen, onClose, onSubmit, initialData, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', username: '', website: '',
    street: '', city: '', companyName: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          email: initialData.email || '',
          phone: initialData.phone || '',
          username: initialData.username || '',
          website: initialData.website || '',
          street: initialData.address?.street || '',
          city: initialData.address?.city || '',
          companyName: initialData.company?.name || ''
        });
      } else {
        setFormData({
          name: '', email: '', phone: '', username: '', website: '',
          street: '', city: '', companyName: ''
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">
            {initialData ? <Edit2 className="w-5 h-5"/> : <Plus className="w-5 h-5"/>}
            {initialData ? 'Cập Nhật Thông Tin' : 'Thêm Người Dùng Mới'}
          </h2>
          <button onClick={onClose} className="modal-close-button">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="modal-body">
          <form id="userForm" onSubmit={handleSubmit} className="space-y-8">
            <div className="form-section">
              <h3 className="form-section-title">
                <User className="w-4 h-4" /> Thông tin cơ bản
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Họ và Tên <span className="text-red-500">*</span></label>
                  <input type="text" required className="form-input"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="VD: Nguyen Van A" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email <span className="text-red-500">*</span></label>
                  <input type="email" required className="form-input"
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@example.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Số Điện Thoại <span className="text-red-500">*</span></label>
                  <input type="text" required className="form-input"
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="0901234567" />
                </div>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input type="text" className="form-input"
                    value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="user123" />
                </div>
              </div>
            </div>

            <div className="form-section-grid">
              <div>
                <h3 className="form-section-title">
                  <MapPin className="w-4 h-4" /> Địa Chỉ
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Đường / Phố</label>
                    <input type="text" className="form-input"
                      value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} placeholder="123 Le Loi" />
                  </div>
                  <div>
                    <label className="form-label">Thành Phố</label>
                    <input type="text" className="form-input"
                      value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="Hanoi" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="form-section-title">
                  <Briefcase className="w-4 h-4" /> Công Việc
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Tên Công Ty</label>
                    <input type="text" className="form-input"
                      value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="FPT Software" />
                  </div>
                  <div>
                    <label className="form-label">Website</label>
                    <input type="text" className="form-input"
                      value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} placeholder="example.com" />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="secondary-button">
            Hủy bỏ
          </button>
          <button type="submit" form="userForm" disabled={isSubmitting} className="submit-button">
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {initialData ? 'Lưu Thay Đổi' : 'Tạo Mới'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;