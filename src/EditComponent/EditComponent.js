import React from 'react'
import style from './EditComponent.module.css'
import Fade from 'react-reveal/Fade';

export default function EditComponent(props) {
  return (
    <Fade top>
      <div className={style.whole}>
        <p className={style.edit} onClick={()=>{props.seteditflag(!props.editflag);props.seteditshow(!props.editshow)}}><i className="fa-solid fa-pen"></i> Edit</p>
        <p className={style.edit+" "+style.trash} onClick={(e)=>props.handleDeletePost(e,props.a)}><i className="fa-solid fa-trash"></i>  Delete</p> 
      </div>
    </Fade>
  )
}