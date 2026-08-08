import { useState } from "react";
import "./Signup.css";

//Keep everything that is already in formData, but update the email
const Signup = () => {

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState();

    const onSubmitForm = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setData({
            firstName: "",
            lastName: "",
            userName: "",
            email: "",
            password: "",
            confirmPassword: ""
        })

        console.log(data);

    }

    return (
        <>
            <div className="signup-Body">
                <div className="signup-back">
                    <button id="signup-btn-back">⟵ Back</button>
                </div>

                <h1 className="siteName"> Code Snap</h1>

                <div className="registration-body">

                    <div className="title-form">
                        <h2 id="main-create">Create your account</h2>
                        <h3 id="sub-main-create">Start Organising and sharing your code snippets</h3>
                    </div>

                    <form id="form" onSubmit={onSubmitForm}>
                        <div className="signup-names">
                            <label>First name</label>
                            <input
                                type="text"
                                id="firstname"
                                value={data.firstName}
                                placeholder="Enter your first name"
                                onChange={(e) => setData({
                                    ...data,
                                    firstName: e.target.value
                                })}

                            />
                            <label>Last name</label>
                            <input
                                type="text"
                                id="lastname"
                                value={data.lastName}
                                placeholder="Enter your last name"
                                onChange={(e) => setData({
                                    ...data,
                                    lastName: e.target.value
                                })}
                            />
                        </div>
                        <div className="singup-emails">
                            <label>User name</label>
                            <input
                                type="text"
                                id="username"
                                value={data.userName}
                                placeholder="Enter your user name"
                                onChange={(e) => setData({
                                    ...data,
                                    userName: e.target.value
                                })}
                            />
                            <label>Email</label>
                            <input
                                type="email"
                                id="email"
                                value={data.email}
                                placeholder="Enter your email"
                                onChange={(e) => setData({
                                    ...data,
                                    email: e.target.value
                                })}
                            />
                        </div>
                        <div className="signup-passwords">
                            <label>Password</label>
                            <input
                                type="password"
                                id="password"
                                value={data.password}
                                placeholder="Enter your password"
                                onChange={(e) => setData({
                                    ...data,
                                    password: e.target.value
                                })}
                            /><label>Confirm Password</label>
                            <input
                                type="password"
                                id="confirm-password"
                                value={data.confirmPassword}
                                placeholder="Confirm your Password"
                                onChange={(e) => setData({
                                    ...data,
                                    confirmPassword: e.target.value
                                })}
                            />
                        </div>

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