import { BulkProductionImport, CreateProduction, Loom, Quality, Worker, WorkerCredentails } from "@/store";
import { api } from "./client";

export const login = (credentials: WorkerCredentails) => api.post('/auth/login', credentials)
export const creatWorker = (worker: Worker)=> api.post('/workers', worker)
export const getWorkers = ()=> api.get('/workers')
export const deleteWorker = (id: string)=> api.delete(`/workers/${id}`)
export const updateWorker = (id: string, worker: Partial<Worker>)=> api.put(`/workers/${id}`,worker)
export const createQuality = (credentials: Quality) => api.post('/qualities', credentials)
export const createLoom = (credentials: Loom) => api.post('/looms', credentials)
export const getLooms = () => api.get('/looms')
export const deleteLooms = (id: string) => api.delete(`/looms/${id}`)
export const updateLooms = (id: string, loom: Partial<Loom>) => api.put(`/looms/${id}`, loom)
export const getBeamsReport = () => api.get('/beams/report')
export const createProduction = (credentials: CreateProduction) => api.post('/production', credentials)
export const createProductionBulk = (credentials: BulkProductionImport) => api.post('/production/bulk', credentials)
export const getListProduction = (filters?: { date: string; loomId: string; operatorId: string; }) => api.get('/production')
export const getDailyLoomsReport = (date: string)=> api.get('/reports/daily-looms', { params: { date } })