import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const UserProfile = () => {
    const [myData,setMyData] = useState(JSON.parse(localStorage.getItem('user')))
    
    const [followers,setFollowers] = useState([])
    const [following,setFollowing] = useState([])
    const [data,setData] = useState([])
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [imgUrl,setImgUrl] = useState('')
    const {userId} = useParams()
  useEffect(()=>{
    fetch(`/user/${userId}`,{
        method:'get',
        headers:{
            'Content-type':'application/json',
            'Authorization':localStorage.getItem('token')
        }
        }).then(res=>res.json())
        .then(output=>{
            setFollowers(output.user.followers)
            setFollowing(output.user.following)
            setData(output.posts)
            setEmail(output.user.email)
            setName(output.user.name)
            setImgUrl(output.user.profilePic)
          })
            
        .catch(err=>console.log('Userprofile error : '+ err))
    },[])

    const followUser = ()=>{
      fetch('/follow',{
        method:'put',
        headers:{
          'Content-Type':'application/json',
          'Authorization':localStorage.getItem('token')
        },
        body:JSON.stringify({
          userId
        })
      }).then(res=>res.json())
      .then(output=>{
        setFollowers(output.followers.followers)
        setFollowing(output.following.following)
      })
      .catch(err=>console.log(err))
    }

    const unFollowUser = ()=>{
      fetch('/unfollow',{
        method:'put',
        headers:{
          'Content-Type':'application/json',
          'Authorization':localStorage.getItem('token')
        },
        body:JSON.stringify({userId})
      })
      .then(res=>res.json())
      .then(output=>{
        setFollowers(output.followers.followers)
        setFollowing(output.following.following)
      })
      .catch(err=>console.log(err))
    }

  return (
    <>
      <div className='profile-wrapper'>
        <figure >
          <img style={{width:'150px',borderRadius:'50%'}} src={imgUrl} alt="" />
        </figure>
        <div>
            <h3>{name}</h3>
            <h5>{email}</h5>
            <div className="">
              <h5>{data.length} post  { followers.length} followers  { following.length} following</h5>
              <h5>{followers && followers.includes(myData._id)
                    ? <span className='follow_btn'
                            onClick={()=>{unFollowUser()}}>Unfollow</span>
                    : <span className='follow_btn'
                            onClick={()=>followUser()}
                      >Follow</span> }
                   
              </h5>
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

export default UserProfile