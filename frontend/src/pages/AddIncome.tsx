import { useEffect, useState } from "react"
import style from '../style/form.module.css';
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate , useLocation } from "react-router-dom";
import Popup from "../components/Popup";

const AddIncome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Extract state passed from About component
  const { amountValue = 0, types = "", incomeSource = "income" ,inexId="" } = location.state || {};
  const [inEx , setInEx] = useState(incomeSource);
  const [type , setType] = useState(types);
  const [amount , setAmount] = useState(amountValue);
  const [exAddress , setExAddress] = useState(inexId);
  const logind = useSelector((state:any)=>state.login);
  const [pop , setPop] = useState({
    popUp:false,
    popMessage:""
  })
  const AddTheData = async (e:any)=>{
    e.preventDefault();
     try{
      if(!inEx||!type || amount<=0){
        alert("check all field");
        return ;
      }
      const backend = import.meta.env.VITE_BACKEND;
      const data = await axios.post(`${backend}/finance` , {
          inEx , type , amount , exAddress
      } , {withCredentials:true})

      setAmount(0);
      setPop({popUp:true , popMessage:"Added"});
     }
     catch(err:any){
      alert("err");
      setPop({popUp:true , popMessage:err.response.data.err});
    
     }
  }


  useEffect(()=>{
  
    if(!logind){
      navigate("/");
    }
    } , [logind]);

  return (
    <div>
    <div className={style.form_main_div}> 
       <form className={style.form_submit}>
            <select name="inex" onChange={(e)=>setInEx(e.target.value)} value={inEx} className={style.selectItem}>
              <option value="income">Income</option>
              <option value="expanse">Expanse</option>
            </select>
            {inEx==="income"?
            <div>
             <select name="incomevalue" onChange={(e)=>setType(e.target.value)} value={type} className={style.selectItem}>
              <option value="">Select</option>
              <option value="salary">Salary</option>
              <option value="freelancing">Freelancing</option>
              <option value="investment">Investement</option>
             </select>
            </div>:
            <div>
              <select name="expansevalue" onChange={(e)=>setType(e.target.value)} value={type} className={style.selectItem}>
              <option value="">Select</option>
                <option value="groceries">Groceries</option>
                <option value="bills">Bills</option>
                <option value="entertainment">Entertainment</option>
              </select>
              </div>}
              <label htmlFor="amount">Amount :</label>
              <input type="Number" placeholder="Enter Amount" value={amount} required onChange={(e:any)=>setAmount(e.target.value)}/>
              <button onClick={AddTheData}>Submit</button>
        </form>
        {pop.popUp &&<Popup message={pop.popMessage} state={setPop}/>}
    </div>

    </div>
  )
}

export default AddIncome
