import { useState,useEffect } from "react";
import {useAuth} from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from 'axios'
export default function privateRoute(){
    const[ok,setOk] =useState(false)
    const[ auth,setAuth]= useAuth()


    useEffect(()=>{
        const authCheck = async() =>{
            const res = await axios.get('/api/v1/auth/user-auths',{
                headers :{
                    "Authorization" : auth?.token
                }
            }
        )
        if(res.data.ok){
            setOk(true)
        }else{
            setOk(false)
        }
        }

        if(auth?.token)authCheck();
    }, [auth?.token])

    return ok ? <Outlet/>:<spinner/>;

}