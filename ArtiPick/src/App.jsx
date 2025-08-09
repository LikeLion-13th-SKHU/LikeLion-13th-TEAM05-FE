import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Search from "./pages/Search";
import ChatBot from "./pages/ChatBot";
import DetailPage from "./pages/DetailPage";
import FestivalReg from "./pages/FestivalReg";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Search" element={<Search />} />
        <Route path="/ChatBot" element={<ChatBot />} />
        <Route path="/DetailPage" element={<DetailPage />} />
        <Route path="/FestivalReg" element={<FestivalReg />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;