import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export default function DashboardInstructor() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.full_name}</h1>
      <p>Role: Instructor</p>
      <button onClick={logout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
}
