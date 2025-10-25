import { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import './App.css';

// Đặt base URL cho API
const API_URL = 'http://localhost:3000/users'; // Thay 3000 bằng port của backend nếu khác

function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // State để biết đang sửa user nào

  // (Hoạt động 8) Sử dụng useEffect để tải danh sách user khi component được render
  useEffect(() => {
    fetchUsers();
  }, []);

  // Hàm tải danh sách user
  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách user:", error);
    }
  };

  // Hàm xử lý khi submit form (Thêm mới hoặc Cập nhật)
  const handleFormSubmit = async (user) => {
    if (editingUser) {
      // --- (Hoạt động 7: PUT - Cập nhật) ---
      try {
        await axios.put(`${API_URL}/${editingUser._id}`, user); // Giả sử backend dùng _id
        setEditingUser(null); // Xóa trạng thái đang sửa
      } catch (error) {
        console.error("Lỗi khi cập nhật user:", error);
      }
    } else {
      // --- (Hoạt động 4: POST - Thêm mới) ---
      try {
        await axios.post(API_URL, user);
      } catch (error) {
        console.error("Lỗi khi thêm user:", error);
      }
    }
    fetchUsers(); // Tải lại danh sách user sau khi thêm/sửa
  };

  // Hàm xử lý khi bấm nút "Sửa"
  const handleEdit = (user) => {
    setEditingUser(user);
  };

  // --- (Hoạt động 7: DELETE - Xóa) ---
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa user này?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchUsers(); // Tải lại danh sách
      } catch (error) {
        console.error("Lỗi khi xóa user:", error);
      }
    }
  };

  return (
    <div className="App">
      <h1>Quản lý Người dùng (MERN Stack)</h1>
      
      {/* (Hoạt động 8) Form thêm/sửa user */}
      <UserForm 
        onSubmit={handleFormSubmit} 
        currentUser={editingUser} 
      />
      
      {/* (Hoạt động 4 & 7) Danh sách user */}
      <UserList 
        users={users} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />
    </div>
  );
}

export default App;