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
import { Beam, Quality } from "@/store"
import { Toaster } from "./ui/sonner"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"
import { getAllQualities } from "@/http/api"
import { CustomCombobox } from "./customCombobox"


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
  const [openDropdowns, setOpenDropdowns] = useState({
    quality: false,
  });
  const [formData, setFormData] = useState<Beam>({
    beamNumber: '',
    totalMeters: undefined as unknown as number,
    quality: '',
    isClosed: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (
    !formData.beamNumber ||
    !formData.totalMeters ||
    !formData.quality 
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
      totalMeters: undefined as unknown as number,
      quality: '',
      isClosed: false,
    });
  };

    const { data: qualitiesData } = useQuery({ queryKey: ['quality'], queryFn: getAllQualities })
    const qualities: Quality[] = qualitiesData?.data || []
    const QualitiesMap = new Map()
    qualitiesData?.data?.forEach((quality: Quality) => QualitiesMap.set(quality._id, quality.name))
  return (
    <div className={cn("flex flex-col gap-6 sm:gap-6", className)} {...props}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Add new Beam</CardTitle>
          <Toaster />
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col gap-4 sm:gap-6 w-full md:w-[80%] lg:w-[60%] xl:w-[50%]">
              <div className="grid gap-2 sm:gap-3">
                <Label htmlFor="beamNumber" className="text-sm sm:text-base">Beam Number</Label>
                <Input
                  id="beamNumber"
                  type="text"
                  placeholder="Beam 001"
                  required
                  value={formData.beamNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, beamNumber: e.target.value })
                  }
                  className="text-sm sm:text-base" 
                />
              </div>
              <div className="grid gap-2 sm:gap-3">
                <Label htmlFor="totalMeters" className="text-sm sm:text-base">Total Meters</Label>
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
                 className="text-sm sm:text-base" 
                />
              </div>

              <div className="grid gap-3">
                <Label className="text-sm sm:text-base" htmlFor="quality">Quality</Label>
                <CustomCombobox
                  value={formData.quality}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, quality: value }))}
                  items={qualities.map(q => ({ 
                    value: q._id || 'unknown', 
                    label: q.name 
                  }))}
                  placeholder="Select quality"
                  open={openDropdowns.quality}
                  onOpenChange={(open) => setOpenDropdowns(prev => ({ ...prev, quality: open }))}
                />
              </div>
   
              <div className="grid gap-2 sm:gap-3">
                <Label className="text-sm sm:text-base">Beam Status</Label>
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

              <div className="flex flex-col gap-3 sm:gap-3">
                <Button type="submit" className="w-full text-sm sm:text-base" disabled={isPending}>
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