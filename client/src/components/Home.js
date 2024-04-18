import React from 'react'
import { Link } from 'react-router-dom'
import './style.css'

function Home() {

  return (
    <div className='main'>
      <Link to='fir' className='link'>Fir</Link>
      <Link to='reg' className='link'>reg</Link>
      <Link to='sample' className='link'>sample</Link>
    </div>
  )
}

export default Home
