import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { Flip, ToastContainer } from 'react-toastify'

const App = () => {

  return (
    <div>
      <AppRoutes />
      <ToastContainer 
      theme='dark'
      position='top-right'
      autoClose={3000}
      hideProgressBar
      closeOnClick
      draggable
      transition={Flip}

      />
    </div>
  )
}

export default App
