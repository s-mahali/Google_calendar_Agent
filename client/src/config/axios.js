import axios from "axios"
export const serviceAxiosInstance = axios.create({
    baseURL: "http://localhost:3600",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    },
});