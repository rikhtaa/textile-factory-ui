"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { getDailyQualityReport } from "@/http/api"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { DailyQualityResponse } from "@/store"


export function DailyQualityReport() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['daily-quality', selectedDate],
    queryFn: () => getDailyQualityReport(selectedDate)
  })

  const dailyData: DailyQualityResponse = report?.data

  return (
    <Card>
      <CardHeader><CardTitle>Daily Quality Report</CardTitle></CardHeader>
      <CardContent>
        <div className="flex items-end gap-4 mb-4">
          <div><Label>Date</Label><Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} /></div>
          <Button onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}>Today</Button>
        </div>

        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-500">Error loading report</div>}
        
        {dailyData && (
          <div>
            <h3 className="font-semibold mb-4">Quality Report for {dailyData.date}</h3>

            <table className="w-full border-collapse border">
              <thead><tr className="bg-gray-100">
                <th className="border p-2">Quality Name</th>
                <th className="border p-2">Total Looms</th>
                <th className="border p-2">Total Meters</th>
              </tr></thead>
             
              <tbody>
                {dailyData.rows.length === 0 ? (
                <tr>
                <td colSpan={3} className="border p-4 text-center text-gray-500">
                 No qualities found for this date found.
                </td>
                </tr>
                ) : (
                dailyData.rows.map((row, index) => (
                  <tr key={index}>
                    <td className="border p-2">{row.qualityName}</td>
                    <td className="border p-2">{row.numberOfLoomsProducingThatQuality}</td>
                    <td className="border p-2">{row.totalMetersProduced}</td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}