"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {  BulkProductionImport, CreateProduction } from "@/store"

interface BulkImportProps {
  onBulkImport?: (data: BulkProductionImport) => void;
}

export function AddBulkProduction({ onBulkImport }: BulkImportProps) {
  const [csvData, setCsvData] = useState("")
  const [upsert, setUpsert] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const lines = csvData.trim().split('\n')
      const headers = lines[0].split(',').map(h => h.trim())
      
      const records: CreateProduction[] = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim())
        const record: any = {}
        
        headers.forEach((header, index) => {
          record[header] = values[index]
        })
        
        return {
          operatorId: record.operatorId,
          loomId: record.loomId,
          qualityId: record.qualityId,
          date: record.date, 
          shift: record.shift || '',
          meterProduced: Number(record.meterProduced),
          notes: record.notes || ''
        }
      })

      const bulkData: BulkProductionImport = {
        upsert,
        records
      }

      if (onBulkImport) {
        onBulkImport(bulkData)
      }

      setCsvData("")
      
    } catch (error) {
      console.error("Error parsing CSV:", error)
      alert("Error parsing CSV data. Please check the format.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Import Production Records</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="upsert">
              <input
                type="checkbox"
                id="upsert"
                checked={upsert}
                onChange={(e) => setUpsert(e.target.checked)}
                className="mr-2"
              />
              Upsert (update existing records)
            </Label>
          </div>

          <div>
            <Label htmlFor="csvData">CSV Data</Label>
            <textarea
              id="csvData"
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              placeholder={`operatorId,loomId,qualityId,date,shift,meterProduced,notes\n67a1b2c3d4e5f67890123456,67a1b2c3d4e5f67890123457,67a1b2c3d4e5f67890123458,2024-01-15,A,1250.5,Smooth operation\n67a1b2c3d4e5f67890123456,67a1b2c3d4e5f67890123457,67a1b2c3d4e5f67890123458,2024-01-16,B,920.3,Minor issues`}
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          <Button type="submit">Import Records</Button>
        </form>
      </CardContent>
    </Card>
  )
}