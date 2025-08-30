'use client'
import React from 'react'
import { createLoom, createQuality } from '@/http/api';
import { Loom, Quality } from '@/store';
import { useMutation } from '@tanstack/react-query';
import { AddLoom } from '@/components/addLoom';
export default function LoomsPage(){
   const {mutate: userMutate} = useMutation({
        mutationKey: ['loom'],
        mutationFn: createLoom, 
        onSuccess: ()=>{
        console.log("created Loom")
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
            </div>
             </div>
    
  )
}

