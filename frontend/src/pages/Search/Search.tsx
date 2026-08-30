import ResultCard from "../../components/Snippet Result Card/ResultCard";
import { useState } from "react";
import "./Search.css";
import { searchAnySnippet } from "../../api/searchApi";
import type { SnippetData } from "../../types/auth.types";

const Search = () => {
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

            const apiResponse = await searchAnySnippet(searchVal);
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
        <div className="search-container">

            <div className="search-first-section">

                <div className="search-headings">
                    <h1 id="search-main-heading">
                        Search Snippets
                    </h1>

                    <p id="search-desc-main">
                        Find snippet by title, language or keyword
                    </p>
                </div>

                <div className="search-input-wrapper">

                    <input
                        type="text"
                        id="search"
                        placeholder="Search Snippet"
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

            <div className="search-second-sec">

                {hasSearched && (
                    <p id="search-result-show">
                        Results shown: "{searchedValue}"
                        {!searchError && ` (${totalSnippetsFound})`}
                    </p>
                )}

                <div className="search-resultCardList">

                    {searchError ? (
                        <p>{searchError}</p>
                    ) : (
                        fetchedData.map((item) => (
                            <ResultCard
                                key={item.id}
                                snippetId={item.id}
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

export default Search;