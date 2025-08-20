import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import GoogleLogo from "../assets/GoogleLogo.png";
import KakaoLogo from "../assets/KakaoLogo.png";
import { getUserManager } from "../lib/oidc-client";

const Container = styled.div`
  align-self: stretch;
  width: 480px;
  padding: 24px 20px 40px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 44px;
  font-weight: 900;
  line-height: 1.1;
  padding-left: 10px;
  margin: 24px 0 12px;
`;

const Subtitle = styled.p`
  font-size: 18px;
  line-height: 1.45;
  color: #333;
  padding-left: 10px;
  margin-bottom: 26px;
`;

const Tooltip = styled.div`
  width: 200px;
  background-color: #fff;
  padding: 12px 16px;
  margin: 4px auto 18px;
  text-align: center;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
`;

const Btn = styled.button`
  width: 400px;
  height: 56px;
  font-size: 18px;
  font-weight: 800;
  margin: 0 auto;
  border: 0;
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  &:focus-visible { outline: 3px solid rgba(0,0,0,0.2); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
  img { width: 24px; height: 24px; object-fit: contain; }
`;

const KakaoButton = styled(Btn)`
  background-color: #FEE500;
  color: #111;
`;

const GoogleButton = styled(Btn)`
  background: #fff;
  color: #111;
  border: 2px solid #111;
  margin-top: 14px;
`;

function Login() {
  const [loading, setLoading] = useState(false);
  const clickedRef = useRef(false);

  const startKakao = useCallback(async () => { // 카카오 -> oidc-client 리디렉션 방식
    if (clickedRef.current)
      return;
    clickedRef.current = true;
    setLoading(true);

    try {
      sessionStorage.setItem("oidc_provider", "kakao"); // 콜백에서 어떤 프로바이더인지 확인하는 용도
      const mgr = getUserManager("kakao");
      await mgr.signinRedirect(); // 카카오 권한 페이지로 이동
    } catch (e) {
      console.error("카카오 로그인 시작 실패:", e);
      alert(e?.message || "카카오 로그인을 시작할 수 없습니다.");
      clickedRef.current = false;
      setLoading(false);
    }
  }, []);

  const startGoogle = useCallback(() => {
    if (clickedRef.current)
      return;
    clickedRef.current = true;
    setLoading(true);

    try {
      sessionStorage.setItem("oidc_provider", "google");
      const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      const OIDC_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI || import.meta.env.VITE_OIDC_REDIRECT_URI;
      const state = Math.random().toString(36).slice(2);
      const nonce = Math.random().toString(36).slice(2);
      sessionStorage.setItem(`oidc_state_google`, state);
      sessionStorage.setItem(`oidc_nonce_google`, nonce);

      const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: OIDC_REDIRECT_URI,
        response_type: "id_token",
        response_mode: "fragment",
        scope: "openid email profile",
        state,
        nonce,
      });

      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    } catch (e) {
      console.error("구글 로그인 시작 실패:", e);
      alert(e?.message || "구글 로그인을 시작할 수 없습니다.");
      clickedRef.current = false;
      setLoading(false);
    }
  }, []);

  return (
    <Container>
      <Title>로그인</Title>
      <Subtitle>로그인을 하고, <br />나만의 문화 생활을 즐겨보세요</Subtitle>
      <Tooltip>⚡️ 3초만에 빠른 회원가입</Tooltip>
      
      <KakaoButton type="button" onClick={startKakao} disabled={loading}>
        <img src={KakaoLogo} alt="kakaologo" />
        <span>{loading ? "이동 중..." : "카카오 계정으로 로그인"}</span>
      </KakaoButton>
      
      <GoogleButton type="button" onClick={startGoogle} disabled={loading}>
        <img src={GoogleLogo} alt="googlelogo" />
        <span>{loading ? "이동 중..." : "Google 계정으로 로그인"}</span>
      </GoogleButton>
    </Container>
  );
}

export default Login;