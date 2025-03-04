import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Sign from './pages/Sign'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Post from './pages/Post'
import NewPost from './pages/NewPost'
import EditPost from './pages/EditPost'
import AdminPanel from './pages/AdminPanel'
import ResetPassword from './pages/ResetPassword'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sign" element={<Sign />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile/:userId" element={<Profile />} />
      <Route path="/post/:postId" element={<Post />} />
      <Route path="/new-post" element={<NewPost />} />
      <Route path="/edit-post/:postId" element={<EditPost />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  )
}

export default AppRoutes 