
import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { getUsers, deleteUser } from '../services/api';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await getUsers();
      setUsers(data);
    } catch (err) {
      setError('Không thể tải danh sách người dùng.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await deleteUser(id);
        setSuccess('Người dùng đã được xóa thành công.');
        fetchUsers(); // Tải lại danh sách sau khi xóa
      } catch (err) {
        setError('Có lỗi xảy ra khi xóa người dùng.');
      }
    }
  };

  return (
    <div>
      <h1>Quản lý người dùng</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Table striped bordered hover responsive className="table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Button
                  variant="danger"
                  className="btn-sm"
                  onClick={() => handleDelete(user._id)}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminPage;
