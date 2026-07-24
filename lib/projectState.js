import { activities as initialActivities, tasks as initialTasks } from "@/data/mockData";

const taskKey = (projectId) => `aipc:${projectId}:tasks`;
const reviewKey = (projectId) => `aipc:${projectId}:document-review`;
const activityKey = (projectId) => `aipc:${projectId}:activities`;
const conversationKey = (projectId, memberId) => `aipc:${projectId}:copilot:${memberId || "shared"}`;

function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("aipc-project-state", { detail: { key } }));
  return value;
}

export function getProjectTasks(projectId) {
  const stored = read(taskKey(projectId), null);
  if (stored) return stored;
  const seeded = initialTasks.map((task, index) => ({ ...task, id: task.id || `task-${index + 1}`, updatedAt: null, completedAt: null }));
  if (typeof window !== "undefined") write(taskKey(projectId), seeded);
  return seeded;
}

export function saveProjectTasks(projectId, tasks) { return write(taskKey(projectId), tasks); }
export function getDocumentReview(projectId) { return read(reviewKey(projectId), { status: "none", conflictDecision: null, acceptedAt: null, rejectedAt: null }); }
export function saveDocumentReview(projectId, decision) { return write(reviewKey(projectId), decision); }
export function getProjectActivities(projectId) { return read(activityKey(projectId), initialActivities); }
export function saveProjectActivities(projectId, activities) { return write(activityKey(projectId), activities); }
export function getConversation(projectId, memberId) { return read(conversationKey(projectId, memberId), []); }
export function saveConversation(projectId, memberId, messages) { sessionStorage.setItem(conversationKey(projectId, memberId), JSON.stringify(messages)); return messages; }
export function getSessionConversation(projectId, memberId) {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(sessionStorage.getItem(conversationKey(projectId, memberId))) || []; } catch { return []; }
}

export function calculateProgress(tasks, assignee) {
  const scoped = assignee ? tasks.filter((task) => task.assignee === assignee) : tasks;
  const total = scoped.length;
  const completed = scoped.filter((task) => task.status === "Completed" || task.progress === 100).length;
  const progress = total ? Math.round(scoped.reduce((sum, task) => sum + Number(task.progress || 0), 0) / total) : 0;
  return { total, completed, progress };
}

function dueTimestamp(due) {
  const match = String(due).match(/^(\d{1,2})\s+([A-Za-z]{3})$/);
  if (!match) return Number.POSITIVE_INFINITY;
  const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  return new Date(2026, months[match[2]], Number(match[1]), 23, 59, 59).getTime();
}

export function generateProjectResponse(prompt, context) {
  const query = prompt.toLowerCase();
  const { tasks, member, meeting, activities, review, project } = context;
  const now = new Date(2026, 6, 24, 12).getTime();
  const unfinished = tasks.filter((task) => task.status !== "Completed" && Number(task.progress) < 100);
  const completed = tasks.filter((task) => task.status === "Completed" || Number(task.progress) === 100);
  const overdue = unfinished.filter((task) => dueTimestamp(task.due) < now);
  const closest = [...unfinished].sort((a, b) => dueTimestamp(a.due) - dueTimestamp(b.due))[0];
  const mine = tasks.filter((task) => task.assignee === member?.name);
  const unowned = tasks.filter((task) => !task.assignee || task.assignee === "Unassigned");
  const overall = calculateProgress(tasks);
  const latestActivity = activities[0]?.[0] || "No recent activity";
  const documentChange = review.status === "accepted" ? `The last document update was accepted${review.conflictDecision ? ` with “${review.conflictDecision}” for the deadline conflict` : ""}.` : review.status === "rejected" ? "The last detected document changes were rejected, so project data was not modified." : "No document changes have been accepted yet.";

  if (query.includes("assigned to me") || query.includes("my current tasks") || query.includes("my tasks")) return mine.length ? `You have ${mine.length} assigned task${mine.length === 1 ? "" : "s"}: ${mine.map((task) => `${task.title} (${task.progress}%, due ${task.due})`).join("; ")}.` : "You do not currently have any assigned tasks.";
  if (query.includes("overdue") || query.includes("who has overdue")) return overdue.length ? `Overdue work: ${overdue.map((task) => `${task.title}, assigned to ${task.assignee}, was due ${task.due}`).join("; ")}.` : "No unfinished tasks are overdue as of 24 July 2026.";
  if (query.includes("closest") || query.includes("deadline")) return closest ? `The closest unfinished deadline is ${closest.title}, due ${closest.due}, assigned to ${closest.assignee} and currently ${closest.progress}% complete.` : "There are no unfinished task deadlines.";
  if (query.includes("what changed") || query.includes("uploaded document")) return documentChange;
  if (query.includes("today") || query.includes("summarize")) return `Today, ${completed.length} of ${tasks.length} tasks are complete and overall task progress is ${overall.progress}%. Latest activity: ${latestActivity}. ${documentChange} The next meeting is ${meeting.title} on ${meeting.date} at ${meeting.time}. ${closest ? `The nearest deadline is ${closest.title} on ${closest.due}.` : "No unfinished deadlines remain."}`;
  if (query.includes("risk")) {
    const risks = [];
    if (overdue.length) risks.push(`${overdue.length} overdue task${overdue.length === 1 ? "" : "s"}`);
    if (closest && dueTimestamp(closest.due) - now < 3 * 86400000) risks.push(`${closest.title} is approaching on ${closest.due}`);
    unfinished.filter((task) => task.progress < 40).forEach((task) => risks.push(`${task.title} is only ${task.progress}% complete`));
    if (review.status === "pending" && !review.conflictDecision) risks.push("the uploaded-document deadline conflict is unresolved");
    if (unowned.length) risks.push(`${unowned.length} task${unowned.length === 1 ? "" : "s"} without an owner`);
    return risks.length ? `Risks needing attention: ${risks.join("; ")}.` : "No urgent project risks are currently detected.";
  }
  if (query.includes("next") || query.includes("work on")) {
    const candidates = member ? unfinished.filter((task) => task.assignee === member.name) : unfinished;
    const priority = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    const next = [...(candidates.length ? candidates : unfinished)].sort((a, b) => priority[a.priority] - priority[b.priority] || dueTimestamp(a.due) - dueTimestamp(b.due))[0];
    return next ? `Work on ${next.title} next. It is ${next.priority.toLowerCase()} priority, ${next.progress}% complete, and due ${next.due}. ${next.assignee === member?.name ? "It is assigned to you." : `It is assigned to ${next.assignee}.`}` : "All current tasks are complete. Review the next milestone with the project leader.";
  }
  return `${project.name} is currently ${overall.progress}% complete across ${tasks.length} tasks. ${closest ? `The nearest unfinished deadline is ${closest.title} on ${closest.due}.` : "All listed tasks are complete."} Ask me about tasks, members, progress, meetings, deadlines, uploaded documents, or risks for a more specific answer.`;
}
