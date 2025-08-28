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
import { Worker } from "@/store"


interface AddWorkerProps extends React.ComponentProps<"div"> {
  onFormSubmit?: (formData: Worker) => void;
}

export function AddWorker({
  className,
  onFormSubmit,
  ...props
}: AddWorkerProps){
  const [formData, setFormData] = useState<Worker>({
    name: '',
    phone: 0,
    role: '',
    email: '',
    status: '',
    hireDate: new Date(),
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onFormSubmit) {
      onFormSubmit(formData);
    }
    setFormData({
      name: '',
      phone: 0,
      role: '',
      email: '',
      status: '',
      hireDate: new Date(),
      password: '',
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Add new worker</CardTitle>
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
                <Label>Role</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      {formData.role || "Select role"}
                      <ChevronDownIcon className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem 
                      onSelect={() => setFormData({ ...formData, role: "admin" })}
                    >
                      admin
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onSelect={() => setFormData({ ...formData, role: "manager" })}
                    >
                      manager
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setFormData({ ...formData, role: "operator" })}
                    >
                      operator
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setFormData({ ...formData, role: "warper" })}
                    >
                      warper
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="number"
                  placeholder="+921347265271"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: Number(e.target.value) })
                  }
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@gmail.com"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="hireDate">Hire Date</Label>
                <Input
                  id="hireDate"
                  type="date"
                  placeholder="11-22-2024"
                  required
                  value={formData.hireDate.toISOString().split('T')[0]}
                  onChange={(e) =>
                    setFormData({ ...formData, hireDate: new Date(e.target.value) })
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
                <div className="flex items-center">
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
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