import axios from 'axios'
import React, { useEffect, useState } from 'react'

const SignUp = () => {
    const [formData,setFormData] = useState({name:"",organization:"",email:"",role:"",password:""})
    const [pwdVisiblity,setPwdVisiblity] = useState(false)
    const [organizationOptions,setOrganizationOption] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8000/organization-list')
        .then(res => {
            setOrganizationOption(res.data)
        })
        .catch(err => {
            console.log(err)
        })
    },[])

    const handleInputs = ({target}) => {
        const name = target.name
        const value = target.value
        setFormData(prev => ({...prev,[name]:value}))
    }

    function changeVisiblity(){
        setPwdVisiblity(!pwdVisiblity)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if(formData.email.trim() !=='' && formData.organization !== "" && formData.name.trim() !== '' && formData.role !== "" && formData.password.trim() !== ""){
            axios.put(`http://localhost:8000/signup`,formData)
            .then((res) => {
                alert(res.data)
                setFormData({name:"",organization:"",email:"",role:"",password:""})
            })
            .catch((err) => {
                if(err.response.data){
                    alert(err.response.data)
                }
                else{
                    alert('internal server error')
                }
            })
        }
        else{
            formData.name.trim() === '' && alert('Please enter name')
            formData.email.trim() ==='' && alert('please enter email')
            formData.organization === '' && alert('Please select organization')
            formData.role === "" && alert('Please select role')
            formData.password.trim() === "" && alert('Please enter password')
        }
    }


  return (
        <>
        <header className='h2'>Sign up</header>
        <form onSubmit={handleSubmit} className='input-form' autoComplete='off'>
        <label>Name</label>
        <input type='text' name='name' onChange={handleInputs} value={formData.name}/>
        <label>Email</label>
        <input type='email' name='email' onChange={handleInputs} value={formData.email}/>
        <label>organization</label>
        <select name='organization' onChange={handleInputs} value={formData.organization}>
            <option style={{display:"none"}} value=""></option>
            {organizationOptions.map((data,i) => 
                <option key={i} value={data.name}>{data.name}</option>
            )}
        </select>
        <label>Role</label>
        <select name='role' onChange={handleInputs} value={formData.role}>
        <option style={{display:"none"}} value=""></option>
            <option>user</option>
            <option>admin</option>
        </select>
        <label>Password</label>
        <input type={pwdVisiblity?'text':'password'} name='password' onChange={handleInputs} value={formData.password} />
        <div onClick={changeVisiblity} className='pwd-visiblity-btn'>show Password</div>
        <button className='btn btn-primary submit-btn'>Log in</button>
        </form>
        </>
       
  )
}

export default SignUp