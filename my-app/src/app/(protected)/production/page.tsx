'use client'
import { AddProduction } from '@/components/addProduction'
import { FilterType, ProductionTable } from '@/components/productionTable';
import { createProduction, getListProduction } from '@/http/api';
import { ApiErrorResponse, CreateProduction } from '@/store';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useState } from 'react'
import { toast } from 'sonner';
export default function Page() {
  const [filters, setFilters] = useState<FilterType>({
      date: "",
      loomId: "",
      factoryId: "",
      operatorId: ""
    })
  const {mutate: userMutate, error, isSuccess, isPending} = useMutation({
      mutationKey: ['produciton'],
      mutationFn: createProduction, 
      onSuccess: ()=>{
           refetch()
            toast.success("User has been created");
      },
     onError: (error: AxiosError<ApiErrorResponse>) => {
      if (error.response) {
       const { data } = error.response;
       const errorMessage = data?.message || error.message || "An error occurred";
       if (error.response?.status === 409) {
         toast.error("This operator, loom, and quality combination already exists for this date. Please change one of them.");
        }else if (error.code === 'NETWORK_ERROR' || !error.response) {
          toast.error("Network issue - please check your connection");
          return;
        }else {
          toast.error(errorMessage + ' Use another beam.' || "An error occurred");
        }
      }
},
  })
    const { data: productionData, isLoading, refetch } = useQuery({
      queryKey: ['production', filters],
      queryFn: () => getListProduction(filters)
    })

  

    const handleFormData = (formData: CreateProduction) => {
    userMutate(formData);
    }
    
  return (
     <div className='w-full flex items-center justify-center overflow-hidden'>
          <div className='flex flex-col gap-7 w-[85%] py-[1rem]'>
            <h2 className='text-black text-4xl font-bold'>Production</h2>
            <AddProduction onFormSubmit={handleFormData}  onSucess={isSuccess} isPending={isPending} />
            <ProductionTable 
            filters={filters}
            setFilters={setFilters}
            productionData={productionData?.data || []} 
            isLoading={isLoading}
            error={error} />
         </div>
          </div>
  )
}

