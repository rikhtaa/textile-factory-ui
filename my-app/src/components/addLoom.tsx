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
import { Factory, Loom } from "@/store"
import { useQuery } from "@tanstack/react-query"
import { getAllFactories } from "@/http/api"
import { Toaster } from "./ui/sonner"
import { toast } from "sonner"


interface AddLoomProps extends React.ComponentProps<"div"> {
  onFormSubmit?: (formData: Loom) => void;
  isPending: boolean | undefined
}

export function AddLoom({
  className,
  onFormSubmit,
  isPending, 
  ...props
}: AddLoomProps){
  const [formData, setFormData] = useState<Loom>({
    _id: '',
    factoryId: '',
    loomNumber : '',
    status: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (
    !formData.factoryId ||
    !formData.loomNumber ||
    !formData.status
  ) {
    toast.error("Please fill in all required fields.");
    return;
  }
      
    if (onFormSubmit) {
      const { _id, ...loomData } = formData;
       onFormSubmit(loomData as Loom);
    }
    setFormData({
       _id: '',
      factoryId: '',
    loomNumber : '',
    status: '',
    });
  };

  const {data: factoriesData}=useQuery({
    queryKey:['factories'],
    queryFn:getAllFactories
  })
    const factories: Factory[] = factoriesData?.data || []


  return (
    <div className={cn("flex flex-col gap-6 sm:gap-6", className)} {...props}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Add new Loom</CardTitle>
          <Toaster />
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col gap-4 sm:gap-6 w-full md:w-[80%] lg:w-[60%] xl:w-[50%]">
              <div className="grid gap-2 sm:gap-3">
                <Label htmlFor="loomNumber" className="text-sm sm:text-base">loom Number</Label>
                <Input
                  id="loomNumber"
                  type="text"
                  placeholder="Loom-001"
                  required
                  value={formData.loomNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, loomNumber: e.target.value })
                  }
                  className="text-sm sm:text-base" 
                />
              </div>
              <div className="grid gap-2 sm:gap-3">
              <select
  value={formData.factoryId}
  onChange={(e) => setFormData({...formData, factoryId: e.target.value})}
  className="w-full border rounded-md p-2"
  required
>
  <option value="">Select Factory</option>
  {factories.map(factory => (
    <option key={factory._id} value={factory._id}>
      {factory.name}
    </option>
  ))}
</select>
              </div>

               <div className="grid gap-2 sm:gap-3">
                <Label className="text-sm sm:text-base">Status</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      {formData.status || 'Status'}
                      <ChevronDownIcon className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent> 
                    <DropdownMenuItem onSelect={() => setFormData({...formData, status: "active"})}>
                      active
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setFormData({...formData, status: "inactive"})}>
                      inactive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div> 

              <div className="flex flex-col gap-2 sm:gap-3">
                <Button type="submit" className="w-full text-sm sm:text-base" size="sm" disabled={isPending}>
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