import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Dashboard.css"
import { useNavigate } from "react-router-dom";
import { getrecentSnippet, getAllSnippetsOfUser } from "../../api/dashBoardApi";
import type { SnippetData } from "../../types/auth.types";
const Dashboard = () => {

    const [dashBoardData, setDashBoardData] = useState(true);


    // total snippets in users account,

    //  when clicked on view all it should inject all in the recentsnippet
    const [allSnippetData, setAllSnippetData] = useState<SnippetData[]>([]);

    const handleAllData = async () => {
        setDashBoardData(false);

        const snippetsData = await getAllSnippetsOfUser();
        setAllSnippetData(snippetsData);
    }


    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(true);

    //get data of the 3 most recent snippet
    const [recentSnippets, setRecentSnippet] = useState<SnippetData[]>([]);
    const [snippetsLength, setSnippetLength] = useState<number>(0);

    useEffect(() => {

        const fetchRecentSnippet = async () => {

            try {
                const data = await getrecentSnippet();
                const recentSnippetfinal = data.recentSnippets;

                setRecentSnippet(recentSnippetfinal);

                const snippetLength = data.totalLength;

                setSnippetLength(snippetLength);

            }
            catch (error) {
                console.error("Failed to fetch recent snippets:", error);

            }
        }
        fetchRecentSnippet();
    }, [])


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
                        <img
                            src={localStorage.getItem("profilePic") || "https://api.dicebear.com/7.x/bottts/svg?seed=user"}
                            alt="Profile"
                            className="profile-photo"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate('/profile')}
                        />
                    </div>
                </div>
                <div className="mid-section">
                    <div className="total-snippets">
                        <h2 title="snippets-tota">Total Snippets: {snippetsLength}</h2>
                    </div>
                </div>

                <div className="last-section">
                    <div className="last-upper">
                        <h3 id="recent">
                            Recent Snippets
                        </h3>
                        <button id="view-all-snippet" onClick={handleAllData}>View All</button>
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
                                {/* if dashBoard data's state is true then inital api recent snippet will be shown or when user click view all then that data will be shown */}
                                {dashBoardData ? (recentSnippets.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="snippet-title">
                                                <h4>{item.title}</h4>
                                                <p>{item.description}</p>
                                            </div>
                                        </td>

                                        <td>
                                            <span className={`language-tag ${item.language}`}>
                                                {item.language}
                                            </span>
                                        </td>

                                        <td>{new Date(item.updatedAt).toLocaleString()}</td>

                                        <td>{item.versions}</td>

                                        <td className="actions">
                                            <button
                                            onClick={()=>navigate("/snippetDetails",{
                                                state:{
                                                    snippetId:item.id
                                                }
                                            })}
                                            >
                                                Open
                                            </button>
                                        </td>
                                    </tr>
                                ))):(
                                    allSnippetData.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="snippet-title">
                                                <h4>{item.title}</h4>
                                                <p>{item.description}</p>
                                            </div>
                                        </td>

                                        <td>
                                            <span className={`language - tag ${ item.language }`}>
                                                {item.language}
                                            </span>
                                        </td>

                                        <td>{new Date(item.updatedAt).toLocaleString()}</td>

                                        <td>{item.versions}</td>

                                        <td className="actions">
                                             <button
                                            onClick={()=>{
                                                
                                                navigate("/snippetDetails",{
                                                state:{
                                                    snippetId:item.id
                                                }
                                            })}}
                                            >
                                                Open
                                            </button>
                                        </td>
                                    </tr>
                                ))
                                    


                                )}

                            </tbody>

                        </table>
                    </div>
                </div>
            </div>


        </>
    )
}

export default Dashboard;