import { FormEvent, useEffect, useState } from "react";
import Input from "../components/Input"
import style from '../style/form.module.css';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {logout } from "../features/slice";
import Popup from "../components/Popup";
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [error , setError] = useState("");
  const [pop , setPop] = useState({
    popUp:false,
    popMessage:""
  })
  const logind = useSelector((state:any)=>state.login);
  const dispatch = useDispatch();
  
   

  const Login: any = async (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      // const backend = process.env.REACT_APP_BACKEND;
      // console.log("backend" , backend);
      const backend = import.meta.env.VITE_BACKEND;
      const res = await axios.post(`${backend}/login`, {
        email,
        password
      }
        , { withCredentials: true })

      if (res.status === 200) {
        setPop({popUp:true , popMessage:"Logined!"});
        dispatch(logout());
        navigate("/");
      }
      else {
        setPop({popUp:true , popMessage:res.data.err});
        setError(res.data.err);
        throw Error;
      }
    }
    catch (err:any) {
   setPop({popUp:true , popMessage:err.response.data.err});
      console.error(err.response.data.err);
      setError(err.response.data.err);
      console.log(err);
    }
  }


  useEffect(()=>{
  if(logind){
    navigate("/");
  }
  } , [logind]);

  return (
    <div className={style.form_main_div}>
      <form className={style.form_submit}>
        <center><h1>Login</h1></center>
        <Input type="email" placeholder="Enter email" label="Email" name="email" setInput={setEmail} />
        <Input type="password" placeholder="Create Password" label="Password" name="password" setInput={setPassword} />
        <center><button onClick={Login}>Submit</button></center>
        <h3 style={{color:'red'}}>{error}</h3>
       <hr />
       <center> <Link to="/resetpassword">forget password or verify email</Link> </center>
      </form>

      {pop.popUp &&<Popup message={pop.popMessage} state={setPop}/>}
    </div>
  )
}

export default Login
