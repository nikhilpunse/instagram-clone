import React, { useEffect, useRef, useState } from 'react'
import M from 'materialize-css'

const Profile = () => {
  const [data,setData] = useState([])
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [userId,setUserId] = useState(JSON.parse(localStorage.getItem('user')))
  const [followers,setFollowers] = useState([])
  const [following,setFollowing] = useState([])
  const [pic,setPic] = useState('')
  const imageRef = useRef()
  const [img,setImg] = useState('')
  const [url,setUrl] = useState('')

  useEffect(()=>{
    fetch('/mypost',{
      headers:{
        'Authorization':localStorage.getItem('token')
      }
    }).then(res=>res.json())
    .then(data=>{setData(data.mypost)})
    .catch(err=>console.log('profile error : '+ err))
    

    fetch('/user',{
      method:'get',
      headers:{
          'Content-type':'application/json',
          'Authorization':localStorage.getItem('token')
      }
      }).then(res=>res.json())
      .then(output=>{
          setFollowers(output.user.followers)
          setFollowing(output.user.following)
          setEmail(output.user.email)
          setName(output.user.name)
          setUrl(output.user.profilePic)
        })
      .catch(err=>console.log('Userprofile error : '+ err))
  
    }
  ,[])

  const postPic = ()=>{
    const imgData = new FormData()
    imgData.append('file',img)
    imgData.append('upload_preset','instaClone')
    imgData.append('cloud_name','dedjgpaaf')

    const token = localStorage.getItem('token')
    // cloud request
    if(token){
      fetch('https://api.cloudinary.com/v1_1/dedjgpaaf/image/upload',
          {
           method:'post',
           body:imgData 
          } )
          .then(res=>res.json())
          .then(data=>{
            setUrl(data.url)
            console.log(data.url)
           
            if(data.url){
                fetch('/profilepic',{
                  method:'post',
                  headers:{
                    'Content-Type':'application/json',
                    'Authorization':localStorage.getItem('token')
                  },
                  body:JSON.stringify({picUrl:data.url})
                }).then(res=>res.json())
                .then(output=>{
                  console.log(output)
                })
            } 

          })
          .catch(err=>console.log(err))
        }else{
          M.toast({html:'Uploading Image Failed',classes:'#c62828 red darken-3'})
        }

  }

  return (
    <>
      <div className='profile-wrapper'>
        <figure >
        
        {url ? <img style={{width:'150px',borderRadius:'50%'}} 
              src={url} 
              alt="" /> 
             : 
             <div>
                <i className="material-icons pic_icon" >person_pin</i>
              </div>
        }
        <input className='file_btn' 
                  type='file' 
                  ref={imageRef}
                  onChange={(e)=>{setImg(e.target.files[0])}}
        /> 

        {img? <p className='profile_img_btn'
                 onClick={()=>{postPic()
                               setImg('')
                              }}>Upload</p> 

                : <p className='pic_btn profile_img_btn' 
           onClick={()=>{imageRef.current.click()}}
            >Update Pic</p>
        }
        </figure>
        <div>
            <h3>{name}</h3>
            <h5>{email}</h5>
            <div className="">
              <h5>{data.length} post  {followers.length} followers  {following.length} following</h5>
            </div>
        </div>
      </div>
      <div className="profilepic_wrapper">
      {
        data.map(item=>{
          return(<img src={item.pic} className='profpic' alt="" key={item._id}/>)
        })
      }
      </div>
    </>
  )
}

export default Profile