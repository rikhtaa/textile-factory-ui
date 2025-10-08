"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { get15DayOperatorReport, getWorkers } from "@/http/api"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import {  Operator15DayResponse, Worker } from "@/store"
import { CustomCombobox } from "../components/customCombobox"
import { Button } from "./ui/button"

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

    const allQualities = operatorData?.daily?.flatMap(day => 
    day.qualities.map(quality => ({ ...quality, date: day.date }))
  ) || [];

  const totalMeters =
  operatorData?.daily?.reduce(
    (sum, day) =>
      sum + day.qualities.reduce((qSum, q) => qSum + (q.meters || 0), 0),
    0
  ) || 0;


  return (
      <Card className="w-full max-w-5xl mx-auto">
      <CardHeader><CardTitle  className="text-lg md:text-xl">15-Day Operator Report</CardTitle></CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
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
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full"/>
          </div>
        </div>

        {isLoading && <div className="text-center py-8">Loading...</div>}
        {error && <div className="text-red-500 text-center py-4">Error loading report</div>}
        
        {operatorData ? (
          <div className="space-y-6">
            <h3 className="font-semibold text-base md:text-lg text-center sm:text-left">
              {operatorData.operatorName} - 15 Days from {operatorData.from} to {operatorData.to}
            </h3>
            
            <div className="bg-purple-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-base mb-3">Summary</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Total Production:</strong> {totalMeters}</p>
                </div>
                <div>
                  <p><strong>Total Payable:</strong> {operatorData.totalPayable || 0}</p>
                </div>
              </div>
            </div>

            {allQualities.length > 0 ? (
              <>
                <div className="hidden sm:block overflow-x-auto">
                   <div className="m-3">
                            <Button  onClick={()=> window.print()}>Download as PDF</Button>
                   </div>
                  <table className="w-full border-collapse border text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Quality</th>
                        <th className="border p-2 text-right">Price/m</th>
                        <th className="border p-2 text-right">Meters</th>
                        <th className="border p-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allQualities.map((quality, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border p-2">{quality.qualityName}</td>
                          <td className="border p-2 text-right">{quality.pricePerMeter}</td>
                          <td className="border p-2 text-right">{quality.meters}</td>
                          <td className="border p-2 text-right">{quality.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="sm:hidden space-y-3">
                  {allQualities.map((quality, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                      <div className="grid grid-cols-2 gap-3 text-xs">
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
              <div className="text-gray-500 text-center py-8">No production data available for this period</div>
            )}
          </div>
        ) : (
          !isLoading && !error && <div className="text-gray-500 text-center py-8">Select operator and start date to generate report</div>
        )}
      </CardContent>
    </Card>
  )
}