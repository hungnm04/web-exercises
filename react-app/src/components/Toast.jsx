import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast-notification ${type === 'error' ? 'toast-error' : 'toast-success'}`}>
      {type === 'error' ? <AlertCircle className="toast-icon" /> : <CheckCircle2 className="toast-icon" />}
      <span className="toast-message">{message}</span>
    </div>
  );
};

export default Toast;