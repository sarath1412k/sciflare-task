import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate} from 'react-router-dom'

const Layout = () => {
    const Navigate = useNavigate()
    const Location = useLocation()
    const { pathname } = Location;
    const [isLogin,setIsLogin] = useState(true)
    const [currntMode,setCurrentMode] = useState('Create account')
    const [URL,setURL] = useState('login')
    useEffect(() => {
      const currentLocation = pathname.replace("/","");
      if(currentLocation === 'login'){
        setCurrentMode('Create account')
        setURL(currentLocation)
      }
      else{
        setCurrentMode('have a account')
        setURL(currentLocation)
      }
    },[pathname])

    const changeMode = () => {
        setIsLogin(!isLogin)
       isLogin ? Navigate('/login'):Navigate('/signup')
    }
  return (
    <div className="App">
        <div className='row header-title bg-primary'>
            <div className="col-sm-12 color white">CRUD operations</div>
        </div>
    <Outlet />
    {(URL === 'login' || URL === 'signup') && <button onClick={changeMode} className='option-select-btn'>{currntMode}</button>}
  </div>
  )
}

export default Layout