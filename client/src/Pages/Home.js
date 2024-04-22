import React from 'react'
import { Link } from 'react-router-dom'
import './style.css'

function Home() {

  return (
    <div className='main'>
      <div className='links'>
        <Link to='fir' className='link'>Register Fir</Link>
        <Link to='reg' className='link'>Face Recognition</Link>
        {/* <Link to='sample' className='link'>sample</Link> */}
      </div>
    </div>
  )
}

export default Home
