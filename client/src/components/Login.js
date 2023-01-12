import React,{ useEffect, useState} from 'react'
import M from 'materialize-css'
import { Link, useNavigate } from 'react-router-dom'

const Login = ({setLogoutState}) => {
  const [email,setEmail] = useState('nikhil.punse5@gmail.com')
  const [password,setPasssword] = useState('123456')
  const navigate = useNavigate()

  useEffect(()=>{
    const isLogin = localStorage.getItem('user')
    if(isLogin){
      navigate('/home')
    }
  },[])
  
  const postData = ()=>{
      fetch('/login',{
        method:'post',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          email,password
        })
      }).then(res=>res.json())
        .then(data=>{
          if(data.token){
            M.toast({html: 'Login sucessful.',classes:'#43a047 green darken-1'});
            localStorage.setItem('token',data.token)
            localStorage.setItem('user',JSON.stringify(data.user))
            setLogoutState(false)
            navigate('/home')
          }else{
            M.toast({html: data.error,classes:'#c62828 red darken-3'});
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
        <input type="password" placeholder='Password'
          value={password} onChange={(e)=>setPasssword(e.target.value)} />
        
        <div className='btn-wrapper'>
        <p className='line'>Don't have account 
          <Link to={'/signup'}> <span>Click here</span> </Link> </p>

          <p className='line'>Forget Password? 
          <Link to={'/passwordreset'}> <span>Click here</span> </Link> </p>

          <button className='btn'
            onClick={()=>postData()}>Login</button>
        </div>
        
      </div>
    </div>
  )
}

export default Login