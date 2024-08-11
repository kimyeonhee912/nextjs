import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* 전체 GET 요청 */
export const getTasksAll = async () => {
  try {
    const response = await api.get("/task");
    return response.data;
  } catch (error) {
    console.error("에러발생", error);
  }
};

/* GET 요청 - 쿼리 */
export const getTasks = async () => {
  try {
    const response = await api.get("/task?sort=latest&count=2");
    return response.data;
  } catch (error) {
    console.error("에러발생", error);
  }
};

/* GET 요청 - 테스크 id로 요청 */
export const getTaskId = async (id: string) => {
  try {
    const response = await api.get(`/task/${id}`);
    return response.data;
  } catch (error) {
    console.error("에러발생", error);
  }
};

/* POST 요청 */
export const postTask = async (data: any) => {
  try {
    const response = await api.post("/task", data);
    return response.data;
  } catch (error) {
    console.error("에러발생", error);
  }
};

/* PATCH 요청 - 테스크 id로 요청 */
export const patchTask = async (taskId: string, updatedTaskData: any) => {
  try {
    const response = await fetch(`http://localhost:3000/api/task/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTaskData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("에러발생", error);
  }
};

/* DELETE 요청 - 테스크 id로 요청 */
export const deleteTask = async (taskId: string) => {
  try {
    const response = await api.delete(`/task/${taskId}`);
    console.log("삭제 성공");
  } catch (error) {
    console.error("에러발생", error);
  }
};
