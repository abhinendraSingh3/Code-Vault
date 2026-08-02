import { useState } from "react";
import "./Login.css";

const Login = () => {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");



    const onSubmitForm = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        //submit data and perform action

    }

    return (
        <>
            <div className="login-Body">

                <h1 className="siteName"> Code Snap</h1>

                <div className="login-body">

                    <div className="title-form">
                        <h2 id="main-create">Welcome Back</h2>
                        <h3 id="sub-main-create">Login to your account</h3> 
                    </div>

                    <form id="form" onSubmit={onSubmitForm}>

                        <label>User name</label>
                        <input
                            type="text"
                            id="username"
                            value={userName}
                            placeholder="Enter your user name"
                            onChange={(e) => { setUserName(e.target.value) }}

                        />
                        <label>Password</label>
                        <input
                            type="text"
                            id="password"
                            value={password}
                            placeholder="Enter your password"
                            onChange={(e) => { setPassword(e.target.value) }}

                        />
                        <a href="/forgotPassword">Forget password ?</a>
                        
                        <button id="login-account" type="submit">Login</button>

                        <div className="singup">
                            <p id="new-account">Don't have an account ?</p>
                            <a href="/Signup">Sign up</a>
                        </div>

                    </form>

                </div>
            </div>
        </>
    )
}

export default Login;