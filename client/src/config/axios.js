import axios from "axios"
export const serviceAxiosInstance = axios.create({
    baseURL: "https://google-calendar-agent-i68n.onrender.com",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    },
});