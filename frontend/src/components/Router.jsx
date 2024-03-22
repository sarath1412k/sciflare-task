import React from 'react'
import { BrowserRouter,Routes,Route, Navigate } from 'react-router-dom'
import Login from './Login'
import SignUp from './SignUp'
import Layout from './Layout'
import DataTable from './DataTable'
import { Provider } from 'react-redux';
import { store } from '../store'


const Router = () => {
  return (
    <Provider store={store}>
    <BrowserRouter basename='/directory'>
    <Routes>
    <Route path='/' element={<Layout />}>
    <Route path='/' element={<Navigate replace to='/login'/>} />
    <Route path='/login' element={<Login />} />
    <Route path='/signup' element={<SignUp />} />
    <Route path='/datatable' element={<DataTable />} />
    </Route>
    </Routes>
    </BrowserRouter>
    </Provider>
  )
}

export default Router