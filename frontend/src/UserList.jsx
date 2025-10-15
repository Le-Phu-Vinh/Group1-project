import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:3000/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Danh sách User</h2>
      <ul>
        {users.map((u, index) => (
          <li key={index}>{u.name} - {u.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
