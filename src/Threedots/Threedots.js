import React from 'react'
import style from './Threedots.module.css'
import Fade from 'react-reveal/Fade';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons';

export default function Threedots(props) {
  return (
    <Fade>
      <div className={style.whole}>
      <p className={style.edit} onClick={(e)=>props.handleDeletePost(e,props.a)}><FontAwesomeIcon icon={faGear} className={style.bell}/>  Info</p> 
        <p className={style.edit} onClick={()=>{props.seteditflag(!props.editflag);props.seteditshow(!props.editshow)}}><i class="fa-solid fa-arrow-right-from-bracket"></i> Leave</p>
       
      </div>
    </Fade>
  )
}
