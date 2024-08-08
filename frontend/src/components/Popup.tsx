import { useEffect, useState } from 'react';
import style from '../style/popup.module.css';

const Popup = ({ message ,state}: any) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      state({ popUp: false, popMessage: "" });
    }, 5000);
    return () => {
        clearTimeout(timer);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className={style.popupContainer}>
      <div className={style.popupMessage}>{message}</div>
    </div>
  );
}

export default Popup;
