"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/index.html");
  }, [router]);

  return (
    <div className="page-shell">
      <div className="page-intro">
        <p className="section-kicker">Admin panel</p>
        <h1>Opening the editor…</h1>
      </div>
    </div>
  );
}
