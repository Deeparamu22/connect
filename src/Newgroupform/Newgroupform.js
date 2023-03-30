import React, { useEffect, useRef, useState } from 'react'
import style from './Newgroupform.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Fade from 'react-reveal/Fade';
import Cookies from 'js-cookie';
import axios from 'axios';
// import { faCamera } from '@fortawesome/free-regular-svg-icons'

export default function Newgroupform(props) {
  const [users1,setusers1]=useState([]);
  const [users,setusers]=useState([]);
  const [names,setnames]=useState([]);
  const [flag,setflag]=useState(false);
  const [addmembers,setaddmembers]=useState([]);
  const [Image,setImage]=useState({ preview: '', data: '' })
  const inputref=useRef(null);
  const [groupInfo,setgroupInfo]=useState({name:'',description:"",imageName:""})
  const [msg,setmsg]=useState("");
  const navigate=useNavigate();
  const id=useParams();

  //get users 
  const getusers=async()=>{
    const result =await fetch(`http://172.17.56.144:5997/`)
      const jsonresult=await result.json();
      jsonresult.splice(jsonresult.indexOf(jsonresult.filter(a=>a.username===Cookies.get().username)[0]),1);
      for(var i=0; i<jsonresult.length; i++){
        jsonresult[i].username=jsonresult[i].username.toLowerCase();
      }
      setusers1(jsonresult);
      setnames(jsonresult.map(a=>a.username));
  }
  useEffect(()=>{
    getusers();
  },[])

  //use to hide the user box
  useEffect(()=>{ 
    if(users.length===0){
      setflag(false);
    }
    if(inputref.current.value===''){
      setflag(false);
    }
  },[users,addmembers,users1]);
  

  //search users input onchange function
  const handlemembers=(e)=>{
    setflag(true);
    let r=names.filter(a=>a.includes(e.target.value.toLowerCase()));
    setusers(users1.filter(a=>r.includes(a.username)));
  }

  //select the users and add addmembers useState
  const handleClick=(e,id)=>{
    inputref.current.value='';
    setaddmembers(addmembers.concat(users1.filter(a=>a.id===id)[0]));
    users1.splice(users1.indexOf(users1.filter(a=>a.id===id)[0]),1);
  }

  //remove the members and add in to the users from the add members usestate
  const handleRemove=(e,id)=>{
    console.log(addmembers.filter(e=>e.id===id))
    setusers1(users1.concat(addmembers.filter(e=>e.id===id)));
    addmembers.splice(addmembers.indexOf(addmembers.filter(e=>e.id===id)[0]),1);
    
  }

  //group profile function
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile && selectedFile.type.includes("image/")) {
    const img = {
      preview: URL.createObjectURL(selectedFile),
      data: selectedFile,
    }
    setgroupInfo({...groupInfo,imageName:selectedFile.name})
    setImage(img)
  }
  else{
    setImage({ preview: '', data: '' });
    alert("Please select an image file");
  }
  }
  
  // use to push the group info to database
  const handleCreateGroup=async()=> {
    if(groupInfo.name!==''){
    const result=await fetch("http://172.17.56.144:5997/createGroup",{
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(groupInfo),
    })
    const resultJson1=await result.json();
    console.log(resultJson1);
    setmsg("");
    insertMemberTable(id.id,resultJson1[0].groupId);
  }
  else{
    setmsg("Hey, your group need a name");
  }
  }


  //add members in member table 
  const insertMemberTable=async(a,b)=>{
    // console.log(a,b);
    const result=await fetch("http://172.17.56.144:5997/addmembers",{
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({userid:a,groupid:b,role:'admin',participants:addmembers})
    })
    const resultJson1=await result.json()
    console.log(resultJson1);
    navigate("/main");
  }


  const handleSubmit=async(e)=>{
    if(Image.data!==''){
      e.preventDefault()
      const formData = new FormData();
      formData.append("file", Image.data);
      try {
        const res = await axios.post(
          "http://172.17.56.144:5997/upload",
          formData,
          {headers:{"Content-Type" : "multipart/form-data"}}
        );
        if (res) console.log(res.statusText);
      } catch (ex) {
        console.log(ex);
      }
    }
  }
  return (
    <Fade>
    <div className={style.whole}>
      <div>
        <div className={style.rotatediv}></div>
        <div className={style.rotatediv1}></div>
      <img src='../assests/people-of-different-nationalities-portrait-image_csp95621075-removebg-preview.png' alt='threeperson' className={style.threeperson}/>
      <Link to={'/main'}><FontAwesomeIcon icon={faXmark} className={style.xmark}/></Link>
      
      </div>
      <div className={style.formcontainer}>
        <p className={style.msg}>{msg}</p>
        <div>
        <p className={style.create}>Create new Group</p>
        <p className={style.withGroup}>With Groups, you can provide your team with the space to work together, and the right tools to get things done, the smart way.</p>
        </div>
        <form onSubmit={handleSubmit}>
        <div className={style.groupnamecontainer}>
        <label className={style.cameraContainer}>

            <input type={'file'} accept='images/*' className={style.fileInput} onChange={handleFileChange} name={'file'} required/>
            {(Image.preview!=='')?<img src={Image.preview} width='100' height='100' className={style.profileImage} alt=''/>: <FontAwesomeIcon icon={faCamera} />}
       
          </label>
          
          <div>
            <p className={style.groupName}>Group Name</p>
            <input type={'text'} className={style.inputDiv} placeholder={'Enter Group Name'} onChange={(e)=>setgroupInfo({...groupInfo,name:e.target.value})}/>
            <p className={style.givegroup}>Give your Group a name.</p>
          </div>
          </div>
          <div className={style.descriptionContainer}>
            <p>Description</p>
            <textarea className={style.descriptionTextArea} onChange={(e)=>setgroupInfo({...groupInfo,description:e.target.value})}></textarea>
            <p className={style.withGroup}>Briefly describe what this Group is all about.</p>
          </div>
          <div>
            <p>Member</p>
            <div className={style.inputDiv1}>
              {
                addmembers.map(a=><div className={style.assignMember} key={a.profileImage}>
                  <img src={'../assests/'+a.profileImage} className={style.profileImage} alt=""/>
                  <p>{a.username}</p>
                  <FontAwesomeIcon icon={faXmark} onClick={(e)=>handleRemove(e,a.id)}/>
                  </div>)
              }
              <input type={'text'} placeholder={'Add Members'} className={style.addMembers} onInput={handlemembers} ref={inputref}/>
              </div>
            <p className={style.withGroup}>Get your team together by adding individual users to your Group by user name or email.</p>
          </div>

          {(flag)?<div className={style.absolute}>
            {
              users.map(a=>
                {
                  return <div className={style.innerDiv} onClick={(e)=>handleClick(e,a.id)} key={a.profileImage}>
                    <img src={'../assests/'+a.profileImage} className={style.profile} alt=''/>
                    <p style={{textTransform: "capitalize"}}>{a.username}</p>
                  </div>
                }
                )
            }
          </div>:null}
          <div className={style.flexright}>
            <button className={style.createbut} type={'submit'} onClick={handleCreateGroup}>Create</button>
          </div>
          </form>
        </div>
      </div>
      </Fade>
  )
}
