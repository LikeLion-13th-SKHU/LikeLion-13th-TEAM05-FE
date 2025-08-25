import { api } from "./client";

export function saveTokens({ accessToken, refreshToken }) {
  if (accessToken)
    localStorage.setItem("accessToken", accessToken);
  if (refreshToken)
    localStorage.setItem("refreshToken", refreshToken);
}

export async function loginWithIdToken(idToken) {
  const res = await api.post(
    "/auth/login",
    {},
    { headers: { id_token: idToken } }
  );
  const { accessToken, refreshToken } = res.data?.data ?? {};
  saveTokens({ accessToken, refreshToken });
  return { accessToken, refreshToken };
}

export async function fetchMe() {
  const { data } = await api.get("/auth/me");
  return data?.data;
}

export function clearTokens() { // 로그아웃
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  try {
    delete api.defaults.headers.common.Authorization;
  } catch {}
}