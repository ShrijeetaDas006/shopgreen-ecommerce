import { useState, useCallback, useEffect, useRef } from "react";

let addToast;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  addToast = useCallback((msg) => {
    const id = counterRef.current++;
    setToasts(t => [...t, { id, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2100);
  }, []);

  return (
    <>
      {children}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className="toast">{t.msg}</div>
        ))}
      </div>
    </>
  );
}

export const toast = (msg) => addToast && addToast(msg);
