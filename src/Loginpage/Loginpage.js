import React, { useEffect, useRef, useState} from 'react'
import style from './Loginpage.module.css'
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import Loading from '../Loading/Loading';
import Fade from 'react-reveal/Fade';

export default function Loginpage(props){
  const username=useRef(null);
  const password=useRef(null);
  const confirmpassword=useRef(null)
  const [signuppage,setsignuppage]=useState(false);
  const navigate=useNavigate();
  const [invalidmsg,setinvalidmsg]=useState('');
  const [passswordshow,sertpasswordshow]=useState(true);
  const [Image,setImage]=useState({ preview: '', data: '' })
  const [status, setStatus] = useState('');
  const [flag,setflag]=useState(false);
  const [conpassswordshow,setconpasswordshow]=useState(true);
  const [signup,setsignup]=useState({username:'',password:'',confirmpassword:'',profileImage:''});
  const [signin,setsignin]=useState({username:'',password:''});

  useEffect(()=>{
      if(Cookies.get().username!==undefined){
        navigate('/main');
      }
    },[signup,signin,flag,props.flag,navigate]);

    //login function
    const handlelogin=async ()=>{
      const result1 =await fetch ("http://172.17.56.144:5997/signin",{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(signin)
      })
      const resultJson1=await result1.json();
      if(resultJson1[0]===undefined){
        setinvalidmsg('Invalid username')
      }
      else{
        setinvalidmsg('')
        Cookies.set("username", resultJson1[0].username);
        navigate('/main');
      }
    }

    //sigup function 
    const handlesignup=async()=>{
      const result =await fetch(`http://172.17.56.144:5997/`)
      const jsonresult=await result.json();
      if((signup.username.trim().length===0)&&signup.username===''){
        setinvalidmsg("Invalid username"); 
      }
      else if(jsonresult.map(a=>a.username).includes(signup.username.trim())){
        setinvalidmsg("username already exits")
      }
      else if(!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(signup.password))){
        setinvalidmsg("Invalid password"); 
      }
      else if(signup.confirmpassword!==signup.password){
        setinvalidmsg("confirm password not matched"); 
      }
      else if(signup.profileImage===''){
        setinvalidmsg("Profile photo required"); 
      }
      else{
        setflag(true);
        props.setflag(true);
        setinvalidmsg(""); 
        await fetch ("http://172.17.56.144:5997/signup",{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(signup)
        })
        username.current.value='';
        password.current.value='';
        confirmpassword.current.value='';
      }
    }

    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      if (selectedFile && selectedFile.type.includes("image/")) {
      const img = {
        preview: URL.createObjectURL(selectedFile),
        data: selectedFile,
      }
      setImage(img)
      setsignup({...signup,profileImage:selectedFile.name})
    }
    else{
      setImage({ preview: '', data: '' });
      alert("Please select an image file");
    }
    }

    const handleSubmit=async(e)=>{
      if(signup.profileImage!==''){
        e.preventDefault()
        const formData = new FormData();
        formData.append("file", Image.data);
        try {
          const res = await axios.post(
            "http://172.17.56.144:5997/upload",
            formData,
            {headers:{"Content-Type" : "multipart/form-data"}}
          );
          if (res) setStatus(res.statusText)
          console.log(status);
        } catch (ex) {
          console.log(ex);
        }
      }
      else if(signup.profileImage===''){
        setinvalidmsg("Profile photo required"); 
      }
      } 

    
  return (
    <div className={style.whole}>
   {(signuppage)?

  //sigin page 
   <div className={style.inputwholeContainer}>
        <img src='assests/Screenshot from 2023-03-09 06-43-56.png' className={style.zohologo} alt={'zohologo'}/>
        <p className={style.signintext}>Sign in </p>
        <p>to access Connect</p>
        <input type={'text'} className={style.inputStyle} placeholder={'Username'} onChange={(e)=>setsignin({...signin,username:e.target.value})} />
        <input type={(passswordshow)?'password':'text'} className={style.inputStyle} placeholder={'Password'}  onChange={(e)=>setsignin({...signin,password:e.target.value})} />
        {(passswordshow)?<img src='assests/view.png' className={style.eyeicon1}  onClick={()=>sertpasswordshow(!passswordshow)} alt={'eye'}/>:<img src='assests/hide.png' className={style.eyeicon1}  onClick={()=>sertpasswordshow(!passswordshow)} alt={'eye'}/>}
        <button className={style.buttonstyle} onClick={handlelogin}>Sign In</button>
       {(invalidmsg)?<p className={style.invalid}>{invalidmsg}</p>:null}
    </div>:

    //SIGNUP PAGE
    <div className={style.inputwholeContainer}>
        <img src='assests/Screenshot from 2023-03-09 06-43-56.png' className={style.zohologo} alt={'zohologo'}/>
        <p className={style.signintext}>Create your account </p>
        <form onSubmit={handleSubmit} className={style.form}>
        <div className={style.avatorWhole}>
          <label className={style.label}>
          <div className={style.avator}>
            <input type={'file'} accept='images/*' className={style.fileInput} onChange={handleFileChange} name={'file'} required/>
            {(Image.preview!=='')?<img src={Image.preview} width='100' height='100' className={style.profileImage} alt=''/>: <i className="fa-solid fa-camera"></i>}
          </div>
          </label>
        </div>
      
        <input type={'text'} className={style.inputStyle} placeholder={'Username'} onChange={(e)=>setsignup({...signup,username:e.target.value})} name={'username'} required ref={username}/> 
        <input type={(passswordshow)?'password':'text'} className={style.inputStyle} placeholder={'Password'} onChange={(e)=>setsignup({...signup,password:e.target.value})} name={'password'} required ref={password}/>
        {(passswordshow)?<img src='assests/hide.png' className={style.eyeicon}  onClick={()=>sertpasswordshow(!passswordshow)} alt={'eye'}/>:<img src='assests/view.png' className={style.eyeicon}  onClick={()=>sertpasswordshow(!passswordshow)} alt={'eye'}/>}
        <input type={(conpassswordshow)?'password':'text'} className={style.inputStyle} placeholder={'Confirm Password'} onChange={(e)=>setsignup({...signup,confirmpassword:e.target.value})} required ref={confirmpassword}/>
        {(conpassswordshow)?<img src='assests/hide.png' className={style.eyeicon2}  onClick={()=>setconpasswordshow(!conpassswordshow)} alt={'eye'}/>:<img src='assests/view.png' className={style.eyeicon2}  onClick={()=>setconpasswordshow(!conpassswordshow)} alt={'eye'}/>}
        <button className={style.buttonstyle} type={'submit'} onClick={handlesignup}>Sign Up</button>
        {(invalidmsg)?<p className={style.invalid}>{invalidmsg}</p>:null}
        </form>
        {(flag)?

          //POPUP
          <div className={style.loadingDiv}>
            <Fade>
            <Loading setflag={setflag} setflag1={props.setflag}/>
            </Fade>
          </div>:null}
    </div>}

  {/* IMAGE CONTAINER */}

    <div className={style.loginimagediv}>
        <img src='assests/mobile-login-concept-illustration_114360-83.jpg' className={style.loginpageimage} alt={'loginpageimage'}/>
        <div className={style.flexstyle}>
        {(signuppage)?<p>Don't have an account? </p>:<p>If already has an account</p>}
        <p className={style.textstyle} onClick={()=>setsignuppage(!signuppage)} >{(signuppage)?<span>Sign Up</span>:<span>Sign In</span>}</p>
        </div>
    </div>
  
</div>
  )
}