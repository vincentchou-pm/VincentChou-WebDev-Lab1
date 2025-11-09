import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import axios from "axios";

export default function DashboardInstructor() {
  const { user, logout } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    student: "",
    course_name: "",
    score: "",
    semester: "",
  });

  // Ambil daftar student
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("http://localhost:8000/api/users/?role=student", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudents(res.data);
      } catch (err) {
        console.error("❌ Error fetching students:", err);
      }
    };
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        "http://localhost:8000/api/grades/",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Grade added successfully!");
      setForm({ student: "", course_name: "", score: "", semester: "" });
    } catch (err) {
      console.error("❌ Error adding grade:", err);
      alert("Failed to add grade. Check console for details.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.full_name}</h1>
      <p className="mb-1">Username: {user?.username}</p>
      <p className="mb-1">Email: {user?.email}</p>
      <p className="mb-4">Role: {user?.role}</p>
      <button onClick={logout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
        Logout
      </button>

      <hr className="my-6" />

      <h2 className="text-xl font-bold mb-2">Add Grade</h2>
      <form onSubmit={handleSubmit} className="max-w-md">
        <label className="block mb-2">
          Student:
          <select
            className="w-full p-2 mb-3 border rounded"
            value={form.student}
            onChange={(e) => setForm({ ...form, student: e.target.value })}
            required
          >
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name} ({s.email})
              </option>
            ))}
          </select>
        </label>

        <label className="block mb-2">
          Course Name:
          <input
            type="text"
            className="w-full p-2 mb-3 border rounded"
            value={form.course_name}
            onChange={(e) => setForm({ ...form, course_name: e.target.value })}
            required
          />
        </label>

        <label className="block mb-2">
          Score:
          <input
            type="number"
            className="w-full p-2 mb-3 border rounded"
            value={form.score}
            onChange={(e) => setForm({ ...form, score: e.target.value })}
            required
          />
        </label>

        <label className="block mb-2">
          Semester:
          <input
            type="number"
            className="w-full p-2 mb-3 border rounded"
            value={form.semester}
            onChange={(e) => setForm({ ...form, semester: e.target.value })}
            required
          />
        </label>

        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Add Grade
        </button>
      </form>
    </div>
  );
}
