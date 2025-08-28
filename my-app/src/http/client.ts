import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json' 
    }
})