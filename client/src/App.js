import React from 'react'
import { useRoutes } from "react-router-dom"
import FirFormPage from './components/FirFormPage'
import Home from './components/Home'
import FaceRecognition from './components/FaceRecognition'
import Sample from './components/sample'

function App() {

	const route = useRoutes([
		{path: '/', element: <Home />},
		{path: '/fir', element: <FirFormPage />},
		{path: '/reg', element: <FaceRecognition />},
		{path: '/sample', element: <Sample />}
	])
	return (
		<div>
			{route}
		</div>
	)
}

export default App
