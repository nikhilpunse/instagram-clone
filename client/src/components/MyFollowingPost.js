import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const MyFollowingPost = () => {
  const [data,setData] = useState([])
  const [user,setUser] = useState(JSON.parse(localStorage.getItem('user')))
  const [text,setText] = useState('')
  useEffect(()=>{
          fetch('/followingspost',{
            headers:{
              'Authorization':localStorage.getItem('token')
            }
          })
          .then(res=>res.json())
          .then(result=>{setData(result.userpost)
            console.log('initial data :' ,result.userpost)
          })
    },[])

    const likePost = (id)=>{
      fetch('/like',{
        method:'put',
        headers:{
          'Content-Type':'application/json',
          'Authorization':localStorage.getItem('token')
        },
        body:JSON.stringify({
          postId:id
        })
      })
      .then(res=>res.json())
      .then(output=>{
            const newData = data.map(item=>{
              if(item._id == output.result._id){
                return output.result
              }else{
                return item
              }
            })
            setData(newData)
       })
      .catch(err=>console.log('error :' + err))
    }
  
    const unlikePost = (id)=>{
      fetch('/unlike',{
        method:'put',
        headers:{
          'Content-Type':'application/json',
          'Authorization':localStorage.getItem('token')
        },
        body:JSON.stringify({
          postId:id
        })
      })
      .then(res=>res.json())
      .then(output=>{
        const newData = data.map(item=>{
          if(item._id == output.result._id){
            return output.result
          }else{
            return item
          }
        })
        setData(newData)
      })
      .catch(err=>console.log('error :' + err))
    }
  
    const sendComment = (id)=>{
      fetch('/comment',{
        method:'put',
        headers:{
          'Content-Type':'application/json',
          'Authorization':localStorage.getItem('token')
        },
        body:JSON.stringify({postId:id,text:text})
      })
      .then(res=>res.json())
      .then(output=>{
        const newData = data.map(item=>{
          if(item._id == output.result._id){
            return output.result
          }else{
            return item
          }
        })
        setData(newData)
        setText('')
      })
      .catch(err=>console.log(err))
    }
  
    const deletePost = (id)=>{
      console.log(id)
      fetch('/deletepost',{
        method:'delete',
        headers:{
          'Content-type':'application/json',
          'Authorization':localStorage.getItem('token')
        },
        body:JSON.stringify({postId:id})
      })
      .then(res=>res.json())
      .then(output=>{console.log(output.result)
             const newData = data.filter(item=>{
                if(item._id !== output.result._id){
                  return item
                }
             })
             setData(newData)
            })
      .catch(err=>{console.log(err)})
    }

return (
  <div style={{background:'#e6e2df',marginTop:'-14px',paddingTop:'20px'}}>
    <div className='Home_wrapper' style={{maxWidth:'550px',margin:'0px auto'}}>
          { 
            data.map(item=>{
              return(
                <div className="home_card " key={item._id}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h5 style={{paddingLeft:'5px',
                        cursor:'pointer'}}> 
                        <Link to={ (item.postedBy._id == user._id) ? '/profile' : `/profile/${item.postedBy._id}`}> {item.postedBy.name} </Link></h5>
                    <i className="material-icons del_btn"
                       onClick={()=>deletePost(item._id)}>delete</i>                    
                  </div>
                  <img style={{maxWidth:'550px',borderRadius:'2px'}} src={item.pic} alt="" />
                  <div style={{display:'flex'}}>
                    <i style={{color:'#d50000',marginLeft:'5px'}} className="material-icons">favorite</i>
                      {item.likes.includes(user._id) 
                      ? null 
                      : <i className="material-icons"
                        onClick={()=>{likePost(item._id)}}>thumb_up</i>}                 
                      {item.likes.includes(user._id) 
                      ? <i className="material-icons"
                        onClick={()=>{unlikePost(item._id)}}>thumb_down</i>
                      : null}
                   </div>
                  <h6>{item.likes.length} likes</h6>
                  <h6 style={{marginLeft:'5px'}}>{item.title}</h6>
                  <h6 style={{marginLeft:'5px'}}>{item.body}</h6>
                  
                  { item.comments.map((commentItem)=>{
                    return(
                            <h6
                              style={{marginLeft:'5px'}}
                              key={commentItem._id} > 
                                <span style={{fontWeight:'600'}}>{commentItem.postedBy.name}</span> {commentItem.text}</h6>
                           )
                  })}

                  <div style={{display:'flex'}}>
                    <input style={{maxWidth:'550px'}}
                          type="text" 
                          placeholder='comment here'
                          value={text}
                          onChange={(e)=>{setText(e.target.value)}}
                    />
                    <h6 className='comment_btn'
                        onClick={()=>{sendComment(item._id)}}>Send</h6>
                  </div>
                </div>
                )
            
            })
          
          }
            
    </div>
  </div>
  )
}

export default MyFollowingPost