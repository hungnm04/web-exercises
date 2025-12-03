import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Plus, Search, Trash2, Edit, Save, ArrowDownUp, X, AlertTriangle, CheckCircle, Users, GraduationCap, BookOpen, BarChart3 } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/students';

// Modern StatCard Component
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="flex items-center">
      <div className={`p-4 rounded-xl ${color}`}>
        <Icon className="h-8 w-8 text-white" />
      </div>
      <div className="ml-6">
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const App = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    _id: null,
    name: '',
    age: '',
    class: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    studentId: null,
    studentName: '',
  });

  const showMessage = (msg, isError = false, duration = 3000) => {
    setMessage({ text: msg, isError });
    setTimeout(() => setMessage(''), duration);
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_BASE_URL);
      setStudents(response.data);
      showMessage("Tải dữ liệu thành công!", false, 1500);
    } catch (error) {
      let errorMsg = "Lỗi Network (Kiểm tra Server Express và MongoDB đang chạy)";
      if (error.response) {
        errorMsg = `Lỗi Server: ${error.response.status} - ${error.response.data.error || 'Lỗi không xác định'}`;
      } else if (error.request) {
        errorMsg = "Lỗi Network: Không kết nối được tới backend (Kiểm tra CORS và Server)";
      }
      console.error("Lỗi khi fetch danh sách:", error);
      showMessage(`❌ ${errorMsg}`, true, 5000);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchStudents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? (value ? Number(value) : '') : value
    }));
  };

  const resetForm = () => {
    setFormData({
      _id: null,
      name: '',
      age: '',
      class: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const studentData = { 
        name: formData.name, 
        age: Number(formData.age), 
        class: formData.class 
    };

    try {
      if (formData._id) {
        const response = await axios.put(`${API_BASE_URL}/${formData._id}`, studentData);
        setStudents(prev => prev.map(s => s._id === formData._id ? response.data : s));
        showMessage(`✅ Cập nhật thông tin ${response.data.name} thành công!`);
      } else {
        const response = await axios.post(API_BASE_URL, studentData);
        setStudents(prev => [...prev, response.data]);
        showMessage(`✅ Thêm học sinh ${response.data.name} thành công!`);
      }
      resetForm();
    } catch (error) {
        const errorMsg = error.response?.data?.error || "Lỗi Network/Server khi thao tác.";
        console.error("Lỗi khi gửi form:", error.response?.data || error);
        showMessage(`❌ Thao tác thất bại: ${errorMsg}`, true, 5000);
    }
  };
  
  const handleEditClick = (student) => {
    setFormData({
      _id: student._id,
      name: student.name,
      age: student.age,
      class: student.class,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openConfirmModal = (id, name) => {
    setConfirmModal({
        isOpen: true,
        studentId: id,
        studentName: name,
    });
  };

  const confirmDelete = async () => {
    const id = confirmModal.studentId;
    const name = confirmModal.studentName;
    setConfirmModal({ isOpen: false, studentId: null, studentName: '' });

    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setStudents(prevList => prevList.filter(s => s._id !== id));
      showMessage(`🗑️ Đã xóa học sinh ${name} thành công!`);
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Lỗi Network/Server khi xóa.";
      console.error("Lỗi khi xóa:", error);
      showMessage(`❌ Lỗi khi xóa: ${errorMsg}`, true, 5000);
    }
  };

  const displayedStudents = useMemo(() => {
    let filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) return sortAsc ? -1 : 1;
      if (nameA > nameB) return sortAsc ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [students, searchTerm, sortAsc]);

  const toggleSort = () => setSortAsc(prev => !prev);

  const stats = {
    total: students.length,
    avgAge: students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.age, 0) / students.length) : 0,
    classes: [...new Set(students.map(s => s.class))].length
  };

  const [showAddForm, setShowAddForm] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <GraduationCap className="h-10 w-10 text-indigo-600 mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Hệ Thống Quản Lý Học Sinh</h1>
                <p className="text-sm text-gray-500">Quản lý thông tin học sinh hiệu quả</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Admin Portal</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Toast Messages */}
      {message && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg text-white flex items-center transform transition-all duration-300 ${message.isError ? 'bg-red-500' : 'bg-green-500'}`}>
          {message.isError ? <AlertTriangle className="w-5 h-5 mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
          {message.text}
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <StatCard 
            title="Tổng Học Sinh" 
            value={stats.total} 
            icon={Users} 
            color="bg-gradient-to-r from-indigo-500 to-purple-600" 
          />
          <StatCard 
            title="Tuổi Trung Bình" 
            value={`${stats.avgAge} tuổi`} 
            icon={BarChart3} 
            color="bg-gradient-to-r from-teal-500 to-green-600" 
          />
          <StatCard 
            title="Số Lớp" 
            value={stats.classes} 
            icon={BookOpen} 
            color="bg-gradient-to-r from-orange-500 to-red-600" 
          />
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-10">
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              {formData._id ? (
                <><Edit className="w-6 h-6 mr-3 text-amber-500" /> Chỉnh Sửa Thông Tin Học Sinh</>
              ) : (
                <><Plus className="w-6 h-6 mr-3 text-indigo-600" /> Thêm Học Sinh Mới</>
              )}
            </h2>
            {!formData._id && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 flex items-center"
              >
                {showAddForm ? 'Ẩn Form' : 'Hiện Form'}
                <X className={`w-4 h-4 ml-2 transform transition-transform ${showAddForm ? 'rotate-0' : 'rotate-45'}`} />
              </button>
            )}
          </div>
          {(showAddForm || formData._id) && <div className="p-8">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Họ và tên *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400 text-gray-900"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Tuổi *</label>
                <input
                  type="number"
                  name="age"
                  placeholder="Từ 16-25 tuổi"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  min="16"
                  max="100"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400 text-gray-900"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Lớp học *</label>
                <input
                  type="text"
                  name="class"
                  placeholder="Ví dụ: CNTT-K65-01"
                  value={formData.class}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400 text-gray-900"
                />
              </div>

              <div className="flex items-end space-x-3">
                <button
                  type="submit"
                  className={`flex-1 h-14 rounded-xl text-white font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center ${
                    formData._id ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700' : 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700'
                  }`}
                >
                  {formData._id ? <><Save className="w-5 h-5 mr-2" /> Cập nhật</> : <><Plus className="w-5 h-5 mr-2" /> Thêm mới</>}
                </button>
                {formData._id && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="h-14 w-14 rounded-xl bg-gray-500 text-white hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>
          </div>}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-10">
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Users className="w-6 h-6 mr-3 text-indigo-600" />
                Danh Sách Học Sinh
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {displayedStudents.length} / {students.length} học sinh
              </span>
            </div>
          </div>
          <div className="p-8">
            <div className="flex flex-col sm:flex-row gap-6 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên học sinh..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400 text-gray-900"
                />
              </div>

            </div>

            {/* Table */}
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto"></div>
                <p className="mt-6 text-gray-500 text-lg">Đang tải dữ liệu...</p>
              </div>
            ) : displayedStudents.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <p className="text-gray-500 text-lg">
                  {searchTerm ? 'Không tìm thấy học sinh nào phù hợp với tìm kiếm' : 'Chưa có học sinh nào. Hãy thêm mới!'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-4 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full border-separate border-spacing-y-2">
                  <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    <tr>
                      <th 
                        onClick={toggleSort}
                        className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-indigo-100 transition-colors rounded-l-xl flex items-center"
                      >
                        Họ và tên
                        <ArrowDownUp className="w-4 h-4 ml-2 text-indigo-500" />
                        <span className="ml-1 text-indigo-600 text-xs">({sortAsc ? 'A→Z' : 'Z→A'})</span>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Tuổi
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Lớp học
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider rounded-r-xl">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {displayedStudents.map((student, index) => (
                      <tr 
                        key={student._id} 
                        className="bg-white hover:bg-indigo-50 transition-all duration-200 hover:shadow-sm rounded-xl"
                      >
                        <td className="px-6 py-5 whitespace-nowrap rounded-l-xl">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                <span className="text-lg font-bold text-white">
                                  {student.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-base font-semibold text-gray-900">{student.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-base font-medium text-gray-700">
                            {student.age} tuổi
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-base font-medium text-gray-700">
                            {student.class}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium rounded-r-xl">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEditClick(student)}
                              className="w-10 h-10 inline-flex items-center justify-center rounded-xl text-amber-600 bg-amber-50 hover:bg-amber-100 transition-all duration-200 transform hover:scale-110"
                              title="Sửa thông tin"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => openConfirmModal(student._id, student.name)}
                              className="w-10 h-10 inline-flex items-center justify-center rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200 transform hover:scale-110"
                              title="Xóa học sinh"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0 p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-gray-900">Xác nhận xóa học sinh</h3>
                <p className="text-sm text-gray-500 mt-1">Hành động này không thể hoàn tác</p>
              </div>
            </div>
            <div className="mb-8">
              <p className="text-gray-700 text-base leading-relaxed">
                Bạn có chắc chắn muốn xóa học sinh <span className="font-bold text-gray-900">{confirmModal.studentName}</span> khỏi hệ thống không?
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setConfirmModal({ isOpen: false, studentId: null, studentName: '' })}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold flex items-center transform hover:scale-105"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;