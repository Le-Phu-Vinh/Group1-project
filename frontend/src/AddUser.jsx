import React, { useState } from "react";
import axios from "axios";

function AddUser({ refresh }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Tên không được để trống!");
    if (!/\S+@\S+\.\S+/.test(email)) return alert("Email không hợp lệ!");
    await axios.post("http://localhost:3000/users", { name, email });
    setName("");
    setEmail("");
    refresh();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Thêm User</h3>
      <input
        type="text"
        placeholder="Tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Thêm</button>
    </form>
  );
}

export default AddUser;
