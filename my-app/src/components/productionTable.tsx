"use client"
import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useQuery } from "@tanstack/react-query"
import { getAllFactories, getAllQualities, getListProduction, getLooms, getWorkers } from "@/http/api"
import { CreateProduction, Factory, Loom, ProductionRecord, Quality, Worker } from "@/store"
import { CustomCombobox } from "./addProduction"


export function ProductionTable() {
  const [filters, setFilters] = useState({
    date: "",
    loomId: "",
    factoryId: "",
    operatorId: ""
  })
  const [formData, setFormData] = useState({
    date: "",
    loomId: "",
    factoryId: "",
    operatorId: ""
    });
    const [openDropdowns, setOpenDropdowns] = useState({
      operator: false,
      factory: false,
      loom: false,
      quality: false,
      shift: false
    });
  
  

  const { data: productionData, isLoading, error } = useQuery({
    queryKey: ['production', filters],
    queryFn: () => getListProduction(filters)
  })
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

  
  
  
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({ date: "", loomId: "", factoryId: "", operatorId: "",
 })
  }

  if (isLoading) return <div>Loading production records...</div>
  if (error) return <div>Error loading records</div>

  const records: ProductionRecord[] = productionData?.data || []
  const factories: Factory[] = factoriesData?.data || []
  const allLooms: Loom[] = loomsData?.data || []
  const qualities: Quality[] = qualitiesData?.data || []
  const operators: Worker[] = operatorsData?.data || []

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
  



  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end p-4 bg-gray-50 rounded-lg">
        <div>
          <Label htmlFor="date" className="pb-1">Date</Label>
          <Input
            id="date"
            type="date"
            value={filters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="loomId" className="pb-1">Loom</Label>
           <CustomCombobox
             value={formData.loomId}
             onValueChange={(value) => setFormData(prev => ({ ...prev, loomId: value }))}
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
          <Label htmlFor="factoryId" className="pb-1">Factory</Label>
          <CustomCombobox
          value={formData.factoryId}
          onValueChange={(value) => setFormData(prev => ({ ...prev, factoryId: value, loomId: '' }))}
          items={factories.map(factory => ({ value: factory._id || 'unknown', label: factory.name }))}
          placeholder="Select factory"
          open={openDropdowns.factory}
          onOpenChange={(open) => setOpenDropdowns(prev => ({ ...prev, factory: open }))}
          />
        </div>

        <div>
          <Label htmlFor="operatorId" className="pb-1">Operator</Label>
           <CustomCombobox
                  value={formData.operatorId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, operatorId: value }))}
                  items={operators.map(op => ({ value: op._id || 'unknown', label: op.name }))}
                  placeholder="Select operator"
                  open={openDropdowns.operator}
                  onOpenChange={(open) => setOpenDropdowns(prev => ({ ...prev, operator: open }))}
                />
        </div>

        <Button onClick={clearFilters} variant="outline">
          Clear Filters
        </Button>
      </div>

      <div className="border rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Date</th>
              <th className="border p-2">Operator</th>
              <th className="border p-2">Loom</th>
              <th className="border p-2">Factory</th>
              <th className="border p-2">Quality</th>
              <th className="border p-2">Shift</th>
              <th className="border p-2">Meters Produced</th>
              <th className="border p-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id}>
                <td className="border p-2">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  {operatorsMap.get(record.operatorId) || record.operatorId}
                </td>
                <td className="border p-2">
                  {LoomsMap.get(record.loomId) || record.loomId}
                </td>
                <td className="border p-2">
                  {factoryMap.get(record.factoryId) || record.factoryId}
                </td>
                <td className="border p-2">
                  {qualitiesMap.get(record.qualityId) || record.qualityId}
                </td>
                <td className="border p-2">{record.shift}</td>
                <td className="border p-2">{record.meterProduced}</td>
                <td className="border p-2">{record.notes}</td>
              </tr>
            ))}
            
            {records.length === 0 && (
              <tr>
                <td colSpan={7} className="border p-4 text-center text-gray-500">
                  No production records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {records.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold">Summary</h3>
          <p>Total Records: {records.length}</p>
          <p>Total Meters: {records.reduce((sum, record) => sum + record.meterProduced, 0)}</p>
        </div>
      )}
    </div>
  )
}