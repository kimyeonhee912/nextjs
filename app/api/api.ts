import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* 쿼리스트링 */
export const getTasks = async () => {
  try {
    const response = await api.get("/task?sort=latest&count=3");
    return response.data;
  } catch (error) {
    console.error("에러발생", error);
  }
};
