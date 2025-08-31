"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { getBeamsReport } from "@/http/api"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { BeamsReportResponse } from "@/store"

export function BeamsReport() {
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [loomId, setLoomId] = useState("")

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['beams-report', dateFrom, dateTo, loomId],
    queryFn: () => getBeamsReport(dateFrom, dateTo, loomId),
    enabled: !!dateFrom && !!dateTo
  })

  const beamsData: BeamsReportResponse = report?.data

  return (
    <Card>
      <CardHeader><CardTitle>Beams Production Report</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <Label>From Date</Label>
            <Input 
              type="date" 
              value={dateFrom} 
              onChange={(e) => setDateFrom(e.target.value)} 
            />
          </div>
          <div>
            <Label>To Date</Label>
            <Input 
              type="date" 
              value={dateTo} 
              onChange={(e) => setDateTo(e.target.value)} 
            />
          </div>
          <div>
            <Label>Loom ID (Optional)</Label>
            <Input 
              value={loomId} 
              onChange={(e) => setLoomId(e.target.value)} 
              placeholder="Filter by loom ID"
            />
          </div>
        </div>

        {isLoading && <div>Loading report...</div>}
        {error && <div className="text-red-500">Error loading report</div>}
        
        {beamsData ? (
          <div>
            <h3 className="font-semibold mb-4">
              Beams Report for {beamsData.from} to {beamsData.to}
              {beamsData.loomId && ` (Loom: ${beamsData.loomId})`}
            </h3>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold">Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Production</p>
                  <p className="text-2xl font-bold">{beamsData.totalMeters}m</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Beams</p>
                  <p className="text-2xl font-bold">{beamsData.count}</p>
                </div>
              </div>
              {beamsData.loomId && (
                <p className="text-sm text-gray-600 mt-2">
                  Filtered by Loom: {beamsData.loomId}
                </p>
              )}
            </div>

            <div className="text-center text-gray-500">
              <p>This report shows aggregate beam production data.</p>
              <p>Use the filters above to refine your report.</p>
            </div>
          </div>
        ) : (
          !isLoading && !error && (
            <div className="text-center text-gray-500 py-8">
              <p>Select a date range to generate beams production report</p>
              <p className="text-sm">You can optionally filter by a specific loom</p>
            </div>
          )
        )}
      </CardContent>
    </Card>
  )
}