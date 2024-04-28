import React from 'react'
import { useRoutes } from "react-router-dom"
import FirFormPage from './Pages/FirForm'
import Home from './Pages/Home'
import FaceRecognition from './Pages/FaceRecognition'
import UpdateFIR from './Pages/UpdateFIR'
import Sample from './components/sample'

function App() {

	const route = useRoutes([
		{path: '/', element: <Home />},
		{path: '/registerfir', element: <FirFormPage />},
		{path: '/recognizeface', element: <FaceRecognition />},
		{path: '/updatefir', element: <UpdateFIR />},
		{path: '/sample', element: <Sample />}
	])
	return (
		<div>
			{route}
		</div>
	)
}

export default App
