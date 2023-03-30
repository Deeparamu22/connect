import React, { useEffect, useState } from 'react'
import style from './RequestPage.module.css'
import Fade from 'react-reveal/Fade';

export default function RequestPage() {
    const [data,setdata]=useState([]);

    useEffect(()=>{
        getrequests();
    },[])

    useEffect(()=>{

    },[data])

    const getrequests=async()=>{
        const result =await fetch(`http://172.17.56.144:5997/request`)
      const jsonresult=await result.json();
      setdata(jsonresult);
    }

    const handleRequests=async(e,a,status)=>{
        const result1 =await fetch ("http://172.17.56.144:5997/request",{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({id:a,status:status})
        })
        const resultJson1=await result1.json();
        setdata(resultJson1);
    }

  return (
    <Fade >
      <div className={style.whole}>
        {
          data.map((a)=>{
            return <div key={a.username} className={style.innerdiv}>
              <img src={'/assests/'+a.profileImage} className={style.profile} alt={a.username}/>
              <p className={style.username}>{a.username}</p>
              <button className={style.accept} id={a.id} onClick={(event)=>handleRequests(event,a.id,'accept')}>Accept</button>
              <button className={style.reject} id={a.id} onClick={(event)=>handleRequests(event,a.id,'reject')}>Reject</button>
            </div>
            })
        }
      </div>
    </Fade>
  )
}
