"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { getOperatorPeriodReport, getWorkers } from "@/http/api"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { OperatorPeriodResponse, Worker } from "@/store"
import { CustomCombobox } from "./addProduction"

export function OperatorPeriodReport() {
  const [operatorId, setOperatorId] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['operator-period', operatorId, fromDate, toDate],
    queryFn: () => getOperatorPeriodReport(operatorId, fromDate, toDate),
    enabled: !!operatorId && !!fromDate && !!toDate
  })
  const { data: operatorsData } = useQuery({
        queryKey: ['workers'],
        queryFn: getWorkers
    })
  const operators: Worker[] = operatorsData?.data || []
  const operatorsMap = new Map()
  operators.forEach(operator => {
    operatorsMap.set(operator._id, operator.name)
  })
    const [openDropdowns, setOpenDropdowns] = useState({
      operator: false,
    });

  const periodData: OperatorPeriodResponse = report?.data

  return (
    <Card>
      <CardHeader><CardTitle>Operator Period Report</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div><Label>Operator</Label>
          <CustomCombobox
          value={operatorId}
          onValueChange={(value) => setOperatorId(value)}
          items={operators.map(op => ({ value: op._id || 'unknown', label: op.name }))}
          placeholder="Select operator"
          open={openDropdowns.operator}
          onOpenChange={(open) => setOpenDropdowns(prev => ({ ...prev, operator: open }))}
          />
          </div>
          <div><Label>From Date</Label><Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></div>
          <div><Label>To Date</Label><Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} /></div>
        </div>

        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-500">Error loading report</div>}
        
        {periodData && (
          <div>
            <h3 className="font-semibold mb-4">{periodData.operatorName} - {periodData.from} to {periodData.to}</h3>
            
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold">Summary</h4>
              <p>Total Production: {periodData.daily.reduce((sum, day) => sum + day.meters, 0)}m</p>
              <p>Total Days: {periodData.daily.length}</p>
              <p>Total Payable: ${periodData.totalPayable}</p>
            </div>

            {periodData.daily.length > 0 ? (
              <table className="w-full border-collapse border">
                <thead><tr className="bg-gray-100">
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Loom</th>
                  <th className="border p-2">Quality</th>
                  <th className="border p-2">Meters</th>
                </tr></thead>
                <tbody>
                  {periodData.daily.map((day, index) => (
                    <tr key={index}>
                      <td className="border p-2">{day.date}</td>
                      <td className="border p-2">{day.loomNumber}</td>
                      <td className="border p-2">{day.qualityName}</td>
                      <td className="border p-2">{day.meters}m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-gray-500">No production data found for this period</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}