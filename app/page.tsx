"use client";

import { useEffect, useState } from "react";
import {
  deleteTask,
  getTaskId,
  getTasks,
  getTasksAll,
  patchTask,
  postTask,
} from "./api/api";

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [selectData, setSelectData] = useState<any>(null);
  const [selectIdData, setSelectIdData] = useState<any>(null);

  // 추가 폼 상태
  const [addTitle, setAddTitle] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [addSelectedComplete, setAddSelectedComplete] = useState("false");

  // 수정 폼 상태
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editSelectedComplete, setEditSelectedComplete] = useState("false");
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const tasks = await getTasksAll();
      setData(tasks);
    };
    const fetchSelectData = async () => {
      const selectTask = await getTasks();
      setSelectData(selectTask);
    };
    const fetchSelectIdData = async (id: string) => {
      const selectIdTask = await getTaskId(id);
      setSelectIdData(selectIdTask);
    };

    fetchData();
    fetchSelectData();
    fetchSelectIdData("66b62b6c7ad3739ee2cd82ee");
  }, []);

  /* 추가 핸들러 */
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const newTaskData = {
      title: addTitle,
      description: addDescription,
      isComplete: addSelectedComplete,
    };
    await postTask(newTaskData);
  };

  /* 수정 핸들러  */
  const handleEditClick = (taskId: string) => {
    if (currentTaskId === taskId) {
      setIsEditing((prev) => !prev);
    } else {
      setCurrentTaskId(taskId);
      const taskToEdit = data?.find((task: any) => task._id === taskId);
      if (taskToEdit) {
        setEditTitle(taskToEdit.title);
        setEditDescription(taskToEdit.description);
        setEditSelectedComplete(taskToEdit.isComplete ? "true" : "false");
        setIsEditing(true);
      }
    }
  };

  const handleUpdateTask = async (event: React.FormEvent) => {
    event.preventDefault();
    if (currentTaskId) {
      const updatedTaskData = {
        title: editTitle,
        description: editDescription,
        isComplete: editSelectedComplete,
      };
      console.log("🚀 ~ handleUpdateTask ~ updatedTaskData:", updatedTaskData);
      await patchTask(currentTaskId, updatedTaskData);
      setCurrentTaskId("");
      setIsEditing(false);
    }
  };

  /* 삭제 핸들러 */
  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>전체 데이터</h1>
      {data?.map((task: any, index: any) => (
        <div className="flex">
          <div key={index}>
            {index}번째: {task.title} - {task.description}
          </div>
          <div className="flex">
            <button
              onClick={() => handleEditClick(task._id)}
              className="ml-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition duration-200"
            >
              수정
            </button>
            <button
              onClick={() => handleDeleteTask(task._id)}
              className="ml-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition duration-200"
            >
              삭제
            </button>
          </div>
        </div>
      ))}
      {isEditing && (
        <form
          onSubmit={handleUpdateTask}
          className="flex flex-col border border-slate-800 p-4 mt-4"
        >
          <h2 className="text-center">☑️할일 수정하기☑️</h2>
          <div className="flex m-2">
            <label>제목:</label>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="제목입력"
              className="border ml-2"
            />
          </div>
          <div className="flex m-2">
            <label>내용:</label>
            <input
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="내용입력"
              className="border ml-2"
            />
          </div>
          <div className="flex m-2">
            <p className="mr-2">성공여부</p>
            <label className="mr-2">
              <input
                type="radio"
                name="isComplete"
                value="true"
                checked={editSelectedComplete === "true"}
                onChange={(e) => setEditSelectedComplete(e.target.value)}
              />
              완료
            </label>
            <label>
              <input
                type="radio"
                name="isComplete"
                value="false"
                checked={editSelectedComplete === "false"}
                onChange={(e) => setEditSelectedComplete(e.target.value)}
              />
              미완료
            </label>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition duration-200"
          >
            수정 완료
          </button>
        </form>
      )}
      <div className="my-3 border border-slate-900">
        선택한 데이터는:
        {selectData?.map((data: any, index: any) => (
          <div key={index} className="ml-2">
            {index + 1}.{data.title} - {data.description}
          </div>
        ))}
      </div>
      <div className="my-3 border border-slate-900">
        선택한 아이디의 데이터: {selectIdData?.title} -{" "}
        {selectIdData?.description}
      </div>
      <form
        id="taskForm"
        onSubmit={handleSubmit}
        className="flex flex-col border border-slate-800"
      >
        <h2 className="text-center">☑️할일 추가하기☑️</h2>
        <div className="flex m-2">
          <label>제목:</label>
          <input
            placeholder="제목입력"
            className="border ml-2"
            value={addTitle}
            onChange={(e) => setAddTitle(e.target.value)}
          />
        </div>
        <div className="flex m-2">
          <label>내용:</label>
          <input
            placeholder="내용입력"
            className="border ml-2"
            value={addDescription}
            onChange={(e) => setAddDescription(e.target.value)}
          />
        </div>
        <div className="flex m-2">
          <p className="mr-2">성공여부</p>
          <label className="mr-2">
            <input
              type="radio"
              name="isComplete"
              value="true"
              checked={addSelectedComplete === "true"}
              onChange={(e) => setAddSelectedComplete(e.target.value)}
            />
            완료
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="isComplete"
              value="false"
              checked={addSelectedComplete === "false"}
              onChange={(e) => setAddSelectedComplete(e.target.value)}
            />
            미완료
          </label>
          <br />
        </div>
        <button type="submit">추가하기</button>
      </form>
    </div>
  );
}
