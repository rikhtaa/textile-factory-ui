"use client"
import React, { useEffect, useState } from 'react'
import { WorkersTable } from '@/components/workerTable'
import { AddWorker } from '@/components/addWorker'
import { useMutation, useQuery } from "@tanstack/react-query"
import { creatWorker, getWorkers } from '../../../http/api'
import { Worker } from '@/store'
export function CreateWorker(){
    const {data: workersData, refetch} = useQuery({
        queryKey: ['workers'],
        queryFn: getWorkers,
    })

    const {mutate: userMutate} = useMutation({
        mutationKey: ['worker'],
        mutationFn: creatWorker, 
        onSuccess: ()=>{
        refetch();
        }
    })

    const handleFormData = (formData: Worker) => {
        userMutate(formData);
    };

  return (
      <div className='w-full flex items-center justify-center overflow-hidden'>
      <div className='flex flex-col gap-7 w-[85%] py-[1rem]'>
        <h2 className='text-black text-4xl font-bold'>Workers</h2>
          <AddWorker onFormSubmit={handleFormData}/>
         <WorkersTable workers={workersData?.data || []}/>   
     </div>
      </div>
  )
}

export default CreateWorker