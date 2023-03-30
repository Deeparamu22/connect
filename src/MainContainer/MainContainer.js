import React, { useEffect, useState } from 'react'
import style from './MainContainer.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-regular-svg-icons'
import { faChalkboardUser, faUsersLine } from '@fortawesome/free-solid-svg-icons'
import { faArrowsLeftRightToLine } from '@fortawesome/free-solid-svg-icons'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import SlideIn from '../SlideIn/SlideIn'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import RequestPage from '../RequestPage/RequestPage'
import Fade from 'react-reveal/Fade';
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import PostSmallDiv from '../PostSmallDiv/PostSmallDiv'
import Threedots from '../Threedots/Threedots'

export default function MainContainer(props) {
      const [transtion1,settransition]=useState(false);
      const [slideRight,setslideRight]=useState({});
      const [name,setname]=useState('');
      const [role,setrole]=useState('');
      const [flag1,setflag1]=useState(false);
      const [tagname,settagname]=useState(null)
      const [groups,setgroups]=useState([]);
      const navigate=useNavigate();
      const [id,setid]=useState();
      const [image,setimage]=useState('')
      const colorarr=['#ff4451','#4cb1ff','#9248A4','#009276','#F9C300'];
      const [selectgroup,setselectgroup]=useState('myfeeds');
      const [membersCount,setmembersCount]=useState(0);
      const [adminInfo,setadminInfo]=useState();
      const [showmembers1,setshowmembers1]=useState(false);
      const [Inputboxshow,setInputboxshow]=useState(false);
      const [titleshow,settitleshow]=useState(false);
      const [selectgroupflag,setselectgroupflag]=useState(false);
      const [selectgroupForpost,setselectgroupForpost]=useState('Select');
      const [postDetails,setpostDetails]=useState({title:'',post:''});
      const [posts,setposts]=useState([]);
      const [allusers,setallusers]=useState([]);
      const [suggesedgroups,setsuggesedgroups]=useState([]);
      const [editflag,seteditflag]=useState(false);
      const [alllike,setalllike]=useState([]);
      const [likeflag,setlikeflag]=useState(false);
      const [selecttag,setselecttag]=useState(null);
      const [fav,setfav]=useState([]);
      const [favflag,setfavflag]=useState(false);
      const [trandingtags,settrandingtags]=useState([]);
      const [sidebarFlag,setsidebarFlag]=useState('feeds');
      const [threedotsflag,setthreetdotsflag]=useState(false);
     let r=-1;

      useEffect(()=>{
        if(Cookies.get().username===undefined){
          navigate('/');
        }
        getusername();
        getallusers();
        getgroupInfo();

        props.setgroupName(selectgroup);
      },[Inputboxshow,selectgroup,flag1,editflag,likeflag,favflag,selecttag]);
      
//get group members and information      
      const getgroupInfo=async()=>{
        const result =await fetch(`http://172.17.56.144:5997/upload/${selectgroup}`);
        const jsonresult=await result.json();
        setmembersCount(jsonresult.length);
        props.setmembers(jsonresult);
       
        const result1 =await fetch(`http://172.17.56.144:5997/addmembers/${selectgroup}`);
        const jsonresult1=await result1.json();
        setadminInfo(jsonresult1[0]);
        props.setadminId(jsonresult1[0].id);
      }

//get current user
      const getusername=async()=>{
        const result =await fetch(`http://172.17.56.144:5997/currentuser/${Cookies.get().username}`);
        const jsonresult=await result.json();
        setimage(jsonresult[0].profileImage);
        setname(jsonresult[0].username);
        setrole(jsonresult[0].role);
        setid(jsonresult[0].id);
        getGroups(jsonresult[0].id);
        getposts(jsonresult[0].id);
        handlelike(jsonresult[0].id);
        handleSugggestedGroups(jsonresult[0].id);
        getfavourites(jsonresult[0].id);
       
      }
      
//get favouite groups
      const getfavourites=async(id)=>{
        const result =await fetch(`http://172.17.56.144:5997/favgroup/${id}`);
        const jsonresult=await result.json();
        setfav(jsonresult);
      }

//handle tranding tags
      const handletrandingtags=async(e,tag)=>{
        settagname(tag);
        const result =await fetch(`http://172.17.56.144:5997/gettrandingTags/${tag.slice(1)}`);
        const jsonresult=await result.json();
        setselecttag(jsonresult.map(a=>a.postid));
      }

//get posts
      const getposts=async(id)=>{
        const result =await fetch(`http://172.17.56.144:5997/addpost/${id}`);
        const jsonresult=await result.json();
        if(selecttag!=null){
          setposts(jsonresult.filter(a=>selecttag.includes(a.postid)));
        }
        else if(selectgroup!=='myfeeds'){
          setselectgroupForpost(selectgroup);
          
          setposts(jsonresult.filter(a=>a.groupid===groups.filter(a=>a.groupName===selectgroup)[0].groupId));
        }
        else{
          setposts(jsonresult);
          setselectgroupForpost('Select');
          const result =await fetch(`http://172.17.56.144:5997/trandingTags`);
          const jsonresult1=await result.json();
          let arr=jsonresult1.filter(b=>jsonresult.map(a=>a.postid).includes(b.postid)).map(a=>a.tag);
          settrandingtags([...new Set(arr)]);

        }
      }

//get user groups
      const getGroups=async(id)=>{
        await fetch(`http://172.17.56.144:5997/createGroup/${id}`)
        .then((response) => {return response.json()})
        .then((data) => { 
          setgroups(data);
        })
        .catch((err)=>{
          console.log(err);
        })
      }

// get all users 
      const getallusers=async()=>{
        const result =await fetch(`http://172.17.56.144:5997/`)
        const jsonresult=await result.json();
        setallusers(jsonresult);
      }

//remove cookies      
      const handleRemoveCookie=()=>{
        Cookies.remove(Object.keys(Cookies.get())[0]);
        navigate('/');
      }
      
// suggested groups 
      const handleSugggestedGroups=async(id)=>{
        const result =await fetch(`http://172.17.56.144:5997/suggestedGroups/${id}`)
        const jsonresult=await result.json();
        setsuggesedgroups(jsonresult.slice(0, 5));
      }

//join groups
      const handlejoinGroup=async(a,e)=>{
        setflag1(!flag1)
        let post={
          groupid:e,
          role:'participants'
        }
        await fetch(`http://172.17.56.144:5997/suggestedGroups/${id}`,{
          method:"POST",
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(post),
        })
      }

//add post
      const handlePost=async()=>{
        // console.log()
        if(groups.filter(a=>a.groupName===selectgroupForpost)[0]===undefined){
          alert('please select the group')
        }
        else if(postDetails.post===''){
          alert('Post content should not be empty');
        }
        else{
          const post={
            title:postDetails.title,
            post:postDetails.post,
            groupId:groups.filter(a=>a.groupName===selectgroupForpost)[0].groupId,
            userId:id
          }
          const result=await fetch("http://172.17.56.144:5997/addpost",{
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(post),
          })
          const jsonresult=await result.json();
          console.log(jsonresult);
          setInputboxshow(false);
        }
      }

//delete post 
      const handleDeletePost=async(e,id1)=>{
        const result =await fetch(`http://172.17.56.144:5997/deletepost/${id1}/${id}`)
        const jsonresult=await result.json();
        if(selectgroup!=='myfeeds'){
          setselectgroupForpost(selectgroup);
          setposts(jsonresult.filter(a=>a.groupid===groups.filter(a=>a.groupName===selectgroup)[0].groupId));
        }
        else{
          setposts(jsonresult);
          setselectgroupForpost('Select');
        }
      }

//like post      
      const handlelike=async(id1)=>{
        const result =await fetch(`http://172.17.56.144:5997/like/${id1}`)
        const jsonresult=await result.json();
        setalllike(jsonresult);
      }

//favouite groups
      const handleFav=async(e,groupid,userid,flag)=>{
        if(!flag){
          setfavflag(!favflag);
          const result =await fetch(`http://172.17.56.144:5997/deletefav/${userid}/${groupid}`)
          const jsonresult=await result.json();

        }
        else{
          setfavflag(!favflag);
          await fetch(`http://172.17.56.144:5997/favgroup`,{
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({groupid:groupid,userid:userid}),
          })
        } 
      }

      useEffect(()=>{

      },[groups,id,navigate,adminInfo,showmembers1,selectgroupForpost,posts,fav,props,selectgroup])

  return (
    <Fade>    
      <div className={style.whole}>

{/* //topcontainer */}
        <div className={style.topContainer}>
          <img src='../assests/zoho_connect.1f81c4988a541c0069fafe849e1bcb0a(1).svg' className={style.connectimg} alt=''/>
          <h1>Connect</h1>
          <FontAwesomeIcon icon={faBell} className={style.bell}/>
          <div  onClick={()=>setslideRight({marginLeft:"145vh"})}>
            <img src={'../assests/'+image} alt=''className={style.profilephoto} />
          </div>
        </div> 

{/* //mainContainer */}
        <div className={style.mainContainer}>
          <div className={style.sidebar}>
            <div className={style.sidesmall} onClick={()=>setsidebarFlag('feeds')}>
              <div> <img src={(sidebarFlag!=='feeds')?'../assests/Screenshot from 2023-03-09 15-36-55.png':'../assests/colorfeeds.png'} alt='fjf'/></div>
              <p className={style.feeds}>Feeds</p>
            </div>
            <br></br>
            <div className={style.sidesmall} onClick={()=>setsidebarFlag('group')}>
              <FontAwesomeIcon icon={faUsersLine} className={style.icon} style={(sidebarFlag==='group')?{backgroundColor:"#505bb1"}:null}/>
              <p className={style.feeds}>Group</p>
            </div>
            <br></br>
           { (role==='admin')?<div className={style.sidesmall} onClick={()=>setsidebarFlag('request')}>
              <FontAwesomeIcon icon={faUserCheck} className={style.icon}/>
              <p className={style.feeds}>Request</p>
            </div>:null}
            <FontAwesomeIcon icon={faArrowsLeftRightToLine} className={style.expand} onClick={() => settransition(!transtion1)}/>
          </div>

{/* //slide left transition */}
        <SlideIn transtion1={transtion1}>
          <div className={style.slidebar}>
            <label>
              <input type={'radio'} name={'groups'} onClick={(e)=>{setselectgroup(e.target.value);setselecttag(null)}} defaultChecked={selectgroup==='myfeeds'} value={"myfeeds"} className={style.radiobtn}/>
              <div  className={style.groupSmalldiv}>
                <FontAwesomeIcon icon={faChalkboardUser} className={style.myfeedicon}/><span>My Feeds</span>
              </div>
            </label>
            {(fav.length!==0)?<p className={style.groups}>Favouite</p>:null}
            {(fav.length!==0)?groups.filter(b=>fav.map(a=>a.groupid).includes(b.groupId)).map(a=><label key={a.groupName}>
                  <input type={'radio'} name={'groups'} onClick={(e)=>{setselectgroup(e.target.value);setselecttag(null)}} value={a.groupName} className={style.radiobtn}/>
                  <div className={style.groupSmalldiv}>
                      <div className={style.slidegroupicon}>{a.groupName[0]}</div>
                      <p>{a.groupName}</p>
                  </div>
              </label>):null}
            <p className={style.groups}>Groups</p>
            {
              groups.map(a=>{
                return <label key={a.groupName}>
                  <input type={'radio'} name={'groups'} onClick={(e)=>{setselectgroup(e.target.value);setselecttag(null)}} value={a.groupName} className={style.radiobtn}/>
                  <div className={style.groupSmalldiv}>
                      <div className={style.slidegroupicon}>{a.groupName[0]}</div>
                      <p>{a.groupName}</p>
                  </div>
              </label>
              })
            }
            <Link to={`/form/${id}`} style={{ textDecoration: 'none',marginTop:'auto'}}><div className={style.slidebarLastdiv}><div className={style.symbolcircle}>+</div>New Group</div></Link>
          </div>
        </SlideIn>

{/* REquest Container */}
{(sidebarFlag=='request')? <RequestPage/>:null}
 {             (sidebarFlag=='feeds')?
              <Fade>
                  <div className={style.mainWhole}>
                  {(selecttag!==null)?
                    <div className={style.GroupTitleDiv}>
                      <div className={style.groupiconForGroupTitleDiv}>#</div>
                      <div className={style.grouptextForGroupTitleDiv}>Tags / {tagname.slice(1)}</div>
                      <div className={style.membersDiv}>
                        <p>{selecttag.length}</p>
                        <p>Posts</p>
                      </div>
                    </div>:null}
                  {(selectgroup!=='myfeeds')?
                    <div className={style.GroupTitleDiv}>
                      <div className={style.groupiconForGroupTitleDiv}>{selectgroup[0]}</div>
                      <div className={style.grouptextForGroupTitleDiv}>{selectgroup}</div>
                      <p onClick={()=>setthreetdotsflag(true)}>
                        <i class="fa-solid fa-ellipsis"></i>
                        {(threedotsflag)?<Threedots/>:null}
                        </p>
                      <div className={style.membersDiv} onClick={()=>{setshowmembers1(!showmembers1);props.setflag(true)}}>
                        <p>{membersCount}</p>
                        <p>Members</p>
                      </div>
                    </div>:null}
                  <div className={style.main}>
                    <div className={style.innerWholeDiv}>

{/* post input div */}
                      {(selecttag===null)?<div className={style.abovediv}>
                        <div style={{backgroundImage:"url('../assests'"+{image}+"')"}}>
                          <img src={"../assests/"+image} alt=''className={style.profilephoto} />
                        </div>
                        {(Inputboxshow)?
                          <div className={style.textAreawhole}>
                            {(titleshow)?<input type={'text'} className={style.titleinput} placeholder={'Add your title'} autoFocus onChange={(e)=>setpostDetails({...postDetails,title:e.target.value})}/>:null}
                            <textarea rows={20} className={style.textarea1} placeholder={"What's on you mind right now?"} autoFocus onChange={(e)=>setpostDetails({...postDetails,post:e.target.value})}></textarea>
                          </div>
                        :<p className={style.what} onClick={()=>setInputboxshow(!Inputboxshow)}>What's on you mind right now?</p>
                        }
                        {(Inputboxshow)? <div className={style.tileClickbtn} onClick={()=>settitleshow(!titleshow)}>T</div>:null}
                      </div>:null}

                      {(Inputboxshow)?
                        <div className={style.submitwholeDiv}>
                          {(selectgroup==='myfeeds')?
                          <button className={style.sharebtn1}>
                            <p onClick={()=>setselectgroupflag(!selectgroupflag)}>{selectgroupForpost}</p>
                            {(selectgroupflag)?
                              <div className={style.showgroups}>
                                {groups.map(a=>{
                                  return <label key={a.groupName}>
                                            <input type={'radio'} value={a.groupName} className={style.radiobtn} onClick={(e)=>{setselectgroupForpost(e.target.value);setselectgroupflag(false)}} defaultChecked={selectgroupForpost===a.groupName}/>
                                            <p  className={style.absolutegroupname}>{a.groupName}</p>
                                          </label>
                                })}
                              </div>:null}
                          </button>:null}
                          <button className={style.sharebtn} onClick={handlePost}>Share</button>
                        </div>:null}

{/* post div */}
              {(posts.length===0)?<div className={style.nothingfeed}>
              <img src='assests/index-removebg-preview.png' alt='connection'/>
            <p className={style.paratag}>Get conversations going.<br></br>
            Start conversations.<br></br>
            Post ideas.<br></br>
            Receive updates from co-workers.</p></div>
            :<div className={style.postwhole}>
              {
                posts.map(a=>{
                  return <PostSmallDiv a={a} allusers={allusers} id={id} handleDeletePost={handleDeletePost} seteditflag={seteditflag} image={image} alllike={alllike} setlikeflag={setlikeflag} likeflag={likeflag} keys={id}/>
              })
              }
              </div>}
          </div>

{/* -----------------------------suggestion div----------------------------------------------------- */}

          {(selecttag!=null)?
          <div className={style.innersideDiv}>
            <div className={style.about}>
              <p>Tranding tags</p>
              {
                trandingtags.map((a)=>{
                  return  <div className={style.taginside}   key={a} onClick={(e)=>{handletrandingtags(e,a)}}>
                            <div className={style.circletag}>
                              <i class="fa-solid fa-tag fa-rotate-90"></i>
                            </div>
                            <p>{a}</p>
                          </div>
                })
              }
            </div>
          </div>:null}
          {(selectgroup==='myfeeds'&&selecttag==null)?<div className={style.innersideDiv}>
            <div className={style.suggestionDiv}>
              <p>Suggesed Groups</p>
              {suggesedgroups.map((x) => 
              <div className={style.smallSugged} key={x.imageName}>
                {(x.imageName!=='')?<img src={'../assests/'+x.imageName} className={style.groupsmall} alt={x.imageName}/>:<div className={style.groupsmall} style={{backgroundColor: colorarr[++r]}}>{x.groupName[0]}</div>}
                <div>
                  <p>{x.groupName}</p>
                  <button className={style.join} onClick={(e)=>handlejoinGroup(e,x.groupId)}>Join</button>
                </div>
              </div>)}
            </div>
            <div className={style.TrandingDiv}>
              <p>Trending Tags</p>
              <div className={style.trandingtags}>
              {
                trandingtags.map((a)=>{
                  return <p className={style.tag} key={a} onClick={(e)=>{handletrandingtags(e,a)}}>{a}</p>
                })
              }
              </div>
            </div>
          </div>:(selecttag==null)?<div className={style.innersideDiv}>
          <div className={style.about}>
              <p>About</p>
              <p className={style.adminstration}>Adminstrators:</p>
              <div className={style.adminsDiv}>
                {(adminInfo!==undefined)?<img src={`assests/${adminInfo.profileImage}`} className={style.profilephoto1} alt=''/>:null}
                 </div>
            </div>
            </div>:null
            }
        </div>
        </div>
        </Fade>  :null}

        {(sidebarFlag==='group')?<Fade>
                          {/* groups components */}
            <div className={style.mainWhole}>

              <div className={style.GroupTitleDiv}>
                <div className={style.groupsmall} style={{backgroundColor:"#febb2c"}}>
                  <i className="fa-solid fa-user-group"></i>
                </div>
                <h3>My Groups</h3>
              </div>

              <div>
              {
                groups.map(a=>{
                  return  <div className={style.mygroupsmall} key={a.imageName}>
                            {(a.imageName!=='')?<img src={'../assests/'+a.imageName} className={style.groupsmall} alt={a.imageName}/>:<div className={style.groupsmall} style={{backgroundColor: colorarr[++r]}}>{a.groupName[0]}</div>}
                            <p  className={style.absolutegroupname}>{a.groupName}</p>
                            {(fav.filter(b=>b.groupid===a.groupId).length!==0)?<p className={style.star} onClick={(e)=>handleFav(e,a.groupId,id,false)}><i className="fa-solid fa-star"></i></p>:<p className={style.star} onClick={(e)=>handleFav(e,a.groupId,id,true)}><i className="fa-regular fa-star"></i></p>}
                          </div>
                })
              }
              </div>
            </div>

        </Fade>:null}

{/* //////////////////////////////////////////////////// slideRight ///////////////////////////*/}
         <div className={style.right} style={slideRight}>

              <div className={style.profileImageDiv}>
                  <p onClick={()=>setslideRight({marginLeft:"175vh"})} className={style.close}><FontAwesomeIcon icon={faXmark} className={style.xmark}/></p>
                  <div className={style.profileImage1}><img src={'../assests/'+image} alt=''className={style.profilephoto2} /></div>
                  <p>{name}</p>
              </div>

              <div className={style.signout} onClick={handleRemoveCookie}><FontAwesomeIcon icon={faRightFromBracket} className={style.bell1}/> Sign Out</div>

         </div>

        </div>
      </div>
    </Fade>
  )
}
