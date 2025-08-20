import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Login from "./pages/Login";
import My from "./pages/My";
import Search from "./pages/Search";
import ChatBot from "./pages/ChatBot";
import DetailPage from "./pages/DetailPage";
import FestivalReg from "./pages/FestivalReg";
import Header from "./components/header";
import Sidebar from "./components/Sidebar";
import styled from "styled-components";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <AppContainer>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <Content>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/my" element={<My />} />
            <Route path="/search" element={<Search />} />
            <Route path="/chatbot" element={<ChatBot />} />
            <Route path="/detail/:culturesId" element={<DetailPage />} />
            <Route path="/festivalreg" element={<FestivalReg />} />
          </Routes>
        </Content>
      </AppContainer>
    </BrowserRouter>
  );
}

export default App;
