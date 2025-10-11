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
    new Date().toISOString().split('T')[0] 
  )

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['daily-looms', selectedDate],
    queryFn: () => getDailyLoomsReport(selectedDate),
    enabled: !!selectedDate
  })
  

  const dailyData: DailyLoomsResponse = report?.data

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle  className="text-lg md:text-xl">Daily Looms Production and operation Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div className="w-full sm:w-auto">
              <Label htmlFor="date" className="text-sm">Select Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full"
              />
            </div>
            <Button 
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Today
            </Button>
          </div>

          {isLoading && <div className="text-center py-4">Loading report...</div>}
          {error && <div className="text-red-500 text-center py-4">Error loading report</div>}
          
          {dailyData && (
            <div className="mt-4">
              <h3 className="font-semibold text-sm md:text-base mb-3">Report for {dailyData.date}</h3>
              
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <h4 className="font-semibold text-sm md:text-base mb-2">Summary</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <p>Total Production: 
                <span className="font-medium">{dailyData.dayTotal}</span>
                </p>
                <p>Total Looms: 
                <span className="font-medium">{dailyData.rows.length}</span>
                </p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold text-sm md:text-base mb-2">Production Details</h4>
                <div className="overflow-x-auto">
                   <div className="m-3">
                     <Button  onClick={()=> window.print()}>Download as PDF</Button>
                  </div>
                <table className="w-full border-collapse border mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left text-xs sm:text-sm">Loom Number</th>
                      <th className="border p-2 text-left text-xs sm:text-sm">Operator</th>
                      <th className="border p-2 text-left text-xs sm:text-sm">Production</th>
                      <th className="border p-2 text-left text-xs sm:text-sm">Qualities</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyData.rows.map((row, index) => (
                      <tr key={index}>
                        <td className="border p-2 text-xs sm:text-sm">{row.loomNumber}</td>
                        <td className="border p-2 text-xs sm:text-sm">{row.operatorName}</td>
                        <td className="border p-2 text-xs sm:text-sm">{row.meters}</td>
                        <td className="border p-2 text-xs sm:text-sm">
                          {row.qualities.map(q => q.qualityName).join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}