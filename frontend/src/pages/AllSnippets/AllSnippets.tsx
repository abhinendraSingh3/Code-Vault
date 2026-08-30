import { useState, useEffect } from "react";
import './AllSnippets.css'
import { useNavigate } from "react-router-dom";
import { getALLSnippet } from "../../api/allSnippetAPI";
import type { SnippetData } from "../../types/auth.types";

const AllSnippets = () => {

    const navigate = useNavigate();

    //is the data is loaded from pages or useEffect
    const [initaLoadDate, setInitiaLoadData] = useState(true);

    //set the initial page after the page loads
    const [initalPage, setInitialPage] = useState<SnippetData[]>([])

    //data of the particular page
    const [pageNumberData, setPageNumberData] = useState<SnippetData[]>([])

    const [totalPage, settotalPage] = useState<number>(1);
    const pageNumbers = Array.from({ length: totalPage }, (_, i) => i + 1);

    const [current, setCurrentPage] = useState<number>(1);

    //this is the function
    const pageNumberSnippet = async (page: number) => {

        const response = await getALLSnippet(page, 5);

        console.log("the page is", current)

        setInitiaLoadData(false)
        setPageNumberData(response.data);
        setCurrentPage(page);

    }

    //initial the first page will load using the useEffect

    //then when the user click then another function will run and extract the data and that will be displayed and change the state also

    useEffect(() => {
        const apiCall = async () => {
            setCurrentPage(1);

            const response = await getALLSnippet(1, 5);
            console.log(response);
            

            setInitialPage(response.data);

            settotalPage(response.totalPageNumbers);
        }
        apiCall();


    }, [])

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
                            {(initaLoadDate ? initalPage : pageNumberData).map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="snippet-title">
                                            <h4>{item.title}</h4>
                                            <p>{item.description}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="language-tag java">{item.language}</span>
                                    </td>
                                    <td>{item.updatedAt}</td>
                                    <td>{item.versions}</td>
                                    <td className="actions">
                                        <button onClick={() => navigate('/snippetDetails',{state:{snippetId:item.id}})}>Open</button>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>

                </div>
                <div className="pages-tags">
                    {
                        pageNumbers.map((page) => {
                            return (
                                <button
                                    key={page}
                                    className={current === page ? "active-page" : ""}
                                    onClick={() => {
                                        pageNumberSnippet(page)

                                    }}
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