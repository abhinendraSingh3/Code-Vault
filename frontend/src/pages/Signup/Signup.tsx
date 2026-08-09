import { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../api/authApi";
import axios from "axios";

//Keep everything that is already in formData, but update the email
const Signup = () => {

    const navigate = useNavigate();

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">("success");

    const onSubmitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();


        if (data.firstName.trim() === "") {
            setMessage("First name is required");
            setMessageType("error");
            return;
        }

        if (data.lastName.trim() === "") {
            setMessage("Last name is required");
            setMessageType("error");
            return;
        }

        if (data.userName.trim() === "") {
            setMessage("Username is required");
            setMessageType("error");
            return;
        }

        if (data.email.trim() === "") {
            setMessage("Email is required");
            setMessageType("error");
            return;
        }

        if (data.password.trim() === "") {
            setMessage("Password is required");
            setMessageType("error");
            return;
        }

        if (data.confirmPassword.trim() === "") {
            setMessage("Confirm password is required");
            setMessageType("error");
            return;
        }

        try {
            const response = await registerApi(data);

            console.log(response);

            setData({
                firstName: "",
                lastName: "",
                userName: "",
                email: "",
                password: "",
                confirmPassword: ""
            })

            setTimeout(() => {
                navigate('/login')
            }, 2000);

            setMessage("Success!")


        }
        catch (error) {

            //the below is for extracting the exact error from the response from the backend.
            if (axios.isAxiosError(error)) {
                const messages = error.response?.data.message
                console.log(messages)

                //if the error is array then separate the array and joing using , else show the single array only
                if (Array.isArray(messages)) {
                    setMessage(messages.join(", "));
                } else {
                    setMessage(messages || "Something went wrong");
                }
            }
        }



    }


    return (
        <>
            <div className="signup-Body">
                <div className="signup-back">
                    <button id="signup-btn-back" onClick={() => navigate(-1)}>⟵ Back</button>
                </div>
                <div className="signup-logo">

                    <h1 id="siteName">Code Snap</h1>
                </div>

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
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        firstName: e.target.value
                                    })

                                }}

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
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setData({
                                        ...data,
                                        userName: e.target.value
                                    })
                                    if (value === "") {
                                        setMessage("");
                                    }
                                    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(value)) {
                                        setMessage(
                                            "Username must be 3-20 characters and contain only letters, numbers, and _"
                                        );
                                        setMessageType("error");
                                    }
                                    else {
                                        setMessage("");
                                    }
                                }


                                }
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
                                onChange={(e) => {
                                    const confirmPassword = e.target.value
                                    setData({
                                        ...data,
                                        confirmPassword: e.target.value
                                    })

                                    if (confirmPassword && confirmPassword !== data.password) {
                                        setMessage(" Confirm password not matched")
                                        setMessageType("error");
                                    }
                                    else {
                                        setMessage("")
                                        setMessageType("success");
                                    }

                                }

                                }
                            />
                        </div>

                        <button id="create-account" type="submit">Create Account</button>

                        <div className="already-account">
                            <p id="existing-account">Already have an account</p>
                            <a href="" onClick={() => navigate('/login')}>Login</a>
                        </div>
                        <div className="signupError">

                            {message && (
                                <div className={messageType}>{message}</div>
                            )
                            }
                        </div>

                    </form>

                </div>
            </div>
        </>
    )
}

export default Signup;