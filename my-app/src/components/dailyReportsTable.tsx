"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { getDailyLoomsReport } from "@/http/api"
import { DailyLoomsResponse } from "@/store"

export function DailyLoomsReport() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0] // Today's date as default
  )

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['daily-looms', selectedDate],
    queryFn: () => getDailyLoomsReport(selectedDate),
    enabled: !!selectedDate
  })
  

  const dailyData: DailyLoomsResponse = report?.data

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Looms Production and operation Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Date Input */}
          <div className="flex items-end gap-4">
            <div>
              <Label htmlFor="date">Select Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-48"
              />
            </div>
            <Button 
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              variant="outline"
            >
              Today
            </Button>
          </div>

          {isLoading && <div>Loading report...</div>}
          {error && <div className="text-red-500">Error loading report</div>}
          
          {dailyData && (
            <div className="mt-4">
              <h3 className="font-semibold">Report for {dailyData.date}</h3>
              
              <div className="bg-blue-50 p-4 rounded-lg mt-2">
                <h4 className="font-semibold">Summary</h4>
                <p>Total Production: {dailyData.dayTotal}m</p>
                <p>Total Looms: {dailyData.rows.length}</p>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold">Production Details</h4>
                <table className="w-full border-collapse border mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Loom Number</th>
                      <th className="border p-2">Operator</th>
                      <th className="border p-2">Production</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyData.rows.map((row, index) => (
                      <tr key={index}>
                        <td className="border p-2">{row.loomNumber}</td>
                        <td className="border p-2">{row.operatorName}</td>
                        <td className="border p-2">{row.meters}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}