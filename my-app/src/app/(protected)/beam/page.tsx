"use client"
import { AddBeam } from "@/components/addBeam";
import { createBeam } from "@/http/api";
import { Beam } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
export default function Page() {
        const {mutate: userMutate, isPending} = useMutation({
        mutationKey: ['Beam'],
        mutationFn: createBeam, 
        onSuccess: ()=>{
            toast.success("Beam has been created");
        },
       onError: (error: any) => {
            if (error.response?.status === 409) {
            toast.error("Beam already exists");
            }else if (error.response?.status === 403) {
             toast.error("Only admin and manager can create Beam.");
            }else if(error.response?.data?.message.includes('E11000')){
               toast.error("This Beam Number is already registered. Please use a different Beam Number.");
            }else if(error.response?.status >= 500){
              toast.error("Internet issue please try again later");
            } else {
            toast.error(error.response?.data?.message || error.message || "An error occurred");
            }
        }
    })

    const handleFormData = (formData: Beam) => {
        userMutate(formData);
    };
  return (
    <div className='w-full flex items-center justify-center overflow-hidden'>
    <div className='flex flex-col gap-7 w-[85%] py-[1rem]'>
    <h2 className='text-black text-4xl font-bold'>Beams</h2>
     <AddBeam  onFormSubmit={handleFormData} isPending={isPending}/>
    </div>
    </div>
  )
}
