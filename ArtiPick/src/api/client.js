import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // 쿠키/인증정보 보낸다는 뜻임. 만약 쿠키 안 쓰면 false
});

api.interceptors.request.use((config) => { // 요청에 따른 토큰을 헤더에 첨부
    const access = localStorage.getItem("accessToken");
    if (access)
        config.headers.Authorization = `Bearer ${access}`;
    return config;
})

api.interceptors.response.use( // 401 오류나면 재발급 하는 과정
    (response) => response,
    async (error) => {
        const original = error.config;
        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;
            try {
                const access = localStorage.getItem("accessToken") ?? "";
                const refresh = localStorage.getItem("refreshToken") ?? "";
                const res = await api.post(
                    "/auth/reissue",
                    {}, // 오류날 것 같으니 땜빵
                    {
                        headers: {
                            Authorization: `Bearer ${access}`,
                            RefreshToken: refresh,
                        },
                    }
                );
                const { accessToken, refreshToken } = res.data?.data ?? {};
                if (accessToken)
                    localStorage.setItem("accessToken", accessToken);
                if (refreshToken)
                    localStorage.setItem("refreshToken", refreshToken);
                original.headers.Authorization = `Bearer ${accessToken}`;
                return api(original);
            } catch {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }
        }
        return Promise.reject(error); // 또 에러가 발생하면 try catch로 돌려보내는 코드
    }
);