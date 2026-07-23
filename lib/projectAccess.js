export const PROJECT_ID = "csit205-genai-assignment-2";
export const DEFAULT_PROJECT_PIN = "205205";
export const ACCESS_KEY = "projectAccessVerified";
export const PROJECT_KEY = "selectedProjectId";
export const MEMBER_KEY = "selectedMember";
export const PIN_KEY = `aipc-pin-${PROJECT_ID}`;

export function getProjectPin() {
  const storedPin = localStorage.getItem(PIN_KEY);
  if (storedPin) return storedPin;

  localStorage.setItem(PIN_KEY, DEFAULT_PROJECT_PIN);
  return DEFAULT_PROJECT_PIN;
}

export function hasProjectAccess() {
  return isProjectPinVerified() && Boolean(getSelectedMember());
}

export function isProjectPinVerified() {
  return sessionStorage.getItem(ACCESS_KEY) === "true" && sessionStorage.getItem(PROJECT_KEY) === PROJECT_ID;
}

export function verifyProjectAccess(projectId = PROJECT_ID) {
  sessionStorage.setItem(ACCESS_KEY, "true");
  sessionStorage.setItem(PROJECT_KEY, projectId);
}

export function selectProjectMember(member) {
  sessionStorage.setItem(MEMBER_KEY, JSON.stringify(member));
}

export function getSelectedMember() {
  try {
    return JSON.parse(sessionStorage.getItem(MEMBER_KEY));
  } catch {
    return null;
  }
}

export function clearProjectAccess() {
  sessionStorage.removeItem(ACCESS_KEY);
  sessionStorage.removeItem(PROJECT_KEY);
  sessionStorage.removeItem(MEMBER_KEY);
}

export function canManageProjectPin(member) {
  return member?.role === "Leader" || member?.role === "Vice Leader";
}
