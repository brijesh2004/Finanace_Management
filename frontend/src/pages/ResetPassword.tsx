import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import style from '../style/form.module.css';


const ResetPassword = () => {
  const navigate = useNavigate();
    const [emailSend , setEmailSend]= useState(false);
    const [email , setEmail] = useState("");
    const [code , setCode] = useState("");
    const [password , setPassword] = useState("");
    const logind = useSelector((state:any)=>state.login);

   const sendCode = async (e:any)=>{
    e.preventDefault();
    try{
      const backend = import.meta.env.VITE_BACKEND;
      const res = await axios.post(`${backend}/forgot` , {email} , {withCredentials:true});
      alert("email send");
      setEmailSend(true);
    }
    catch(err){
      alert("err");
    }
   }
   const ResetPassword = async(e:any)=>{
     e.preventDefault();
    try{
      const backend = import.meta.env.VITE_BACKEND;
     const res = await axios.post(`${backend}/changepassword` , {email , password ,code} , {withCredentials:true});
     
     alert("password reset successfull");
     navigate("/login");
    }
    catch(err){
      alert("err");
    }
   }


   useEffect(()=>{
    if(logind){
      navigate("/");
    }
    } , [logind]);

  return (
    <div style={{textAlign:'center'}}>
      <form className={style.form_submit}>
      <label htmlFor="email">Email :</label>
      <input type="text" placeholder="Enter Email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
      {emailSend&&<div>
      <label htmlFor="code">Check Email :</label>
      <input type="text" placeholder="Enter Code" name="code" value={code} onChange={(e)=>setCode(e.target.value)}/>
      <label htmlFor="password">New Password :</label>
      <input type="password" placeholder="Create New Password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)}/> <br />
      <button onClick={ResetPassword}>Reset</button>
      </div>}
     <br /> { !emailSend&&<button onClick={sendCode}>SendCode</button>}
      </form>
    </div>
  )
}

export default ResetPassword
