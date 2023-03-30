import React from 'react'
import style from './Moredetails.module.css'
export default function Moredetails() {
  return (
    <div className={style.whole}>

    <h2>{props.groupName}</h2>
    <p>Members({props.members.length})</p>

    <FontAwesomeIcon icon={faXmark} className={style.xmark} onClick={()=>props.setflag(false)}/>
    <div className={style.inner}>
    {
      props.members.map(a=>{
        return <div className={style.smallDiv} key={a.profileImage}>
          <img src={`../assests/${a.profileImage}`} className={style.profile} alt={'profileimage'}/>
          <p>{a.username}</p>
          {(a.id===props.adminId)?<p className={style.admin}>admin</p>:null}
       </div>
        })
    }
</div>
  </div>
  )
}
