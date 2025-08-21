import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const MenuList = styled.ul`
  position: absolute;
  top: 60px;
  right: 20px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 10px 0;
  margin: 0;
  width: 180px;
  z-index: 1000;

  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
`;

const MenuItem = styled.li`
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
    color: #20be37;
    font-weight: bold;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

function DropdownMenu({ isOpen, onClose }) {
  const menuRef = useRef(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <MenuList ref={menuRef} $isOpen={isOpen}>
      <MenuItem>
        <StyledLink to="/" onClick={onClose}>
          홈
        </StyledLink>
      </MenuItem>
      <MenuItem>
        <StyledLink to="/search" onClick={onClose}>
          검색
        </StyledLink>
      </MenuItem>
      <MenuItem>
        <StyledLink to="/login" onClick={onClose}>
          로그인
        </StyledLink>
      </MenuItem>
      <MenuItem>
        <StyledLink to="/chatbot" onClick={onClose}>
          챗봇
        </StyledLink>
      </MenuItem>
      <MenuItem>
        <StyledLink to="/my" onClick={onClose}>
          마이
        </StyledLink>
      </MenuItem>
    </MenuList>
  );
}

export default DropdownMenu;
