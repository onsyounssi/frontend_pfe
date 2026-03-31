import { BrowserRouter, Routes, Route } 
from "react-router-dom"; 
import Login from "./pages/Login"; 
import Register from "./pages/Register"; 
import AdminDashboard from "./pages/AdminDashboard";  
import SitterDashboard from "./pages/SitterDashboard"; 
import Home  from "./pages/Home";
import ParentDashboard from "./pages/ParentDashboard";
import ProfilPage from "./pages/ProfilPage";
import BookingsPage from './pages/BookingsPage';
import ReviewPage from './pages/ReviewPage';
import MessagsPage from './pages/MessagsPage';
import RegisterSitter from './pages/RegisterSitter';

import ChatWidget from "./components/ChatWidget";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return ( 
    <BrowserRouter> 
    
      <Routes> 
        <Route
      path="/forgot-password"
      element={<ForgotPassword />}
    />

    <Route
      path="/reset-password/:token"
      element={<ResetPassword />}
    />

        <Route path="/login" element={<Login />} /> 
        <Route path="/register-sitter" element={<RegisterSitter />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} /> 
        <Route path="/parente" element={<ParentDashboard />} /> 
        <Route path="/baby-sitter" element={<SitterDashboard />} />
        <Route path="/profil/:id" element={<ProfilPage />} />
        <Route path="/reservation" element={<BookingsPage />} />
        <Route path="/reviews" element={<ReviewPage />} />
        <Route path="/chat" element={<MessagsPage />} />


        <Route path="/" element={<Home />} />
       

      </Routes> 
       <ChatWidget /> 
    </BrowserRouter> 
    
  );  
} 
export default App;