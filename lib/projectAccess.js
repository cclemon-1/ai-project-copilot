export const PROJECT_ID = "csit205-genai-assignment-2";
export const DEFAULT_PROJECT_ACCESS_CODE = "A7kP2Qx";
export const ACCESS_KEY = "projectAccessVerified";
export const PROJECT_KEY = "selectedProjectId";
export const MEMBER_KEY = "selectedMember";
const ACCESS_CODE_PREFIX = "aipc-access-code-";

export function generateProjectAccessCode() {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";
  const all = upper + lower + numbers;
  const required = [upper, lower, numbers].map((set) => set[Math.floor(Math.random() * set.length)]);
  while (required.length < 7) required.push(all[Math.floor(Math.random() * all.length)]);
  return required.sort(() => Math.random() - 0.5).join("");
}

export function getProjectAccessCode(projectId = PROJECT_ID, fallbackCode = DEFAULT_PROJECT_ACCESS_CODE) {
  const key = ACCESS_CODE_PREFIX + projectId;
  const storedCode = localStorage.getItem(key);
  if (storedCode) return storedCode;
  localStorage.setItem(key, fallbackCode);
  return fallbackCode;
}

export function storePermanentProjectAccessCode(projectId, accessCode) {
  const key = ACCESS_CODE_PREFIX + projectId;
  if (!localStorage.getItem(key)) localStorage.setItem(key, accessCode);
  return localStorage.getItem(key);
}

export function hasProjectAccess() {
  return isProjectAccessVerified() && Boolean(getSelectedMember());
}

export function isProjectAccessVerified(projectId = PROJECT_ID) {
  return sessionStorage.getItem(ACCESS_KEY) === "true" && sessionStorage.getItem(PROJECT_KEY) === projectId;
}


export function verifyProjectAccess(projectId = PROJECT_ID) {
  sessionStorage.setItem(ACCESS_KEY, "true");
  sessionStorage.setItem(PROJECT_KEY, projectId);
}

export function selectProjectMember(member) {
  sessionStorage.setItem(MEMBER_KEY, JSON.stringify({ id: member.id, initials: member.initials, name: member.name, role: member.role, color: member.color }));
}

export function getSelectedMember() {
  try { return JSON.parse(sessionStorage.getItem(MEMBER_KEY)); } catch { return null; }
}

export function getProjectSession() {
  return { projectId: sessionStorage.getItem(PROJECT_KEY), accessVerified: sessionStorage.getItem(ACCESS_KEY) === "true", member: getSelectedMember() };
}

export function clearProjectAccess() {
  sessionStorage.removeItem(ACCESS_KEY);
  sessionStorage.removeItem(PROJECT_KEY);
  sessionStorage.removeItem(MEMBER_KEY);
}

const ROLE_PERMISSIONS = {
  Leader: { createTask: true, assignTask: true, manageTeam: true, editProject: true, createMeeting: true, uploadDocuments: true, joinMeeting: true, askAI: true, updateAnyTask: true },
  "Vice Leader": { createTask: true, assignTask: true, manageTeam: false, editProject: false, createMeeting: true, uploadDocuments: true, joinMeeting: true, askAI: true, updateAnyTask: true },
  Member: { createTask: false, assignTask: false, manageTeam: false, editProject: false, createMeeting: false, uploadDocuments: true, joinMeeting: true, askAI: true, updateAnyTask: false },
};
const NO_PROJECT_PERMISSIONS = Object.freeze({ createTask: false, assignTask: false, manageTeam: false, editProject: false, createMeeting: false, uploadDocuments: false, joinMeeting: false, askAI: false, updateAnyTask: false });
export function getProjectPermissions(role) { return ROLE_PERMISSIONS[role] || NO_PROJECT_PERMISSIONS; }
export function canEditProject(member) { return getProjectPermissions(member?.role).editProject; }
