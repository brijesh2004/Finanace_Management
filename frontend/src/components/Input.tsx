import React, { ChangeEvent } from "react";
interface InputProps {
  type: string;
  placeholder: string;
  label: string;
  name: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}
const Input: React.FC<InputProps> = ({ type, placeholder, label, name, setInput }) => {
  const ChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }
  return (
    <div>
      <label htmlFor={name}>{label} :</label>
      <input name={name} 
      type={type} 
      placeholder={placeholder}
      onChange={ChangeHandle}
      required />
    </div>
  )
}

export default Input
