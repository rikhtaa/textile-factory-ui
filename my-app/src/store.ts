import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

export interface CreateProduction {
  operatorId: string;
  loomId: string;
  factoryId: string
  qualityId: string;
  date: Date; 
  shift: string;
  meterProduced: number
  notes?: string;
}

export interface ProductionFilters {
  date?: string;
  loomId?: string;
  operatorId?: string;
  factoryId?: string;
}

export interface BeamsReportResponse {
  from: string;
  to: string;
  loomId: string | null;
  totalMeters: number;
  count: number;
}

export interface BulkProductionImport{
  upsert?: boolean;
  records: CreateProduction[];
}
export interface PayrunResponse {
results: Array<{
    operatorId: string;
    operatorName: string;
    breakdown: Array<{
      qualityId: string;
      qualityName: string;
      meters: number;
      pricePerMeter: number;
      amount: number;
    }>;
    gross: number;
    adjustments: number;
    deductions: number;
    net: number;
  }>;
  runId?: string;
  name: string
}

export interface OperatorPeriodResponse {
  operatorId: string;
  operatorName: string;
  from: string;
  to: string;
  daily: Array<{
    date: string;
    loomNumber: string;
    qualityName: string;
    meters: number;
  }>;
  totalPayable: number;
}

export interface Operator15DayResponse {
   operatorId: string;
  operatorName: string;
  from: string;
  to: string;
  daily: Array<{
    date: string;
    qualities: Array<{
      _id: string
     qualityName: string
      pricePerMeter: number
      meters: number
      amount: number
    }>
  }>;
  totalPayable: number;
}

export interface DailyQualityResponse {
  date: string;
  rows: Array<{
    qualityName: string;
    numberOfLoomsProducingThatQuality: number;
    totalMetersProduced: number;
  }>;
  dayTotal: number;
}

export interface ProductionRecord extends CreateProduction {
  _id: string
  createdAt: Date
  updatedAt: Date
  operator?: { name: string }
  loom?: { loomNumber: string }
  quality?: { name: string }
}

export interface DailyLoomsResponse {
  date: string;
  rows: Array<{
    loomNumber: string;
    operatorName: string;
    meters: number;
  }>;
  dayTotal: number;
}

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
  _id?: string
  name: string
  pricePerMeter: number
  effectiveFrom: Date
}

export interface Loom {
  _id: string;
  factoryId: string
  loomNumber: string;
  section?: string;
  status: string;
  beamInfo?: string;
}

export interface Factory{
 _id: string
 name: string
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
   devtools(
    persist(
    (set)=>({
    user: null,
    setUser: (user)=> set({user}),
    logout: ()=>{
      localStorage.removeItem("auth-token")
     set({user: null})
    }
    }),
     {
        name: "auth-storage",
      }
    )
    )
  )
