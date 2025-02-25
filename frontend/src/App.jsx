import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from "./components/layouts/Header"
import Home from "./components/Home"
import Register from "./components/user/Register"
import Login from "./components/user/Login"
import Ask from "./components/questions/Ask"
import Question from "./components/questions/Question"
import EditAnswer from "./components/answers/EditAnswer"
import Profile from "./components/user/Profile"
import UpdateQuestion from "./components/questions/UpdateQuestion"
import UpdateProfile from "./components/user/UpdateProfile"
import UpdatePassword from "./components/user/UpdatePassword"
import BookMarkedQuestions from "./components/user/questions/BookMarkedQuestions"
import PageNotFound from './components/404/PageNotFound'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ask" element={<Ask />} />
        <Route path="/question/:slug" element={<Question />} />
        <Route path="/edit/answer/:id" element={<EditAnswer />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update/profile" element={<UpdateProfile />} />
        <Route path="/update/password" element={<UpdatePassword />} />
        <Route path="/edit/question/:slug" element={<UpdateQuestion />} />
        <Route path="/bookmarked/questions" element={<BookMarkedQuestions />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
