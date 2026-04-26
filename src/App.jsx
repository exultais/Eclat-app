import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import Discover from './pages/app/Discover.jsx'
import Matches from './pages/app/Matches.jsx'
import Profile from './pages/app/Profile.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/matches" element={<Matches />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}

export default App