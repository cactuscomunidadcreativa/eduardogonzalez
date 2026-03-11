"use client";

import EditBookPage from "../[id]/page";

export default function NewBookPage() {
  return <EditBookPage params={Promise.resolve({ id: "new" })} />;
}
