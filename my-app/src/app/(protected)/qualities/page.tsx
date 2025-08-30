'use client'
import React from 'react'
import { AddQuality } from '@/components/add-quality';
import { createQuality } from '@/http/api';
import { Quality } from '@/store';
import { useMutation } from '@tanstack/react-query';
export default function QualityPage(){
   const {mutate: userMutate} = useMutation({
        mutationKey: ['quality'],
        mutationFn: createQuality, 
        onSuccess: ()=>{
        console.log("created quality")
        }
    })

    const handleFormData = (formData: Quality) => {
        userMutate(formData);
    };

  return (
    <div className='w-full flex items-center justify-center overflow-hidden'>
         <div className='flex flex-col gap-7 w-[85%] py-[1rem]'>
           <h2 className='text-black text-4xl font-bold'>Qualities</h2>
            <AddQuality onFormSubmit={handleFormData}/>
        </div>
         </div>
  )
}
