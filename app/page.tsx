"use client";

import { useEffect, useState } from "react";
import {
  getTaskId,
  getTasks,
  getTasksAll,
  patchTask,
  postTask,
} from "./api/api";

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const tasks = await getTasksAll();
      setData(tasks);
    };

    fetchData();
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

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {data?.map((task: any) => (
        <div key={task.id}>
          {task.id}번째: {task.title}
        </div>
      ))}

      <button onClick={handleAddTask}>전송</button>
    </div>
  );
}
