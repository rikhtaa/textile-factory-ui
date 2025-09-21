"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { getOperatorPeriodReport, getWorkers } from "@/http/api"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Operator15DayResponse, OperatorPeriodResponse, Worker } from "@/store"
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

  const operatorData: Operator15DayResponse = report?.data
    const totalMeters =
  operatorData?.daily?.reduce(
    (sum, day) =>
      sum + day.qualities.reduce((qSum, q) => qSum + (q.meters || 0), 0),
    0
  ) || 0;

  const allQualities = operatorData?.daily?.flatMap(day => 
    day.qualities.map(quality => ({ ...quality, date: day.date }))
  ) || [];
  
  return (
    <Card  className="w-full">
      <CardHeader><CardTitle>Operator Period Report</CardTitle></CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="space-y-4 mb-6">
          <div  className="space-y-2">
          <Label>Operator</Label>
          <CustomCombobox
          value={operatorId}
          onValueChange={(value) => setOperatorId(value)}
          items={operators.map(op => ({ value: op._id || 'unknown', label: op.name }))}
          placeholder="Select operator"
          open={openDropdowns.operator}
          onOpenChange={(open) => setOpenDropdowns(prev => ({ ...prev, operator: open }))}
          />
          </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
          <Label>From Date</Label><Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full"/></div>
          <div className="space-y-2"><Label>To Date</Label><Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full"/></div>
           </div>
        </div>

        {isLoading && <div className="text-center py-8">Loading...</div>}
        {error && <div className="text-red-500 text-center py-4">Error loading report</div>}
        
        {operatorData && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-center sm:text-left">{operatorData.operatorName} - {operatorData.from} to {operatorData.to}</h3>
            
            <div className="bg-green-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-base mb-2">Summary</h4>
                 <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
              <p  className="text-sm sm:text-base">Total Production: {totalMeters}</p>
                </div>
                <div>
              <p  className="text-sm sm:text-base">Total Payable: {operatorData.totalPayable}</p>
            </div>
            </div>
            </div>

             {operatorData.daily && operatorData.daily.length > 0 ? (
              <>
              <div className="hidden sm:block overflow-x-auto">
              <table className="w-full border-collapse border text-sm">
                <thead><tr className="bg-gray-100">
                  <th className="border p-2 text-left">Quality</th>
                  <th className="border p-2 text-left">Price per meter</th>
                  <th className="border p-2 text-left">Meters</th>
                  <th className="border p-2 text-left">Amount</th>
                </tr></thead>
                <tbody>
                  {operatorData.daily.map((day, index) => (
                      day.qualities.map((quality)=>(
                        <tr key={index}>
                          <td className="border p-2 " key={quality._id}>{quality.qualityName }</td>
                          <td className="border p-2 text-right" key={quality._id}>{quality.pricePerMeter}</td>
                          <td className="border p-2 text-right" key={quality._id}>{quality.meters}</td>
                          <td className="border p-2 text-right" key={quality._id}>{quality.amount}</td>
                        </tr>
                      )))
                    )
                  }
                </tbody>
              </table>
              </div>
               <div className="sm:hidden space-y-3">
                  {allQualities.map((quality, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-600">Quality</p>
                          <p>{quality.qualityName}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-600">Price/m</p>
                          <p>{quality.pricePerMeter}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-600">Meters</p>
                          <p>{quality.meters}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-600">Amount</p>
                          <p className="font-bold">{quality.amount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-gray-500 text-sm sm:text-base">No production data available for this period</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}