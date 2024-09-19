import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const isLogin = useAuthStore(state => state.isLogin);

  useEffect(() => {
    if(!isLogin){
      navigate('/login');
    }
  },[isLogin,navigate])
  
  return <>{children}</>;
};

export default ProtectedRoute;