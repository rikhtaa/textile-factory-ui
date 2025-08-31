"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { getPayrunReport } from "@/http/api"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { PayrunResponse } from "@/store"


export function PayrunReport() {
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [commit, setCommit] = useState(false)

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['payrun', fromDate, toDate, commit],
    queryFn: () => getPayrunReport(fromDate, toDate, commit),
    enabled: !!fromDate && !!toDate
  })

  const payrunData: PayrunResponse = report?.data

  const totalGross = payrunData?.results?.reduce((sum, result) => sum + (result.gross || 0), 0) || 0
  const totalNet = payrunData?.results?.reduce((sum, result) => sum + (result.net || 0), 0) || 0
  const totalEmployees = payrunData?.results?.length || 0

  return (
    <Card>
      <CardHeader><CardTitle>Payrun Report</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div><Label>From Date</Label><Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></div>
          <div><Label>To Date</Label><Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} /></div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={commit} onChange={(e) => setCommit(e.target.checked)} />
            <Label>Commit Payrun</Label>
          </div>
        </div>

        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-500">Error loading report</div>}
        
        {payrunData ? (
          <div>
            <h3 className="font-semibold mb-4">Payrun for {fromDate} to {toDate}</h3>
            
            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold">Summary</h4>
              <p>Total Gross: ${totalGross.toFixed(2)}</p>
              <p>Total Net: ${totalNet.toFixed(2)}</p>
              <p>Employees: {totalEmployees}</p>
              {payrunData.runId && (
                <p className="text-green-600 font-semibold">Payrun Committed! Run ID: {payrunData.runId}</p>
              )}
            </div>

            {payrunData.results && payrunData.results.length > 0 ? (
              <div className="space-y-6">
                {payrunData.results.map((result) => (
                  <div key={result.operatorId} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">{result.operatorName}</h4>
                    
                    <div className="bg-gray-50 p-3 rounded mb-3">
                      <p><strong>Gross:</strong> ${result.gross.toFixed(2)}</p>
                      <p><strong>Adjustments:</strong> ${result.adjustments.toFixed(2)}</p>
                      <p><strong>Deductions:</strong> ${result.deductions.toFixed(2)}</p>
                      <p><strong>Net Pay:</strong> ${result.net.toFixed(2)}</p>
                    </div>

                    <h5 className="font-semibold mb-2">Production Breakdown</h5>
                    <table className="w-full border-collapse border">
                      <thead><tr className="bg-gray-100">
                        <th className="border p-2">Quality</th>
                        <th className="border p-2">Meters</th>
                        <th className="border p-2">Price/Meter</th>
                        <th className="border p-2">Amount</th>
                      </tr></thead>
                      <tbody>
                        {result.breakdown.map((item, index) => (
                          <tr key={index}>
                            <td className="border p-2">{item.qualityName}</td>
                            <td className="border p-2">{item.meters}m</td>
                            <td className="border p-2">${item.pricePerMeter}</td>
                            <td className="border p-2">${item.amount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No payrun data available for this period</div>
            )}
          </div>
        ) : (
          !isLoading && !error && <div className="text-gray-500">Enter date range to generate payrun report</div>
        )}
      </CardContent>
    </Card>
  )
}