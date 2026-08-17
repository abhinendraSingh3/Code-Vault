import ResultCard from "../../components/Snippet Result Card/ResultCard";
import { useState } from "react";
import "./searchByTitle.css";
import { searchByTitleApi } from "../../api/searchApi";
import type { SnippetData } from "../../types/auth.types";

const searchByTitle = () => {
    const [searchVal, setSearchVal] = useState("");
    const [fetchedData, setFetchedData] = useState<SnippetData[]>([]);
    const [totalSnippetsFound, setTotalSnippetFound] = useState(0);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchedValue, setSearchedValue] = useState("");
    const [searchError, setSearchError] = useState("");

    const handleSearch = async () => {
        // Dont search if input is empty
        if (!searchVal.trim()) {
            return;
        }

        try {
            setSearchError("");

            const apiResponse = await searchByTitleApi(searchVal);
            const response = apiResponse.data;

            setFetchedData(response);
            setTotalSnippetFound(response.length);
            setSearchedValue(searchVal);
            setHasSearched(true);

        } catch (error) {
            console.error("API failed:", error);

            setSearchedValue(searchVal);
            setHasSearched(true);
            setFetchedData([]);
            setTotalSnippetFound(0);
            setSearchError("Something went wrong while searching.");
        }
    };

    return (
        <div className="searchByTitle-container">

            <div className="searchByTitle-first-section">

                <div className="searchByTitle-headings">
                    <h1 id="searchByTitle-main-heading">
                        Search Snippets by title
                    </h1>

                    <p id="searchByTitle-desc-main">
                        Find snippet by title only.
                    </p>
                </div>

                <div className="searchByTitle-input-wrapper">

                    <input
                        type="text"
                        id="searchByTitle"
                        placeholder="Search by title"
                        value={searchVal}
                        onChange={(e) => {
                            setSearchVal(e.target.value);
                        }}
                    />

                    <button
                        id="searchAll-Btn"
                        onClick={handleSearch}
                        disabled={!searchVal.trim()}
                    >
                        Search
                    </button>

                </div>
            </div>

            <div className="searchByTitle-second-sec">

                {hasSearched && (
                    <p id="searchByTitle-result-show">
                        Results shown: "{searchedValue}"
                        {!searchError && ` (${totalSnippetsFound})`}
                    </p>
                )}

                <div className="searchByTitle-resultCardList">

                    {searchError ? (
                        <p>{searchError}</p>
                    ) : (
                        fetchedData.map((item) => (
                            <ResultCard
                                key={item.id}
                                title={item.title}
                                description={item.description}
                                language={item.language}
                                updatedAt={item.updatedAt}
                            />
                        ))
                    )}

                </div>

            </div>
        </div>
    );
};

export default searchByTitle;