import React from 'react'
import { Routes } from 'react-router-dom'

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