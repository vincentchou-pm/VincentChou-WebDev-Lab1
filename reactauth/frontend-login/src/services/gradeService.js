import axios from "axios";

export const addGrade = async (grade, token) => {
  const response = await axios.post(
    "http://localhost:8000/api/grades/",
    grade,
    {
      headers: {
        Authorization: `Bearer ${token}`, // masukkan JWT token
      },
    }
  );
  return response.data;
};
