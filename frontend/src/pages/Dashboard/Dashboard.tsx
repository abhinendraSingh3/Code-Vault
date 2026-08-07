import { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Dashboard.css"
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

    const navigate=useNavigate();

    const [isOpen, setIsOpen] = useState(true);

    const handleSideBar = () => {
        console.log("clicked")
        setIsOpen(true)

    }
    return (
        <>
            {(!isOpen &&
                <button id="expand-sidebar" onClick={handleSideBar}>
                    =
                </button>

            )}
            <Sidebar
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />

            <div className={`dashboard-all ${isOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}>

                <div className="upper-section">
                    <div className="left-heading-dashboard">
                        <h1 id="dash-heading">Dashboard</h1>
                        <h3 id="dashboard-info">Overview of your snippets and activity</h3>
                    </div>

                    <div className="right-profile-section">
                        <input id="search" type="text" placeholder="Search Snippet" />
                        <img
                            src="{db insert}"
                            alt="Profile"
                            className="profile-photo"
                        ></img>
                    </div>
                </div>
                <div className="mid-section">
                    <div className="total-snippets">
                        <h2 title="snippets-tota">Total Snippets</h2>
                    </div>
                </div>

                <div className="last-section">
                    <div className="last-upper">
                        <h3 id="recent">
                            Recent Snippets
                        </h3>
                        <button id="view-all-snippet">View All</button>
                    </div>

                    <div className="last-down">
                        <table className="snippet-table">
                            <thead>
                                <tr>
                                    <th>TITLE</th>
                                    <th>LANGUAGE</th>
                                    <th>LAST UPDATED</th>
                                    <th>VERSIONS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>
                                        <div className="snippet-title">
                                            <h4>Quick Sort in Java</h4>
                                            <p>Implementation of quick-sort algorithm</p>
                                        </div>
                                    </td>

                                    <td>
                                        <span className="language-tag java">
                                            Java
                                        </span>
                                    </td>

                                    <td>2 hours ago</td>

                                    <td>3</td>

                                    <td className="actions">
                                        <button onClick={()=>{navigate('/snippetDetails')}}>Open</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>


            </div>


        </>
    )
}

export default Dashboard;