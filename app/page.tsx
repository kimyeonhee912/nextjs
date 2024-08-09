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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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

  const handleAddTask = async (event: React.FormEvent) => {
    event.preventDefault();

    const newTaskData = {
      title: "강쥐 산책",
      description: "강쥐 30분 산책",
      isComplete: true,
    };
    const addedTask = await patchTask(newTaskData);
  };

  const handleDeleteTask = async () => {
    await deleteTask();
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>전체 데이터</h1>
      {data?.map((task: any, index: any) => (
        <div key={index}>
          {index}번째: {task.title}
        </div>
      ))}
      <div className="my-3 border border-slate-900">
        선택한 데이터는:
        {selectData?.map((data: any, index: any) => (
          <div key={index} className="ml-2">
            {index + 1}.{data.title}
          </div>
        ))}
      </div>
      <div className="my-3 border border-slate-900">
        선택한 아이디의 데이터: {selectIdData?.title}
      </div>
      <div className="flex flex-col">
        <button onClick={handleAddTask}>1번 전송</button>
        <button onClick={handleDeleteTask}>1번 삭제하기</button>
      </div>
    </div>
  );
}
