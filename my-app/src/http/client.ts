import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json' 
    }
})

api.interceptors.request.use(
 (config)=>{
  const token = localStorage.getItem('auth-token')
  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }else{
    console.warn('No auth token found'); 
  }
  return config
 },
 (error)=>{
  return Promise.reject(error)
 }
)