import { useState } from "react";
import './AllSnippets.css'
import SnippetDetails from "../../components/SnippetDetails/SnippetDetails";
import { useNavigate } from "react-router-dom";

const AllSnippets = () => {

    const navigate=useNavigate();

    const pages = [1, 2, 3, 4, 5, 6]

    const [current, setCurrentPage] = useState<number>(1);



    return (
        <>
            <div className="main-all">
                <div className="first-all">
                    <div className="heading">
                        <p id="title">All Snipepts</p>
                        <p id="title-description">Manage and organize your code snippet</p>
                    </div>
                    <div className="right-side-bars">
                        <input id="search-snippets" placeholder="Search Snippets"></input>
                        <button id="search-btn" >Search</button>
                    </div>
                </div>


                <div className="last-down">
                    <table className="snippet-table">
                        <thead>
                            <tr>
                                <th>TITLE</th>
                                <th>LANGUAGE</th>
                                <th>UPDATED</th>
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
                                    <button onClick={()=>navigate('/snippetDetails')}>Open</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="snippet-table">
                        <thead>
                            <tr>
                                <th>TITLE</th>
                                <th>LANGUAGE</th>
                                <th>UPDATED</th>
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
                                    <button>Open</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="snippet-table">
                        <thead>
                            <tr>
                                <th>TITLE</th>
                                <th>LANGUAGE</th>
                                <th>UPDATED</th>
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
                                    <button>Open</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="snippet-table">
                        <thead>
                            <tr>
                                <th>TITLE</th>
                                <th>LANGUAGE</th>
                                <th>UPDATED</th>
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
                                    <button>Open</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="pages-tags">
                    {
                        pages.map((page) => {
                            return (
                                <button
                                    key={page}
                                    className={current === page ? "active-page" : ""}
                                    onClick={() => setCurrentPage(page)}
                                >{page}
                                </button>
                            )
                        })
                    }

                </div>
            </div>




        </>
    )
}
export default AllSnippets;