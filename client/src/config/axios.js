import axios from "axios"
export const serviceAxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_NODE_ENV === "PROD" ? "https://api.seedhecodestudio.tech" : "http://localhost:3600",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    },
});
