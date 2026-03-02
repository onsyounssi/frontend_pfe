import { useState } from "react"; 
import { registerUser } from "../services/authService"; 

function Register() { 
const [formData, setFormData] = useState({ 
nom: "", 
tel: "", 
email: "",
role:"", 
password: "", 
}); 
const handleChange = (e) => { 
    setFormData({ ...formData, [e.target.name]: e.target.value }); 
  }; 
 
  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    await registerUser(formData); 
    alert("Inscription réussie"); 
  }; 
  return (
          
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 
space-y-4"> 

      <input name="nom" onChange={handleChange} placeholder="Nom" 
className="input" /> 
      <input name="tél" onChange={handleChange} placeholder="tél" 
className="input" /> 
<input name="role" onChange={handleChange} placeholder="Role" 
className="input" /> 

      <input name="email" onChange={handleChange} placeholder="Email" 
className="input" /> 
      <input name="password" type="password" onChange={handleChange} 
placeholder="Mot de passe" className="input" /> 
      <button className="btn">S'inscrire</button> 
    </form> 
  ); 
} 
 
export default Register;