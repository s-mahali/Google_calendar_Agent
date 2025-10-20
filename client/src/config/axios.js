import axios from "axios"
export const serviceAxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_NODE_ENV === "PROD" ? "https://google-calendar-agent-i68n.onrender.com" : "http://localhost:3600",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    },
});