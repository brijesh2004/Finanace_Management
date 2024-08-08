import { useDispatch, useSelector } from 'react-redux';
import style from '../style/navbar.module.css';
import { Link } from 'react-router-dom';
import { login, logout } from '../features/slice';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const dispatch = useDispatch();
  const logind = useSelector((state: any) => state.login);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const verifyLogin = async () => {
    try {
      const backend = import.meta.env.VITE_BACKEND;
      const res = await axios.get(`${backend}/about`, {
        withCredentials: true
      });
      return res.status === 200;
    } catch (err) {
      return false;
    }
  };

  const LogoutFun = async () => {
    try {
      const backend = import.meta.env.VITE_BACKEND;
      const data = await axios.post(`${backend}/logout`, {},
        { withCredentials: true }
      );
      if (data.status === 200) {
        dispatch(login())
        alert("Logout");
      }
    } catch (err) {
      alert("Error while logout")
    }
  }

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loginStatus = await verifyLogin();
      if (loginStatus) {
        dispatch(logout());
      }
    };

    checkLoginStatus();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={style.main_nav_div}>
      <div className={style.nav_header}>
        
        <button className={style.mobile_menu_button} onClick={toggleMobileMenu}>
          ☰
        </button>
      </div>
      <ul className={`${style.nav_list} ${isMobileMenuOpen ? style.nav_list_open : ''}`}>
        <li><Link to="/">Home</Link></li>
        {logind && <li><Link to="/about">Profile</Link></li>}
        {logind && <li><Link to="/add">Add</Link></li>}
        {!logind && <li><Link to="/login">Login</Link></li>}
        {!logind && <li><Link to="/register">Register</Link></li>}
        {logind && <li><Link to="/register" onClick={LogoutFun}>Logout</Link></li>}
      </ul>
    </div>
  );
}

export default Navbar;
