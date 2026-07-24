"use client";

import { useState } from "react";
import Link from "next/link";
import AppHeader from "@/components/layout/AppHeader";
import Modal from "@/components/ui/Modal";
import { createProjectRecord, project } from "@/data/mockData";
import { generateProjectAccessCode, storePermanentProjectAccessCode } from "@/lib/projectAccess";

export default function WorkspacePage() {
  const [creating, setCreating] = useState(false);
  const [createdProject, setCreatedProject] = useState(null);

  function createProject(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const leaderName = form.get("leaderName")?.trim();
    const accessCode = generateProjectAccessCode();
    const record = createProjectRecord({ id: "project-" + Date.now(), name: form.get("projectName"), description: form.get("description"), accessCode, members: [{ id: "leader-" + Date.now(), name: leaderName, role: "Leader", initials: leaderName.slice(0,2).toUpperCase(), color: "bg-blue-600" }] });
    storePermanentProjectAccessCode(record.id, accessCode);
    setCreating(false);
    setCreatedProject(record);
  }

  return <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 dark:text-white"><AppHeader />
    <main className="mx-auto max-w-6xl px-5 py-12"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><span className="text-xs text-slate-500">AI Project Copilot / Workspace</span><h1 className="mt-2 text-3xl font-bold tracking-tight">Workspace</h1><p className="mt-1 text-sm text-slate-500">One active project · Updated today</p></div><input aria-label="Search projects" placeholder="Search projects..." className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:bg-zinc-900" /></div>
      <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_.7fr]"><article role="button" tabIndex="0" onClick={()=>window.location.assign("/project/"+project.id+"/access")} className="cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-900"><div className="relative h-40 bg-gradient-to-br from-blue-950 via-blue-700 to-blue-400 p-5 text-white"><span className="rounded-full bg-white/15 px-3 py-1 text-xs">● On Track</span><span className="absolute bottom-5 left-6 grid size-14 place-items-center rounded-2xl border border-white/20 bg-white/15 text-2xl">✦</span></div><div className="p-6"><span className="text-xs font-bold tracking-wider text-blue-600">CSIT205 · GENERATIVE AI</span><h2 className="mt-2 text-xl font-semibold">{project.name}</h2><p className="mt-2 text-sm leading-6 text-slate-500">Develop and evaluate a generative AI solution through research, prototyping, and a collaborative final report.</p><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-white/10"><div className="flex -space-x-2">{project.members.slice(0,4).map(member=><span key={member.id} className={"grid size-8 place-items-center rounded-full border-2 border-white text-[9px] font-bold text-white dark:border-zinc-900 "+member.color}>{member.initials}</span>)}</div><Link onClick={event=>event.stopPropagation()} href={"/project/"+project.id+"/access"} className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white">Open Project →</Link></div></div></article>
        <button onClick={()=>setCreating(true)} className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-blue-300 bg-blue-50/40 p-8 text-center dark:border-blue-500/30 dark:bg-blue-500/5"><span className="grid size-14 place-items-center rounded-2xl border border-blue-200 bg-white text-3xl text-blue-600 dark:bg-zinc-900">+</span><h2 className="mt-5 text-lg font-semibold">Create New Project</h2><p className="mt-1 text-sm text-slate-500">Create another collaborative AI workspace.</p></button></div>
    </main>
    {creating&&<Modal title="Create a project" description="The access code will be generated automatically." onClose={()=>setCreating(false)}><form onSubmit={createProject} className="space-y-4 p-6"><label className="block text-sm font-medium">Project Name<input name="projectName" required className="mt-2 w-full rounded-lg border border-slate-200 bg-transparent p-3 dark:border-white/10" /></label><label className="block text-sm font-medium">Description<textarea name="description" rows="3" className="mt-2 w-full rounded-lg border border-slate-200 bg-transparent p-3 dark:border-white/10" /></label><label className="block text-sm font-medium">Project Leader<input name="leaderName" required className="mt-2 w-full rounded-lg border border-slate-200 bg-transparent p-3 dark:border-white/10" /></label><div className="flex justify-end gap-2"><button type="button" onClick={()=>setCreating(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm dark:border-white/10">Cancel</button><button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Create Project</button></div></form></Modal>}
    {createdProject&&<Modal title="Project Created" description="Your project is ready." onClose={()=>setCreatedProject(null)}><div className="p-6"><span className="text-xs font-semibold text-slate-500">Project Access Code</span><div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xl font-bold tracking-[.3em] dark:border-white/10 dark:bg-zinc-950">{createdProject.accessCode}</div><p className="mt-4 text-sm text-slate-500">This access code was automatically generated.</p><p className="mt-2 text-sm text-slate-500">Share this code with your teammates so they can join this project.</p><div className="mt-6 flex flex-wrap justify-end gap-2"><button onClick={()=>navigator.clipboard?.writeText(createdProject.accessCode)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm dark:border-white/10">Copy Code</button><button onClick={()=>window.location.assign("/project/"+project.id+"/overview")} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Open Project Overview</button></div></div></Modal>}
  </div>;
}
