import "./Tags.css"

type PropUse = {
    language: boolean;
    count: number;
}

const Tags=({language,count}:PropUse)=>{
    return (
        <>
        <div className="tags-body">
            <p id="tags-textArea"> {language} </p>
            <p id="tags-occurence">{count}</p>
        </div>
        </>
    )
}

export default Tags