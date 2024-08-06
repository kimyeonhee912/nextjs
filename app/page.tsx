"use client";

import { useEffect, useState } from "react";
import { getTasks } from "./api/api";

export default function Page() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const tasks = await getTasks();
      setData(tasks);
    };

    fetchData();
  }, []);

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
    </div>
  );
}
