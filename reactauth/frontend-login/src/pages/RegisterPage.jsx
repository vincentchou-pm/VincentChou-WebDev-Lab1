import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    full_name: "",
    major: "",
    password: "",
    password_confirm: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await register(form);
    navigate("");
  } catch (err) {
    console.error("❌ Register error:", err);

    // tampilkan pesan error dari backend kalau ada
    if (err.response) {
      console.log("🧾 Backend error response:", err.response.data);
      alert(JSON.stringify(err.response.data, null, 2));
    } else {
      alert("Registration failed. Please check your input or server.");
    }
  }
};

  const majors = [
    { value: "artificial_intelligence_and_robotics", label: "AIR" },
    { value: "business_mathematics", label: "BM" },
    { value: "digital_business_technology", label: "DBT" },
    { value: "product_design_innovation", label: "PDI" },
    { value: "energy_business_technology", label: "EBT" },
    { value: "food_business_technology", label: "FBT" },
  ];

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        {/* Full Name */}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 mb-3 border rounded"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          required
        />

        {/* Major Dropdown */}
        <select
          className="w-full p-2 mb-3 border rounded bg-white"
          value={form.major}
          onChange={(e) => setForm({ ...form, major: e.target.value })}
          required
        >
          <option value="">Select Major</option>
          {majors.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 mb-3 border rounded"
          value={form.password_confirm}
          onChange={(e) =>
            setForm({ ...form, password_confirm: e.target.value })
          }
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Register
        </button>
      </form>
    </div>
  );
}
