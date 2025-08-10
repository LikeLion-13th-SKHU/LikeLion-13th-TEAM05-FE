import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Login from "./pages/Login";
import My from "./pages/My";
import Search from "./pages/Search";
import ChatBot from "./pages/ChatBot";
import DetailPage from "./pages/DetailPage";
import FestivalReg from "./pages/FestivalReg";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my" element={<My />} />
        <Route path="/search" element={<Search />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/detail" element={<DetailPage />} />
        <Route path="/festivalreg" element={<FestivalReg />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
