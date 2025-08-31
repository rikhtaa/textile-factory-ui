'use client'
import { AddProduction } from '@/components/addProduction'
import { createProduction } from '@/http/api';
import { CreateProduction } from '@/store';
import { useMutation } from '@tanstack/react-query';
import React from 'react'

export default function Page() {

    const {mutate: userMutate} = useMutation({
        mutationKey: ['produciton'],
        mutationFn: createProduction, 
    })

    const handleFormData = (formData: CreateProduction) => {
            userMutate(formData);
    }
    
  return (
     <div className='w-full flex items-center justify-center overflow-hidden'>
          <div className='flex flex-col gap-7 w-[85%] py-[1rem]'>
            <h2 className='text-black text-4xl font-bold'>Production</h2>
            <AddProduction onFormSubmit={handleFormData} />
         </div>
          </div>
  )
}

