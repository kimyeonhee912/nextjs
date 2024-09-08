"use client";

import axios from "axios";
import React, { useState } from "react";

const ClientComponent = () => {
  const [textPost, setTextPost] = useState("");
  const axiosPost = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/test/mysql-data",
        { content: textPost }
      );
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <input
        placeholder="내용입력"
        value={textPost}
        onChange={(e) => setTextPost(e.target.value)}
      />
      <button onClick={axiosPost}>전송</button>
    </div>
  );
};

export default ClientComponent;
