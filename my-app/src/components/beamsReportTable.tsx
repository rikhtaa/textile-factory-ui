"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { getBeamsReport, getLooms } from "@/http/api"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { BeamsReportResponse, Loom } from "@/store"
import { CustomCombobox } from "../components/customCombobox"

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

  const loomMap = new Map();
  allLooms.forEach(loom => {
  if (loom._id) {
    loomMap.set(loom._id, loom.loomNumber);
  }
});


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Beams Production Report</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label>From Date</Label>
            <Input 
              type="date" 
              value={dateFrom} 
              onChange={(e) => setDateFrom(e.target.value)} 
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>To Date</Label>
            <Input 
              type="date" 
              value={dateTo} 
              onChange={(e) => setDateTo(e.target.value)} 
              className="w-full"
            />
          </div>
          <div className="space-y-2">
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

        {isLoading && <div className="text-center py-8">Loading report...</div>}
        {error && <div className="text-red-500 text-center py-4">Error loading report</div>}
        <div className="m-3">
          <Button  onClick={()=> window.print()}>Download as PDF</Button>
       </div>
        {beamsData ? (
          <div className="space-y-6">
            <h3 className="font-semibold  text-lg text-center sm:text-left">
              Beams Report for { beamsData.from }  to { beamsData.to }
              {beamsData.loomId && ` (Loom: ${loomMap.get(beamsData.loomId) || beamsData.loomId})`}
            </h3>
            
            <div className="bg-blue-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-base mb-4">Summary</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Total Production</p>
                  <p className="text-2xl font-bold">{beamsData.totalMeters}</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm text-gray-600">Total Beams</p>
                  <p className="text-2xl font-bold">{beamsData.count}</p>
                </div>
              </div>
              
              <Button 
                onClick={() => setShowDetails(!showDetails)} 
                variant="outline" 
                className="w-full sm:w-auto"
              >
                {showDetails ? 'Hide Beam Details' : 'Show Beam Details'}
              </Button>
            </div>

            {showDetails && beamsData.details && beamsData.details.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Beam Details</h4>
                  <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full border-collapse border text-sm">
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
                          <td className="border p-2 text-right">{Math.floor(beam.totalMeters)}</td>
                          <td className="border p-2 text-right">{Math.floor(beam.producedMeters)}</td>
                          <td className="border p-2 text-right">{Math.floor(beam.remainingMeters)}</td>
                          <td className="border p-2 text-center">
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

                <div className="sm:hidden space-y-3">
                  {beamsData.details.map((beam) => (
                    <div key={beam._id} className="border rounded-lg p-4 bg-white">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-600">Beam Number</p>
                          <p>{beam.beamNumber}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-600">Status</p>
                          <span className={`px-2 py-1 text-xs rounded ${
                            beam.isClosed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {beam.isClosed ? 'Closed' : 'Open'}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-600">Total Meters</p>
                          <p>{Math.floor(beam.totalMeters)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-600">Produced</p>
                          <p>{Math.floor(beam.producedMeters)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-600">Remaining</p>
                          <p>{Math.floor(beam.remainingMeters)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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