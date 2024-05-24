// useGoBackOrRedirect.js
import { useNavigate } from 'react-router-dom';

const useGoBackOrRedirect = () => {
  const navigate = useNavigate();

  const goBackOrRedirect = () => {
    if (document.referrer && !document.referrer.includes(window.location.origin)) {
      navigate('/dashboard/invoices/deliveries');
    } else {
      navigate(-1); // Go back in history
    }
  };

  return {
    goBackOrRedirect,
  };
};

export default useGoBackOrRedirect;
