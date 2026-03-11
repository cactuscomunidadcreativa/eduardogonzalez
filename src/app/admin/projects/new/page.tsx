"use client";

import EditProjectPage from "../[id]/page";

export default function NewProjectPage() {
  return <EditProjectPage params={Promise.resolve({ id: "new" })} />;
}
