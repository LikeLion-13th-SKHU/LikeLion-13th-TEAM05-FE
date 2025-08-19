import { useEffect, useState } from "react";
import { loginWithIdToken, fetchMe } from "../api/auth";
import { useNavigate } from "react-router-dom";

function KakaoCallback() {
    const [msg, setMsg] = useState("카카오 로그인 처리중");
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const hash = window.location.hash.replace(/^#/, "");
                const queryString = new URLSearchParams(hash);
                const idToken = queryString.get("id_token");
                if (!idToken) throw new Error("id_token을 찾지 못했습니다.");

                await loginWithIdToken(idToken);
                const my = await fetchMe();
                console.log("My", my);

                setMsg("로그인 완료했습니다! 잠시 후 이동합니다.");
                setTimeout(() => navigate("/"), 1500);
            } catch (e) {
                setMsg(e?.message || "카카오 로그인 실패");
            }
        })();
    }, [navigate]);

    return <div style={{ padding: 24 }}>{msg}</div>
}

export default KakaoCallback;