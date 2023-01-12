import React, { useEffect, useState } from 'react'
import '../App.css'
import { Link, useNavigate } from 'react-router-dom'


const Navbar = ({logoutState,setLogoutState}) => {
  const [searchItem,setSearchItem] = useState('')
  const [user,setUser] = useState([])
  const [self,setSelf] = useState()
  const navigate = useNavigate()
 
  const logoutfun = ()=>{
    setLogoutState(true)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const searchFun =()=>{
    fetch('/searchemails',{
      method:'post',
      headers:{
        'Content-Type':'application/json',
        'Authorization':localStorage.getItem('token')
      },
      body:JSON.stringify({searchItem})
    }).then(res=>res.json())
    .then(output=>{
      setUser(output.user)
    })
  }

  useEffect(()=>{
    const token = localStorage.getItem('token')
     setSelf(JSON.parse(localStorage.getItem('user')))
    if(token){
      setLogoutState(false)
    }
  },[])

  return (
    <div>
        <nav >
          <div className="nav-wrapper nav-wrapper2">
          
            <Link to='#' className="brand-logo left text" style={{fontSize:'36px'}}>Instagram</Link>
            <ul id="nav-mobile" className="right">
              {!logoutState ? <li><input type="text" 
                          placeholder='Search Email' 
                          className='search_input'
                          onChange={(e)=>{setSearchItem(e.target.value)
                                      searchFun()  }}
                          value={searchItem} /> 
                            </li>
              : null }
              {!logoutState? <li><Link to='/home' className='text'>Home</Link></li> : null}
              {!logoutState? <li><Link to='/profile' className='text'>Profile</Link></li> : null}
              {!logoutState? <li><Link to='/followingspost' className='text'>My Following Post</Link></li> : null}
              {logoutState? <li><Link to='/signup' className='text'>Signup</Link></li> : null}
              {logoutState? <li><Link to='/' className='text'>Login</Link></li> : null}
              {!logoutState? <li><Link to='/createpost' className='text'>Create Post</Link></li> : null}
              {!logoutState? <li><Link to='/' 
                className='text logout_btn'
                onClick={()=>logoutfun()}>Logout</Link></li> : null}
            </ul>
            {user  
              ? <ul className='searchList'>
                    {user.map(item=>{
                      return <Link key={item._id} 
                              to={ self._id !==item._id ? 
                                '/profile/'+ item._id :
                                '/profile' }
                              onClick={()=>{setUser([])
                                }}> 
                                <li  className='text'>{item.email}</li> 
                              </Link>
                    })}
                  </ul> 
              : 
            null}
          </div>
        </nav>
    </div>
  )
}

export default Navbar