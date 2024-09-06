import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

export default function NotFound() {  
  const navigate =  useNavigate();
  
  useEffect(() => {
    setTimeout(() => {
      navigate('/');
    }, 3000);
  }, [navigate]);
  

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      Opps! 找不到頁面，三秒後自動返回首頁
    </div>
  )
}
