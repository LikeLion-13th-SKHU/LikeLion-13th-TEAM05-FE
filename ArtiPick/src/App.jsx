import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Login from "./pages/Login";
import My from "./pages/My";
import Search from "./pages/Search";
import ChatBot from "./pages/ChatBot";
import DetailPage from "./pages/DetailPage";
import FestivalReg from "./pages/FestivalReg";
import FestivalRegSuccess from "./pages/FestivalRegSuccess";
import Header from "./components/header";
import styled from "styled-components";
import OidcCallback from "./pages/OidcCallback";
import DropdownMenu from "./components/DropdownMenu";

const AppContainer = styled.div`
  width: 100%;
  max-width: 480px; /* 모바일 폭 */
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Content = styled.main`
  flex: 1;
  padding: 1rem;
`;

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BrowserRouter>
      <AppContainer>
        <Header onMenuClick={() => setIsOpen(!isOpen)} />
        <DropdownMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />

        <Content>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/my" element={<My />} />
            <Route path="/search" element={<Search />} />
            <Route path="/chatbot" element={<ChatBot />} />
            <Route path="/detail/:culturesId" element={<DetailPage />} />
            <Route path="/festivalreg" element={<FestivalReg />} />
            <Route path="/festivalreg/success" element={<FestivalRegSuccess />} />
            <Route path="/oidc-callback" element={<OidcCallback />} />
          </Routes>
        </Content>
      </AppContainer>
    </BrowserRouter>
  );
}

export default App;
