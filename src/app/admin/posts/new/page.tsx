"use client";

import EditPostPage from "../[id]/page";

export default function NewPostPage() {
  return <EditPostPage params={Promise.resolve({ id: "new" })} />;
}
