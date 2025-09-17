"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { getPayrunReport } from "@/http/api"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { PayrunResponse } from "@/store"
import { toast } from "sonner"
import { Toaster } from "./ui/sonner"


export function PayrunReport() {
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [commit, setCommit] = useState(false)

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['payrun', fromDate, toDate, commit],
    queryFn: () => getPayrunReport(fromDate, toDate, commit),
    enabled: !!fromDate && !!toDate,
    retry: 0,
  })
  useEffect(() => {
    if(error){
      const err = error as any;
      if(err?.response?.status === 500 ||err?.response?.data?.message.includes('ENOTFOUND') || err.message?.includes('ENOTFOUND')){
        toast.error("No internet connection.")
      }else{
        toast.error(err?.response?.data?.message || err?.message );
      }
    }

}, [error]);

  const payrunData: PayrunResponse = report?.data

  const totalGross = payrunData?.results?.reduce((sum, result) => sum + (result.gross || 0), 0) || 0
  const totalNet = payrunData?.results?.reduce((sum, result) => sum + (result.net || 0), 0) || 0
  const totalEmployees = payrunData?.results?.length || 0
 
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payrun Report</CardTitle>
        <Toaster/>
        </CardHeader>
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
              <p>Total Gross: {Math.floor(totalGross)}</p>
              <p>Total Net: {Math.floor(totalNet)}</p>
              <p>Employees: {totalEmployees}</p>
              {payrunData.runId && (
                <p className="text-green-600 font-semibold">Payrun Committed! name: {payrunData.name}</p>
              )}
            </div>

            {payrunData.results && payrunData.results.length > 0 ? (
              <div className="space-y-6">
                {payrunData.results.map((result) => (
                  <div key={result.operatorId} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">{result.operatorName}</h4>
                    
                    <div className="bg-gray-50 p-3 rounded mb-3">
                      <p><strong>Gross: </strong>{Math.floor(result.gross)}</p>
                      <p><strong>Adjustments: </strong>{Math.floor(result.adjustments)}</p>
                      <p><strong>Deductions: </strong>{Math.floor(result.deductions)}</p>
                      <p><strong>Net Pay: </strong> {Math.floor(result.net)}</p>
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
                            <td className="border p-2">{Math.floor(item.meters)}</td>
                            <td className="border p-2">{Math.floor(item.pricePerMeter)}</td>
                            <td className="border p-2">{Math.floor(item.amount)}</td>
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