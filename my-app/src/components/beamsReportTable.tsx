"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { getBeamsReport, getLooms } from "@/http/api"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { BeamsReportResponse, Loom } from "@/store"
import { CustomCombobox } from "./addProduction"

export function BeamsReport() {
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [loomId, setLoomId] = useState("")
  const [showDetails, setShowDetails] = useState(false) 
  const [openDropdowns, setOpenDropdowns] = useState({ loom: false })

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['beams-report', dateFrom, dateTo, loomId],
    queryFn: () => getBeamsReport(dateFrom, dateTo, String(loomId)),
    enabled: !!dateFrom && !!dateTo
  })

  const { data: loomsData } = useQuery({
    queryKey: ['looms'],
    queryFn: getLooms
  })

  const allLooms: Loom[] = loomsData?.data || []
  const beamsData: BeamsReportResponse = report?.data

  return (
    <Card>
      <CardHeader>
        <CardTitle>Beams Production Report</CardTitle>
      </CardHeader>
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
            <Label>Loom</Label>
            <CustomCombobox
              value={loomId}
              onValueChange={setLoomId}
              items={allLooms.map(loom => ({ 
                value: loom._id || 'unknown', 
                label: loom.loomNumber
              }))}
              placeholder="Filter by loom"
              open={openDropdowns.loom}
              onOpenChange={(open) => setOpenDropdowns(prev => ({ ...prev, loom: open }))}
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
                  <p className="text-2xl font-bold">{beamsData.totalMeters}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Beams</p>
                  <p className="text-2xl font-bold">{beamsData.count}</p>
                </div>
              </div>
              
              <Button 
                onClick={() => setShowDetails(!showDetails)} 
                variant="outline" 
                className="mt-4"
              >
                {showDetails ? 'Hide Beam Details' : 'Show Beam Details'}
              </Button>
            </div>

            {showDetails && beamsData.details && beamsData.details.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Beam Details</h4>
                <table className="w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Beam Number</th>
                      <th className="border p-2">Total Meters</th>
                      <th className="border p-2">Produced</th>
                      <th className="border p-2">Remaining</th>
                      <th className="border p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {beamsData.details.map((beam) => (
                      <tr key={beam._id}>
                        <td className="border p-2">{beam.beamNumber}</td>
                        <td className="border p-2">{Math.floor(beam.totalMeters)}</td>
                        <td className="border p-2">{Math.floor(beam.producedMeters)}</td>
                        <td className="border p-2">{Math.floor(beam.remainingMeters)}</td>
                        <td className="border p-2">
                          <span className={`px-2 py-1 text-xs rounded ${
                            beam.isClosed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {beam.isClosed ? 'Closed' : 'Open'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!beamsData.details && showDetails && (
              <div className="text-center text-gray-500 py-4">
                <p>No detailed beam data available</p>
              </div>
            )}
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