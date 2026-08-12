import axios from "axios";

// below is the axios instance for attaching this url with every api call
const api = axios.create({
    baseURL: "http://localhost:4000"
})

//request interceptor-request interceptor runs before Axios sends the request to your NestJS backend. Mainly for jwt 
api.interceptors.request.use((config) => {

    //getting token stored in the local storage
    const token = localStorage.getItem("accessToken")
    console.log(token)

    //attach token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

})

//response interceptor-The response interceptor runs after your backend sends a response back to the frontend.
api.interceptors.response.use((response) => {

    // return the response directly if there is response 
    return response
},

    //if there is error then erase the token in the local storage and navigate the user to the login page
    (error) => {

        if (error.response?.status == 401) {

            localStorage.removeItem("token");
            window.location.href = "/login";
            console.log("API ERROR:", error.response);
            console.log("API STATUS:", error.response?.status);
            console.log("API URL:", error.config?.url);

            return Promise.reject(error);
        }

    }


);

export default api;
