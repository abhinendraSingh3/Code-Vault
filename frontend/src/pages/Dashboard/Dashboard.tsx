import { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";

const Dashboard=()=>{

    const [isOpen, setIsOpen]= useState(true);

    const handleSideBar=()=>{
        console.log("clicked")
        setIsOpen(false)

    }
return(
    <>

    <button id="expand-sidebar" onClick={handleSideBar}>
        =
    </button>
    <Sidebar 
    isOpen={isOpen}
    setIsOpen={setIsOpen}
    />

    
    </>
)
}

export default Dashboard;