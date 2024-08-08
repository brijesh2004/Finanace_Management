import { FormEvent, useState , useEffect } from "react";
import Input from "../components/Input"
import style from '../style/form.module.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch , useSelector} from "react-redux";
import { logout } from "../features/slice";


const Register = () => {
  const navigate = useNavigate();
  const logind = useSelector((state:any)=>state.login);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [code, setCode] = useState("");
  const dispatch = useDispatch();

  const onSubmit: any = async (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    if(!name || !email ||!password ||!confirmPassword){
      alert("fill all the details");
      return ;
    }
    if(password!==confirmPassword){
      alert("password should be same");
      return;
    }
    try {
      const backend = import.meta.env.VITE_BACKEND;
      const res = await axios.post(`${backend}/register`,
        { name, email, password, confirmPassword }, { withCredentials: true }
      )
      if (res.status === 201) {
        setVerifyEmail(true);
      }
      else {
        throw Error;
      }
    }
    catch (err) {
      console.error(err);
    }
  }


  const verify: any = async (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const backend = import.meta.env.VITE_BACKEND;
      const res = await axios.post(`${backend}/verifyemail`, {
        code,
        email
      }, { withCredentials: true })
      if (res.status === 201) {
        dispatch(logout());
        navigate("/");
      }
      else {
        throw Error;
      }
    }
    catch (err) {
      alert("Code not Matched");
    }
  }



  useEffect(()=>{
    if(logind){
      navigate("/");
    }
    } , [logind]);
  return (
    <div className={style.form_main_div}>


      {!verifyEmail &&
       <form className={style.form_submit}>
        <center><h1>Register</h1></center>
        <Input type="text" placeholder="Enter full Name" label="Name" name="name" setInput={setName} />
        <Input type="email" placeholder="Enter email" label="Email" name="email" setInput={setEmail} />
        <Input type="password" placeholder="Create Password" label="Password" name="password" setInput={setPassword} />
        <Input type="password" placeholder="Confirm Password" label="Confirm Password" name="cpassword" setInput={setConfirmPassword} />
        <center><button onClick={onSubmit}>Submit</button></center>
      </form>}

      {verifyEmail && <form className={style.form_submit}>
        <center><h1>Verify Email</h1></center>
        <Input type="text" placeholder="Enter Code" label="Check Your Email" name="verify" setInput={setCode} />
        <center><button onClick={verify}>Submit</button></center>
      </form>}
    </div>
  )
}

export default Register
