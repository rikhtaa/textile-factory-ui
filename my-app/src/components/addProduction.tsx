"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { CreateProduction, Loom } from "@/store"


interface AddProductionProps extends React.ComponentProps<"div"> {
  onFormSubmit?: (formData: CreateProduction) => void;
}

export function AddProduction({
  className,
  onFormSubmit,
  ...props
}: AddProductionProps){
  const [formData, setFormData] = useState<CreateProduction>({
    operatorId: '',
    loomId : '',
    qualityId : '',
    date: new Date(),
    shift : '',
    meterProduced: 0.1,
    notes: ''

  });

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  const productionData = {
    operatorId: formData.operatorId,
    loomId: formData.loomId,
    qualityId: formData.qualityId,
    date: formData.date, 
    shift: formData.shift,
    meterProduced: formData.meterProduced,
    notes: formData.notes
  };

  if (onFormSubmit) {
    onFormSubmit(productionData);
  }

  setFormData({
    operatorId: '',
    loomId: '',
    qualityId: '',
    date: new Date(),
    shift: '',
    meterProduced: 0.1,
    notes: ''
  });
};

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Add Production</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6 w-[50%]">
              <div className="grid gap-3">
                <Label htmlFor="operatorId">Operator Id</Label>
                <Input
                  id="operatorId"
                  type="text"
                  placeholder="2321"
                  required
                  value={formData.operatorId}
                  onChange={(e) =>
                    setFormData({ ...formData, operatorId: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="loomId">Loom Id</Label>
                <Input
                  id="loomId "
                  type="text"
                  placeholder="1113"
                  value={formData.loomId}
                  onChange={(e) =>
                    setFormData({ ...formData, loomId: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  placeholder="11-11-1111"
                  value={formData.date.toISOString().split('T')[0]}
                  onChange={(e) =>
                    setFormData({ ...formData, date: new Date(e.target.value) })
                  }
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="qualityId">Quality Id</Label>
                <Input
                  id="qualityId"
                  type="string"
                  placeholder="12122"
                  required
                  value={formData.qualityId}
                  onChange={(e) =>
                    setFormData({ ...formData, qualityId: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-3">
               <select
               value={formData.shift}
               onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
              >
              <option value="">Select Shift</option>
              <option value="A">Shift A</option>
              <option value="B">Shift B</option>
              <option value="C">Shift C</option>
             </select>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="meterProduced">meterProduced</Label>
                <Input
                  id="meterProduced"
                  type="number"
                  placeholder="11.1"
                  required
                  value={formData.meterProduced}
                  onChange={(e) =>
                    setFormData({ ...formData, meterProduced: Number(e.target.value) })
                  }
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="notes">Notes</Label>
               <textarea
               id="notes"
              placeholder="Enter production notes, issues, observations..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full border rounded-md p-2"
              />
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Create
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}