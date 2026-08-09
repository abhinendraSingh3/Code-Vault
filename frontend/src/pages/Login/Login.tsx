import { useState } from "react";
import "./Login.css";
import { loginApi } from "../../api/authApi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const navigate=useNavigate();
    const [loginData, setLoginData] = useState({
        userName: "",
        password: ""
    })
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState<"error" | "success">("success")



    const onSubmLo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await loginApi(loginData);
            const data = response.data;



            //response.data
            if (data?.userId && data?.accessToken) {

                console.log(data);
                
                localStorage.setItem("userId", data.userId.toString());
                localStorage.setItem("userName", data.userName);
                localStorage.setItem("email", data.email);
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("isLoggedIn","true");

                setMessage("Login successful");

            setTimeout(()=>{
                navigate('/dashboard')
            },1000)

                

            }
            else{
                setMessage("Login Failed")
                setMessageType("error")
            }



        } catch (error) {

            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data.message;

                if (Array.isArray(errorMessage)) {
                    setMessage(errorMessage.join(", "));
                } else {
                    setMessage(errorMessage || "Something went wrong");
                }

                setMessageType("error");

                console.log("Backend error:", error.response?.data);
            }
        }
    };

    return (
        <>
            <div className="login-Body">

                <h1 className="siteName"> Code Snap</h1>

                <div className="login-body">

                    <div className="title-form">
                        <h2 id="main-create">Welcome Back</h2>
                        <h3 id="sub-main-create">Login to your account</h3>
                    </div>

                    <form id="form" onSubmit={onSubmLo}>

                        <label>User name</label>
                        <input
                            type="text"
                            id="username"
                            value={loginData.userName}
                            placeholder="Enter your user name"
                            onChange={(e) => setLoginData({ ...loginData, userName: e.target.value })}

                        />
                        <label>Password</label>
                        <input
                            type="password"
                            id="password"
                            value={loginData.password}
                            placeholder="Enter your password"
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}

                        />
                        <a href="/forgotPassword">Forget password ?</a>

                        <button id="login-account" type="submit">Login</button>

                        <div className="singup">
                            <p id="new-account">Don't have an account ?</p>
                            <a href="/Signup">Sign up</a>
                        </div>

                        <div className="loginError">
                            {message && (
                                <div className={messageType}>
                                    {message}
                                </div>
                            )}
                        </div>

                    </form>

                </div>
            </div>
        </>
    )
}

export default Login;