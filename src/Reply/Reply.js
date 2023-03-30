import React, { useEffect, useRef } from 'react'
import style from './Reply.module.css'
export default function Reply(props) {
    const textarearef=useRef();

    useEffect(()=>{
    },[props]);

    const handlepost=async()=>{
      if(props.a.id===undefined){
        props.a.id=0;
      }
      const post={
        userid:props.userid,
        groupid:props.groupid,
        postid:props.postid,
        reply:textarearef.current.value,
        replyid:props.a.id,
      }
      const result=await fetch("http://172.17.56.144:5997/reply",{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(post)
      })
      await result.json()
      props.setflag(false);
      props.setreplyflag1(!props.replyflag1);
    }

  return (

    <div className={style.whole}>
        <div className={style.flex}>
          <img src={`../assests/${props.image}`} className={style.profilephoto} alt=''/>
          <textarea className={style.text} ref={textarearef}></textarea>
        </div>
        <div className={style.updatewhole}>
            <button className={style.sharbtn1} onClick={()=>props.setflag(false)}>Cancel</button>
            <button className={style.sharbtn} onClick={handlepost}>Post</button>
        </div>
    </div>

  )
}
