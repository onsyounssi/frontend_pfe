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
function App() {
  return ( 
    <BrowserRouter> 
    
      <Routes> 
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} /> 
        <Route path="/parent" element={<ParentDashboard />} /> 
        <Route path="/sitter" element={<SitterDashboard />} />
        <Route path="/profil/:id" element={<ProfilPage />} />
        <Route path="/reservation" element={<BookingsPage />} />
        <Route path="/reviews" element={<ReviewPage />} />
        <Route path="/chat" element={<MessagsPage />} />


        <Route path="/" element={<Home />} />
       

      </Routes> 
    </BrowserRouter> 
    
  );  
} 
export default App;