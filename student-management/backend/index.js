const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Student = require('./Student'); // Import Model

const app = express();
const PORT = process.env.PORT || 5000; 
const DB_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/student_db'; 


app.use(cors()); 
app.use(express.json()); 

mongoose.connect(DB_URL)
    .then(() => console.log("✅ Đã kết nối MongoDB thành công"))
    .catch(err => {
        // Log lỗi và thoát nếu không kết nối được DB
        console.error("❌ Lỗi kết nối MongoDB:", err.message);
        // Trong môi trường phát triển (không phải Docker), có thể exit(1) ở đây.
        // process.exit(1); 
    });

// ----------------------------------------------------------------
// 2. CÁC ROUTES API (CRUD)
// ----------------------------------------------------------------

// [READ - Bài 1] Lấy danh sách tất cả học sinh
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find().select('-__v'); 
        res.json(students);
    } catch (err) {
        console.error("GET /api/students failed:", err.message);
        res.status(500).json({ error: "Lỗi Server nội bộ khi lấy danh sách" });
    }
});

// [CREATE - Bài 2] Thêm học sinh mới
app.post('/api/students', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.validate(); 
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (e) {
        console.error("POST /api/students failed:", e.message);
        res.status(400).json({ error: "Dữ liệu nhập vào không hợp lệ", details: e.message });
    }
});

// [UPDATE - Bài 3] Cập nhật thông tin học sinh theo ID
app.put('/api/students/:id', async (req, res) => {
    try {
        const updatedStu = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } 
        ).select('-__v');

        if (!updatedStu) {
            return res.status(404).json({ error: "Không tìm thấy học sinh để cập nhật" });
        }
        res.json(updatedStu);
    } catch (err) {
        console.error(`PUT /api/students/${req.params.id} failed:`, err.message);
        res.status(400).json({ error: "Lỗi cập nhật dữ liệu", details: err.message });
    }
});

// [DELETE - Bài 4] Xóa học sinh theo ID
app.delete('/api/students/:id', async (req, res) => {
    try {
        const deleted = await Student.findByIdAndDelete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({ error: "Không tìm thấy học sinh để xóa" });
        }
        res.json({ message: `✅ Đã xóa học sinh có ID: ${deleted._id}`, id: deleted._id });
    } catch (err) {
        console.error(`DELETE /api/students/${req.params.id} failed:`, err.message);
        res.status(500).json({ error: "Lỗi Server nội bộ khi xóa" });
    }
});


// Khởi động server
app.listen(PORT, () => {
    console.log(`🚀 Server Express đang chạy tại http://localhost:${PORT}`);
});