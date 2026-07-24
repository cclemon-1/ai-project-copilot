"use client";

import { useState } from "react";
import ProjectShell from "@/components/layout/ProjectShell";

const sections = ["General", "Appearance", "Knowledge Base", "AI Settings", "Notifications", "Future Integrations"];

export default function SettingsPage() {
  const [active, setActive] = useState("General");
  return <ProjectShell><main className="mx-auto max-w-5xl p-5 md:p-8"><h1 className="text-2xl font-bold">Project Settings</h1><p className="mt-1 text-sm text-slate-500">Manage project behavior, knowledge, and notifications.</p><div className="mt-8 grid gap-8 md:grid-cols-[190px_1fr]"><nav className="flex gap-2 overflow-auto md:flex-col">{sections.map(section=><button key={section} onClick={()=>setActive(section)} className={"whitespace-nowrap rounded-lg px-3 py-2 text-left text-xs "+(active===section?"bg-blue-50 font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300":"text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5")}>{section}</button>)}</nav><section><span className="text-xs font-bold tracking-widest text-blue-600">{active.toUpperCase()}</span><h2 className="mt-2 text-xl font-semibold">{active}</h2><div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-white/10 dark:bg-zinc-900"><b className="text-sm">{active} settings</b><p className="mt-1 text-xs text-slate-500">This prototype keeps the setting local until a backend is connected.</p></div></section></div></main></ProjectShell>;
}
