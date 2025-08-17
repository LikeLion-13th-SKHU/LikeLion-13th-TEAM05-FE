// import { api } from "./client";

// export async function loginWithIdToken(idToken) {
//     const { data } = await api.post(
//         "/auth/login",
//         {},
//         { headers: { id_token: idToken } }
//     );

//     const { accessToken, refreshToken } = data?.data ?? {};
//     if (accessToken) localStorage.setItem("accessToken", accessToken);
//     if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

//     return { accessToken, refreshToken };

// }

// export async function fetchMe() {
//     const { data } = await api.get("/auth/me");
//     return data?.data;
// }