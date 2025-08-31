"use client"
import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useQuery } from "@tanstack/react-query"
import { getListProduction } from "@/http/api"
import { ProductionRecord } from "@/store"


export function ProductionTable() {
  const [filters, setFilters] = useState({
    date: "",
    loomId: "",
    operatorId: ""
  })

  const { data: productionData, isLoading, error } = useQuery({
    queryKey: ['production', filters],
    queryFn: () => getListProduction(filters)
  })

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({ date: "", loomId: "", operatorId: "" })
  }

  if (isLoading) return <div>Loading production records...</div>
  if (error) return <div>Error loading records</div>

  const records: ProductionRecord[] = productionData?.data || []

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end p-4 bg-gray-50 rounded-lg">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={filters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="loomId">Loom ID</Label>
          <Input
            id="loomId"
            value={filters.loomId}
            onChange={(e) => handleFilterChange('loomId', e.target.value)}
            placeholder="Filter by loom"
          />
        </div>

        <div>
          <Label htmlFor="operatorId">Operator ID</Label>
          <Input
            id="operatorId"
            value={filters.operatorId}
            onChange={(e) => handleFilterChange('operatorId', e.target.value)}
            placeholder="Filter by operator"
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
                  {record.operator?.name || record.operatorId}
                </td>
                <td className="border p-2">
                  {record.loom?.loomNumber || record.loomId}
                </td>
                <td className="border p-2">
                  {record.quality?.name || record.qualityId}
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