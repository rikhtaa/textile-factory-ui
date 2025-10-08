'use client'
import { CustomCombobox } from "../../../components/customCombobox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLoomManagement, getAllBeams, getAllLoomManage, getAllQualities, getLooms } from "@/http/api"
import { ApiErrorResponse, Beam, Loom, LoomManagement, Quality } from "@/store";
import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { Controller } from "react-hook-form";
import { LoomsManagement } from "@/components/loomManagementTable";


export default function page(){
  // rhf builds the object and pass that object to handlesubmit and handlesubmit gives that object to custom function?
  const { control, register,  handleSubmit, reset } = useForm<LoomManagement>();

  const [openDropdowns, setOpenDropdowns] = useState({
    loom: false,
    beam: false,
    quality: false,
    beamDate: false
  });

  const {data: loomsManageData, refetch} = useQuery({
    queryKey:['loommanagement'],
    queryFn: getAllLoomManage
  })  
  
  const {mutate: userMutate, isPending}=useMutation({
   mutationKey: ['loommanagement'],
   mutationFn: createLoomManagement,
   onSuccess: ()=>{
    refetch()
    toast.success("Loom has been created");
   },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      if(error.response && error.response.status >= 500){
       toast.error("Internet issue please try again later");
      }else {
      toast.error(error.response?.data?.message || error.message || "An error occurred");
      }
}
  })

  const {data: loomsData} = useQuery({
    queryKey: ['loom'],
    queryFn: getLooms,
  })

  
  const {data: beamsData}= useQuery({
    queryKey:['beam'],
    queryFn: getAllBeams,
  })
     
  const {data: qualitiesData} = useQuery({
   queryKey: ['quaility'],
   queryFn: getAllQualities
  })
     

  const onSubmitHandler = async(formData: LoomManagement)=>{
    userMutate(formData)
    reset()
  }
  return(
      <div className='w-full flex items-center justify-center overflow-hidden'>
        <div className='flex flex-col gap-7 w-[85%] py-[1rem]'>
          <h2 className='text-black text-4xl font-bold'>Loom</h2>
             <div className="flex flex-col gap-6 sm:gap-6">
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
                           items={loomsData?.data?.map((loom: Loom) => ({value: loom._id, label: loom.loomNumber}))}
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
                           items={beamsData?.data?.map((beam: Beam) => ({value: beam._id, label: beam.beamNumber}))}
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
                           items={qualitiesData?.data?.map((quality: Quality) => ({value: quality._id, label: quality.name}))}
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
              <LoomsManagement 
              loomsManageData={loomsManageData?.data || []} 
              beamsData={beamsData?.data || []}  
              qualitiesData={qualitiesData?.data|| []} 
              loomsData={loomsData?.data || []}/>
         </div>
      </div>
  )
}