export const PROJECT_ID = "csit205-genai-assignment-2";
export const DEFAULT_PROJECT_PIN = "205205";
export const ACCESS_KEY = "projectAccessVerified";
export const PROJECT_KEY = "selectedProjectId";
export const MEMBER_KEY = "selectedMember";
export const PIN_KEY = `aipc-pin-${PROJECT_ID}`;

export function getProjectPinKey(projectId = PROJECT_ID) {
  return `aipc-pin-${projectId}`;
}

export function getProjectPin(projectId = PROJECT_ID) {
  const pinKey = getProjectPinKey(projectId);
  const storedPin = localStorage.getItem(pinKey);
  if (storedPin) return storedPin;

  localStorage.setItem(pinKey, DEFAULT_PROJECT_PIN);
  return DEFAULT_PROJECT_PIN;
}

export function hasProjectAccess() {
  return isProjectPinVerified() && Boolean(getSelectedMember());
}

export function isProjectPinVerified(projectId = PROJECT_ID) {
  return sessionStorage.getItem(ACCESS_KEY) === "true" && sessionStorage.getItem(PROJECT_KEY) === projectId;
}

export function verifyProjectAccess(projectId = PROJECT_ID) {
  sessionStorage.setItem(ACCESS_KEY, "true");
  sessionStorage.setItem(PROJECT_KEY, projectId);
}

export function selectProjectMember(member) {
  sessionStorage.setItem(MEMBER_KEY, JSON.stringify({
    id: member.id,
    initials: member.initials,
    name: member.name,
    role: member.role,
    color: member.color,
  }));
}

export function getSelectedMember() {
  try {
    return JSON.parse(sessionStorage.getItem(MEMBER_KEY));
  } catch {
    return null;
  }
}

export function getProjectSession() {
  return {
    projectId: sessionStorage.getItem(PROJECT_KEY),
    accessVerified: sessionStorage.getItem(ACCESS_KEY) === "true",
    member: getSelectedMember(),
  };
}

export function clearProjectAccess() {
  sessionStorage.removeItem(ACCESS_KEY);
  sessionStorage.removeItem(PROJECT_KEY);
  sessionStorage.removeItem(MEMBER_KEY);
}

export function canManageProjectPin(member) {
  return member?.role === "Leader" || member?.role === "Vice Leader";
}
