import React, { useState } from 'react'

import M from 'materialize-css'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const navigate = useNavigate()

  const postData = ()=>{
        fetch('/signup',{
          method:"post",
          headers:{
            "Content-type":"application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        }).then(res=>res.json()).then(data=>{
          if(data.error){
            M.toast({html: data.error,classes:'#c62828 red darken-3'});
          }
          else{
            M.toast({html: data.message,classes:'#43a047 green darken-1'});
            navigate('/')
          }
        }).catch(err=>{
          console.log(err)
        })
  }

  return (
    <div>
      <div className='login-wrapper'>
        <h1 className='brand-logo'>Instagram</h1>
        <input 
          type="text" 
          placeholder='Name' 
          value={name}
          onChange={(e)=>{setName(e.target.value)}} />

        <input 
          type="text" 
          placeholder='Email' 
          value={email}
          onChange={(e)=>{setEmail(e.target.value)}} />
        <input type="text" 
          placeholder='Password'
          value={password}
          onChange={(e)=>setPassword(e.target.value)} />
        <div className='btn-wrapper'>
        <p className='line'>Already have account? 
          <Link to={'/'}> <span>Click here</span> </Link> </p>
          <button className='btn' onClick={()=>postData()}>Signup</button>
        </div>
        
      </div>
    </div>
  )
}

export default Signup