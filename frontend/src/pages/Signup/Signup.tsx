import { useState } from "react";
import "./Signup.css";

const Signup = () => {

    const [firstName, setFirstName] = useState("");
    const [LastName, setLasttName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");



    const onSubmitForm = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        //submit data and perform action

        


    }

    return (
        <>
            <div className="signup-Body">

                <h1 className="siteName"> Code Snap</h1>

                <div className="registration-body">

                    <div className="title-form">
                        <h2 id="main-create">Create your account</h2>
                        <h3 id="sub-main-create">Start Organising and sharing your code snippets</h3>
                    </div>

                    <form id="form" onSubmit={onSubmitForm}>

                        <label>First name</label>
                        <input
                            type="text"
                            id="firstname"
                            value={firstName}
                            placeholder="Enter your first name"
                            onChange={(e) => { setFirstName(e.target.value) }}

                        />
                        <label>Last name</label>
                        <input
                            type="text"
                            id="lastname"
                            value={LastName}
                            placeholder="Enter your last name"
                            onChange={(e) => { setLasttName(e.target.value) }}

                        />
                        <label>User name</label>
                        <input
                            type="text"
                            id="username"
                            value={userName}
                            placeholder="Enter your user name"
                            onChange={(e) => { setUserName(e.target.value) }}

                        />
                        <label>Email</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            placeholder="Enter your email"
                            onChange={(e) => { setEmail(e.target.value) }}

                        />
                        <label>Password</label>
                        <input
                            type="text"
                            id="password"
                            value={password}
                            placeholder="Enter your password"
                            onChange={(e) => { setPassword(e.target.value) }}

                        /><label>Confirm Password</label>
                        <input
                            type="text"
                            id="confirm-password"
                            value={confirmPassword}
                            placeholder="Confirm your Password"
                            onChange={(e) => { setConfirmPassword(e.target.value) }}

                        />

                        <button id="create-account" type="submit">Create Account</button>

                        <div className="already-account">
                            <p id="existing-account">Already have an account</p>
                            <a href="">Login</a>
                        </div>

                    </form>

                </div>
            </div>
        </>
    )
}

export default Signup;