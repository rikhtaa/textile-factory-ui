"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { Toaster } from "./ui/sonner";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

interface WorkerForm {
  _id: string
  name: string;
  phone: string;
  cnic: string;
  address: string;
  hireDate: string; 
  status: string;
}

interface AddWorkerProps extends React.ComponentProps<"div"> {
  onFormSubmit?: (formData: WorkerForm) => void;
  isPending: boolean | undefined;
}

export function AddWorker({
  className,
  onFormSubmit,
  isPending,
  ...props
}: AddWorkerProps) {
  const { register, handleSubmit, reset } = useForm<WorkerForm>();
  const [status, setStatus] = useState(""); 

  const submitHandler = (data: WorkerForm) => {
    if (!status) {
      toast.error("Please select a status.");
      return;
    }

    const workerData = { ...data, status };
    onFormSubmit?.(workerData);

    reset();
    setStatus("");
  };

  return (
    <div className={cn("flex flex-col gap-6 sm:gap-6", className)} {...props}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Add worker</CardTitle>
          <Toaster />
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit(submitHandler)} className="w-full">
            <div className="flex flex-col gap-4 sm:gap-6 w-full md:w-[80%] lg:w-[60%] xl:w-[50%]">
              <div className="grid gap-2 sm:gap-3">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="John Doe" required {...register("name")} />
              </div>

              <div className="grid gap-2 sm:gap-3">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Houston, TX" required {...register("address")} />
              </div>

              <div className="grid gap-2 sm:gap-3">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="text" placeholder="+921347265271" required {...register("phone")} />
              </div>

              <div className="grid gap-2 sm:gap-3">
                <Label htmlFor="cnic">CNIC</Label>
                <Input id="cnic" type="text" placeholder="456456666656" required {...register("cnic")} />
              </div>

              <div className="grid gap-2 sm:gap-3">
                <Label htmlFor="hireDate">Hire Date</Label>
                <Input id="hireDate" type="date" required {...register("hireDate")} />
              </div>

              <div className="grid gap-2 sm:gap-3">
                <Label>Status</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {status || "Status"}
                      <ChevronDownIcon className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => setStatus("active")}>active</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setStatus("inactive")}>inactive</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Creating..." : "Create"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
