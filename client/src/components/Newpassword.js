import React,{ useEffect, useState} from 'react'
import M from 'materialize-css'
import { Link, useNavigate, useParams } from 'react-router-dom'

const Newpassword = () => {
  const [password,setPassword] = useState('')
  const navigate = useNavigate()
  const {token} = useParams()

  useEffect(()=>{
    const isLogin = localStorage.getItem('user')
    if(isLogin){
      navigate('/home')
    }
  },[])
  
  const postData = ()=>{
      fetch('/new-password',{
        method:'post',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          password,
          token
        })
      }).then(res=>res.json())
        .then(data=>{
          if(data.message){
            M.toast({html: data.message,classes:'#ff8f00 amber darken-3'})
          }else{
            M.toast({html: data.error,classes:'#e53935 red darken-1'})
          }
        })
        .catch(err=>console.log(err))
  }

  return (
    <div>
      <div className='login-wrapper'>
        <h1 className='brand-logo'>Instagram</h1>
        <input type="text" placeholder='Enter new password' 
          value={password}
          onChange={(e)=>setPassword(e.target.value)} />
        
        <div className='btn-wrapper'>
        <p className='line'>Go to login page 
          <Link to={'/'}> <span>Click here</span> </Link> </p>
          <button className='btn'
            onClick={()=>postData()}>Update password</button>
        </div>
        
      </div>
    </div>
  )
}

export default Newpassword