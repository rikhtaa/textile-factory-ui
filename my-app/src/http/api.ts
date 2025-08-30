import { Quality, Worker, WorkerCredentails } from "@/store";
import { api } from "./client";

export const login = (credentials: WorkerCredentails) => api.post('/auth/login', credentials)
export const creatWorker = (worker: Worker)=> api.post('/workers', worker)
export const getWorkers = ()=> api.get('/workers')
export const deleteWorker = (id: string)=> api.delete(`/workers/${id}`)
export const updateWorker = (id: string, worker: Partial<Worker>)=> api.put(`/workers/${id}`,worker)
export const createQuality = (credentials: Quality) => api.post('/qualities', credentials)
