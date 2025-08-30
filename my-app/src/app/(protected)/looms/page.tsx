'use client'
import React from 'react'
import { createLoom, getLooms } from '@/http/api';
import { Loom } from '@/store';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AddLoom } from '@/components/addLoom';
import { LoomTable } from '@/components/LoomTable';
export default function LoomsPage(){
     const {data: loomsData, refetch} = useQuery({
        queryKey: ['looms'],
        queryFn: getLooms,
    })

   const {mutate: userMutate} = useMutation({
        mutationKey: ['loom'],
        mutationFn: createLoom, 
        onSuccess: ()=>{
        refetch();
        }
    })

    const handleFormData = (formData: Loom) => {
        userMutate(formData);
    };

return (
        <div className='w-full flex items-center justify-center overflow-hidden'>
             <div className='flex flex-col gap-7 w-[85%] py-[1rem]'>
               <h2 className='text-black text-4xl font-bold'>Qualities</h2>
                <AddLoom onFormSubmit={handleFormData}/>
                <LoomTable  looms={loomsData?.data || []}/>
            </div>
             </div>
    
  )
}

