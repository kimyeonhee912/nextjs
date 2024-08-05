"use client";

import { useEffect, useState } from "react";
import api from "./api/api";

export default function Page() {
  const [data, setData] = useState<any>(null);
  console.log("🚀 ~ Home ~ data:", data);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await api.get("/task");
        setData(response.data);
      } catch (error) {
        console.error("에러발생", error);
      }
    };
    getTasks();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {data.map((task: any) => (
        <div key={task.id}>{task.title}</div> // key prop 사용
      ))}
    </div>
  );
}
