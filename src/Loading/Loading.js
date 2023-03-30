import React from 'react'
// import ReactLoading from 'react-loading';
import style from './Loading.module.css'

export default function Loading(props) {
    const handleflag=()=>{
        props.setflag1(false)
        props.setflag(false)
    }
  return (
    
    <div className={style.whole}>    
       <h1>Request Sent</h1>
       <button className={style.btn} onClick={handleflag}>OK</button>
    </div>
  )
}
