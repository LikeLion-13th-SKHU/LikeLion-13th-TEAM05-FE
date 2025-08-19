import React, { useCallback, useState, useEffect } from "react";
import styled from "styled-components";
import GoogleLogo from "../assets/GoogleLogo.png";
import KakaoLogo from "../assets/KakaoLogo.png";
// import { loginWithIdToken, fetchMe } from "../api/auth";

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
    &:focus-visible {outline: 3px solid rgba(0, 0, 0, 0.2);}
    &:disabled {opacity: 0.6; cursor: not-allowed;}

    img {
        width: 24px;
        height: 24px;
        object-fit: contain;
    }
`;

const KakaoButton = styled(Btn)`
    background-color: #FEE500;
    color: #111;
`

const GoogleButton = styled(Btn)`
    background: #fff;
    color: #111;
    border: 2px solid #111;
    margin-top: 14px;
`;



function Login() {
    return (
        <Container>
            <Title>로그인</Title>
            <Subtitle>
                로그인을 하고, <br />
                나만의 문화 생활을 즐겨보세요
            </Subtitle>

            <Tooltip>
                 ⚡️ 3초만에 빠른 회원가입 
            </Tooltip>

            <KakaoButton type="button">
                <img src={KakaoLogo} alt="kakaologo" />
                <span>카카오로 로그인</span>
            </KakaoButton>

            <GoogleButton type="button">
                <img src={GoogleLogo} alt="googlelogo" />
                <span>Google로 로그인</span>
            </GoogleButton>
        </Container>
    )
}

export default Login;