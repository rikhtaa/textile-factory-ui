"use client"
import React, { useState } from 'react'
import { WorkersTable } from '@/components/workerTable'
import { AddWorker } from '@/components/addWorker'
import { useMutation } from "@tanstack/react-query"
import { creatWorker } from '../../../http/api'
import { Worker } from '@/store'
export function CreateWorker(){
    const [workers, setWorkers] = useState<any[]>([]); 

    const {mutate: userMutate} = useMutation({
        mutationKey: ['worker'],
        mutationFn: creatWorker, 
        onSuccess: (response)=>{
      if (response.data) {
        setWorkers(prevWorkers => [...prevWorkers, response.data]);
      }
        }
    })

    const handleFormData = (formData: Worker) => {
        userMutate(formData);
        setWorkers(prevWorkers => [...prevWorkers, formData]); 
    };

  return (
      <div className='w-full flex items-center justify-center overflow-hidden'>
      <div className='flex flex-col gap-7 w-[85%] py-[1rem]'>
        <h2 className='text-black text-4xl font-bold'>Workers</h2>
          <AddWorker onFormSubmit={handleFormData}/>
         <WorkersTable workers={workers}/>   
     </div>
      </div>
  )
}

export default CreateWorker