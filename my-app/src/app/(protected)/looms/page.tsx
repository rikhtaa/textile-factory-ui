'use client'
import React from 'react'
import { createLoom, getLooms } from '@/http/api';
import { Loom } from '@/store';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AddLoom } from '@/components/addLoom';
import { LoomTable } from '@/components/LoomTable';
import { toast } from 'sonner';
export default function LoomsPage(){
     const {data: loomsData, refetch} = useQuery({
        queryKey: ['looms'],
        queryFn: getLooms,
    })

   const {mutate: userMutate, isPending} = useMutation({
        mutationKey: ['loom'],
        mutationFn: createLoom, 
        onSuccess: ()=>{
            refetch();
            toast.success("Loom has been created");
        },
       onError: (error: any) => {
            if (error.response?.status === 409) {
            toast.error("Loom already exists");
            }else if(error.response?.data?.message.includes('E11000')){
                toast.error("This Loom is already registered. Please use a different Loom Number.");
            }else {
            toast.error(error.response?.data?.message || error.message || "An error occurred");
            }
        }
    })

    const handleFormData = (formData: Loom) => {
        userMutate(formData);
    };

return (
        <div className='w-full flex items-center justify-center overflow-hidden'>
             <div className='flex flex-col gap-7 w-[85%] py-[1rem]'>
               <h2 className='text-black text-4xl font-bold'>Looms</h2>
                <AddLoom onFormSubmit={handleFormData}  isPending={isPending}/>
                <LoomTable  looms={loomsData?.data || []}/>
            </div>
             </div>
    
  )
}

