"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSelectedMember, isProjectPinVerified, PROJECT_ID } from "@/lib/projectAccess";

export default function AccessGuard({ children }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!isProjectPinVerified()) {
      router.replace(`/project/${PROJECT_ID}/access`);
      return;
    }
    if (!getSelectedMember()) {
      router.replace(`/project/${PROJECT_ID}/overview`);
      return;
    }
    setAllowed(true);
  }, [router]);

  if (!allowed) {
    return <div className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-500 dark:bg-zinc-950">Verifying project access…</div>;
  }

  return children;
}
