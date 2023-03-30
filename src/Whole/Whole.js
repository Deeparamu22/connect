import React, { useEffect, useState } from 'react'
import Loginpage from '../Loginpage/Loginpage'
import style from './Whole.module.css'
import {  Routes, Route } from "react-router-dom";
import Newgroupform from '../Newgroupform/Newgroupform';
import MainContainer from '../MainContainer/MainContainer';
import ShowMembers from '../ShowMembers/ShowMembers';
import DeletePopup from '../DeletePopup/DeletePopup';
export default function Whole() {
  const [flag,setflag]=useState(false);
  const [flag2,setflag2]=useState(false);
  const [members,setmembers]=useState([]);
  const [groupName,setgroupName]=useState();
  const [adminId,setadminId]=useState(0);
  const [deleteflag,setdeleteflag]=useState(false);

  useEffect(()=>{
  },[members,groupName,adminId])

  return (
    <div className={style.whole}>
      
      <Routes>
        <Route path='/' element={<Loginpage setflag={setflag2}/>}></Route>
        <Route path='/main' element={<MainContainer deleteflag={deleteflag} setdeleteflag={setdeleteflag} setflag={setflag} setmembers={setmembers} setgroupName={setgroupName} setadminId={setadminId}/>}></Route>
        <Route path='/form/:id' element={<Newgroupform />}></Route>
      </Routes>

      {(deleteflag)?<div className={style.absolute}>
        <DeletePopup setdeleteflag={setdeleteflag} deleteflag={deleteflag}/>
      </div>:null} 

      {(flag)?<div className={style.absolute}>
        <ShowMembers members={members} groupName={groupName} setflag={setflag} adminId={adminId}/>
      </div>:null} 

      {(flag2)?<div className={style.absolute}></div>:null}
    </div>
  )
}
