import React from "react";
import styled from "styled-components";
import menuIcon from "../assets/menu.png";

const Bar = styled.header`
  width: 100%;
  background: #955fdccc;
  color: #ffffff;
  position: sticky;
  top: 0;
  z-index: 20;
`;

const Inner = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px 0 20px;
  gap: 8px;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #2ecc40;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.25);
`;

const MenuButton = styled.button`
  display: inline-grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`;

const MenuIcon = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

function ChatBotHeader({ title = "ARTIPICK_Flag", onMenuClick }) {
  return (
    <Bar>
      <Inner>
        <LeftGroup>
          <Title>{title}</Title>
          <Dot aria-label="online" />
        </LeftGroup>

        <MenuButton onClick={onMenuClick} aria-label="메뉴 열기">
          <MenuIcon src={menuIcon} alt="" />
        </MenuButton>
      </Inner>
    </Bar>
  );
}

export default ChatBotHeader;