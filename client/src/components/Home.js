import React from 'react'
import { Link } from 'react-router-dom'
import './style.css'
import axios from 'axios'

function Home() {

  const handlesubmit = async () => {


    const response = await axios.get("http://localhost:5000/getData");
    console.log(response);

  }

  return (
    <div className='main'>
      <Link to='fir' className='link'>Fir</Link>
      <Link to='reg' className='link'>reg</Link>
      <button onClick={handlesubmit}>get</button>
    </div>
  )
}

export default Home
