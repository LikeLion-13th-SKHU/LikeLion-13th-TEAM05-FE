import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUserManager } from "../lib/oidc-client";
import { loginWithIdToken, fetchMe } from "../api/auth";

// 해시/쿼리에서 파라미터 추출
function readParams() {
  const h = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const q = new URLSearchParams(window.location.search);
  return {
    id_token: h.get("id_token") || q.get("id_token"),
    state: h.get("state") || q.get("state"),
    error: h.get("error") || q.get("error"),
    error_description: h.get("error_description") || q.get("error_description"),
  };
}

// 구글 nonce 검증용 payload decode (보안 강화 용도)
function parseJwtPayload(idToken) {
  try {
    const payload = idToken.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function OidcCallback() {
  const navigate = useNavigate();
  const handledRef = useRef(false);

  useEffect(() => {
    (async () => {
      if (handledRef.current)
        return;
      handledRef.current = true;

      const provider = sessionStorage.getItem("oidc_provider") || "kakao";

      try { // 에러 파라미터 우선 확인
        const search = new URLSearchParams(window.location.search);
        const hashStr = window.location.hash.replace(/^#/, "");
        const hash = new URLSearchParams(hashStr);
        const err = search.get("error") || hash.get("error");
        const errDesc = search.get("error_description") || hash.get("error_description");
        if (err)
          throw new Error(decodeURIComponent(errDesc || err));
        if (provider === "google") {
          const { id_token, state, error, error_description } = readParams();
          if (error)
            throw new Error(decodeURIComponent(error_description || error));
          if (!id_token)
            throw new Error("Google id_token을 찾지 못했습니다.");

          const expectedState = sessionStorage.getItem("oidc_state_google") || null;
          const expectedNonce = sessionStorage.getItem("oidc_nonce_google") || null;
          if (expectedState && state && expectedState !== state) {
            throw new Error("Google state 검증 실패");
          }

          const payload = parseJwtPayload(id_token);
          if (expectedNonce && payload?.nonce && expectedNonce !== payload.nonce) {
            throw new Error("Google nonce 검증 실패");
          }
          
          await loginWithIdToken(id_token);
          const me = await fetchMe();
          console.log("구글 로그인 사용자 정보:", me);
        } else {
          const mgr = getUserManager("kakao");
          const user = await mgr.signinRedirectCallback();
          if (!user?.id_token)
            throw new Error("Kakao id_token을 받지 못했습니다.");

          await loginWithIdToken(user.id_token);
          const me = await fetchMe();
          console.log("카카오 로그인 사용자 정보:", me);
        }

        const clean = window.location.origin + window.location.pathname; // URL 정리 & 홈 이동
        window.history.replaceState(null, "", clean);
        navigate("/", { replace: true });
      } catch (e) {
        console.error("OIDC 콜백 처리 오류:", e);
        const clean = window.location.origin + window.location.pathname;
        window.history.replaceState(null, "", clean);
        navigate("/login?error=callback_failed", { replace: true });
      } finally {
        ["google", "kakao"].forEach((p) => { // 세션 정리
          ["state", "nonce", "verifier"].forEach((k) =>
            sessionStorage.removeItem(`oidc_${k}_${p}`)
          );
        });
        sessionStorage.removeItem("oidc_provider");
      }
    })();
  }, [navigate]);

  return (
    <div style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
      <div>
        <p style={{ fontSize: 18, fontWeight: 700 }}>로그인 처리 중입니다...</p>
        <p style={{ color: "#888" }}>잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}

export default OidcCallback;