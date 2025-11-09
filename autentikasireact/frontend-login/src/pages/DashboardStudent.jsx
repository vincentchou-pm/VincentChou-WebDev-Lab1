import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext.jsx";

export default function DashboardStudent() {
  const [grades, setGrades] = useState([]);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    api.get("grades/").then((res) => setGrades(res.data));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.full_name}</h1>
      <p className="mb-1">Username: {user?.username}</p>
      <p className="mb-1">Email: {user?.email}</p>
      <p className="mb-4">Role: {user?.role}</p>
      <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded mb-4">
        Logout
      </button>

      <h2 className="text-xl font-semibold mb-2">Your Grades</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Course</th>
            <th className="border p-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((g) => (
            <tr key={g.id}>
              <td className="border p-2">{g.course_name}</td>
              <td className="border p-2">{g.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
