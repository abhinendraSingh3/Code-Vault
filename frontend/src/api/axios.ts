import axios from "axios";

// below is the axios instance for attaching this url with every api call
const api=axios.create({
    baseURL: "http://localhost:4000"
})

//request interceptor-request interceptor runs before Axios sends the request to your NestJS backend. Mainly for jwt 
api.interceptors.request.use((config)=>{

    //getting token stored in the local storage
    const token=localStorage.getItem("token")

    //attach token
    if(token){
        config.headers.Authorization=`Bearer ${token}`;
    }

    return config;
    
})

//response interceptor-The response interceptor runs after your backend sends a response back to the frontend.
api.interceptors.response.use((response)=>{

    // return the response directly if there is response 
    return response
    },

    //if there is error then erase the token in the local storage and navigate the user to the login page
   (error) => {
    const isAuthEndpoint = error.config?.url?.includes("/login") || error.config?.url?.includes("/signup");

    if (error.response?.status === 401 && !isAuthEndpoint) {
        localStorage.removeItem("token");
        window.location.href = '/login';
    }

    return Promise.reject(error);
}
    

);

export default api;
