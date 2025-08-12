import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: #00000066;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  transition: 0.3s;
  z-index: 9;
`;

const SidebarWrapper = styled.aside`
  position: fixed;
  top: 0;
  right: ${({ isOpen }) => (isOpen ? "0" : "-250px")};
  width: 250px;
  background: #fff;
  box-shadow: -2px 0 8px #00000019;
  padding: 1rem;
  transition: 0.3s;
  z-index: 10;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  float: right;
  cursor: pointer;
`;

const Nav = styled.nav`
  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin: 1rem 0;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #333;
  &:hover {
    color: #007bff;
  }
`;

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      <SidebarWrapper isOpen={isOpen}>
        <CloseButton onClick={onClose}>X</CloseButton>
        <Nav>
          <ul>
            <li>
              <StyledLink to="/" onClick={onClose}>
                홈
              </StyledLink>
            </li>
            <li>
              <StyledLink to="/search" onClick={onClose}>
                검색
              </StyledLink>
            </li>
            <li>
              <StyledLink to="/chatbot" onClick={onClose}>
                챗봇
              </StyledLink>
            </li>
            <li>
              <StyledLink to="/my" onClick={onClose}>
                마이
              </StyledLink>
            </li>
          </ul>
        </Nav>
      </SidebarWrapper>
    </>
  );
}

export default Sidebar;
