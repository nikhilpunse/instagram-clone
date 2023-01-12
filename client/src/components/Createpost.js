import React, { useEffect, useRef, useState } from 'react'
import M from 'materialize-css'

const Createpost = () => {
  const [title,setTitle] = useState('')
  const [body,setBody] = useState('')
  const [image,setImage] = useState('')
  const [imageValue,setImageValue] = useState('')
  const [url,setUrl] = useState()
  const imageRef = useRef()
  
  const postDetails =()=>{
    const data = new FormData()
    data.append('file',image)
    data.append('upload_preset','instaClone')
    data.append('cloud_name','dedjgpaaf')
    const token = localStorage.getItem('token')
    // cloud request
    if(token){
      fetch('https://api.cloudinary.com/v1_1/dedjgpaaf/image/upload',
          {
           method:'post',
           body:data 
          } )
          .then(res=>res.json())
          .then(data=>{
            setUrl(data.url)
          })
          .catch(err=>console.log(err))
        }else{
          M.toast({html:'you are not login, please login',classes:'#c62828 red darken-3'})
        }
    }

 useEffect(()=>{
    if(url){
  //  database endpoint api request
  fetch('/createpost',{
    method:'post',
    headers:{
      'Content-Type':'application/json',
      'Authorization':localStorage.getItem('token')
    },
    body:JSON.stringify({
      title,
      body,
      pic:url
    })
  }).then(res=>res.json())
    .then(data=>{
      if(data.result){
        M.toast({html: 'posted sucessful in DB.',classes:'#43a047 green darken-1'});
      }else{
        M.toast({html: data.error,classes:'#c62828 red darken-3'});
      }
    })
    .catch(err=>console.log(err))
  }
}

  ,[url])

  return (
    <div className="createpost_wrapper">
        <div className='createpost_container'>
            <input type="text" 
              placeholder='Title'
              value={title}
              onChange={(e)=>{setTitle(e.target.value)}}
            />
            <input type="text"
              placeholder='Body'
              value={body}
              onChange={(e)=>{setBody(e.target.value)}}
            />
            <div style={{display:'flex'}}>
                <span className='up_img'
                  onClick={()=>imageRef.current.click()} >Upload Image</span>
                <input className='file_btn'
                  type="file"
                  ref={imageRef}
                  onChange={(e)=>{
                    setImage(e.target.files[0])
                    setImageValue(e.target.files[0].name)
                    }
                  }
                />
                
                <input type="text" value={imageValue} readOnly/>
            </div>
            <button className='btn' onClick={()=>{postDetails()}}>Submit Post</button>
        </div>
    </div>
  )
}

export default Createpost