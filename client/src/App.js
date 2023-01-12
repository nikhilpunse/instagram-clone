import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { BrowserRouter,Routes,Route,useNavigate } from 'react-router-dom'
import Home from './components/Home'
import Profile from './components/Profile'
import Login from './components/Login'
import Signup from './components/Signup'
import Createpost from './components/Createpost'
import UserProfile from './components/UserProfile'
import MyFollowingPost from './components/MyFollowingPost'
import PasswordReset from './components/PasswordReset'
import Newpassword from './components/Newpassword'

  const Routing = ({setLogoutState})=>{
    return( 
      <>
              <Routes>
                <Route path='/' element={ <Login setLogoutState={setLogoutState}/>}></Route>
                <Route path='/home' element={<Home/>}></Route>
                <Route exact path='/profile' element={<Profile/>}></Route>
                <Route path='/signup' element={<Signup/>}></Route>
                <Route path='/createpost' element={<Createpost/>}></Route>
                <Route path='/profile/:userId' element={<UserProfile/>}></Route>
                <Route path='/followingspost' element={<MyFollowingPost/>}></Route>
                <Route path='/passwordreset' element={<PasswordReset/>}></Route>
                <Route path='/reset/:token' element={<Newpassword/>}></Route>
              </Routes>
            </>
          )
        }
        
    function App() {
        const [logoutState,setLogoutState] = useState(true)
          return (<>
                    <BrowserRouter>
                      <Navbar logoutState={logoutState} setLogoutState={setLogoutState}/>
                      <Routing logoutState={logoutState} setLogoutState={setLogoutState}/>
                    </BrowserRouter>  
                  </>     
                )
              }

export default App