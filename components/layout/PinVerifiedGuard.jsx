"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { isProjectAccessVerified } from "@/lib/projectAccess";

export default function PinVerifiedGuard({ children }) {
  const router = useRouter();
  const { projectId } = useParams();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!isProjectAccessVerified(projectId)) {
      router.replace(`/project/${projectId}/access`);
      return;
    }
    setAllowed(true);
  }, [projectId, router]);

  if (!allowed) {
    return <div className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-500 dark:bg-zinc-950">Verifying project access…</div>;
  }

  return children;
}
