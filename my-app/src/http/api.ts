import { Worker, WorkerCredentails } from "@/store";
import { api } from "./client";

export const login = (credentials: WorkerCredentails) => api.post('/auth/login', credentials)
export const creatWorker = (worker: Worker)=> api.post('/workers', worker)
export const getWorkers = ()=> api.get('/workers')
