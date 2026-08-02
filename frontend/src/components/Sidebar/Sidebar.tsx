import "./Sidebar.css"

const Sidebar=()=>{

    const [open, setOpen]=useState(false);

    const changeStateSideBar=()=>{
        if(open==false){
            //apply the css property of close
        }
    }

    return (
        <>
        <div className="first-section">
            <h1 id="main-title"> CodeSnap</h1>
            <p id='close' onChange={changeStateSideBar}>X</p>
        </div> 

        <div className="second-section">
            <button id="new-snippet">+ New Snippet</button>
            <a href="/Dashboard" id="dashboard">Dashboard</a>

            <a href="/AllSnippets" id="all-Snippets">All Snippets</a>

            <a href="/SearchAny" id="seach-any">Search</a>

            <a href="/ByLanguage" id="by-language">By language</a>

            <a href="/ByTitle" id="by-title">By Title</a>

            <a href="/SharedWme" id="shared-w-me">Share with me</a>

            <a href="/MyShares" id="my-shares">My Shares</a>

            <a href="/AllVersions" id="all-versions">All Versions</a>
        </div>
        <div className="third-section">
            <a href="/Profile" id="profile">Profile</a>

            <a href="/Settings" id="setting">Settings</a>

            {/* data will be inserted later from the backend */}
            <img src="${profile}" id="profile-pic" alt="profilePic"/>
            <p id="userName">{}</p>
            <p id="email">{}</p>
            
        </div>    
        </>
    )
}

export default Sidebar