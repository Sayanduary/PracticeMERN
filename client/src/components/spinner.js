import React, {useState,useEffect, use} from 'react';
import { useNavigate,useLocation } from "react-router-dom";

const spinner = () => {
    const[count ,setCount] =useState(5)
    const navigate = useNavigate();
    const location =useLocation

    useEffect(()=>{
        const interval =setInterval(() =>{
            setCount((prevValue) => --prevValue)
        },1000);

        count === 0 && navigate('/Login',{ state :location.pathname});
        return() =>clearInterval(interval)
    },[count ,navigate,location])


  return (
    <>
      <div classname="d-flex flex-column justify-content-center align-items-center" style ={{ height : "100vh"}}>

        <h1 classname="Text-center">redirecting to you in{count}second</h1>
  <div classname="spinner-border" role="status">
    <span classname="visually-hidden">Loading...</span>
  </div>
</div>

    </>
  )
}

export default spinner
