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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { ChevronDownIcon } from "lucide-react"
import { useState } from "react"
import { Beam } from "@/store"
import { Toaster } from "./ui/sonner"
import { toast } from "sonner"


interface AddBeamProps extends React.ComponentProps<"div"> {
  onFormSubmit?: (formData: Beam) => void;
  isPending: boolean | undefined
}

export function AddBeam({
  className,
  onFormSubmit,
  isPending,
  ...props
}: AddBeamProps){
  const [formData, setFormData] = useState<Beam>({
    beamNumber: '',
    totalMeters: 0,
    isClosed: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (
    !formData.beamNumber ||
    !formData.totalMeters
    ){
    toast.error("Please fill in all required fields.");
    return;
  }
    if (onFormSubmit) {
      const { _id, ...BeamData } = formData;
       onFormSubmit(BeamData as Beam);
    }
    setFormData({
      beamNumber: '',
      totalMeters: 0,
      isClosed: false,
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-ful">
        <CardHeader className="flex justify-between">
          <CardTitle>Add new Beam</CardTitle>
          <Toaster />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6 w-[50%]">
              <div className="grid gap-3">
                <Label htmlFor="beamNumber">Beam Number</Label>
                <Input
                  id="beamNumber"
                  type="text"
                  placeholder="Beam 001"
                  required
                  value={formData.beamNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, beamNumber: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="totalMeters">Total Meters</Label>
                <Input
                  id="totalMeters"
                  type="number"
                  placeholder="11.2"
                  required
                  value={formData.totalMeters}
                  onChange={(e) =>
                    setFormData({ ...formData, totalMeters: Number(e.target.value) })
                  }
                  onWheel={(e) => e.currentTarget.blur()}
                />
              </div>
             
              <div className="grid gap-3">
                <Label>Beam Status</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      {formData.isClosed ? "Closed" : "Open"}
                      <ChevronDownIcon className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent> 
                    <DropdownMenuItem onSelect={() =>
                      { 
                        setFormData({...formData, isClosed: false})
                      }}>
                      Open
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() =>
                    {
                       setFormData({...formData, isClosed: true})
                    }}>
                      Closed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div> 

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isPending}>
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