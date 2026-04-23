
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export const syncUserApi = async ({ lineUserId, displayName }) => {
  const res = await fetch(`${API_BASE}/api/users/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lineUserId, displayName }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const bindStudentIdApi = async ({ lineUserId, studentId }) => {
  const res = await fetch(`${API_BASE}/api/users/bind-student-id`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lineUserId, studentId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const getMeApi = async (lineUserId) => {
  const res = await fetch(`${API_BASE}/api/users/me/${lineUserId}`);
  return res.json();
};

export const getHistory = async (lineUserId) => {
  const res = await fetch(`${API_BASE}/api/attendance/history/${lineUserId}`);
  return res.json();
};

export const clockInApi = async (lineUserId, locationIn) => {
  const res = await fetch(`${API_BASE}/api/attendance/clock-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lineUserId,
      location_in: locationIn,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const clockOutApi = async (lineUserId, locationOut) => {
  const res = await fetch(`${API_BASE}/api/attendance/clock-out`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lineUserId,
      location_out: locationOut,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const submitReportApi = async (logId, detail) => {
  const res = await fetch(`${API_BASE}/api/work-reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      log_id: logId,
      detail,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};