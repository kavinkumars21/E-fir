import React from 'react'
import { Link } from 'react-router-dom'
import './style.css'

function Home() {

  return (
    <div className='main'>
      <div className='links'>
        <Link to='registerfir' className='link'>Register Fir</Link>
        <Link to='recognizeface' className='link'>Face Recognition</Link>
        <Link to='updatefir' className='link'>Update FIR</Link>
        {/* <Link to='sample' className='link'>sample</Link> */}
      </div>
    </div>
  )
}

export default Home
