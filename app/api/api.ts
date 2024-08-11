import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* 쿼리스트링 */
export const getTasksAll = async () => {
  try {
    const response = await api.get("/task");
    return response.data;
  } catch (error) {
    console.error("에러발생", error);
  }
};

/* 쿼리스트링 */
export const getTasks = async () => {
  try {
    const response = await api.get("/task?sort=latest&count=2");
    return response.data;
  } catch (error) {
    console.error("에러발생", error);
  }
};

export const getTaskId = async (id: string) => {
  try {
    const response = await api.get(`/task/${id}`);
    return response.data;
  } catch (error) {
    console.error("에러발생", error);
  }
};

export const postTask = async (data: any) => {
  try {
    const response = await api.post("/task", data);
    return response.data;
  } catch (error) {
    console.error("에러발생", error);
  }
};

export const patchTask = async (data: any) => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/task/66b773eda28e37897a862de1",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("에러발생", error);
  }
};

export const deleteTask = async () => {
  try {
    const response = await api.delete("/task/66b773eda28e37897a862de1");
  } catch (error) {
    console.error("에러발생", error);
  }
};
