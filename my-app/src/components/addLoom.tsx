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
import { Loom } from "@/store"


interface AddLoomProps extends React.ComponentProps<"div"> {
  onFormSubmit?: (formData: Loom) => void;
}

export function AddLoom({
  className,
  onFormSubmit,
  ...props
}: AddLoomProps){
  const [formData, setFormData] = useState<Loom>({
    _id: '',
    loomNumber : '',
    section : '',
    status: '',
    beamInfo : '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onFormSubmit) {
      const { _id, ...loomData } = formData;
       onFormSubmit(loomData as Loom);
    }
    setFormData({
       _id: '',
    loomNumber : '',
    section : '',
    status: '',
    beamInfo : '',
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Add new Loom</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6 w-[50%]">
              <div className="grid gap-3">
                <Label htmlFor="loomNumber">loom Number</Label>
                <Input
                  id="loomNumber"
                  type="text"
                  placeholder="Loom-001"
                  required
                  value={formData.loomNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, loomNumber: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section "
                  type="text"
                  placeholder="Weaving Section"
                  value={formData.section}
                  onChange={(e) =>
                    setFormData({ ...formData, section: e.target.value })
                  }
                />
              </div>

               <div className="grid gap-3">
                <Label>Status</Label>
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

              <div className="grid gap-3">
                <Label htmlFor="email">Beam Info</Label>
                <Input
                  id="beamInfo"
                  type="beamInfo"
                  placeholder="Beam details or specifications"
                  required
                  value={formData.beamInfo}
                  onChange={(e) =>
                    setFormData({ ...formData, beamInfo: e.target.value })
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