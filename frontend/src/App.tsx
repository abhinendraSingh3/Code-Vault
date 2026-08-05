import { BrowserRouter, Route, Routes } from "react-router-dom"
import Signup from "./pages/Signup/Signup"
import Login from "./pages/Login/Login"
import Dashboard from "./pages/Dashboard/Dashboard"
import CreateSnippet from "./pages/CreateSnippet/CreateSnippet"
import AllSnippets from "./pages/AllSnippets/AllSnippets"
import Search from "./pages/Search/Search"

function App() {

  return (
    <>
    <BrowserRouter>

      <Routes>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/createSnippet" element={<CreateSnippet/>}></Route>
        <Route path="/allsnippets" element={<AllSnippets/>}></Route>
        <Route path="/searchany" element={<Search/>}></Route>
      </Routes>
     
    </BrowserRouter>

    
    </>
  )
}

export default App
