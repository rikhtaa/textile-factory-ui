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
import { Quality } from "@/store"


interface AddWorkerProps extends React.ComponentProps<"div"> {
  onFormSubmit?: (formData: Quality) => void;
}

export function AddQuality({
  className,
  onFormSubmit,
  ...props
}: AddWorkerProps){
  const [formData, setFormData] = useState<Quality>({
    _id: '',
    name: '',
    pricePerMeter: 0.,
    effectiveFrom: new Date(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onFormSubmit) {
      const { _id, ...qualityData } = formData;
       onFormSubmit(qualityData as Quality);
    }
    setFormData({
      _id: '',
      name: '',
      pricePerMeter: 0.,
      effectiveFrom: new Date(),
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Add Qualities</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6 w-[50%]">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="pricePerMeter">Price Per Meter</Label>
                <Input
                  id="pricePerMeter"
                  type="number"
                  placeholder="778"
                  required
                  value={formData.pricePerMeter}
                  onChange={(e) =>
                    setFormData({ ...formData, pricePerMeter: Number(e.target.value) })
                  }
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