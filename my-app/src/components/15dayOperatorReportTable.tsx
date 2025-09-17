"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { get15DayOperatorReport, getWorkers } from "@/http/api"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import {  Operator15DayResponse, Worker } from "@/store"
import { CustomCombobox } from "./addProduction"

export function Operator15DayReport() {
  const [operatorId, setOperatorId] = useState("")
  const [startDate, setStartDate] = useState("")
  const [openDropdowns, setOpenDropdowns] = useState({
    operator: false,
  });

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['15day-operator', operatorId, startDate],
    queryFn: () => get15DayOperatorReport(operatorId, startDate),
    enabled: !!operatorId && !!startDate
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

  const operatorData: Operator15DayResponse = report?.data


  const totalMeters =
  operatorData?.daily?.reduce(
    (sum, day) =>
      sum + day.qualities.reduce((qSum, q) => qSum + (q.meters || 0), 0),
    0
  ) || 0;


  return (
    <Card>
      <CardHeader><CardTitle>15-Day Operator Report</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
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
          <div><Label>Start Date</Label><Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
        </div>

        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-500">Error loading report</div>}
        
        {operatorData ? (
          <div>
            <h3 className="font-semibold mb-4">
              {operatorData.operatorName} - 15 Days from {operatorData.from} to {operatorData.to}
            </h3>
            
            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold">Summary</h4>
              <p>Total Production: {totalMeters}</p>
              <p>Total Payable: {operatorData.totalPayable || 0}</p>
            </div>

            {operatorData.daily && operatorData.daily.length > 0 ? (
              <table className="w-full border-collapse border">
                <thead><tr className="bg-gray-100">
                  <th className="border p-2">Quality</th>
                  <th className="border p-2">Price per meter</th>
                  <th className="border p-2">Meters</th>
                  <th className="border p-2">Amount</th>
                </tr></thead>
                <tbody>
                  {operatorData.daily.map((day, index) => (
                      day.qualities.map((quality)=>(
                        <tr key={index}>
                          <td className="border p-2" key={quality._id}>{quality.qualityName }</td>
                          <td className="border p-2" key={quality._id}>{quality.pricePerMeter}</td>
                          <td className="border p-2" key={quality._id}>{quality.meters}</td>
                          <td className="border p-2" key={quality._id}>{quality.amount}</td>
                        </tr>
                      )))
                    )
                  }
                </tbody>
              </table>
            ) : (
              <div className="text-gray-500">No production data available for this period</div>
            )}
          </div>
        ) : (
          !isLoading && !error && <div className="text-gray-500">Enter operator ID and start date to generate report</div>
        )}
      </CardContent>
    </Card>
  )
}