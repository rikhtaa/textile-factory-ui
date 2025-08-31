'use client'
import { AddProduction } from '@/components/addProduction'
import { AddBulkProduction } from '@/components/addProductionBulk';
import { ProductionTable } from '@/components/productionTable';
import { createProduction, createProductionBulk } from '@/http/api';
import { BulkProductionImport, CreateProduction } from '@/store';
import { useMutation } from '@tanstack/react-query';
import React from 'react'

export default function Page() {

    const {mutate: userMutate} = useMutation({
        mutationKey: ['produciton'],
        mutationFn: createProduction, 
    })
   
    const { mutate: bulkImportMutation } = useMutation({
  mutationFn: createProductionBulk,
  onSuccess: () => {
    console.log("Bulk import successful")
  }
})

const handleBulkImport = (data: BulkProductionImport) => {
  bulkImportMutation(data)
}

    const handleFormData = (formData: CreateProduction) => {
            userMutate(formData);
    }
    
  return (
     <div className='w-full flex items-center justify-center overflow-hidden'>
          <div className='flex flex-col gap-7 w-[85%] py-[1rem]'>
            <h2 className='text-black text-4xl font-bold'>Production</h2>
            <AddProduction onFormSubmit={handleFormData} />
            <AddBulkProduction onBulkImport={handleBulkImport} />
            <ProductionTable/>
         </div>
          </div>
  )
}

