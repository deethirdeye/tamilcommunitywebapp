import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userCode = localStorage.getItem('userCode');
    const userId = localStorage.getItem('loggedInUserId');
    
    if (!token || !userCode || !userId) {
      localStorage.clear();
      navigate('/login', { replace: true });
      return false;
    }
    return true;
  };

  return { checkAuth };
}; 