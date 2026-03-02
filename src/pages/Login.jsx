import { useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import { loginUser } from "../services/authService"; 
 
function Login() { 
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(""); 
  const [checkbox, setCheck] = useState(""); 
  const [password, setMdp] = useState(""); 
  const navigate = useNavigate(); 
 
  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    const res = await loginUser({ email, password }); 
 
    const { token, user } = res.data; 
 
    localStorage.setItem("token", token); 
    localStorage.setItem("user", JSON.stringify(user)); 
 
    if (user.role === "admin") navigate("/admin"); 
    if (user.role === "sitter") navigate("/sitter"); 
    if (user.role === "parent") navigate("/parent"); 
  }; 
 
  return ( 
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
   <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
     <div className="mx-auto max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-white">
       <div className="grid grid-cols-1 md:grid-cols-2">
         <div className="relative p-10 text-white bg-gradient-to-br from-pink-500 via-fuchsia-500 to-indigo-500">
            <svg viewBox="0 0 600 600" aria-hidden="true" 
            className="absolute inset-0 w-full h-full" preserveAspectRatio="none" style="opacity: 0.28;">
              <defs><radialGradient id="b1" cx="30%" cy="30%" r="60%">
                <stop offset="0" stop-color="rgba(255,255,255,0.95)">
                </stop>
                <stop offset="1" stop-color="rgba(255,255,255,0)">
                </stop>
                </radialGradient>
                <radialGradient id="b2" cx="70%" cy="40%" r="55%">
                  <stop offset="0" stop-color="rgba(255,255,255,0.85)">
                  </stop>
                  <stop offset="1" stop-color="rgba(255,255,255,0)">
                      </stop>
                </radialGradient>
                <radialGradient id="b3" cx="55%" cy="75%" r="55%">
                        <stop offset="0" stop-color="rgba(255,255,255,0.9)"></stop>
                        <stop offset="1" stop-color="rgba(255,255,255,0)"></stop>
                </radialGradient></defs>
                        <rect x="0" y="0" width="600" height="600" fill="transparent">
                          </rect>
                        <circle cx="140" cy="150" r="120" fill="url(#b1)">
                            </circle><circle cx="440" cy="190" r="150" fill="url(#b2)">
                            </circle>
                            <circle cx="340" cy="460" r="170" fill="url(#b3)"></circle></svg>
                            <div className="relative">
                              <div className="inline-flex items-center space-x-2 bg-white/15 border border-white/20 px-3 py-1.5 rounded-full text-xs font-semibold">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                className="lucide lucide-sparkles w-3.5 h-3.5" aria-hidden="true">
                                  <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1
                                   0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1
                                   .051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                                   <path d="M20 2v4"></path><path d="M22 4h-4">
                                     </path><circle cx="4" cy="20" r="2"></circle></svg>
                                     <span>SmartBabyCare</span></div><h2 class="mt-6 text-4xl font-extrabold tracking-tight">WELCOME BACK</h2>
                                     <p className="mt-3 text-white/85 leading-relaxed">
                                       Espace sécurisé pour les parents et baby-sitters vérifiés.</p>
                                       <div className="mt-8 space-y-3 text-sm text-white/85">
                                         <p className="flex items-center space-x-2">
                                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
                                           fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                                           stroke-linejoin="round" class="lucide lucide-shield-check w-4 h-4" aria-hidden="true">
                                             <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 
                                             13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 
                                             5 19 5a1 1 0 0 1 1 1z"></path>
                                             <path d="m9 12 2 2 4-4"></path></svg>
                                             <span>Connexion sécurisée (UI)</span></p>
                                             <p className="flex items-center space-x-2">
                                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                                               viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                                               stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail w-4 h-4" 
                                               aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                                               <rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>
                                               <span>Support: support@demo.com</span></p></div></div></div>
                                               <div className="p-10"><div class="flex items-center justify-between">
                                                 <div><p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">Login Account</p>
                                                 <p className="text-lg font-bold text-gray-900 mt-2">SmartBabyCare</p></div>
                                                 <div className="h-10 w-10 rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow-lg">
                                                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                                    className="lucide lucide-lock w-4 h-4" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div></div>
                                                    <div className="mt-8 space-y-5">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><label className="block text-sm">
                                                      <span className="font-semibold text-gray-800">Email</span><div claclassNamess="mt-2 relative">
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                                                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                                          className="lucide lucide-mail w-4 h-4" aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                                                          <rect x="2" y="4" width="20" height="16" rx="2"></rect></svg></div>
                                                          <input onChange={(e) => setEmail(e.target.value)} placeholder="Email"
                                                          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900
                                                           placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition pl-11" /> 
                                                          </div></label>
                                                          <label className="block text-sm">
                                                            <span className="font-semibold text-gray-800">Rôle</span>
                                                            <div className="mt-2 relative">
                                                              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                                                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                                                className="lucide lucide-shield-check w-4 h-4" aria-hidden="true">
                                                                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 
                                                                  1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                                                                  <path d="m9 12 2 2 4-4"></path></svg></div>
                                                                  <input onChange={(e) => setRole(e.target.value)} placeholder="Parent/Sitter" 
                                                                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 
                                                                  placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 
                                                                  transition pl-11" /></div></label></div>
                                                                  <label className="block text-sm">
                                                                    <span className="font-semibold text-gray-800">Mot de passe</span>
                                                                    <div className="mt-2 relative"><div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                                                                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                                                      class="lucide lucide-lock w-4 h-4" aria-hidden="true">
                                                                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                                                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
                                                                        <input type="password" onChange={(e) => setMdp(e.target.value)} placeholder="Votre mot de passe"   
                                                                        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm 
                                                                        text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none 
                                                                        focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition pl-11" /></div></label>
                                                                        <button className="w-full py-3.5 rounded-2xl font-semibold text-white shadow-lg transition bg-pink-600 hover:bg-pink-700">
                                                                          Se connecter</button>
                                                                        
                                                                          <div className="flex items-center justify-between text-sm text-gray-600">
                                                                            <label className="inline-flex items-center space-x-2">
                                                                              
                                                                              <input onChange={(e) => setCheck(e.target.value)} className="rounded border-gray-300 text-gray-900 focus:ring-gray-500 focus:ring-offset-0" 
                                                                              type="checkbox" /><span>Remember me</span></label>
                                                                              <button className="inline-flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-semibold">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                                                                                stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye w-4 h-4" aria-hidden="true">
                                                                                  <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0">
                                                                                    </path><circle cx="12" cy="12" r="3"></circle></svg><span>Forgot?</span>
                                                                                    </button></div>
                                                                                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                                                                                      <p className="font-semibold text-gray-900 mb-2">Accès démo</p>
                                                                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                                        <div><p className="text-xs text-gray-500">Email</p>
                                                                                        <p className="font-mono">admin@demo.com</p></div><div>
                                                                                          <p className="text-xs text-gray-500">Mot de passe</p>
                                                                                          <p className="font-mono">Password123!</p></div></div>
                                                                                          <p className="text-gray-600 mt-2">Utilisez les identifiants démo pour tester les rôles parents/sitters.
                                                                                          </p>
                                                                                          </div></div></div></div></div>
                           </div>
      
      
      
      
      
      
      
      
      
      
       
    </form> 
  ); 
} 
 
export default Login; 
