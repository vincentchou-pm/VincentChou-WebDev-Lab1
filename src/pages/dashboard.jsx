import { useContext } from "react";
import { AuthContext } from "../context/authContext";

export default function DashboardPage() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {user?.full_name}</h1>
      <p>Role: {user?.role}</p>
      <p>Major: {user?.major || "N/A"}</p>
      <button
        onClick={logout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
