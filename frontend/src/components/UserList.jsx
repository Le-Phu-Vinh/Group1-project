function UserList({ users, onEdit, onDelete }) {
  return (
    <div className="user-list">
      <h3>Danh sách Người Dùng</h3>
      <table>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user._id}> {/* Giả sử MongoDB trả về _id */}
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {/* (Hoạt động 7) Nút Sửa/Xóa */}
                  <button className="btn-edit" onClick={() => onEdit(user)}>Sửa</button>
                  <button className="btn-delete" onClick={() => onDelete(user._id)}>Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">Không có người dùng nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;