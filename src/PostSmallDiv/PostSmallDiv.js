import React, { useEffect, useRef, useState } from 'react'
import EditComponent from '../EditComponent/EditComponent';
import Reply from '../Reply/Reply';
import ReplyDiv from '../ReplyDiv/ReplyDiv';
import style from './PostSmallDiv.module.css'
export default function PostSmallDiv(props) {
    const [editflag,seteditflag]=useState(false);
    const inputref=useRef(null);
    const postref=useRef(null);
    const [flag,setflag]=useState(false);
    const [update,setupdate]=useState({title:'',post:''});
    const [replies,setreplies]=useState([]);
    const [replyflag,setreplyflag]=useState(false);
    const [replyflag1,setreplyflag1]=useState(false);
    const [deleteflag,setdeleteflag]=useState(false);
   const [editshow,seteditshow]=useState(false); 
   const [likescount,setlikecount]=useState([]);
    const handleUpdate=async(e,postid,userid,groupid)=>{
        const result=await fetch("http://172.17.56.144:5997/update",{
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({groupid:groupid,userid:userid,post:postref.current.value,title:inputref.current.value,postid:postid})
    })
    await result.json()
    seteditflag(!editflag)
    props.seteditflag(true);
    }
    useEffect(()=>{
       
        getreplies();
        getlikes();
        // if((props.alllike.filter(a=>a.postid===props.a.postid)[0]!==undefined)&&(Boolean(props.alllike.filter(a=>a.postid===props.a.postid)[0].like))){
        //     console.log(Boolean(props.alllike.filter(a=>a.postid===props.a.postid)[0].like));
        // }
      
    },[props.a.postid,flag,replyflag,replyflag1,props.likeflag])
    const getreplies=async()=>{
        const result =await fetch(`http://172.17.56.144:5997/reply/${props.a.postid}`);
        const jsonresult=await result.json();
        setreplies(jsonresult);
    }
    const getlikes=async()=>{
        const result =await fetch(`http://172.17.56.144:5997/getlikes/${props.a.postid}`);
        const jsonresult=await result.json();
        setlikecount(jsonresult);

    }
    const handlelike=async(e,id,like,status,id2)=>{
  
        const result=await fetch("http://172.17.56.144:5997/like/"+props.id+"",{
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({userid:props.allusers.filter(b=>b.id===props.id)[0].id,like:like,postid:id,replyid:0,status:status,id:id2}),
    })
    await result.json();
    props.setlikeflag(!props.likeflag);
    }
    useEffect(()=>{
        getreplies();
    },[deleteflag]);
  return (
    <div className={style.whole}>

        <div className={style.posttop}>
            <img src={`../assests/${props.allusers.filter(b=>b.id===props.a.userid)[0].profileImage}`} className={style.profilephoto} alt=''/>
            <p className={style.startCon}><span>{props.allusers.filter(b=>b.id===props.a.userid)[0].username}</span> has started a conversation</p>
            {(props.id===props.a.userid)?<div className={style.threedots}>
                <p onClick={()=>seteditshow(!editshow)}><i className="fa-solid fa-ellipsis"></i></p>
            {(editshow)?<EditComponent seteditflag={seteditflag} editflag={editflag} a={props.a.postid} handleDeletePost={props.handleDeletePost} seteditshow={seteditshow} editshow={editshow}/>:null}
            </div>:null}
        </div>

        <div className={style.postInner1}>
            {(editflag)?<input defaultValue={props.a.title}  className={style.titleinput} onChange={(e)=>setupdate({...update,title:e.target.value})} autoFocus ref={inputref} placeholder={"Enter the Title"}/>:<h4>{props.a.title}</h4>}
            {(editflag)?<textarea defaultValue={props.a.post} className={style.textarea1} onChange={(e)=>setupdate({...update,post:e.target.value})} ref={postref}></textarea>:<pre className={style.startCon}>{props.a.post}</pre>}
            {(editflag)?<div className={style.updatewhole}>
                <button className={style.sharbtn1}  onClick={()=>seteditflag(!editflag)}>Cancel</button>
                <button className={style.sharbtn} onClick={(e)=>handleUpdate(e,props.a.postid,props.a.userid,props.a.groupid)}>Update</button>
            </div>:null}
            <div className={style.postbottom}>
                 {
                    (props.alllike.filter(a=>a.postid===props.a.postid)[0]===undefined)?<p className={style.startCon}><i className="fa-regular fa-thumbs-up" onClick={(e)=>handlelike(e,props.a.postid,true,'new')}></i> Like</p>:
                    (new RegExp("true").test(props.alllike.filter(a=>a.postid===props.a.postid)[0].like))?<p className={style.startCon} style={{color:'#00b792'}}><i className="fa-solid fa-thumbs-up" onClick={(e)=>handlelike(e,props.a.postid,false,'already',props.alllike.filter(a=>a.postid===props.a.postid)[0].id)}></i> Liked</p>:
                    <p className={style.startCon}><i className="fa-regular fa-thumbs-up" onClick={(e)=>handlelike(e,props.a.postid,true,'already',props.alllike.filter(a=>a.postid===props.a.postid)[0].id)}></i> Like</p>
                }
                <i className="fa-regular fa-message" onClick={()=>setflag(!flag)}></i><p className={style.startCon} onClick={()=>setflag(!flag)}>Comment</p>
            </div>
            
        </div>
       { (likescount.length!==0)?<div className={style.likeDiv}>
        <p className={style.startCon} style={{color:'#00b792'}}><i className="fa-solid fa-thumbs-up"></i></p>
        <p>{likescount.length}</p>
        </div>:null}
        {(flag)?<Reply allusers={props.allusers} a={props.a} image={props.image} setflag={setflag} userid={props.id} postid={props.a.postid} groupid={props.a.groupid}/>:null}
        {
            replies.map(a=>{
                return <ReplyDiv key={a} image={props.image} allusers={props.allusers} a={a} id={props.id} setreplyflag={setreplyflag} replies={replies} setreplyflag1={setreplyflag1} replyflag1={replyflag1} setdeleteflag={setdeleteflag} deleteflag={deleteflag} alllike={props.alllike} setlikeflag={props.setlikeflag} likeflag={props.likeflag}/>
            })
        }
    </div>
  )
}