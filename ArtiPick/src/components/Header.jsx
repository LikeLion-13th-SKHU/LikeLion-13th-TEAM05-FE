import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import menuIcon from "../assets/menu.png";

const HeaderWrapper = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
  border-bottom: 1px solid #eee;
`;

const Logo = styled.img`
  height: 32px;
  margin-left: 20px;
  cursor: pointer; /* 클릭 가능 표시 */
`;

const MenuIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 20px;
  cursor: pointer;
`;

function Header({ onMenuClick }) {
  const navigate = useNavigate(); // useNavigate 훅

  const goHome = () => {
    navigate("/"); // 홈 경로로 이동
  };

  return (
    <HeaderWrapper>
      <Logo src={logo} alt="로고" onClick={goHome} />
      <MenuIcon src={menuIcon} alt="메뉴" onClick={onMenuClick} />
    </HeaderWrapper>
  );
}

export default Header;
