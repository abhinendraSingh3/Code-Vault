import { BrowserRouter, Route, Routes } from "react-router-dom"
import Signup from "./pages/Signup/Signup"
import Login from "./pages/Login/Login"
import Dashboard from "./pages/Dashboard/Dashboard"

function App() {

  return (
    <>
    <BrowserRouter>

      <Routes>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
      </Routes>
     
    </BrowserRouter>

    
    </>
  )
}

export default App
