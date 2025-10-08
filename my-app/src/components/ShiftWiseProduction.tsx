"use client"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CustomCombobox } from "@/components/customCombobox"
import { getAllBeams, getShiftWiseProduction } from "@/http/api"
import { BeamResponse, ShiftWiseProduction } from "@/store"
import { Button } from "./ui/button"

const shiftOptions = [
  { label: "Shift A", value: "A" },
  { label: "Shift B", value: "B" },
  { label: "Shift C", value: "C" }
]

export function ShiftWiseProductionReport() {
  const [date, setDate] = useState("")
  const [shift, setShift] = useState("")
  const [openDropdowns, setOpenDropdowns] = useState({ shift: false })

  const { data: report, isLoading, error } = useQuery({
    queryKey: ["shift-production", date, shift],
    queryFn: () => getShiftWiseProduction(date, shift),
    enabled: !!date && !!shift
  })

  const productions: ShiftWiseProduction[] = report?.data || []
    const { data: beamsData } = useQuery({ queryKey: ['beam'], queryFn: getAllBeams })  
    const beams: BeamResponse[] = beamsData?.data || []
    const beamssMap = new Map()
    beams.forEach(beam => {
    beamssMap.set(beam._id, beam.beamNumber)
    })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Shift-wise Production Report</CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Shift</Label>
            <CustomCombobox
              value={shift}
              onValueChange={setShift}
              items={shiftOptions}
              placeholder="Select shift"
              open={openDropdowns.shift}
              onOpenChange={(open) =>
                setOpenDropdowns((prev) => ({ ...prev, shift: open }))
              }
            />
          </div>
        </div>

        {isLoading && <div className="text-center py-6">Loading production data...</div>}
        {error && <div className="text-center text-red-500 py-4">Error loading data</div>}

        {productions.length > 0 ? (
          <div className="overflow-x-auto">
             <div className="m-3">
                <Button  onClick={()=> window.print()}>Download as PDF</Button>
              </div>
            <table className="w-full border-collapse border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Date</th>
                  <th className="border p-2 text-left">Shift</th>
                  <th className="border p-2 text-left">Loom</th>
                  <th className="border p-2 text-left">Beam</th>
                  <th className="border p-2 text-left">Meter Produced</th>
                  <th className="border p-2 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {productions.map((prod) => (
                  <tr key={prod._id}>
                    <td className="border p-2">
                      {new Date(prod.date).toLocaleDateString()}
                    </td>
                    <td className="border p-2">{prod.shift}</td>
                    <td className="border p-2">{prod.loom || "-"}</td>
                    <td className="border p-2"> {beamssMap.get(prod.beamId) || prod.beamId}</td>
                    <td className="border p-2">{prod.meterProduced}</td>
                    <td className="border p-2">{prod.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !isLoading &&
          !error && (
            <div className="text-center text-gray-500 py-6">
              <p>Select a date and shift to view production data</p>
            </div>
          )
        )}
      </CardContent>
    </Card>
  )
}
