import React, { useEffect, useRef, useState } from 'react'
import EditComponent from '../EditComponent/EditComponent';
import Reply from '../Reply/Reply';
import style from './ReplyDiv.module.css'
export default function ReplyDiv(props) {
    const [replyedit,setreplyedit]=useState(false);
    const replyref=useRef(null);
    const [flag,setflag]=useState(false);
    const [editflag,seteditflag]=useState(false);
    useEffect(()=>{
    },[replyedit,props]);

    const handlereplyupdate=async(e)=>{
        await fetch(`http://172.17.56.144:5997/updateReply/${props.a.id}`,{
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({reply:replyref.current.value}),
        })
        setreplyedit(false);
        props.setreplyflag(true);
    }

    const handledeletereply=async(e,id)=>{
        const result =await fetch(`http://172.17.56.144:5997/delete/${id}`);
        const jsonresult=await result.json();
        console.log(jsonresult);
        props.setdeleteflag(!props.deleteflag);
    }


    const handlelike=async(e,id,like,status,id2)=>{
        await fetch("http://172.17.56.144:5997/like/"+props.id+"",{
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({userid:props.allusers.filter(b=>b.id===props.id)[0].id,like:like,postid:0,replyid:id,status:status,id:id2}),
        })

        props.setlikeflag(!props.likeflag);
    }


  return (
    <div className={style.whole}>
        <img src={`../assests/${props.allusers.filter(b=>b.id===props.a.userid)[0].profileImage}`} className={style.profilephoto} alt=''/>
        <div className={style.inner}>
            <div className={style.flex}>
                <h4>{props.allusers.filter(b=>b.id===props.a.userid)[0].username} 
                 {(props.a.replyid!==0&&props.replies.filter(a=>a.id===props.a.replyid)[0]!==undefined)?<span> replied to {props.allusers.filter(b=>b.id===props.replies.filter(a=>a.id===props.a.replyid)[0].userid)[0].username}'s comment</span>:null}
                </h4>
                {(props.id===props.a.userid)?<div className={style.threedots}>
                    <p onClick={()=>seteditflag(!editflag)}><i class="fa-solid fa-ellipsis"></i></p>
                    {(editflag)?<EditComponent seteditshow={seteditflag} editshow={editflag} seteditflag={setreplyedit} editflag={replyedit} handleDeletePost={handledeletereply} a={props.a.id}/>:null}
                </div>:null}
            </div>
            {(replyedit)?<textarea defaultValue={props.a.reply} className={style.text} ref={replyref}></textarea>:<pre className={style.textarea2}>{props.a.reply}</pre>}
            {(replyedit)?<div className={style.updatewhole}>
                <button className={style.sharbtn1}  onClick={()=>setreplyedit(!replyedit)}>Cancel</button>
                <button className={style.sharbtn} onClick={(e)=>handlereplyupdate(e,props.a.id)}>Update</button>
            </div>:null}
            <div className={style.postbottom}>
                {
                    (props.alllike.filter(a=>a.replyid===props.a.id)[0]===undefined)?<p className={style.startCon}><i className="fa-regular fa-thumbs-up" onClick={(e)=>handlelike(e,props.a.id,true,'new')}></i> Like</p>:
                    (new RegExp("true").test(props.alllike.filter(a=>a.replyid===props.a.id)[0].like))?<p className={style.startCon} style={{color:'#00b792'}}><i className="fa-solid fa-thumbs-up" onClick={(e)=>handlelike(e,props.a.id,false,'already',props.alllike.filter(a=>a.replyid===props.a.id)[0].id)}></i> Liked</p>:
                    <p className={style.startCon}><i className="fa-regular fa-thumbs-up" onClick={(e)=>handlelike(e,props.a.id,true,'already',props.alllike.filter(a=>a.replyid===props.a.id)[0].id)}></i> Like</p>

                }
                {(props.a.replyid===0)?<p p className={style.startCon} onClick={()=>setflag(!flag)}><i className="fa-regular fa-message"></i> Comment</p>:null}
            </div>
            {(flag)?<Reply allusers={props.allusers} a={props.a} image={props.image} setflag={setflag} userid={props.id} postid={props.a.postid} groupid={props.a.groupid}  setreplyflag1={props.setreplyflag1} replyflag1={props.replyflag1}/>:null}
        </div>
    </div>
  )
}
