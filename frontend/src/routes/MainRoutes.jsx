import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Landing from '../pages/Landing'
import DetectMood from '../pages/DetectMood'
import Result from '../pages/Result'

const MainRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/detect" element={<DetectMood />} />
        <Route path="/result" element={<Result />} />
    </Routes>
  )
}

export default MainRoutes