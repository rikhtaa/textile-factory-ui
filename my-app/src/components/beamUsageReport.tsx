// components/beamUsageReport.tsx
"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { getBeamUsageReport, getLooms, getAllBeams } from "@/http/api"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { BeamUsageResponse, Beam, Loom } from "@/store"
import { CustomCombobox } from "../components/customCombobox"
import { Button } from "./ui/button"

export function BeamUsageReport() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [beamId, setBeamId] = useState("")
  const [loomId, setLoomId] = useState("")

  const [openDropdowns, setOpenDropdowns] = useState({
    beam: false,
    loom: false,
  });

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['beam-usage', startDate, endDate, beamId, loomId],
    queryFn: () => getBeamUsageReport(startDate, endDate, beamId, loomId),
    enabled: !!startDate,
  })

  const { data: loomsData } = useQuery({
    queryKey: ['looms'],
    queryFn: getLooms
  })

  const { data: beamsData } = useQuery({
    queryKey: ['beam'],
    queryFn: getAllBeams
  })

  const looms: Loom[] = loomsData?.data || []
  const beams: Beam[] = beamsData?.data || []
  const loomsMap = new Map()
  looms.forEach(loom => {
    loomsMap.set(loom._id, loom.loomNumber)
  })
  const beamsMap = new Map()
  beams.forEach(beam => {
    beamsMap.set(beam._id, beam.beamNumber)
  })

  const beamUsageData: BeamUsageResponse = report?.data

  return (
    <Card>
      <CardHeader>
        <CardTitle>Beam Usage Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label>Start Date *</Label>
            <Input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              required 
            />
          </div>
          <div>
            <Label>End Date</Label>
            <Input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
            />
          </div>
          <div>
            <Label>Beam</Label>
            <CustomCombobox
              value={beamId}
              onValueChange={(value) => setBeamId(value)}
              items={beams.map(beam => ({ 
                value: beam._id || 'unknown', 
                label: beam.beamNumber 
              }))}
              placeholder="Select Beam"
              open={openDropdowns.beam}
              onOpenChange={(open) => setOpenDropdowns(prev => ({ ...prev, beam: open }))}
            />
          </div>
          <div>
            <Label>Loom</Label>
            <CustomCombobox
              value={loomId}
              onValueChange={(value) => setLoomId(value)}
              items={looms.map(loom => ({ 
                value: loom._id || 'unknown', 
                label: loom.loomNumber
              }))}
              placeholder="Select Loom"
              open={openDropdowns.loom}
              onOpenChange={(open) => setOpenDropdowns(prev => ({ ...prev, loom: open }))}
            />
          </div>
        </div>

        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-500">Error loading report</div>}
        
        {beamUsageData ? (
          <div>
            <h3 className="font-semibold mb-4">
              Beam Usage from {startDate} to {endDate || "present"}
              {beamId && beamsMap.has(beamId) && ` for Beam ${beamsMap.get(beamId)}`}
              {loomId && loomsMap.has(loomId) && ` on Loom ${loomsMap.get(loomId)}`}
            </h3>
            
            {beamUsageData.length > 0 ? (
              <div className="overflow-x-auto">
                 <div className="m-3">
                  <Button  onClick={()=> window.print()}>Download as PDF</Button>
                 </div>
                <table className="w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Beam Number</th>
                      <th className="border p-2">Beam Meter</th>
                      <th className="border p-2">Total Produced</th>
                      <th className="border p-2">Remaining Meter</th>
                      <th className="border p-2">Usage %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {beamUsageData.map((beam) => (
                      <tr key={beam._id}>
                        <td className="border p-2">{beam.beamNumber}</td>
                        <td className="border p-2">{Math.floor(beam.beamMeter)}</td>
                        <td className="border p-2">{Math.floor(beam.totalProduced)}</td>
                        <td className="border p-2">{Math.floor(beam.remainingBeamMeter)}</td>
                        <td className="border p-2">
                          {Math.floor((beam.totalProduced / beam.beamMeter) * 100)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-gray-500">No beam usage data available for the selected criteria</div>
            )}
          </div>
        ) : (
          !isLoading && !error && <div className="text-gray-500">Enter start date to generate beam usage report</div>
        )}
      </CardContent>
    </Card>
  )
}