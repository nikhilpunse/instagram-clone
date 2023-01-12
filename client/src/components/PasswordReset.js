import React,{ useEffect, useState} from 'react'
import M from 'materialize-css'
import { Link, useNavigate } from 'react-router-dom'

const PasswordReset = () => {
  const [email,setEmail] = useState('')
  const navigate = useNavigate()

  useEffect(()=>{
    const isLogin = localStorage.getItem('user')
    if(isLogin){
      navigate('/home')
    }
  },[])
  
  const postData = ()=>{
      fetch('/reset-password',{
        method:'post',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          email
        })
      }).then(res=>res.json())
        .then(data=>{
          if(data.message){
            M.toast({html: data.message,classes:'#ff8f00 amber darken-3'});
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
        <input type="text" placeholder='Email' 
          value={email}
          onChange={(e)=>setEmail(e.target.value)} />
                
        <div className='btn-wrapper'>
        <p className='line'>Go to login page 
          <Link to={'/'}> <span>Click here</span> </Link> </p>
          <button className='btn'
            onClick={()=>postData()}>Reset</button>
        </div>
        
      </div>
    </div>
  )
}

export default PasswordReset