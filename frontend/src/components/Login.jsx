import React, { useState } from 'react'
import './Login.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addCredentials as addCredentialsAction } from '../loginSlice'

const Login = () => {
  const Navigate = useNavigate()
  const dispatch = useDispatch()
    const [formData,setFormData] = useState({username:"",password:""})
    const [pwdVisiblity,setPwdVisiblity] = useState(false)
    const handleInputs = ({target}) => {
      const name = target.name
      const value = target.value
        setFormData(prev => ({...prev,[name]:value}))
    }
    function changeVisiblity(){
        setPwdVisiblity(!pwdVisiblity)
    }

    const submitData=(e) => {
      e.preventDefault()
      if(formData.username.trim() !== '' && formData.password.trim() !== ''){
        axios.post('http://localhost:8000/login',formData)
        .then((res) => {
            const result = res.data
            console.log(result)
            dispatch(addCredentialsAction(result.id))
            if(result.success){
              Navigate('/datatable')
            }
        }).catch((err) => {
          console.log(err)
          alert(err.response.data.message)
        })
      }
      else{
        if(formData.email.trim() === ''){
          alert('Please enter the email')
        }
        if(formData.password.trim() === ''){
          alert('Please enter the password')
        }
      }
    
    }
  return (
    <>
    <header className='h2'>Log in</header>
    <form onSubmit={submitData} className='input-form' autoComplete='off'>
    <label>Email</label>
    <input type='email' name='username' onChange={handleInputs} value={formData.username}/>
    <label>Password</label>
    <input type={pwdVisiblity?'text':'password'} name='password' onChange={handleInputs} value={formData.password} />
    <div onClick={changeVisiblity} className='pwd-visiblity-btn'>show Password</div>
    <button className='btn btn-primary submit-btn'>Log in</button>
    </form>
    </>
  
  )
}

export default Login