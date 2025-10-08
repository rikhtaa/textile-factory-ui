"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { getPayrunReport } from "@/http/api"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { ApiErrorResponse, PayrunResponse } from "@/store"
import { toast } from "sonner"
import { Toaster } from "./ui/sonner"
import { AxiosError } from "axios"
import { Button } from "./ui/button"


export function PayrunReport() {
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['payrun', fromDate, toDate],
    queryFn: () => getPayrunReport(fromDate, toDate),
    enabled: !!fromDate && !!toDate,
    retry: 0,
  })
  useEffect(() => {
    if(error){
      const err = error as AxiosError<ApiErrorResponse>;
      if(err?.response?.status === 500 ||err?.response?.data?.message.includes('ENOTFOUND') || err.message?.includes('ENOTFOUND')){
        toast.error("No internet connection.")
      }else{
        toast.error(err?.response?.data?.message || err?.message );
      }
    }

}, [error]);

  const payrunData: PayrunResponse = report?.data
  const totalNet = payrunData?.results?.reduce((sum, result) => sum + (result.net || 0), 0) || 0
  const totalEmployees = payrunData?.results?.length || 0
 
  return (
       <Card className="w-full">
      <CardHeader>
        <CardTitle>Payrun Report</CardTitle>
        <Toaster/>
        </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div  className="space-y-2"><Label>From Date</Label><Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full"/></div>
          <div  className="space-y-2"><Label>To Date</Label><Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full"/></div>
        </div>

        {isLoading && <div  className="text-center py-8">Loading...</div>}
        {error && <div className="text-red-500 text-center py-4">Error loading report</div>}
        
        {payrunData ? (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg text-center sm:text-left">Payrun for {fromDate} to {toDate}</h3>
            
            <div className="bg-yellow-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-base mb-3">Summary</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p><strong>Total Net:</strong> {Math.floor(totalNet)}</p>
                </div>
                <div>
                  <p><strong>Employees:</strong> {totalEmployees}</p>
                </div>
              </div>
              {payrunData.runId && (
                <p className="text-green-600 font-semibold mt-3">Payrun Committed! name: {payrunData.name}</p>
              )}
            </div>

            {payrunData.results && payrunData.results.length > 0 ? (
              <div className="space-y-6">
                {payrunData.results.map((result) => (
                  <div key={result.operatorId} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-base mb-3">{result.operatorName}</h4>
                    
                    <div className="bg-gray-50 p-3 rounded mb-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p><strong>Net Pay: </strong> {Math.floor(result.net)}</p>
                        </div>
                      </div>
                    </div>

                    <h5 className="font-semibold text-sm mb-3">Production Breakdown</h5>
                    
                    <div className="hidden sm:block overflow-x-auto">
                       <div className="m-3">
                          <Button  onClick={()=> window.print()}>Download as PDF</Button>
                        </div>
                      <table className="w-full border-collapse border text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border p-2 text-left">Quality</th>
                            <th className="border p-2 text-left">Meters</th>
                            <th className="border p-2 text-left">Price/Meter</th>
                            <th className="border p-2 text-left">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.breakdown.map((item, index) => (
                            <tr key={index}>
                              <td className="border p-2">{item.qualityName}</td>
                              <td className="border p-2 text-right">{Math.floor(item.meters)}</td>
                              <td className="border p-2 text-right">{Math.floor(item.pricePerMeter)}</td>
                              <td className="border p-2 text-right">{Math.floor(item.amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="sm:hidden space-y-3">
                      {result.breakdown.map((item, index) => (
                        <div key={index} className="border rounded-lg p-3 bg-white">
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="space-y-1">
                              <p className="font-semibold text-gray-600">Quality</p>
                              <p>{item.qualityName}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="font-semibold text-gray-600">Meters</p>
                              <p>{Math.floor(item.meters)}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="font-semibold text-gray-600">Price/Meter</p>
                              <p>{Math.floor(item.pricePerMeter)}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="font-semibold text-gray-600">Amount</p>
                              <p className="font-bold">{Math.floor(item.amount)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">No payrun data available for this period</div>
            )}
          </div>
        ) : (
          !isLoading && !error && <div className="text-gray-500 text-center py-8">Enter date range to generate payrun report</div>
        )}
      </CardContent>
    </Card>
  )
}