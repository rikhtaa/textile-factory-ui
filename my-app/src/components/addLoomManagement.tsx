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
import { Beam, Loom, LoomManagement, Quality } from "@/store"
import { Toaster } from "./ui/sonner"
import { CustomCombobox } from "./customCombobox"
import { Controller, useForm } from "react-hook-form"


interface AddLoomProps extends React.ComponentProps<"div"> {
  onFormSubmit?: (formData: Loom) => void;
  isPending: boolean | undefined
  onSubmitHandler: (formData: LoomManagement)=> void
  beamsData: Beam[]
  qualitiesData: Quality[]
  loomsData: Loom[] 
}

export function AddLoomManagement({
  className,
  onFormSubmit,
  isPending, 
  onSubmitHandler,
  beamsData,
  qualitiesData,
  loomsData,
  ...props
}: AddLoomProps){
    // rhf builds the object and pass that object to handlesubmit and handlesubmit gives that object to custom function?
  const { control, register,  handleSubmit } = useForm<LoomManagement>();

  const [openDropdowns, setOpenDropdowns] = useState({
    loom: false,
    beam: false,
    quality: false,
    beamDate: false
  }); 

  return (
    <div className={cn("flex flex-col gap-6 sm:gap-6", className)} {...props}>
       <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Add Beam and Quality</CardTitle>
                 <Toaster />
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6">
                    <form  className="w-full" onSubmit={handleSubmit(onSubmitHandler)}>
                      <div className="flex flex-col gap-4 sm:gap-6 w-full md:w-[80%] lg:w-[60%] xl:w-[50%]">
                       <div className="grid gap-2 sm:gap-3">
                        <Controller 
                          name="loom"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                          <CustomCombobox
                           value={field.value}
                           onValueChange={field.onChange}
                           items={loomsData?.map((loom: Loom) => ({value: loom._id, label: loom.loomNumber}))}
                           placeholder="Select Loom"
                           open={openDropdowns.loom}
                           onOpenChange={(open) => setOpenDropdowns(prev => ({ ...prev, loom: open }))}
                          />
                          )}
                        />
                      </div>

                       <div className="grid gap-2 sm:gap-3">
                        <Controller 
                          name="beam"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                          <CustomCombobox
                           value={field.value}
                           onValueChange={field.onChange}
                           items={beamsData?.map((beam: Beam) => ({value: beam._id, label: beam.beamNumber}))}
                           placeholder="Select Beam"
                           open={openDropdowns.beam}
                           onOpenChange={(open) => setOpenDropdowns(prev => ({ ...prev, beam: open }))}
                          />
                          )}
                        />
                      </div>
                       <div className="grid gap-2 sm:gap-3">
                        <Controller 
                          name="quality"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                          <CustomCombobox
                           value={field.value}
                           onValueChange={field.onChange}
                           items={qualitiesData?.map((quality: Quality) => ({value: quality._id, label: quality.name}))}
                           placeholder="Select Quality"
                           open={openDropdowns.quality}
                           onOpenChange={(open) => setOpenDropdowns(prev => ({ ...prev, quality: open }))}
                          />
                          )}
                        />
                      </div>
                       <div className="grid gap-2 sm:gap-3">
                         <Label htmlFor="beamDate">Beam Date</Label>
                         <Input id="beamDate" type="date" required {...register("beamDate")} />
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
  )
}