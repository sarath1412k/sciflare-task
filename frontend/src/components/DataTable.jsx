import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const DataTable = () => {
  const Navigate= useNavigate()
  let id = useSelector(state => state.credential.id) 
  const [data,setData] = useState([])
  const [track,setTrack] = useState(false)
   
  useEffect(() => {
    if(id){
      axios.get(`http://localhost:8000/details?id=${id}`)
      .then((res) => {
        setData(res.data)
      }).catch((err) => {
        alert('internal server error')
      })
    }
  },[track])

  const handleDelete = (row) => {
    axios.delete(`http://localhost:8000/delete/${row._id}`)
    .then((res) => {
      alert(res.data)
      console.log(data)
      setTrack(!track)
    })
    .catch(err => {
      console.log(err)
      alert('internal server error')
    })

  }
  return (
    <div>
      <div className='btn-container'><button onClick={() => Navigate('/login')} className='btn btn-success'>Log out</button></div>
          <div className="table-responsive table-box">
      <table className='table'>
        <thead>
          <tr>
            <th className="">Name</th>
            <th className="">Organization</th>
            <th className="">role</th>
            <th className="">email</th>
            <th className="">address</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          { data.length === 0 ? <tr><td className='no-record' colSpan={6}>No items found</td></tr> :
            data.map((data,i) => 
             <tr key={i}>
              <td>{data.name}</td>
              <td>{data.organization}</td>
              <td>{data.role}</td>
              <td>{data.email}</td>
              <td>{data.address}</td>
              <td className='btn-groups'>
                {"contactInformation" in data && <button className='btn btn-danger' onClick={() => handleDelete(data)} >Delete</button>}
              </td>
             </tr> 
              )
          }    
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default DataTable