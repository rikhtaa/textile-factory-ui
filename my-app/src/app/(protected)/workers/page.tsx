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
        onSuccess: ()=>{
          console.log('create Worker successfully')
        }
    })

    const handleFormData = (formData: Worker) => {
        console.log('New worker:', formData);
        
        // Call mutate here with the form data
        userMutate(formData);
        
        // Optional: Update local state immediately (optimistic update)
        setWorkers(prevWorkers => [...prevWorkers, formData]); 
    };

  return (
      <div className='w-full flex items-center justify-center overflow-hidden'>
      <div className='flex flex-col gap-7 w-[85%] py-[1rem]'>
        <h2 className='text-black text-4xl font-bold'>Workers</h2>
          <AddWorker onFormSubmit={handleFormData}/>
          {/* Pass the workers data to WorkersTable */}
         <WorkersTable workers={workers}/>   
     </div>
      </div>
  )
}

export default CreateWorker