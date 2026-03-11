"use client";

import EditPagePage from "../[id]/page";

export default function NewPagePage() {
  return <EditPagePage params={Promise.resolve({ id: "new" })} />;
}
