'use client'
import { createLoomManagement, getAllBeams, getAllLoomManage, getAllQualities, getLooms } from "@/http/api"
import { ApiErrorResponse } from "@/store";
import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { toast } from "sonner";
import { LoomsManagement } from "@/components/loomManagementTable";
import { AddLoomManagement } from "@/components/addLoomManagement";

export default function LoomsManagementPage(){

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
     
  return(
      <div className='w-full flex items-center justify-center overflow-hidden'>
        <div className='flex flex-col gap-7 w-[85%] py-[1rem]'>
          <h2 className='text-black text-4xl font-bold'>Loom</h2>
             <AddLoomManagement
             isPending={isPending}
             beamsData={beamsData?.data || []}  
             qualitiesData={qualitiesData?.data|| []} 
             loomsData={loomsData?.data || []}
             userMutate={userMutate}
             />
              <LoomsManagement 
              loomsManageData={loomsManageData?.data || []} 
              beamsData={beamsData?.data || []}  
              qualitiesData={qualitiesData?.data|| []} 
              loomsData={loomsData?.data || []}/>
         </div>
      </div>
  )
}