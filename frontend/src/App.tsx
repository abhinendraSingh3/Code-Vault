import { BrowserRouter, Route, Routes } from "react-router-dom"
import Signup from "./pages/Signup/Signup"
import Login from "./pages/Login/Login"
import Dashboard from "./pages/Dashboard/Dashboard"
import CreateSnippet from "./pages/CreateSnippet/CreateSnippet"
import AllSnippets from "./pages/AllSnippets/AllSnippets"
import Search from "./pages/Search/Search"
import SearchByLang from "./pages/Search By Languages/SearchByLan"
import SearchByTitle from "./pages/Search By Title/SearchByTitle"

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
        <Route path="/searchbylanguage" element={<SearchByLang/>}></Route>
        <Route path="/searchByTitle" element={<SearchByTitle/>}></Route>
      </Routes>
     
    </BrowserRouter>

    
    </>
  )
}

export default App
