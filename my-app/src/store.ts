import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
export interface ApiErrorResponse {
  message: string;
}
export interface BeamUsageReportParams {
  start: string;
  end?: string;
  beamId?: string;
  loomId?: string;
}
export interface Beam{
  _id?: string | undefined
  beamNumber: string
  totalMeters: number
  isClosed: boolean
}
export interface ProductionRecord {
  _id: string;
  beamId: string;
  loomManagement: string;
  operatorId: string;
  meterProduced: number;
  qualityId: string
  date: Date;
  shift: string;
  notes?: string;
}
export interface BeamUsageRecord {
  _id: string;
  beamNumber: string;
  beamMeter: number;
  totalProduced: number;
  remainingBeamMeter: number;
  records: ProductionRecord[];
}

export type BeamUsageResponse = BeamUsageRecord[];

export interface BeamResponse{
  _id?: string | undefined
  beamNumber: string
  totalMeters: number
  isClosed: boolean
  producedMeters: number
  remainingMeters: number
}
export interface CreateProduction {
  beamId: string
  loomId: string
  qualityId: string
  remainingBeam?: string
  operatorId: string;
  loomManagement: string;
  factoryId: string
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
  details?: { 
    _id: string;
    beamNumber: string;
    totalMeters: number;
    producedMeters: number;
    remainingMeters: number;
    isClosed: boolean;
  }[];
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
  phone: string;
  cnic: string;
  address: string
  status: string;
  hireDate: string;
}

export interface Quality{
  _id?: string
  name: string
  pricePerMeter: number
}
export interface PriceHistoryEntry {
  pricePerMeter: number;
  effectiveFrom: Date;
}
export interface QualityResponse{
  _id?: string
  name: string
  pricePerMeter: number
  effectiveFrom: Date
  priceHistory: PriceHistoryEntry[];
}

export interface CreateLoom{
  _id: string
  factoryId: string
  loomNumber: string;
  status: string;
  beam?: string
  beamDate?: Date;
  quality?: string;
}

export interface Loom {
  _id: string;
  factoryId: string
  loomNumber: string;
  status: string;
}
export interface LoomManagement {
  _id: string
  loom: string
  beam: string
  quality: string;
  beamDate: string;
}

export interface DataTypes {
  loomsManageData: LoomManagement[]
  beamsData: Beam[] 
  qualitiesData: Quality[]
  loomsData: Loom[]
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

export type ShiftWiseProductionResponse = {
  _id: string
  date: string
  shift: string
  loom: string
  operator: string
  meterProduced: number
  beamId: string
  notes: string
}

export type ShiftWiseProduction = {
  _id: string
  beamId: string
  date: string
  shift: string
  meterProduced: number
  notes?: string
  loom?: string
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
