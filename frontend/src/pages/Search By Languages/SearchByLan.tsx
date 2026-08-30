import ResultCard from "../../components/Snippet Result Card/ResultCard";
import "./SearchByLan.css";
import Tags from "../../components/Tags/Tags";
import { useEffect, useState } from "react";
import { searchByLangauge, searchBylangOnbtn } from '../../api/searchApi'
import type { totalLanguageCount,SnippetData } from '../../types/auth.types'

const SearchByLang = () => {

    const [tagData, setTagData] = useState<totalLanguageCount[]>([]);

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

            const apiResponse = await searchBylangOnbtn(searchVal);
            const response = apiResponse.data;

            setFetchedData(response);
            setTotalSnippetFound(response.length);
            setSearchedValue(searchVal);
            setHasSearched(true);

        } catch (error:any) {
            if(error.response?.status===404){
            setSearchedValue(searchVal);
            setHasSearched(true);
            setFetchedData([]);
            setTotalSnippetFound(0);
            setSearchError("Search result not found");
            }
            else{
            setSearchedValue(searchVal);
            setHasSearched(true);
            setFetchedData([]);
            setTotalSnippetFound(0);
            setSearchError("Something went wrong while.");}
        }
    };


    useEffect(() => {

        const extractTags = async () => {

            const response = await searchByLangauge();

            setTagData(response);

        }
        extractTags();
    }, [])


    return (
      
            <div className="SearchByLang-container">

                <div className="SearchByLang-first-section">

                    <div className="SearchByLang-headings">
                        <h1 id="SearchByLang-main-heading">
                            Search Snippets by language
                        </h1>

                        <p id="SearchByLang-desc-main">
                            Find snippet language
                        </p>
                    </div>

                    <div className="SearchByLang-input-wrapper">

                        <input
                            type="text"
                            id="SearchByLang"
                            placeholder="Search Snippet by language"
                            value={searchVal}
                            onChange={(e) => {
                                setSearchVal(e.target.value);
                            }}
                        />

                        <button
                            id="SearchByLang-Btn"
                            onClick={handleSearch}
                            disabled={!searchVal.trim()}
                        >
                            Search
                        </button>

                    </div>
                </div>

                {/* all the tags from the backend will appear here */}
                <div className="SearchByLang-tags">
                    <div className="SearchByLang-tags-bodyarea">
                        {
                            tagData.map((items) => (
                                <Tags
                                    language={items.languages}
                                    count={items.count}
                                />
                            ))

                        }
                    </div>

                </div>

                <div className="SearchByLang-second-sec">

                    {hasSearched && (
                        <p id="SearchByLang-result-show">
                            Results shown: "{searchedValue}"
                            {!searchError && ` (${totalSnippetsFound})`}
                        </p>
                    )}

                    <div className="SearchByLang-resultCardList">

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

export default SearchByLang;