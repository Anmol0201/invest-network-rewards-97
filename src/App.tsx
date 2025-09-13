
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Admin from "@/pages/Admin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="*" element={<Admin />} />
      </Routes>
    </Router>
  )
}

export default App
