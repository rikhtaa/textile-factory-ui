'use client'
import { AddProduction } from '@/components/addProduction'
import { ProductionTable } from '@/components/productionTable';
import { createProduction } from '@/http/api';
import { CreateProduction } from '@/store';
import { useMutation } from '@tanstack/react-query';
import React from 'react'
import { toast } from 'sonner';

export default function Page() {

    const {mutate: userMutate, error, isSuccess, isPending} = useMutation({
        mutationKey: ['produciton'],
        mutationFn: createProduction, 
        onSuccess: ()=>{
              toast.success("User has been created");
        },
       onError: (error: any) => {
    if (error.response?.status === 409) {
      toast.error("User already exists");
    }else if(error.response?.status >= 500){
        toast.error("Internet issue please try again later");
    } else {
      toast.error(error.response?.data?.message || error.message || "An error occurred");
    }
  },
    })
  

    const handleFormData = (formData: CreateProduction) => {
            userMutate(formData);
    }
    
  return (
     <div className='w-full flex items-center justify-center overflow-hidden'>
          <div className='flex flex-col gap-7 w-[85%] py-[1rem]'>
            <h2 className='text-black text-4xl font-bold'>Production</h2>
            <AddProduction onFormSubmit={handleFormData}  onSucess={isSuccess} isPending={isPending} />
            <ProductionTable/>
         </div>
          </div>
  )
}

