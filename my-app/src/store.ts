import { create } from "zustand"
import { devtools  } from "zustand/middleware"

export interface Worker {
  _id: string;
  name: string;
  phone: number;
  role: string;
  email: string;
  status: string;
  hireDate: Date;
  password: string;
}

export interface Quality{
  _id: string
  name: string
  pricePerMeter: number
  effectiveFrom: Date
}

export interface Loom {
  _id: string;
  loomNumber: string;
  section?: string;
  status: string;
  beamInfo?: string;
}

export interface LoginFormValues {
  email: string
  password: string
}

export type WorkerCredentails={
    email: string
    password: string
}

interface AuthState{
    user: null | LoginFormValues
    setUser: (user: LoginFormValues)=> void
    logout: ()=> void   
}

export const useAuthStore = create<AuthState>()(
   devtools((set)=>({
    user: null,
    setUser: (user)=> set({user}),
    logout: ()=> set({user: null})
   }))
)