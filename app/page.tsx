"use client";

import { useEffect } from "react";

export default function Home() {
  let size: [number, number] = [2, 7];

  useEffect(() => {
    console.log("사이즈를 어떻게 나타내는지", size.join(","));
  }, []);

  return <div>안녕 콘솔확인해봐</div>;
}

