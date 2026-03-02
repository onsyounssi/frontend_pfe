import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Login from "./pages/Login"; 
import Register from "./pages/Register"; 
import AdminDashboard from "./pages/AdminDashboard";  
import SitterDashboard from "./pages/SitterDashboard"; 
import Home  from "./pages/Home";
import ParentDashboard from "./pages/ParentDashboard";


 
function App() {
  return ( 
    <BrowserRouter> 
      <Routes> 
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} /> 
        <Route path="/parent" element={<ParentDashboard />} /> 
        <Route path="/sitter" element={<SitterDashboard />} />
        <Route path="/" element={<Home />} />

      </Routes> 
    </BrowserRouter> 
    
  );  
} 
export default App;