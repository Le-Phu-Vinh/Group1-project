import { useState, useEffect } from 'react';

function UserForm({ onSubmit, currentUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // (Hoạt động 8) Sử dụng useEffect để tự động điền form khi bấm nút "Sửa"
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
    } else {
      // Nếu không phải là sửa (thêm mới) thì reset form
      setName('');
      setEmail('');
    }
  }, [currentUser]); // Chạy lại khi currentUser thay đổi

  // (Hoạt động 8: Validation)
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Xóa lỗi cũ

    // Validation cơ bản
    if (!name.trim()) {
      setError("Tên không được để trống");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email không hợp lệ");
      return;
    }

    // Gửi dữ liệu lên component cha (App.js)
    onSubmit({ name, email });

    // Reset form chỉ khi thêm mới
    if (!currentUser) {
      setName('');
      setEmail('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <h3>{currentUser ? 'Sửa Người Dùng' : 'Thêm Người Dùng Mới'}</h3>
      {error && <p className="error">{error}</p>}
      <div className="form-group">
        <label>Tên:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên"
        />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email"
        />
      </div>
      <button type="submit">{currentUser ? 'Cập nhật' : 'Thêm'}</button>
      {/* Nếu đang sửa, có thể thêm nút Hủy */}
      {currentUser && (
        <button type="button" onClick={() => onSubmit(null)}>Hủy</button>
      )}
    </form>
  );
}

export default UserForm;