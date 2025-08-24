import React from "react";
import styled from "styled-components";

const Bar = styled.header`
  width: 100%;
  background: #955FDCCC;
  color: #FFFFFF;
  position: sticky;
  top: 0;
  z-index: 20;
`;

const Inner = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 12px 0 20px;
  gap: 8px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #FFFFFF;
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #2ECC40;
  box-shadow: 0 0 0 2px rgba(255,255,255,0.25);
`;

function ChatBotHeader({ title = "ARTIPICK_Flag" }) {
  return (
    <Bar>
      <Inner>
        <Title>{title}</Title>
        <Dot aria-label="online" />
      </Inner>
    </Bar>
  );
}

export default ChatBotHeader;