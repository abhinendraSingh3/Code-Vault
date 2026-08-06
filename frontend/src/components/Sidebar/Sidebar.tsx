import "./Sidebar.css"
import { useNavigate } from "react-router-dom"

//setIsOpen is the function to set the value of the isOpen; thats why we have used the value like that. so we are passing the state from the dashboard till here as the prop and use it here
 type SidebarProps = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Sidebar = ({isOpen, setIsOpen}: SidebarProps) => {

    const navigate= useNavigate();

    

    return (
        
        //  In React, you don't manually "apply CSS properties." Instead, you change the className based on the state.
        <>
            <div className={isOpen ? "sidebar open" : "sidebar"}>
                <div className="first-section">
                    <h1 id="main-title"> CodeSnap</h1>
                    <p id='close' onClick={()=>setIsOpen(false)}>X</p>
                </div>

                <div className="second-section">
                    <button id="new-snippet" onClick={()=>navigate('/createSnippet')}>+ New Snippet</button>

                    <a href="/Dashboard"id="dashboard">Dashboard</a>

                    <a href="/allSnippets" id="all-Snippets">All Snippets</a>

                    <a href="/searchany" id="seach-any">Search</a>

                    <a href="/searchbylanguage" id="by-language">By language</a>

                    <a href="/searchByTitle" id="by-title">By Title</a>

                    <a href="/SharedWme" id="shared-w-me">Share with me</a>

                    <a href="/MyShares" id="my-shares">My Shares</a>

                    <a href="/allVersions" id="all-versions">All Versions</a>
                </div>
                <div className="third-section">
                    <a href="/Profile" id="profile">Profile</a>

                    <a href="/Settings" id="setting">Settings</a>

                    {/* data will be inserted later from the backend */}
                    <img src="${profile}" id="profile-pic" alt="profilePic" />
                    <p id="userName">{ }</p>
                    <p id="email">{ }</p>

                </div>
            </div>
        </>
    )
}

export default Sidebar