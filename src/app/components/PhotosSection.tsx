"use client";

import { useState } from "react";
import UploadBox from "./UploadBox";
import LiveGallery from "./LiveGallery";

export default function PhotosSection() {
  const [k, setK] = useState(0);
  return (
    <>
      <UploadBox onDone={() => setK((x) => x + 1)} />
      <LiveGallery refreshKey={k} />
    </>
  );
}
