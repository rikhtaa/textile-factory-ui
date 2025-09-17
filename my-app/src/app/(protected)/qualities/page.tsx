'use client'
import React from 'react'
import { AddQuality } from '@/components/add-quality';
import { createQuality } from '@/http/api';
import { Quality } from '@/store';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
export default function QualityPage(){
   const {mutate: userMutate, isPending} = useMutation({
        mutationKey: ['quality'],
        mutationFn: createQuality, 
        onSuccess: ()=>{
          toast.success("Quality has been created");
        },
       onError: (error: any) => {
            if (error.response?.status === 409) {
            toast.error("Quality already exists");
            }else if(error.response?.data?.message.includes('E11000')){
                toast.error("This name is already registered. Please use a different name.");
            }else {
            toast.error(error.response?.data?.message || error.message || "An error occurred");
            }
        }
    })

    const handleFormData = (formData: Quality) => {
        userMutate(formData);
    };

  return (
    <div className='w-full flex items-center justify-center overflow-hidden'>
         <div className='flex flex-col gap-7 w-[85%] py-[1rem]'>
           <h2 className='text-black text-4xl font-bold'>Qualities</h2>
            <AddQuality onFormSubmit={handleFormData} isPending={isPending}/>
        </div>
         </div>
  )
}
