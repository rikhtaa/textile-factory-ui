"use client"
import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useQuery } from "@tanstack/react-query"
import { getAllBeams, getAllFactories, getAllQualities, getLooms, getWorkers } from "@/http/api"
import { BeamResponse, Factory, Loom, ProductionRecord, Quality, Worker } from "@/store"
import { CustomCombobox } from "./addProduction"
 export interface FilterType {
  date: string;
  loomId: string;
  factoryId: string;
  operatorId: string;
}
interface ProductionTableProps {
  filters: FilterType;
  setFilters: React.Dispatch<React.SetStateAction<FilterType>>;
  productionData: ProductionRecord[];
  isLoading: boolean;
  error?: Error | null;
}
export function ProductionTable({filters, setFilters, productionData, isLoading,   error = null}: ProductionTableProps ) {
    const [openDropdowns, setOpenDropdowns] = useState({
      beam: false,
      operator: false,
      factory: false,
      loom: false,
      quality: false,
      shift: false
    });
  
    const { data: factoriesData } = useQuery({
    queryKey: ['factories'],
    queryFn: getAllFactories 
  })
const { data: loomsData } = useQuery({
    queryKey: ['looms'],
    queryFn: getLooms
  })
const { data: qualitiesData } = useQuery({
      queryKey: ['quality'],
      queryFn: getAllQualities
  })
const { data: operatorsData } = useQuery({
      queryKey: ['workers'],
      queryFn: getWorkers
  })
const { data: beamsData } = useQuery({
      queryKey: ['beam'],
      queryFn: getAllBeams
})


  
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev: FilterType) => ({ ...prev, [key]: value,
      ...(key === 'factoryId' && { loomId: '' }) 
     }))
  }

  const clearFilters = () => {
    setFilters({ date: "", loomId: "", factoryId: "", operatorId: "",
 })
  }

  if (isLoading) return <div>Loading production records...</div>
  if (error) return <div>Error loading records</div>

  const records: ProductionRecord[] = productionData || []
  const factories: Factory[] = factoriesData?.data || []
  const allLooms: Loom[] = loomsData?.data || []
  const qualities: Quality[] = qualitiesData?.data || []
  const operators: Worker[] = operatorsData?.data || []
  const beams: BeamResponse[] = beamsData?.data || []

    const factoryMap = new Map()
    factories.forEach(factory => {
    factoryMap.set(factory._id, factory.name)
  })
  const LoomsMap = new Map()
  allLooms.forEach(loom=>{
    LoomsMap.set(loom._id,loom.loomNumber)
  })
  const qualitiesMap = new Map()
  qualities.forEach(quality => {
    qualitiesMap.set(quality._id, quality.name)
  })
  const operatorsMap = new Map()
  operators.forEach(operator => {
    operatorsMap.set(operator._id, operator.name)
  })
  
 const beamsMap = new Map<string, { number: string; remaining: number }>();
beams.forEach(beam => {
  if (beam._id) {
    beamsMap.set(beam._id, { 
      number: beam.beamNumber,
      remaining: beam.remainingMeters
    });
  }
});  
  

  return (
    <div className="space-y-4 p-2">
      <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <div>
          <Label htmlFor="date" className="text-sm">Date</Label>
          <Input
            id="date"
            type="date"
            value={filters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
           className="w-full"
          />
        </div>
        
        <div>
          <Label htmlFor="loomId" className="text-sm">Loom</Label>
           <CustomCombobox
             value={filters.loomId}
             onValueChange={(value) => handleFilterChange('loomId', value)}
              items={allLooms.map(loom => ({ 
                value: loom._id || 'unknown', 
                label: `${loom.loomNumber}${loom.section ? ` - ${loom.section}` : ''}`
              }))}
              placeholder="Select loom"
              open={openDropdowns.loom}
              onOpenChange={(open) => setOpenDropdowns(prev => ({ ...prev, loom: open }))}
            />
          
        </div>

        <div>
          <Label htmlFor="factoryId" className="text-sm">Factory</Label>
          <CustomCombobox
          value={filters.factoryId}
          onValueChange={(value) => handleFilterChange('factoryId', value)}
          items={factories.map(factory => ({ value: factory._id || 'unknown', label: factory.name }))}
          placeholder="Select factory"
          open={openDropdowns.factory}
          onOpenChange={(open) => setOpenDropdowns(prev => ({ ...prev, factory: open }))}
          />
        </div>

        <div>
          <Label htmlFor="operatorId" className="text-sm">Operator</Label>
           <CustomCombobox
                  value={filters.operatorId}
                  onValueChange={(value) => handleFilterChange('operatorId', value)}
                  items={operators.map(op => ({ value: op._id || 'unknown', label: op.name }))}
                  placeholder="Select operator"
                  open={openDropdowns.operator}
                  onOpenChange={(open) => setOpenDropdowns(prev => ({ ...prev, operator: open }))}
                />
        </div>
       
       <div className="flex items-end">
        <Button onClick={clearFilters} variant="outline">
          Clear Filters
        </Button>
       </div>
      </div>

      <div className="border rounded-lg overflow-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left text-sm">Date</th>
              <th className="p-2 text-left text-sm">Operator</th>
              <th className="p-2 text-left text-sm">Beam</th>
              <th className="p-2 text-left text-sm">Remaining Beam</th>
              <th className="p-2 text-left text-sm">Loom</th>
              <th className="p-2 text-left text-sm">Factory</th>
              <th className="p-2 text-left text-sm">Quality</th>
              <th className="p-2 text-left text-sm">Shift</th>
              <th className="p-2 text-left text-sm">Meters Produced</th>
              <th className="p-2 text-left text-sm">Notes</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => {
                const beamInfo = beamsMap.get(record.beamId); 
              return(
              <tr key={record._id} className="border-b">
                <td className="p-2 text-sm">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="p-2 text-sm">
                  {operatorsMap.get(record.operatorId) || record.operatorId}
                </td>
                <td className="p-2 text-sm">
                  {beamInfo ? beamInfo.number : record.beamId || 'No beam'}
                </td>
                <td className="p-2 text-sm">
                {beamInfo ? `${beamInfo.remaining}` : '-'}
                </td>
                <td className="p-2 text-sm">
                  {LoomsMap.get(record.loomId) || record.loomId}
                </td>
                <td className="p-2 text-sm">
                  {factoryMap.get(record.factoryId) || record.factoryId}
                </td>
                <td className="p-2 text-sm">
                  {qualitiesMap.get(record.qualityId) || record.qualityId}
                </td>
                <td className="p-2 text-sm">{record.shift}</td>
                <td className="p-2 text-sm">{record.meterProduced}</td>
                <td className="p-2 text-sm max-w-[120px] truncate">{record.notes}</td>
              </tr>
            )
            })}
            {records.length === 0 && (
              <tr>
                <td colSpan={10} className="p-4 text-center text-gray-500">
                  No production records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {records.length > 0 && (
        <div className="bg-blue-50 p-3 rounded-lg text-sm">
          <h3 className="font-semibold">Summary</h3>
          <p>Total Records: {records.length}</p>
          <p>Total Meters: { Math.floor(records.reduce((sum, record) => sum + record.meterProduced, 0))}</p>
        </div>
      )}
    </div>
  )
}