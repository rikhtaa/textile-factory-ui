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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader><CardTitle className="text-lg md:text-xl">Daily Quality Report</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          <div className="w-full sm:w-auto"><Label className="text-sm">Date</Label><Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}  className="w-full"/></div>
          <Button className="w-full sm:w-auto" onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}>Today</Button>
        </div>

        {isLoading && <div className="text-center py-4">Loading...</div>}
        {error && <div className="text-red-500 text-center py-4">Error loading report</div>}
        
        {dailyData && (
          <div>
            <h3 className="font-semibold mb-4 text-sm md:text-base mb-3">Quality Report for {dailyData.date}</h3>
            <div className="overflow-x-auto">
               <div className="m-3">
                  <Button  onClick={()=> window.print()}>Download as PDF</Button>
               </div>
            <table className="w-full border-collapse border">
              <thead><tr className="bg-gray-100">
                <th className="border p-2 text-left">Quality Name</th>
                <th className="border p-2 text-left">Total Looms</th>
                <th className="border p-2 text-left">Total Meters</th>
              </tr></thead>
             
              <tbody>
                {dailyData.rows.length === 0 ? (
                <tr className="hover:bg-gray-50">
                <td colSpan={3} className="border p-4 text-center text-gray-500">
                 No qualities found for this date found.
                </td>
                </tr>
                ) : (
                dailyData.rows.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border p-2">{row.qualityName}</td>
                    <td className="border p-2">{row.numberOfLoomsProducingThatQuality}</td>
                    <td className="border p-2">{row.totalMetersProduced}</td>
                  </tr>
                )))}
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