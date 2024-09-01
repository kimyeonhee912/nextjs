"use client";

import React, { useState } from "react";

const ClientComponent = () => {
  const [textPost, setTextPost] = useState("");
  return (
    <div>
      <input
        placeholder="내용입력"
        value={textPost}
        onChange={(e) => setTextPost(e.target.value)}
      />
    </div>
  );
};

export default ClientComponent;
