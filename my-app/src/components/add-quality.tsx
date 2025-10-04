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
import { Toaster } from "./ui/sonner"
import { toast } from "sonner"


interface AddWorkerProps extends React.ComponentProps<"div"> {
  onFormSubmit?: (formData: Quality) => void;
  isPending: boolean | undefined
}

export function AddQuality({
  className,
  onFormSubmit,
  isPending,
  ...props
}: AddWorkerProps){
  const [formData, setFormData] = useState<Quality>({
    _id: '',
    name: '',
    pricePerMeter: undefined as unknown as number,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (
       !formData.name ||
    !formData.pricePerMeter
  ){
    toast.error("Please fill in all required fields.");
    return;
  }
    if (onFormSubmit) {
      const { _id, ...qualityData } = formData;
       onFormSubmit(qualityData as Quality);
    }
    setFormData({
      _id: '',
      name: '',
      pricePerMeter: undefined as unknown as number,
    });
  };

  return (
    <div className={cn("flex flex-col gap-6 sm:gap-6", className)} {...props}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Add Qualities</CardTitle>
          <Toaster/>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col gap-4 sm:gap-6 w-full md:w-[80%] lg:w-[60%] xl:w-[50%]">
              <div className="grid gap-2 sm:gap-3">
                <Label htmlFor="name" className="text-sm sm:text-base">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                   className="text-sm sm:text-base" 
                />
              </div>
              <div className="grid gap-2 sm:gap-3">
                <Label htmlFor="pricePerMeter" className="text-sm sm:text-base">Price Per Meter</Label>
                <Input
                  id="pricePerMeter"
                  type="number"
                  placeholder="778"
                  required
                  value={formData.pricePerMeter}
                  onChange={(e) =>
                    setFormData({ ...formData, pricePerMeter: Number(e.target.value) })
                  }
                  onWheel={(e) => e.currentTarget.blur()}
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="flex flex-col gap-2 sm:gap-3">
                <Button type="submit" className="w-full text-sm sm:text-base" disabled={isPending} size="sm">
                {isPending ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}