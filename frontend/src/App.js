import React from "react";
import UserList from "./UserList";
import AddUser from "./AddUser";

function App() {
  const [reload, setReload] = React.useState(false);
  const refresh = () => setReload(!reload);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Quản lý User</h1>
      <AddUser refresh={refresh} />
      <UserList key={reload} />
    </div>
  );
}

export default App;
