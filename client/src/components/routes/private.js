import { useState,useEffect } from "react";
import {useAuth} from "../../context/auth";
import { Outlet } from "react-router-dom";

export default function privateRoute(){
    const[ok,setOk] =useState(false)
    const[ auth,setAuth]= useAuth()


    useEffect(()=>{}, [])

    return ok ? <Outlet/>:'spinner'

}